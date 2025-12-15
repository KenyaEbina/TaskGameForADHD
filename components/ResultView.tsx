'use client';

import { useTaskStore } from '@/store/taskStore';
import { Trash2 } from 'lucide-react';

export default function ResultView() {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getDiff = (estimateMinutes: number, actualSeconds: number) => {
    const estimateSeconds = estimateMinutes * 60;
    const diff = actualSeconds - estimateSeconds;
    return diff;
  };

  const formatDiff = (diff: number) => {
    const absDiff = Math.abs(diff);
    const mins = Math.floor(absDiff / 60);
    const secs = absDiff % 60;
    const sign = diff >= 0 ? '+' : '-';
    return `${sign}${mins}m ${secs}s`;
  };

  if (completedTasks.length === 0) {
    return (
      <div className="border border-black bg-white p-4">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wide">Results</h2>
        <p className="text-sm text-gray-500 text-center py-8">No completed tasks yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-black bg-white p-4">
      <h2 className="text-sm font-bold mb-4 uppercase tracking-wide">Results</h2>

      <div className="space-y-4">
        {completedTasks.map((task) => {
          const estimateSeconds = task.estimateMinutes * 60;
          const diff = getDiff(task.estimateMinutes, task.actualSeconds);
          const estimatePercentage = (estimateSeconds / Math.max(task.actualSeconds, estimateSeconds)) * 100;
          const actualPercentage = (task.actualSeconds / Math.max(task.actualSeconds, estimateSeconds)) * 100;

          return (
            <div key={task.id} className="border border-black p-4 font-mono text-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold">{task.title}</div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="border border-black px-2 py-1 text-xs uppercase bg-white hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Estimate: {task.estimateMinutes}m</span>
                  <span>Actual: {formatTime(task.actualSeconds)}</span>
                </div>

                {/* バーグラフ */}
                <div className="relative h-6 border border-black bg-gray-100">
                  {/* Estimate bar */}
                  <div
                    className="absolute top-0 left-0 h-full bg-gray-300 border-r-2 border-black"
                    style={{ width: `${estimatePercentage}%` }}
                  >
                    <div className="h-full flex items-center justify-center text-xs text-black font-bold">
                      {task.estimateMinutes}m
                    </div>
                  </div>

                  {/* Actual bar */}
                  <div
                    className={`absolute top-0 left-0 h-full ${
                      diff >= 0 ? 'bg-international-orange' : 'bg-green-500'
                    } flex items-center justify-end pr-1 text-xs text-white font-bold`}
                    style={{ width: `${actualPercentage}%` }}
                  >
                    {task.actualSeconds >= estimateSeconds && formatTime(task.actualSeconds)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Difference:</span>
                <span
                  className={`font-bold ${
                    diff >= 0 ? 'text-international-orange' : 'text-green-600'
                  }`}
                >
                  {formatDiff(diff)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
