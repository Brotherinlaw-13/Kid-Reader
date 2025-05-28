#!/usr/bin/env node

/**
 * Generate phoneme audio files using Windows Speech API
 * This script uses the Windows Speech API (SAPI) to create
 * WAV files for all English phonemes as a fallback when eSpeak-NG has issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PHONEMES_DIR = path.join(__dirname, '..', 'public', 'audio', 'phonemes');

// Mapping from ARPAbet to example words for Windows Speech API
const ARPABET_TO_WORDS = {
  // Consonants
  'b.wav': { word: 'bat', phoneme: 'b', description: 'B sound as in "bat"' },
  'ch.wav': { word: 'chip', phoneme: 'ch', description: 'CH sound as in "chip"' },
  'd.wav': { word: 'dog', phoneme: 'd', description: 'D sound as in "dog"' },
  'dh.wav': { word: 'this', phoneme: 'th', description: 'voiced TH sound as in "this"' },
  'f.wav': { word: 'fish', phoneme: 'f', description: 'F sound as in "fish"' },
  'g.wav': { word: 'go', phoneme: 'g', description: 'G sound as in "go"' },
  'h.wav': { word: 'house', phoneme: 'h', description: 'H sound as in "house"' },
  'j.wav': { word: 'jump', phoneme: 'j', description: 'J sound as in "jump"' },
  'k.wav': { word: 'cat', phoneme: 'k', description: 'K sound as in "cat"' },
  'l.wav': { word: 'love', phoneme: 'l', description: 'L sound as in "love"' },
  'm.wav': { word: 'mom', phoneme: 'm', description: 'M sound as in "mom"' },
  'n.wav': { word: 'no', phoneme: 'n', description: 'N sound as in "no"' },
  'ng.wav': { word: 'sing', phoneme: 'ng', description: 'NG sound as in "sing"' },
  'p.wav': { word: 'pop', phoneme: 'p', description: 'P sound as in "pop"' },
  'r.wav': { word: 'red', phoneme: 'r', description: 'R sound as in "red"' },
  's.wav': { word: 'see', phoneme: 's', description: 'S sound as in "see"' },
  'sh.wav': { word: 'ship', phoneme: 'sh', description: 'SH sound as in "ship"' },
  't.wav': { word: 'top', phoneme: 't', description: 'T sound as in "top"' },
  'th.wav': { word: 'think', phoneme: 'th', description: 'unvoiced TH sound as in "think"' },
  'v.wav': { word: 'very', phoneme: 'v', description: 'V sound as in "very"' },
  'w.wav': { word: 'we', phoneme: 'w', description: 'W sound as in "we"' },
  'y.wav': { word: 'yes', phoneme: 'y', description: 'Y sound as in "yes"' },
  'z.wav': { word: 'zoo', phoneme: 'z', description: 'Z sound as in "zoo"' },
  'zh.wav': { word: 'measure', phoneme: 'zh', description: 'ZH sound as in "measure"' },

  // Vowels
  'ih.wav': { word: 'bit', phoneme: 'ih', description: 'short I sound as in "bit"' },
  'eh.wav': { word: 'bet', phoneme: 'eh', description: 'short E sound as in "bet"' },
  'ae.wav': { word: 'cat', phoneme: 'ae', description: 'short A sound as in "cat"' },
  'ah.wav': { word: 'but', phoneme: 'ah', description: 'schwa sound as in "but"' },
  'ao.wav': { word: 'caught', phoneme: 'ao', description: 'short O sound as in "caught"' },
  'uh.wav': { word: 'book', phoneme: 'uh', description: 'short U sound as in "book"' },
  'iy.wav': { word: 'beat', phoneme: 'iy', description: 'long E sound as in "beat"' },
  'ey.wav': { word: 'bait', phoneme: 'ey', description: 'long A sound as in "bait"' },
  'aa.wav': { word: 'father', phoneme: 'aa', description: 'long A sound as in "father"' },
  'ow.wav': { word: 'boat', phoneme: 'ow', description: 'long O sound as in "boat"' },
  'uw.wav': { word: 'boot', phoneme: 'uw', description: 'long U sound as in "boot"' },
  'er.wav': { word: 'bird', phoneme: 'er', description: 'R-colored vowel as in "bird"' },

  // Diphthongs
  'ay.wav': { word: 'buy', phoneme: 'ay', description: 'diphthong as in "buy"' },
  'aw.wav': { word: 'cow', phoneme: 'aw', description: 'diphthong as in "cow"' },
  'oy.wav': { word: 'boy', phoneme: 'oy', description: 'diphthong as in "boy"' }
};

function checkWindowsSpeechAPI() {
  try {
    // Test if PowerShell and Windows Speech API are available
    const testCommand = `powershell -Command "Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.GetInstalledVoices().Count"`;
    const result = execSync(testCommand, { encoding: 'utf8', stdio: 'pipe' });
    const voiceCount = parseInt(result.trim());
    
    if (voiceCount > 0) {
      console.log(`✅ Windows Speech API found with ${voiceCount} voice(s)`);
      return true;
    } else {
      console.log(`❌ No voices found in Windows Speech API`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Windows Speech API not available:`, error.message);
    console.log(`\n📦 Alternative solutions:`);
    console.log(`   1. Install eSpeak-NG properly for Windows`);
    console.log(`   2. Use the web-based speech synthesis in your app`);
    console.log(`   3. Download pre-generated phoneme files`);
    return false;
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

function generatePhonemeAudio(filename, phonemeInfo, voice = 'default', force = false) {
  const filePath = path.join(PHONEMES_DIR, filename);
  
  // Skip if file already exists and not forcing
  if (fs.existsSync(filePath) && !force) {
    console.log(`⏭️  Skipping ${filename} - already exists`);
    return false;
  }

  try {
    // Create a PowerShell script to generate the phoneme using Windows Speech API
    const tempScriptPath = path.join(__dirname, 'temp_speech.ps1');
    const powershellScript = `
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Set voice if specified
if ("${voice}" -ne "default") {
    $voices = $synth.GetInstalledVoices()
    foreach ($v in $voices) {
        if ($v.VoiceInfo.Name -like "*${voice}*") {
            $synth.SelectVoice($v.VoiceInfo.Name)
            break
        }
    }
}

# Set speech rate to slow for clearer phoneme pronunciation
$synth.Rate = -2

# Generate the phoneme sound
$synth.SetOutputToWaveFile("${filePath.replace(/\\/g, '\\\\')}")
$synth.Speak("${phonemeInfo.phoneme}")
$synth.Dispose()
`;

    fs.writeFileSync(tempScriptPath, powershellScript);
    
    console.log(`🎵 Generating ${filename} (${phonemeInfo.phoneme}) - ${phonemeInfo.description}`);
    
    // Execute the PowerShell script
    execSync(`powershell -ExecutionPolicy Bypass -File "${tempScriptPath}"`, { stdio: 'pipe' });
    
    // Clean up temp script
    fs.unlinkSync(tempScriptPath);
    
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

function generateAllPhonemes(voice = 'default', force = false) {
  console.log(`\n🎵 Generating ${Object.keys(ARPABET_TO_WORDS).length} phonemes with Windows Speech API\n`);
  
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const [filename, phonemeInfo] of Object.entries(ARPABET_TO_WORDS)) {
    const result = generatePhonemeAudio(filename, phonemeInfo, voice, force);
    
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
  console.log(`   Total: ${Object.keys(ARPABET_TO_WORDS).length}`);

  if (generated > 0) {
    console.log(`\n🎉 Success! Generated ${generated} phoneme audio files using Windows Speech API.`);
    console.log(`   Files saved to: ${PHONEMES_DIR}`);
    console.log(`   Your app will now use these real audio files instead of speech synthesis!`);
  }
}

function listAvailableVoices() {
  try {
    console.log(`\n🗣️  Available Windows Speech API voices:\n`);
    
    const command = `powershell -Command "Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name + ' - ' + $_.VoiceInfo.Culture + ' (' + $_.VoiceInfo.Gender + ')' }"`;
    const voices = execSync(command, { encoding: 'utf8' });
    
    console.log(voices.trim());
    
  } catch (error) {
    console.error(`❌ Error listing voices:`, error.message);
  }
}

function main() {
  console.log(`🎵 Windows Speech API Phoneme Generator\n`);
  
  const args = process.argv.slice(2);
  
  // Parse arguments
  const voice = args.find(arg => arg.startsWith('--voice='))?.split('=')[1] || 'default';
  const force = args.includes('--force') || args.includes('-f');
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: npm run generate-phonemes-windows [options]

Options:
  --voice=VOICE    Voice to use (default: system default)
  --force, -f      Overwrite existing files
  --voices         List available voices
  --help, -h       Show this help message

Examples:
  npm run generate-phonemes-windows                    # Generate with default voice
  npm run generate-phonemes-windows --voice=David      # Generate with David voice
  npm run generate-phonemes-windows --force            # Overwrite existing files
  npm run generate-phonemes-windows --voices           # List available voices
`);
    return;
  }
  
  if (args.includes('--voices')) {
    listAvailableVoices();
    return;
  }
  
  // Check if Windows Speech API is available
  if (!checkWindowsSpeechAPI()) {
    return;
  }
  
  createPhonemeDirectory();
  generateAllPhonemes(voice, force);
  
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Test the generated audio files in your application`);
  console.log(`   2. Look for 🔊 icons instead of 🗣️ icons`);
  console.log(`   3. Try different voices with --voice=David or --voice=Zira`);
  console.log(`   4. Use --force to regenerate with different settings`);
  
  console.log(`\n🔗 Useful commands:`);
  console.log(`   npm run generate-phonemes-windows --voices    # List available voices`);
  console.log(`   npm run setup-phonemes                       # Check status`);
}

if (require.main === module) {
  main();
}

module.exports = { ARPABET_TO_WORDS, generateAllPhonemes, checkWindowsSpeechAPI }; 