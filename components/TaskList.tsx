'use client';

import { Play, Pause, Check, RotateCcw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTaskStore, Task } from '@/store/taskStore';

export default function TaskList() {
  const tasks = useTaskStore((state) => state.tasks);
  const startTask = useTaskStore((state) => state.startTask);
  const stopTask = useTaskStore((state) => state.stopTask);
  const completeTask = useTaskStore((state) => state.completeTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const resetTask = useTaskStore((state) => state.resetTask);

  const activeTasks = tasks.filter((task) => task.status !== 'completed');
  const runningTask = tasks.find((task) => task.status === 'running');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePause = (task: Task) => {
    stopTask(task.id);
  };

  if (activeTasks.length === 0) {
    return (
      <div className="border border-black bg-white p-4">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wide font-mono">MISSION QUEUE</h2>
        <p className="text-sm text-gray-500 text-center py-8 font-mono">QUEUE EMPTY. AWAITING INPUT.</p>
      </div>
    );
  }

  return (
    <div className="border border-black bg-white p-4">
      <h2 className="text-sm font-bold mb-4 uppercase tracking-wide font-mono">MISSION QUEUE</h2>

      <div className="space-y-2">
        {activeTasks.map((task) => (
          <div
            key={task.id}
            className={`border border-black p-3 font-mono text-sm ${
              task.status === 'running' ? 'bg-international-orange bg-opacity-10 border-international-orange' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="font-bold mb-1">{task.title}</div>
                <div className="text-xs text-gray-600 font-mono">
                  LIMIT: {task.estimateMinutes}m | ELAPSED: {formatTime(task.actualSeconds)}
                </div>
              </div>

              <div className="flex gap-1">
                {task.status === 'running' ? (
                  <button
                    onClick={() => handlePause(task)}
                    className="border border-black px-3 py-1 text-xs uppercase transition-colors bg-international-orange text-white border-international-orange"
                  >
                    <Pause size={12} className="inline mr-1" />
                    Pause
                  </button>
                ) : (
                  <Link
                    href={`/task/${task.id}`}
                    className="border border-black px-3 py-1 text-xs uppercase transition-colors bg-white hover:bg-gray-100 inline-flex items-center font-mono"
                  >
                    <Play size={12} className="inline mr-1" />
                    ENGAGE
                  </Link>
                )}

                {task.actualSeconds > 0 && (
                  <button
                    onClick={() => completeTask(task.id)}
                    className="border border-black px-3 py-1 text-xs uppercase bg-white hover:bg-green-100 transition-colors"
                    title="Complete"
                  >
                    <Check size={12} />
                  </button>
                )}

                <button
                  onClick={() => resetTask(task.id)}
                  className="border border-black px-3 py-1 text-xs uppercase bg-white hover:bg-gray-100 transition-colors"
                  title="Reset"
                >
                  <RotateCcw size={12} />
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="border border-black px-3 py-1 text-xs uppercase bg-white hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
