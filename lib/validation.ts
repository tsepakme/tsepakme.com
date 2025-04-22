import { z } from 'zod';

/**
 * Validation schema for blog posts
 */
export const PostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long'),
  content: z.string().min(1, 'Content is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(true),
  image: z.string().optional(),
});

/**
 * Validation schema for code snippets
 */
export const SnippetSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long'),
  content: z.string().min(1, 'Content is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(true),
});

/**
 * Type for post data
 */
export type PostData = z.infer<typeof PostSchema>;

/**
 * Type for snippet data
 */
export type SnippetData = z.infer<typeof SnippetSchema>;

/**
 * Checks if a slug contains only valid characters
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9\-_]+$/;
  return slugRegex.test(slug);
}

/**
 * Creates a slug from a string
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}