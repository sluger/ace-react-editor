import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ace from 'ace-builds';
import PrestoSqlMode from './PrestoSqlMode';

import 'ace-builds/src-noconflict/theme-eclipse';
import 'ace-builds/src-noconflict/ext-language_tools';


export interface IAceEditorOptions {
    minLines: number;
    maxLines: number;
    enableBasicAutocompletion: boolean;
    mode: string;
    theme: string;
    showPrintMargin: boolean;
}

interface IAceEditorProps {
    code: string;
    options?: Partial<IAceEditorOptions>;
}

export class AceEditor extends React.Component<IAceEditorProps, {}> {
    private aceRef: any;

    private options: Partial<IAceEditorOptions> = {};

    private readonly defaultOptions: IAceEditorOptions = {
        minLines: 10,
        maxLines: 20,
        enableBasicAutocompletion: false,
        mode: 'ace/mode/text',
        theme: 'ace/theme/eclipse',
        showPrintMargin: false
    }

    constructor(props: IAceEditorProps) {
        super(props);
        this.aceRef = null;
        Object.assign(this.options, this.defaultOptions, this.props.options);
    }

    componentDidMount() {
        const node = ReactDOM.findDOMNode(this.aceRef) as HTMLDivElement;
        const editor = ace.edit(node, this.options);
        const prestoSqlMode = new PrestoSqlMode();
        editor.getSession().setMode(prestoSqlMode as ace.Ace.SyntaxMode);

        const customKeyWordCompleter = {
            getCompletions(editor: ace.Ace.Editor, session: ace.Ace.EditSession, pos: ace.Ace.Point, prefix: string, callback: ace.Ace.CompleterCallback) {
                const state = editor.session.getState(pos.row);
                let keywordCompletions = (session as any).$mode.getCompletions(state, session, pos, prefix);
                keywordCompletions = keywordCompletions.map((obj: ace.Ace.Completion) => {
                    return Object.assign(obj, { value: obj.value.toUpperCase() });
                });
                return callback(null, keywordCompletions);
            },
        };

        // TODO: quite the dirty solution
        // replace lowercase keywords completer with custom uppercase completer
        editor.completers[2] = customKeyWordCompleter;
    }

    render() {
        return <div ref={(elem) => this.aceRef = elem}>{this.props.code}</div>;
    }
}
