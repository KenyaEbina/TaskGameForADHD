"use client";

import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useTaskStore } from "@/store/taskStore";

declare global {
  interface Window {
    timerAPI?: {
      updateRemaining?: (seconds: number) => void;
      notifyFinished?: (payload: { title: string; body: string }) => void;
    };
  }
}

export interface TimerModeRef {
  getElapsedTime: () => number;
}

interface TimerModeProps {
  onSave?: (elapsedSeconds: number) => void;
}

const TimerMode = forwardRef<TimerModeRef, TimerModeProps>(
  ({ onSave }, ref) => {
    const tasks = useTaskStore((state) => state.tasks);
    const runningTask = tasks.find((task) => task.status === "running");
    const runningTaskIdRef = useRef<string | null>(null);

    const [currentSeconds, setCurrentSeconds] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const initialSecondsRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const savedRef = useRef(false);

    // 親コンポーネントから経過時間を取得できるようにする
    useImperativeHandle(ref, () => ({
      getElapsedTime: () => {
        if (startTimeRef.current === null) return 0;
        return Math.floor((Date.now() - startTimeRef.current) / 1000);
      },
    }));

    useEffect(() => {
      if (!runningTask) {
        setCurrentSeconds(0);
        startTimeRef.current = null;
        initialSecondsRef.current = 0;
        savedRef.current = false;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      // タイマーが開始された時点を記録（初回のみ）
      if (startTimeRef.current === null) {
        initialSecondsRef.current = runningTask.actualSeconds;
        startTimeRef.current = Date.now();
        savedRef.current = false;
        runningTaskIdRef.current = runningTask.id;
      }

      // ローカル状態のみを更新（ストアは更新しない）
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current === null) return;

        const elapsedSinceStart = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        const newSeconds = initialSecondsRef.current + elapsedSinceStart;

        setCurrentSeconds(newSeconds);
      }, 100);

      // クリーンアップ処理（アンマウント時）
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        // アンマウント時に経過時間を保存（タイマーがまだ動作中の場合のみ）
        // runningTaskIdRefで管理することで、stopTaskが呼ばれた後でも正しく保存できる
        if (
          startTimeRef.current !== null &&
          runningTaskIdRef.current &&
          !savedRef.current &&
          onSave
        ) {
          const elapsed = Math.floor(
            (Date.now() - startTimeRef.current) / 1000
          );
          if (elapsed > 0) {
            onSave(elapsed);
            savedRef.current = true;
          }
        }
      };
    }, [runningTask?.id, runningTask?.status, onSave]);

    const estimateSeconds = (runningTask?.estimateMinutes ?? 0) * 60;
    const remainingSeconds = estimateSeconds - currentSeconds;
    const isOverTime = remainingSeconds < 0; // 0秒を超えたら延長戦モード
    const overtimeSeconds = isOverTime ? Math.abs(remainingSeconds) : 0;

    // Electron メニューバー & 通知連携（フックの順序を保つため、早めに宣言）
    useEffect(() => {
      if (typeof window === "undefined" || !window.timerAPI || !runningTask)
        return;

      // メニューバーに残り時間を送る（0未満のときも0として扱う）
      const safeRemaining = Math.max(0, remainingSeconds);
      window.timerAPI.updateRemaining?.(safeRemaining);

      // ぴったり 0 になったタイミングで 1 回だけ通知
      if (safeRemaining === 0 && !isOverTime) {
        window.timerAPI.notifyFinished?.({
          title: "TIME UP",
          body: `「${runningTask.title}」のタイムリミットになりました。`,
        });
      }
    }, [remainingSeconds, isOverTime, runningTask?.title]);

    if (!runningTask) {
      return (
        <div className="border border-black bg-white p-8">
          <h2 className="text-sm font-bold mb-4 uppercase tracking-wide font-mono">
            CURRENT OPERATION
          </h2>
          <div className="text-center py-12">
            <p className="text-sm text-gray-500 font-mono">
              AWAITING MISSION INITIALIZATION
            </p>
          </div>
        </div>
      );
    }

    const formatTime = (totalSeconds: number) => {
      const absSeconds = Math.abs(totalSeconds);
      const mins = Math.floor(absSeconds / 60);
      const secs = absSeconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    };

    return (
      <div className="border border-black bg-white p-8">
        <div className="border border-black dark:border-te-border-dark p-8 bg-black dark:bg-te-surface-dark text-white dark:text-te-text-main-dark mb-6">
          <div className="text-center">
            {isOverTime ? (
              <>
                <div className="text-6xl font-mono mb-4 font-bold text-te-accent dark:text-te-accent dark:drop-shadow-[0_0_8px_rgba(255,79,0,0.5)]">
                  +{formatTime(overtimeSeconds)}
                </div>
                <div className="text-sm uppercase tracking-wide text-gray-400 dark:text-te-text-muted-dark">
                  Count Up (延長戦)
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl font-mono mb-4 font-bold text-white dark:text-te-accent dark:drop-shadow-[0_0_8px_rgba(255,79,0,0.5)]">
                  {formatTime(remainingSeconds)}
                </div>
                <div className="text-sm uppercase tracking-wide text-gray-400 dark:text-te-text-muted-dark">
                  Remaining
                </div>
              </>
            )}
          </div>
        </div>

        <div className="border border-black dark:border-te-border-dark p-4 bg-white dark:bg-te-surface-dark">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold mb-1">
              {formatTime(currentSeconds)}
            </div>
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-te-text-muted-dark">
              Elapsed
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TimerMode.displayName = "TimerMode";

export default TimerMode;
