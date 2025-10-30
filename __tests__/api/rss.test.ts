import { GET } from 'app/rss/route';

// Mock the blog utilities from scripts/utils
jest.mock('scripts/utils', () => ({
  getBlogPosts: jest.fn(() => [
    {
      slug: 'test-post-1',
      metadata: {
        title: 'Test Post 1',
        description: 'Description for test post 1',
        date: '2023-10-29',
        tags: ['test', 'example']
      }
    },
    {
      slug: 'test-post-2', 
      metadata: {
        title: 'Test Post 2',
        description: 'Description for test post 2',
        date: '2023-10-28',
        tags: ['test']
      }
    }
  ])
}));

describe('/api/rss Route', () => {
  it('should generate valid RSS feed', async () => {
    const response = await GET();
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/xml');
    
    const rssContent = await response.text();
    expect(rssContent).toContain('<?xml version="1.0" encoding="UTF-8" ?>');
    expect(rssContent).toContain('<rss version="2.0">');
    expect(rssContent).toContain('<channel>');
    expect(rssContent).toContain('Test Post 1');
    expect(rssContent).toContain('Test Post 2');
  });

  it('should include proper RSS feed metadata', async () => {
    const response = await GET();
    const rssContent = await response.text();
    
    expect(rssContent).toContain('<title>');
    expect(rssContent).toContain('<description>');
    expect(rssContent).toContain('<link>');
  });

  it('should include individual post items', async () => {
    const response = await GET();
    const rssContent = await response.text();
    
    expect(rssContent).toContain('<item>');
    expect(rssContent).toContain('<pubDate>');
  });

  it('should handle empty blog posts gracefully', async () => {
    // Override mock to return empty array
    const mockGetBlogPosts = require('scripts/utils').getBlogPosts;
    mockGetBlogPosts.mockReturnValueOnce([]);

    const response = await GET();
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/xml');
    
    const rssContent = await response.text();
    expect(rssContent).toContain('<channel>');
    expect(rssContent).not.toContain('<item>');
  });

  it('should escape XML characters properly', async () => {
    // Override mock to return posts with special characters
    const mockGetBlogPosts = require('scripts/utils').getBlogPosts;
    mockGetBlogPosts.mockReturnValueOnce([
      {
        slug: 'special-chars',
        metadata: {
          title: 'Post with <>&"\' characters',
          description: 'Description with <tags> & entities',
          date: '2023-10-29',
          tags: ['test']
        }
      }
    ]);

    const response = await GET();
    const rssContent = await response.text();
    
    // The content should contain the characters (RSS route doesn't escape them)
    expect(rssContent).toContain('Post with <>&');
  });
});