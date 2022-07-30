// The distinction between our toy language's "types" and TypeScript's "types"
// can get somewhat confusing, so let's review the terminology from lecture 2:
//   - Our toy language is the *source language*.
//   - TypeScript is the *implementation language*.

// This is the naming scheme we'll follow in this code: a "source type" is a
// type in our toy language, and an "implementation type" is a type in
// TypeScript.

// (In PL theory, we often use the term *object language* for our source
// language and *metalanguage* for our implementation language, even though this
// can sometimes be confusing since both "object" and "meta" also have many
// other meanings in PL. In this assignment, we'll stick with the terms "source"
// and "target".)

// Our source types will just be the strings "num" and "bool", which are
// conveniently the same as the tag names on the value leaves in our expression
// ASTs.
export type SourceType = "num" | "bool";


// Our Expr and Value types are defined the same way as in assignment 3
// (with some changes in the set of node types, explained in the README).
export type Expr =
  PlusExpr | MinusExpr | TimesExpr | DivideExpr | ExponentExpr |
  AndExpr | OrExpr | LessThanExpr | EqualExpr |
  NegateExpr | NotExpr | InputExpr |
  NumLeaf | BoolLeaf | VarLeaf;

export type Value = number | boolean;


export type NumLeaf = {
  readonly tag: "num";
  readonly value: number;
}

export type BoolLeaf = {
  readonly tag: "bool";
  readonly value: boolean;
}

export type VarLeaf = {
  readonly tag: "var";
  readonly name: string;
}


// An input expression (like "input<num>") doesn't contain any subexpressions,
// but does contain a *type* specifying which type of input to read from the
// user. (Make sure you understand exactly what "type: SourceType" means here!)
export type InputExpr = {
  readonly tag: "input";
  readonly type: SourceType;
}


// The rest of our AST code looks just like before.
export type InfixExpr = {
  readonly leftSubexpr: Expr;
  readonly rightSubexpr: Expr;
};

export type PrefixExpr = {
  readonly subexpr: Expr;
};


export type PlusExpr = { readonly tag: "plus" } & InfixExpr;
export type MinusExpr = { readonly tag: "minus" } & InfixExpr;
export type TimesExpr = { readonly tag: "times" } & InfixExpr;
export type DivideExpr = { readonly tag: "divide" } & InfixExpr;
export type ExponentExpr = { readonly tag: "exponent" } & InfixExpr;
export type AndExpr = { readonly tag: "and" } & InfixExpr;
export type OrExpr = { readonly tag: "or" } & InfixExpr;
export type LessThanExpr = { readonly tag: "lessThan" } & InfixExpr;
export type EqualExpr = { readonly tag: "equal" } & InfixExpr;
export type NegateExpr = { readonly tag: "negate" } & PrefixExpr;
export type NotExpr = { readonly tag: "not" } & PrefixExpr;