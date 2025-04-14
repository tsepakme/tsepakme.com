import Link from 'next/link';
import { getSnippetsByTag, getAllTags } from 'app/snippets/lib/markdown';
import { SnippetCard } from 'app/snippets/components/snippet-card';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(tag => ({ tag }));
}

export async function generateMetadata({ params }) {
  return {
    title: `#${params.tag} Snippets`,
    description: `Code snippets tagged with #${params.tag}`,
  };
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const snippets = await getSnippetsByTag(params.tag);
  
  if (!snippets.length) {
    notFound();
  }
  
  return (
    <section>
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/snippets"
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          Snippets
        </Link>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <span className="text-neutral-500">Tags</span>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <span className="font-medium">#{params.tag}</span>
      </div>
      
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        #{params.tag}
      </h1>
      
      <div className="grid gap-4 grid-cols-1">
        {snippets.map(snippet => (
          <SnippetCard 
            key={snippet.slug} 
            snippet={snippet} 
          />
        ))}
      </div>
    </section>
  );
}