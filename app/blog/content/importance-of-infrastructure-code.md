---
title: "The Importance of Infrastructural Code in React Applications"
description: "Understand what infrastructural code is and why it serves as the foundation for scalable React applications."
date: "2025-09-29"
tags: ["react", "architecture", "clean-code", "typescript"]
published: true
---

# The Importance of Infrastructural Code in React Applications

To understand its importance, we must first define what it is.

**Infrastructural code** consists of wrappers designed to hide low-level implementations.

## Examples

Here are a few common examples:

### Wrapper for AxiosResponse

```typescript
type ApiResponse<T> = Promise<AxiosResponse<T>>;
```

### Type-Safe Context Wrapper

A wrapper around `React.Context` for convenient and type-safe usage:

```typescript
export const useStrictContext = <T>(context: Context<T | null>) => {
  const value = useContext(context);

  if (value === null) {
    throw new Error("Context Error");
  }

  return value as T;
};

export const createStrictContext = <T>() => createContext<T | null>(null);
```

### List Component

A generic component for rendering lists:

```typescript
type Props<Data extends { id: number | string }> = {
  data: Data[];
  renderData: (item: Data) => ReactNode;
} & ComponentProps<"ul">;

export const List = <Data extends { id: number | string }>({
  data,
  renderData,
  className,
  ...props
}: Props<Data>) => {
  return (
    <ul className={cn("list-none", className)} {...props}>
      {data.map((item) => (
        <li key={item.id}>{renderData(item)}</li>
      ))}
    </ul>
  );
};
```

### Custom Hooks

For example, the [`useAsync`](https://github.com/siberiacancode/reactuse/blob/main/packages/core/src/hooks/useAsync/useAsync.ts) hook from `reactuse`:

```typescript
const { data, isLoading, isError, error } = useAsync(() => fetch('url'), [deps]);
```

A library of custom hooks is infrastructural code. A UI kit is also infrastructural code. A wrapper around `fetch` is infrastructural code. And so on...

## Why Is This Important?

Because you need to focus on **business tasks** and spend the minimum amount of effort on technical details.

Usually, infrastructural code is written at the start of a project. **It is its foundation.**

It is very difficult to build a skyscraper on a weak foundation. Many projects neglect this.

## The Cost of Neglect

Let's look at the `useAsync` example. Its implementation hides about **18 lines of code** from us.

Imagine that we have 60 requests in our application.

> 60 * 18 = 1080 lines of code.

Now do you understand how important this is?

One small custom hook can save a huge number of lines of code.

And what if you **DO NOT** write all the necessary wrappers for each low-level module and **DO NOT** make them extensible so that they can be configured (Open/Closed Principle)?

If you analyze it, you will see a scary number of redundant lines of code that you write over and over again.

## Conclusion

So, write infrastructural code.

*   **Cognitive load** during work will decrease.
*   **Speed** and **comfort** of work will increase.

Infrastructure is an important part of architecture that shows its true value at a large scale and over a long period.
