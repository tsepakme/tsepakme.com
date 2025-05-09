import Link from 'next/link';
import { getAllSnippets, getAllCategories } from './lib/markdown';

export const metadata = {
  title: "Code Snippets",
  description: "Useful code snippets for TypeScript, React, and modern web development",
};

export default async function SnippetstPage() {
  const snippets = await getAllSnippets();
  const categories = await getAllCategories();
  
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Code Snippets</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        A collection of useful code snippets and patterns I've found helpful in my development work.
        Click on a category to explore snippets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const categorySnippets = snippets.filter(snippet => snippet.meta.category === category);
          return (
            <Link
              key={category}
              href={`/snippets/category/${category}`}
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
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function getCategoryDescription(category: string): string {
  switch(category) {
    case 'typescript':
      return 'TypeScript utility types and advanced patterns';
    case 'javascript':
      return 'Modern JavaScript solutions and optimizations';
    case 'react':
      return 'React hooks, patterns, and performance tips';
    default:
      return 'Code snippets and examples';
  }
}