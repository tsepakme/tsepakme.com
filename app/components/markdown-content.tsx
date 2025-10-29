import { MarkdownView } from './markdown-view-server';
import { CopyButtons } from './markdown-view';

interface MarkdownContentProps {
  html: string;
  className?: string;
}

/**
 * Hybrid component: Server-rendered HTML with client-side interactivity
 * - HTML structure and external links: Server-side
 * - Copy button functionality: Client-side
 */
export function MarkdownContent({ html, className = "prose prose-neutral dark:prose-invert max-w-none" }: MarkdownContentProps) {
  return (
    <CopyButtons className={`markdown ${className}`}>
      <MarkdownView html={html} className="" />
    </CopyButtons>
  );
}