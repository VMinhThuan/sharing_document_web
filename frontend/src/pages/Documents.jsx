import { useState } from 'react';
import { Link } from 'react-router-dom';
import DocumentCard from '../components/DocumentCard';

const Documents = () => {
  const [filter, setFilter] = useState('all');

  // Mock data
  const documents = [
    {
      id: 1,
      title: 'Introduction to Neural Networks.pdf',
      description: 'Comprehensive guide to understanding neural network architectures',
      type: 'pdf',
      size: '2.4 MB',
      uploadedAt: '3 hours ago',
      aiSummary: 'Covers feedforward networks, backpropagation, and activation functions',
    },
    {
      id: 2,
      title: 'React Hooks Deep Dive.docx',
      description: 'Detailed explanation of React hooks and their use cases',
      type: 'word',
      size: '1.8 MB',
      uploadedAt: '1 day ago',
      aiSummary: 'Explores useState, useEffect, useContext, and custom hooks',
    },
    {
      id: 3,
      title: 'Algorithm Complexity Analysis.xlsx',
      description: 'Spreadsheet with complexity analysis of common algorithms',
      type: 'excel',
      size: '856 KB',
      uploadedAt: '3 days ago',
      aiSummary: 'Time and space complexity comparisons for sorting and searching algorithms',
    },
    {
      id: 4,
      title: 'UI Design Principles.pptx',
      description: 'Presentation on modern UI/UX design principles',
      type: 'powerpoint',
      size: '3.2 MB',
      uploadedAt: '5 days ago',
      aiSummary: 'Covers color theory, typography, spacing, and user experience patterns',
    },
  ];

  const filteredDocuments = filter === 'all' 
    ? documents 
    : documents.filter(doc => doc.type === filter);

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Documents</h1>
          <Link
            to="/upload"
            className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base font-medium whitespace-nowrap"
          >
            + Upload Document
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Documents
          </button>
          <button
            onClick={() => setFilter('pdf')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              filter === 'pdf'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            PDF
          </button>
          <button
            onClick={() => setFilter('word')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              filter === 'word'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Word
          </button>
          <button
            onClick={() => setFilter('excel')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              filter === 'excel'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Excel
          </button>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No documents found with this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;

