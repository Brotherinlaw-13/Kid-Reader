"use client";

import { useState, useEffect, useRef } from 'react';

interface KaraokeReaderProps {
  text: string;
  title?: string;
}

export default function KaraokeReader({ text, title = "Reading Practice" }: KaraokeReaderProps) {
  const [words, setWords] = useState<string[]>([]);
  const [wordProgress, setWordProgress] = useState<{ [key: number]: number }>({});
  const [currentActiveWord, setCurrentActiveWord] = useState(0);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Split text into words, preserving punctuation
    const wordArray = text.split(/(\s+)/).filter(word => word.trim().length > 0);
    setWords(wordArray);
    wordRefs.current = new Array(wordArray.length);
    
    // Initialize progress for each word
    const initialProgress: { [key: number]: number } = {};
    wordArray.forEach((_, index) => {
      initialProgress[index] = 0;
    });
    setWordProgress(initialProgress);
  }, [text]);

  useEffect(() => {
    // Ensure speech synthesis voices are loaded
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      // Load voices immediately
      loadVoices();
      
      // Also load when voices change (some browsers load them asynchronously)
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  const handleWordSliderChange = (wordIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const progress = parseInt(event.target.value);
    
    setWordProgress(prev => ({
      ...prev,
      [wordIndex]: progress
    }));

    // If this word is completed (100%)
    if (progress === 100) {
      if (wordIndex === currentActiveWord && wordIndex < words.length - 1) {
        // Move to next word if not the last word
        setCurrentActiveWord(wordIndex + 1);
      } else if (wordIndex === words.length - 1) {
        // If it's the last word, mark it as completed by moving active word beyond the array
        setCurrentActiveWord(words.length);
      }
    }
    
    // If starting to work on this word (progress > 0) and it's the next word, make it active
    if (progress > 0 && wordIndex === currentActiveWord + 1) {
      setCurrentActiveWord(wordIndex);
    }
  };

  const handleCompletedWordClick = (word: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Clean the word (remove punctuation for better pronunciation)
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      
      // Get available voices and select the best female voice
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a good female voice (prioritize natural-sounding ones)
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('hazel') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('aria') ||
        voice.name.toLowerCase().includes('jenny') ||
        (voice.name.toLowerCase().includes('english') && voice.name.toLowerCase().includes('us'))
      ) || voices.find(voice => 
        voice.lang.startsWith('en') && !voice.name.toLowerCase().includes('male')
      ) || voices[0]; // Fallback to first available voice
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      // More natural speech settings
      utterance.rate = 0.9; // Slightly slower but more natural
      utterance.pitch = 1.0; // More natural pitch
      utterance.volume = 0.8;
      
      // Add a small delay to ensure voice is loaded
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  const handlePlayFullPhrase = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices and select the best female voice (same logic as individual words)
      const voices = window.speechSynthesis.getVoices();
      
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('hazel') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('karen') ||
        voice.name.toLowerCase().includes('susan') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('aria') ||
        voice.name.toLowerCase().includes('jenny') ||
        (voice.name.toLowerCase().includes('english') && voice.name.toLowerCase().includes('us'))
      ) || voices.find(voice => 
        voice.lang.startsWith('en') && !voice.name.toLowerCase().includes('male')
      ) || voices[0];
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      // More natural speech settings for full phrase
      utterance.rate = 0.85; // Slightly slower for full phrase comprehension
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  const isAllWordsCompleted = () => {
    return currentActiveWord >= words.length;
  };

  const shouldShowSlider = (wordIndex: number) => {
    // Show slider only for the current active word
    return wordIndex === currentActiveWord;
  };

  const getWordStatus = (wordIndex: number) => {
    const progress = wordProgress[wordIndex] || 0;
    
    if (wordIndex < currentActiveWord) {
      return 'completed'; // Past words that are done
    } else if (wordIndex === currentActiveWord) {
      return progress > 0 ? 'active' : 'current'; // Current word being worked on
    } else {
      return 'pending'; // Future words
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {title}
      </h2>
      
      {/* Text Display with sequential word sliders */}
      <div className="text-center leading-relaxed mb-8">
        <div className="text-xl md:text-2xl lg:text-3xl pb-16 whitespace-nowrap overflow-x-auto relative">
          {words.map((word, index) => {
            const progress = wordProgress[index] || 0;
            const status = getWordStatus(index);
            
            return (
              <span
                key={index}
                ref={(el) => { wordRefs.current[index] = el; }}
                className="inline-block mx-0.5 relative"
              >
                <span
                  className={`
                    inline-block px-2 py-1 rounded transition-all duration-300 font-medium
                    ${status === 'completed' 
                      ? 'bg-green-500 text-white shadow-lg cursor-pointer hover:bg-green-600' 
                      : status === 'active'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : status === 'current'
                      ? 'bg-yellow-200 text-gray-800 shadow-md'
                      : 'text-gray-400'
                    }
                  `}
                  onClick={status === 'completed' ? () => handleCompletedWordClick(word) : undefined}
                  title={status === 'completed' ? `Click to hear "${word.trim()}"` : undefined}
                >
                  {word}
                </span>
                
                {/* Show slider only for current active word */}
                {shouldShowSlider(index) && (
                  <div className="absolute top-full left-0 right-0 mt-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => handleWordSliderChange(index, e)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                )}
              </span>
            );
          })}
          
          {/* Play full phrase button - appears when all words are completed */}
          {isAllWordsCompleted() && (
            <button
              onClick={handlePlayFullPhrase}
              className="inline-block ml-2 px-2 py-1 text-gray-600 hover:text-gray-800 rounded-full transition-all duration-300"
              title="Play full phrase"
            >
              <span className="text-base">▶️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 