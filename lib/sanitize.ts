import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to protect against XSS
 */
export function sanitizeHtml(html: string): string {
  // Configure DOMPurify to allow specific tags and attributes
  DOMPurify.setConfig({
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 'blockquote',
      'hr', 'br', 'strong', 'em', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img', 'span', 'div', 'del', 'kbd', 'sup', 'sub'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'title', 'src', 'alt', 'class', 'id', 'rel',
      'data-language', 'data-highlighted'
    ],
    ALLOW_DATA_ATTR: true,
    ADD_ATTR: ['target'], // Add target for links
  });
  
  // Sanitize HTML
  return DOMPurify.sanitize(html);
}

/**
 * Sanitizes Markdown frontmatter data
 */
export function sanitizeFrontmatter(data: Record<string, any>): Record<string, any> {
  // Create a new object for sanitized data
  const sanitized: Record<string, any> = {};
  
  // Check and sanitize each field
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Sanitize string values
      sanitized[key] = DOMPurify.sanitize(value);
    } else if (Array.isArray(value)) {
      // Sanitize arrays of strings
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? DOMPurify.sanitize(item) : item
      );
    } else {
      // Keep other data types as is
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}