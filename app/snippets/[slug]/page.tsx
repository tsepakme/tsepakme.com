import { getSnippet, getAllSnippetSlugs } from 'app/snippets/utils';
import { notFound } from 'next/navigation';
import { ServerMDX } from 'app/components/mdx-components';
import { TagLink } from 'app/components/tag-link';
import Link from 'next/link';

export async function generateStaticParams() {
  const snippets = getAllSnippetSlugs();
  return snippets.map((slug) => ({ slug }));
}

export default async function SnippetPage({ params }: { params: { slug: string } }) {
  const snippet = await getSnippet(params.slug);
  
  if (!snippet) {
    notFound();
  }
  
  return (
    <section>
      <div className="flex flex-col gap-2 mb-8">
        <Link 
          href="/snippets"
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          ← Back to snippets
        </Link>
        <h1 className="font-semibold text-2xl tracking-tighter mt-2">{snippet.metadata.title}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{snippet.metadata.description}</p>
        
        <div className="flex items-center gap-2 mt-4">
          <div className="rounded-full px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs">
            {snippet.metadata.category}
          </div>
          {snippet.metadata.difficulty && (
            <div className="rounded-full px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs capitalize">
              {snippet.metadata.difficulty}
            </div>
          )}
        </div>
      </div>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {snippet.content && <ServerMDX source={snippet.content} />}
      </div>
      
      {snippet.metadata.tags && snippet.metadata.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {snippet.metadata.tags.map(tag => (
            <TagLink key={tag} tag={tag}>
              #{tag}
            </TagLink>
          ))}
        </div>
      )}
    </section>
  );
}