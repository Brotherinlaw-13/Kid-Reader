"use client";

import { useState, useEffect } from 'react';
import { stories, Story } from '../data/stories';
import { ProgressTracker, type ReadingProgress } from '../utils/progressTracker';

interface ReadingProgressProps {
  onStorySelect: (story: Story) => void;
}

export default function ReadingProgress({ onStorySelect }: ReadingProgressProps) {
  const [storyProgress, setStoryProgress] = useState<{ [storyId: string]: ReadingProgress }>({});
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Load progress for all stories only on client side
    if (isClient && ProgressTracker.isAvailable()) {
      const allProgress = ProgressTracker.getAllProgress();
      setStoryProgress(allProgress);
    }
  }, [isClient]);

  const getStoryProgressPercentage = (story: Story): number => {
    const progress = storyProgress[story.id];
    if (!progress) return 0;

    let totalWords = 0;
    let completedWords = 0;

    story.pages.forEach((page, pageIndex) => {
      const words = page.text.split(/(\s+)/).filter(word => word.trim().length > 0);
      totalWords += words.length;
      
      const pageProgress = progress.wordProgress[pageIndex] || {};
      words.forEach((_, wordIndex) => {
        if (pageProgress[wordIndex] === 100) {
          completedWords++;
        }
      });
    });

    return totalWords > 0 ? Math.round((completedWords / totalWords) * 100) : 0;
  };

  const hasProgress = (story: Story): boolean => {
    return story.id in storyProgress && getStoryProgressPercentage(story) > 0;
  };

  const isCompleted = (story: Story): boolean => {
    return getStoryProgressPercentage(story) === 100;
  };

  const getLastReadDate = (story: Story): string => {
    const progress = storyProgress[story.id];
    if (!progress || !progress.lastReadAt) return 'Never';
    
    const date = new Date(progress.lastReadAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getTotalStats = () => {
    const totalStories = stories.length;
    const startedStories = Object.keys(storyProgress).length;
    const completedStories = stories.filter(story => isCompleted(story)).length;
    const totalPages = Object.values(storyProgress).reduce((total, progress) => 
      total + progress.completedPages.length, 0
    );
    const averageProgress = startedStories > 0 
      ? Math.round(stories.reduce((total, story) => 
          total + getStoryProgressPercentage(story), 0
        ) / totalStories)
      : 0;

    return { totalStories, startedStories, completedStories, totalPages, averageProgress };
  };

  const clearAllProgress = () => {
    if (confirm('Are you sure you want to clear ALL reading progress? This cannot be undone.')) {
      if (ProgressTracker.isAvailable()) {
        localStorage.removeItem('kidReader_progress');
        setStoryProgress({});
      }
    }
  };

  const stats = getTotalStats();
  const storiesWithProgress = stories.filter(story => hasProgress(story));

  if (!isClient) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          📊 Your Reading Journey
        </h2>
        <p className="text-lg text-gray-600">
          Track your progress and celebrate your achievements!
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          🏆 Reading Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.totalStories}
            </div>
            <div className="text-sm text-gray-600">Total Stories</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.startedStories}
            </div>
            <div className="text-sm text-gray-600">Stories Started</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {stats.completedStories}
            </div>
            <div className="text-sm text-gray-600">Stories Completed</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {stats.totalPages}
            </div>
            <div className="text-sm text-gray-600">Pages Read</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {stats.averageProgress}%
            </div>
            <div className="text-sm text-gray-600">Average Progress</div>
          </div>
        </div>
      </div>

      {/* Progress Details */}
      {storiesWithProgress.length > 0 ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              📚 Story Progress Details
            </h3>
            <button
              onClick={clearAllProgress}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 hover:border-red-500 rounded-lg transition-all"
            >
              Clear All Progress
            </button>
          </div>
          
          <div className="grid gap-4">
            {storiesWithProgress.map(story => {
              const progress = storyProgress[story.id];
              const percentage = getStoryProgressPercentage(story);
              
              return (
                <div
                  key={story.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{story.emoji}</div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {story.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {story.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onStorySelect(story)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isCompleted(story)
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {isCompleted(story) ? '✅ Read Again' : '📖 Continue'}
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Overall Progress:</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isCompleted(story) 
                              ? 'bg-green-500' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Reading Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current Page:</span>
                        <div className="font-semibold">
                          {progress.currentPageIndex + 1} of {story.pages.length}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Pages Completed:</span>
                        <div className="font-semibold">
                          {progress.completedPages.length}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Read:</span>
                        <div className="font-semibold">
                          {getLastReadDate(story)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <div className={`font-semibold ${
                          isCompleted(story) ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {isCompleted(story) ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Reading Progress Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start reading a story to see your progress here!
          </p>
          <button
            onClick={() => {
              // This will be handled by the parent component to switch tabs
              const event = new CustomEvent('switchToStories');
              window.dispatchEvent(event);
            }}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
          >
            🚀 Start Reading
          </button>
        </div>
      )}
    </div>
  );
} 