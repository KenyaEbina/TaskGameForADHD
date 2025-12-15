'use client';

import Link from 'next/link';
import DashboardStats from '@/components/DashboardStats';
import ReceiptView from '@/components/ReceiptView';
import { Plus } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b border-black pb-4">
          <h1 className="text-3xl font-mono font-bold">FOCUS TERMINAL / V.1.0</h1>
          <p className="text-sm text-gray-600 mt-2 font-mono uppercase">NEURAL OVERCLOCK SYSTEM</p>
        </header>

        <DashboardStats />

        <div className="mb-8">
          <Link
            href="/list"
            className="inline-block border border-black bg-black text-white px-6 py-3 font-mono text-sm uppercase tracking-wide hover:bg-international-orange hover:border-international-orange transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            NEW TASK
          </Link>
        </div>

        <div className="mt-12">
          <ReceiptView />
        </div>
      </div>
    </main>
  );
}
