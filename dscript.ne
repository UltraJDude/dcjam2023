@{%
const always = <T>(value: T) => () => value;
const val = ([tok]: NearleyToken[]) => tok.value;

const trace = <T>(name: string, fn: (...args: any[]) => T) => (...args: any[]) => {
  const result = fn(...args);
  console.log('(trace)', name, args, '=', result);
  return result;
}

import Lexer from './Lexer';
const lexer = new Lexer();
%}
@preprocessor typescript

@lexer lexer

document -> _ program {% ([,prog]) => prog %}
program -> declp:* {% id %}
declp -> decl _ {% id %}
decl -> stmt {% id %}

stmt -> assignment {% id %}
      | call {% id %}
      | function_def {% id %}
      | if_stmt {% id %}
      | return_stmt {% id %}

assignment -> name _ assignop _ expr {% ([name,,op,,expr]) => ({ _: 'assignment', name, op, expr }) %}
assignop -> "=" {% val %}
          | "+=" {% val %}
          | "-=" {% val %}
          | "*=" {% val %}
          | "/=" {% val %}
          | "^=" {% val %}

function_def -> "function" __ name "(" function_args ")" function_type_clause:? document __ "end" {% ([,,name,,args,,type,program]) => ({ _: 'function', name, args, type, program }) %}
function_type_clause -> ":" _ vtype {% ([,,type]) => type %}

function_args -> null {% always([]) %}
               | name_with_type
               | function_args _ "," _ name_with_type {% ([list,,,,value]) => list.concat([value]) %}

if_stmt -> "if" __ expr __ "then" document else_clause:? __ "end" {% ([,,expr,,,positive,negative]) => ({ _: 'if', expr, positive, negative }) %}
else_clause -> __ "else" document {% ([,,clause]) => clause %}

return_stmt -> "return" (__ expr {% ([,expr]) => expr %}):? {% ([,expr]) => ({ _: 'return', expr }) %}

expr -> maths {% id %}

maths   -> logic {% id %}
logic   -> logic _ logicop _ boolean {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | boolean {% id %}
boolean -> boolean _ boolop _ sum {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | sum {% id %}
sum     -> sum _ sumop _ product {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | product {% id %}
product -> product _ mulop _ exp {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | exp {% id %}
exp     -> unary _ expop _ exp {% ([left,,op,,right]) => ({ _: 'binary', left, op, right }) %}
         | unary {% id %}
unary   -> "-" value {% ([op,value]) => ({ _: 'unary', op: op.value, value }) %}
         | "not" _ value {% ([op,,value]) => ({ _: 'unary', op: op.value, value }) %}
         | value {% id %}

logicop -> "and" {% val %}
         | "or" {% val %}
         | "xor" {% val %}
boolop  -> ">" {% val %}
         | ">=" {% val %}
         | "<" {% val %}
         | "<=" {% val %}
         | "==" {% val %}
         | "!=" {% val %}
sumop   -> "+" {% val %}
         | "-" {% val %}
mulop   -> "*" {% val %}
         | "/" {% val %}
expop   -> "^" {% val %}

value -> literal_number {% id %}
       | literal_boolean {% id %}
       | literal_string {% id %}
       | name {% id %}
       | call {% id %}

call -> name "(" call_args ")" {% ([fn,,args]) => ({ _:'call', fn, args }) %}

call_args -> null {% always([]) %}
           | expr
           | call_args _ "," _ expr {% ([list,,,,value]) => list.concat([value]) %}

literal_number -> %number {% ([tok]) => ({ _: 'number', value: Number(tok.value) }) %}
                | %number "." %number {% ([whole,,frac]) => ({ _: 'number', value: Number(whole.value + '.' + frac.value)}) %}

literal_boolean -> "true" {% always({ _: 'bool', value: true }) %}
                 | "false" {% always({ _: 'bool', value: false }) %}

literal_string -> %sqstring {% ([tok]) => ({ _: 'string', value: tok.value.slice(1, -1) }) %}
                | %dqstring {% ([tok]) => ({ _: 'string', value: tok.value.slice(1, -1) }) %}

name_with_type -> name ":" _ vtype {% ([name,,,type]) => ({ _: 'arg', type, name }) %}

vtype -> "any" {% val %}
       | "bool" {% val %}
       | "function" {% val %}
       | "number" {% val %}
       | "string" {% val %}

name -> %word {% ([tok]) => ({ _: 'id', value: tok.value }) %}

_  -> ws {% always(null) %}
    | comment {% always(null) %}
    | null {% always(null) %}
__ -> ws {% always(null) %}

ws -> %ws {% always(null) %}
comment -> _ %comment _ {% always(null) %}
