---
title: "React Without Re-renders? Meet Preact Signals"
description: "Discover how Preact Signals allow you to update granular parts of your UI without triggering React component re-renders."
date: "2025-10-17"
tags: ["react", "preact", "signals", "performance"]
published: true
---

# React Without Re-renders? Meet Preact Signals

React without re-renders is not clickbait. It's **Preact Signals**.

Signals are small reactive containers that know who is reading them and update only those specific places.

```javascript
import { signal } from '@preact/signals-react';

const count = signal(0);

function Counter() {
  console.log('render');

  return (
    <button onClick={() => count.value++}>
      Count: {count}
    </button>
  );
}
```

What gets logged when you click the button?

**Answer:** Nothing. The component will not render.

## How It Works

How is this possible? 😌

Let's dive into how Preact Signals achieves this. Before we start, we need to connect the Babel plugin: `'@preact/signals-react-transform'`.

This plugin intercepts JSX and detects when a signal is being used. The pseudo-code transformation looks something like this:

```javascript
function Counter() {
  const __sig_text = document.createTextNode(count.value);
  useSignalEffect(count, (v) => (__sig_text.data = v));

  return React.createElement(
    'button',
    null,
    'Count: ',
    __sig_text
  );
}
```

React doesn't see any state updates. For React, it's just a [TextNode](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode).

The plugin intercepts the signal, and ultimately, the value change results in a direct DOM update:

```javascript
textNode.data = newValue;
```

Preact Signals bypasses React's reconciliation process and performs a pinpoint update.

## Limitations

However, it's not all magic. There are some nuances you need to be aware of. This "magic" doesn't work everywhere.

If you pass a signal through props, **reactivity will be lost**.

### Why?

The Babel plugin only works at the place of JSX usage, not during transmission down the component tree. Therefore, this optimization works best for primitive data types used directly within the component, without being passed as props.

If you access the signal via `.value` inside the component body (not in JSX), a standard React re-render will occur, though it will still be granular to that component.

## Advanced Usage: State Management

Here is an example of how you might structure a store using signals:

```typescript
export type Task = {
  id: number;
  title: string;
  done: Signal<boolean>;
};

export class TaskStore {
  tasks = signal<Task[]>([]);
  isTasksDone = computed(() => this.tasks.value.some((t) => t.done.value));

  addTask = (title: string) => {
    if (!title) return;

    const newTask = {
      id: Date.now(),
      title,
      done: signal(false),
    };

    this.tasks.value = [...this.tasks.value, newTask];
  };

  toggleTask = (id: number) => {
    const task = this.tasks.value.find((t) => t.id === id);
    if (task) task.done.value = !task.done.value;
  };

  deleteDoneTasks = () => {
    this.tasks.value = this.tasks.value.filter((t) => !t.done.value);
  };
}
```

Signals allow us to effectively remove the need for complex selectors. However, you now need to determine which fields should be reactive to achieve pinpoint rendering.

There are also helper wrappers for rendering lists and conditional values efficiently:

```tsx
<For each={taskStore.tasks} fallback={"TaskList is empty"}>
  {(task) => <TaskItem key={task.id} task={task} />}
</For>

<Show when={taskStore.isTasksDone}>
  <button onClick={taskStore.deleteDoneTasks}>
    Delete selected tasks
  </button>
</Show>
```

## Conclusion

In my opinion, signals represent the future of state management, but integrating them with React can be complex.

Under the hood, `useSyncExternalStore` is still used, and achieving pinpoint rendering of DOM nodes won't work in every scenario. But this has always been React's philosophy: **optimize only critical places.**

Preact Signals offers a lightweight solution for describing logic outside of React's render cycle.

**Try it out.** Whatever anyone tells you, it's important to try tools yourself—simple examples are often enough to understand the potential.
