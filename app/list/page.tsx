"use client";

import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";

export default function ListPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 pb-24">
      <div className="w-full max-w-6xl mx-auto">
        <header className="mb-8 border-b border-black dark:border-te-border-dark pb-4">
          <h1 className="text-3xl font-mono font-bold text-black dark:text-te-text-main-dark">
            MISSION QUEUE
          </h1>
          <p className="text-sm text-gray-600 dark:text-te-text-muted-dark mt-2 font-mono uppercase">
            OPERATION CONTROL CENTER
          </p>
        </header>

        <div className="space-y-6">
          <TaskInput />
          <TaskList />
        </div>
      </div>
    </main>
  );
}
