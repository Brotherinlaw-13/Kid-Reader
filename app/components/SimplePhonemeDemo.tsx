"use client";

import { useState, useEffect } from 'react';

export default function SimplePhonemeDemo() {
  const [phonemes, setPhonemes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPhonemes = async () => {
      try {
        const phonemify = (await import('phonemify')).default;
        const word = "ship";
        const phonemeString = phonemify(word);
        
        // Parse the phoneme string - phonemify returns space-separated phonemes
        const phonemeArray = phonemeString.split(' ').filter((p: string) => p.trim() !== '' && p !== '-');
        setPhonemes(phonemeArray);
        
        console.log(`Phonemes for "${word}":`, phonemeArray);
      } catch (error) {
        console.error('Error getting phonemes:', error);
        // Fallback phonemes for "ship"
        setPhonemes(['SH', 'IH', 'P']);
      } finally {
        setIsLoading(false);
      }
    };

    getPhonemes();
  }, []);

  const speakPhoneme = (phoneme: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Direct phonetic sounds that work with speech synthesis
      const phonemeToSound: { [key: string]: string } = {
        'SH': 'shhhh',      // Extended sh sound
        'IH': 'ih',         // Short i as in "bit"
        'P': 'pah',         // P with minimal vowel
        'AE': 'ah',         // Short a as in "cat"
        'T': 'tah',         // T with minimal vowel
        'K': 'kah',         // K with minimal vowel
      };
      
      const sound = phonemeToSound[phoneme];
      
      if (sound) {
        const utterance = new SpeechSynthesisUtterance(sound);
        utterance.rate = 0.4; // Very slow for clarity
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        
        // For consonants, make them shorter
        if (['P', 'T', 'K'].includes(phoneme)) {
          utterance.rate = 0.6; // Slightly faster for plosives
        }
        
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback
        const utterance = new SpeechSynthesisUtterance(phoneme.toLowerCase());
        utterance.rate = 0.3;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading phonemes...</div>;
  }

  // Create grapheme-phoneme pairs for "ship"
  const word = "ship";
  const graphemes = ['sh', 'i', 'p']; // Proper grapheme segmentation for "ship"
  
  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Simple Phoneme Demo: "{word}"</h2>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">Raw phonemes: <code className="bg-gray-100 px-2 py-1 rounded">{phonemes.join(' ')}</code></p>
      </div>
      
      <div className="flex gap-2">
        {graphemes.map((grapheme, index) => {
          const phoneme = phonemes[index] || grapheme.toUpperCase();
          return (
            <span
              key={index}
              onClick={() => speakPhoneme(phoneme)}
              className="cursor-pointer px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded border border-blue-300 transition-colors"
              title={`Click to hear phoneme: ${phoneme}`}
            >
              <div className="text-center">
                <div className="text-lg font-bold">{grapheme}</div>
                <div className="text-xs text-gray-600">{phoneme}</div>
              </div>
            </span>
          );
        })}
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        Click each grapheme-phoneme pair to hear the sound. 
        "sh" makes the /SH/ sound, "i" makes the /IH/ sound, and "p" makes the /P/ sound.
      </p>
    </div>
  );
} 