'use client';

export default function ReadingPage() {
  const text = "Harry waved his wand. Sparks flew.";
  
  return (
    <main className="p-6 text-3xl leading-relaxed select-none">
      {text.split(" ").map((word, index) => (
        <button
          key={index}
          className="hover:bg-yellow-200 rounded px-1 mx-0.5 touch-manipulation"
          onClick={() => speak(word)}
        >
          {word}
        </button>
      ))}
    </main>
  );
}

function speak(word: string) {
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(word));
} 