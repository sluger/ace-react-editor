import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Ace from 'brace';

import 'brace/mode/sql';
import 'brace/theme/eclipse';
import 'brace/ext/language_tools';

export interface AceEditorOptions {
    minLines: number;
    maxLines: number;
    enableBasicAutocompletion: boolean;
}

interface AceEditorProps {
    code: string;
    options?: Partial<AceEditorOptions>;
}

export class AceEditor extends React.Component<AceEditorProps, {}> {
    private aceRef: any;
    private options: Partial<AceEditorOptions> = {};
    
    constructor(props: AceEditorProps) {
        super(props);
        this.aceRef = null;

        const defaultOptions: AceEditorOptions = {
            minLines: 10,
            maxLines: 20,
            enableBasicAutocompletion: false
        }

        Object.assign(this.options, defaultOptions, this.props.options);
    }

    componentDidMount() {
        const node = ReactDOM.findDOMNode(this.aceRef) as HTMLDivElement;
        const editor = Ace.edit(node);

        editor.getSession().setMode('ace/mode/sql');
        editor.setTheme('ace/theme/eclipse');
        editor.setShowPrintMargin(false);

        Object.entries(this.options).forEach((v: any[]) => {
            editor.setOption(v[0], v[1]);
        }); 
        
        //editor.setOptions(flatOptions);
    }

    render() {
        return <div ref={(elem) => this.aceRef = elem}>{this.props.code}</div>;
    }
}