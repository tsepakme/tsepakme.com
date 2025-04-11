import Link from "next/link";
import { TagLink } from "./tag-link";

// Интерфейс для метаданных сниппета
interface SnippetMetadata {
  title: string;
  description: string;
  publishedAt: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

// Интерфейс для сниппета
interface Snippet {
  slug: string;
  metadata: SnippetMetadata;
}

// Props для компонента списка сниппетов
interface SnippetsListProps {
  snippets: Snippet[];
  title?: string;
  description?: string;
}

export function SnippetsList({ snippets, title, description }: SnippetsListProps) {
  const getDifficultyBadge = (difficulty: string = 'beginner') => {
    const colors = {
      beginner: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      intermediate: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      advanced: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    };
    
    return (
      <div className={`rounded-full px-2 py-0.5 ${colors[difficulty] || colors.beginner}`}>
        {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Beginner'}
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'typescript':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect fill="#3178c6" height="512" rx="50" width="512" />
            <path d="m316.939 407.424v50.061c8.138 4.172 17.763 7.3 28.875 9.386s22.823 3.129 35.135 3.129c11.999 0 23.397-1.147 34.196-3.442 10.799-2.294 20.268-6.075 28.406-11.342 8.138-5.266 14.581-12.15 19.328-20.65s7.121-19.007 7.121-31.522c0-9.074-1.356-17.026-4.069-23.857s-6.625-12.906-11.738-18.225c-5.112-5.319-11.242-10.091-18.389-14.315s-15.207-8.213-24.18-11.967c-6.573-2.712-12.468-5.345-17.685-7.9-5.217-2.556-9.651-5.163-13.303-7.822-3.652-2.66-6.469-5.476-8.451-8.448-1.982-2.973-2.974-6.336-2.974-10.091 0-3.441.887-6.544 2.661-9.308s4.278-5.136 7.512-7.118c3.235-1.981 7.199-3.52 11.894-4.615 4.696-1.095 9.912-1.642 15.651-1.642 4.173 0 8.581.313 13.224.938 4.643.626 9.312 1.591 14.008 2.894 4.695 1.304 9.259 2.947 13.694 4.928 4.434 1.982 8.529 4.276 12.285 6.884v-46.776c-7.616-2.92-15.937-5.084-24.962-6.492s-19.381-2.112-31.066-2.112c-11.895 0-23.163 1.278-33.805 3.833s-20.006 6.544-28.093 11.967c-8.086 5.424-14.476 12.333-19.171 20.729-4.695 8.395-7.043 18.433-7.043 30.114 0 14.914 4.304 27.638 12.912 38.172 8.607 10.533 21.675 19.45 39.204 26.751 6.886 2.816 13.303 5.579 19.25 8.291s11.086 5.528 15.415 8.448c4.33 2.92 7.747 6.101 10.252 9.543 2.504 3.441 3.756 7.352 3.756 11.733 0 3.233-.783 6.231-2.348 8.995s-3.939 5.162-7.121 7.196-7.147 3.624-11.894 4.771c-4.748 1.148-10.303 1.721-16.668 1.721-10.851 0-21.597-1.903-32.24-5.71-10.642-3.806-20.502-9.516-29.579-17.13zm-84.159-123.342h64.22v-41.082h-179v41.082h63.906v182.918h50.874z" fill="#fff" />
          </svg>
        );
      case 'react':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,10.11C13.03,10.11 13.87,10.95 13.87,12C13.87,13 13.03,13.85 12,13.85C10.97,13.85 10.13,13 10.13,12C10.13,10.95 10.97,10.11 12,10.11M7.37,20C8,20.38 9.38,19.8 10.97,18.3C10.45,17.71 9.94,17.07 9.46,16.4C8.64,16.32 7.83,16.2 7.06,16.04C6.55,18.18 6.74,19.65 7.37,20M8.08,14.26L7.79,13.75C7.68,14.04 7.57,14.33 7.5,14.61C7.77,14.67 8.07,14.72 8.38,14.77C8.28,14.6 8.18,14.43 8.08,14.26M14.62,13.5L15.43,12L14.62,10.5C14.32,9.97 14,9.5 13.71,9.03C13.17,9 12.6,9 12,9C11.4,9 10.83,9 10.29,9.03C10,9.5 9.68,9.97 9.38,10.5L8.57,12L9.38,13.5C9.68,14.03 10,14.5 10.29,14.97C10.83,15 11.4,15 12,15C12.6,15 13.17,15 13.71,14.97C14,14.5 14.32,14.03 14.62,13.5M12,6.78C11.81,7 11.61,7.23 11.41,7.5C11.61,7.5 11.8,7.5 12,7.5C12.2,7.5 12.39,7.5 12.59,7.5C12.39,7.23 12.19,7 12,6.78M12,17.22C12.19,17 12.39,16.77 12.59,16.5C12.39,16.5 12.2,16.5 12,16.5C11.8,16.5 11.61,16.5 11.41,16.5C11.61,16.77 11.81,17 12,17.22M16.62,4C16,3.62 14.62,4.2 13.03,5.7C13.55,6.29 14.06,6.93 14.54,7.6C15.36,7.68 16.17,7.8 16.94,7.96C17.45,5.82 17.26,4.35 16.62,4M15.92,9.74L16.21,10.25C16.32,9.96 16.43,9.67 16.5,9.39C16.23,9.33 15.93,9.28 15.62,9.23C15.72,9.4 15.82,9.57 15.92,9.74M16.57,12L16.09,13.11C15.84,13.67 15.39,14.29 14.9,14.9C16.68,15.54 17.07,14.9 17.35,14.51C17.13,13.07 16.88,12.53 16.57,12M17.92,11.77C17.85,12.17 17.75,12.59 17.63,13C18.38,13.16 19.03,13.37 19.55,13.61C20.23,12.33 20.11,10.16 17.92,11.77M11,19.93C12.73,20.04 14.51,18.88 15.14,18.12C14.4,17.78 13.65,17.36 12.91,16.88C12.63,16.94 12.35,16.99 12.06,17.03C11.78,17.07 11.5,17.1 11.21,17.13C11.16,18.03 11.08,19.08 11,19.93M7.86,8.45C7.17,7.5 7.13,6.73 7.42,6.26C6.39,6.53 5.27,7.28 5.42,8.95C6.24,9.62 7.08,10.26 7.92,10.84C8.17,9.74 8.13,9.04 7.86,8.45M4.45,10.4C4.18,10.92 4,11.5 4,12.13C4,12.85 4.23,13.63 4.7,14.4C5.23,13.83 5.84,13.3 6.5,12.8C6.32,11.81 6.31,10.93 6.5,10.18C5.76,10.22 5.08,10.28 4.45,10.4M9.25,5.75C8.81,5.38 7.03,4.44 6.36,5.18C5.78,5.82 5.92,7.2 6.21,8.36C6.97,8.25 7.76,8.17 8.58,8.14C8.97,7.4 9.33,6.74 9.74,6.08C9.58,5.96 9.41,5.85 9.25,5.75M5.53,17.61C5.96,19.5 7.17,19.95 7.89,19.87C8.18,18.91 8.4,17.83 8.54,16.69C7.86,16.58 7.2,16.43 6.56,16.25C6.24,16.67 5.91,17.14 5.53,17.61Z" />
          </svg>
        );
      case 'nextjs':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2.5L2,9.8L2,17.1L12,24.4L22,17.1V9.8L12,2.5M10.7,15.5V8.5L16.2,12L10.7,15.5Z" />
          </svg>
        );
      case 'css':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.87L2.17,18L9.42,21L17.82,18L19.92,6.34H18.82L19.22,4.17H5.72L5,3Z" />
          </svg>
        );
      case 'javascript':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z" />
          </svg>
        );
      case 'html':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        );
    }
  };

  // Отображение заголовка и описания, если они переданы
  const renderHeader = () => {
    if (!title && !description) return null;
    
    return (
      <div className="mb-8">
        {title && <h1 className="font-semibold text-2xl tracking-tighter mb-4">{title}</h1>}
        {description && <p className="text-neutral-600 dark:text-neutral-400">{description}</p>}
      </div>
    );
  };

  // Отображение сообщения, если список пуст
  const renderEmptyState = () => {
    return (
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">No snippets found.</p>
      </div>
    );
  };

  return (
    <div>
      {renderHeader()}
      
      {snippets.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="space-y-4">
          {snippets
            .sort((a, b) => {
              if (
                new Date(a?.metadata.publishedAt) > new Date(b?.metadata.publishedAt)
              ) {
                return -1;
              }
              return 1;
            })
            .map((snippet) => (
              <div key={snippet?.slug} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:shadow-sm">
                <Link
                  href={`/snippets/${snippet?.slug}`}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-lg group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                      {snippet?.metadata.title}
                    </h3>
                    <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-xs">
                      {getCategoryIcon(snippet?.metadata.category)}
                      <span className="capitalize">{snippet?.metadata.category}</span>
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                    {snippet?.metadata.description}
                  </p>
                </Link>
                
                <div className="flex flex-wrap items-center gap-2">
                  {getDifficultyBadge(snippet?.metadata.difficulty)}
                  
                  <div className="h-4 border-r border-neutral-200 dark:border-neutral-700 mx-1"></div>
                  
                  <div className="flex flex-wrap gap-1">
                    {snippet?.metadata.tags?.map(tag => (
                      <TagLink key={tag} tag={tag}>
                        #{tag}
                      </TagLink>
                    ))}
                  </div>
                  
                  <Link 
                    href={`/snippets/${snippet?.slug}`}
                    className="ml-auto text-neutral-600 dark:text-neutral-400 font-medium hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors flex items-center"
                  >
                    View snippet
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}