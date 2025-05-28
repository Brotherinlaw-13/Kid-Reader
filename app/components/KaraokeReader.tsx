"use client";

import { useState, useEffect } from 'react';

interface KaraokeReaderProps {
  text: string;
  title?: string;
}

export default function KaraokeReader({ text, title = "Reading Practice" }: KaraokeReaderProps) {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Split text into words, preserving punctuation
    const wordArray = text.split(/(\s+)/).filter(word => word.trim().length > 0);
    setWords(wordArray);
  }, [text]);

  const startReading = () => {
    if (isPaused) {
      setIsPaused(false);
      setIsPlaying(true);
      continueFromCurrentWord();
    } else {
      setCurrentWordIndex(-1);
      setIsPlaying(true);
      setIsPaused(false);
      readNextWord(0);
    }
  };

  const pauseReading = () => {
    setIsPlaying(false);
    setIsPaused(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  };

  const stopReading = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const continueFromCurrentWord = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  };

  const readNextWord = (wordIndex: number) => {
    if (wordIndex >= words.length || !isPlaying) {
      setIsPlaying(false);
      setCurrentWordIndex(-1);
      return;
    }

    setCurrentWordIndex(wordIndex);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const word = words[wordIndex].trim();
      if (word.length > 0) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 0.8; // Slightly slower for kids
        utterance.pitch = 1.1; // Slightly higher pitch
        utterance.volume = 0.9;
        
        utterance.onend = () => {
          if (isPlaying) {
            // Small pause between words
            setTimeout(() => {
              readNextWord(wordIndex + 1);
            }, 300);
          }
        };
        
        utterance.onerror = () => {
          // Skip to next word on error
          setTimeout(() => {
            readNextWord(wordIndex + 1);
          }, 100);
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        // Skip empty words (spaces)
        readNextWord(wordIndex + 1);
      }
    }
  };

  const jumpToWord = (wordIndex: number) => {
    if (isPlaying) {
      stopReading();
    }
    setCurrentWordIndex(wordIndex);
    setIsPlaying(true);
    setIsPaused(false);
    readNextWord(wordIndex);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {title}
      </h2>
      
      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        {!isPlaying ? (
          <button
            onClick={startReading}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <span>▶️</span>
            {isPaused ? 'Resume' : 'Start Reading'}
          </button>
        ) : (
          <button
            onClick={pauseReading}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <span>⏸️</span>
            Pause
          </button>
        )}
        
        <button
          onClick={stopReading}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <span>⏹️</span>
          Stop
        </button>
      </div>
      
      {/* Text Display */}
      <div className="text-center leading-relaxed">
        <div className="text-xl md:text-2xl lg:text-3xl space-y-4">
          {words.map((word, index) => {
            const isCurrentWord = index === currentWordIndex;
            const isPastWord = index < currentWordIndex;
            
            return (
              <span
                key={index}
                onClick={() => jumpToWord(index)}
                className={`
                  inline-block mx-1 px-2 py-1 rounded cursor-pointer transition-all duration-300 font-medium
                  ${isCurrentWord 
                    ? 'bg-blue-500 text-white scale-110 shadow-lg' 
                    : isPastWord 
                    ? 'bg-green-100 text-green-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                title={`Click to start reading from "${word.trim()}"`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
      
      {/* Progress Indicator */}
      {words.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.max(0, currentWordIndex)} / {words.length} words</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ 
                width: `${words.length > 0 ? (Math.max(0, currentWordIndex) / words.length) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Click "Start Reading" to begin</li>
          <li>• The current word will be highlighted in blue</li>
          <li>• Click any word to jump to that position</li>
          <li>• Use Pause/Resume to control the reading</li>
          <li>• Past words turn green to show progress</li>
        </ul>
      </div>
    </div>
  );
} 