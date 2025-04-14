import { getAllPosts, getAllTags } from './lib/markdown';
import { PostCard } from './components/post-card';
import Tag from 'app/components/tag';

export const metadata = {
  title: 'Blog | Markdown Version',
  description: 'Thoughts on programming, technology, and more',
};

export default async function MdBlogPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();
  
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">Blog</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
          
          {posts.length === 0 && (
            <p className="text-neutral-600 dark:text-neutral-400">
              No posts found. Add some markdown files to the content directory.
            </p>
          )}
        </div>
        
        <div className="w-full md:w-1/4">
          <div className="sticky top-20">
            <h2 className="font-medium text-xl mb-4 tracking-tighter">Tags</h2>
            <div className="flex flex-wrap">
              {tags.map(tag => (
                <Tag key={tag} tag={tag} slug={'blog'} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}