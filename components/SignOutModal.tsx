'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignOutModal({ isOpen, onClose }: SignOutModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Sign Out Confirmation
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Are you sure you want to sign out? You will be redirected to the login page.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>
    </div>
  );
}