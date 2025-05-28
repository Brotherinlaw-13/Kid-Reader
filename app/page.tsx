"use client";

import KaraokeReader from './components/KaraokeReader';

export default function Home() {
  // First paragraph from Harry Potter and the Philosopher's Stone
  const harryPotterText = "Mr. and Mrs. Dursley of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much.";

  // Some other sample texts for variety
  const sampleTexts = [
    {
      title: "Harry Potter - Opening",
      text: "Mr. and Mrs. Dursley of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much."
    },
    {
      title: "Simple Story",
      text: "The cat sat on the mat. It was a big, fluffy cat with orange fur. The cat liked to sleep in the warm sunshine."
    },
    {
      title: "Adventure Story",
      text: "Once upon a time, there was a brave little mouse who lived in a castle. Every day, the mouse would explore new rooms and discover amazing treasures."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          📚 Kid Reader - Karaoke Style
        </h1>
        
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Main Harry Potter Reading */}
          <section>
            <KaraokeReader 
              text={harryPotterText}
              title="🧙‍♂️ Harry Potter - The Beginning"
            />
          </section>

          {/* Additional Reading Options */}
          <section className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            {sampleTexts.slice(1).map((sample, index) => (
              <KaraokeReader 
                key={index}
                text={sample.text}
                title={sample.title}
              />
            ))}
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            🎯 Click any word to jump to that position • ⏯️ Use controls to pause and resume
          </p>
        </footer>
      </div>
    </main>
  );
}
