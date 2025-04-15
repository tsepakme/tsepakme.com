import Link from 'next/link';
import { Post } from 'app/blog/lib/markdown';
import { formatDate, getReadingTime } from 'scripts/utils';
import Tag from 'app/components/tag';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group mb-8 pb-8 border-b border-neutral-100 dark:border-neutral-800">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <time
            dateTime={post.meta.date}
            className="text-neutral-600 dark:text-neutral-400"
          >
            {formatDate(post.meta.date, false)}
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
              <Tag tag={tag} key={tag} slug="blog" />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
