import { getSnippet, getAllSnippetSlugs } from '../utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TagLink } from 'app/components/tag-link';
import { MDXRemote } from 'next-mdx-remote/rsc';

// Компоненты для MDX
const components = {
  a: ({ href, ...props }) => {
    if (href.startsWith('/')) {
      return <Link href={href} {...props} />;
    }
    if (href.startsWith('#')) {
      return <a {...props} />;
    }
    return <a target="_blank" rel="noopener noreferrer" {...props} />;
  },
  // Другие компоненты при необходимости
};

// Генерация статических путей
export async function generateStaticParams() {
  const slugs = getAllSnippetSlugs();
  return slugs.map(slug => ({ slug }));
}

// Метаданные для страницы
export async function generateMetadata({ params }) {
  const snippet = await getSnippet(params.slug);
  
  if (!snippet) {
    return {
      title: 'Snippet Not Found',
      description: 'The requested snippet could not be found'
    };
  }
  
  return {
    title: snippet.metadata.title,
    description: snippet.metadata.description
  };
}

// Компонент страницы
export default async function SnippetPage({ params }) {
  console.log('Rendering snippet page for slug:', params.slug);
  
  const snippet = await getSnippet(params.slug);
  
  if (!snippet) {
    console.error('Snippet not found, redirecting to 404');
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
        <MDXRemote source={snippet.content} components={components} />
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