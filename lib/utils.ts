/**
 * General utility functions used throughout the application
 */

import { sanitize } from 'isomorphic-dompurify';

/**
 * Creates a URL-friendly slug from a string
 * @param text Text to convert to slug
 * @returns Sanitized slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

/**
 * Sanitizes HTML content to prevent XSS
 * @param html HTML content to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'a', 
      'ul', 'ol', 'li', 'code', 'pre', 'blockquote',
      'strong', 'em', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'class'
    ]
  });
}

/**
 * Formats a date string in the desired format
 * @param dateStr Date string in ISO format
 * @param locale Locale for formatting
 * @returns Formatted date string
 */
export function formatDate(dateStr: string, locale: string = 'en-US'): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateStr;
  }
}

/**
 * Masks sensitive values (like tokens or passwords) for logs or display
 * @param value The value to mask
 * @returns Masked string with only first and last 3 characters visible
 */
export function maskSensitiveValue(value?: string): string | boolean {
export function maskSensitiveValue(value?: string): string {
  if (!value) return 'N/A';
  if (value.length <= 6) return '******';
  
  return `${value.substring(0, 3)}****${value.substring(value.length - 3)}`;
}