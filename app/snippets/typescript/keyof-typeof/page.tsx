import { SnippetContent } from './SnippetContent';

export const metadata = {
  title: "keyof typeof Pattern - TypeScript Snippet",
  description: "Learn how to create type-safe string union types from object keys in TypeScript",
};

export default function KeyofTypeofSnippetPage() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-8">
        <a
          href="/snippets"
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          Snippets
        </a>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <a
          href="/snippets/typescript"
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          TypeScript
        </a>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <h1 className="font-semibold text-2xl tracking-tighter">keyof typeof</h1>
      </div>

      <SnippetContent />
    </section>
  );
}