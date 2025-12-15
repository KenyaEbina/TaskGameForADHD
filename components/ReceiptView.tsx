'use client';

import { useTaskStore } from '@/store/taskStore';
import { Trash2 } from 'lucide-react';

export default function ReceiptView() {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  const completedTasks = tasks.filter((task) => task.status === 'completed');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}M ${secs.toString().padStart(2, '0')}S`;
  };

  const formatDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const totalTime = completedTasks.reduce((sum, task) => sum + task.actualSeconds, 0);

  if (completedTasks.length === 0) {
    return (
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-[350px]">
          <div
            className="bg-[#fdfdfd] p-6 relative pb-8"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06))',
            }}
          >
            <div
              className="text-center text-sm text-[#1a1a1a] uppercase"
              style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
            >
              NO COMPLETED TASKS YET
            </div>
            {/* Bottom jagged edge */}
            <div
              className="absolute bottom-0 left-0 right-0 h-3"
              style={{
                background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, #fdfdfd 3px, #fdfdfd 5px, transparent 5px, transparent 8px)',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-[350px]">
        <div
          className="bg-[#fdfdfd] p-6 relative pb-8"
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06))',
          }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <h2
              className="text-xl font-bold text-[#1a1a1a] uppercase tracking-wider mb-1"
              style={{ fontFamily: "'VT323', 'Share Tech Mono', monospace" }}
            >
              OUTPUT LOG
            </h2>
            <div
              className="text-xs text-[#1a1a1a] uppercase"
              style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
            >
              {formatDate()}
            </div>
          </div>

          {/* Divider */}
          <div
            className="text-center text-[#1a1a1a] mb-4 text-xs"
            style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
          >
            --------------------------------
          </div>

          {/* List Items */}
          <div className="space-y-2 mb-4">
            {completedTasks.map((task, index) => (
              <div key={task.id} className="flex items-center justify-between relative group py-1">
                <div className="flex-1 pr-2">
                  <div
                    className="text-xs text-[#1a1a1a] uppercase truncate"
                    style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
                  >
                    {task.title.toUpperCase()}
                  </div>
                </div>
                <div
                  className="text-xs text-[#1a1a1a] font-bold whitespace-nowrap"
                  style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
                >
                  {formatTime(task.actualSeconds)}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                  title="Delete"
                >
                  <Trash2 size={12} className="text-red-600" />
                </button>
                {index < completedTasks.length - 1 && (
                  <div className="absolute bottom-0 left-0 right-0 border-b border-dashed border-[#1a1a1a] opacity-30" />
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            className="text-center text-[#1a1a1a] mb-4 text-xs"
            style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
          >
            --------------------------------
          </div>

          {/* Footer */}
          <div className="space-y-2 mb-4">
            <div
              className="flex justify-between text-xs text-[#1a1a1a]"
              style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
            >
              <span className="uppercase">TOTAL QTY:</span>
              <span className="font-bold">{completedTasks.length}</span>
            </div>
            <div
              className="flex justify-between text-sm text-[#1a1a1a]"
              style={{ fontFamily: "'Share Tech Mono', 'Courier New', monospace" }}
            >
              <span className="uppercase font-bold">TOTAL TIME:</span>
              <span className="font-bold text-base">{formatTime(totalTime)}</span>
            </div>
          </div>

          {/* Barcode-like decoration */}
          <div className="mt-4 h-10 relative overflow-hidden">
            <div
              className="h-full w-full"
              style={{
                background: 'repeating-linear-gradient(90deg, #1a1a1a 0px, #1a1a1a 1px, transparent 1px, transparent 3px, #1a1a1a 3px, #1a1a1a 5px, transparent 5px, transparent 7px)',
              }}
            />
          </div>

          {/* Bottom jagged edge */}
          <div
            className="absolute bottom-0 left-0 right-0 h-3"
            style={{
              background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, #fdfdfd 3px, #fdfdfd 5px, transparent 5px, transparent 8px)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
