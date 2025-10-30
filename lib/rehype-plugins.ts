import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

// Plugin to add copy buttons to code blocks
export function rehypeCopyButton() {
  return (tree: Root) => {
    const nodesToReplace: Array<{ parent: Element | Root; index: number; wrapper: Element }> = [];
    
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName === 'pre' && 
          node.children[0]?.type === 'element' && 
          node.children[0].tagName === 'code' && 
          parent && typeof index === 'number') {
        
        // Create a copy button
        const copyButton: Element = {
          type: 'element',
          tagName: 'button',
          properties: {
            className: ['copy-button'],
            'data-copy': true,
            'aria-label': 'Copy code'
          },
          children: [
            {
              type: 'text',
              value: 'Copy'
            }
          ]
        };

        // Create a completely new pre element to avoid circular references
        const newPre: Element = {
          type: 'element',
          tagName: 'pre',
          properties: { ...node.properties },
          children: [...node.children]
        };

        // Create wrapper
        const wrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['code-block-wrapper']
          },
          children: [newPre, copyButton]
        };

        nodesToReplace.push({ parent, index, wrapper });
      }
    });

    // Apply replacements after visiting is complete
    nodesToReplace.forEach(({ parent, index, wrapper }) => {
      parent.children[index] = wrapper;
    });
  };
}

// Plugin to add target="_blank" and rel="noopener noreferrer" to external links
export function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a' && node.properties?.href) {
        const href = String(node.properties.href);
        
        // Check if it's an external link (starts with http/https and not the current domain)
        if (href.startsWith('http://') || href.startsWith('https://')) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
        }
      }
    });
  };
}