import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPost, getBlogPosts } from '../utils';

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const components = {
  a: ({ href, ...props }) => {
    if (href?.startsWith('/')) {
      return <Link href={href} {...props} />;
    }
    if (href?.startsWith('#')) {
      return <a {...props} />;
    }
    return <a target="_blank" rel="noopener noreferrer" {...props} />;
  },
  img: (props) => <Image alt={props.alt || ''} className="rounded-lg" width={700} height={350} {...props} />,
  pre: ({ children }) => {
    return <div className="relative group"><pre>{children}</pre></div>;
  },
  code: ({ children, className }) => {
    if (!className) {
      return <code className="font-mono text-sm bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded">{children}</code>;
    }
    return <code className={className}>{children}</code>;
  }
};

export default async function BlogPost({ params }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>{post.title}</h1>
      
      <div className="flex items-center space-x-4 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
        <time dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        
        {post.difficulty && (
          <span className="rounded-full px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-xs capitalize">
            {post.difficulty}
          </span>
        )}
      </div>
      
      <div className="mdx-content">
        <MDXRemote source={post.content} components={components} />
      </div>
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map(tag => (
            <span 
              key={tag} 
              className="rounded-full px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <Link 
          href="/blog" 
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          ← Back to blog
        </Link>
      </div>
    </article>
  );
}
