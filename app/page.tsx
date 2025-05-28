"use client";

import KaraokeReader from './components/KaraokeReader';

export default function Home() {
  // Simple magic phrase
  const simpleText = "He waved a wand and magic happened.";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          📚 Kid Reader
        </h1>
        
        <div className="max-w-6xl mx-auto">
          <KaraokeReader 
            text={simpleText}
            title="✨ Magic Story"
          />
        </div>
      </div>
    </main>
  );
}
