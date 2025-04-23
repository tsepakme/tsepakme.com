import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostData, SnippetData } from 'lib/validation';

const BLOG_DIR = path.join(process.cwd(), 'app/blog/content');
const SNIPPETS_DIR = path.join(process.cwd(), 'app/snippets/content');

/**
 * Saves a blog post to the file system
 */
export async function savePost(slug: string, data: PostData): Promise<void> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  const fileExists = fs.existsSync(filePath);

  const frontmatter = {
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags,
    published: data.published,
  };

  if (data.image) {
    frontmatter["image"] = data.image;
  }

  const markdown = matter.stringify(data.content, frontmatter);

  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, markdown);
}

/**
 * Saves a code snippet to the file system
 */
export async function saveSnippet(slug: string, data: SnippetData): Promise<void> {
  const filePath = path.join(SNIPPETS_DIR, `${slug}.md`);
  const fileExists = fs.existsSync(filePath);

  const frontmatter = {
    title: data.title,
    description: data.description,
    date: data.date,
    category: data.category,
    tags: data.tags,
    difficulty: data.difficulty,
    published: data.published,
  };

  const markdown = matter.stringify(data.content, frontmatter);

  if (!fs.existsSync(SNIPPETS_DIR)) {
    fs.mkdirSync(SNIPPETS_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, markdown);
}

/**
 * Deletes a blog post from the file system
 */
export async function deletePost(slug: string): Promise<void> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    throw new Error(`Post with slug "${slug}" not found`);
  }
}

/**
 * Deletes a code snippet from the file system
 */
export async function deleteSnippet(slug: string): Promise<void> {
  const filePath = path.join(SNIPPETS_DIR, `${slug}.md`);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    throw new Error(`Snippet with slug "${slug}" not found`);
  }
}