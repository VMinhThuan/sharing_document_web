import { useState } from 'react';

const TopSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <span className="text-gray-400 text-xl">🔍</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents, topics, or ask AI..."
          className="w-full pl-10 md:pl-12 pr-16 md:pr-20 py-2 md:py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-md transition-shadow text-sm md:text-base text-gray-900 placeholder-gray-400"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4 pointer-events-none">
          <span className="text-gray-400 text-lg md:text-xl">🔍</span>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-4">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md border border-blue-200">
            <span>🤖</span>
            <span className="hidden sm:inline">AI</span>
          </span>
        </div>
      </form>
    </div>
  );
};

export default TopSearchBar;

