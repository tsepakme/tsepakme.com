'use client';

import Link from "next/link";
import { ReactNode } from "react";

export function TagLink({ tag, children }: { tag: string, children: ReactNode }) {
  return (
    <span onClick={(e) => e.stopPropagation()} className="inline-block">
      <Link
        href={`/snippets/tag/${tag}`}
        className="text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full px-2 py-1 transition-colors inline-block"
      >
        {children}
      </Link>
    </span>
  );
}