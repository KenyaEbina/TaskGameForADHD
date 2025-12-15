"use client";

import Link from "next/link";
import DashboardStats from "@/components/DashboardStats";
import ReceiptView from "@/components/ReceiptView";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 pb-24">
      <div className="w-full max-w-6xl mx-auto">
        <header className="mb-8 border-b border-black dark:border-te-border-dark pb-4">
          <h1 className="text-3xl font-mono font-bold text-black dark:text-te-text-main-dark">
            FOCUS TERMINAL / V.1.0
          </h1>
          <p className="text-sm text-gray-600 dark:text-te-text-muted-dark mt-2 font-mono uppercase">
            NEURAL OVERCLOCK SYSTEM
          </p>
        </header>

        <DashboardStats />

        <div className="mb-8">
          <Link
            href="/list"
            className="inline-flex items-center gap-2 border border-black bg-black text-white px-6 py-3 font-mono text-sm uppercase tracking-wide hover:bg-international-orange hover:border-international-orange transition-colors dark:bg-te-accent dark:border-te-accent dark:shadow-[0_0_10px_rgba(255,79,0,0.8)]"
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
