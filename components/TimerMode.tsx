'use client';

import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { useTaskStore } from '@/store/taskStore';

export interface TimerModeRef {
  getElapsedTime: () => number;
}

interface TimerModeProps {
  onSave?: (elapsedSeconds: number) => void;
}

const TimerMode = forwardRef<TimerModeRef, TimerModeProps>(({ onSave }, ref) => {
  const tasks = useTaskStore((state) => state.tasks);
  const runningTask = tasks.find((task) => task.status === 'running');
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

      const elapsedSinceStart = Math.floor((Date.now() - startTimeRef.current) / 1000);
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
      if (startTimeRef.current !== null && runningTaskIdRef.current && !savedRef.current && onSave) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (elapsed > 0) {
          onSave(elapsed);
          savedRef.current = true;
        }
      }
    };
  }, [runningTask?.id, runningTask?.status, onSave]);

  if (!runningTask) {
    return (
      <div className="border border-black bg-white p-8">
        <h2 className="text-sm font-bold mb-4 uppercase tracking-wide font-mono">CURRENT OPERATION</h2>
        <div className="text-center py-12">
          <p className="text-sm text-gray-500 font-mono">AWAITING MISSION INITIALIZATION</p>
        </div>
      </div>
    );
  }

  const estimateSeconds = runningTask.estimateMinutes * 60;
  const remainingSeconds = estimateSeconds - currentSeconds;
  const isOverTime = remainingSeconds < 0; // 0秒を超えたら延長戦モード
  const overtimeSeconds = isOverTime ? Math.abs(remainingSeconds) : 0;

  const formatTime = (totalSeconds: number) => {
    const absSeconds = Math.abs(totalSeconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border border-black bg-white p-8">
      <div className="border border-black p-8 bg-black text-white mb-6">
        <div className="text-center">
          {isOverTime ? (
            <>
              <div className="text-6xl font-mono mb-4 font-bold" style={{ color: '#FF4F00' }}>
                +{formatTime(overtimeSeconds)}
              </div>
              <div className="text-sm uppercase tracking-wide text-gray-400">Count Up (延長戦)</div>
            </>
          ) : (
            <>
              <div className="text-6xl font-mono mb-4 font-bold">
                {formatTime(remainingSeconds)}
              </div>
              <div className="text-sm uppercase tracking-wide text-gray-400">Remaining</div>
            </>
          )}
        </div>
      </div>

      <div className="border border-black p-4 bg-white">
        <div className="text-center">
          <div className="text-2xl font-mono font-bold mb-1">
            {formatTime(currentSeconds)}
          </div>
          <div className="text-xs uppercase tracking-wide text-gray-500">Elapsed</div>
        </div>
      </div>
    </div>
  );
});

TimerMode.displayName = 'TimerMode';

export default TimerMode;
