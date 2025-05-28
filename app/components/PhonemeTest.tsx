"use client";

import { useState, useEffect } from 'react';

export default function PhonemeTest() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testPhonemes = async () => {
      try {
        const phonemify = (await import('phonemify')).default;
        const testWord = "ship";
        const phonemes = phonemify(testWord);
        setResult(`"${testWord}" -> "${phonemes}"`);
      } catch (err) {
        setError(`Error: ${err}`);
      }
    };

    testPhonemes();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded mb-4">
      <h3 className="font-bold mb-2">Phoneme Test:</h3>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <p className="text-green-600 font-mono">{result}</p>
      )}
    </div>
  );
} 