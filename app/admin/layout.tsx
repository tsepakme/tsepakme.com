import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/options';
import Link from 'next/link';
import SignOutButton from '../../components/SignOutButton';

export const metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (process.env.NODE_ENV !== 'production') {
    console.log("Admin layout - session:", session ? "Session exists" : "No session");
  }
  if (!session) {
    console.log("No session, redirecting to login");
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </Link>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link
                  href="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/posts"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Blog Posts
                </Link>
                <Link
                  href="/admin/snippets"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Code Snippets
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-sm mr-4 text-gray-500 dark:text-gray-400">
                  Welcome, {session.user?.name || "Admin"}
                </span>
                <SignOutButton
                  buttonText='Logout'
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="sm:hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/posts"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Blog Posts
          </Link>
          <Link
            href="/admin/snippets"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Code Snippets
          </Link>
        </div>
      </div>

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Admin Panel • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}