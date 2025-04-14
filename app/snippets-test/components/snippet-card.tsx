import Link from 'next/link';

export function SnippetCard({ snippet }) {
  const meta = snippet.metadata || snippet.meta;
  
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:shadow-sm">
      <Link
        href={`/snippets-test/${snippet.slug}`}
        className="group"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-lg group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
            {meta.title}
          </h3>
          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-xs">
            <span className="capitalize">{meta.category}</span>
          </div>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
          {meta.description}
        </p>
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        {meta.difficulty && (
          <div className={`rounded-full px-2 py-0.5 text-xs capitalize ${getDifficultyColor(meta.difficulty)}`}>
            {meta.difficulty}
          </div>
        )}

        <div className="h-4 border-r border-neutral-200 dark:border-neutral-700 mx-1"></div>

        <div className="flex flex-wrap gap-1">
          {meta.tags?.map(tag => (
            <Link
              key={tag}
              href={`/snippets-test/tag/${tag}`}
              className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 text-xs"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <Link
          href={`/snippets-test/${snippet.slug}`}
          className="ml-auto text-neutral-600 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors flex items-center"
        >
          View snippet
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
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