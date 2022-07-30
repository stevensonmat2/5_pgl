// **Read the README first!**

import { Stmt } from "./AST";
import { parseStmt } from "./SyntaxAnalysis";
import { executeStmt } from "./Execution/Statement";
import { typecheckStmt } from "./StaticAnalysis/Statement";
import { clearOutput } from "./Library/Runtime";
import { StaticProgramScope, DynamicProgramScope } from "./Scope";

export function typecheckProgram(source: string): void {
  const prog: Stmt = parseStmt(source);
  const scope: StaticProgramScope = [new Map()];
  typecheckStmt(scope, prog);
}

export function runProgram(source: string): void {
  clearOutput();
  const prog: Stmt = parseStmt(source);
  const scope: DynamicProgramScope = [new Map()];
  executeStmt(scope, prog);
}

// ********************
// * EXERCISE 1 START *
// ********************

// In src/StaticAnalysis/Expression.ts, replace the "unimplemented" error in
// the "lessThan" case with code to typecheck the < operator.

// The < operator requires both of its operands to be numbers, and its result
// is a **boolean** (not a number!).

// This is just a warm-up exercise to get you reading the code, it should be
// pretty straightforward.

// ******************
// * EXERCISE 1 END *
// ******************


// ********************
// * EXERCISE 2 START *
// ********************

// In src/StaticAnalysis/Expression.ts, there is code to typecheck the && and
// || operators. In this provided code both operands to these operators are
// required to be booleans, and the result is always a boolean.

// In src/Execution/Expression.ts, you'll see that the execution phase actually
// supports using the && and || operators with numbers as well as booleans, as
// explained in the README.

// This means that the provided typechecking code is *incomplete*, because it
// will throw a StaticTypeError on an expression like "1 && 2", which has no
// chance of throwing a DynamicTypeError at runtime.

// Modify the provided code for the "and" and "or" case in inferExprType to
// support numbers as well as booleans. For both operators, if both operands
// are the same type, the result should be **that same type* (not always
// "bool"); if the two operands are different types, your code should throw a
// StaticTypeError. See the README for an example of using && with number
// operands.

// As usual, the specific error message you provide will not be graded, your
// code just needs to throw the correct type of error to get full points.

// ******************
// * EXERCISE 2 END *
// ******************


// ********************
// * EXERCISE 3 START *
// ********************

// In src/StaticAnalysis/Statement.ts, there is no code to typecheck switch
// statements.

// This means that the provided typechecking code is *unsound*, because it will
// not throw a StaticTypeError on a statement like this (or many others) which
// will throw a DynamicTypeError:
//   switch (1 + true) {
//     default: print 1 && true;
//   }

// Add a case for the "switch" tag to typecheck the SwitchStmt AST node type.
// Review the README for the definition of how the switch statement should
// behave in typechecking.

// The solution to this exercise isn't too complicated, but there are a couple
// subtle details. Pay close attention to where variable names should go in and
// out of scope.

// ******************
// * EXERCISE 3 END *
// ******************