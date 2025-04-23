import { NextResponse } from 'next/server';
import { PostSchema } from 'lib/validation';
import { savePost, deletePost } from 'lib/content-manager';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/options';

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    const validatedData = PostSchema.parse(data);
    
    await savePost(params.slug, validatedData);
    
    return NextResponse.json({ success: true, slug: params.slug });
  } catch (error) {
    console.error(`Error updating post ${params.slug}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update post' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await deletePost(params.slug);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting post ${params.slug}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete post' }, 
      { status: 500 }
    );
  }
}