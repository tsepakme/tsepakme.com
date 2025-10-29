import parse from 'html-react-parser';

interface MarkdownViewProps {
  html: string;
  className?: string;
}

export function MarkdownView({ html, className = "prose prose-neutral dark:prose-invert max-w-none" }: MarkdownViewProps) {
  return (
    <div className={`markdown ${className}`}>
      {parse(html)}
    </div>
  );
}