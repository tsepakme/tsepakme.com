export const metadata = {
  title: "Code Snippets",
  description: "Useful code snippets for TypeScript, React, and modern web development",
};

interface SnippetCategory {
  name: string;
  description: string;
  slug: string;
  count: number;
}

const categories: SnippetCategory[] = [
  {
    name: "TypeScript",
    description: "Type utilities, patterns and advanced type manipulations",
    slug: "typescript",
    count: 8
  },
  {
    name: "React",
    description: "Hooks, components, patterns and performance optimizations",
    slug: "react",
    count: 6
  },
  {
    name: "Next.js",
    description: "App router, server components, and data fetching",
    slug: "nextjs",
    count: 4
  },
  {
    name: "CSS",
    description: "Modern CSS techniques, layouts and animations",
    slug: "css",
    count: 5
  }
];

export default function SnippetsPage() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Code Snippets</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        A collection of useful code snippets and patterns I've found helpful in my development work.
        Click on a category to explore snippets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <a
            key={category.slug}
            href={`/snippets/${category.slug}`}
            className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-medium text-lg">{category.name}</h2>
              <span className="text-xs bg-neutral-100 dark:bg-neutral-800 rounded-full px-2 py-1">
                {category.count} snippets
              </span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">{category.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}