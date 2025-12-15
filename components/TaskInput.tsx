'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';

export default function TaskInput() {
  const [title, setTitle] = useState('');
  const [estimateMinutes, setEstimateMinutes] = useState<number>(15);
  const addTask = useTaskStore((state) => state.addTask);

  const handlePreset = (minutes: number) => {
    setEstimateMinutes(minutes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask(title.trim(), estimateMinutes);
      setTitle('');
      setEstimateMinutes(15);
    }
  };

  return (
    <div className="border border-black bg-white p-4">
      <h2 className="text-sm font-bold mb-4 uppercase tracking-wide font-mono">INPUT NEW TARGET</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-black px-3 py-2 bg-white focus:outline-none focus:border-international-orange font-mono"
            placeholder="Enter mission identifier..."
          />
        </div>

        <div>
          <label className="block text-xs uppercase mb-2 font-mono">SET TIME LIMIT</label>
          <div className="flex gap-2 mb-2">
            {[5, 15, 30].map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => handlePreset(min)}
                className={`flex-1 border border-black px-3 py-2 text-sm font-mono transition-colors ${
                  estimateMinutes === min
                    ? 'bg-international-orange text-white border-international-orange'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                {min}m
              </button>
            ))}
          </div>
          <input
            type="number"
            value={estimateMinutes}
            onChange={(e) => setEstimateMinutes(Number(e.target.value) || 0)}
            min="1"
            className="w-full border border-black px-3 py-2 bg-white focus:outline-none focus:border-international-orange font-mono"
            placeholder="Custom limit (minutes)"
          />
        </div>

        <button
          type="submit"
          className="w-full border border-black bg-black text-white px-4 py-2 font-mono text-sm uppercase tracking-wide hover:bg-international-orange hover:border-international-orange transition-colors flex items-center justify-center gap-2"
        >
          LOAD MISSION [⏎]
        </button>
      </form>
    </div>
  );
}
