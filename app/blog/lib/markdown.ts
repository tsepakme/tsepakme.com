import path from 'path';
import { createMarkdownManager, BaseMeta, BaseContent } from 'lib/markdown-factory';

const BLOG_DIR = path.join(process.cwd(), 'app/blog/content');

export interface PostMeta extends BaseMeta {
  image?: string;
}

export interface Post extends BaseContent<PostMeta> {}

interface PostMetaInput {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  published?: boolean;
  image?: string;
}

function createPostMeta(data: PostMetaInput): PostMeta {
  return {
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date || new Date().toISOString().split('T')[0],
    tags: data.tags || [],
    published: data.published !== false,
    image: data.image
  };
}

function createPost(slug: string, meta: PostMeta, content: string, html: string): Post {
  return { slug, meta, content, html };
}

const blogManager = createMarkdownManager<PostMeta, Post>(BLOG_DIR, createPostMeta, createPost);

export const getAllPosts = blogManager.getAllItems;
export const getPostBySlug = blogManager.getItemBySlug;
export const getAllTags = blogManager.getAllTags;
export const getPostsByTag = blogManager.getItemsByTag;
export const getAllPostSlugs = blogManager.getAllSlugs;