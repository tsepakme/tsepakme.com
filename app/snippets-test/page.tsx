import Link from 'next/link';
import { getAllSnippets, getAllCategories } from './lib/markdown';

export const metadata = {
  title: "Code Snippets Test",
  description: "Useful code snippets for TypeScript, React, and modern web development",
};

export default async function SnippetsTestPage() {
  const snippets = await getAllSnippets();
  const categories = await getAllCategories();
  
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Code Snippets (MD)</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        A collection of useful code snippets and patterns I've found helpful in my development work.
        Click on a category to explore snippets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const categorySnippets = snippets.filter(snippet => snippet.meta.category === category);
          return (
            <a
              key={category}
              href={`/snippets-test/category/${category}`}
              className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-medium text-lg">{category}</h2>
                <span className="text-xs bg-neutral-100 dark:bg-neutral-800 rounded-full px-2 py-1">
                  {categorySnippets.length}
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                {getCategoryDescription(category)}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function getCategoryDescription(category: string): string {
  switch (category.toLowerCase()) {
    case 'typescript':
      return "Type utilities, patterns and advanced type manipulations";
    case 'react':
      return "Hooks, components, patterns and performance optimizations";
    case 'javascript':
      return "Core language features, patterns, and best practices";
    case 'css':
      return "Modern CSS techniques, layouts and animations";
    default:
      return `Code snippets related to ${category}`;
  }
}