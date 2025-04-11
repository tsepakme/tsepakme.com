import { getCategorySnippets } from "app/snippets/utils";
import { SnippetsList } from "./snippets-list";

export function CategorySnippets({ category }: { category: string }) {
  const allSnippets = getCategorySnippets(category);
  const snippets = allSnippets.filter((snippet): snippet is { slug: string; metadata: any } => 
    snippet !== null
  );
  
  const title = `${category.charAt(0).toUpperCase() + category.slice(1)} Snippets`;
  const description = `Collection of code snippets for ${category}`;
  
  return <SnippetsList snippets={snippets} title={title} description={description} />;
}