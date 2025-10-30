import robots from 'app/robots';

describe('Robots.txt', () => {
  it('should return robots configuration object', () => {
    const result = robots();
    
    expect(result).toHaveProperty('rules');
    expect(result).toHaveProperty('sitemap');
    expect(Array.isArray(result.rules)).toBe(true);
  });

  it('should have User-agent rule', () => {
    const result = robots();
    
    expect(result.rules.length).toBeGreaterThan(0);
    expect(result.rules[0]).toHaveProperty('userAgent');
    expect(result.rules[0].userAgent).toBe('*');
  });

  it('should contain sitemap URL', () => {
    const result = robots();
    
    expect(result.sitemap).toContain('sitemap.xml');
    expect(result.sitemap).toMatch(/^https?:\/\//);
  });

  it('should have proper structure for Next.js robots', () => {
    const result = robots();
    
    // Verify it matches Next.js robots.txt expected format
    expect(typeof result).toBe('object');
    expect(result.rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userAgent: expect.any(String)
        })
      ])
    );
    expect(typeof result.sitemap).toBe('string');
  });
});