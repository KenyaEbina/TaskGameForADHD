"use client";

import { useState, useMemo } from "react";
import { useDailyCheckInStore, getTodayDateString } from "@/store/dailyCheckInStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CheckInCalendar() {
  const dailyData = useDailyCheckInStore((state) => state.dailyData);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12

  // 月の最初の日と最後の日を取得
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 (日) - 6 (土)

  // カレンダーの日付配列を生成
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];

    // 前月の空白を追加
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 今月の日付を追加
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [startDayOfWeek, daysInMonth]);

  // 日付文字列を生成（YYYY-MM-DD）
  const getDateString = (day: number): string => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // 秒を時間:分形式に変換
  const formatTime = (seconds: number): string => {
    if (seconds === 0) return "";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  // 作業時間に応じたスタンプの強度を計算（0-1）
  const getStampIntensity = (seconds: number): number => {
    if (seconds === 0) return 0;
    // 1時間 = 1.0, 30分 = 0.5, 15分 = 0.25 など
    return Math.min(1, seconds / 3600);
  };

  const today = getTodayDateString();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="border border-black dark:border-te-border-dark bg-white dark:bg-te-surface-dark p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-te-border-dark transition-colors rounded"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} className="text-black dark:text-te-text-main-dark" />
          </button>
          <h2 className="text-xl font-mono font-bold text-black dark:text-te-text-main-dark uppercase">
            {monthNames[month - 1]} {year}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-1 hover:bg-gray-100 dark:hover:bg-te-border-dark transition-colors rounded"
            aria-label="Next month"
          >
            <ChevronRight size={20} className="text-black dark:text-te-text-main-dark" />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="text-xs font-mono uppercase tracking-wide px-3 py-1 border border-black dark:border-te-border-dark hover:bg-gray-100 dark:hover:bg-te-border-dark transition-colors text-black dark:text-te-text-main-dark"
        >
          TODAY
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-mono uppercase tracking-wide text-gray-600 dark:text-te-text-muted-dark py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateString = getDateString(day);
          const workSeconds = dailyData[dateString] || 0;
          const isToday = dateString === today;
          const intensity = getStampIntensity(workSeconds);
          const hasWork = workSeconds > 0;

          return (
            <div
              key={dateString}
              className={`
                relative aspect-square border border-gray-300 dark:border-te-border-dark p-2
                flex flex-col items-center justify-center
                ${isToday ? "ring-2 ring-international-orange dark:ring-te-accent" : ""}
                ${hasWork ? "bg-international-orange/10 dark:bg-te-accent/10" : "bg-white dark:bg-te-surface-dark"}
                transition-colors
              `}
            >
              {/* 日付 */}
              <div
                className={`
                  text-sm font-mono font-bold mb-1
                  ${isToday ? "text-international-orange dark:text-te-accent" : "text-black dark:text-te-text-main-dark"}
                `}
              >
                {day}
              </div>

              {/* 作業時間 */}
              {hasWork && (
                <div
                  className={`
                    text-xs font-mono
                    ${intensity > 0.5 ? "text-international-orange dark:text-te-accent font-bold" : "text-gray-600 dark:text-te-text-muted-dark"}
                  `}
                  style={{
                    opacity: Math.max(0.6, intensity),
                  }}
                >
                  {formatTime(workSeconds)}
                </div>
              )}

              {/* スタンプ効果（作業した日のみ） */}
              {hasWork && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, rgba(255, 79, 0, ${intensity * 0.2}) 0%, transparent 70%)`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 月間統計 */}
      <div className="mt-6 pt-4 border-t border-gray-300 dark:border-te-border-dark">
        <div className="flex items-center justify-between text-sm font-mono">
          <span className="text-gray-600 dark:text-te-text-muted-dark uppercase">Monthly Total</span>
          <span className="text-black dark:text-te-text-main-dark font-bold">
            {formatTime(
              Object.keys(dailyData).reduce((total, date) => {
                if (date.startsWith(`${year}-${String(month).padStart(2, '0')}-`)) {
                  return total + dailyData[date];
                }
                return total;
              }, 0)
            ) || "0m"}
          </span>
        </div>
      </div>
    </div>
  );
}
