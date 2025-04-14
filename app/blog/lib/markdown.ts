import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const BLOG_DIR = path.join(process.cwd(), 'app/blog/content');

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  published?: boolean;
  image?: string;
}

export interface Post {
  slug: string;
  meta: PostMeta;
  content: string;
  html: string;
}

export async function getAllPosts(): Promise<Post[]> {
  const files = fs.readdirSync(BLOG_DIR);
  const mdFiles = files.filter(file => file.endsWith('.md'));
  
  const posts = await Promise.all(
    mdFiles.map(async file => {
      const slug = file.replace(/\.md$/, '');
      return await getPostBySlug(slug);
    })
  );
  
  return posts
    .filter((post): post is Post => post !== null && (post.meta.published !== false))
    .sort((a, b) => {
      return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  
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
      tags: data.tags || [],
      published: data.published !== false,
      image: data.image
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
    .use(rehypeHighlight, { detect: true, ignoreMissing: true } as any)
    .use(rehypeStringify)
    .process(markdown);
  
  return result.toString();
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = posts.flatMap(post => post.meta.tags);
  return Array.from(new Set(tags));
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.meta.tags.includes(tag));
}

export async function getAllPostSlugs(): Promise<string[]> {
  const files = fs.readdirSync(BLOG_DIR);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}