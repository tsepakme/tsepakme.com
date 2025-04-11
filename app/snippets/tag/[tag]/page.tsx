import { TagSnippets } from "app/components/tag-snippets";
import Link from "next/link";

export function generateMetadata({ params }: { params: { tag: string } }) {
  return {
    title: `#${params.tag} Snippets`,
    description: `Code snippets tagged with ${params.tag}`,
  };
}

export default function TagPage({ params }: { params: { tag: string } }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/snippets"
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          Snippets
        </Link>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <span className="text-neutral-500">Tags</span>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <span className="font-medium">{params.tag}</span>
      </div>
      
      <TagSnippets tag={params.tag} />
    </section>
  );
}