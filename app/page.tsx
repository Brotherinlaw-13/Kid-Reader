import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="text-center max-w-2xl">
        <div className="mb-8">
          <h1 className="text-6xl mb-4">📚</h1>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Kid Reader</h1>
          <p className="text-xl text-gray-600 mb-8">
            Interactive reading app for kids with text-to-speech
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/reading"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg text-xl transition-colors touch-manipulation"
          >
            Start Reading 🎯
          </Link>
          
          <div className="text-sm text-gray-500 mt-4">
            <p>Tap any word to hear it spoken aloud!</p>
            <p className="mt-2">📱 Add to home screen for the best experience</p>
          </div>
        </div>
      </main>
    </div>
  );
}
