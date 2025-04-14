---
title: "PickStartingWithA<T> Type"
description: "A TypeScript utility type that selects all properties whose keys start with the letter 'a'"
date: "2025-04-11"
category: "typescript"
difficulty: "intermediate"
tags: ["utility-types", "template-literals", "key-remapping", "mapped-types"]
---

A TypeScript utility type that selects all properties from a type whose keys begin with the letter `a`. This pattern is especially useful when working with naming conventions, prefixed field names, or APIs with structured key formats.

## Snippet

```ts
type PickStartingWithA<T> = {
  [K in keyof T as K extends `a${string}` ? K : never]: T[K]; 
};
```

## Usage Example

```ts
interface Data {
  age: number;
  address: string;
  active: boolean;
  name: string;
  createdAt: Date;
}

// Only properties starting with 'a' are kept
type AProps = PickStartingWithA<Data>;

// ✅ Valid
const aData: AProps = {
  age: 30,
  address: "123 Main St",
  active: true
};

// ❌ Error - 'name' and 'createdAt' are excluded from AProps
const invalidData: AProps = {
  age: 30,
  name: "Alice" // Error: 'name' does not exist in type 'AProps'
};

```

## How It Works

```ts
type PickStartingWithA<T> = {
  // Use key remapping to filter only keys that start with 'a'
  [K in keyof T as K extends `a${string}` ? K : never]: T[K];
};
```

## This type uses:

Using `Record<string, unknown>` instead of `object` provides more precise type checking:

- **Template literal types** to check if a key starts with a specific pattern
- **Conditional key remapping** `as` to exclude unwanted keys
- **Mapped types** to transform the type while keeping values intact

## Real World Example

```ts
// Settings with prefixed fields
interface AppSettings {
  appTheme: string;
  appVersion: string;
  userLanguage: string;
  authToken: string;
  analyticsEnabled: boolean;
}

// Extract only app-related settings (starting with 'a')
type AppPrefixSettings = PickStartingWithA<AppSettings>;

const config: AppPrefixSettings = {
  appTheme: "dark",
  appVersion: "1.2.3",
  authToken: "abc123",
  analyticsEnabled: true
};
```

## Template Literal Flexibility

You can tweak the template string pattern to match other naming conventions:

```ts
// Pick keys starting with 'user'
type PickUserFields<T> = {
  [K in keyof T as K extends `user${string}` ? K : never]: T[K];
};
```

Useful for APIs, localization keys, or grouped configuration:

```ts
interface Localization {
  userName: string;
  userAge: string;
  systemDate: string;
  systemTime: string;
}

type UserLocals = PickUserFields<Localization>;
// { userName: string; userAge: string }
```
## TypeScript Version Requirements

This utility requires TypeScript 4.1 or newer — the version that introduced **template literal types** and **key remapping** in mapped types.