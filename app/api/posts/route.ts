import { NextResponse } from 'next/server';
import { PostSchema } from 'lib/validation';
import { savePost } from 'lib/content-manager';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/options';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    const validatedData = PostSchema.parse(data);
    
    const slug = createSlug(validatedData.title);
    
    await savePost(slug, validatedData);
    
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create post' }, 
      { status: 500 }
    );
  }
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}