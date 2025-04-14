'use client';

import { useEffect, useRef } from 'react';
import 'highlight.js/styles/github-dark.css';

interface MarkdownViewProps {
  html: string;
}

export function MarkdownView({ html }: MarkdownViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!contentRef.current) return;
    
    const codeBlocks = contentRef.current.querySelectorAll('pre');
    
    codeBlocks.forEach(pre => {
      if (pre.querySelector('.copy-button')) return;
      
      pre.classList.add('relative', 'group');
      
      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.className = 'copy-button absolute top-2 right-2 rounded-md bg-neutral-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity';
      
      copyButton.addEventListener('click', () => {
        const code = pre.querySelector('code');
        if (code) {
          navigator.clipboard.writeText(code.textContent || '');
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 2000);
        }
      });
      
      pre.appendChild(copyButton);
    });
    
    const links = contentRef.current.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }, [html]);
  
  return (
    <div 
      ref={contentRef}
      className="markdown"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}