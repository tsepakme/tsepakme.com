import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

/**
 * Rehype plugin to add copy buttons to code blocks
 */
export function rehypeCopyButton() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'pre' && node.children) {
        const classes = node.properties?.className as string[] || [];
        node.properties = {
          ...node.properties,
          className: [...classes, 'relative', 'group']
        };

        const copyButton: Element = {
          type: 'element',
          tagName: 'button',
          properties: {
            className: [
              'copy-button',
              'absolute',
              'top-2',
              'right-2',
              'rounded-md',
              'bg-neutral-800',
              'px-2',
              'py-1',
              'text-xs',
              'text-white',
              'opacity-0',
              'group-hover:opacity-100',
              'transition-opacity',
              'hover:bg-neutral-700'
            ],
            'data-copy': 'true'
          },
          children: [{ type: 'text', value: 'Copy' }]
        };

        node.children.push(copyButton);
      }
    });
  };
}

/**
 * Rehype plugin to add target="_blank" to external links
 */
export function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'a' &&
        node.properties?.href &&
        typeof node.properties.href === 'string' &&
        node.properties.href.startsWith('http')
      ) {
        node.properties = {
          ...node.properties,
          target: '_blank',
          rel: 'noopener noreferrer'
        };
      }
    });
  };
}