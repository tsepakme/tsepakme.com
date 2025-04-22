import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to protect against XSS
 */
export function sanitizeHtml(html: string): string {
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
    ADD_ATTR: ['target'],
  });
  
  return DOMPurify.sanitize(html);
}

/**
 * Sanitizes Markdown frontmatter data
 */
export function sanitizeFrontmatter(data: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = DOMPurify.sanitize(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? DOMPurify.sanitize(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}