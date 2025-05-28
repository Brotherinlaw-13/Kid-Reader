"use client";

import { useState, useEffect } from 'react';
import PaginatedKaraokeReader from './components/PaginatedKaraokeReader';
import StorySelector from './components/StorySelector';
import ReadingProgress from './components/ReadingProgress';
import { Story } from './data/stories';

type TabType = 'stories' | 'progress';

export default function Home() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('stories');

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
  };

  const handleBackToSelector = () => {
    setSelectedStory(null);
  };

  // Listen for custom event to switch to stories tab
  useEffect(() => {
    const handleSwitchToStories = () => {
      setActiveTab('stories');
    };

    window.addEventListener('switchToStories', handleSwitchToStories);
    return () => {
      window.removeEventListener('switchToStories', handleSwitchToStories);
    };
  }, []);

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
              story={selectedStory}
            />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg shadow-md p-1 flex">
                <button
                  onClick={() => setActiveTab('stories')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'stories'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  📚 Stories
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'progress'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                  }`}
                >
                  📊 Reading Progress
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'stories' ? (
              <StorySelector onStorySelect={handleStorySelect} />
            ) : (
              <ReadingProgress onStorySelect={handleStorySelect} />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
