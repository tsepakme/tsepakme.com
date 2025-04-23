import PostForm from 'app/admin/posts/components/post-form';

export const metadata = {
  title: 'Create New Post - Admin',
};

export default function CreatePostPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Create New Post</h1>
      <PostForm mode="create" />
    </div>
  );
}