import Link from "next/link";
import { TagLink } from "./tag-link";

interface SnippetMetadata {
  title: string;
  description: string;
  publishedAt: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

interface Snippet {
  slug: string;
  metadata: SnippetMetadata;
}

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
          <svg className="w-4 h-4 mr-1" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
            <title>React Logo</title>
            <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
            <g stroke="#61dafb" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        );
      case 'css':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 1000 1000" fill="currentColor">
            <path d="M0 0H840A160 160 0 0 1 1000 160V840A160 160 0 0 1 840 1000H160A160 160 0 0 1 0 840V0Z" fill="#639" />
            <path d="m358.1,920c-64.23-.06-103.86-36.23-103.1-102.79,0,0,0-168.39,0-168.39,0-33.74,9.88-59.4,29.64-76.96,35.49-34.19,117.83-36.27,152.59.52,21.42,18.89,29.5,57.48,27.58,93.49h-73.72c.56-14.15-.19-35.58-8.51-43.65-10.81-14.63-39.36-12.91-46.91,2.32-4.64,8.26-6.96,20.49-6.96,36.67v146.18c0,30.65,10.65,46.15,31.96,46.49,9.96,0,17.53-3.62,22.68-10.85,7.19-8.58,8.31-27.58,7.73-41.32h73.72c5.04,70.07-36.32,119.16-106.71,118.29Zm234.04,0c-71.17.98-103.01-49.66-101.04-118.29h69.59c-1.93,29.92,8.35,57.17,32.99,55.27,10.99,0,18.73-3.44,23.2-10.33,8.5-12.59,10.09-48.95-2.06-63.02-8.49-13.55-39.03-25.51-55.16-33.57-23.03-11.02-39.61-24.1-49.75-39.26-22.87-33.64-20.75-107.48,11.34-137.4,31.18-36.92,112.61-38.62,143.82-.77,19.25,19.51,27.66,57.9,26.03,93.23h-67.02c.57-14.52-.8-37.95-6.44-46.49-3.95-7.23-11.43-10.85-22.42-10.85-19.59,0-29.38,11.71-29.38,35.12.21,24.86,9.9,35.06,32.48,45.45,29.24,11.36,66.42,30.76,79.9,54.24,40.2,71.54,12.62,180.82-86.09,176.65Zm224.76,0c-71.17.98-103.01-49.66-101.04-118.29h69.59c-1.93,29.92,8.35,57.17,32.99,55.27,10.99,0,18.73-3.44,23.2-10.33,8.5-12.59,10.09-48.95-2.06-63.02-8.49-13.55-39.03-25.51-55.16-33.57-23.03-11.02-39.61-24.1-49.75-39.26-22.87-33.64-20.75-107.48,11.34-137.4,31.18-36.92,112.61-38.62,143.82-.77,19.25,19.51,27.66,57.9,26.03,93.23h-67.02c.57-14.52-.8-37.95-6.44-46.49-3.95-7.23-11.43-10.85-22.42-10.85-19.59,0-29.38,11.71-29.38,35.12.21,24.86,9.9,35.06,32.48,45.45,29.24,11.36,66.42,30.76,79.9,54.24,40.2,71.54,12.62,180.82-86.09,176.65Z" fill="#fff" />
          </svg>
        );
      case 'javascript':
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 630 630" fill="currentColor">
            <rect width="630" height="630" fill="#f7df1e" />
            <path d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.37-38.1-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.95 36.4 35.95l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13c9.3 16.5 17.76 30.45 38.1 30.45 19.45 0 31.72-7.61 31.72-37.2v-201.3h59.2v202.1c0 61.3-35.94 89.2-88.4 89.2-47.4 0-74.85-24.53-88.81-54.075z" />
          </svg>
        );
    }
  };

  const renderHeader = () => {
    if (!title && !description) return null;

    return (
      <div className="mb-8">
        {title && <h1 className="font-semibold text-2xl tracking-tighter mb-4">{title}</h1>}
        {description && <p className="text-neutral-600 dark:text-neutral-400">{description}</p>}
      </div>
    );
  };

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