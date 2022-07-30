// Statements don't produce *values*, so we don't do any form of type inference
// for them.

// Instead, when we typecheck a statement, we just look for errors, and in the
// success case we exit with no errors.

// This is why typecheckStmt has a void return type: success means returning
// nothing instead of throwing an error!

import { Stmt } from "../AST";

import {
  StaticProgramScope,
  lookup, pushLocalScope, popLocalScope, declare
} from "../Scope";

import { StaticTypeError, assertType } from "./TypeAssertions";
import { inferExprType, inferValueType } from "./Expression";

export function typecheckStmt(scope: StaticProgramScope, stmt: Stmt): void {
  switch (stmt.tag) {
    // The varDecl case looks almost identical to the same case in the
    // execution code: we just store the type of the expression instead of its
    // value.
    case "varDecl": {
      const initialExprType = inferExprType(scope, stmt.initialExpr);
      declare(stmt.name, initialExprType, scope);
      break;
    }

    // The varUpdate case is a little different than in the execution code:
    // instead of modifying the scope, we **check** the scope to find the type
    // of the variable, in order to make sure the new value has the right type.
    case "varUpdate": {
      const varType = lookup(stmt.name, scope);
      const newExprType = inferExprType(scope, stmt.newExpr);
      assertType(varType, newExprType);
      break;
    }

    // The print statement can take any type of expression, but it must be a
    // well-typed expression! Without this call to inferExprType, our
    // typechecker would fail to throw an error on a statement like
    // "print (1 + true);".
    case "print":
      inferExprType(scope, stmt.printExpr);
      break;

    // The block statement case looks almost identical to the same case in the
    // execution code: we just typecheck each statement in the block instead
    // of executing it.
    case "block": {
      pushLocalScope(scope);

      for (const blockStmt of stmt.blockStmts)
        typecheckStmt(scope, blockStmt);

      popLocalScope(scope);

      break;
    }

    // The if statement case looks similar to the execution code, but there is
    // a very notable **difference**: it always checks **both** branches,
    // because without executing the code we don't know whether the condition
    // will be true or false. Note how this code also makes sure that variables
    // defined in the true branch are not in scope in the false branch.
    case "if": {
      const conditionType = inferExprType(scope, stmt.condition);
      assertType("bool", conditionType);

      pushLocalScope(scope);
      typecheckStmt(scope, stmt.trueBranch);
      popLocalScope(scope);

      if (stmt.falseBranch != null) {
        pushLocalScope(scope);
        typecheckStmt(scope, stmt.falseBranch);
        popLocalScope(scope);
      }

      break;
    }

    // The while statement case is another demonstration of the power of
    // typechecking: we typecheck the body of the loop, but **exactly once**.
    // There's no need to predict more than one iteration of the loop, because
    // we know nothing will be a different *type* on any further iteration.
    // This means that we can even typecheck infinite loops in finite time.
    case "while": {
      pushLocalScope(scope);

      const conditionType = inferExprType(scope, stmt.condition);
      assertType("bool", conditionType);
      typecheckStmt(scope, stmt.body);

      popLocalScope(scope);

      break;
    }
  }
}
