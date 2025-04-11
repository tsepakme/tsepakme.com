import { BlogPosts } from 'app/components/posts';
import { getBlogPosts } from './utils';

export const metadata = {
  title: 'Blog',
  description: 'Read my thoughts on programming, design, and more.',
};

export default function Blog() {
  const posts = getBlogPosts();
  
  console.log("Rendering blog page with", posts.length, "posts");
  
  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl tracking-tighter">Blog</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          My thoughts on programming, design, and more.
        </p>
      </div>
      
      {posts.length > 0 ? (
        <BlogPosts posts={posts} />
      ) : (
        <p className="text-neutral-600 dark:text-neutral-400">
          No blog posts found. Check back soon!
        </p>
      )}
    </div>
  );
}
