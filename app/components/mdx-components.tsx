'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';  // Добавьте этот импорт

// Компонент кнопки копирования
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="absolute top-2 right-2 rounded-md bg-neutral-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// Определяем компоненты напрямую
export const components = {
  a: ({ href, ...props }) => {
    if (href?.startsWith('/')) {
      return <Link href={href} {...props} />;
    }
    if (href?.startsWith('#')) {
      return <a {...props} />;
    }
    return <a target="_blank" rel="noopener noreferrer" {...props} />;
  },
  Image: (props) => <Image alt={props.alt || ''} className="rounded-lg" {...props} />,
  img: (props) => <Image alt={props.alt || ''} className="rounded-lg" width={700} height={350} {...props} />,
  pre: ({ children }) => {
    const code = children?.props?.children || '';
    return (
      <div className="relative group">
        <pre>{children}</pre>
        <CopyButton text={typeof code === 'string' ? code : ''} />
      </div>
    );
  },
  code: ({ children, className }) => {
    const language = className ? className.replace('language-', '') : '';
    
    if (!className) {
      return <code className="font-mono text-sm bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded">{children}</code>;
    }
    
    return <code className={className}>{children}</code>;
  }
};

// Убедитесь, что все компоненты экспортируются явно
export function ServerMDX({ source, components: userComponents = {} }) {
  if (!source) {
    return <div>No content available</div>;
  }
  
  const combinedComponents = { ...components, ...(userComponents || {}) };
  return (
    <div className="mdx-content">
      <MDXRemote
        source={source}
        components={combinedComponents}
      />
    </div>
  );
}
