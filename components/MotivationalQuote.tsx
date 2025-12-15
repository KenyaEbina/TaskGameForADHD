'use client';

import { useState, useEffect } from 'react';

const quotes = [
  { text: "The impediment to action advances action.", author: "Marcus Aurelius" },
  { text: "What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Less, but better.", author: "Dieter Rams" },
  { text: "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
  { text: "Focus on the essential, eliminate the unnecessary.", author: "Minimalist Philosophy" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Do not wait; the time will never be 'just right.' Start where you stand.", author: "Napoleon Hill" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
];

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // ページを開くたびにランダムなクォートを選択
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="border border-black bg-white p-8 text-center">
      <blockquote className="text-lg font-mono italic mb-4 text-gray-800">
        "{quote.text}"
      </blockquote>
      <cite className="text-sm text-gray-600 font-mono not-italic">
        — {quote.author}
      </cite>
    </div>
  );
}
