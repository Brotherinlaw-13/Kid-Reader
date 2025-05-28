"use client";

import KaraokeReader from './components/KaraokeReader';

export default function Home() {
  // First paragraph from Harry Potter and the Philosopher's Stone
  const harryPotterText = "Mr. and Mrs. Dursley of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much.";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          📚 Kid Reader
        </h1>
        
        <div className="max-w-6xl mx-auto">
          <KaraokeReader 
            text={harryPotterText}
            title="🧙‍♂️ Harry Potter - The Beginning"
          />
        </div>
      </div>
    </main>
  );
}
