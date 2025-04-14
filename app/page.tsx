import { BlogPosts } from "app/components/posts";
import { getBlogPosts } from "scripts/utils";

export default function Page() {
  const allPosts = getBlogPosts();
  
  const recentPosts = [...allPosts]
    .sort((a, b) => {
      const dateA = new Date(a.metadata.date);
      const dateB = new Date(b.metadata.date);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3);

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
                className="flex items-center text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Read all posts
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="ml-1 h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </>
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400">No posts found.</p>
        )}
      </div>
    </section>
  );
}
