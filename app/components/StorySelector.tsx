"use client";

import { useState, useEffect } from 'react';
import { Story, stories, getDifficultyColor, getStoryPreview } from '../data/stories';
import { ProgressTracker, ReadingProgress } from '../utils/progressTracker';

interface StorySelectorProps {
  onStorySelect: (story: Story) => void;
}

export default function StorySelector({ onStorySelect }: StorySelectorProps) {
  const [storyProgress, setStoryProgress] = useState<{ [storyId: string]: ReadingProgress }>({});
  const [isClient, setIsClient] = useState(false);
  
  // Show all stories instead of filtering by category
  const filteredStories = stories;

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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map(story => (
          <div
            key={story.id}
            onClick={() => onStorySelect(story)}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100 overflow-hidden"
          >
            {/* Cover Image */}
            {story.coverImage && (
              <div className="h-64 overflow-hidden">
                <img 
                  src={story.coverImage} 
                  alt={`Cover for ${story.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.fallback-emoji') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback emoji placeholder */}
                <div className="fallback-emoji w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl" style={{ display: 'none' }}>
                  {story.emoji}
                </div>
              </div>
            )}
            
            <div className="p-6">
              {/* Story Emoji and Title */}
              <div className="text-center mb-4">
                {!story.coverImage && (
                  <div className="text-4xl mb-2">{story.emoji}</div>
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {story.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {story.description}
                </p>
              </div>

              {/* Story Preview */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {getStoryPreview(story, 80)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {story.pages.length} page{story.pages.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Progress Bar (if story has been started) */}
              {hasProgress(story) && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Progress:</span>
                    <span className="text-xs font-semibold text-blue-600">
                      {getStoryProgressPercentage(story)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        isCompleted(story) 
                          ? 'bg-green-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${getStoryProgressPercentage(story)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Difficulty and Category */}
              <div className="flex justify-between items-center mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(story.difficulty)}`}>
                  {story.difficulty}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {story.category}
                </span>
              </div>

              {/* Read Button */}
              <button className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                isCompleted(story)
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : hasProgress(story)
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
              }`}>
                {isCompleted(story) 
                  ? '✅ Read Again' 
                  : hasProgress(story) 
                  ? '📖 Continue Reading' 
                  : '🚀 Start Reading'
                }
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 