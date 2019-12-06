import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-sql';
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

export class CustomHighlightRules extends ace.require("ace/mode/text_highlight_rules").TextHighlightRules {
    constructor() {
        super();

        // TODO: define prestosql allowed keywords
        var keywords = (
            "select|from|where|and|or|group|by|order|limit|offset|having|as|case|" +
            "when|then|else|end|type|left|right|join|on|outer|desc|asc|union|create|table|primary|key|if|" +
            "foreign|not|references|default|null|inner|cross|natural|database|drop|grant"
        );

        // TODO: ...
        var builtinConstants = (
            "true|false"
        );

        // TODO: ...
        var builtinFunctions = (
            "AVG|COUNT|FIRST|last|max|min|sum|ucase|lcase|mid|len|round|rank|now|format|" +
            "coalesce|ifnull|isnull|nvl"
        );

        // TODO: ...
        var dataTypes = (
            "int|numeric|decimal|date|varchar|char|bigint|float|double|bit|binary|text|set|timestamp|" +
            "money|real|number|integer"
        );

        var keywordMapper = this.createKeywordMapper({
            "support.function": builtinFunctions,
            "keyword": keywords,
            "constant.language": builtinConstants,
            "storage.type": dataTypes,
        }, "identifier", true);

        this.$rules = {
            "start": [{
                token: "comment",
                regex: "--.*$"
            }, {
                token: "comment",
                start: "/\\*",
                end: "\\*/"
            }, {
                token: "string",           // " string
                regex: '".*?"'
            }, {
                token: "string",           // ' string
                regex: "'.*?'"
            }, {
                token: "string",           // ` string (apache drill)
                regex: "`.*?`"
            }, {
                token: "constant.numeric", // float
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token: keywordMapper,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token: "keyword.operator",
                regex: "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
            }, {
                token: "paren.lparen",
                regex: "[\\(]"
            }, {
                token: "paren.rparen",
                regex: "[\\)]"
            }, {
                token: "text",
                regex: "\\s+"
            }]
        };
    }
}
export default class CustomSqlMode extends ace.require('ace/mode/text').Mode {
    constructor() {
        super();
        this.HighlightRules = CustomHighlightRules;
    }
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
        const customMode = new CustomSqlMode();
        editor.getSession().setMode(customMode as ace.Ace.SyntaxMode);

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

        // replace lowercase completer with custom uppercase completer
        editor.completers[2] = customKeyWordCompleter;
    }

    render() {
        return <div ref={(elem) => this.aceRef = elem}>{this.props.code}</div>;
    }
}
