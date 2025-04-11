import path from "path";
import fs from "fs";
import { cache } from "react";
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

export const getSnippets = cache(() => {
  const snippetsDirectory = path.join(process.cwd(), "app/snippets/content");
  const files = fs.readdirSync(snippetsDirectory);
  
  const snippets = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(snippetsDirectory, file);
      const content = fs.readFileSync(filePath, "utf8");

      const metas = content.match(/export const metadata = ({[\s\S]*?});/);

      if (!metas) {
        return null;
      }

      let metadata;
      try {
        const metaString = metas[1].replace(
          /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
          '"$2":'
        );
        metadata = JSON.parse(metaString.replace(/'/g, '"'));
      } catch (error) {
        console.error(`Error parsing metadata for ${file}:`, error);
        return null;
      }

      return {
        slug,
        metadata,
      };
    })
    .filter(Boolean);

  return snippets;
});

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

/**
 * Получает все слаги (URL-идентификаторы) сниппетов
 * @returns Массив строк со слагами всех сниппетов
 */
export function getAllSnippetSlugs() {
  // Используем существующую функцию getSnippets и извлекаем слаги
  const snippets = getSnippets();
  return snippets.map(snippet => snippet?.slug);
}

/**
 * Получает конкретный сниппет по его слагу
 * @param slug Идентификатор сниппета
 * @returns Объект сниппета с контентом и метаданными или undefined, если сниппет не найден
 */
export async function getSnippet(slug: string) {
  // Получаем все сниппеты
  const snippets = getSnippets();
  
  // Находим нужный сниппет по слагу
  const snippet = snippets.find(s => s?.slug === slug);
  
  if (!snippet) {
    return undefined;
  }
  
  try {
    // Путь к MDX файлу
    const filePath = path.join(process.cwd(), 'app', 'snippets', 'content', `${slug}.mdx`);
    
    // Проверяем, существует ли файл
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return undefined;
    }
    
    // Читаем содержимое файла
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Парсим frontmatter и контент
    const { content, data } = matter(fileContent);
    
    // Возвращаем объект с метаданными и содержимым
    return {
      ...snippet,
      content: content
    };
  } catch (error) {
    console.error(`Error loading snippet ${slug}:`, error);
    return undefined;
  }
}
