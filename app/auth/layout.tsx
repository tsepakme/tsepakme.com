import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Tsepakme',
  description: 'Secure access to manage your content',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Tsepakme
            </h2>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8">
          {children}
        </div>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
            Back to Website
          </Link>
          <span className="mx-2">·</span>
          <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300">
            Blog
          </Link>
        </div>
      </div>
    </div>
  );
}