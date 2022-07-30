// Don't **copy** the code of these functions: **call** the functions instead!

import { SourceType, Value } from "./AST";

// Now that we have a static analysis phase in our interpreter, there is more
// than one kind of "scope" type that we need to keep track of:
//   - Static analysis needs a scope that maps variable names to *types*.
//   - Execution needs a scope that maps variable names to *values*.

// Other than this difference, these two kinds of "scopes" should behave
// **identically**: for example, both of them should have the pushLocalScope and
// popLocalScope functions.

// Instead of writing two slightly different versions of our scope type, we can
// use TypeScript's *generic types* to write a single set of definitions that
// work for both of our use cases (static analysis and execution).

// Generic types are very similar to "templated types" in C++, although there
// are some technical differences that we won't go into here. If you're familiar
// with templated types, that intuition will be valid in this code.

// Review the Scope code from assignment 3 before reading through this code!


// The LocalScope type is defined like in assignment 3: a LocalScope is a map
// from strings to "things". The name T is a *generic type variable*, which
// stands for **any TypeScript type**, like number, string, or Expr.
export type LocalScope<T> = Map<string, T>;

// Let's break down that definition:

// - "LocalScope<T>" *declares* the variable T: this is where we choose its name.
//   We can choose any name we want for a type variable, just like with a regular
//   runtime variable.

// - "Map<string, T>" *uses* the variable T to describe a type which maps
//   strings to values of type T. Here we have to use the name that we chose in
//   the type declaration.

// - The name "T" is only in scope **within the definition that declares it**.
//   In the rest of this file, the name "T" refers to **other** type variables.


// LocalScope itself is a *generic type* because it's defined with a generic
// type variable. When we want to use a generic type, we *specialize* the
// generic type by choosing something to replace the type variable with.

// Remember why we're doing this: we want Scope types for both *static analysis*
// and *execution*.

// Here is our LocalScope type for *static analysis*:
export type StaticLocalScope = LocalScope<SourceType>;

// Here is our LocalScope type for *execution*:
export type DynamicLocalScope = LocalScope<Value>;

// These are equivalent to the following definitions:
//   export type StaticLocalScope = Map<string, SourceType>;
//   export type DynamicLocalScope = Map<string, Value>;
// Make sure you can see why this is true!


// Just like with LocalScope, we define our ProgramScope type as a generic type
// with a generic type variable.
export type ProgramScope<T> = LocalScope<T>[] & { 0: LocalScope<T> };

// Note that you can change the name "T" in the ProgramScope definition without
// changing it in the LocalScope definition: they're **different** type
// variables, which might happen to have the same name or might not.

// Here is our ProgramScope type for *static analysis*:
export type StaticProgramScope = ProgramScope<SourceType>;

// Here is our ProgramScope type for *execution*:
export type DynamicProgramScope = ProgramScope<Value>;

// These are equivalent to the following definitions:
//   export type StaticProgramScope = LocalScope<SourceType>[] & { 0: LocalScope<SourceType> }
//   export type DynamicProgramScope = LocalScope<Value>[] & { 0: LocalScope<Value> }

// We have not gained very much from using generic types yet: we just got a bit
// of shorthand to define our types with. The real power of generic types is in
// the ability to define *generic functions* which operate on arguments with
// generic types.

// Instead of defining a "static" and "dynamic" version of each Scope function
// from assignment 3, we can define a **single** set of functions that work for
// **both** variants of our ProgramScope type, and any other variants we might
// want to add in the future too.


// Like before, we report scoping errors with a custom exception type. We'll use
// the same exception type for static scope errors and dynamic scope errors.
export class ScopeError extends Error { }


// Each of our scope functions is defined with a generic type variable, which
// allows the function to be called with any ProgramScope argument.
export function pushLocalScope<T>(programScope: ProgramScope<T>): void {
  programScope.unshift(new Map());
}

// In this definition, "pushLocalScope<T>" *declares* the type variable T, and
// "programScope<T>" *uses* it in order to describe the argument type. Within
// the function, we are **not allowed to make any assumptions about T**: we must
// give a definition that works for **any possible specialization of T**.

// This definition of pushLocalScope gives us two *specializations* to call:
//   pushLocalScope<SourceType>(programScope: StaticProgramScope): void
//   pushLocalScope<Value>(programScope: DynamicProgramScope): void

// You can see these specializations used in the provided Execution and
// StaticAnalysis code.

// This is how generic types help reduce duplicated code: we get two functions
// for the price of one!


// The popLocalScope definition uses a generic type variable in the same way as
// pushLocalScope.
export function popLocalScope<T>(programScope: ProgramScope<T>): void {
  programScope.shift();
}


// In the lookup function, the generic type variable is also the *return type*
// of the function: if we look up a name in a ProgramScope<T>, we get back a T.
// This means calling lookup with a StaticProgramScope gives back a SourceType
// and calling it with a DynamicProgramScope gives back a Value.
export function lookup<T>(
  name: string,
  programScope: ProgramScope<T>
): T {
  for (const nestedScope of programScope) {
    const value = nestedScope.get(name);
    if (value != null)
      return value;
  }
  throw new ScopeError("name is not in scope: " + name);
}


// In the declare function, we take any value of type T to update the
// ProgramScope<T> with.
export function declare<T>(
  name: string,
  entry: T,
  programScope: ProgramScope<T>
): void {
  if (programScope[0].has(name))
    throw new ScopeError("duplicate variable definition: " + name);
  programScope[0].set(name, entry);
}

// Note that when we call declare, the type of "entry" and the type of
// "programScope" must use the **same** specialization of T: TypeScript's
// typechecker will not let us call declare with a SourceType entry and a
// ProgramScope<Value>, or any other mismatched combination.


// Finally, our update function is deliberately **not** generic! Think about the
// features of our toy language: the *value* of a variable can change at
// runtime, but the *type* of a variable cannot change during typechecking. This
// means we should not need an "update" function for StaticProgramScope.
export function update(
  name: string,
  entry: Value,
  programScope: DynamicProgramScope
): void {
  for (const nestedScope of programScope) {
    if (nestedScope.has(name)) {
      nestedScope.set(name, entry);
      return;
    }
  }
  throw new ScopeError("assignment to undeclared variable name: " + name);
}