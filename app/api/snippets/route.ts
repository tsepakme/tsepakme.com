/**
 * API endpoint for handling code snippets creation
 */

import { NextRequest } from 'next/server';
import { createContentHandler } from 'lib/content-handlers';
import { SnippetSchema } from 'lib/validation';

const handler = createContentHandler({
  contentType: 'snippet',
  contentDir: 'snippets',
  schema: SnippetSchema
});

export async function POST(req: NextRequest) {
  return handler(req);
}