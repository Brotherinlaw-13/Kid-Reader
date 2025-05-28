#!/usr/bin/env node

/**
 * Create placeholder audio files for all English phonemes
 * This script generates simple placeholder audio files using basic tones
 * until real phoneme recordings are available
 */

const fs = require('fs');
const path = require('path');

const PHONEMES_DIR = path.join(__dirname, '..', 'public', 'audio', 'phonemes');

// Complete list of English phonemes with descriptions
const ALL_PHONEMES = {
  // Consonants
  'b.wav': { type: 'consonant', description: 'B sound as in "bat"', frequency: 200 },
  'ch.wav': { type: 'consonant', description: 'CH sound as in "chip"', frequency: 1200 },
  'd.wav': { type: 'consonant', description: 'D sound as in "dog"', frequency: 300 },
  'dh.wav': { type: 'consonant', description: 'voiced TH sound as in "this"', frequency: 800 },
  'f.wav': { type: 'consonant', description: 'F sound as in "fish"', frequency: 1500 },
  'g.wav': { type: 'consonant', description: 'G sound as in "go"', frequency: 250 },
  'h.wav': { type: 'consonant', description: 'H sound as in "house"', frequency: 500 },
  'j.wav': { type: 'consonant', description: 'J sound as in "jump" (JH in ARPAbet)', frequency: 1100 },
  'k.wav': { type: 'consonant', description: 'K sound as in "cat"', frequency: 350 },
  'l.wav': { type: 'consonant', description: 'L sound as in "love"', frequency: 400 },
  'm.wav': { type: 'consonant', description: 'M sound as in "mom"', frequency: 150 },
  'n.wav': { type: 'consonant', description: 'N sound as in "no"', frequency: 180 },
  'ng.wav': { type: 'consonant', description: 'NG sound as in "sing"', frequency: 160 },
  'p.wav': { type: 'consonant', description: 'P sound as in "pop"', frequency: 220 },
  'r.wav': { type: 'consonant', description: 'R sound as in "red"', frequency: 450 },
  's.wav': { type: 'consonant', description: 'S sound as in "see"', frequency: 2000 },
  'sh.wav': { type: 'consonant', description: 'SH sound as in "ship"', frequency: 1800 },
  't.wav': { type: 'consonant', description: 'T sound as in "top"', frequency: 320 },
  'th.wav': { type: 'consonant', description: 'unvoiced TH sound as in "think"', frequency: 900 },
  'v.wav': { type: 'consonant', description: 'V sound as in "very"', frequency: 1400 },
  'w.wav': { type: 'consonant', description: 'W sound as in "we"', frequency: 280 },
  'y.wav': { type: 'consonant', description: 'Y sound as in "yes"', frequency: 380 },
  'z.wav': { type: 'consonant', description: 'Z sound as in "zoo"', frequency: 1900 },
  'zh.wav': { type: 'consonant', description: 'ZH sound as in "measure"', frequency: 1700 },

  // Short Vowels
  'ih.wav': { type: 'vowel', description: 'short I sound as in "bit"', frequency: 600 },
  'eh.wav': { type: 'vowel', description: 'short E sound as in "bet"', frequency: 650 },
  'ae.wav': { type: 'vowel', description: 'short A sound as in "cat"', frequency: 700 },
  'ah.wav': { type: 'vowel', description: 'schwa sound as in "but"', frequency: 550 },
  'ao.wav': { type: 'vowel', description: 'short O sound as in "caught"', frequency: 500 },
  'uh.wav': { type: 'vowel', description: 'short U sound as in "book"', frequency: 480 },

  // Long Vowels
  'iy.wav': { type: 'vowel', description: 'long E sound as in "beat"', frequency: 750 },
  'ey.wav': { type: 'vowel', description: 'long A sound as in "bait"', frequency: 800 },
  'aa.wav': { type: 'vowel', description: 'long A sound as in "father"', frequency: 850 },
  'ow.wav': { type: 'vowel', description: 'long O sound as in "boat"', frequency: 450 },
  'uw.wav': { type: 'vowel', description: 'long U sound as in "boot"', frequency: 400 },

  // R-colored Vowels
  'er.wav': { type: 'vowel', description: 'R-colored vowel as in "bird"', frequency: 520 },

  // Diphthongs
  'ay.wav': { type: 'diphthong', description: 'diphthong as in "buy"', frequency: 750 },
  'aw.wav': { type: 'diphthong', description: 'diphthong as in "cow"', frequency: 600 },
  'oy.wav': { type: 'diphthong', description: 'diphthong as in "boy"', frequency: 650 }
};

function createPhonemeDirectory() {
  if (!fs.existsSync(PHONEMES_DIR)) {
    fs.mkdirSync(PHONEMES_DIR, { recursive: true });
    console.log(`✅ Created directory: ${PHONEMES_DIR}`);
  } else {
    console.log(`📁 Directory already exists: ${PHONEMES_DIR}`);
  }
}

