"use client";

import { useState, useEffect } from 'react';

interface GraphemePhoneme {
  grapheme: string;
  phoneme: string;
  position: number;
}

export default function PhonemeReader({ word }: { word: string }) {
  const [graphemePhonemes, setGraphemePhonemes] = useState<GraphemePhoneme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rawPhonemes, setRawPhonemes] = useState<string>('');

  useEffect(() => {
    const convertToPhonemes = async () => {
      setIsLoading(true);
      try {
        // Import phonemify dynamically since it's a Node.js module
        const phonemify = (await import('phonemify')).default;
        
        // Get phonemes for the word
        const cleanWord = word.toLowerCase().replace(/[^a-zA-Z]/g, '');
        const phonemes = phonemify(cleanWord);
        setRawPhonemes(phonemes);
        
        // Split phonemes by spaces and filter out empty strings and dashes
        const phonemeArray = phonemes.split(' ').filter((p: string) => p.trim() !== '' && p !== '-');
        
        // Create grapheme-phoneme pairs with better alignment
        const pairs: GraphemePhoneme[] = [];
        
        if (phonemeArray.length > 0 && cleanWord.length > 0) {
          // For better alignment, we'll use a simple strategy:
          // - Single letters get single phonemes when possible
          // - Multi-letter combinations (like 'sh', 'ch', 'th') are handled specially
          
          let graphemeIndex = 0;
          let phonemeIndex = 0;
          
          while (graphemeIndex < cleanWord.length && phonemeIndex < phonemeArray.length) {
            const currentGrapheme = cleanWord[graphemeIndex];
            const currentPhoneme = phonemeArray[phonemeIndex];
            
            // Check for common digraphs and their phonemes
            const nextGrapheme = cleanWord[graphemeIndex + 1];
            const digraph = currentGrapheme + (nextGrapheme || '');
            
            // Common English digraphs and their typical phonemes
            const digraphMappings: { [key: string]: string[] } = {
              'sh': ['SH'],
              'ch': ['CH'],
              'th': ['TH', 'DH'],
              'ph': ['F'],
              'wh': ['W', 'HH'],
              'ck': ['K'],
              'ng': ['NG'],
              'qu': ['K', 'W']
            };
            
            if (nextGrapheme && digraphMappings[digraph.toLowerCase()]) {
              // Handle digraph
              pairs.push({
                grapheme: digraph,
                phoneme: currentPhoneme,
                position: graphemeIndex
              });
              graphemeIndex += 2;
              phonemeIndex += 1;
            } else {
              // Handle single grapheme
              pairs.push({
                grapheme: currentGrapheme,
                phoneme: currentPhoneme,
                position: graphemeIndex
              });
              graphemeIndex += 1;
              phonemeIndex += 1;
            }
          }
          
          // Handle remaining graphemes if any
          while (graphemeIndex < cleanWord.length) {
            pairs.push({
              grapheme: cleanWord[graphemeIndex],
              phoneme: cleanWord[graphemeIndex].toUpperCase(), // Fallback
              position: graphemeIndex
            });
            graphemeIndex += 1;
          }
        } else {
          // Fallback if no phonemes found
          for (let i = 0; i < cleanWord.length; i++) {
            pairs.push({
              grapheme: cleanWord[i],
              phoneme: cleanWord[i].toUpperCase(),
              position: i
            });
          }
        }
        
        setGraphemePhonemes(pairs);
      } catch (error) {
        console.error('Error converting to phonemes:', error);
        // Fallback: create pairs with graphemes only
        const cleanWord = word.replace(/[^a-zA-Z]/g, '');
        const fallbackPairs = cleanWord.split('').map((char, index) => ({
          grapheme: char,
          phoneme: char.toUpperCase(),
          position: index
        }));
        setGraphemePhonemes(fallbackPairs);
      } finally {
        setIsLoading(false);
      }
    };

    convertToPhonemes();
  }, [word]);

  const speakPhoneme = (phoneme: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Direct phonetic sounds that work well with speech synthesis
      const phonemeToSound: { [key: string]: string } = {
        // Consonants - use isolated sounds
        'SH': 'shhhh',      // Extended sh sound
        'CH': 'chhhh',      // Extended ch sound  
        'TH': 'thhhh',      // Extended th sound
        'DH': 'thhhh',      // Extended voiced th
        'ZH': 'zhhhh',      // Extended zh sound
        'NG': 'nnnng',      // Extended ng sound
        'P': 'pah',         // P with minimal vowel
        'B': 'bah',         // B with minimal vowel
        'T': 'tah',         // T with minimal vowel
        'D': 'dah',         // D with minimal vowel
        'K': 'kah',         // K with minimal vowel
        'G': 'gah',         // G with minimal vowel
        'F': 'fffff',       // Extended f sound
        'V': 'vvvvv',       // Extended v sound
        'S': 'sssss',       // Extended s sound
        'Z': 'zzzzz',       // Extended z sound
        'H': 'hhhh',        // Extended h sound
        'M': 'mmmm',        // Extended m sound
        'N': 'nnnn',        // Extended n sound
        'L': 'lllll',       // Extended l sound
        'R': 'rrrr',        // Extended r sound
        'W': 'wwww',        // Extended w sound
        'Y': 'yyyy',        // Extended y sound
        'JH': 'jah',        // J sound
        
        // Vowels - pure vowel sounds
        'IH': 'ih',         // Short i as in "bit"
        'IY': 'eee',        // Long e as in "beat"
        'EH': 'eh',         // Short e as in "bet"
        'EY': 'ay',         // Long a as in "bait"
        'AE': 'ah',         // Short a as in "cat"
        'AA': 'ahhh',       // Long a as in "father"
        'AH': 'uh',         // Schwa as in "but"
        'AO': 'awww',       // Long o as in "caught"
        'OW': 'oh',         // Long o as in "boat"
        'UH': 'uh',         // Short u as in "book"
        'UW': 'ooo',        // Long u as in "boot"
        'ER': 'errr',       // R-colored vowel
        'AY': 'eye',        // Diphthong as in "buy"
        'AW': 'ow',         // Diphthong as in "cow"
        'OY': 'oy',         // Diphthong as in "boy"
      };
      
      // Get the sound for this phoneme
      const sound = phonemeToSound[phoneme];
      
      if (sound) {
        const utterance = new SpeechSynthesisUtterance(sound);
        utterance.rate = 0.4; // Very slow for clarity
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        
        // For consonants, make them shorter
        if (['P', 'B', 'T', 'D', 'K', 'G', 'JH'].includes(phoneme)) {
          utterance.rate = 0.6; // Slightly faster for plosives
        }
        
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback: just say the phoneme name slowly
        const utterance = new SpeechSynthesisUtterance(phoneme.toLowerCase());
        utterance.rate = 0.3;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const speakWholeWord = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isLoading) {
    return (
      <div className="inline-block mx-2">
        <div className="px-2 py-1 bg-gray-100 rounded animate-pulse mb-2">
          {word}
        </div>
        <div className="flex gap-1">
          {word.split('').map((_, i) => (
            <div key={i} className="w-8 h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-block mx-2 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Whole word button */}
      <button
        onClick={speakWholeWord}
        className="block w-full px-3 py-1 mb-3 text-lg font-semibold bg-blue-100 hover:bg-blue-200 rounded transition-colors"
        title={`Speak whole word: ${word}`}
      >
        {word}
      </button>
      
      {/* Raw phonemes display */}
      <div className="text-xs text-gray-500 mb-2 font-mono">
        {rawPhonemes}
      </div>
      
      {/* Grapheme-phoneme pairs */}
      <div className="flex flex-wrap gap-1 justify-center">
        {graphemePhonemes.map((pair, index) => (
          <button
            key={index}
            onClick={() => speakPhoneme(pair.phoneme)}
            className="flex flex-col items-center p-2 bg-yellow-50 hover:bg-yellow-200 border border-yellow-300 rounded transition-colors group min-w-[2.5rem]"
            title={`Letter: ${pair.grapheme}, Sound: ${pair.phoneme}`}
          >
            {/* Grapheme (letter) */}
            <span className="text-xl font-bold text-gray-800">
              {pair.grapheme}
            </span>
            
            {/* Phoneme */}
            <span className="text-xs text-gray-600 mt-1 group-hover:text-gray-800 font-mono">
              {pair.phoneme}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 