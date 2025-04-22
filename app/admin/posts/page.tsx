import { getAllPosts } from 'app/blog/lib/markdown';
import Link from 'next/link';

export const metadata = {
  title: 'Manage Posts - Admin',
};

export default async function ManagePostsPage() {
  const posts = await getAllPosts();
  
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Manage Posts</h1>
        <Link
          href="/admin/posts/new"
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Create New Post
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="text-left py-3 px-4 font-medium">Title</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.map(post => (
                <tr key={post.slug} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <div className="font-medium">{post.meta.title || 'Untitled'}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {post.meta.description || 'No description'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(post.meta.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {post.meta.published !== false ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link 
                      href={`/admin/posts/edit/${post.slug}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <span className="text-gray-400">|</span>
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="text-gray-600 hover:underline"
                      target="_blank"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                    No posts found. Create your first post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}