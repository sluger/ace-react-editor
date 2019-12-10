/**
 * @author Stefan Luger
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ace from 'ace-builds';
import { bind } from 'decko';

import 'ace-builds/src-noconflict/theme-eclipse';
import 'ace-builds/src-noconflict/ext-language_tools';


export interface IAceEditorOptions extends Partial<ace.Ace.EditorOptions> {

    /**
     * Enable auto completion via the language tools.
     */
    enableBasicAutocompletion?: boolean;
}

export interface IAceEditorProps {
    /**
     * Code snippet or just text the editor is loaded with initially.
     */
    value: string;

    /**
     * Core ace configuration options including language tools.
     * 
     * @see https://github.com/ajaxorg/ace/wiki/Configuring-Ace
     */
    options?: IAceEditorOptions;

    /**
     * Set a custom mode via object.
     */
    customMode: ace.Ace.SyntaxMode | any;

    /**
     * An array of autocompletions.
     */
    completers: ace.Ace.Completer[];
}

/**
 * Ace editor wrapper which has a reference to the parent HTML element of the editor. 
 * It sets the custom language mode as well as registers completers.
 */
export class AceEditor extends React.Component<IAceEditorProps> {

    /**
     * Ace editor HTML reference.
     */
    private aceRef: HTMLDivElement | null = null;

    /**
     * Ace editor options.
     */
    private options: Partial<IAceEditorOptions> = {};

    /**
     * Ace editor default options.
     */
    private readonly defaultOptions: IAceEditorOptions = {
        enableBasicAutocompletion: false
    }

    constructor(props: IAceEditorProps) {
        super(props);

        // override default with actual options
        Object.assign(this.options, this.defaultOptions, this.props.options);

        // do not register custom mode in ace
        if (this.options != null && this.options.mode === 'ace/mode/prestosql') {
            this.options.mode = undefined;
        }
    }

    componentDidMount() {
        // propagate to update logic
        this.componentDidUpdate(this.props);
    }

    /**
     * Retrieve parent HTML node for adding the editor.
     */
    componentDidUpdate(props: IAceEditorProps) {
        const node = ReactDOM.findDOMNode(this.aceRef) as HTMLDivElement;
        const editor = ace.edit(node, this.options);
        if (props.customMode != null) {
            this.registerCustomMode(editor);
        }
    }

    render() {
        return <div ref={(elem) => this.aceRef = elem}>{this.props.value}</div>;
    }

    /**
     * Register custom mode and completers.
     */
    @bind
    private registerCustomMode(editor: ace.Ace.Editor) {
        const { customMode, completers } = this.props;
        editor.getSession().setMode(customMode as ace.Ace.SyntaxMode);
        if (this.options.enableBasicAutocompletion) {
            editor.completers.length = 0;
            editor.completers.push(...completers);
        }
    }
}
