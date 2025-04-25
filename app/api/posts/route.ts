/**
 * API endpoint for handling blog posts creation
 */

import { NextRequest } from 'next/server';
import { createContentHandler } from 'lib/content-handlers';
import { PostSchema } from 'lib/validation';

const handler = createContentHandler({
  contentType: 'blog',
  contentDir: 'blog',
  schema: PostSchema
});

export async function POST(req: NextRequest) {
  return handler(req);
}