'use client';

import { useState } from 'react';
import SignOutModal from './SignOutModal';

export default function SignOutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="block px-4 py-2 rounded text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        Sign Out
      </button>
      
      <SignOutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}