"use client";

import { useState } from 'react';
import PaginatedKaraokeReader from './components/PaginatedKaraokeReader';
import StorySelector from './components/StorySelector';
import { Story } from './data/stories';

export default function Home() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
  };

  const handleBackToSelector = () => {
    setSelectedStory(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          📚 Kid Reader
        </h1>
        
        {selectedStory ? (
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleBackToSelector}
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
            >
              <span>←</span>
              Back to Stories
            </button>
            
            <PaginatedKaraokeReader 
              text={selectedStory.text}
              title={selectedStory.title}
            />
          </div>
        ) : (
          <StorySelector onStorySelect={handleStorySelect} />
        )}
      </div>
    </main>
  );
}
