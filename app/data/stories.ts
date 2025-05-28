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
    id: 'harry-potter-philosophers-stone',
    title: '⚡ Harry Potter: The Boy Who Lived',
    description: 'A short, easy story of Harry\'s first year',
    pages: [
      { 
        text: 'Baby Harry lives with mean Dursleys on Privet Drive.',
        image: '/images/stories/harry-potter-philosophers-stone/page1.png',
        imageAlt: 'Baby Harry on a doorstep, aunt and uncle frowning'
      },
      { 
        text: 'Strange letters arrive. Uncle Vernon rips them away.',
        image: '/images/stories/harry-potter-philosophers-stone/page2.png',
        imageAlt: 'Uncle Vernon tearing owl-delivered letters'
      },
      { 
        text: 'Big Hagrid arrives. He brings Harry\'s school letter.',
        image: '/images/stories/harry-potter-philosophers-stone/page3.png',
        imageAlt: 'Tall bearded giant handing Harry a letter'
      },
      { 
        text: 'Diagon Alley shines with wands, books, owls, and sweets.',
        image: '/images/stories/harry-potter-philosophers-stone/page4.png',
        imageAlt: 'Busy magical street of bright shops and treats'
      },
      { 
        text: 'Harry finds Platform Nine Three Quarters at station wall.',
        image: '/images/stories/harry-potter-philosophers-stone/page5.png',
        imageAlt: 'Harry pushing trolley through a brick wall'
      },
      { 
        text: 'On train, Harry meets Ron, shares chocolate frog snacks.',
        image: '/images/stories/harry-potter-philosophers-stone/page6.png',
        imageAlt: 'Two boys laughing over candy cards'
      },
      { 
        text: 'Talking Hat sorts Harry and friends into brave Gryffindor.',
        image: '/images/stories/harry-potter-philosophers-stone/page7.png',
        imageAlt: 'Sorting Hat on Harry, cheering students nearby'
      },
      { 
        text: 'Professor Snape glares. He seems cross and gloomy.',
        image: '/images/stories/harry-potter-philosophers-stone/page8.png',
        imageAlt: 'Dark-robed teacher scowling behind bubbling cauldrons'
      },
      { 
        text: 'Halloween night: big troll storms school bathroom. Friends unite.',
        image: '/images/stories/harry-potter-philosophers-stone/page9.png',
        imageAlt: 'Kids facing a lumbering troll with club'
      },
      { 
        text: 'Harry plays Quidditch. He chases and catches golden Snitch.',
        image: '/images/stories/harry-potter-philosophers-stone/page10.png',
        imageAlt: 'Harry on broom reaching for tiny winged ball'
      },
      { 
        text: 'Magic mirror shows Harry\'s mum and dad smiling.',
        image: '/images/stories/harry-potter-philosophers-stone/page11.png',
        imageAlt: 'Harry touching shimmering mirror with parents inside'
      },
      { 
        text: 'Hagrid hides tiny dragon Norbert, causes noisy trouble.',
        image: '/images/stories/harry-potter-philosophers-stone/page12.png',
        imageAlt: 'Baby dragon breathing sparks in wooden hut'
      },
      { 
        text: 'Detention leads kids into dark forest tracking hurt unicorn.',
        image: '/images/stories/harry-potter-philosophers-stone/page13.png',
        imageAlt: 'Moonlit forest path with silver creature'
      },
      { 
        text: 'Friends think Snape wants secret Stone under school.',
        image: '/images/stories/harry-potter-philosophers-stone/page14.png',
        imageAlt: 'Whispering trio spying dark-cloaked teacher'
      },
      { 
        text: 'They jump trapdoor, fight vines, keys, and chess pieces.',
        image: '/images/stories/harry-potter-philosophers-stone/page15.png',
        imageAlt: 'Kids dodging flying keys and giant chessmen'
      },
      { 
        text: 'Surprise! Quirrell, not Snape, serves dark wizard Voldemort.',
        image: '/images/stories/harry-potter-philosophers-stone/page16.png',
        imageAlt: 'Nervous teacher removing turban, hidden face shown'
      },
      { 
        text: 'Harry\'s touch burns Quirrell. Stone safe. Voldemort flees.',
        image: '/images/stories/harry-potter-philosophers-stone/page17.png',
        imageAlt: 'Blinding light as Quirrell screams and disappears'
      },
      { 
        text: 'Gryffindor wins House Cup. Hogwarts cheers brave first years.',
        image: '/images/stories/harry-potter-philosophers-stone/page18.png',
        imageAlt: 'Great Hall glowing, red banners flying high'
      }
    ],
    emoji: '⚡',
    difficulty: 'Easy',
    category: 'Fantasy',
    coverImage: '/images/stories/harry-potter-philosophers-stone/cover.png'
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