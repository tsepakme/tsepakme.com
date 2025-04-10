'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function SnippetContent() {
  const [copied, setCopied] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  const snippetCode = `const STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  PENDING: "pending"
} as const;

type StatusType = keyof typeof STATUS;

// StatusType = "SUCCESS" | "ERROR" | "PENDING"

// Usage example
function handleStatus(status: StatusType) {
  // Type safe - only "SUCCESS", "ERROR", or "PENDING" allowed
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="prose prose-neutral dark:prose-invert mb-8">
        <p>
          The <code>keyof typeof</code> pattern is a powerful way to create a union type from the keys of an object.
          This is especially useful when you have constants that you want to reference in a type-safe way.
        </p>

        <h2>When to use</h2>
        <ul>
          <li>When you have a constant object and want to create a type from its keys</li>
          <li>For creating type-safe enums</li>
          <li>For ensuring consistency between runtime values and compile-time types</li>
        </ul>

        <h2>How it works</h2>
        <p>
          <code>typeof STATUS</code> gets the type of the object, then <code>keyof</code> creates a union type of all the property names.
          This ensures that if you add, remove, or change keys in the object, the type updates automatically.
        </p>
      </div>

      <div className="flex justify-end mb-2">
        <button
          onClick={() => setDarkTheme(!darkTheme)}
          className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          {darkTheme ? 'Light theme' : 'Dark theme'}
        </button>
      </div>

      <div className="relative mb-8">
        <div className="absolute right-4 top-4 z-10">
          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 bg-neutral-800 dark:bg-neutral-700 text-white text-sm rounded hover:bg-neutral-700 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 transition-all"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language="typescript"
            style={darkTheme ? vscDarkPlus : oneLight}
            customStyle={{
              margin: 0,
              padding: '1rem',
              borderRadius: '0.5rem',
            }}
          >
            {snippetCode}
          </SyntaxHighlighter>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert">
        <h2>Example use case</h2>
        <p>
          This pattern is particularly useful for creating a type-safe API around status codes, API endpoints, or any other constant values that shouldn't be hardcoded throughout your application.
        </p>

        <h3>Real-world example</h3>
        <p>
          Imagine you're building a dashboard with different status indicators. You want to ensure that only valid statuses are used, and if you add a new status, TypeScript should help you update all the places that handle statuses.
        </p>
      </div>
    </>
  );
}