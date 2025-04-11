import path from "path";
import fs from "fs";
import { cache } from "react";

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
