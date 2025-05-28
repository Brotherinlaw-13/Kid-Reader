# Kid Reader - Phoneme Learning App

A Next.js application that helps children learn phonemes by breaking down words into their component sounds. Click on letters to hear their phoneme sounds!

## Features

- 🔤 **Grapheme-Phoneme Mapping**: Breaks words into letters (graphemes) and sounds (phonemes)
- 🔊 **Audio Phonemes**: Uses real audio files for accurate phoneme pronunciation
- 🗣️ **Speech Synthesis Fallback**: Falls back to browser speech synthesis when audio files aren't available
- 📱 **PWA Support**: Works offline as a Progressive Web App
- 🎯 **Educational**: Perfect for teaching phonics and reading skills

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Phoneme Audio Files (Recommended)

#### Option A: Generate with eSpeak-NG (Best Quality) 🌟

```bash
npm run generate-phonemes
```

This uses the open-source eSpeak-NG synthesizer to generate clean, high-quality phoneme audio files. 

**Installation required:** See [ESPEAK_INSTALLATION.md](ESPEAK_INSTALLATION.md) for detailed setup instructions.

**Benefits:**
- ✅ Perfect pronunciation accuracy
- ✅ Consistent volume and quality
- ✅ No background noise
- ✅ Multiple English accents available
- ✅ Generates all 39 phonemes in seconds

#### Option B: Create Placeholders for All English Phonemes

```bash
npm run create-placeholders
```

This creates placeholder files for all 39 English phonemes:
- **24 Consonants**: b, ch, d, dh, f, g, h, j, k, l, m, n, ng, p, r, s, sh, t, th, v, w, y, z, zh
- **12 Vowels**: ih, eh, ae, ah, ao, uh, iy, ey, aa, ow, uw, er  
- **3 Diphthongs**: ay, aw, oy

#### Option C: Check Setup Status

```bash
npm run setup-phonemes
```

This will show you how to download and set up audio files from Freesound.org or other sources.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Complete English Phoneme List

### Consonants (24)
- `b.wav` - B sound as in "bat"
- `ch.wav` - CH sound as in "chip"  
- `d.wav` - D sound as in "dog"
- `dh.wav` - voiced TH sound as in "this"
- `f.wav` - F sound as in "fish"
- `g.wav` - G sound as in "go"
- `h.wav` - H sound as in "house"
- `j.wav` - J sound as in "jump" (JH in ARPAbet)
- `k.wav` - K sound as in "cat"
- `l.wav` - L sound as in "love"
- `m.wav` - M sound as in "mom"
- `n.wav` - N sound as in "no"
- `ng.wav` - NG sound as in "sing"
- `p.wav` - P sound as in "pop"
- `r.wav` - R sound as in "red"
- `s.wav` - S sound as in "see"
- `sh.wav` - SH sound as in "ship"
- `t.wav` - T sound as in "top"
- `th.wav` - unvoiced TH sound as in "think"
- `v.wav` - V sound as in "very"
- `w.wav` - W sound as in "we"
- `y.wav` - Y sound as in "yes"
- `z.wav` - Z sound as in "zoo"
- `zh.wav` - ZH sound as in "measure"

### Vowels (12)
- `ih.wav` - short I sound as in "bit"
- `eh.wav` - short E sound as in "bet"
- `ae.wav` - short A sound as in "cat"
- `ah.wav` - schwa sound as in "but"
- `ao.wav` - short O sound as in "caught"
- `uh.wav` - short U sound as in "book"
- `iy.wav` - long E sound as in "beat"
- `ey.wav` - long A sound as in "bait"
- `aa.wav` - long A sound as in "father"
- `ow.wav` - long O sound as in "boat"
- `uw.wav` - long U sound as in "boot"
- `er.wav` - R-colored vowel as in "bird"

### Diphthongs (3)
- `ay.wav` - diphthong as in "buy"
- `aw.wav` - diphthong as in "cow"
- `oy.wav` - diphthong as in "boy"

## How It Works

### Phoneme Detection
- Uses the `phonemify` library to convert words to ARPAbet phonemes
- Maps graphemes (letters) to phonemes (sounds) with special handling for digraphs like "sh", "ch", "th"

### Audio System
- **🔊 Audio Files**: Plays real phoneme recordings when available
- **🗣️ Speech Synthesis**: Falls back to browser text-to-speech
- **Visual Indicators**: Shows which method is being used for each phoneme

### Example: "ship"
- **Graphemes**: s-h-i-p (4 letters)
- **Phonemes**: SH-IH-P (3 sounds)
- The "sh" makes one sound (SH), "i" makes the short "i" sound (IH), and "p" makes the P sound

## Setting Up Audio Files

### Option 1: Download from Freesound.org (Recommended)
1. Visit: https://freesound.org/people/margo_heston/packs/12249/
2. Create a free account
3. Download the "English Phonemes" pack
4. Extract .wav files to `public/audio/phonemes/`
5. Rename files according to ARPAbet notation (sh.wav, ih.wav, p.wav, etc.)

### Option 2: Record Your Own
1. Use a microphone and audio recording software
2. Record each phoneme sound clearly (0.5-2 seconds each)
3. Save as .wav files in `public/audio/phonemes/`
4. Use the naming convention: sh.wav, ih.wav, p.wav, etc.

### Option 3: Other Sources
- American IPA Chart: https://americanipachart.com/
- Read Naturally: https://readnaturally.com/phonics-sounds
- Various educational websites with phoneme audio

## File Structure

```
public/
  audio/
    phonemes/          # Phoneme audio files go here
      sh.wav           # SH sound (as in "ship")
      ih.wav           # IH sound (as in "bit")
      p.wav            # P sound
      ...
app/
  components/
    AudioPhonemeReader.tsx    # Main component with audio support
    PhonemeReader.tsx         # Speech synthesis version
    SimplePhonemeDemo.tsx     # Simple demo for "ship"
scripts/
  setup-phonemes.js          # Helper script for audio setup
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run generate-phonemes` - Generate phoneme audio files using eSpeak-NG
- `npm run create-placeholders` - Create placeholder files for all English phonemes
- `npm run setup-phonemes` - Check and set up phoneme audio files

### eSpeak-NG Phoneme Generation

```bash
npm run generate-phonemes                    # Generate with en-us voice
npm run generate-phonemes --voice=en-gb      # Generate with British voice
npm run generate-phonemes --voice=en-au      # Generate with Australian voice
npm run generate-phonemes --force            # Overwrite existing files
npm run generate-phonemes --voices           # List available voices
npm run generate-phonemes --mapping          # Show ARPAbet to IPA mapping
```

### Placeholder Script Options

```bash
npm run create-placeholders          # Create placeholders for missing phonemes
npm run create-placeholders --list   # List all 39 English phonemes by type
npm run create-placeholders --status # Show current status of audio files
npm run create-placeholders --help   # Show help message
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **PWA** - Progressive Web App capabilities
- **phonemify** - Text-to-phoneme conversion
- **Web Audio API** - Audio playback
- **Speech Synthesis API** - Fallback pronunciation

## Educational Use

This app is designed for:
- Teaching phonics to children
- Helping with reading comprehension
- Supporting language learning
- Demonstrating grapheme-phoneme relationships

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
