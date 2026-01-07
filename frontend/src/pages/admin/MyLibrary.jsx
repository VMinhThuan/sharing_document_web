import { useState } from 'react';
import { Link } from 'react-router-dom';

const MyLibrary = () => {
  const [activeTab, setActiveTab] = useState('topics');

  // Mock data - My Topics
  const myTopics = [
    {
      id: 1,
      title: 'Machine Learning Fundamentals',
      subject: 'Computer Science',
      description: 'Core concepts and algorithms in machine learning',
      visibility: 'public',
      documentCount: 8,
      views: 342,
      createdAt: '2 days ago',
    },
    {
      id: 2,
      title: 'React Best Practices',
      subject: 'Web Development',
      description: 'Advanced patterns and techniques for React development',
      visibility: 'friends',
      documentCount: 12,
      views: 128,
      createdAt: '1 week ago',
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms',
      subject: 'Computer Science',
      description: 'Essential data structures and algorithmic problem-solving',
      visibility: 'private',
      documentCount: 15,
      views: 0,
      createdAt: '2 weeks ago',
    },
    {
      id: 4,
      title: 'Database Systems',
      subject: 'Computer Science',
      description: 'Introduction to database design and SQL',
      visibility: 'public',
      documentCount: 10,
      views: 256,
      createdAt: '5 days ago',
    },
  ];

  // Mock data - My Documents
  const myDocuments = [
    {
      id: 1,
      title: 'Introduction to Neural Networks.pdf',
      description: 'Comprehensive guide to understanding neural network architectures',
      type: 'pdf',
      size: '2.4 MB',
      visibility: 'public',
      downloads: 89,
      views: 234,
      uploadedAt: '3 hours ago',
    },
    {
      id: 2,
      title: 'React Hooks Deep Dive.docx',
      description: 'Detailed explanation of React hooks and their use cases',
      type: 'word',
      size: '1.8 MB',
      visibility: 'friends',
      downloads: 45,
      views: 156,
      uploadedAt: '1 day ago',
    },
    {
      id: 3,
      title: 'Algorithm Complexity Analysis.xlsx',
      description: 'Spreadsheet with complexity analysis of common algorithms',
      type: 'excel',
      size: '856 KB',
      visibility: 'private',
      downloads: 0,
      views: 0,
      uploadedAt: '3 days ago',
    },
    {
      id: 4,
      title: 'UI Design Principles.pptx',
      description: 'Presentation on modern UI/UX design principles',
      type: 'powerpoint',
      size: '3.2 MB',
      visibility: 'public',
      downloads: 67,
      views: 189,
      uploadedAt: '5 days ago',
    },
  ];

  const getVisibilityBadge = (visibility) => {
    const badges = {
      private: { color: 'bg-gray-100 text-gray-700', icon: '🔒', label: 'Private' },
      friends: { color: 'bg-blue-100 text-blue-700', icon: '👥', label: 'Friends' },
      public: { color: 'bg-green-100 text-green-700', icon: '🌐', label: 'Public' },
    };
    const badge = badges[visibility] || badges.private;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>
    );
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return '📕';
    if (type?.includes('word') || type?.includes('doc')) return '📘';
    if (type?.includes('excel') || type?.includes('xls')) return '📗';
    if (type?.includes('powerpoint') || type?.includes('ppt')) return '📙';
    return '📄';
  };

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">My Library</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 md:mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'topics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Topics ({myTopics.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Documents ({myDocuments.length})
          </button>
        </div>

        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <div>
            {myTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {myTopics.map((topic) => (
                  <Link key={topic.id} to={`/admin/topics/${topic.id}`}>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1">{topic.title}</h3>
                        {getVisibilityBadge(topic.visibility)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{topic.subject}</p>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{topic.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span>👁️</span>
                            <span>{topic.views} views</span>
                          </span>
                          <span>{topic.documentCount} docs</span>
                        </div>
                        <span>{topic.createdAt}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">You haven't created any topics yet.</p>
                <Link
                  to="/admin/topics/create"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create Your First Topic
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            {myDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {myDocuments.map((doc) => (
                  <Link key={doc.id} to={`/admin/documents/${doc.id}`}>
                    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="text-4xl">{getFileIcon(doc.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-base font-semibold text-gray-900 truncate">
                              {doc.title}
                            </h3>
                            {getVisibilityBadge(doc.visibility)}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                            {doc.description || 'No description available'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span>👁️</span>
                            <span>{doc.views} views</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📥</span>
                            <span>{doc.downloads} downloads</span>
                          </span>
                        </div>
                        <span>{doc.uploadedAt}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">You haven't uploaded any documents yet.</p>
                <Link
                  to="/admin/upload"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Upload Your First Document
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibrary;

