import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import TopicCard from '../../components/TopicCard/TopicCard';

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');

  // Mock data
  const topic = {
    id: parseInt(id),
    title: 'Machine Learning Fundamentals',
    subject: 'Computer Science',
    description: 'Core concepts and algorithms in machine learning. This topic covers neural networks, supervised and unsupervised learning, and practical applications.',
    visibility: 'public',
    documentCount: 8,
    createdAt: '2 days ago',
    author: 'John Doe',
  };

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
      title: 'Supervised Learning Algorithms.docx',
      description: 'Detailed explanation of supervised learning methods',
      type: 'word',
      size: '1.8 MB',
      uploadedAt: '1 day ago',
      aiSummary: 'Explores linear regression, decision trees, and support vector machines',
    },
    {
      id: 3,
      title: 'Unsupervised Learning Techniques.pdf',
      description: 'Clustering and dimensionality reduction methods',
      type: 'pdf',
      size: '3.1 MB',
      uploadedAt: '2 days ago',
      aiSummary: 'Covers k-means clustering, PCA, and autoencoders',
    },
  ];

  const comments = [
    {
      id: 1,
      author: 'Jane Smith',
      text: 'Great collection! The neural networks document is particularly helpful.',
      createdAt: '5 hours ago',
    },
    {
      id: 2,
      author: 'Bob Johnson',
      text: 'Could you add more content on deep learning?',
      createdAt: '1 day ago',
    },
    {
      id: 3,
      author: 'Alice Williams',
      text: 'This topic has been very useful for my research project. Thanks for sharing!',
      createdAt: '3 days ago',
    },
  ];

  const aiSummary = {
    summary: 'This topic focuses on the fundamental principles of machine learning, covering both theoretical foundations and practical implementations. The collection includes comprehensive materials on neural network architectures, supervised learning algorithms, and unsupervised learning techniques. Key concepts explored include backpropagation, activation functions, linear regression, decision trees, clustering methods, and dimensionality reduction.',
    keyPoints: [
      'Neural networks and deep learning architectures',
      'Supervised learning algorithms (regression, classification)',
      'Unsupervised learning techniques (clustering, dimensionality reduction)',
      'Practical applications and real-world use cases',
    ],
  };

  const suggestedTopics = [
    {
      id: 2,
      title: 'Deep Learning Advanced',
      subject: 'Computer Science',
      description: 'Advanced deep learning architectures and techniques',
      visibility: 'public',
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
      createdAt: '2 weeks ago',
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
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>
    );
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log('Adding comment:', comment);
    // TODO: Implement API call
    setComment('');
  };

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/topics')}
          className="text-blue-600 hover:text-blue-700 mb-3 md:mb-4 text-xs md:text-sm font-medium"
        >
          ← Back to Topics
        </button>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6">
          {/* Main Content (70%) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Topic Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">{topic.title}</h1>
                    {getVisibilityBadge(topic.visibility)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{topic.subject}</p>
                  <p className="text-gray-700">{topic.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
                <span>Created by {topic.author}</span>
                <span>•</span>
                <span>{topic.createdAt}</span>
                <span>•</span>
                <span>{topic.documentCount} documents</span>
              </div>
            </div>

            {/* Upload Document Button */}
            <div>
              <Link
                to={`/admin/upload?topic=${id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span>📤</span>
                <span>Upload Document</span>
              </Link>
            </div>

            {/* Documents List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
              {documents.length > 0 ? (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">No documents in this topic yet.</p>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>
              
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none mb-3"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.createdAt}</span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (30%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Summary Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🤖</span>
                <h2 className="text-lg font-semibold text-gray-900">AI Summary</h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {aiSummary.summary}
              </p>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Points:</h3>
                <ul className="space-y-2">
                  {aiSummary.keyPoints.map((point, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggested Related Topics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested Topics</h2>
              <div className="space-y-4">
                {suggestedTopics.map((suggestedTopic) => (
                  <TopicCard key={suggestedTopic.id} topic={suggestedTopic} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;

