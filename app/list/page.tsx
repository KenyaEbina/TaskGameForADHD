'use client';

import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';

export default function ListPage() {
  return (
    <main className="min-h-screen p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b border-black pb-4">
          <h1 className="text-3xl font-mono font-bold">MISSION QUEUE</h1>
          <p className="text-sm text-gray-600 mt-2 font-mono uppercase">OPERATION CONTROL CENTER</p>
        </header>

        <div className="space-y-6">
          <TaskInput />
          <TaskList />
        </div>
      </div>
    </main>
  );
}
