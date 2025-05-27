import { useState } from "react";

const AskComponent = () => {

  const [askInput, setAskInput] = useState('');
  const [askResult, setAskResult] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: askInput }),
    });

    const { answer } = await res.json()
    setAskResult(answer)
    setIsLoading(false);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane - ASK */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-100">Ask Something</h3>
          <textarea
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder="Type your question here..."
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

        {/* Right Pane - ASK Result */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-100">Result</h3>
          <div className="w-full h-40 p-4 bg-gray-800 border border-gray-600 rounded-lg text-gray-300">
            {askResult || 'Results will appear here...'}
          </div>
        </div>
      </div>
    </>
  )
}

export default AskComponent
