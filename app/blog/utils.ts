import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getBlogPosts() {
  console.log("Getting blog posts...");
  
  // Убедитесь, что путь к директории верный
  const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'posts');
  console.log("Posts directory:", postsDirectory);
  
  // Проверяем существование директории
  if (!fs.existsSync(postsDirectory)) {
    console.error(`Directory not found: ${postsDirectory}`);
    return [];
  }
  
  try {
    // Получаем список файлов
    const fileNames = fs.readdirSync(postsDirectory);
    console.log("Found files:", fileNames);
    
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map(fileName => {
        // Получаем slug из имени файла
        const slug = fileName.replace(/\.mdx$/, '');
        
        // Полный путь к файлу
        const fullPath = path.join(postsDirectory, fileName);
        
        // Читаем содержимое файла
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        // Извлекаем метаданные из frontmatter
        const { data } = matter(fileContents);
        console.log(`Post ${slug} metadata:`, data);
        
        return {
          slug,
          metadata: {
            title: data.title,
            description: data.description,
            publishedAt: data.publishedAt,
            ...(data.tags && { tags: data.tags }),
            ...(data.difficulty && { difficulty: data.difficulty })
          }
        };
      });
    
    console.log(`Found ${posts.length} posts`);
    return posts;
  } catch (error) {
    console.error("Error getting blog posts:", error);
    return [];
  }
}

// Получение конкретного блог-поста
export async function getBlogPost(slug) {
  const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'posts');
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  
  try {
    // Проверка существования файла
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Теперь мы просто возвращаем контент в виде строки,
    // а MDXRemote в компоненте сделает всю магию
    return {
      slug,
      title: data.title,
      description: data.description,
      publishedAt: data.publishedAt,
      content: content, // Возвращаем необработанный MDX контент
      difficulty: data.difficulty,
      tags: data.tags,
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = '';

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = 'Today';
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
