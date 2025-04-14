import Link from 'next/link';

interface TagProps {
  tag: string;
  slug: string;
}

export default function Tag({ tag, slug }: TagProps) {
  if (!tag) {
    return null;
  }
  return (
    <Link
      href={`/${slug}/tag/${tag}`}
      className="bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1 mr-1 mb-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-sm transition-colors"
    >
      #{tag}
    </Link>
  );
}