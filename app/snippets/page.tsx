import Link from 'next/link';

export const metadata = {
  title: "Code Snippets",
  description: "Useful snippets for TypeScript, React, and more",
};

export default function SnippetsPage() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Code Snippets</h1>
      <p className="mb-8">
        A collection of useful code snippets and patterns I've found helpful in my development work.
      </p>

      <h2 className="font-medium text-xl mb-4">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "TypeScript", slug: "typescript", description: "Type utilities and patterns" },
          { name: "React", slug: "react", description: "Components and hooks" },
          { name: "Next.js", slug: "nextjs", description: "App router and page optimization" },
          { name: "CSS", slug: "css", description: "Styling tricks and techniques" },
        ].map((category) => (
          <Link
            href={`/snippets/${category.slug}`}
            key={category.name}
            className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors no-underline"
          >
            <div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}