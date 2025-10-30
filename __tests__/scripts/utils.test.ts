import { formatDate, getReadingTime } from 'scripts/utils';
import * as utils from 'scripts/utils';
import fs from 'fs';
import path from 'path';

// Mock fs module
jest.mock('fs');
jest.mock('path');

// Mock gray-matter
jest.mock('gray-matter', () => ({
  __esModule: true,
  default: jest.fn((content: string) => {
    if (!content || typeof content !== 'string') {
      return {
        data: {},
        content: content || ''
      };
    }
    
    const lines = content.split('\n');
    let frontmatterEnd = -1;
    let inFrontmatter = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        if (!inFrontmatter) {
          inFrontmatter = true;
        } else {
          frontmatterEnd = i;
          break;
        }
      }
    }
    
    if (frontmatterEnd === -1) {
      return {
        data: {},
        content: content
      };
    }
    
    const frontmatterContent = lines.slice(1, frontmatterEnd).join('\n');
    const contentAfterFrontmatter = lines.slice(frontmatterEnd + 1).join('\n');
    
    // Simple YAML parsing for test data
    const data: any = {};
    frontmatterContent.split('\n').forEach(line => {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        if (value.startsWith('[') && value.endsWith(']')) {
          data[key.trim()] = value.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, ''));
        } else {
          const cleanValue = value.replace(/"/g, '');
          // Convert boolean strings to actual booleans
          if (cleanValue === 'true') {
            data[key.trim()] = true;
          } else if (cleanValue === 'false') {
            data[key.trim()] = false;
          } else {
            data[key.trim()] = cleanValue;
          }
        }
      }
    });
    
    return {
      data,
      content: contentAfterFrontmatter
    };
  })
}));

const mockFs = fs as jest.Mocked<typeof fs>;
const mockPath = path as jest.Mocked<typeof path>;

describe('scripts/utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock process.cwd
    jest.spyOn(process, 'cwd').mockReturnValue('/mock/project');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatDate', () => {
    beforeEach(() => {
      // Mock current date to make tests deterministic
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-10-29T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should format date without relative time', () => {
      const result = formatDate('2023-10-29', false);
      expect(result).toBe('29 October 2023');
    });

    it('should format date with relative time for today', () => {
      const result = formatDate('2023-10-29', true);
      expect(result).toBe('29 October 2023 (Today)');
    });

    it('should format date with relative time for days ago', () => {
      const result = formatDate('2023-10-27', true);
      expect(result).toBe('27 October 2023 (2d ago)');
    });

    it('should format date with relative time for months ago', () => {
      const result = formatDate('2023-09-29', true);
      expect(result).toBe('29 September 2023 (1mo ago)');
    });

    it('should format date with relative time for years ago', () => {
      const result = formatDate('2022-10-29', true);
      expect(result).toBe('29 October 2022 (1y ago)');
    });

    it('should handle date without time component', () => {
      const result = formatDate('2023-10-29', false);
      expect(result).toBe('29 October 2023');
    });

    it('should handle date with time component', () => {
      const result = formatDate('2023-10-29T10:30:00Z', false);
      expect(result).toBe('29 October 2023');
    });
  });

  describe('getReadingTime', () => {
    it('should calculate reading time for short text', () => {
      const text = 'This is a short text with ten words total.';
      const result = getReadingTime(text);
      expect(result).toBe(1); // Math.ceil(10 / 200) = 1
    });

    it('should calculate reading time for longer text', () => {
      const words = Array(400).fill('word').join(' ');
      const result = getReadingTime(words);
      expect(result).toBe(2); // Math.ceil(400 / 200) = 2
    });

    it('should handle empty text', () => {
      const result = getReadingTime('');
      expect(result).toBe(1); // Math.ceil(1 / 200) = 1 (minimum)
    });

    it('should handle text with multiple spaces', () => {
      const text = 'This    has    multiple    spaces    between    words';
      const result = getReadingTime(text);
      expect(result).toBe(1); // 6 words
    });

    it('should handle newlines and tabs', () => {
      const text = 'This\\nhas\\tmixed\\nwhitespace\\tcharacters';
      const result = getReadingTime(text);
      expect(result).toBe(1); // 4 words
    });
  });

  describe('getBlogPosts', () => {
    beforeEach(() => {
      mockPath.join.mockImplementation((...args) => args.join('/'));
    });

    it('should return empty array when directory does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = utils.getBlogPosts();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Directory not found: /mock/project/app/blog/content'
      );

      consoleSpy.mockRestore();
    });

    it('should return parsed blog posts', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['post1.md', 'post2.md', 'not-md.txt'] as any);
      
      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "First Post"
