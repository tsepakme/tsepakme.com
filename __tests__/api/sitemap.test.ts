import sitemap from 'app/sitemap';

// Mock the blog utilities
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

describe('Sitemap', () => {
  it('should return an array of sitemap entries', async () => {
    const result = await sitemap();
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should include static pages in sitemap', async () => {
    const result = await sitemap();
    
    const urls = result.map(entry => entry.url);
    
    // Check for main pages that sitemap actually generates
    expect(urls.some(url => url === 'https://tsepakme.com')).toBe(true); // homepage
    expect(urls.some(url => url === 'https://tsepakme.com/blog')).toBe(true);
  });

  it('should include blog posts in sitemap', async () => {
    const result = await sitemap();
    
    const urls = result.map(entry => entry.url);
    
    // Check for blog posts
    expect(urls.some(url => url.includes('/blog/test-post-1'))).toBe(true);
    expect(urls.some(url => url.includes('/blog/test-post-2'))).toBe(true);
  });

  it('should have proper sitemap entry structure', async () => {
    const result = await sitemap();
    
    result.forEach(entry => {
      expect(entry).toHaveProperty('url');
      expect(entry).toHaveProperty('lastModified');
      expect(typeof entry.url).toBe('string');
      expect(typeof entry.lastModified).toBe('string');
    });
  });

  it('should handle empty blog posts gracefully', async () => {
    // Override mock to return empty array
    const mockGetBlogPosts = require('scripts/utils').getBlogPosts;
    mockGetBlogPosts.mockReturnValueOnce([]);

    const result = await sitemap();
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0); // Should still have static pages
    
    const urls = result.map(entry => entry.url);
    expect(urls.some(url => url.includes('/blog/test-post'))).toBe(false); // No blog posts
  });

  it('should have valid date format for lastModified', async () => {
    const result = await sitemap();
    
    result.forEach(entry => {
      // Should be valid date string
      expect(new Date(entry.lastModified).toString()).not.toBe('Invalid Date');
    });
  });
});