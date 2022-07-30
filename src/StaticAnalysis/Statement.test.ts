import "jest-extended";

import { StaticProgramScope, ScopeError } from "../Scope";
import { StaticTypeError } from "./TypeAssertions";
import { typecheckStmt } from "./Statement";

test("switch/case statement test", () => {
  let scope: StaticProgramScope = [new Map()];

  typecheckStmt(scope, {
    tag: "switch",
    focus: { tag: "num", value: 1 },
    valueCases: new Map(),
    defaultCase: null
  });

  expect(scope).toEqual([new Map()]);

  typecheckStmt(scope, {
    tag: "switch",
    focus: { tag: "bool", value: true },
    valueCases: new Map(),
    defaultCase: null
  });

  expect(scope).toEqual([new Map()]);

  typecheckStmt(scope, {
    tag: "switch",
    focus: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    },
    valueCases: new Map(),
    defaultCase: null
  });

  expect(scope).toEqual([new Map()]);

  expect(() => typecheckStmt(scope, {
    tag: "switch",
    focus: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "bool", value: true },
    },
    valueCases: new Map(),
    defaultCase: null
  })).toThrow(StaticTypeError);

  expect(scope).toEqual([new Map()]);

  typecheckStmt(scope, {
    tag: "switch",
    focus: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    },
    valueCases: new Map([
      [1, {
        tag: "print",
        printExpr: { tag: "bool", value: false }
      }]
    ]),
    defaultCase: null
  });

  expect(scope).toEqual([new Map()]);

  typecheckStmt(scope, {
    tag: "switch",
    focus: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    },
    valueCases: new Map([
      [1, {
        tag: "varDecl",
        name: "x",
        initialExpr: { tag: "bool", value: false }
      }]
    ]),
    defaultCase: null
  });

  expect(scope).toEqual([new Map()]);

  expect(() => typecheckStmt(scope, {
    tag: "switch",
    focus: {
      tag: "plus",
      leftSubexpr: { tag: "num", value: 1 },
      rightSubexpr: { tag: "num", value: 2 },
    },
    valueCases: new Map([
      [1, {
        tag: "varDecl",
        name: "x",
        initialExpr: { tag: "bool", value: false }
      }],
      [2, {
        tag: "varUpdate",
        name: "x",
        newExpr: { tag: "bool", value: true }
      }]
    ]),
    defaultCase: null
  })).toThrow(ScopeError);

  scope = [new Map()];

  typecheckStmt(scope, {
    tag: "switch",
    focus: {
      tag: "and",
      leftSubexpr: { tag: "bool", value: false },
      rightSubexpr: { tag: "bool", value: true },
    },
    valueCases: new Map([
      [true, {
        tag: "varDecl",
        name: "x",
        initialExpr: { tag: "bool", value: false }
      }],
      [false, {
        tag: "varDecl",
        name: "x",
        initialExpr: { tag: "num", value: 1 }
      }]
    ]),
    defaultCase: {
      tag: "varDecl",
      name: "x",
      initialExpr: { tag: "bool", value: true }
    }
  });

  expect(scope).toEqual([new Map()]);
});
