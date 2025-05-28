export interface ReadingProgress {
  storyId: string;
  currentPageIndex: number;
  currentWordIndex: number;
  completedPages: number[];
  wordProgress: { [pageIndex: number]: { [wordIndex: number]: number } };
  lastReadAt: string; // ISO timestamp
}

export interface UserProgress {
  [storyId: string]: ReadingProgress;
}

const STORAGE_KEY = 'kid-reader-progress';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export class ProgressTracker {
  // Check if localStorage is available
  static isAvailable(): boolean {
    if (!isBrowser) return false;
    
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // Save progress for a specific story
  static saveProgress(progress: ReadingProgress): void {
    if (!this.isAvailable()) return;
    
    try {
      const allProgress = this.getAllProgress();
      allProgress[progress.storyId] = {
        ...progress,
        lastReadAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.warn('Failed to save reading progress:', error);
    }
  }

  // Get progress for a specific story
  static getProgress(storyId: string): ReadingProgress | null {
    if (!this.isAvailable()) return null;
    
    try {
      const allProgress = this.getAllProgress();
      return allProgress[storyId] || null;
    } catch (error) {
      console.warn('Failed to load reading progress:', error);
      return null;
    }
  }

  // Get all progress data
  static getAllProgress(): UserProgress {
    if (!this.isAvailable()) return {};
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load progress data:', error);
      return {};
    }
  }

  // Clear progress for a specific story
  static clearStoryProgress(storyId: string): void {
    if (!this.isAvailable()) return;
    
    try {
      const allProgress = this.getAllProgress();
      delete allProgress[storyId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.warn('Failed to clear story progress:', error);
    }
  }

  // Clear all progress
  static clearAllProgress(): void {
    if (!this.isAvailable()) return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear all progress:', error);
    }
  }

  // Get reading statistics
  static getReadingStats(): {
    totalStoriesStarted: number;
    totalStoriesCompleted: number;
    totalPagesRead: number;
    lastReadStory?: string;
    lastReadAt?: string;
  } {
    if (!this.isAvailable()) {
      return {
        totalStoriesStarted: 0,
        totalStoriesCompleted: 0,
        totalPagesRead: 0
      };
    }
    
    try {
      const allProgress = this.getAllProgress();
      const stories = Object.values(allProgress);
      
      let totalPagesRead = 0;
      let totalStoriesCompleted = 0;
      let lastReadStory: string | undefined;
      let lastReadAt: string | undefined;

      stories.forEach(progress => {
        totalPagesRead += progress.completedPages.length;
        
        // Check if story is completed (assuming last page is completed)
        const maxPageIndex = Math.max(...progress.completedPages, -1);
        if (maxPageIndex >= 0) {
          // This is a simple heuristic - you might want to make this more sophisticated
          // based on your story structure
          totalStoriesCompleted++;
        }

        // Find most recent read
        if (!lastReadAt || progress.lastReadAt > lastReadAt) {
          lastReadAt = progress.lastReadAt;
          lastReadStory = progress.storyId;
        }
      });

      return {
        totalStoriesStarted: stories.length,
        totalStoriesCompleted,
        totalPagesRead,
        lastReadStory,
        lastReadAt
      };
    } catch (error) {
      console.warn('Failed to calculate reading stats:', error);
      return {
        totalStoriesStarted: 0,
        totalStoriesCompleted: 0,
        totalPagesRead: 0
      };
    }
  }
} 