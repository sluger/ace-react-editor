import React from 'react';
import './App.css';
import { AceEditor, IAceEditorOptions } from './AceEditor';

const App: React.FC = () => {
  const code = `SELECT t.id, t.name, t.amount 
  FROM transactions t 
  WHERE t.id > 5000`;

  const options: IAceEditorOptions = {
    minLines: 25,
    maxLines: 50,
    enableBasicAutocompletion: true,
    mode: 'ace/mode/sql',
    theme: 'ace/theme/eclipse',
    showPrintMargin: false
  }

  return (<React.Fragment>
    <h1>Brace yourself</h1>
    <div className="App"><AceEditor code={code} options={options} /></div>
  </React.Fragment>
  );
}

export default App;
