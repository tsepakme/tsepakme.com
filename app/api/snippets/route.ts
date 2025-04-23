import { NextResponse } from 'next/server';
import { SnippetSchema } from 'lib/validation';
import { saveSnippet } from 'lib/content-manager';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/options';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    const validatedData = SnippetSchema.parse(data);
    
    const slug = createSlug(validatedData.title);
    
    await saveSnippet(slug, validatedData);
    
    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Error creating snippet:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create snippet' }, 
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