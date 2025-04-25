'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MarkdownView } from 'app/components/markdown-view';
import { Bold, Italic, Heading, List, ListOrdered, Code, Quote, FileCode, Link, Heading1, ListOrderedIcon, CodeSquare } from 'lucide-react';

interface MarkdownEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function MarkdownEditor({ 
  initialValue = '', 
  onChange,
  placeholder = 'Write your content here...',
  minHeight = '400px'
}: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState(initialValue);
  const [preview, setPreview] = useState(false);
  const [html, setHtml] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue !== markdown) {
      setMarkdown(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const response = await fetch('/api/markdown', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown }),
        });
        
        if (!response.ok) throw new Error('Failed to render markdown');
        
        const data = await response.json();
        setHtml(data.html);
      } catch (error) {
        console.error('Error rendering markdown:', error);
      }
    };

    if (preview && markdown) {
      fetchHtml();
    }
  }, [markdown, preview]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMarkdown(newValue);
    onChange(newValue);
  };

  const insertMarkdownSyntax = (syntax: string, placeholder = '', wrapSelection = true) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    let insertion = '';
    let newCursorPos = 0;
    
    if (wrapSelection && selectedText) {
      insertion = syntax.replace(placeholder, selectedText);
      newCursorPos = start + insertion.length;
    } else {
      insertion = syntax;
      newCursorPos = start + syntax.indexOf(placeholder) + placeholder.length;
    }
    
    const newText = text.substring(0, start) + insertion + text.substring(end);
    setMarkdown(newText);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 10);
  };

  const toolbar = [
    { icon: <Bold size={18} />, title: 'Bold', action: () => insertMarkdownSyntax('**placeholder**', 'placeholder') },
    { icon: <Italic size={18} />, title: 'Italic', action: () => insertMarkdownSyntax('*placeholder*', 'placeholder') },
    { icon: <Heading1 size={18} />, title: 'Heading', action: () => insertMarkdownSyntax('## placeholder', 'placeholder') },
    { icon: <List size={18} />, title: 'List', action: () => insertMarkdownSyntax('- placeholder', 'placeholder') },
    { icon: <ListOrderedIcon size={18} />, title: 'Numbered List', action: () => insertMarkdownSyntax('1. placeholder', 'placeholder') },
    { icon: <Code size={18} />, title: 'Code', action: () => insertMarkdownSyntax('`placeholder`', 'placeholder') },
    { icon: <Quote size={18} />, title: 'Quote', action: () => insertMarkdownSyntax('> placeholder', 'placeholder') },
    { 
      icon: <CodeSquare size={18} />, 
      title: 'Code Block', 
      action: () => insertMarkdownSyntax('```typescript\nplaceholder\n```', 'placeholder') 
    },
    { 
      icon: <Link size={18} />, 
      title: 'Link', 
      action: () => insertMarkdownSyntax('[placeholder](url)', 'placeholder') 
    },
  ];

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2">
        <div className="flex items-center space-x-1 overflow-auto">
          {toolbar.map((item, index) => (
            <button
              key={index}
              type="button"
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              title={item.title}
              onClick={item.action}
            >
              <span className=" text-gray-700 dark:text-gray-300 text-sm">
                {item.icon}
              </span>
            </button>
          ))}
        </div>
        <div>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm rounded ${
              preview
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setPreview(!preview)}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="relative w-full" style={{ minHeight }}>
        {preview ? (
          <div className="p-4 overflow-auto h-full bg-white dark:bg-gray-900">
            <MarkdownView html={html} />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            className="w-full h-full p-4 resize-none focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            style={{ minHeight }}
            value={markdown}
            onChange={handleChange}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}