'use client';

import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export default function TagInput({ 
  tags, 
  onChange, 
  placeholder = 'Add tags...', 
  maxTags = 10 
}: TagInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const uniqueTags = Array.from(new Set(tags));
    if (uniqueTags.length !== tags.length) {
      onChange(uniqueTags);
    }
  }, [tags, onChange]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedInput = input.trim().toLowerCase();
    
    if (!trimmedInput) return;
    if (tags.includes(trimmedInput)) {
      setInput('');
      return;
    }
    if (tags.length >= maxTags) {
      return;
    }
    
    onChange([...tags, trimmedInput]);
    setInput('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div 
      className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 dark:border-gray-700 rounded-md focus-within:ring-1 focus-within:ring-blue-500 bg-white dark:bg-gray-900"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, index) => (
        <div 
          key={index}
          className="flex items-center px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm"
        >
          <span>#{tag}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            className="ml-1 text-blue-800 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-100 focus:outline-none"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-grow min-w-[120px] bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500"
        disabled={tags.length >= maxTags}
      />
      
      {tags.length >= maxTags && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Max tags reached
        </div>
      )}
    </div>
  );
}