import Link from 'next/link';
import { getSnippetsByCategory, getAllCategories } from 'app/snippets-test/lib/markdown';
import { SnippetCard } from 'app/snippets-test/components/snippet-card';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map(category => ({ category }));
}

export async function generateMetadata({ params }) {
  return {
    title: `${params.category} Snippets`,
    description: `Code snippets related to ${params.category}`,
  };
}

export default async function CategoryPage({ params }) {
  const snippets = await getSnippetsByCategory(params.category);
  
  if (!snippets.length) {
    notFound();
  }
  
  return (
    <section>
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/snippets-test"
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          Snippets
        </Link>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <span className="text-neutral-500">Categories</span>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <span className="font-medium">{params.category}</span>
      </div>
      
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        {params.category.charAt(0).toUpperCase() + params.category.slice(1)} Snippets
      </h1>
      
      <div className="grid gap-4 grid-cols-1">
        {snippets.map(snippet => (
          <SnippetCard key={snippet.slug} snippet={snippet} />
        ))}
      </div>
    </section>
  );
}