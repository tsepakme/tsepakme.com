import Link from 'next/link';
import { Post } from 'app/blog/lib/markdown';

export function PostCard({ post }: { post: Post }) {
  return (
    <div className="group mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-sm">
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
        
        <Link href={`/blog/${post.slug}`} className="block">
          <h2 className="font-medium text-xl tracking-tight transition-colors group-hover:text-neutral-800 dark:group-hover:text-neutral-200">
            {post.meta.title}
          </h2>
        </Link>
        
        <p className="text-neutral-600 dark:text-neutral-400">
          {post.meta.description}
        </p>
        
        {post.meta.tags && post.meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.meta.tags.map(tag => (
              <Link 
                key={tag}
                href={`/blog/tag/${tag}`}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}