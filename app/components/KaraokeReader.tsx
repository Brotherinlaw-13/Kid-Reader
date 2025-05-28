"use client";

import { useState, useEffect } from 'react';

interface KaraokeReaderProps {
  text: string;
  title?: string;
}

export default function KaraokeReader({ text, title = "Reading Practice" }: KaraokeReaderProps) {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    // Split text into words, preserving punctuation
    const wordArray = text.split(/(\s+)/).filter(word => word.trim().length > 0);
    setWords(wordArray);
  }, [text]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(event.target.value);
    setCurrentWordIndex(newIndex);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {title}
      </h2>
      
      {/* Text Display */}
      <div className="text-center leading-relaxed mb-8">
        <div className="text-xl md:text-2xl lg:text-3xl space-y-4">
          {words.map((word, index) => {
            const isCurrentWord = index === currentWordIndex;
            
            return (
              <span
                key={index}
                className={`
                  inline-block mx-1 px-2 py-1 rounded transition-all duration-300 font-medium
                  ${isCurrentWord 
                    ? 'bg-blue-500 text-white scale-110 shadow-lg' 
                    : 'text-gray-700'
                  }
                `}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
      
      {/* Slider */}
      {words.length > 0 && (
        <div className="mt-8">
          <input
            type="range"
            min="0"
            max={words.length - 1}
            value={currentWordIndex}
            onChange={handleSliderChange}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentWordIndex / (words.length - 1)) * 100}%, #e5e7eb ${(currentWordIndex / (words.length - 1)) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Word {currentWordIndex + 1}</span>
            <span>of {words.length}</span>
          </div>
        </div>
      )}
    </div>
  );
} 