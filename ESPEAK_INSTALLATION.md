# Installing eSpeak-NG for Phoneme Generation

This guide will help you install eSpeak-NG to generate high-quality phoneme audio files for your Kid Reader app.

## What is eSpeak-NG?

eSpeak-NG is an open-source text-to-speech synthesizer that can generate clean, isolated phoneme sounds. It's perfect for educational applications because it can produce individual phoneme audio files with consistent quality.

## Installation Options for Windows

### Option 1: Direct Windows Installation (Recommended)

1. **Download eSpeak-NG for Windows**
   - Go to: https://github.com/espeak-ng/espeak-ng/releases
   - Download the latest Windows installer (e.g., `espeak-ng-X.X.X-setup.exe`)
   - Run the installer and follow the setup wizard

2. **Add to PATH (Important!)**
   - During installation, make sure "Add to PATH" is checked
   - Or manually add the installation directory to your Windows PATH:
     - Default location: `C:\Program Files\eSpeak NG\`
     - Add this to your system PATH environment variable

3. **Verify Installation**
   ```bash
   espeak-ng --version
   ```

### Option 2: Using Windows Subsystem for Linux (WSL)

If you have WSL installed:

1. **Install in WSL Ubuntu**
   ```bash
   sudo apt update
   sudo apt install espeak-ng
   ```

2. **Generate phonemes in WSL**
   ```bash
   # Navigate to your project in WSL
   cd /mnt/e/My\ code/Kid-Reader
   npm run generate-phonemes
   ```

### Option 3: Using Chocolatey (Package Manager)

If you have Chocolatey installed:

```powershell
choco install espeak-ng
```

### Option 4: Using Scoop (Package Manager)

If you have Scoop installed:

```powershell
scoop install espeak-ng
```

## Generating Phonemes

Once eSpeak-NG is installed, you can generate all phoneme audio files:

### Basic Usage

```bash
# Generate all 39 English phonemes with American English voice
npm run generate-phonemes

# Generate with British English voice
npm run generate-phonemes --voice=en-gb

# Overwrite existing files
npm run generate-phonemes --force

# List available voices
npm run generate-phonemes --voices

# Show phoneme mapping
npm run generate-phonemes --mapping
```

### Available Voices

- `en-us` - General American English (default)
- `en-gb` - British English
- `en-au` - Australian English
- `en-ca` - Canadian English
- `en-ie` - Irish English
- `en-in` - Indian English
- `en-nz` - New Zealand English
- `en-za` - South African English

### What Gets Generated

The script will create 39 WAV files in `public/audio/phonemes/`:

**Consonants (24):**
- b.wav, ch.wav, d.wav, dh.wav, f.wav, g.wav, h.wav, j.wav
- k.wav, l.wav, m.wav, n.wav, ng.wav, p.wav, r.wav, s.wav
- sh.wav, t.wav, th.wav, v.wav, w.wav, y.wav, z.wav, zh.wav

**Vowels (12):**
- ih.wav, eh.wav, ae.wav, ah.wav, ao.wav, uh.wav
- iy.wav, ey.wav, aa.wav, ow.wav, uw.wav, er.wav

**Diphthongs (3):**
- ay.wav, aw.wav, oy.wav

## Troubleshooting

### "espeak-ng is not recognized"

This means eSpeak-NG is not in your PATH. Try:

1. **Restart your terminal/PowerShell** after installation
2. **Check installation location** and add to PATH manually
3. **Use full path** to espeak-ng.exe in the script
4. **Try WSL option** if direct Windows installation fails

### Permission Issues

If you get permission errors:
- Run PowerShell as Administrator
- Or use WSL instead

### Audio Quality

eSpeak-NG generates clean, consistent phonemes that are:
- ✅ Accurate pronunciation
- ✅ Consistent volume levels
- ✅ No background noise
- ✅ Perfect for educational use
- ✅ Much better than speech synthesis fallback

## Testing the Generated Files

After generation:

1. **Check the files**
   ```bash
   npm run setup-phonemes
   ```

2. **Test in your app**
   - Refresh your web application
   - Look for 🔊 icons instead of 🗣️ icons
   - Click on phonemes to hear the clean audio

3. **Verify quality**
   - Each phoneme should sound clear and isolated
   - No spelling out of letters (e.g., "SH" sound, not "S-H")
   - Consistent volume across all files

## Alternative: Manual Download

If automatic generation doesn't work, you can:

1. **Use the placeholder system**
   ```bash
   npm run create-placeholders
   ```

2. **Download from Freesound.org**
   - Visit: https://freesound.org/people/margo_heston/packs/12249/
   - Download individual phoneme files
   - Rename according to our naming convention

3. **Record your own**
   - Use a microphone and audio software
   - Record each phoneme sound clearly
   - Save as WAV files with correct names

## Benefits of eSpeak-NG

- 🎯 **Educational Quality**: Designed for language learning
- 🔊 **Clean Audio**: No artifacts or background noise
- 📏 **Consistent**: All phonemes have similar volume and quality
- 🌍 **Multiple Accents**: Choose from various English dialects
- 🆓 **Free & Open Source**: No licensing issues
- ⚡ **Fast Generation**: Creates all 39 phonemes in seconds

## Next Steps

1. Install eSpeak-NG using one of the methods above
2. Run `npm run generate-phonemes` to create all audio files
3. Test your Kid Reader app with real phoneme audio
4. Try different voices to find the best one for your users
5. Share your success! 🎉

---

**Need help?** Check the [eSpeak-NG documentation](https://espeak.sourceforge.net/) or open an issue in this repository. 