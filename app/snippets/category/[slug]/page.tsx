import { CategorySnippets } from "app/components/snippets";
import { CATEGORIES_MAP } from "app/snippets/utils";
import { notFound } from "next/navigation";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const category = CATEGORIES_MAP[params.slug];
  
  if (!category) {
    return {
      title: "Category Not Found",
    };
  }
  
  return {
    title: `${category.name} Snippets`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = CATEGORIES_MAP[params.slug];
  
  if (!category) {
    notFound();
  }
  
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
        <h1 className="font-semibold text-2xl tracking-tighter">{category.name}</h1>
      </div>
      
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">{category.description}</p>
      
      <CategorySnippets category={params.slug} />
    </section>
  );
}