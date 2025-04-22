'use client';

import { useState } from 'react';
import SignOutModal from './SignOutModal';

interface SignOutButtonProps {
  className?: string;
  buttonText?: string;
  redirectPath?: string;
}

export default function SignOutButton({ 
  className = "px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700",
  buttonText = "Sign Out",
  redirectPath = "/auth/login"
}: SignOutButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        {buttonText}
      </button>
      
      <SignOutModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        redirectPath={redirectPath}
      />
    </>
  );
}