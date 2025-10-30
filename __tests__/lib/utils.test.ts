import { createSlug, sanitizeHtml, formatDate, maskSensitiveValue } from 'lib/utils';

describe('lib/utils', () => {
  describe('createSlug', () => {
    it('should convert text to lowercase slug', () => {
      expect(createSlug('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(createSlug('Hello! World?')).toBe('hello-world');
    });

    it('should replace multiple spaces with single hyphen', () => {
      expect(createSlug('Hello   World   Test')).toBe('hello-world-test');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(createSlug('  -Hello World-  ')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(createSlug('')).toBe('');
    });

    it('should handle numbers', () => {
      expect(createSlug('Version 1.2.3')).toBe('version-123');
    });

    it('should handle unicode characters', () => {
      expect(createSlug('Héllo Wørld')).toBe('hllo-wrld');
    });
  });

  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', () => {
      const html = '<p>Hello <strong>world</strong></p>';
      expect(sanitizeHtml(html)).toBe('<p>Hello <strong>world</strong></p>');
    });

    it('should remove script tags', () => {
      const html = '<p>Hello</p><script>alert("xss")</script>';
      expect(sanitizeHtml(html)).toBe('<p>Hello</p>');
    });

    it('should remove dangerous attributes', () => {
      const html = '<a href="javascript:alert(1)" onclick="evil()">Link</a>';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('onclick');
    });

    it('should preserve allowed attributes', () => {
      const html = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>';
      const result = sanitizeHtml(html);
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('rel="noopener"');
    });

    it('should handle empty string', () => {
      expect(sanitizeHtml('')).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date string', () => {
      const result = formatDate('2023-10-29');
      expect(result).toMatch(/October 29, 2023/);
    });

    it('should handle datetime string', () => {
      const result = formatDate('2023-10-29T10:30:00Z');
      expect(result).toMatch(/October 29, 2023/);
    });

    it('should use custom locale', () => {
      const result = formatDate('2023-10-29', 'en-GB');
      expect(result).toMatch(/29 October 2023/);
    });

    it('should handle invalid date gracefully', () => {
      const invalidDate = 'not-a-date';
      const result = formatDate(invalidDate);
      expect(result).toBe('Invalid Date');
    });

    it('should use default locale when not specified', () => {
      const result = formatDate('2023-10-29');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('maskSensitiveValue', () => {
    it('should mask long values showing first and last 3 characters', () => {
      const result = maskSensitiveValue('abcdefghijklmnop');
      expect(result).toBe('abc****nop');
    });

    it('should return false for undefined', () => {
      expect(maskSensitiveValue(undefined)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(maskSensitiveValue('')).toBe(false);
    });

    it('should mask short values completely', () => {
      expect(maskSensitiveValue('abc')).toBe('******');
      expect(maskSensitiveValue('abcdef')).toBe('******');
    });

    it('should handle exactly 7 characters', () => {
      const result = maskSensitiveValue('abcdefg');
      expect(result).toBe('abc****efg');
    });

    it('should handle API keys and tokens', () => {
      const token = 'sk-1234567890abcdef1234567890abcdef';
      const result = maskSensitiveValue(token);
      expect(result).toBe('sk-****def');
    });
  });
});