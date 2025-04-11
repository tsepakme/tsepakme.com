import path from "path";
import fs from "fs";
import matter from 'gray-matter';

export const CATEGORIES = {
  TYPESCRIPT: "typescript",
  REACT: "react",
  JAVASCRIPT: "javascript",
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
  [CATEGORIES.JAVASCRIPT]: {
    name: "JavaScript",
    description: "Core language features, patterns, and best practices",
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

export function getSnippets() {
  try {
    const snippetsDir = path.join(process.cwd(), 'app', 'snippets', 'content');
    const filenames = fs.readdirSync(snippetsDir);
    
    const mdxFiles = filenames.filter(name => name.endsWith('.mdx'));
    
    const snippets = mdxFiles.map(filename => {
      const slug = filename.replace(/\.mdx$/, '');
      
      const filePath = path.join(snippetsDir, filename);
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
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

export function getAllSnippetSlugs() {
  const snippets = getSnippets();
  return snippets.map(snippet => snippet.slug);
}

export async function getSnippet(slug: string) {
  try {
    const snippets = getSnippets();
    
    const snippet = snippets.find(s => s.slug === slug);
    
    if (!snippet) {
      console.error(`Snippet not found: ${slug}`);
      return undefined;
    }
    
    const filePath = path.join(process.cwd(), 'app', 'snippets', 'content', `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`MDX file not found: ${filePath}`);
      return undefined;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const { content, data } = matter(fileContent);
    
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

export function getAllTags() {
  const snippets = getSnippets();
  const tagsSet = new Set<string>();
  
  snippets.forEach(snippet => {
    if (snippet?.metadata.tags) {
      snippet.metadata.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
}

export function getTagSnippets(tag: string) {
  const snippets = getSnippets();
  return snippets.filter(snippet => 
    snippet?.metadata.tags?.includes(tag)
  );
}
