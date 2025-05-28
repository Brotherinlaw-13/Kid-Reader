export interface StoryPage {
  text: string;
  image?: string; // URL or path to the image for this page
  imageAlt?: string; // Alt text for accessibility
}

export interface Story {
  id: string;
  title: string;
  description: string;
  pages: StoryPage[]; // Changed from single text to array of pages
  emoji: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  coverImage?: string; // Optional cover image for the story selector
}

export interface ReaderConfig {
  showReadPageButtonFromPage: number; // 0 = first page, 1 = second page, etc.
}

export const readerConfig: ReaderConfig = {
  showReadPageButtonFromPage: 1 // Don't show on first page (index 0)
};

export const stories: Story[] = [
  {
    id: 'magic-wand',
    title: '✨ Magic Story',
    description: 'A simple tale about magic and wonder',
    pages: [
      { 
        text: 'Once upon a time, there was a little wizard.',
        image: '/images/stories/magic-wand/page1.jpg',
        imageAlt: 'A young wizard with a pointed hat holding a wand'
      },
      { 
        text: 'He waved his magic wand in the air.',
        image: '/images/stories/magic-wand/page2.jpg',
        imageAlt: 'The wizard waving a sparkling wand'
      },
      { 
        text: 'Suddenly, beautiful flowers appeared everywhere!',
        image: '/images/stories/magic-wand/page3.jpg',
        imageAlt: 'Colorful flowers blooming all around the wizard'
      }
    ],
    emoji: '✨',
    difficulty: 'Easy',
    category: 'Fantasy',
    coverImage: '/images/stories/magic-wand/cover.jpg'
  }
];

// Utility functions
export const getStoriesByCategory = (category: string): Story[] => {
  if (category === 'All') return stories;
  return stories.filter(story => story.category === category);
};

export const getStoryById = (id: string): Story | undefined => {
  return stories.find(story => story.id === id);
};

export const getAllCategories = (): string[] => {
  return ['All', ...Array.from(new Set(stories.map(story => story.category)))];
};

export const getDifficultyColor = (difficulty: Story['difficulty']): string => {
  const colors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  };
  return colors[difficulty];
};

// Helper function to get total text from all pages (for backward compatibility)
export const getStoryText = (story: Story): string => {
  return story.pages.map(page => page.text).join(' ');
};

// Helper function to get story preview text
export const getStoryPreview = (story: Story, maxLength: number = 80): string => {
  const fullText = getStoryText(story);
  return fullText.length > maxLength 
    ? `${fullText.substring(0, maxLength)}...` 
    : fullText;
}; 