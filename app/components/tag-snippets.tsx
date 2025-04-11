import { getTagSnippets } from "app/snippets/utils";
import { SnippetsList } from "./snippets-list";

export function TagSnippets({ tag }: { tag: string }) {
  const snippets = getTagSnippets(tag);
  const validSnippets = snippets.filter((snippet): snippet is { slug: string; metadata: any } => snippet !== null);
  
  const title = `#${tag}`;
  const description = `Collection of code snippets tagged with ${tag}`;
  
  return <SnippetsList snippets={validSnippets} title={title} description={description} />;
}