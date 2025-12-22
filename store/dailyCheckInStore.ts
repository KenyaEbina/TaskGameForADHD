import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 日付文字列（YYYY-MM-DD）をキーとして、その日の合計作業時間（秒）を保存
interface DailyCheckIn {
  [date: string]: number; // date: "2024-01-15", value: 3600 (秒)
}

interface DailyCheckInStore {
  dailyData: DailyCheckIn;
  // 指定日の作業時間を加算
  addWorkTime: (date: string, seconds: number) => void;
  // 指定日の合計作業時間を取得
  getWorkTime: (date: string) => number;
  // 指定月の合計作業時間を取得
  getMonthlyTotal: (year: number, month: number) => number;
  // 指定月の作業日数を取得
  getWorkDays: (year: number, month: number) => number;
}

// 今日の日付を YYYY-MM-DD 形式で取得
export function getTodayDateString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export const useDailyCheckInStore = create<DailyCheckInStore>()(
  persist(
    (set, get) => ({
      dailyData: {},

      addWorkTime: (date: string, seconds: number) => {
        set((state) => {
          const current = state.dailyData[date] || 0;
          return {
            dailyData: {
              ...state.dailyData,
              [date]: current + seconds,
            },
          };
        });
      },

      getWorkTime: (date: string) => {
        return get().dailyData[date] || 0;
      },

      getMonthlyTotal: (year: number, month: number) => {
        const data = get().dailyData;
        let total = 0;
        const monthStr = String(month).padStart(2, '0');

        Object.keys(data).forEach((date) => {
          if (date.startsWith(`${year}-${monthStr}-`)) {
            total += data[date];
          }
        });

        return total;
      },

      getWorkDays: (year: number, month: number) => {
        const data = get().dailyData;
        const monthStr = String(month).padStart(2, '0');

        return Object.keys(data).filter((date) => {
          if (date.startsWith(`${year}-${monthStr}-`)) {
            return data[date] > 0;
          }
          return false;
        }).length;
      },
    }),
    {
      name: 'daily-checkin-storage',
    }
  )
);
