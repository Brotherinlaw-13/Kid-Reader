export interface Story {
  id: string;
  title: string;
  description: string;
  text: string;
  emoji: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export interface ReaderConfig {
  wordsPerPage: number;
  showReadPageButtonFromPage: number; // 0 = first page, 1 = second page, etc.
}

export const readerConfig: ReaderConfig = {
  wordsPerPage: 8,
  showReadPageButtonFromPage: 1 // Don't show on first page (index 0)
};

export const stories: Story[] = [
  {
    id: 'magic-wand',
    title: '✨ Magic Story',
    description: 'A simple tale about magic and wonder',
    text: 'He waved a wand and magic happened.',
    emoji: '✨',
    difficulty: 'Easy',
    category: 'Fantasy'
  },
  {
    id: 'brave-cat',
    title: '🐱 The Brave Cat',
    description: 'A courageous cat saves the day',
    text: 'The brave cat climbed the tall tree. She rescued the little bird. Everyone cheered for the hero cat.',
    emoji: '🐱',
    difficulty: 'Easy',
    category: 'Adventure'
  },
  {
    id: 'rainbow-adventure',
    title: '🌈 Rainbow Adventure',
    description: 'Follow the colors to find treasure',
    text: 'After the rain stopped, a beautiful rainbow appeared in the sky. Sarah followed the rainbow across the meadow. At the end, she found a pot of golden flowers.',
    emoji: '🌈',
    difficulty: 'Medium',
    category: 'Adventure'
  },
  {
    id: 'space-journey',
    title: '🚀 Space Journey',
    description: 'Explore the stars and planets',
    text: 'Captain Luna started her spaceship engines. She flew past the moon and waved at the stars. On Mars, she met friendly aliens who shared space cookies with her.',
    emoji: '🚀',
    difficulty: 'Medium',
    category: 'Science Fiction'
  },
  {
    id: 'forest-friends',
    title: '🌲 Forest Friends',
    description: 'Animals working together in the forest',
    text: 'In the deep green forest, all the animals were preparing for winter. The squirrels gathered nuts while the bears collected honey. The wise owl helped everyone make a plan to share their food.',
    emoji: '🌲',
    difficulty: 'Hard',
    category: 'Nature'
  },
  {
    id: 'underwater-world',
    title: '🐠 Underwater World',
    description: 'Discover the mysteries of the ocean',
    text: 'Deep beneath the ocean waves, colorful fish swam through coral gardens. A young dolphin named Splash loved to explore the underwater caves. One day, she discovered a sunken treasure chest filled with pearls.',
    emoji: '🐠',
    difficulty: 'Hard',
    category: 'Adventure'
  },
  {
    id: 'dragon-friend',
    title: '🐉 The Friendly Dragon',
    description: 'A dragon who loves to help others',
    text: 'In a castle high on a mountain lived a gentle dragon named Spark. Unlike other dragons, Spark loved to help people. When the village needed water, Spark used his fire to melt snow from the mountain peaks. The villagers learned that being different can be wonderful.',
    emoji: '🐉',
    difficulty: 'Hard',
    category: 'Fantasy'
  },
  {
    id: 'robot-helper',
    title: '🤖 Robot Helper',
    description: 'A robot learns about friendship',
    text: 'Beep the robot was built to clean houses. But Beep wanted to do more than just clean. One day, Beep helped a lost puppy find its way home. From that day on, Beep discovered that helping others made his circuits sparkle with joy.',
    emoji: '🤖',
    difficulty: 'Medium',
    category: 'Science Fiction'
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