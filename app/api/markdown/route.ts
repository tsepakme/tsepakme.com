import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { markdown } = body;
    
    if (!markdown) {
      return NextResponse.json({ error: 'No markdown provided' }, { status: 400 });
    }
    
    const html = await markdownToHtml(markdown);
    
    return NextResponse.json({ html });
  } catch (error) {
    console.error('Error processing markdown:', error);
    return NextResponse.json({ error: 'Failed to process markdown' }, { status: 500 });
  }
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true } as any)
    .use(rehypeStringify)
    .process(markdown);
  
  return result.toString();
}