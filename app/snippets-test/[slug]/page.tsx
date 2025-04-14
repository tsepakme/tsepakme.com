import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSnippetBySlug, getAllSnippetSlugs } from '../lib/markdown';
import { MarkdownView } from '../components/markdown-view';

export async function generateStaticParams() {
  const slugs = await getAllSnippetSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const snippet = await getSnippetBySlug(params.slug);
  
  if (!snippet) {
    return {
      title: 'Snippet Not Found',
      description: 'The requested snippet could not be found'
    };
  }

  return {
    title: snippet.meta.title,
    description: snippet.meta.description,
  };
}

export default async function SnippetPage({ params }: { params: { slug: string } }) {
  const snippet = await getSnippetBySlug(params.slug);
  
  if (!snippet) {
    notFound();
  }
  
  return (
    <section>
      <div className="flex flex-col gap-2 mb-8">
        <Link 
          href="/snippets-test"
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          ← Back to snippets
        </Link>
        <h1 className="font-semibold text-2xl tracking-tighter mt-2">{snippet.meta.title}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{snippet.meta.description}</p>
        
        <div className="flex items-center gap-2 mt-4">
          <div className="rounded-full px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs">
            {snippet.meta.category}
          </div>
          {snippet.meta.difficulty && (
            <div className={`rounded-full px-2 py-0.5 text-xs capitalize ${getDifficultyColor(snippet.meta.difficulty)}`}>
              {snippet.meta.difficulty}
            </div>
          )}
        </div>
      </div>
      
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MarkdownView html={snippet.html} />
      </div>
      
      {snippet.meta.tags && snippet.meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {snippet.meta.tags.map(tag => (
            <Link 
              key={tag}
              href={`/snippets-test/tag/${tag}`}
              className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner':
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    case 'intermediate':
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    case 'advanced':
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
  }
}