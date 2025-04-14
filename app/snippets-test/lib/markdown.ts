import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const SNIPPETS_DIR = path.join(process.cwd(), 'app/snippets-test/content');

export interface SnippetMeta {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  author?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Snippet {
  slug: string;
  meta: SnippetMeta;
  content: string;
  html: string;
}

export async function getAllSnippets(): Promise<Snippet[]> {
  const files = fs.readdirSync(SNIPPETS_DIR);
  const mdFiles = files.filter(file => file.endsWith('.md'));
  
  const snippets = await Promise.all(
    mdFiles.map(async file => {
      const slug = file.replace(/\.md$/, '');
      return await getSnippetBySlug(slug);
    })
  );
  
  return snippets.filter(Boolean).sort((a, b) => {
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });
}

export async function getSnippetBySlug(slug: string): Promise<Snippet | null> {
  const filePath = path.join(SNIPPETS_DIR, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const { data, content } = matter(fileContent);
  
  const html = await markdownToHtml(content);
  
  return {
    slug,
    meta: {
      title: data.title,
      description: data.description || '',
      date: data.date,
      category: data.category || 'uncategorized',
      tags: data.tags || [],
      author: data.author,
      difficulty: data.difficulty
    },
    content,
    html
  };
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeStringify)
    .process(markdown);
  
  return result.toString();
}

export async function getAllCategories(): Promise<string[]> {
  const snippets = await getAllSnippets();
  const categories = snippets.map(snippet => snippet.meta.category);
  return [...new Set(categories)];
}

export async function getAllTags(): Promise<string[]> {
  const snippets = await getAllSnippets();
  const tags = snippets.flatMap(snippet => snippet.meta.tags);
  return [...new Set(tags)];
}

export async function getSnippetsByCategory(category: string): Promise<Snippet[]> {
  const snippets = await getAllSnippets();
  return snippets.filter(snippet => snippet.meta.category === category);
}

export async function getSnippetsByTag(tag: string): Promise<Snippet[]> {
  const snippets = await getAllSnippets();
  return snippets.filter(snippet => snippet.meta.tags.includes(tag));
}

export async function getAllSnippetSlugs(): Promise<string[]> {
  const files = fs.readdirSync(SNIPPETS_DIR);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}
