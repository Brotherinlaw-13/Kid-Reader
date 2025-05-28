"use client";

import { useState } from 'react';
import { Story, stories, getAllCategories, getStoriesByCategory, getDifficultyColor } from '../data/stories';

interface StorySelectorProps {
  onStorySelect: (story: Story) => void;
}

export default function StorySelector({ onStorySelect }: StorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = getAllCategories();
  const filteredStories = getStoriesByCategory(selectedCategory);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Choose Your Story Adventure! 📖
        </h2>
        <p className="text-lg text-gray-600">
          Select a story to start reading with voice guidance
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map(story => (
          <div
            key={story.id}
            onClick={() => onStorySelect(story)}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100"
          >
            <div className="p-6">
              {/* Story Emoji and Title */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{story.emoji}</div>
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
                  {story.text.length > 80 
                    ? `${story.text.substring(0, 80)}...` 
                    : story.text
                  }
                </p>
              </div>

              {/* Difficulty and Category */}
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(story.difficulty)}`}>
                  {story.difficulty}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {story.category}
                </span>
              </div>

              {/* Read Button */}
              <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all">
                Start Reading 📚
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 