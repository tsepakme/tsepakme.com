'use client';

import { useEffect, useRef } from 'react';
import 'highlight.js/styles/github-dark.css';

interface CopyButtonsProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Client component that adds copy functionality to code blocks
 * All HTML structure is generated on the server
 */
export function CopyButtons({ children, className }: CopyButtonsProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!contentRef.current) return;
    
    const copyButtons = contentRef.current.querySelectorAll('button[data-copy="true"]');
    
    copyButtons.forEach(button => {
      const handleClick = () => {
        const pre = button.closest('pre');
        const code = pre?.querySelector('code');
        
        if (code) {
          navigator.clipboard.writeText(code.textContent || '');
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        }
      };
      
      button.addEventListener('click', handleClick);
      
      return () => {
        button.removeEventListener('click', handleClick);
      };
    });
  }, []);
  
  return (
    <div ref={contentRef} className={className}>
      {children}
    </div>
  );
}