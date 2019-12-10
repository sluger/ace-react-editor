/**
 * This file provides the custom language mode for PrestoSQL for the ace editor.
 *
 * @author Stefan Luger
 */
import * as ace from 'ace-builds';

/**
 * Custom ace mode for the PrestoSQL language.
 *
 * @see https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode
 */
export default class PrestoSqlMode extends ace.require('ace/mode/text').Mode {
    constructor() {
        super();
        this.HighlightRules = PrestoSqlHighlightRules;
    }
}

/**
 * This class provides the rules to highlight keywords, comments, strings and numbers for the PrestoSQL language.
 *
 * @see https://docs.aws.amazon.com/athena/latest/ug/ddl-sql-reference.html
 */
class PrestoSqlHighlightRules extends ace.require("ace/mode/text_highlight_rules").TextHighlightRules {
    constructor() {
        super();

        const keywords = (
            "with|select|all|distinct|from|where|group by|having|union|intersect|order by|asc|desc|offset|" +
            "row|rows|limit|fetch|next|only|with ties|on|join|inner join|left join|left outer join|" +
            "right join|right outer join|full join|full outer join|cross join|grouping sets|cube|rollup|" +
            "as|in|null|nulls|values|tablesample|bernoulli|system|unnest|array|map|ordinality|lateral" +
            ""
        );

        const builtinConstants = (
            "null|true|false|and|or|not"
        );

        const builtinFunctions = (
            "cast|case|end|if|else|then|when|coalesce|nullif|try"
        );

        const dataTypes = (
            "boolean|tinyint|smallint|integer|bigint|real|double|decimal|varchar|char|varbinary|json|date|time|timestamp|interval|array|map|row"
        );

        const keywordMapper = this.createKeywordMapper({
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
