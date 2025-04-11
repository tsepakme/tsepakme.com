import { BlogPosts } from "app/components/posts";
import { getBlogPosts } from "app/blog/utils";

export default function Page() {
  const posts = getBlogPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        My Portfolio
      </h1>
      <p className="mb-4">
        {`Hi, my name is Aiusha. With a Master of Engineering background, 
        I bring an analytical and systematic approach to frontend development, 
        ensuring our applications are not only visually appealing but also 
        robust and maintainable. My journey from hydraulics to software 
        engineering underscores my adaptability and eagerness for continuous 
        learning, particularly in React.js and modern web technologies.`}
      </p>
      
      <div className="my-8">
        <h2 className="mb-4 text-xl font-medium">Recent Posts</h2>
        {recentPosts.length > 0 ? (
          <>
            <BlogPosts posts={recentPosts} />
            <div className="mt-4">
              <a 
                href="/blog" 
                className="text-neutral-800 dark:text-neutral-200 hover:underline"
              >
                See all posts →
              </a>
            </div>
          </>
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400">
            No blog posts available.
          </p>
        )}
      </div>
    </section>
  );
}
