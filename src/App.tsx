import React from 'react';
import './App.css';
import { AceEditor, IAceEditorOptions, IAceEditorProps } from './AceEditor';
import PrestoSqlMode from './PrestoSqlMode';
import * as ace from 'ace-builds';

/**
 * Mock schema API call with delay.
 */
function fetchSchemaMock(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => resolve(['customer', 'customeraddress', 'tenantentity']), 200);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Example using ace editor with custom language and completers.
 */
export default class App extends React.Component {

  private completers: ace.Ace.Completer[] = [];

  private readonly value = `SELECT t.id, t.name, t.amount 
    FROM transactions t 
    WHERE t.id > 5000`;

  private readonly options: IAceEditorOptions = {
    mode: 'ace/mode/prestosql',
    theme: 'ace/theme/eclipse',
    enableBasicAutocompletion: true,
    minLines: 25,
    maxLines: 50,
    showPrintMargin: false
  }

  private readonly customMode = new PrestoSqlMode();

  componentDidMount() {
    fetchSchemaMock().then((res) => {
      this.completers = [
        App.getUpperCaseCompleter(),
        App.getSchemaCompleter(res),
        App.getTextCompleter()];
      this.forceUpdate();
    });
  }

  render() {
    const props: IAceEditorProps = {
      value: this.value,
      options: this.options,
      customMode: this.customMode,
      completers: this.completers
    };

    return <React.Fragment>
      <h1>Ace Editor</h1>
      <div className="App"><AceEditor {...props} /></div>
    </React.Fragment>;
  }

  /**
   * Transform suggested keywords in upper case.
   */
  private static getUpperCaseCompleter() {
    return {
      getCompletions: (editor: ace.Ace.Editor, session: ace.Ace.EditSession, pos: ace.Ace.Point, prefix: string, callback: ace.Ace.CompleterCallback) => {
        const state = editor.session.getState(pos.row);
        let keywordCompletions = (session as any).$mode.getCompletions(state, session, pos, prefix);
        keywordCompletions = keywordCompletions.map((obj: ace.Ace.Completion) => {
          return Object.assign(obj, { value: obj.value.toUpperCase() });
        });
        return callback(null, keywordCompletions);
      }
    }
  }

  /**
   * Analytics schema derived completer which suggests exported tables and columns.
   */
  private static getSchemaCompleter(schema: string[]): ace.Ace.Completer {
    // TODO: refactor schema into data structure { table: {name: string, columns: string[]}}[]
    return {
      getCompletions: (editor: ace.Ace.Editor, session: ace.Ace.EditSession, pos: ace.Ace.Point, prefix: string, callback: ace.Ace.CompleterCallback) => {
        const schemaCompletions: ace.Ace.Completion[] = schema.map((t) => ({ meta: 'schema', value: t, score: 0 }));
        return callback(null, schemaCompletions);
      }
    }
  }

  /**
   * Existing ace completer for recognizing existing tokens within the editor.
   */
  private static getTextCompleter() {
    return ace.require('ace/ext/language_tools').textCompleter;
  }
}
