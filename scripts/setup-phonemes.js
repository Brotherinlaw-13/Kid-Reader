#!/usr/bin/env node

/**
 * Setup script for phoneme audio files
 * This script helps create placeholder audio files for phonemes
 * using text-to-speech until real phoneme recordings are available
 */

const fs = require('fs');
const path = require('path');

const PHONEMES_DIR = path.join(__dirname, '..', 'public', 'audio', 'phonemes');

// Phoneme mappings for basic setup
const PHONEME_MAPPINGS = {
  // Consonants
  'sh.wav': 'SH sound as in ship',
  'ch.wav': 'CH sound as in chip', 
  'th.wav': 'TH sound as in think',
  'dh.wav': 'voiced TH sound as in this',
  'p.wav': 'P sound',
  'b.wav': 'B sound',
  't.wav': 'T sound',
  'd.wav': 'D sound',
  'k.wav': 'K sound',
  'g.wav': 'G sound',
  'f.wav': 'F sound',
  'v.wav': 'V sound',
  's.wav': 'S sound',
  'z.wav': 'Z sound',
  'zh.wav': 'ZH sound as in measure',
  'm.wav': 'M sound',
  'n.wav': 'N sound',
  'ng.wav': 'NG sound as in sing',
  'l.wav': 'L sound',
  'r.wav': 'R sound',
  'w.wav': 'W sound',
  'y.wav': 'Y sound',
  'h.wav': 'H sound',
  'j.wav': 'J sound',
  
  // Vowels
  'ih.wav': 'short I sound as in bit',
  'iy.wav': 'long E sound as in beat',
  'eh.wav': 'short E sound as in bet',
  'ey.wav': 'long A sound as in bait',
  'ae.wav': 'short A sound as in cat',
  'aa.wav': 'long A sound as in father',
  'ah.wav': 'schwa sound as in but',
  'ao.wav': 'long O sound as in caught',
  'ow.wav': 'long O sound as in boat',
  'uh.wav': 'short U sound as in book',
  'uw.wav': 'long U sound as in boot',
  'er.wav': 'R-colored vowel as in bird',
  'ay.wav': 'diphthong as in buy',
  'aw.wav': 'diphthong as in cow',
  'oy.wav': 'diphthong as in boy'
};

function createPhonemeDirectory() {
  if (!fs.existsSync(PHONEMES_DIR)) {
    fs.mkdirSync(PHONEMES_DIR, { recursive: true });
    console.log(`✅ Created directory: ${PHONEMES_DIR}`);
  } else {
    console.log(`📁 Directory already exists: ${PHONEMES_DIR}`);
  }
}

function checkExistingFiles() {
  const existingFiles = fs.readdirSync(PHONEMES_DIR).filter(file => 
    file.endsWith('.wav') || file.endsWith('.mp3')
  );
  
  console.log(`\n📊 Current status:`);
  console.log(`   Audio files found: ${existingFiles.length}`);
  console.log(`   Total phonemes needed: ${Object.keys(PHONEME_MAPPINGS).length}`);
  
  if (existingFiles.length > 0) {
    console.log(`\n🔊 Existing audio files:`);
    existingFiles.forEach(file => console.log(`   - ${file}`));
  }
  
  const missingFiles = Object.keys(PHONEME_MAPPINGS).filter(
    phoneme => !existingFiles.includes(phoneme) && !existingFiles.includes(phoneme.replace('.wav', '.mp3'))
  );
  
  if (missingFiles.length > 0) {
    console.log(`\n❌ Missing audio files:`);
    missingFiles.forEach(file => console.log(`   - ${file} (${PHONEME_MAPPINGS[file]})`));
  }
  
  return { existingFiles, missingFiles };
}

function showInstructions() {
  console.log(`\n📋 Instructions for getting phoneme audio files:\n`);
  
  console.log(`1. 🌟 RECOMMENDED: Download from Freesound.org`);
  console.log(`   - Visit: https://freesound.org/people/margo_heston/packs/12249/`);
  console.log(`   - Create a free account`);
  console.log(`   - Download the "English Phonemes" pack`);
  console.log(`   - Extract .wav files to: ${PHONEMES_DIR}`);
  console.log(`   - Rename files according to the mapping above\n`);
  
  console.log(`2. 🎤 Alternative: Record your own`);
  console.log(`   - Use a microphone and audio recording software`);
  console.log(`   - Record each phoneme sound clearly`);
  console.log(`   - Save as .wav files with the names listed above\n`);
  
  console.log(`3. 🌐 Other sources:`);
  console.log(`   - American IPA Chart: https://americanipachart.com/`);
  console.log(`   - Read Naturally: https://readnaturally.com/phonics-sounds`);
  console.log(`   - Various educational websites with phoneme audio\n`);
  
  console.log(`💡 Tips:`);
  console.log(`   - Audio files should be 0.5-2 seconds long`);
  console.log(`   - Use WAV format for best quality`);
  console.log(`   - Normalize volume to prevent clipping`);
  console.log(`   - Test in the application after adding files`);
}

function main() {
  console.log(`🎵 Phoneme Audio Setup Script\n`);
  
  createPhonemeDirectory();
  const { existingFiles, missingFiles } = checkExistingFiles();
  
  if (missingFiles.length === 0) {
    console.log(`\n🎉 All phoneme audio files are present!`);
    console.log(`   Your application should now use real audio for all phonemes.`);
  } else {
    showInstructions();
  }
  
  console.log(`\n🚀 After adding audio files:`);
  console.log(`   1. Refresh your web application`);
  console.log(`   2. Look for 🔊 icons instead of 🗣️ icons`);
  console.log(`   3. Test that phonemes sound accurate when clicked`);
  console.log(`\n   Run this script again to check your progress!`);
}

if (require.main === module) {
  main();
}

module.exports = { createPhonemeDirectory, checkExistingFiles, PHONEME_MAPPINGS }; 