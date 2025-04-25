/**
 * API endpoints for handling operations on a specific blog post
 */

import { NextRequest } from 'next/server';
import { updateContentHandler, deleteContentHandler } from 'lib/content-handlers';
import { PostSchema } from 'lib/validation';

const updateHandler = updateContentHandler({
  contentType: 'blog',
  contentDir: 'blog',
  schema: PostSchema
});

const deleteHandler = deleteContentHandler({
  contentType: 'blog',
  contentDir: 'blog'
});

export async function PUT(req: NextRequest, context: { params: { slug: string } }) {
  return updateHandler(req, context);
}

export async function DELETE(req: NextRequest, context: { params: { slug: string } }) {
  return deleteHandler(req, context);
}