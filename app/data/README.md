# Stories Data Management

This directory contains the centralized story data and configuration for the Kid Reader app.

## Files

### `stories.ts`
Contains all story data, configuration, and utility functions.

## Adding New Stories

To add a new story, simply add a new object to the `stories` array in `stories.ts`:

```typescript
{
  id: 'unique-story-id',
  title: '🎈 Story Title',
  description: 'Brief description of the story',
  pages: [
    {
      text: 'First page content with as many or as few words as you want.',
      image: '/images/stories/story-id/page1.jpg',
      imageAlt: 'Description of the image for accessibility'
    },
    {
      text: 'Second page can have different length content.',
      image: '/images/stories/story-id/page2.jpg',
      imageAlt: 'Description of the second image'
    }
  ],
  emoji: '🎈',
  difficulty: 'Easy', // 'Easy' | 'Medium' | 'Hard'
  category: 'Adventure', // Any category name
  coverImage: '/images/stories/story-id/cover.jpg'
}
```

## Configuration

### Reader Settings
- `showReadPageButtonFromPage`: Which page to start showing the "Read Page" button (0 = first page, 1 = second page, etc.)

### Story Properties
- **id**: Unique identifier for the story
- **title**: Display title (can include emojis)
- **description**: Short description shown in the story selector
- **pages**: Array of story pages, each with text, image, and imageAlt
- **emoji**: Main emoji for the story card
- **difficulty**: Reading difficulty level
- **category**: Story category for filtering
- **coverImage**: Optional cover image for the story selector

### Story Page Properties
- **text**: The content for this page (can be any length)
- **image**: Optional URL or path to the image for this page
- **imageAlt**: Optional alt text for accessibility

## Utility Functions

- `getStoriesByCategory(category)`: Get stories filtered by category
- `getStoryById(id)`: Find a specific story by ID
- `getAllCategories()`: Get all available categories
- `getDifficultyColor(difficulty)`: Get CSS classes for difficulty badges
- `getStoryText(story)`: Get all text from all pages combined
- `getStoryPreview(story, maxLength)`: Get a preview of the story text

## Categories

Categories are automatically generated from the stories. Current categories include:
- Fantasy
- Adventure
- Science Fiction
- Nature

Add new categories by simply using them in story objects - they'll appear automatically in the filter.

## Page Structure

Each story is now composed of individual pages in the `pages` array. Each page:
- Contains its own text content (no automatic word splitting)
- Can have different amounts of text (short or long)
- Can include an optional image and alt text
- Is displayed as one complete page in the reader

This gives you full control over how much content appears on each page, allowing for natural story pacing and better alignment with illustrations.

## Tips

1. **Page Length**: You control exactly how much text appears on each page
2. **Natural Breaks**: Use page breaks at natural story moments (dialogue, scene changes, etc.)
3. **Emojis**: Use emojis in titles and as the main emoji for visual appeal
4. **Images**: Each page can have its own illustration to support the text
5. **Accessibility**: Always include imageAlt text for screen readers 