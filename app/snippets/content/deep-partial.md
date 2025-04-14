---
title: "OptionalMethods<T> Type"
description: "A TypeScript utility type that makes all method properties optional while keeping data properties required"
publishedAt: "2025-04-11"
category: "typescript"
difficulty: "intermediate"
tags: ["utility-types", "conditional-types", "mapped-types", "key-remapping"]
---

A TypeScript utility type that makes method properties (functions) optional while preserving all other properties as required. Useful for implementing interfaces, creating mocks, and building class factories.

## Snippet

```ts
type OptionalMethods<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]?: T[K];
} & {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};
```

## Usage Example

```ts
// Original interface with required methods and properties
interface User {
  id: number;
  name: string;
  getFullName(): string;
  updateProfile(data: any): Promise<void>;
  isActive: boolean;
}

// Methods are optional, data properties remain required
type UserWithOptionalMethods = OptionalMethods<User>;

// ✅ Valid - can omit method properties
const user: UserWithOptionalMethods = {
  id: 123,
  name: "Jane Doe",
  isActive: true
  // getFullName and updateProfile are optional
};

// ❌ Error - cannot omit non-method properties
const invalidUser: UserWithOptionalMethods = {
  id: 456,
  // Error: Property 'name' is missing
  isActive: false
};
```

## How It Works

```ts
type OptionalMethods<T> = {
  // First mapped type: selects only method properties and makes them optional
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]?: T[K];
} & {
  // Second mapped type: selects only non-method properties and keeps them required
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};
```

### The type uses:
- **Key remapping** with `as` to filter properties
- **Conditional types** to check if each property is a function
- **Intersection** to combine both filtered property sets

## Real World Example

```ts
// Component interface with lifecycle methods and required properties
interface Component {
  // Required data properties
  id: string;
  isVisible: boolean;
  children: any[];
  
  // Methods that might be implemented
  render(): HTMLElement;
  componentDidMount(): void;
  componentWillUnmount(): void;
  handleEvent(event: Event): void;
}

// Factory function that creates components with optional method implementations
function createComponent(config: OptionalMethods<Component>): Component {
  // Default implementations for methods
  const defaults = {
    render: () => document.createElement('div'),
    componentDidMount: () => console.log('Mounted'),
    componentWillUnmount: () => console.log('Unmounting'),
    handleEvent: (event: Event) => console.log('Event handled', event)
  };
  
  // Merge provided config with defaults
  return { ...defaults, ...config };
}

// Usage - only implement the methods you need
const myComponent = createComponent({
  id: 'my-component',
  isVisible: true,
  children: [],
  // Only override the render method
  render: () => {
    const el = document.createElement('button');
    el.textContent = 'Click me';
    return el;
  }
});
```

## Testing Scenario

```ts
// Service interface with multiple methods
interface AuthService {
  userId: string;
  isLoggedIn: boolean;
  login(username: string, password: string): Promise<boolean>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
  validateSession(): boolean;
}

// Create a mock with stub implementations only where needed
function createMockAuthService(
  overrides: OptionalMethods<AuthService>
): AuthService {
  // Default no-op implementations
  return {
    userId: overrides.userId || 'test-user',
    isLoggedIn: overrides.isLoggedIn ?? false,
    login: overrides.login || (async () => true),
    logout: overrides.logout || (async () => {}),
    refreshToken: overrides.refreshToken || (async () => 'mock-token'),
    validateSession: overrides.validateSession || (() => true)
  };
}

// Test with specific behavior for login method only
const mockAuth = createMockAuthService({
  userId: 'test-123',
  isLoggedIn: true,
  // Only implement the methods relevant to the test
  login: async (username, password) => {
    expect(username).toBe('testuser');
    expect(password).toBe('password');
    return true;
  }
});
```

## Type Safety Considerations

The utility preserves the method signatures, ensuring type safety when methods are used:

```ts
interface Calculator {
  value: number;
  add(n: number): number;
  subtract(n: number): number;
  multiply(n: number): number;
}

const calc: OptionalMethods<Calculator> = {
  value: 0,
  // Type checking still works on method parameters
  add: (n: number) => n + 10, // Correct
  
  // Error: Type 'string' is not assignable to type 'number'
  subtract: (n: number) => `${n}` 
};
```

## Comparison with Partial`<T>`

Unlike `Partial<T>` which makes all properties optional, `OptionalMethods<T>` is more selective:

```ts
interface Example {
  id: number;
  name: string;
  calculate(): number;
}

// All properties are optional
type WithPartial = Partial<Example>;
// ✅ Valid - can omit any property
const a: WithPartial = {}; 

// Only methods are optional
type WithOptionalMethods = OptionalMethods<Example>;
// ❌ Error - data properties are still required
const b: WithOptionalMethods = {}; 
// ✅ Valid - data properties provided
const c: WithOptionalMethods = { id: 1, name: 'test' };
```

