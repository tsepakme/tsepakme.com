import { formatDate } from 'scripts/utils';

export function BlogPosts({ posts }) {
  return (
    <div className="flex flex-col gap-4">
      {(posts || [])
        .filter(post => post && post.slug)
        .sort((a, b) => {
          const dateA = a.metadata?.date ? new Date(a.metadata.date) : new Date(0);
          const dateB = b.metadata?.date ? new Date(b.metadata.date) : new Date(0);

          return dateB.getTime() - dateA.getTime();
        })
        .map((post, index, array) => (
          <div 
            key={post.slug} 
            className={`flex flex-col gap-2 pb-4 ${
              index < array.length - 1 ? 'border-b border-neutral-200 dark:border-neutral-700 mb-3' : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <a
                href={`/blog/${post.slug}`}
                className="text-neutral-900 dark:text-neutral-100 text-base sm:text-lg font-medium underline-offset-4 hover:underline"
              >
                {post.metadata?.title || 'Untitled Post'}
              </a>
              {post.metadata?.date && (
                <time
                  dateTime={post.metadata.date}
                  className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base tabular-nums"
                >
                  {formatDate(post.metadata.date, false)}
                </time>
              )}
            </div>
            {post.metadata?.description && (
              <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {post.metadata.description}
              </p>
            )}
          </div>
        ))}
    </div>
  );
}
