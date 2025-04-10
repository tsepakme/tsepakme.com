export const metadata = {
  title: "TypeScript Snippets",
  description: "Useful TypeScript patterns, utilities and advanced type techniques",
};

interface Snippet {
  title: string;
  description: string;
  slug: string;
  date: string;
}

const snippets: Snippet[] = [
  {
    title: "keyof typeof Pattern",
    description: "Create type-safe string union types from object keys",
    slug: "keyof-typeof",
    date: "2024-04-02"
  },
  {
    title: "Conditional Types",
    description: "Advanced type transformations using conditional logic",
    slug: "conditional-types",
    date: "2024-03-18"
  },
  {
    title: "Generic Factory Function",
    description: "Type-safe factory pattern with inference",
    slug: "generic-factory",
    date: "2024-02-25"
  },
  {
    title: "DeepPartial Utility",
    description: "Make all properties in nested objects optional",
    slug: "deep-partial",
    date: "2024-01-30"
  },
  {
    title: "Discriminated Unions",
    description: "Type-safe handling of different object shapes",
    slug: "discriminated-unions",
    date: "2023-12-15"
  },
  {
    title: "Mapped Type Modifiers",
    description: "Add, remove or modify type properties dynamically",
    slug: "mapped-type-modifiers",
    date: "2023-11-20"
  },
  {
    title: "Template Literal Types",
    description: "Generate string types with powerful pattern matching",
    slug: "template-literal-types",
    date: "2023-10-10"
  },
  {
    title: "Assertion Functions",
    description: "Custom type guards that throw exceptions",
    slug: "assertion-functions",
    date: "2023-09-05"
  }
];

export default function TypeScriptSnippetsPage() {
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
        <h1 className="font-semibold text-2xl tracking-tighter">TypeScript</h1>
      </div>

      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        A collection of TypeScript patterns, utilities and advanced type techniques that I use regularly.
      </p>

      <div className="flex flex-col gap-4">
        {snippets.map((snippet) => (
          <a
            key={snippet.slug}
            href={`/snippets/typescript/${snippet.slug}`}
            className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <h2 className="font-medium text-lg">{snippet.title}</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">{snippet.description}</p>
            <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-2">{snippet.date}</p>
          </a>
        ))}
      </div>
    </section>
  );
}