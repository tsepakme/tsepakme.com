import { getAllPosts } from 'app/blog/lib/markdown';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminDashboardPage() {
  const posts = await getAllPosts();
  
  const publishedPosts = posts.filter(post => post.meta.published !== false).length;
  const draftPosts = posts.length - publishedPosts;
  
  const recentPosts = posts
    .sort((a, b) => {
      return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    })
    .slice(0, 5);
  
  const lastUpdated = recentPosts.length > 0 
    ? new Date(recentPosts[0].meta.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'No posts yet';
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tighter">Admin Dashboard</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your content and monitor your site
          </p>
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Last updated: {lastUpdated}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
          <h2 className="font-medium mb-2">Blog Posts</h2>
          <div className="flex justify-between">
            <div>
              <p className="text-3xl font-bold">{posts.length}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total posts</p>
            </div>
            <div className="text-right">
              <p className="text-green-600 dark:text-green-400 font-medium">{publishedPosts} Published</p>
              <p className="text-amber-600 dark:text-amber-400 font-medium">{draftPosts} Drafts</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Link 
              href="/admin/posts" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              View all posts →
            </Link>
          </div>
        </div>
        
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
          <h2 className="font-medium mb-2">Quick Actions</h2>
          <div className="space-y-2">
            <Link 
              href="/admin/posts/new"
              className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Post
            </Link>
            <Link 
              href="/admin/snippets/new"
              className="flex items-center justify-center w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-center rounded transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Add New Snippet
            </Link>
          </div>
        </div>
        
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
          <h2 className="font-medium mb-2">System</h2>
          <p className="text-sm mb-2">
            <span className="font-medium">Environment:</span> {process.env.NODE_ENV}
          </p>
          <p className="text-sm mb-2">
            <span className="font-medium">Next.js Version:</span> {process.env.NEXT_VERSION || 'Latest'}
          </p>
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <Link 
              href="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              target="_blank"
            >
              View your site →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 transition-all hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium">Recent Posts</h2>
          <Link 
            href="/admin/posts" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
          >
            <span>View all</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">Title</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">Date</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">Status</th>
                <th className="text-right py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map(post => (
                <tr key={post.slug} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/20">
                  <td className="py-3 px-4">
                    <span className="font-medium">{post.meta.title || 'Untitled'}</span>
                    {post.meta.description && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate max-w-xs mt-1">
                        {post.meta.description}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {new Date(post.meta.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {post.meta.published !== false ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Link 
                      href={`/admin/posts/edit/${post.slug}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-neutral-600 dark:text-neutral-400 hover:underline"
                      target="_blank"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              
              {recentPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4">No posts found.</p>
                      <Link 
                        href="/admin/posts/new"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors duration-200"
                      >
                        Create your first post
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {posts.length > 5 && (
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-right">
            <Link 
              href="/admin/posts"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              View all posts
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}