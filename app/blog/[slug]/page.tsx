import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPostSlugs } from 'app/blog/lib/markdown';
import { MarkdownView } from 'app/blog/components/markdown-view';
import Tag from 'app/components/tag';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found'
    };
  }

  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

export default async function PostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <Link
        href="/blog"
        className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-8 block"
      >
        ← Back to blog
      </Link>

      <div className="mb-8">
        <h1 className="font-medium text-2xl tracking-tighter">
          {post.meta.title}
        </h1>

        <div className="flex items-center mt-2 space-x-2 text-sm">
          <time
            dateTime={post.meta.date}
            className="text-neutral-600 dark:text-neutral-400"
          >
            {new Date(post.meta.date).toLocaleDateString("en-GB", {
              year: 'numeric',
              month: 'long',
              day: '2-digit',
            })}
          </time>
          <span className="text-neutral-500 dark:text-neutral-500">•</span>
          <span className="text-neutral-600 dark:text-neutral-400">
            {getReadingTime(post.content)} min read
          </span>
        </div>
      </div>

      <MarkdownView html={post.html} />

      {post.meta.tags && post.meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {post.meta.tags.map(tag => (
            <Tag key={tag} tag={tag} slug='blog' />
          ))}
        </div>
      )}
    </article>
  );
}

function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}