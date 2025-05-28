# Story Images

This directory contains images for the Kid Reader stories. Each story has its own subdirectory with images for each page.

## Directory Structure

```
stories/
├── magic-wand/
│   ├── cover.jpg
│   ├── page1.jpg
│   ├── page2.jpg
│   └── page3.jpg
├── brave-cat/
│   ├── cover.jpg
│   ├── page1.jpg
│   ├── page2.jpg
│   ├── page3.jpg
│   ├── page4.jpg
│   └── page5.jpg
├── rainbow-adventure/
│   ├── cover.jpg
│   ├── page1.jpg
│   ├── page2.jpg
│   ├── page3.jpg
│   └── page4.jpg
└── ... (other stories)
```

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 800x600 pixels or similar 4:3 aspect ratio
- **File naming**: 
  - `cover.jpg` for story selector cover image
  - `page1.jpg`, `page2.jpg`, etc. for story pages
- **Content**: Child-friendly illustrations that match the story text

## Adding Images

1. Create a subdirectory with the story ID (e.g., `magic-wand`)
2. Add a cover image for the story selector
3. Add page images that correspond to each story page
4. Update the story data in `app/data/stories.ts` if needed

## Current Status

Currently using placeholder images (large emoji displays). Replace the commented-out `<img>` tags in the components when actual images are available.

## Placeholder Behavior

When images are not available:
- Story selector shows large emoji on gradient background
- Story reader shows large emoji with image alt text
- All functionality works without actual image files 