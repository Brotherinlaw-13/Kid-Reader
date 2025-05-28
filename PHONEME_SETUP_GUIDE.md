# Phoneme Audio Setup Guide

## Problem Solved ✅

The original issue was that eSpeak-NG on Windows was looking for data files in a Unix-style path (`/usr/share/espeak-ng-data`) instead of a Windows path, causing all phoneme generation to fail.

## Solution Implemented

We've successfully generated all 39 phoneme audio files using the **Windows Speech API** as an alternative to eSpeak-NG.

### ✅ What's Working Now

- **39/39 phoneme files generated** using Windows Speech API
- All files saved to: `public/audio/phonemes/`
- Your app will now show 🔊 icons instead of 🗣️ icons
- Real audio playback instead of browser speech synthesis

## Available Scripts

### 1. Windows Speech API (Recommended for Windows)
```bash
npm run generate-phonemes-windows
```
- ✅ **Working solution** for Windows
- Uses built-in Windows Speech API
- No additional software required
- Generated all 39 files successfully

### 2. eSpeak-NG (Original, but has issues on Windows)
```bash
npm run generate-phonemes
```
- ❌ Currently failing due to path issues
- Requires proper eSpeak-NG installation

### 3. Fix eSpeak-NG Installation
```bash
npm run fix-espeak-windows
```
- Diagnostic tool to fix eSpeak-NG issues
- Helps find and set correct data paths
- Shows installation options

### 4. Check Status
```bash
npm run setup-phonemes
```
- Shows current phoneme file status
- Lists which files exist
- Confirms setup completion

## Voice Options

### Windows Speech API Voices
To see available voices:
```bash
npm run generate-phonemes-windows --voices
```

To use a specific voice:
```bash
npm run generate-phonemes-windows --voice=David
npm run generate-phonemes-windows --voice=Zira
```

## File Details

All phoneme files are now located in:
```
public/audio/phonemes/
├── aa.wav (59.7KB) - long A sound as in "father"
├── ae.wav (65.0KB) - short A sound as in "cat"
├── ah.wav (55.8KB) - schwa sound as in "but"
├── ao.wav (65.0KB) - short O sound as in "caught"
├── aw.wav (55.8KB) - diphthong as in "cow"
├── ay.wav (55.8KB) - diphthong as in "buy"
├── b.wav (59.9KB) - B sound as in "bat"
├── ch.wav (80.3KB) - CH sound as in "chip"
├── d.wav (59.9KB) - D sound as in "dog"
├── dh.wav (76.0KB) - voiced TH sound as in "this"
├── eh.wav (55.8KB) - short E sound as in "bet"
├── er.wav (65.5KB) - R-colored vowel as in "bird"
├── ey.wav (65.9KB) - long A sound as in "bait"
├── f.wav (63.3KB) - F sound as in "fish"
├── g.wav (60.3KB) - G sound as in "go"
├── h.wav (65.7KB) - H sound as in "house"
├── ih.wav (75.6KB) - short I sound as in "bit"
├── iy.wav (55.8KB) - long E sound as in "beat"
├── j.wav (60.3KB) - J sound as in "jump"
├── k.wav (59.5KB) - K sound as in "cat"
├── l.wav (62.5KB) - L sound as in "love"
├── m.wav (62.5KB) - M sound as in "mom"
├── n.wav (62.5KB) - N sound as in "no"
├── ng.wav (70.0KB) - NG sound as in "sing"
├── ow.wav (55.8KB) - long O sound as in "boat"
├── oy.wav (55.8KB) - diphthong as in "boy"
├── p.wav (59.5KB) - P sound as in "pop"
├── r.wav (63.1KB) - R sound as in "red"
├── s.wav (65.3KB) - S sound as in "see"
├── sh.wav (77.8KB) - SH sound as in "ship"
├── t.wav (59.7KB) - T sound as in "top"
├── th.wav (76.0KB) - unvoiced TH sound as in "think"
├── uh.wav (55.8KB) - short U sound as in "book"
├── uw.wav (83.8KB) - long U sound as in "boot"
├── v.wav (59.9KB) - V sound as in "very"
├── w.wav (79.7KB) - W sound as in "we"
├── y.wav (60.7KB) - Y sound as in "yes"
├── z.wav (59.9KB) - Z sound as in "zoo"
└── zh.wav (78.2KB) - ZH sound as in "measure"
```

## Testing Your App

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Look for changes:**
   - 🔊 icons instead of 🗣️ icons
   - Real audio playback when clicking phonemes
   - Faster, more consistent pronunciation

3. **Test phoneme accuracy:**
   - Click on different phoneme buttons
   - Verify sounds match expected pronunciation
   - Check that all phonemes play audio

## Alternative Solutions (if needed)

### If you prefer eSpeak-NG:

1. **Download proper Windows installer:**
   - Visit: https://github.com/espeak-ng/espeak-ng/releases
   - Download the latest Windows .msi installer
   - Install and add to PATH

2. **Use Windows Subsystem for Linux (WSL):**
   ```bash
   wsl --install
   wsl sudo apt-get install espeak-ng
   ```

3. **Use package managers:**
   ```bash
   # Chocolatey
   choco install espeak
   
   # Scoop
   scoop install espeak
   ```

## Regenerating Files

To regenerate with different settings:
```bash
# Force regenerate all files
npm run generate-phonemes-windows --force

# Use different voice
npm run generate-phonemes-windows --voice=David --force
```

## Troubleshooting

### If Windows Speech API fails:
1. Ensure you're on Windows (not WSL)
2. Check PowerShell execution policy
3. Verify Windows Speech API is available

### If audio doesn't play in browser:
1. Check browser console for errors
2. Verify file paths are correct
3. Test with different browsers

### If phonemes sound wrong:
1. Try different voices with `--voice=` option
2. Regenerate with `--force` flag
3. Consider using eSpeak-NG for more accurate phonemes

## Success! 🎉

Your Kid Reader app now has:
- ✅ All 39 phoneme audio files
- ✅ Real audio playback
- ✅ Consistent pronunciation
- ✅ Offline functionality
- ✅ Better user experience

The app should now work perfectly with real phoneme audio instead of browser speech synthesis! 