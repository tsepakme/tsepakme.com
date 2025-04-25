/**
 * API endpoints for handling operations on a specific code snippet
 */

import { NextRequest } from 'next/server';
import { updateContentHandler, deleteContentHandler } from 'lib/content-handlers';
import { SnippetSchema } from 'lib/validation';

const updateHandler = updateContentHandler({
  contentType: 'snippet',
  contentDir: 'snippets',
  schema: SnippetSchema
});

const deleteHandler = deleteContentHandler({
  contentType: 'snippet',
  contentDir: 'snippets'
});

export async function PUT(req: NextRequest, context: { params: { slug: string } }) {
  return updateHandler(req, context);
}

export async function DELETE(req: NextRequest, context: { params: { slug: string } }) {
  return deleteHandler(req, context);
}