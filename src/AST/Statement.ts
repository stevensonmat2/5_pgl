import { Expr, Value } from "./Expression";

// Our Stmt type also looks almost exactly the same as in assignment 3, but
// ForStmt has been replaced with WhileStmt, and we have a new SwitchStmt node
// type. The rest of the node types are the same as before.
export type Stmt =
  VarDeclStmt | VarUpdateStmt | PrintStmt |
  BlockStmt | IfStmt | WhileStmt | SwitchStmt;


export type VarDeclStmt = {
  readonly tag: "varDecl";
  readonly name: string;
  readonly initialExpr: Expr;
};

export type VarUpdateStmt = {
  readonly tag: "varUpdate";
  readonly name: string;
  readonly newExpr: Expr;
};

export type PrintStmt = {
  readonly tag: "print";
  readonly printExpr: Expr;
};

export type BlockStmt = {
  readonly tag: "block";
  readonly blockStmts: Stmt[];
};

export type IfStmt = {
  readonly tag: "if";
  readonly condition: Expr;
  readonly trueBranch: Stmt;
  readonly falseBranch: Stmt | null;
};

export type WhileStmt = {
  readonly tag: "while";
  readonly condition: Expr;
  readonly body: Stmt;
};

// A switch statement has a *focus* (the expression in parentheses after the
// "switch" keyword), any number of *value cases* (beginning with the "case"
// keyword), and optionally a single final *default case* (beginning with the
// "default" keyword).
export type SwitchStmt = {
  readonly tag: "switch";
  readonly focus: Expr;
  readonly valueCases: Map<Value, Stmt>;
  readonly defaultCase: Stmt | null;
};

// Note that the value cases in a switch statement are represented using a Map
// from the value of each case to the body of the case. For example, consider
// this switch statement:
//   switch (thing) {
//     case 1: print 1;
//     case 2: { print 2; print 3; }
//     default: { print 4; print 5; }
//   }

// The valueCases Map for this statement maps the value "1" to the statement
// "print 1;" and the value "2" to the statement "{ print 2; print 3; }". The
// "default" case is not in the valueCases map, since it's represented
// separately by the defaultCase field.

// If a switch statement has more than one case with the same value, the
// bottom-most case overrides all others with the same value. For example,
// consider this switch statement:
//   switch (thing) {
//     case 1: print 1;
//     case 2: { print 2; print 3; }
//     case 1: { print 4; print 5; }
//   }

// If thing = 1 in this statement, the code prints 4 and then 5, not 1.

// This takes place during syntax analysis, so the static analysis and
// execution phases never have to handle duplicate case values. If we wanted to
// throw an error on duplicate case values, it would most likely be a syntax
// error, since it would be most convenient to handle it in postprocessing.

// To loop over every value case, you can use this pattern:
//   for (const [value, body] of stmt.valueCases.entries()) {
//     // In this loop, value is a Value and body is a Stmt.
//     // For a case that looks like "case 1: print 2;",
//     // value is 1 and body is the AST for "print 2".
//   }