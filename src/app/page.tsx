'use client'

import { useState } from 'react';
import AskComponent from './components/ask';
import FeedComponent from './components/feed';

export default function SimpleTabs() {
  const [activeTab, setActiveTab] = useState('ask');



  return (
    <div className="mx-auto p-6 min-h-screen bg-gray-900">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('ask')}
          className={`px-6 py-3 font-medium text-sm ${activeTab === 'ask'
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          ASK
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-6 py-3 font-medium text-sm ${activeTab === 'feed'
            ? 'text-blue-400 border-b-2 border-blue-400'
            : 'text-gray-400 hover:text-gray-200'
            }`}
        >
          FEED
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'ask' && (
        <AskComponent />
      )}

      {activeTab === 'feed' && (
        <FeedComponent />
      )}
    </div>
  );
}