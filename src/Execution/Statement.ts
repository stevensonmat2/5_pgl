import { Stmt, Value } from "../AST";
import { exprToString } from "../SyntaxAnalysis"; // used in error messages
import { printLine } from "../Library/Runtime";

import {
  DynamicProgramScope,
  pushLocalScope, popLocalScope, declare, update
} from "../Scope";

import { executeExpr } from "./Expression";

export function executeStmt(
  scope: DynamicProgramScope,
  stmt: Stmt
): void {
  switch (stmt.tag) {
    case "varDecl": {
      const initialValue: Value = executeExpr(scope, stmt.initialExpr);
      declare<Value>(stmt.name, initialValue, scope);
      break;
    }

    case "varUpdate": {
      const initialValue: Value = executeExpr(scope, stmt.newExpr);
      update(stmt.name, initialValue, scope);
      break;
    }

    case "print": {
      const printValue: Value = executeExpr(scope, stmt.printExpr);
      printLine(printValue);
      break;
    }

    case "block": {
      pushLocalScope<Value>(scope);

      for (const blockStmt of stmt.blockStmts)
        executeStmt(scope, blockStmt);

      popLocalScope<Value>(scope);

      break;
    }

    case "if": {
      pushLocalScope<Value>(scope);

      const conditionValue: Value = executeExpr(scope, stmt.condition);
      if (conditionValue)
        executeStmt(scope, stmt.trueBranch);
      else if (stmt.falseBranch != null)
        executeStmt(scope, stmt.falseBranch);

      popLocalScope<Value>(scope);

      break;
    }

    case "while": {
      pushLocalScope<Value>(scope);

      let conditionValue: Value = executeExpr(scope, stmt.condition);
      while (conditionValue) {
        executeStmt(scope, stmt.body);
        conditionValue = executeExpr(scope, stmt.condition);
      }

      popLocalScope<Value>(scope);

      break;
    }

    case "switch": {
      pushLocalScope<Value>(scope);

      const scrutineeValue: Value = executeExpr(scope, stmt.focus);
      const body = stmt.valueCases.get(scrutineeValue);

      if (body != null)
        executeStmt(scope, body);
      else if (stmt.defaultCase != null)
        executeStmt(scope, stmt.defaultCase);

      popLocalScope<Value>(scope);

      break;
    }
  }
}
