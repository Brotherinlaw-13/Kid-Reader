"use client";

import { useState, useEffect } from 'react';

interface GraphemePhoneme {
  grapheme: string;
  phoneme: string;
  position: number;
}

export default function AudioPhonemeReader({ word }: { word: string }) {
  const [graphemePhonemes, setGraphemePhonemes] = useState<GraphemePhoneme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rawPhonemes, setRawPhonemes] = useState<string>('');
  const [audioCache, setAudioCache] = useState<{ [key: string]: HTMLAudioElement }>({});

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
        
        // Preload audio files for the phonemes
        preloadAudioFiles(pairs.map(p => p.phoneme));
        
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
        preloadAudioFiles(fallbackPairs.map(p => p.phoneme));
      } finally {
        setIsLoading(false);
      }
    };

    convertToPhonemes();
  }, [word]);

  const preloadAudioFiles = (phonemes: string[]) => {
    const newAudioCache: { [key: string]: HTMLAudioElement } = {};
    
    // Map ARPAbet phonemes to audio file names
    const phonemeToAudioFile: { [key: string]: string } = {
      // Consonants
      'SH': 'sh.wav',
      'CH': 'ch.wav',
      'TH': 'th.wav',
      'DH': 'dh.wav',
      'ZH': 'zh.wav',
      'NG': 'ng.wav',
      'P': 'p.wav',
      'B': 'b.wav',
      'T': 't.wav',
      'D': 'd.wav',
      'K': 'k.wav',
      'G': 'g.wav',
      'F': 'f.wav',
      'V': 'v.wav',
      'S': 's.wav',
      'Z': 'z.wav',
      'M': 'm.wav',
      'N': 'n.wav',
      'L': 'l.wav',
      'R': 'r.wav',
      'W': 'w.wav',
      'Y': 'y.wav',
      'H': 'h.wav',
      'JH': 'j.wav',
      'J': 'j.wav',  // Alternative mapping
      
      // Vowels (with and without stress markers)
      'IH': 'ih.wav',
      'IH0': 'ih.wav',
      'IH1': 'ih.wav',
      'IH2': 'ih.wav',
      'EH': 'eh.wav',
      'EH0': 'eh.wav',
      'EH1': 'eh.wav',
      'EH2': 'eh.wav',
      'AE': 'ae.wav',
      'AE0': 'ae.wav',
      'AE1': 'ae.wav',
      'AE2': 'ae.wav',
      'AH': 'ah.wav',
      'AH0': 'ah.wav',
      'AH1': 'ah.wav',
      'AH2': 'ah.wav',
      'AO': 'ao.wav',
      'AO0': 'ao.wav',
      'AO1': 'ao.wav',
      'AO2': 'ao.wav',
      'UH': 'uh.wav',
      'UH0': 'uh.wav',
      'UH1': 'uh.wav',
      'UH2': 'uh.wav',
      'IY': 'iy.wav',
      'IY0': 'iy.wav',
      'IY1': 'iy.wav',
      'IY2': 'iy.wav',
      'EY': 'ey.wav',
      'EY0': 'ey.wav',
      'EY1': 'ey.wav',
      'EY2': 'ey.wav',
      'AA': 'aa.wav',
      'AA0': 'aa.wav',
      'AA1': 'aa.wav',
      'AA2': 'aa.wav',
      'OW': 'ow.wav',
      'OW0': 'ow.wav',
      'OW1': 'ow.wav',
      'OW2': 'ow.wav',
      'UW': 'uw.wav',
      'UW0': 'uw.wav',
      'UW1': 'uw.wav',
      'UW2': 'uw.wav',
      'ER': 'er.wav',
      'ER0': 'er.wav',
      'ER1': 'er.wav',
      'ER2': 'er.wav',
      
      // Diphthongs (with and without stress markers)
      'AY': 'ay.wav',
      'AY0': 'ay.wav',
      'AY1': 'ay.wav',
      'AY2': 'ay.wav',
      'AW': 'aw.wav',
      'AW0': 'aw.wav',
      'AW1': 'aw.wav',
      'AW2': 'aw.wav',
      'OY': 'oy.wav',
      'OY0': 'oy.wav',
      'OY1': 'oy.wav',
      'OY2': 'oy.wav',
    };

    phonemes.forEach(phoneme => {
      const audioFile = phonemeToAudioFile[phoneme];
      if (audioFile) {
        try {
          const audio = new Audio(`/audio/phonemes/${audioFile}`);
          audio.preload = 'auto';
          newAudioCache[phoneme] = audio;
          console.log(`✅ Loaded audio for phoneme: ${phoneme} -> ${audioFile}`);
        } catch (error) {
          console.warn(`Could not preload audio for phoneme ${phoneme}:`, error);
        }
      } else {
        console.warn(`No audio file mapping found for phoneme: ${phoneme}`);
      }
    });

    setAudioCache(newAudioCache);
  };

  const playPhoneme = (phoneme: string) => {
    const audio = audioCache[phoneme];
    if (audio) {
      // Reset audio to beginning and play
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.warn(`Could not play audio for phoneme ${phoneme}:`, error);
        // Fallback to speech synthesis
        fallbackToSpeechSynthesis(phoneme);
      });
    } else {
      console.warn(`No audio file found for phoneme ${phoneme}, using speech synthesis fallback`);
      fallbackToSpeechSynthesis(phoneme);
    }
  };

  const fallbackToSpeechSynthesis = (phoneme: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Simple phonetic mapping for fallback
      const phonemeToSound: { [key: string]: string } = {
        'SH': 'shh',
        'IH': 'ih',
        'P': 'puh',
        'K': 'kuh',
        'AE': 'ah',
        'T': 'tuh',
      };
      
      const sound = phonemeToSound[phoneme] || phoneme.toLowerCase();
      const utterance = new SpeechSynthesisUtterance(sound);
      utterance.rate = 0.4;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
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
      
      {/* Audio status indicator */}
      <div className="text-xs text-gray-400 mb-2">
        Audio files: {Object.keys(audioCache).length} loaded
      </div>
      
      {/* Grapheme-phoneme pairs */}
      <div className="flex flex-wrap gap-1 justify-center">
        {graphemePhonemes.map((pair, index) => {
          const hasAudio = audioCache[pair.phoneme];
          return (
            <button
              key={index}
              onClick={() => playPhoneme(pair.phoneme)}
              className={`flex flex-col items-center p-2 border rounded transition-colors group min-w-[2.5rem] ${
                hasAudio 
                  ? 'bg-green-50 hover:bg-green-200 border-green-300' 
                  : 'bg-yellow-50 hover:bg-yellow-200 border-yellow-300'
              }`}
              title={`Letter: ${pair.grapheme}, Sound: ${pair.phoneme}${hasAudio ? ' (Audio)' : ' (Speech Synthesis)'}`}
            >
              {/* Grapheme (letter) */}
              <span className="text-xl font-bold text-gray-800">
                {pair.grapheme}
              </span>
              
              {/* Phoneme */}
              <span className="text-xs text-gray-600 mt-1 group-hover:text-gray-800 font-mono">
                {pair.phoneme}
              </span>
              
              {/* Audio indicator */}
              <span className="text-xs mt-1">
                {hasAudio ? '🔊' : '🗣️'}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Instructions */}
      <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded">
        <p><strong>🔊</strong> = Real phoneme audio file</p>
        <p><strong>🗣️</strong> = Speech synthesis fallback</p>
        <p className="mt-1">To get real phoneme audio files, download from: <br/>
        <a href="https://freesound.org/people/margo_heston/packs/12249/" 
           target="_blank" 
           rel="noopener noreferrer"
           className="text-blue-600 hover:underline">
          Freesound English Phonemes Pack
        </a></p>
      </div>
    </div>
  );
} 