function generatePlaceholderContent(phoneme, info) {
  // Create a simple text-based placeholder that explains what should be here
  const content = `# Placeholder for ${phoneme}

This is a placeholder file for the ${info.description}.

To replace this placeholder:
1. Record the actual ${info.description}
2. Save as ${phoneme}
3. Replace this file

Expected audio properties:
- Type: ${info.type}
- Duration: 0.5-2 seconds
- Format: WAV or MP3
- Sample Rate: 44.1kHz
- Suggested frequency range: ~${info.frequency}Hz

Download real phoneme audio from:
- Freesound.org: https://freesound.org/people/margo_heston/packs/12249/
- American IPA Chart: https://americanipachart.com/
- Record your own using a microphone

This placeholder was generated on: ${new Date().toISOString()}
`;

  return content;
}

function createPlaceholderFiles() {
  let created = 0;
  let skipped = 0;

  console.log(`\n🎵 Creating placeholder files for ${Object.keys(ALL_PHONEMES).length} phonemes...\n`);

  for (const [filename, info] of Object.entries(ALL_PHONEMES)) {
    const filePath = path.join(PHONEMES_DIR, filename);
    const placeholderPath = path.join(PHONEMES_DIR, filename.replace('.wav', '_placeholder.txt'));
    
    // Check if actual audio file already exists
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${filename} - audio file already exists`);
      skipped++;
      continue;
    }

    // Check if placeholder already exists
    if (fs.existsSync(placeholderPath)) {
      console.log(`📄 Skipping ${filename} - placeholder already exists`);
      skipped++;
      continue;
    }

    // Create placeholder text file
    try {
      const content = generatePlaceholderContent(filename, info);
      fs.writeFileSync(placeholderPath, content, 'utf8');
      console.log(`✅ Created placeholder: ${filename.replace('.wav', '_placeholder.txt')}`);
      created++;
    } catch (error) {
      console.error(`❌ Error creating placeholder for ${filename}:`, error.message);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Placeholders created: ${created}`);
  console.log(`   Files skipped: ${skipped}`);
  console.log(`   Total phonemes: ${Object.keys(ALL_PHONEMES).length}`);
}

function listPhonemesByType() {
  const byType = {};
  
  for (const [filename, info] of Object.entries(ALL_PHONEMES)) {
    if (!byType[info.type]) {
      byType[info.type] = [];
    }
    byType[info.type].push({ filename, description: info.description });
  }

  console.log(`\n📋 Complete English Phoneme List:\n`);
  
  for (const [type, phonemes] of Object.entries(byType)) {
    console.log(`${type.toUpperCase()}S (${phonemes.length}):`);
    phonemes.forEach(p => {
      console.log(`   ${p.filename.padEnd(12)} - ${p.description}`);
    });
    console.log('');
  }
}

function checkCurrentStatus() {
  const audioFiles = fs.readdirSync(PHONEMES_DIR).filter(file => 
    file.endsWith('.wav') || file.endsWith('.mp3')
  );
  
  const placeholderFiles = fs.readdirSync(PHONEMES_DIR).filter(file => 
    file.endsWith('_placeholder.txt')
  );

  const totalPhonemes = Object.keys(ALL_PHONEMES).length;
  const hasAudio = audioFiles.length;
  const hasPlaceholder = placeholderFiles.length;
  const missing = totalPhonemes - hasAudio - hasPlaceholder;

  console.log(`\n📊 Current Status:`);
  console.log(`   Real audio files: ${hasAudio}/${totalPhonemes}`);
  console.log(`   Placeholder files: ${hasPlaceholder}/${totalPhonemes}`);
  console.log(`   Missing files: ${missing}/${totalPhonemes}`);

  if (hasAudio > 0) {
    console.log(`\n🔊 Audio files found:`);
    audioFiles.forEach(file => console.log(`   - ${file}`));
  }

  return { audioFiles, placeholderFiles, missing, totalPhonemes };
}

function main() {
  console.log(`🎵 English Phoneme Placeholder Generator\n`);
  
  createPhonemeDirectory();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--list') || args.includes('-l')) {
    listPhonemesByType();
    return;
  }
  
  if (args.includes('--status') || args.includes('-s')) {
    checkCurrentStatus();
    return;
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: npm run create-placeholders [options]

Options:
  --list, -l     List all phonemes by type
  --status, -s   Show current status of audio files
  --help, -h     Show this help message

Default: Create placeholder files for missing phonemes
`);
    return;
  }

  // Default action: create placeholders
  const status = checkCurrentStatus();
  
  if (status.missing === 0 && status.audioFiles.length === status.totalPhonemes) {
    console.log(`\n🎉 All phonemes have real audio files! No placeholders needed.`);
    return;
  }
  
  createPlaceholderFiles();
  
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Download real phoneme audio files from Freesound.org`);
  console.log(`   2. Replace placeholder files with actual audio recordings`);
  console.log(`   3. Run 'npm run setup-phonemes' to check progress`);
  console.log(`   4. Test in your application - look for 🔊 icons`);
  
  console.log(`\n🔗 Useful commands:`);
  console.log(`   npm run create-placeholders --list    # List all phonemes`);
  console.log(`   npm run create-placeholders --status  # Check current status`);
  console.log(`   npm run setup-phonemes               # Check and get audio files`);
}

if (require.main === module) {
  main();
}

module.exports = { ALL_PHONEMES, createPlaceholderFiles, checkCurrentStatus }; 