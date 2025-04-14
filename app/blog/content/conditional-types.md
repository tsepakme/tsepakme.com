---
title: "Conditional Types and the Art of Type-Level Logic in TypeScript"
description: "Take your TypeScript skills to the next level by mastering conditional types, `infer`, and advanced type-level computation."
date: "2025-04-09"
tags: ["typescript", "conditional-types", "advanced-types"]
published: true
---

TypeScript isn't just a superset of JavaScript—it's a language with its own type-level programming capabilities. One of the most powerful features in its arsenal is **conditional types**. These allow you to model complex relationships between types, perform inference, and create utility types that adapt to your codebase dynamically.

In this post, we'll explore advanced patterns with conditional types, including `infer`, type filtering, and distribution over unions.


## Recap: What Are Conditional Types?

A conditional type has the form:

```ts
T extends U ? X : Y
```

It evaluates to `X` if `T` is assignable to `U`, and `Y` otherwise.

This is incredibly powerful for writing types that **branch** based on the structure or constraints of the input.


## Example 1: Inferring Function Argument and Return Types

Let's say you want to extract the return type of any given function:

```ts
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

type Result = ReturnTypeOf<() => number>; // number
```

The keyword `infer` lets you **capture** a part of the type (`R`) for use on the right-hand side.

You can also do the same for parameters:

```ts
type FirstArg<T> = T extends (arg: infer A, ...args: any[]) => any ? A : never;

type A = FirstArg<(x: string, y: number) => void>; // string
```

These utilities power libraries like `React`, `tRPC`, and even internal TypeScript helpers.


## Example 2: Filtering Object Keys by Value Type

Want to get just the keys of an object where the values are `string`s? You can do that with conditional types:

```ts
type OnlyStringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T];

type Example = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

type StringKeys = OnlyStringKeys<Example>; // "name" | "email"
```

This works by creating a mapped type that conditionally includes or excludes keys, then extracting the union of the kept ones.


## Example 3: DeepPartial – Recursive Utility Type

You've probably seen `Partial<T>`, but how do you make **all nested properties optional**, too?

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K];
};
```

Usage:

```ts
type Config = {
  theme: {
    primary: string;
    secondary: string;
  };
  features: {
    darkMode: boolean;
  };
};

type PartialConfig = DeepPartial<Config>;
/*  Result of DeepPartial<Config>:
{
  theme?: {
    primary?: string;
    secondary?: string;
  };
  features?: {
    darkMode?: boolean;
  };
}
*/
```

This lets you safely update deeply nested config objects without providing every field.


## Pro Tips for Using Conditional Types

- Use `infer` when you want to extract parts of complex types.
- Conditional types distribute over unions by default (useful, but sometimes surprising).
- Wrap types in tuples `[T] extends [U]` to **prevent** distribution if needed.


## Further Reading

- [TypeScript Handbook – Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Utility Types in TypeScript](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Exploring Advanced Types – Infer, keyof, and Conditional Types](https://blog.logrocket.com/advanced-typescript-explained/)


## Conclusion

Mastering conditional types lets you write smarter, DRYer, and more flexible code in TypeScript. Whether you're building libraries or scaling frontend apps, understanding these patterns unlocks the full potential of the type system.

Want to dive deeper? Try writing your own utilities like `IsNever<T>`, `Flatten<T>`, or `ExtractProps<T>`—and you'll quickly find yourself writing type logic as expressive as your runtime logic.
