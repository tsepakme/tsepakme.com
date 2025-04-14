---
title: "Optional<T> Recursive Type"
description: "A TypeScript utility type that makes all properties optional, including nested objects"
date: "2025-04-11"
category: "typescript"
difficulty: "intermediate"
tags: ["utility-types", "type-transformations", "mapped-types"]
---

A TypeScript utility type that makes all properties in an object optional, including those in nested objects. Perfect for partial updates, form data, and configuration objects.

## Snippet

```ts
type Optional<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? Optional<T[K]> : T[K];
};
```

## Usage Example

```ts
// Original type with required properties
type User = {
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  preferences: {
    theme: {
      color: string;
      mode: 'light' | 'dark';
    };
    notifications: boolean;
  };
};

// All properties are optional, including nested ones
type PartialUser = Optional<User>;

// ✅ Valid - can omit any property at any level
const userUpdate: PartialUser = {
  name: "Jane Doe",
  address: {
    // Can omit city and zipCode
    street: "123 Main St"
  },
  // Can omit preferences entirely
};
```

## How It Works

```ts
// The magic happens through conditional typing
type Optional<T> = {
  // [K in keyof T]? - Makes each property optional with the ? modifier
  // For each property check if its value is a plain object (Record<string, unknown>):
  //   - If it is, recursively apply Optional to that object
  //   - If not, keep the original type
  [K in keyof T]?: T[K] extends Record<string, unknown> ? Optional<T[K]> : T[K];
};
```

## Why `Record<string, unknown>` instead of `object`

Using `Record<string, unknown>` instead of `object` provides more precise type checking:

- **More specific object detection:**
  - `object` includes arrays, functions, and other non-primitive types
  - `Record<string, unknown>` specifically targets plain objects with string keys
- **Better handling of special types:**
  - Arrays remain intact instead of being recursively processed
  - Function properties are preserved as-is
  - Only actual object structures are made recursively optional

## Real World Example

```ts
// API update payload with deeply nested optional fields
type UserProfileSettings = {
  personalInfo: {
    displayName: string;
    bio: string;
    birthDate: Date;
  };
  securitySettings: {
    twoFactor: {
      enabled: boolean;
      method: 'sms' | 'app';
    };
    passwordReset: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  favoriteNumbers: number[];  // Array property
  calculateAge: () => number; // Function property
};

// Function to update user settings, accepting partial data at any level
function updateUserSettings(userId: string, settings: Optional<UserProfileSettings>) {
  // Only specified fields will be updated
  console.log(`Updating settings for user ${userId}`);
  
  // This is safe - we don't need to check if every property exists
  return apiClient.patch(`/users/${userId}/settings`, settings);
}

// Usage
updateUserSettings('user123', {
  personalInfo: {
    // Only update bio, leave other fields unchanged
    bio: "TypeScript enthusiast"
  },
  // Arrays are preserved as-is (not recursively made optional)
  favoriteNumbers: [42, 7, 13],
  // Only update email notification setting
  notifications: {
    email: false
  }
});
```

## Improved Version for Arrays

If you want to handle arrays of objects specially, you can extend the type:

```ts
// Enhanced version that handles arrays of objects specially
type DeepOptional<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown>
    ? DeepOptional<T[K]>
    : T[K] extends Array<infer U>
      ? U extends Record<string, unknown>
        ? Array<DeepOptional<U>>
        : T[K]
      : T[K];
};

// Usage with arrays of objects
type TodoList = {
  title: string;
  items: Array<{ 
    task: string; 
    completed: boolean;
    subtasks: { description: string; done: boolean }[];
  }>;
  settings: {
    color: string;
    priority: number;
  };
};

// Can update any part of the structure, including nested objects in arrays
const update: DeepOptional<TodoList> = {
  items: [
    { 
      task: "Learn TypeScript",
      // completed can be omitted
      subtasks: [{ description: "Study utility types" }]
    }
  ],
  settings: { color: "blue" }
};
```

## Comparison to Standard `Partial<T>`

TypeScript's built-in `Partial<T>` only makes the top level properties optional:

```ts
// Built-in TypeScript utility
type StandardPartial = Partial<User>;

// ❌ Error - nested properties are still required
const invalid: StandardPartial = {
  address: {} // Error: missing required properties 
};

// ✓ Works correctly with our recursive Optional
const valid: Optional<User> = {
  address: {} // All nested properties are optional
};
```

## TypeScript Version Requirements

This utility type works in TypeScript 2.8 and above. The recursion pattern became more reliable in TypeScript 3.7+.