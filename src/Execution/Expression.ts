import { Expr, Value } from "../AST";
import { input } from "../Library/Runtime";

import { DynamicProgramScope, lookup } from "../Scope";
import { assertNum, assertBool, assertSameType } from "./TypeAssertions";

export function executeExpr(
  scope: DynamicProgramScope,
  expr: Expr
): Value {
  switch (expr.tag) {
    case "plus": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue + rightValue;
    }

    case "minus": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue - rightValue;
    }

    case "times": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue * rightValue;
    }

    case "divide": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue / rightValue;
    }

    case "exponent": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue ** rightValue;
    }

    case "and": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      switch (typeof leftValue) {
        case "number": assertNum(rightValue); return leftValue & rightValue;
        case "boolean": assertBool(rightValue); return leftValue && rightValue;
      }
    }

    case "or": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      switch (typeof leftValue) {
        case "number": assertNum(rightValue); return leftValue | rightValue;
        case "boolean": assertBool(rightValue); return leftValue || rightValue;
      }
    }

    case "lessThan": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertNum(leftValue);
      assertNum(rightValue);
      return leftValue < rightValue;
    }

    case "equal": {
      const leftValue = executeExpr(scope, expr.leftSubexpr);
      const rightValue = executeExpr(scope, expr.rightSubexpr);
      assertSameType(leftValue, rightValue);
      return leftValue == rightValue;
    }

    case "negate": {
      const value = executeExpr(scope, expr.subexpr);
      assertNum(value);
      return - value;
    }

    case "not": {
      const value = executeExpr(scope, expr.subexpr);
      assertBool(value);
      return ! value;
    }

    case "input":
      return input(expr.type);

    case "var":
      return lookup(expr.name, scope);

    case "num":
    case "bool":
      return expr.value;
  }
}
