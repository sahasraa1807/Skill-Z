import { useState } from 'react';

const EXAMPLE_PROMPTS = [
  'I want a project related to using AI for education',
  'Full-stack Web3 and crypto startup',
  'Computer vision and healthtech assistant',
  'Backend developer for high-scale API systems'
];

export default function AISearchBar({ 
  searchQuery, 
  onSearchChange, 
  isAIMode, 
  onModeToggle, 
  placeholder = 'Search with natural language...'
}) {
  const [prompt, setPrompt] = useState(searchQuery || '');

  const handleChipClick = (promptText) => {
    setPrompt(promptText);
    onSearchChange(promptText, true);
    if (!isAIMode && onModeToggle) {
      onModeToggle(true);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setPrompt(val);
    onSearchChange(val, isAIMode);
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-primary-50 text-primary-600 rounded-xl text-base">✨</span>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              {isAIMode ? 'AI Semantic Search' : 'Keyword & Taxonomy Search'}
            </h3>
            <p className="text-xs text-gray-500">
              {isAIMode 
                ? 'Search by concept, intent, or natural language prompts.' 
                : 'Filter by exact title, category, or skills.'}
            </p>
          </div>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onModeToggle(false)}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              !isAIMode ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Filters
          </button>
          <button
            type="button"
            onClick={() => onModeToggle(true)}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              isAIMode ? 'bg-primary-600 text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>✨</span> AI Search
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          {isAIMode ? '✨' : '🔍'}
        </div>
        <input
          type="text"
          value={prompt}
          onChange={handleInputChange}
          placeholder={isAIMode ? placeholder : 'Search by title or description...'}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
            isAIMode 
              ? 'border-primary-300 bg-primary-50/30 focus:ring-primary-500 focus:border-primary-500 font-medium' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
          }`}
        />
      </div>

      {/* Example Prompt Chips for AI Mode */}
      {isAIMode && (
        <div className="pt-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Example Prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(p)}
                className="text-xs bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 border border-gray-200 hover:border-primary-200 px-2.5 py-1 rounded-xl transition-all text-left"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
