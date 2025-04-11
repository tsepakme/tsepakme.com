import path from "path";
import fs from "fs";
import matter from 'gray-matter';

export const CATEGORIES = {
  TYPESCRIPT: "typescript",
  REACT: "react",
  NEXTJS: "nextjs",
  CSS: "css",
} as const;

export type Category = keyof typeof CATEGORIES;

export const CATEGORIES_MAP = {
  [CATEGORIES.TYPESCRIPT]: {
    name: "TypeScript",
    description: "Type utilities, patterns and advanced type manipulations",
  },
  [CATEGORIES.REACT]: {
    name: "React",
    description: "Hooks, components, patterns and performance optimizations",
  },
  [CATEGORIES.NEXTJS]: {
    name: "Next.js",
    description: "App router, server components, and data fetching",
  },
  [CATEGORIES.CSS]: {
    name: "CSS",
    description: "Modern CSS techniques, layouts and animations",
  },
};

export function formatDate(date: string, includeYear = true) {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  if (includeYear) {
    options.year = "numeric";
  }

  return new Date(date).toLocaleDateString("en-US", options);
}

interface SnippetMetadata {
  title: string;
  description: string;
  publishedAt: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

// Получает список всех доступных сниппетов
export function getSnippets() {
  try {
    const snippetsDir = path.join(process.cwd(), 'app', 'snippets', 'content');
    const filenames = fs.readdirSync(snippetsDir);
    
    // Фильтруем только .mdx файлы
    const mdxFiles = filenames.filter(name => name.endsWith('.mdx'));
    
    const snippets = mdxFiles.map(filename => {
      // Получаем slug из имени файла
      const slug = filename.replace(/\.mdx$/, '');
      
      // Получаем полный путь к файлу
      const filePath = path.join(snippetsDir, filename);
      
      // Читаем содержимое файла
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Извлекаем frontmatter
      const { data: metadata } = matter(fileContent);
      
      return {
        slug,
        metadata
      };
    });
    
    return snippets;
  } catch (error) {
    console.error('Error getting snippets:', error);
    return [];
  }
}

// Получает все доступные слаги сниппетов
export function getAllSnippetSlugs() {
  const snippets = getSnippets();
  return snippets.map(snippet => snippet.slug);
}

// Получает конкретный сниппет по слагу
export async function getSnippet(slug: string) {
  try {
    // Получаем список всех сниппетов
    const snippets = getSnippets();
    
    // Находим нужный сниппет по слагу
    const snippet = snippets.find(s => s.slug === slug);
    
    if (!snippet) {
      console.error(`Snippet not found: ${slug}`);
      return undefined;
    }
    
    // Путь к MDX файлу
    const filePath = path.join(process.cwd(), 'app', 'snippets', 'content', `${slug}.mdx`);
    
    // Проверяем, существует ли файл
    if (!fs.existsSync(filePath)) {
      console.error(`MDX file not found: ${filePath}`);
      return undefined;
    }
    
    // Читаем содержимое файла
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Парсим frontmatter и контент
    const { content, data } = matter(fileContent);
    
    // Возвращаем объект с метаданными и содержимым
    return {
      ...snippet,
      content
    };
  } catch (error) {
    console.error(`Error loading snippet ${slug}:`, error);
    return undefined;
  }
}

export function getCategorySnippets(category: string) {
  const snippets = getSnippets();
  return snippets.filter((snippet) => snippet?.metadata?.category === category);
}

export function getSnippetCategories() {
  return Object.entries(CATEGORIES_MAP).map(([slug, { name, description }]) => {
    const count = getCategorySnippets(slug).length;
    return {
      slug,
      name,
      description,
      count,
    };
  });
}

// Функция для получения всех тегов из всех сниппетов
export function getAllTags() {
  const snippets = getSnippets();
  const tagsSet = new Set<string>();
  
  snippets.forEach(snippet => {
    if (snippet?.metadata.tags) {
      snippet.metadata.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  // Сортируем теги по алфавиту
  return Array.from(tagsSet).sort();
}

// Функция для получения сниппетов по тегу
export function getTagSnippets(tag: string) {
  const snippets = getSnippets();
  return snippets.filter(snippet => 
    snippet?.metadata.tags?.includes(tag)
  );
}
