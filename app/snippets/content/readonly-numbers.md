---
title: "ReadonlyNumbers<T> Type"
description: "A TypeScript utility type that makes all number-typed properties readonly while leaving other properties mutable"
date: "2025-04-15"
category: "typescript"
difficulty: "intermediate"
tags: ["utility-types", "conditional-types", "mapped-types", "readonly"]
---

A TypeScript utility type that selectively applies the `readonly` modifier to all properties of type `number`, while keeping other properties mutable. This is useful when you want to protect numeric data (such as IDs or counters) from being accidentally modified.

## Snippet

```ts
type ReadonlyNumbers<T> = {
  readonly [K in keyof T as T[K] extends number ? K : never]: T[K];
} & {
  [K in keyof T as T[K] extends number ? never : K]: T[K];
};
```

## Usage Example

```ts
interface Stats {
  id: number;
  name: string;
  age: number;
  isActive: boolean;
}

// Makes only number properties readonly
type ImmutableNumbers = ReadonlyNumbers<Stats>;

const stats: ImmutableNumbers = {
  id: 1,
  name: "Alice",
  age: 30,
  isActive: true
};

stats.name = "Bob"; // ✅ Allowed
stats.isActive = false; // ✅ Allowed

stats.id = 2; // ❌ Error: Cannot assign to 'id' because it is a read-only property
stats.age = 31; // ❌ Error: Cannot assign to 'age' because it is a read-only property
```

## How It Works

```ts
type ReadonlyNumbers<T> = {
  // Make number properties readonly
  readonly [K in keyof T as T[K] extends number ? K : never]: T[K];
} & {
  // Leave non-number properties as-is
  [K in keyof T as T[K] extends number ? never : K]: T[K];
};
```

### Key concepts:

- **Key remapping** with `as` filters properties by their type

- **Conditional types** check whether the property type is `number`

- **Mapped types** apply `readonly` selectively

- **Intersection** (`&`) merges both filtered groups into a single type

## Real World Example

```ts
interface Config {
  retries: number;
  timeout: number;
  url: string;
  secure: boolean;
}

// Prevent numeric configuration values from being accidentally changed
const config: ReadonlyNumbers<Config> = {
  retries: 3,
  timeout: 1000,
  url: "https://api.example.com",
  secure: true
};

config.url = "https://api.backup.com"; // ✅ OK
config.secure = false; // ✅ OK

config.retries = 5; // ❌ Error: read-only
config.timeout = 500; // ❌ Error: read-only
```

## Comparison with `Readonly<T>`

Unlike `Readonly<T>` which makes all properties immutable, `ReadonlyNumbers<T>` targets only those with type `number`.

```ts
interface Example {
  count: number;
  label: string;
}

type FullyReadonly = Readonly<Example>;
type OnlyNumbersReadonly = ReadonlyNumbers<Example>;

const a: FullyReadonly = { count: 1, label: "A" };
a.count = 2; // ❌
a.label = "B"; // ❌

const b: OnlyNumbersReadonly = { count: 1, label: "A" };
b.count = 2; // ❌
b.label = "B"; // ✅
```

## Summary

`ReadonlyNumbers<T>` is a handy utility when you need stricter control over numeric properties in your types. It enhances type safety by preventing accidental mutations of values like IDs, counters, and configuration numbers, while still allowing flexibility for other property types.