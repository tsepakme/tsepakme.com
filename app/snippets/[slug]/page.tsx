import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSnippetBySlug, getAllSnippetSlugs } from 'app/snippets/lib/markdown';
import { MarkdownContent } from 'app/components/markdown-content';
import Tag from 'app/components/tag';

export async function generateStaticParams() {
  const slugs = await getAllSnippetSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const snippet = await getSnippetBySlug(slug);

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

export default async function SnippetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const snippet = await getSnippetBySlug(slug);

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

      <MarkdownContent html={snippet.html} />

      {snippet.meta.tags && snippet.meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {snippet.meta.tags.map(tag => (
            <Tag tag={tag} key={tag} slug='snippets' />
          ))}
        </div>
      )}
    </section>
  );
}

function getDifficultyColor(difficulty?: string): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
  }
}