'use client';

import { useTaskStore } from '@/store/taskStore';
import { useMemo } from 'react';

export default function DashboardStats() {
  const tasks = useTaskStore((state) => state.tasks);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });

    const completedToday = todayTasks.filter((task) => task.status === 'completed');
    const totalPlayTime = todayTasks.reduce((sum, task) => sum + task.actualSeconds, 0);

    const hours = Math.floor(totalPlayTime / 3600);
    const minutes = Math.floor((totalPlayTime % 3600) / 60);

    return {
      completedCount: completedToday.length,
      totalPlayTimeHours: hours,
      totalPlayTimeMinutes: minutes,
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="border border-black bg-white p-6">
        <div className="text-xs uppercase tracking-wide text-gray-600 mb-2 font-mono">TOTAL UPTIME</div>
        <div className="text-4xl font-mono font-bold">
          {stats.totalPlayTimeHours > 0 && `${stats.totalPlayTimeHours}h `}
          {stats.totalPlayTimeMinutes}m
        </div>
      </div>

      <div className="border border-black bg-white p-6">
        <div className="text-xs uppercase tracking-wide text-gray-600 mb-2 font-mono">TARGETS DOWN</div>
        <div className="text-4xl font-mono font-bold">{stats.completedCount}</div>
      </div>
    </div>
  );
}
