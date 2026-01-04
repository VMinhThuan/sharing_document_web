import TopSearchBar from '../components/TopSearchBar';
import TopicCard from '../components/TopicCard';
import DocumentCard from '../components/DocumentCard';

const Dashboard = () => {
  // Mock data - Stats cards
  const stats = [
    { label: 'Active Topics', value: '24', icon: '📚', color: 'bg-blue-50 text-blue-700' },
    { label: 'Documents Created', value: '156', icon: '📄', color: 'bg-green-50 text-green-700' },
    { label: 'Study Hours', value: '342', icon: '⏱️', color: 'bg-purple-50 text-purple-700' },
    { label: 'Learning Streak', value: '12 days', icon: '🔥', color: 'bg-orange-50 text-orange-700' },
  ];

  // Mock data - Recommended Topics
  const recommendedTopics = [
    {
      id: 1,
      title: 'Machine Learning Fundamentals',
      subject: 'Computer Science',
      description: 'Core concepts and algorithms in machine learning',
      visibility: 'public',
      documentCount: 8,
      createdAt: '2 days ago',
    },
    {
      id: 2,
      title: 'React Best Practices',
      subject: 'Web Development',
      description: 'Advanced patterns and techniques for React development',
      visibility: 'friends',
      documentCount: 12,
      createdAt: '1 week ago',
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      subject: 'Computer Science',
      description: 'Essential data structures and algorithmic problem-solving',
      visibility: 'public',
      documentCount: 15,
      createdAt: '3 days ago',
    },
  ];

  // Mock data - Recommended Documents
  const recommendedDocuments = [
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
      uploadedAt: '2 days ago',
      aiSummary: 'Time and space complexity comparisons for sorting and searching algorithms',
    },
  ];

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // TODO: Implement search functionality
  };

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* TopSearchBar */}
        <div className="mb-6 md:mb-8">
          <TopSearchBar onSearch={handleSearch} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-xl md:text-2xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommended Topics */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Recommended Topics</h2>
            <a href="/topics" className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {recommendedTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>

        {/* Recommended Documents */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Recommended Documents</h2>
            <a href="/documents" className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {recommendedDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

