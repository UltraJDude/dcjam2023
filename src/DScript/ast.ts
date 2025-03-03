export type Program = Declaration[];

export type Declaration = Statement;

export type Statement =
  | Assignment
  | FunctionCall
  | FunctionDefinition
  | IfStatement
  | ReturnStatement;

export interface Assignment {
  _: "assignment";
  name: Name;
  op: AssignmentOp;
  expr: Expression;
}

export interface FunctionDefinition {
  _: "function";
  name: Name;
  args: FunctionArg[];
  type: FunctionArg["type"] | null;
  program: Program;
}

export interface FunctionArg {
  _: "arg";
  type: "any" | "bool" | "function" | "number" | "string";
  name: Name;
}
export type FunctionArgType = FunctionArg["type"];

export interface IfStatement {
  _: "if";
  expr: Expression;
  positive: Program;
  negative: Program | null;
}

export interface ReturnStatement {
  _: "return";
  expr: Expression | null;
}

export type AssignmentOp = "=" | "+=" | "-=" | "*=" | "/=" | "^=";

export type Expression = Maths | FunctionCall;

export interface FunctionCall {
  _: "call";
  fn: Name;
  args: Expression[];
}

export type Maths = Binary | Unary | Value;

export interface Binary {
  _: "binary";
  left: Expression;
  op: BinaryOp;
  right: Expression;
}

export type LogicOp = "and" | "or" | "xor";
export type BoolOp = ">" | ">=" | "<" | "<=" | "==" | "!=";
export type SumOp = "+" | "-";
export type MulOp = "*" | "/";
export type ExpOp = "^";
export type BinaryOp = LogicOp | BoolOp | SumOp | MulOp | ExpOp;

export interface Unary {
  _: "unary";
  op: UnaryOp;
  value: Value;
}

export type UnaryOp = "-" | "not";

export type Value = Literal | Name;
export type Literal = LiteralNumber | LiteralBoolean | LiteralString;

export interface LiteralNumber {
  _: "number";
  value: number;
  readOnly?: boolean;
}
export interface LiteralBoolean {
  _: "bool";
  value: boolean;
  readOnly?: boolean;
}
export interface LiteralString {
  _: "string";
  value: string;
  readOnly?: boolean;
}

export interface Name {
  _: "id";
  value: string;
}
