import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { rehypeCopyButton, rehypeExternalLinks } from './rehype-plugins';

export interface BaseMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  published?: boolean;
}

export interface BaseContent<T extends BaseMeta> {
  slug: string;
  meta: T;
  content: string;
  html: string;
}

interface MarkdownFrontmatter {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  published?: boolean;
  [key: string]: unknown;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true } as any)
    .use(rehypeCopyButton)
    .use(rehypeExternalLinks)
    .use(rehypeStringify)
    .process(markdown);
  
  return result.toString();
}

export function createMarkdownManager<TMeta extends BaseMeta, TContent extends BaseContent<TMeta>>(
  contentDir: string,
  metaFactory: (data: MarkdownFrontmatter) => TMeta,
  contentFactory: (slug: string, meta: TMeta, content: string, html: string) => TContent
) {
  async function getAllItems(): Promise<TContent[]> {
    const files = fs.readdirSync(contentDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const items = await Promise.all(
      mdFiles.map(async file => {
        const slug = file.replace(/\.md$/, '');
        return await getItemBySlug(slug);
      })
    );
    
    const filteredItems = items
      .filter((item): item is Awaited<TContent> => item !== null && (item.meta.published !== false));
    
    return filteredItems.sort((a, b) => {
      return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    });
  }

  async function getItemBySlug(slug: string): Promise<TContent | null> {
    const filePath = path.join(contentDir, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const { data, content } = matter(fileContent);
    
    const html = await markdownToHtml(content);
    const meta = metaFactory(data as MarkdownFrontmatter);
    
    return contentFactory(slug, meta, content, html);
  }

  async function getAllTags(): Promise<string[]> {
    const items = await getAllItems();
    const tags = items.flatMap(item => item.meta.tags);
    return Array.from(new Set(tags));
  }

  async function getItemsByTag(tag: string): Promise<TContent[]> {
    const items = await getAllItems();
    return items.filter(item => item.meta.tags.includes(tag));
  }

  async function getAllSlugs(): Promise<string[]> {
    const files = fs.readdirSync(contentDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  }

  return {
    getAllItems,
    getItemBySlug,
    getAllTags,
    getItemsByTag,
    getAllSlugs
  };
}