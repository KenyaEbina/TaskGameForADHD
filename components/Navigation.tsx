'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-black bg-white py-3 z-50">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex gap-6 font-mono text-sm uppercase tracking-wide">
          <Link
            href="/"
            className={`hover:text-international-orange transition-colors ${
              pathname === '/' ? 'text-international-orange font-bold' : 'text-black'
            }`}
          >
            [TOP]
          </Link>
          <Link
            href="/list"
            className={`hover:text-international-orange transition-colors ${
              pathname === '/list' ? 'text-international-orange font-bold' : 'text-black'
            }`}
          >
            [LIST]
          </Link>
        </div>
      </div>
    </nav>
  );
}
