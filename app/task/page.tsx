 'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TimerMode, { TimerModeRef } from '@/components/TimerMode';
import { useTaskStore } from '@/store/taskStore';
import { ArrowLeft, Pause, Check } from 'lucide-react';

function TaskDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get('id') ?? '';

  const tasks = useTaskStore((state) => state.tasks);
  const startTask = useTaskStore((state) => state.startTask);
  const stopTask = useTaskStore((state) => state.stopTask);
  const addElapsedTime = useTaskStore((state) => state.addElapsedTime);
  const completeTask = useTaskStore((state) => state.completeTask);

  const task = tasks.find((t) => t.id === taskId);
  const timerRef = useRef<TimerModeRef>(null);

  useEffect(() => {
    if (task && task.status !== 'running') {
      // ページにアクセスしたら自動的にタイマーを開始
      startTask(task.id);
    }
  }, [task?.id, task?.status, startTask]);

  const handlePauseAndSave = () => {
    if (!task || !timerRef.current) return;

    // 経過時間を取得
    const elapsedSeconds = timerRef.current.getElapsedTime();

    if (elapsedSeconds > 0) {
      // 経過時間を加算
      addElapsedTime(task.id, elapsedSeconds);
    }

    // タイマーを停止（これによりクリーンアップ処理で保存されないようにする）
    stopTask(task.id);

    // 少し待ってからページ移動（状態更新を確実にする）
    setTimeout(() => {
      router.push('/list');
    }, 100);
  };

  const handleComplete = () => {
    if (!task || !timerRef.current) return;

    // 経過時間を取得
    const elapsedSeconds = timerRef.current.getElapsedTime();

    if (elapsedSeconds > 0) {
      // 経過時間を加算
      addElapsedTime(task.id, elapsedSeconds);
    }

    // タイマーを停止
    stopTask(task.id);

    // タスクを完了にする
    completeTask(task.id);

    // 少し待ってからページ移動（状態更新を確実にする）
    setTimeout(() => {
      router.push('/list');
    }, 100);
  };

  if (!task) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="border border-black bg-white p-8 text-center">
            <p className="text-sm text-gray-500 mb-4">Task not found</p>
            <button
              onClick={() => router.push('/list')}
              className="border border-black px-4 py-2 text-sm uppercase font-mono hover:bg-gray-100"
            >
              Back to List
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8 pb-24">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/list')}
            className="flex items-center gap-2 text-sm font-mono uppercase tracking-wide hover:text-international-orange transition-colors"
          >
            <ArrowLeft size={16} />
            Back to List
          </button>
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-4xl font-mono font-bold mb-4 uppercase">{task.title}</h1>
          <p className="text-sm text-gray-600 font-mono uppercase">TIME LIMIT: {task.estimateMinutes} MIN</p>
        </header>

        <div className="max-w-2xl mx-auto">
          <TimerMode
            ref={timerRef}
            onSave={(elapsedSeconds) => {
              if (elapsedSeconds > 0) {
                addElapsedTime(task.id, elapsedSeconds);
              }
            }}
          />
        </div>

        {/* アクションボタン */}
        <div className="max-w-2xl mx-auto mt-6 flex gap-4 justify-center">
          <button
            onClick={handlePauseAndSave}
            className="flex items-center gap-2 border border-black bg-white px-6 py-3 font-mono text-sm uppercase tracking-wide hover:bg-gray-100 transition-colors"
          >
            <Pause size={16} />
            PAUSE & SAVE
          </button>
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 border border-black bg-black text-white px-6 py-3 font-mono text-sm uppercase tracking-wide hover:bg-international-orange hover:border-international-orange transition-colors"
          >
            <Check size={16} />
            COMPLETE
          </button>
        </div>
      </div>
    </main>
  );
}

export default function TaskDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <div className="border border-black bg-white p-8 text-center">
              <p className="text-sm text-gray-500 mb-4 font-mono">
                LOADING MISSION CONSOLE...
              </p>
            </div>
          </div>
        </main>
      }
    >
      <TaskDetailContent />
    </Suspense>
  );
}
