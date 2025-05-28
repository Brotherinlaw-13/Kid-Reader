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
  text: 'The actual story text that will be read word by word.',
  emoji: '🎈',
  difficulty: 'Easy', // 'Easy' | 'Medium' | 'Hard'
  category: 'Adventure' // Any category name
}
```

## Configuration

### Reader Settings
- `wordsPerPage`: Number of words to show per page (default: 8)
- `showReadPageButtonFromPage`: Which page to start showing the "Read Page" button (0 = first page, 1 = second page, etc.)

### Story Properties
- **id**: Unique identifier for the story
- **title**: Display title (can include emojis)
- **description**: Short description shown in the story selector
- **text**: The actual story content
- **emoji**: Main emoji for the story card
- **difficulty**: Reading difficulty level
- **category**: Story category for filtering

## Utility Functions

- `getStoriesByCategory(category)`: Get stories filtered by category
- `getStoryById(id)`: Find a specific story by ID
- `getAllCategories()`: Get all available categories
- `getDifficultyColor(difficulty)`: Get CSS classes for difficulty badges

## Categories

Categories are automatically generated from the stories. Current categories include:
- Fantasy
- Adventure
- Science Fiction
- Nature

Add new categories by simply using them in story objects - they'll appear automatically in the filter.

## Tips

1. **Story Length**: Longer stories will automatically be split into multiple pages
2. **Emojis**: Use emojis in titles and as the main emoji for visual appeal
3. **Difficulty**: Consider word complexity and sentence length when setting difficulty
4. **Categories**: Keep category names consistent for better organization 