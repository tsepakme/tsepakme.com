export function BlogPosts({ posts }) {
  return (
    <div className="flex flex-col gap-4">
      {(posts || [])
        .filter(post => post && post.slug) // Убираем undefined и пустые посты
        .sort((a, b) => {
          // Проверяем, существуют ли metadata и publishedAt
          const dateA = a.metadata?.publishedAt ? new Date(a.metadata.publishedAt) : new Date(0);
          const dateB = b.metadata?.publishedAt ? new Date(b.metadata.publishedAt) : new Date(0);
          
          // Сортировка по убыванию (от новых к старым)
          return dateB - dateA;
        })
        .map((post) => (
          <div key={post.slug} className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <a
                href={`/blog/${post.slug}`}
                className="text-neutral-900 dark:text-neutral-100 text-base sm:text-lg font-medium underline-offset-4 hover:underline"
              >
                {post.metadata?.title || 'Untitled Post'}
              </a>
              {post.metadata?.publishedAt && (
                <time
                  dateTime={post.metadata.publishedAt}
                  className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base tabular-nums"
                >
                  {new Date(post.metadata.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
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
