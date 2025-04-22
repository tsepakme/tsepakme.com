---
title: "OptionalDeepFields<T> Type"
description: "A TypeScript utility type that makes all nested object properties optional recursively, while keeping top-level scalar properties required"
date: "2025-04-15"
category: "typescript"
difficulty: "advanced"
tags: ["utility-types", "conditional-types", "recursive-types", "deep-optional"]
---

A TypeScript utility type that recursively makes all nested object properties optional while preserving the required status of top-level scalar fields. This is especially useful when working with deeply nested configurations or partial updates of structured data.

## Snippet

```ts
type OptionalDeepFields<T> = {
  [K in keyof T as T[K] extends Record<string, unknown> ? K : never]?: 
    T[K] extends Record<string, unknown> ? OptionalDeepFields<T[K]> : T[K];
} & {
  [K in keyof T as T[K] extends Record<string, unknown> ? never : K]: T[K];
};
```

## Usage Example

```ts
interface Settings {
  theme: string;
  layout: {
    sidebar: {
      width: number;
      collapsed: boolean;
    };
    header: {
      visible: boolean;
    };
  };
}

// Only nested objects become optional
type PartiallyOptionalSettings = OptionalDeepFields<Settings>;

const config: PartiallyOptionalSettings = {
  theme: "dark",
  layout: {
    sidebar: {
      collapsed: true
      // width is optional
    },
    // header is optional
  }
};
```

## Hot It Works

```ts
type OptionalDeepFields<T> = {
  // For object-type properties, make them optional and recurse
  [K in keyof T as T[K] extends Record<string, unknown> ? K : never]?: 
    T[K] extends Record<string, unknown> ? OptionalDeepFields<T[K]> : T[K];
} & {
  // Keep scalar (non-object) properties as required
  [K in keyof T as T[K] extends Record<string, unknown> ? never : K]: T[K];
};
```

### Key Concepts:

- `Key remapping` is used to split fields by type.

- `Conditional types` check whether a property is a nested object.

- `Recursion` ensures deeply nested fields are also transformed.

- `Intersection types` (`&`) combine both mapped groups.

## Real World Example: Partial Form Submission

```ts
interface ProfileForm {
  username: string;
  details: {
    age: number;
    contact: {
      email: string;
      phone: string;
    };
  };
}

type PartialNestedForm = OptionalDeepFields<ProfileForm>;

// Only nested fields can be partially omitted
const form: PartialNestedForm = {
  username: "alice",
  details: {
    contact: {
      email: "alice@example.com"
    }
  }
};
```

## Comparison with `Partial<T>` and `DeepPartial<T>`

- `Partial<T>` makes everything optional at top level only.

- `DeepPartial<T>` (custom implementation) makes everything optional, deeply.

- `OptionalDeepFields<T>` makes only nested object properties optional.

```ts
interface Example {
  id: number;
  meta: {
    tags: string[];
    version: number;
  };
}

type A = Partial<Example>;
type B = OptionalDeepFields<Example>;

const a: A = {}; // ✅ Everything is optional
const b: B = { id: 1 }; // ✅ meta is optional, but id is still required
```

## Summary

`OptionalDeepFields<T>` is a precise utility type tailored for cases where top-level values must be present, but deeply nested structures can be optional. It’s especially useful for form data, API updates, and configuration systems that support partial overrides.