# 📚 Kid Reader - AI-Powered Children's Reading App

A Next.js application that helps children learn to read with interactive stories, voice guidance, and beautiful AI-generated illustrations.

## ✨ Features

- **Interactive Reading**: Word-by-word progress tracking with sliders
- **Voice Guidance**: Text-to-speech for individual words and full pages
- **Beautiful AI Images**: Professional children's book illustrations generated with DALL-E 3
- **Progressive Web App**: Works offline and can be installed on devices
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🎨 AI Image Generation

This app includes a professional AI image generation system that creates beautiful children's book illustrations:

### Supported Services
- **OpenAI DALL-E 3** (Recommended) - Highest quality
- **Replicate** (Midjourney-style) - Great artistic style
- **Stability AI** - Good balance of quality/cost
- **Leonardo.AI** - Excellent for illustrations

### Quick Start
1. Get an API key from OpenAI: https://platform.openai.com/api-keys
2. Set environment variable: `export OPENAI_API_KEY="your-key-here"`
3. Install dependencies: `pip install -r requirements.txt`
4. Generate images: `python scripts/generate_ai_images.py`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Python 3.8+ (for AI image generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd kid-reader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies** (for AI images)
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Current Stories

### Magic Story ✨
A simple 3-page story about a young wizard and magic:
- **Page 1**: "Once upon a time, there was a little wizard"
- **Page 2**: "He waved his magic wand in the air"  
- **Page 3**: "Suddenly, beautiful flowers appeared everywhere!"

Complete with professional AI-generated illustrations!

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:turbo` - Start with Turbopack (faster, but may have issues)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
kid-reader/
├── app/                          # Next.js app directory
│   ├── components/              # React components
│   │   ├── PaginatedKaraokeReader.tsx
│   │   └── StorySelector.tsx
│   ├── data/                    # Story data
│   │   └── stories.ts
│   └── page.tsx                 # Main page
├── public/                      # Static assets
│   └── images/                  # Story images
│       └── stories/
│           └── magic-wand/      # Magic story images
├── scripts/                     # Utility scripts
│   └── generate_ai_images.py    # AI image generation
├── requirements.txt             # Python dependencies
└── AI_IMAGE_GENERATION_GUIDE.md # Detailed image guide
```

## 🎯 How It Works

### Reading Experience
1. **Story Selection**: Choose from available stories
2. **Page Navigation**: Navigate through story pages
3. **Word Interaction**: Click completed words to hear pronunciation
4. **Progress Tracking**: Use sliders to mark word completion
5. **Page Reading**: Listen to full page narration

### Image System
- **Automatic Loading**: Images load automatically when available
- **Fallback System**: Shows emoji placeholders if images fail
- **Responsive Design**: Images scale properly on all devices
- **Professional Quality**: AI-generated illustrations optimized for children

## 🔧 Configuration

### Reader Settings
Configure reading behavior in `app/data/stories.ts`:
- `wordsPerPage`: Number of words per reading page
- `showReadPageButtonFromPage`: When to show the "Read Page" button

### Image Generation
Customize prompts and settings in `scripts/generate_ai_images.py`

## 📱 PWA Features

- **Offline Support**: Works without internet connection
- **Installable**: Can be installed as an app on devices
- **Service Worker**: Caches resources for offline use

## 🎨 Adding New Stories

1. **Add story data** to `app/data/stories.ts`
2. **Create image directory** in `public/images/stories/[story-id]/`
3. **Generate images** using the AI script or manually
4. **Test the story** in the app

## 🐛 Troubleshooting

### Common Issues

**Turbopack Runtime Error**
- Use `npm run dev` instead of `npm run dev:turbo`
- Clear cache: `Remove-Item -Recurse -Force .next`

**Images Not Loading**
- Check file names match exactly
- Verify images are in correct directory
- Ensure proper file format (JPG/PNG)

**AI Generation Issues**
- Verify API key is set correctly
- Check internet connection
- Review error messages in console

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or issues, please check the troubleshooting section or create an issue in the repository.

---

**Made with ❤️ for young readers everywhere!** 📚✨
