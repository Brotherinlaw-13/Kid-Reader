"use client";

import { useState, useEffect, useRef } from 'react';
import { readerConfig } from '../data/stories';

interface PaginatedKaraokeReaderProps {
  text: string;
  title?: string;
}

interface Page {
  words: string[];
  pageNumber: number;
}

export default function PaginatedKaraokeReader({ text, title = "Reading Practice" }: PaginatedKaraokeReaderProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [wordProgress, setWordProgress] = useState<{ [key: number]: number }>({});
  const [currentActiveWord, setCurrentActiveWord] = useState(0);
  const [completedPages, setCompletedPages] = useState<Set<number>>(new Set());
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Split text into words, preserving punctuation
    const allWords = text.split(/(\s+)/).filter(word => word.trim().length > 0);
    
    // Create pages using configuration
    const pagesArray: Page[] = [];
    const { wordsPerPage } = readerConfig;
    
    for (let i = 0; i < allWords.length; i += wordsPerPage) {
      const pageWords = allWords.slice(i, i + wordsPerPage);
      pagesArray.push({
        words: pageWords,
        pageNumber: Math.floor(i / wordsPerPage) + 1
      });
    }
    
    setPages(pagesArray);
    
    // Initialize progress for current page words
    if (pagesArray.length > 0) {
      const initialProgress: { [key: number]: number } = {};
      pagesArray[0].words.forEach((_, index) => {
        initialProgress[index] = 0;
      });
      setWordProgress(initialProgress);
      wordRefs.current = new Array(pagesArray[0].words.length);
    }
  }, [text]);

  useEffect(() => {
    // Reset word progress and refs when page changes
    if (pages.length > 0 && pages[currentPageIndex]) {
      const currentPage = pages[currentPageIndex];
      const initialProgress: { [key: number]: number } = {};
      currentPage.words.forEach((_, index) => {
        initialProgress[index] = 0;
      });
      setWordProgress(initialProgress);
      setCurrentActiveWord(0);
      wordRefs.current = new Array(currentPage.words.length);
    }
  }, [currentPageIndex, pages]);

  useEffect(() => {
    // Ensure speech synthesis voices are loaded
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      loadVoices();
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

    const currentPage = pages[currentPageIndex];
    if (!currentPage) return;

    // If this word is completed (100%)
    if (progress === 100) {
      if (wordIndex === currentActiveWord && wordIndex < currentPage.words.length - 1) {
        // Move to next word if not the last word on the page
        setCurrentActiveWord(wordIndex + 1);
      } else if (wordIndex === currentPage.words.length - 1) {
        // If it's the last word on the page, mark page as completed
        setCurrentActiveWord(currentPage.words.length);
        setCompletedPages(prev => new Set([...prev, currentPageIndex]));
      }
    }
    
    // If starting to work on this word (progress > 0) and it's the next word, make it active
    if (progress > 0 && wordIndex === currentActiveWord + 1) {
      setCurrentActiveWord(wordIndex);
    }
  };

  const handleCompletedWordClick = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanWord);
      
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
      
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  const handlePlayCurrentPage = () => {
    const currentPage = pages[currentPageIndex];
    if (!currentPage || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    
    const pageText = currentPage.words.join(' ');
    const utterance = new SpeechSynthesisUtterance(pageText);
    
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
    
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const nextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPageIndex(pageIndex);
    }
  };

  const isCurrentPageCompleted = () => {
    const currentPage = pages[currentPageIndex];
    return currentPage && currentActiveWord >= currentPage.words.length;
  };

  const shouldShowSlider = (wordIndex: number) => {
    return wordIndex === currentActiveWord;
  };

  const getWordStatus = (wordIndex: number) => {
    const progress = wordProgress[wordIndex] || 0;
    
    if (wordIndex < currentActiveWord) {
      return 'completed';
    } else if (wordIndex === currentActiveWord) {
      return progress > 0 ? 'active' : 'current';
    } else {
      return 'pending';
    }
  };

  // Update the Read Page button condition - show when page is completed
  const shouldShowReadPageButton = () => {
    return isCurrentPageCompleted();
  };

  if (pages.length === 0) {
    return <div>Loading...</div>;
  }

  const currentPage = pages[currentPageIndex];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Title and Page Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {title}
        </h2>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <span>Page {currentPage.pageNumber} of {pages.length}</span>
          <div className="flex gap-1">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPageIndex
                    ? 'bg-blue-500'
                    : completedPages.has(index)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
                title={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Text Display with sequential word sliders */}
      <div className="text-center leading-relaxed mb-8">
        <div className="text-xl md:text-2xl lg:text-3xl pb-16 min-h-[120px] flex flex-wrap justify-center items-start gap-2 relative">
          {currentPage.words.map((word, index) => {
            const progress = wordProgress[index] || 0;
            const status = getWordStatus(index);
            
            return (
              <span
                key={index}
                ref={(el) => { wordRefs.current[index] = el; }}
                className="inline-block relative"
              >
                <span
                  className={`
                    inline-block px-3 py-2 rounded transition-all duration-300 font-medium
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
                  <div className="absolute top-full left-0 right-0 mt-1 z-10">
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
        </div>
        
        {/* Read Page button - centered below text */}
        {shouldShowReadPageButton() && (
          <div className="text-center mb-6">
            <button
              onClick={handlePlayCurrentPage}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-all shadow-md hover:shadow-lg"
              title="Read current page aloud"
            >
              🔊 Read Page
            </button>
          </div>
        )}
      </div>

      {/* Page Controls */}
      <div className="flex justify-between items-center">
        {/* Previous button - only show if not on first page */}
        {currentPageIndex > 0 ? (
          <button
            onClick={prevPage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
          >
            <span>←</span>
            Previous
          </button>
        ) : (
          <div></div>
        )}

        {/* Empty center space - no more page completion indicator */}
        <div></div>

        {/* Next button - only show if page is completed and not on last page */}
        {isCurrentPageCompleted() && currentPageIndex < pages.length - 1 ? (
          <button
            onClick={nextPage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
          >
            Next
            <span>→</span>
          </button>
        ) : (
          <div></div>
        )}
      </div>

      {/* Story completion */}
      {currentPageIndex === pages.length - 1 && isCurrentPageCompleted() && (
        <div className="mt-6 text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-2">
            🎉 Story Complete!
          </h3>
          <p className="text-green-700">
            Great job reading the entire story!
          </p>
        </div>
      )}
    </div>
  );
} 