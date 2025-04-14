import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getBlogPosts() {
  
  const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'content');
  
  if (!fs.existsSync(postsDirectory)) {
    console.error(`Directory not found: ${postsDirectory}`);
    return [];
  }
  
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        
        const fullPath = path.join(postsDirectory, fileName);
        
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        const { data } = matter(fileContents);
        
        return {
          slug,
          metadata: {
            title: data.title,
            description: data.description,
            date: data.date,
            ...(data.tags && { tags: data.tags }),
            ...(data.difficulty && { difficulty: data.difficulty })
          }
        };
      });
    
    return posts;
  } catch (error) {
    console.error("Error getting blog posts:", error);
    return [];
  }
}

export async function getBlogPost(slug) {
  const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'content');
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.error(`File not found: ${fullPath}`);
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      content: content,
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
