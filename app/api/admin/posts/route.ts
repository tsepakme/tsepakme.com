import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/options';
import { csrf } from 'lib/csrf';
import { apiLimiter } from 'lib/rate-limiter';
import { getBlogPosts } from 'scripts/utils';
import { createOrUpdateFile } from 'lib/github';
import { sanitizeHtml, sanitizeFrontmatter } from 'lib/sanitize';
import { PostSchema, createSlug } from 'lib/validation';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'unknown';
  if (apiLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    );
  }
  
  try {
    const posts = getBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const csrfToken = request.headers.get('x-csrf-token');
  if (!await csrf.validate(csrfToken)) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'unknown';
  if (apiLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    );
  }
  
  try {
    const requestData = await request.json();
    const validData = PostSchema.parse(requestData);
    const sanitizedContent = sanitizeHtml(validData.content);
    const sanitizedFrontmatter = sanitizeFrontmatter(validData);
    const slug = createSlug(validData.title);
    const frontmatter = `---
title: "${sanitizedFrontmatter.title}"
description: "${sanitizedFrontmatter.description}"
date: "${sanitizedFrontmatter.date}"
tags: [${sanitizedFrontmatter.tags.map((t: string) => `"${t}"`).join(', ')}]
published: ${sanitizedFrontmatter.published}
${sanitizedFrontmatter.image ? `image: "${sanitizedFrontmatter.image}"` : ''}
---

${sanitizedContent}`;
    
    await createOrUpdateFile(
      `app/blog/content/${slug}.md`,
      frontmatter,
      `Add post: ${sanitizedFrontmatter.title}`
    );
    
    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    console.error('Error creating post:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}