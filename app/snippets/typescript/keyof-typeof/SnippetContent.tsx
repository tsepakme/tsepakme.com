'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight, materialDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Объект с доступными темами
const themes = {
  'VSCode Dark': vscDarkPlus,
  'One Light': oneLight,
  'Material Dark': materialDark,
  'Prism Default': prism
};

type ThemeName = keyof typeof themes;

export default function SnippetContent() {
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('VSCode Dark');

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

  const exampleCode = `// Define once, use everywhere
const STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  PENDING: "pending"
} as const;

type StatusType = keyof typeof STATUS;

function StatusIndicator({ status }: { status: StatusType }) {
  return (
    <div className={status === "SUCCESS" ? "text-green" : status === "ERROR" ? "text-red" : "text-yellow"}>
      {STATUS[status]}
    </div>
  );
}

// Type error if you try to use an invalid status
<StatusIndicator status="INVALID" /> // Error!
<StatusIndicator status="SUCCESS" /> // Works!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <div className="mb-8">
        <Link href="/snippets/typescript" className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
          ← Back to TypeScript Snippets
        </Link>
      </div>

      <h1 className="font-semibold text-2xl mb-4 tracking-tighter">keyof typeof - Creating Type from Object Keys</h1>
      <div className="text-neutral-600 dark:text-neutral-400 mb-8">
        <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-sm mr-2">
          Intermediate
        </span>
      </div>

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

      <div className="flex items-center justify-end space-x-2 mb-2">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">Theme:</span>
        <select
          value={currentTheme}
          onChange={(e) => setCurrentTheme(e.target.value as ThemeName)}
          className="px-3 py-1.5 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md hover:border-neutral-300 dark:hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
        >
          {Object.keys(themes).map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
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
            style={themes[currentTheme]}
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

        <p>
          For instance, in a React component:
        </p>

        <div className="rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language="typescript"
            style={themes[currentTheme]}
            customStyle={{
              margin: 0,
              padding: '1rem',
              borderRadius: '0.5rem',
            }}
          >
            {exampleCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  );
}