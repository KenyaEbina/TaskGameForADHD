"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TimerMode, { TimerModeRef } from "@/components/TimerMode";
import { useTaskStore } from "@/store/taskStore";
import { useDailyCheckInStore, getTodayDateString } from "@/store/dailyCheckInStore";
import { ArrowLeft, Pause, Check } from "lucide-react";

function TaskDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get("id") ?? "";

  const tasks = useTaskStore((state) => state.tasks);
  const startTask = useTaskStore((state) => state.startTask);
  const stopTask = useTaskStore((state) => state.stopTask);
  const addElapsedTime = useTaskStore((state) => state.addElapsedTime);
  const completeTask = useTaskStore((state) => state.completeTask);
  const addWorkTime = useDailyCheckInStore((state) => state.addWorkTime);

  const task = tasks.find((t) => t.id === taskId);
  const timerRef = useRef<TimerModeRef>(null);

  useEffect(() => {
    if (task && task.status !== "running") {
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
      // 日次チェックインに記録
      const today = getTodayDateString();
      addWorkTime(today, elapsedSeconds);
    }

    // タイマーを停止（これによりクリーンアップ処理で保存されないようにする）
    stopTask(task.id);

    // 少し待ってからページ移動（状態更新を確実にする）
    setTimeout(() => {
      router.push("/list");
    }, 100);
  };

  const handleComplete = () => {
    if (!task || !timerRef.current) return;

    // 経過時間を取得
    const elapsedSeconds = timerRef.current.getElapsedTime();

    if (elapsedSeconds > 0) {
      // 経過時間を加算
      addElapsedTime(task.id, elapsedSeconds);
      // 日次チェックインに記録
      const today = getTodayDateString();
      addWorkTime(today, elapsedSeconds);
    }

    // タイマーを停止
    stopTask(task.id);

    // タスクを完了にする
    completeTask(task.id);

    // 少し待ってからページ移動（状態更新を確実にする）
    setTimeout(() => {
      router.push("/list");
    }, 100);
  };

  if (!task) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="border border-black dark:border-te-border-dark bg-white dark:bg-te-surface-dark p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-te-text-muted-dark mb-4">
              Task not found
            </p>
            <button
              onClick={() => router.push("/list")}
              className="border border-black dark:border-te-border-dark px-4 py-2 text-sm uppercase font-mono hover:bg-gray-100 dark:hover:bg-te-border-dark"
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
            onClick={() => router.push("/list")}
            className="flex items-center gap-2 text-sm font-mono uppercase tracking-wide hover:text-international-orange transition-colors"
          >
            <ArrowLeft size={16} />
            Back to List
          </button>
        </div>

        <header className="mb-12 text-center">
          <h1 className="text-4xl font-mono font-bold mb-4 uppercase text-black dark:text-te-text-main-dark">
            {task.title}
          </h1>
          <p className="text-sm text-gray-600 dark:text-te-text-muted-dark font-mono uppercase">
            TIME LIMIT: {task.estimateMinutes} MIN
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <TimerMode
            ref={timerRef}
            onSave={(elapsedSeconds) => {
              if (elapsedSeconds > 0) {
                addElapsedTime(task.id, elapsedSeconds);
                // 日次チェックインにも記録（念のため）
                const today = getTodayDateString();
                addWorkTime(today, elapsedSeconds);
              }
            }}
          />
        </div>

        {/* アクションボタン */}
        <div className="max-w-2xl mx-auto mt-6 flex gap-4 justify-center">
          <button
            onClick={handlePauseAndSave}
            className="flex items-center gap-2 border border-black dark:border-te-border-dark bg-white dark:bg-te-surface-dark dark:text-te-text-main-dark px-6 py-3 font-mono text-sm uppercase tracking-wide hover:bg-gray-100 dark:hover:bg-te-border-dark transition-colors"
          >
            <Pause size={16} />
            PAUSE & SAVE
          </button>
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 border border-black bg-international-orange text-white px-6 py-3 font-mono text-sm uppercase tracking-wide hover:bg-orange-500 hover:border-orange-500 transition-colors dark:bg-te-accent dark:border-te-accent dark:shadow-[0_0_10px_rgba(255,79,0,0.8)]"
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
