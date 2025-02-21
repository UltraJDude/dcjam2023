// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var number: any;
declare var sqstring: any;
declare var dqstring: any;
declare var word: any;
declare var ws: any;
declare var comment: any;

const always = <T>(value: T) => () => value;
const val = ([tok]: NearleyToken[]) => tok.value;

const trace = <T>(name: string, fn: (...args: any[]) => T) => (...args: any[]) => {
  const result = fn(...args);
  console.log('(trace)', name, args, '=', result);
  return result;
}

import Lexer from './Lexer';
const lexer = new Lexer();

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "document", "symbols": ["_", "program"], "postprocess": ([,prog]) => prog},
    {"name": "program$ebnf$1", "symbols": []},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "declp"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "program", "symbols": ["program$ebnf$1"], "postprocess": id},
    {"name": "declp", "symbols": ["decl", "_"], "postprocess": id},
    {"name": "decl", "symbols": ["stmt"], "postprocess": id},
    {"name": "stmt", "symbols": ["assignment"], "postprocess": id},
    {"name": "stmt", "symbols": ["call"], "postprocess": id},
    {"name": "stmt", "symbols": ["function_def"], "postprocess": id},
    {"name": "stmt", "symbols": ["if_stmt"], "postprocess": id},
    {"name": "stmt", "symbols": ["return_stmt"], "postprocess": id},
    {"name": "assignment", "symbols": ["name", "_", "assignop", "_", "expr"], "postprocess": ([name,,op,,expr]) => ({ _: 'assignment', name, op, expr })},
    {"name": "assignop", "symbols": [{"literal":"="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"+="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"-="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"*="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"/="}], "postprocess": val},
    {"name": "assignop", "symbols": [{"literal":"^="}], "postprocess": val},
    {"name": "function_def$ebnf$1", "symbols": ["function_type_clause"], "postprocess": id},
    {"name": "function_def$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "function_def", "symbols": [{"literal":"function"}, "__", "name", {"literal":"("}, "function_args", {"literal":")"}, "function_def$ebnf$1", "document", "__", {"literal":"end"}], "postprocess": ([,,name,,args,,type,program]) => ({ _: 'function', name, args, type, program })},
    {"name": "function_type_clause", "symbols": [{"literal":":"}, "_", "vtype"], "postprocess": ([,,type]) => type},
    {"name": "function_args", "symbols": [], "postprocess": always([])},
    {"name": "function_args", "symbols": ["name_with_type"]},
    {"name": "function_args", "symbols": ["function_args", "_", {"literal":","}, "_", "name_with_type"], "postprocess": ([list,,,,value]) => list.concat([value])},
    {"name": "if_stmt$ebnf$1", "symbols": ["else_clause"], "postprocess": id},
    {"name": "if_stmt$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "if_stmt", "symbols": [{"literal":"if"}, "__", "expr", "__", {"literal":"then"}, "document", "if_stmt$ebnf$1", "__", {"literal":"end"}], "postprocess": ([,,expr,,,positive,negative]) => ({ _: 'if', expr, positive, negative })},
    {"name": "else_clause", "symbols": ["__", {"literal":"else"}, "document"], "postprocess": ([,,clause]) => clause},
    {"name": "return_stmt$ebnf$1$subexpression$1", "symbols": ["__", "expr"], "postprocess": ([,expr]) => expr},
    {"name": "return_stmt$ebnf$1", "symbols": ["return_stmt$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "return_stmt$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "return_stmt", "symbols": [{"literal":"return"}, "return_stmt$ebnf$1"], "postprocess": ([,expr]) => ({ _: 'return', expr })},
    {"name": "expr", "symbols": ["maths"], "postprocess": id},
    {"name": "maths", "symbols": ["logic"], "postprocess": id},
    {"name": "logic", "symbols": ["logic", "_", "logicop", "_", "boolean"], "postprocess": ([left,,op,,right]) => ({ _: 'binary', left, op, right })},
    {"name": "logic", "symbols": ["boolean"], "postprocess": id},
    {"name": "boolean", "symbols": ["boolean", "_", "boolop", "_", "sum"], "postprocess": ([left,,op,,right]) => ({ _: 'binary', left, op, right })},
    {"name": "boolean", "symbols": ["sum"], "postprocess": id},
    {"name": "sum", "symbols": ["sum", "_", "sumop", "_", "product"], "postprocess": ([left,,op,,right]) => ({ _: 'binary', left, op, right })},
    {"name": "sum", "symbols": ["product"], "postprocess": id},
    {"name": "product", "symbols": ["product", "_", "mulop", "_", "exp"], "postprocess": ([left,,op,,right]) => ({ _: 'binary', left, op, right })},
    {"name": "product", "symbols": ["exp"], "postprocess": id},
    {"name": "exp", "symbols": ["unary", "_", "expop", "_", "exp"], "postprocess": ([left,,op,,right]) => ({ _: 'binary', left, op, right })},
    {"name": "exp", "symbols": ["unary"], "postprocess": id},
    {"name": "unary", "symbols": [{"literal":"-"}, "value"], "postprocess": ([op,value]) => ({ _: 'unary', op: op.value, value })},
    {"name": "unary", "symbols": [{"literal":"not"}, "_", "value"], "postprocess": ([op,,value]) => ({ _: 'unary', op: op.value, value })},
    {"name": "unary", "symbols": ["value"], "postprocess": id},
    {"name": "logicop", "symbols": [{"literal":"and"}], "postprocess": val},
    {"name": "logicop", "symbols": [{"literal":"or"}], "postprocess": val},
    {"name": "logicop", "symbols": [{"literal":"xor"}], "postprocess": val},
    {"name": "boolop", "symbols": [{"literal":">"}], "postprocess": val},
    {"name": "boolop", "symbols": [{"literal":">="}], "postprocess": val},
    {"name": "boolop", "symbols": [{"literal":"<"}], "postprocess": val},
    {"name": "boolop", "symbols": [{"literal":"<="}], "postprocess": val},
    {"name": "boolop", "symbols": [{"literal":"=="}], "postprocess": val},
    {"name": "boolop", "symbols": [{"literal":"!="}], "postprocess": val},
    {"name": "sumop", "symbols": [{"literal":"+"}], "postprocess": val},
    {"name": "sumop", "symbols": [{"literal":"-"}], "postprocess": val},
    {"name": "mulop", "symbols": [{"literal":"*"}], "postprocess": val},
    {"name": "mulop", "symbols": [{"literal":"/"}], "postprocess": val},
    {"name": "expop", "symbols": [{"literal":"^"}], "postprocess": val},
    {"name": "value", "symbols": ["literal_number"], "postprocess": id},
    {"name": "value", "symbols": ["literal_boolean"], "postprocess": id},
    {"name": "value", "symbols": ["literal_string"], "postprocess": id},
    {"name": "value", "symbols": ["name"], "postprocess": id},
    {"name": "value", "symbols": ["call"], "postprocess": id},
    {"name": "call", "symbols": ["name", {"literal":"("}, "call_args", {"literal":")"}], "postprocess": ([fn,,args]) => ({ _:'call', fn, args })},
    {"name": "call_args", "symbols": [], "postprocess": always([])},
    {"name": "call_args", "symbols": ["expr"]},
    {"name": "call_args", "symbols": ["call_args", "_", {"literal":","}, "_", "expr"], "postprocess": ([list,,,,value]) => list.concat([value])},
    {"name": "literal_number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([tok]) => ({ _: 'number', value: Number(tok.value) })},
    {"name": "literal_number", "symbols": [(lexer.has("number") ? {type: "number"} : number), {"literal":"."}, (lexer.has("number") ? {type: "number"} : number)], "postprocess": ([whole,,frac]) => ({ _: 'number', value: Number(whole.value + '.' + frac.value)})},
    {"name": "literal_boolean", "symbols": [{"literal":"true"}], "postprocess": always({ _: 'bool', value: true })},
    {"name": "literal_boolean", "symbols": [{"literal":"false"}], "postprocess": always({ _: 'bool', value: false })},
    {"name": "literal_string", "symbols": [(lexer.has("sqstring") ? {type: "sqstring"} : sqstring)], "postprocess": ([tok]) => ({ _: 'string', value: tok.value.slice(1, -1) })},
    {"name": "literal_string", "symbols": [(lexer.has("dqstring") ? {type: "dqstring"} : dqstring)], "postprocess": ([tok]) => ({ _: 'string', value: tok.value.slice(1, -1) })},
    {"name": "name_with_type", "symbols": ["name", {"literal":":"}, "_", "vtype"], "postprocess": ([name,,,type]) => ({ _: 'arg', type, name })},
    {"name": "vtype", "symbols": [{"literal":"any"}], "postprocess": val},
    {"name": "vtype", "symbols": [{"literal":"bool"}], "postprocess": val},
    {"name": "vtype", "symbols": [{"literal":"function"}], "postprocess": val},
    {"name": "vtype", "symbols": [{"literal":"number"}], "postprocess": val},
    {"name": "vtype", "symbols": [{"literal":"string"}], "postprocess": val},
    {"name": "name", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([tok]) => ({ _: 'id', value: tok.value })},
    {"name": "_", "symbols": ["ws"], "postprocess": always(null)},
    {"name": "_", "symbols": ["comment"], "postprocess": always(null)},
    {"name": "_", "symbols": [], "postprocess": always(null)},
    {"name": "__", "symbols": ["ws"], "postprocess": always(null)},
    {"name": "ws", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": always(null)},
    {"name": "comment", "symbols": ["_", (lexer.has("comment") ? {type: "comment"} : comment), "_"], "postprocess": always(null)}
  ],
  ParserStart: "document",
};

export default grammar;
