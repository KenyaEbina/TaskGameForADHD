'use client';

import { useState } from 'react';
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
  const reorderTasks = useTaskStore((state) => state.reorderTasks);
  const updateTaskMeta = useTaskStore((state) => state.updateTaskMeta);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingLimitId, setEditingLimitId] = useState<string | null>(null);

  const activeTasks = tasks.filter((task) => task.status !== 'completed');
  const runningTask = tasks.find((task) => task.status === 'running');

  const totalEstimateMinutes = activeTasks.reduce(
    (sum, task) => sum + task.estimateMinutes,
    0
  );
  const totalActualSeconds = activeTasks.reduce(
    (sum, task) => sum + task.actualSeconds,
    0
  );

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
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wide font-mono">
          MISSION QUEUE
        </h2>
        <div className="text-xs text-gray-700 font-mono text-right space-y-0.5">
          <div>
            TOTAL LIMIT:{' '}
            <span className="font-bold">{totalEstimateMinutes}m</span>
          </div>
          <div>
            TOTAL ELAPSED:{' '}
            <span className="font-bold">
              {formatTime(totalActualSeconds)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {activeTasks.map((task) => (
          <div
            key={task.id}
            className={`border p-3 font-mono text-sm transition-all duration-150 cursor-grab ${
              task.status === 'running'
                ? 'bg-international-orange bg-opacity-10 border-international-orange'
                : 'bg-white border-black'
            } ${
              draggingId === task.id
                ? 'cursor-grabbing opacity-80 ring-2 ring-international-orange'
                : ''
            } ${
              dropTargetId === task.id && draggingId && draggingId !== task.id
                ? 'border-dashed border-2 border-international-orange bg-orange-50'
                : ''
            }`}
            draggable
            onDragStart={() => {
              setDraggingId(task.id);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (draggingId && draggingId !== task.id && dropTargetId !== task.id) {
                setDropTargetId(task.id);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (draggingId && draggingId !== task.id) {
                reorderTasks(draggingId, task.id);
              }
              setDraggingId(null);
              setDropTargetId(null);
            }}
            onDragLeave={() => {
              if (dropTargetId === task.id) {
                setDropTargetId(null);
              }
            }}
            onDragEnd={() => {
              setDraggingId(null);
              setDropTargetId(null);
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 space-y-1">
                {editingTitleId === task.id ? (
                  <input
                    autoFocus
                    className="w-full bg-white border border-international-orange px-2 py-1 text-sm font-bold focus:outline-none"
                    value={task.title}
                    onChange={(e) =>
                      updateTaskMeta(task.id, { title: e.target.value })
                    }
                    onBlur={() => setEditingTitleId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') {
                        setEditingTitleId(null);
                      }
                    }}
                    placeholder="Untitled mission"
                  />
                ) : (
                  <button
                    type="button"
                    onDoubleClick={() => setEditingTitleId(task.id)}
                    className="w-full text-left font-bold mb-1 hover:bg-gray-50 px-1 py-0.5 rounded"
                    title="ダブルクリックでタイトル編集"
                  >
                    {task.title || <span className="text-gray-400">Untitled mission</span>}
                  </button>
                )}

                <div className="text-xs text-gray-600 font-mono flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    LIMIT:
                    {editingLimitId === task.id ? (
                      <input
                        autoFocus
                        className="w-14 border border-international-orange bg-white px-1 py-0.5 text-xs font-mono focus:outline-none"
                        value={task.estimateMinutes.toString()}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^0-9]/g, '');
                          const num = v === '' ? 0 : Number(v);
                          updateTaskMeta(task.id, {
                            estimateMinutes: num > 0 ? num : 0,
                          });
                        }}
                        onBlur={() => setEditingLimitId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                            e.preventDefault();
                            const step = e.shiftKey ? 10 : 1;
                            const current = task.estimateMinutes || 0;
                            const next =
                              e.key === 'ArrowUp'
                                ? Math.max(1, current + step)
                                : Math.max(1, current - step);
                            updateTaskMeta(task.id, { estimateMinutes: next });
                            return;
                          }

                          if (e.key === 'Enter' || e.key === 'Escape') {
                            setEditingLimitId(null);
                          }
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        onDoubleClick={() => setEditingLimitId(task.id)}
                        className="inline-flex items-center gap-1 px-1 py-0.5 rounded hover:bg-gray-50"
                        title="ダブルクリックで時間編集"
                      >
                        <span>{task.estimateMinutes}</span>
                        <span>m</span>
                      </button>
                    )}
                  </span>
                  <span>|</span>
                  <span>ELAPSED: {formatTime(task.actualSeconds)}</span>
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
                    href={`/task?id=${task.id}`}
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
