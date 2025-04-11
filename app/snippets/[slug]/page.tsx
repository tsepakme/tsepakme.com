import { getSnippets, CATEGORIES_MAP } from "app/snippets/utils";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { ServerMDX } from "app/components/server-mdx";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const snippets = getSnippets();
  const snippet = snippets.find((s) => s?.slug === params.slug);

  if (!snippet) {
    return {
      title: "Snippet Not Found",
    };
  }

  return {
    title: snippet.metadata.title,
    description: snippet.metadata.description,
  };
}

export default async function SnippetPage({ params }: { params: { slug: string } }) {
  const snippets = getSnippets();
  const snippet = snippets.find((s) => s?.slug === params.slug);

  if (!snippet) {
    notFound();
  }

  const categoryInfo = CATEGORIES_MAP[snippet.metadata.category];

  const filePath = path.join(process.cwd(), "app/snippets/content", `${params.slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");

  return (
    <section>
      <div className="flex items-center gap-2 mb-8">
        <a
          href="/snippets"
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          Snippets
        </a>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <a
          href={`/snippets/category/${snippet.metadata.category}`}
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          {categoryInfo?.name || snippet.metadata.category}
        </a>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <h1 className="font-semibold text-2xl tracking-tighter">{snippet.metadata.title}</h1>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ServerMDX source={source} />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {snippet.metadata.tags?.map(tag => (
          <span key={tag} className="text-xs bg-neutral-100 dark:bg-neutral-800 rounded-full px-2 py-1">
            #{tag}
          </span>
        ))}
      </div>
    </section>
  );
}