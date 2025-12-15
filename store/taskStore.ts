import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  estimateMinutes: number; // 見積もり時間（分）
  actualSeconds: number;   // 実績時間（秒）
  status: 'idle' | 'running' | 'completed';
  createdAt: number;
}

interface TaskStore {
  tasks: Task[];
  addTask: (title: string, estimateMinutes: number) => void;
  startTask: (id: string) => void;
  stopTask: (id: string) => void;
  updateActualTime: (id: string, seconds: number) => void;
  addElapsedTime: (id: string, elapsedSeconds: number) => void; // 経過時間を加算
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  resetTask: (id: string) => void;
  reorderTasks: (sourceId: string, targetId: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (title: string, estimateMinutes: number) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title,
          estimateMinutes,
          actualSeconds: 0,
          status: 'idle',
          createdAt: Date.now(),
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      startTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              return { ...task, status: 'running' as const };
            }
            // 他の実行中タスクを停止
            if (task.status === 'running') {
              return { ...task, status: 'idle' as const };
            }
            return task;
          }),
        }));
      },

      stopTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: 'idle' as const } : task
          ),
        }));
      },

      updateActualTime: (id: string, seconds: number) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, actualSeconds: seconds } : task
          ),
        }));
      },

      // 経過時間を既存のactualSecondsに加算する
      addElapsedTime: (id: string, elapsedSeconds: number) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, actualSeconds: task.actualSeconds + elapsedSeconds }
              : task
          ),
        }));
      },

      completeTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: 'completed' as const } : task
          ),
        }));
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      resetTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, actualSeconds: 0, status: 'idle' as const }
              : task
          ),
        }));
      },

      reorderTasks: (sourceId: string, targetId: string) => {
        set((state) => {
          const tasks = [...state.tasks];
          const fromIndex = tasks.findIndex((task) => task.id === sourceId);
          const toIndex = tasks.findIndex((task) => task.id === targetId);

          if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
            return state;
          }

          const [moved] = tasks.splice(fromIndex, 1);
          tasks.splice(toIndex, 0, moved);

          return { tasks };
        });
      },
    }),
    {
      name: 'task-storage', // LocalStorageのキー名
    }
  )
);