description: "First description"
date: "2023-10-29"
tags: ["tag1", "tag2"]
published: true
---
Content here`)
        .mockReturnValueOnce(`---
title: "Second Post"
description: "Second description"
date: "2023-10-28"
difficulty: "beginner"
---
More content`);

      const result = utils.getBlogPosts();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        slug: 'post1',
        metadata: {
          title: 'First Post',
          description: 'First description',
          date: '2023-10-29',
          tags: ['tag1', 'tag2'],
          published: true
        }
      });
      expect(result[1]).toEqual({
        slug: 'post2',
        metadata: {
          title: 'Second Post',
          description: 'Second description',
          date: '2023-10-28',
          difficulty: 'beginner'
        }
      });
    });

    it('should handle posts with missing metadata', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['minimal.md'] as any);
      
      mockFs.readFileSync.mockReturnValue(`---
---
Content without metadata`);

      const result = utils.getBlogPosts();

      expect(result).toHaveLength(1);
      expect(result[0].metadata).toEqual({
        title: 'Untitled',
        description: '',
        date: expect.any(String)
      });
    });

    it('should sort posts by date descending', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockReturnValue(['old.md', 'new.md'] as any);
      
      mockFs.readFileSync
        .mockReturnValueOnce(`---
title: "Old Post"
date: "2023-10-01"
---
Old content`)
        .mockReturnValueOnce(`---
title: "New Post"
date: "2023-10-29"
---
New content`);

      const result = utils.getBlogPosts();

      expect(result[0].metadata.title).toBe('New Post');
      expect(result[1].metadata.title).toBe('Old Post');
    });

    it('should handle errors gracefully', () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readdirSync.mockImplementation(() => {
        throw new Error('Read error');
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = utils.getBlogPosts();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith('Error getting blog posts:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('getBlogPost', () => {
    beforeEach(() => {
      mockPath.join.mockImplementation((...args) => args.join('/'));
    });

    it('should return null when file does not exist', async () => {
      mockFs.existsSync.mockReturnValue(false);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await utils.getBlogPost('nonexistent');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'File not found: /mock/project/app/blog/content/nonexistent.md'
      );

      consoleSpy.mockRestore();
    });

    it('should return parsed blog post', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(`---
title: "Test Post"
description: "Test description"
date: "2023-10-29"
difficulty: "intermediate"
tags: ["test", "example"]
---
This is the content of the post.`);

      const result = await utils.getBlogPost('test-post');

      expect(result).toEqual({
        slug: 'test-post',
        title: 'Test Post',
        description: 'Test description',
        date: '2023-10-29',
        content: 'This is the content of the post.',
        difficulty: 'intermediate',
        tags: ['test', 'example']
      });
    });

    it('should handle post with minimal metadata', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(`---
---
Just content here.`);

      const result = await utils.getBlogPost('minimal');

      expect(result).toEqual({
        slug: 'minimal',
        title: 'Untitled',
        description: '',
        date: expect.any(String),
        content: 'Just content here.',
        difficulty: undefined,
        tags: []
      });
    });

    it('should handle errors gracefully', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('Read error');
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await utils.getBlogPost('error-post');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading blog post error-post:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});