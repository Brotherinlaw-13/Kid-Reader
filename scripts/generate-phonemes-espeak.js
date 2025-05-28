#!/usr/bin/env node

/**
 * Generate phoneme audio files using eSpeak
 * This script uses eSpeak to create WAV files for all English phonemes
 * Modified to work with WSL on Windows
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PHONEMES_DIR = path.join(__dirname, '..', 'public', 'audio', 'phonemes');

// Mapping from ARPAbet to eSpeak phonemes
const ARPABET_TO_ESPEAK = {
  // Consonants
  'b.wav': 'b',
  'ch.wav': 'tS',
  'd.wav': 'd',
  'dh.wav': 'D',
  'f.wav': 'f',
  'g.wav': 'g',
  'h.wav': 'h',
  'j.wav': 'dZ',
  'k.wav': 'k',
  'l.wav': 'l',
  'm.wav': 'm',
  'n.wav': 'n',
  'ng.wav': 'N',
  'p.wav': 'p',
  'r.wav': 'r\\',
  's.wav': 's',
  'sh.wav': 'S',
  't.wav': 't',
  'th.wav': 'T',
  'v.wav': 'v',
  'w.wav': 'w',
  'y.wav': 'j',
  'z.wav': 'z',
  'zh.wav': 'Z',

  // Vowels
  'ih.wav': 'I',
  'eh.wav': 'E',
  'ae.wav': '{',
  'ah.wav': 'V',
  'ao.wav': 'O:',
  'uh.wav': 'U',
  'iy.wav': 'i:',
  'ey.wav': 'eI',
  'aa.wav': 'A:',
  'ow.wav': '@U',
  'uw.wav': 'u:',
  'er.wav': '3:',

  // Diphthongs
  'ay.wav': 'aI',
  'aw.wav': 'aU',
  'oy.wav': 'OI'
};

function checkEspeakInstallation() {
  try {
    // Check if WSL is available and has eSpeak
    const version = execSync('wsl espeak --version', { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ Found eSpeak via WSL: ${version.trim()}`);
    return 'wsl espeak';
  } catch (error) {
    console.log(`❌ eSpeak not available via WSL`);
    
    // Try native Windows eSpeak
    try {
      const version = execSync('espeak --version', { encoding: 'utf8', stdio: 'pipe' });
      console.log(`✅ Found native eSpeak: ${version.trim()}`);
      return 'espeak';
    } catch (error2) {
      console.log(`❌ Native eSpeak not found either`);
      return null;
    }
  }
}

function createPhonemeDirectory() {
  if (!fs.existsSync(PHONEMES_DIR)) {
    fs.mkdirSync(PHONEMES_DIR, { recursive: true });
    console.log(`✅ Created directory: ${PHONEMES_DIR}`);
  } else {
    console.log(`📁 Directory exists: ${PHONEMES_DIR}`);
  }
}

function windowsToWslPath(winPath) {
  // Convert a Windows path (E:\dir\file.wav) to WSL Alpine mount (/mnt/host/e/dir/file.wav)
  return winPath.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, d) => `/mnt/host/${d.toLowerCase()}`);
}

function generatePhonemeAudio(filename, espeakPhoneme, espeakCommand, voice = 'en', force = false) {
  const filePath = path.join(PHONEMES_DIR, filename);
  
  // Skip if file already exists and not forcing
  if (fs.existsSync(filePath) && !force) {
    console.log(`⏭️  Skipping ${filename} - already exists`);
    return false;
  }

  try {
    console.log(`🎵 Generating ${filename} using phoneme: [[${espeakPhoneme}]]`);
    
    if (espeakCommand.includes('wsl')) {
      // Generate directly to the Windows path through the special /mnt/host mount
      const wslOutputPath = windowsToWslPath(filePath);
      const command = `wsl espeak -v ${voice} -w "${wslOutputPath}" "[[${espeakPhoneme}]]"`;
      console.log(`   Command: ${command}`);
      execSync(command, { stdio: 'pipe' });
    } else {
      // Native Windows eSpeak
      const command = `${espeakCommand} -v ${voice} -w "${filePath}" "[[${espeakPhoneme}]]"`;
      console.log(`   Command: ${command}`);
      execSync(command, { stdio: 'pipe' });
    }
    
    // Verify the file was created
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`✅ Created ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
      return true;
    } else {
      console.log(`❌ Failed to create ${filename}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    return false;
  }
}

function generateAllPhonemes(voice = 'en', force = false) {
  console.log(`\n🎵 Generating ${Object.keys(ARPABET_TO_ESPEAK).length} phonemes with eSpeak\n`);
  
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  // Check eSpeak installation
  const espeakCommand = checkEspeakInstallation();
  if (!espeakCommand) {
    console.log('\n❌ eSpeak not found. Please install eSpeak first.');
    console.log('\n💡 Installation options:');
    console.log('   1. WSL: wsl apk add espeak');
    console.log('   2. Alternative: npm run generate-phonemes-windows');
    return;
  }

  for (const [filename, espeakPhoneme] of Object.entries(ARPABET_TO_ESPEAK)) {
    const result = generatePhonemeAudio(filename, espeakPhoneme, espeakCommand, voice, force);
    
    if (result === true) {
      generated++;
    } else if (result === false && fs.existsSync(path.join(PHONEMES_DIR, filename))) {
      skipped++;
    } else {
      failed++;
    }
  }

  console.log(`\n📊 Generation Summary:`);
  console.log(`   Generated: ${generated}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${Object.keys(ARPABET_TO_ESPEAK).length}`);

  if (generated > 0) {
    console.log(`\n🎉 Success! Generated ${generated} phoneme audio files using eSpeak.`);
    console.log(`   Files saved to: ${PHONEMES_DIR}`);
    console.log(`   Your app will now use these real phoneme audio files!`);
  }
}

function main() {
  console.log(`🎵 eSpeak Phoneme Generator (Windows/WSL Compatible)\n`);
  
  const args = process.argv.slice(2);
  
  // Parse arguments
  const voice = args.find(arg => arg.startsWith('--voice='))?.split('=')[1] || 'en';
  const force = args.includes('--force') || args.includes('-f');
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: npm run generate-phonemes [options]

Options:
  --voice=VOICE    Voice to use (default: en)
  --force, -f      Overwrite existing files
  --help, -h       Show this help message

Examples:
  npm run generate-phonemes                    # Generate with default voice
  npm run generate-phonemes --voice=en-us      # Generate with US English voice
  npm run generate-phonemes --force            # Overwrite existing files

Available voices (depends on eSpeak installation):
  en, en-us, en-gb, en-au, etc.
`);
    return;
  }
  
  createPhonemeDirectory();
  generateAllPhonemes(voice, force);
  
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Test the generated audio files in your application`);
  console.log(`   2. Look for 🔊 icons instead of 🗣️ icons`);
  console.log(`   3. Try different voices with --voice=en-us or --voice=en-gb`);
  console.log(`   4. Use --force to regenerate with different settings`);
}

if (require.main === module) {
  main();
}

module.exports = { ARPABET_TO_ESPEAK, generateAllPhonemes, checkEspeakInstallation }; 