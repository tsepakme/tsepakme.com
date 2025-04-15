import path from 'path';
import { createMarkdownManager, BaseMeta, BaseContent } from 'lib/markdown-factory';

const SNIPPETS_DIR = path.join(process.cwd(), 'app/snippets/content');

export interface SnippetMeta extends BaseMeta {
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Snippet extends BaseContent<SnippetMeta> {}

type SnippetMetaInput = {
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  published?: boolean;
};

function createSnippetMeta(data: SnippetMetaInput): SnippetMeta {
  return {
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category || 'uncategorized',
    tags: data.tags || [],
    difficulty: data.difficulty,
    published: data.published !== false
  };
}

function createSnippet(slug: string, meta: SnippetMeta, content: string, html: string): Snippet {
  return { slug, meta, content, html };
}

const snippetsManager = createMarkdownManager<SnippetMeta, Snippet>(
  SNIPPETS_DIR, 
  createSnippetMeta, 
  createSnippet
);

export const getAllSnippets = snippetsManager.getAllItems;
export const getSnippetBySlug = snippetsManager.getItemBySlug;
export const getAllTags = snippetsManager.getAllTags;
export const getSnippetsByTag = snippetsManager.getItemsByTag;
export const getAllSnippetSlugs = snippetsManager.getAllSlugs;

export async function getAllCategories(): Promise<string[]> {
  const snippets = await getAllSnippets();
  const categories = snippets.map(snippet => snippet.meta.category);
  return Array.from(new Set(categories));
}

export async function getSnippetsByCategory(category: string): Promise<Snippet[]> {
  const snippets = await getAllSnippets();
  return snippets.filter(snippet => snippet.meta.category === category);
}
