import Link from 'next/link';

export const metadata = {
  title: "TypeScript Code Snippets",
  description: "Useful snippets for TypeScript",
};

export default function TypeScriptSnippetsPage() {
  const snippets = [
    {
      id: "keyof-typeof",
      title: "keyof typeof - Creating Type from Object Keys",
      description: "Create a union type from object keys",
      difficulty: "Intermediate"
    },
    {
      id: "deep-partial",
      title: "DeepPartial - Recursive Partial Type",
      description: "Make all properties in nested objects optional",
      difficulty: "Advanced"
    },
    {
      id: "conditional-types",
      title: "Conditional Types",
      description: "Creating types that depend on conditions",
      difficulty: "Advanced"
    },
    {
      id: "utility-types",
      title: "Essential Utility Types",
      description: "Common utility types like Pick, Omit, Exclude",
      difficulty: "Beginner"
    },
    {
      id: "discriminated-unions",
      title: "Discriminated Unions",
      description: "Type-safe pattern for handling different states",
      difficulty: "Intermediate"
    }
  ];

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">TypeScript Snippets</h1>
      <p className="mb-8">
        A collection of useful TypeScript patterns and type utilities to improve your code quality and developer experience.
      </p>

      <div className="space-y-4">
        {snippets.map((snippet) => (
          <Link
            href={`/snippets/typescript/${snippet.id}`}
            key={snippet.id}
            className="block border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors no-underline"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{snippet.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">{snippet.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${snippet.difficulty === 'Beginner'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : snippet.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                {snippet.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}