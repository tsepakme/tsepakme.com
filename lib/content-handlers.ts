/**
 * Shared handlers for content management (blog posts and snippets)
 * Implements DRY principle by centralizing common logic
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { createOrUpdateFile, deleteFile, getFileContent } from './github';
import { createSlug } from 'lib/utils';
import { withAdminAuth, errorResponse, successResponse, parseJsonBody } from 'lib/api-helpers';
import { logger } from './logger';

interface ContentCreateOptions {
  contentType: 'blog' | 'snippet';
  contentDir: string;
  schema: ZodSchema;
}

/**
 * Builds frontmatter from content data
 */
function buildFrontmatter(data: Record<string, any>): string {
  const frontmatter: string[] = [];

  frontmatter.push(`title: "${data.title.replace(/"/g, '\\"')}"`);
  
  if (data.description) {
    frontmatter.push(`description: "${data.description.replace(/"/g, '\\"')}"`);
  }
  
  if (data.date) {
    frontmatter.push(`date: "${data.date}"`);
  }
  
  if (data.tags && Array.isArray(data.tags)) {
    frontmatter.push(`tags: [${data.tags.map((t: string) => `"${t.replace(/"/g, '\\"')}"`).join(', ')}]`);
  }
  
  if (data.category) {
    frontmatter.push(`category: "${data.category}"`);
  }
  
  if (data.difficulty) {
    frontmatter.push(`difficulty: "${data.difficulty}"`);
  }
  
  if ('published' in data) {
    frontmatter.push(`published: ${!!data.published}`);
  }
  
  if (data.image) {
    frontmatter.push(`image: "${data.image}"`);
  }

  return frontmatter.join('\n');
}

/**
 * Creates markdown content with frontmatter
 */
function createMarkdownContent(data: Record<string, any>): string {
  const frontmatter = buildFrontmatter(data);
  return `---\n${frontmatter}\n---\n\n${data.content || ''}`;
}

/**
 * Generic handler for creating content (posts or snippets)
 */
export function createContentHandler(options: ContentCreateOptions) {
  return async (req: NextRequest): Promise<NextResponse> => {
    return withAdminAuth(req, async () => {
      try {
        const data = await parseJsonBody(req);
        if (!data) {
          return errorResponse('Invalid request body', 400);
        }

        const validData = options.schema.parse(data);
        
        const slug = createSlug(validData.title);
        const filePath = `app/${options.contentDir}/content/${slug}.md`;
        
        const content = createMarkdownContent(validData);
        
        logger.info(`Creating ${options.contentType}`, { 
          title: validData.title, 
          slug 
        });
        
        await createOrUpdateFile(
          filePath,
          content,
          `Add ${options.contentType}: ${validData.title}`
        );
        
        return successResponse({ success: true, slug });
      } catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
          return errorResponse({
            message: 'Validation error',
            details: error.message
          }, 400);
        }
        
        return errorResponse(
          error instanceof Error ? error.message : `Failed to create ${options.contentType}`, 
          500
        );
      }
    });
  };
}

/**
 * Generic handler for updating content (posts or snippets)
 */
export function updateContentHandler(options: ContentCreateOptions) {
  return async (req: NextRequest, { params }: { params: { slug: string } }): Promise<NextResponse> => {
    return withAdminAuth(req, async () => {
      try {
        const slug = params.slug;
        if (!slug) {
          return errorResponse('Missing slug parameter', 400);
        }
        
        const data = await parseJsonBody(req);
        if (!data) {
          return errorResponse('Invalid request body', 400);
        }

        const validData = options.schema.parse(data);
        
        const filePath = `app/${options.contentDir}/content/${slug}.md`;
        
        const content = createMarkdownContent(validData);
        
        logger.info(`Updating ${options.contentType}`, { slug });
        
        await createOrUpdateFile(
          filePath,
          content,
          `Update ${options.contentType}: ${validData.title}`
        );
        
        return successResponse({ success: true, slug });
      } catch (error) {
        return errorResponse(
          error instanceof Error ? error.message : `Failed to update ${options.contentType}`, 
          500
        );
      }
    });
  };
}

/**
 * Generic handler for deleting content (posts or snippets)
 */
export function deleteContentHandler(options: {contentType: string, contentDir: string}) {
  return async (req: NextRequest, { params }: { params: { slug: string } }): Promise<NextResponse> => {
    return withAdminAuth(req, async () => {
      try {
        const slug = params.slug;
        if (!slug) {
          return errorResponse('Missing slug parameter', 400);
        }
        
        const filePath = `app/${options.contentDir}/content/${slug}.md`;
        
        const file = await getFileContent(filePath);
        if (!file) {
          return errorResponse(`${options.contentType} not found`, 404);
        }
        
        logger.info(`Deleting ${options.contentType}`, { slug });
        
        await deleteFile(
          filePath,
          `Delete ${options.contentType}: ${slug}`,
          file.sha
        );
        
        return successResponse({ success: true });
      } catch (error) {
        return errorResponse(
          error instanceof Error ? error.message : `Failed to delete ${options.contentType}`, 
          500
        );
      }
    });
  };
}