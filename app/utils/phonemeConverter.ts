// Simple phoneme converter with fallback to letter-by-letter

export interface PhonemeSegment {
  phoneme: string;
  display: string;
  position: number;
}

// Basic phoneme mapping for common words (can be expanded)
const BASIC_WORD_PHONEMES: { [key: string]: string[] } = {
  'he': ['h', 'e'],
  'waved': ['w', 'a', 'v', 'd'],
  'a': ['a'],
  'wand': ['w', 'a', 'n', 'd'],
  'and': ['a', 'n', 'd'],
  'magic': ['m', 'a', 'g', 'i', 'c'],
  'happened': ['h', 'a', 'p', 'p', 'e', 'n', 'd'],
  'the': ['th', 'e'],
  'cat': ['c', 'a', 't'],
  'dog': ['d', 'o', 'g'],
  'run': ['r', 'u', 'n'],
  'jump': ['j', 'u', 'm', 'p'],
  'play': ['p', 'l', 'ay'],
  'book': ['b', 'oo', 'k'],
  'tree': ['t', 'r', 'ee'],
  'house': ['h', 'ou', 's', 'e'],
  'water': ['w', 'a', 't', 'er'],
  'happy': ['h', 'a', 'p', 'py'],
  'ship': ['sh', 'i', 'p'],
  'fish': ['f', 'i', 'sh'],
  'chair': ['ch', 'ai', 'r'],
  'think': ['th', 'i', 'n', 'k'],
  'this': ['th', 'i', 's'],
  'that': ['th', 'a', 't'],
  'when': ['wh', 'e', 'n'],
  'where': ['wh', 'e', 'r', 'e'],
  'what': ['wh', 'a', 't'],
  'who': ['wh', 'o'],
  'why': ['wh', 'y'],
  'how': ['h', 'ow'],
  'now': ['n', 'ow'],
  'cow': ['c', 'ow'],
  'boy': ['b', 'oy'],
  'toy': ['t', 'oy'],
  'joy': ['j', 'oy'],
  'day': ['d', 'ay'],
  'way': ['w', 'ay'],
  'say': ['s', 'ay'],
  'stay': ['st', 'ay'],
  'night': ['n', 'igh', 't'],
  'light': ['l', 'igh', 't'],
  'right': ['r', 'igh', 't'],
  'sight': ['s', 'igh', 't'],
  'might': ['m', 'igh', 't'],
  'fight': ['f', 'igh', 't'],
  'bright': ['br', 'igh', 't'],
  'school': ['sch', 'oo', 'l'],
  'cool': ['c', 'oo', 'l'],
  'pool': ['p', 'oo', 'l'],
  'tool': ['t', 'oo', 'l'],
  'moon': ['m', 'oo', 'n'],
  'soon': ['s', 'oo', 'n'],
  'food': ['f', 'oo', 'd'],
  'good': ['g', 'oo', 'd'],
  'look': ['l', 'oo', 'k'],
  'took': ['t', 'oo', 'k'],
  'cook': ['c', 'oo', 'k'],
  'hook': ['h', 'oo', 'k'],
};

// Fallback letter-to-phoneme mapping
const LETTER_TO_PHONEME: { [key: string]: string } = {
  'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e', 'f': 'f',
  'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j', 'k': 'k', 'l': 'l',
  'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'q', 'r': 'r',
  's': 's', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x',
  'y': 'y', 'z': 'z'
};

export async function getWordPhonemesFromCMU(word: string): Promise<PhonemeSegment[]> {
  const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
  
  // First try the basic word mapping
  if (BASIC_WORD_PHONEMES[cleanWord]) {
    const phonemes = BASIC_WORD_PHONEMES[cleanWord];
    return phonemes.map((phoneme, index) => ({
      phoneme: phoneme.toUpperCase(),
      display: phoneme,
      position: index
    }));
  }
  
  // Fallback: letter-by-letter conversion
  return cleanWord.split('').map((letter, index) => ({
    phoneme: letter.toUpperCase(),
    display: LETTER_TO_PHONEME[letter] || letter,
    position: index
  }));
}

// Helper function to get phonemes as simple string array (for backward compatibility)
export function getWordPhonemesAsStrings(word: string): string[] {
  const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
  
  // First try the basic word mapping
  if (BASIC_WORD_PHONEMES[cleanWord]) {
    return BASIC_WORD_PHONEMES[cleanWord];
  }
  
  // Fallback: letter-by-letter conversion
  return cleanWord.split('').map(letter => LETTER_TO_PHONEME[letter] || letter);
} 