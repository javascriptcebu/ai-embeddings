import { useState } from "react";

const FeedComponent = () => {
  const [feedInput, setFeedInput] = useState('');
  const [feedResult, setFeedResult] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const res = await fetch("/api/feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: feedInput }),
    });

    const { embedding } = await res.json()
    setFeedResult(embedding)
    setIsLoading(false);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane - Feed */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-100">Feed Input</h3>
          <textarea
            value={feedInput}
            onChange={(e) => setFeedInput(e.target.value)}
            placeholder="Enter feed content here..."
            className="w-full h-40 p-4 bg-gray-800 border border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Right Pane - Feed Result */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-100">Embeddings Result</h3>
          <div className="w-full h-40 p-4 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 break-words h-auto">
            {feedResult || 'Results will appear here...'}
          </div>
        </div>
      </div>
    </>
  )
}

export default FeedComponent