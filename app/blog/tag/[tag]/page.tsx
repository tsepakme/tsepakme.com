import Link from 'next/link';
import { getPostsByTag, getAllTags } from 'app/blog/lib/markdown';
import { PostCard } from 'app/blog/components/post-card';
import { notFound } from 'next/navigation';
import Tag from 'app/components/tag';

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(tag => ({ tag }));
}

export async function generateMetadata({ params }) {
  return {
    title: `Posts tagged with #${params.tag}`,
    description: `Blog posts and articles tagged with #${params.tag}`,
  };
}

export default async function TagPage({ params }) {
  const posts = await getPostsByTag(params.tag);
    const tags = await getAllTags();
  

  if (!posts.length) {
    notFound();
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/blog"
          className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          Blog
        </Link>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <span className="text-neutral-500">Tags</span>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <span className="font-medium">#{params.tag}</span>
      </div>

      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        Posts tagged with #{params.tag}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="w-full md:w-1/4">
          <div className="sticky top-20">
            <h2 className="font-medium text-xl mb-4 tracking-tighter">Tags</h2>
            <div className="flex flex-wrap">
              {tags.map(tag => (
                <Tag key={tag} tag={tag} slug={'blog'}/>
              ))}
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}