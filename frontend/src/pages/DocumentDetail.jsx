import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  // Mock data
  const document = {
    id: parseInt(id),
    title: 'Introduction to Neural Networks.pdf',
    description: 'Comprehensive guide to understanding neural network architectures, including feedforward networks, backpropagation, and various activation functions.',
    type: 'pdf',
    size: '2.4 MB',
    uploadedAt: '3 hours ago',
    uploadedBy: 'John Doe',
    topic: 'Machine Learning Fundamentals',
    aiSummary: 'This document provides a thorough introduction to neural networks, covering fundamental concepts such as feedforward networks, the backpropagation algorithm, and various activation functions including sigmoid, ReLU, and tanh. It includes practical examples and mathematical foundations that are essential for understanding modern deep learning architectures.',
    keyConcepts: [
      'Feedforward Neural Networks',
      'Backpropagation Algorithm',
      'Activation Functions',
      'Gradient Descent',
      'Weight Initialization',
    ],
  };

  const comments = [
    {
      id: 1,
      author: 'Jane Smith',
      text: 'Excellent resource! The explanations are very clear and well-structured.',
      rating: 5,
      createdAt: '2 hours ago',
    },
    {
      id: 2,
      author: 'Bob Johnson',
      text: 'Very helpful for understanding the basics. Could use more examples though.',
      rating: 4,
      createdAt: '5 hours ago',
    },
    {
      id: 3,
      author: 'Alice Williams',
      text: 'Great introduction to neural networks. The backpropagation section is particularly well explained.',
      rating: 5,
      createdAt: '1 day ago',
    },
  ];

  const averageRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : '0.0';

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log('Adding comment:', { comment, rating });
    // TODO: Implement API call
    setComment('');
    setRating(0);
  };

  const handleDownload = () => {
    console.log('Downloading document:', document.id);
    // TODO: Implement download functionality
  };

  const handleShare = () => {
    console.log('Sharing document:', document.id);
    // TODO: Implement share functionality
  };

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 mb-3 md:mb-4 text-xs md:text-sm font-medium"
        >
          ← Back
        </button>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 md:gap-6 mb-4 md:mb-6">
          {/* Left Column - Document Preview */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">{document.title}</h1>
              
              {/* Document Preview Placeholder */}
              <div className="bg-gray-100 rounded-lg p-16 text-center border-2 border-dashed border-gray-300 min-h-[600px] flex items-center justify-center">
                <div>
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-600 mb-2 font-medium">Document Preview</p>
                  <p className="text-sm text-gray-500">
                    PDF viewer or document renderer would be integrated here
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Metadata, AI Summary, Actions */}
          <div className="lg:col-span-3 space-y-6">
            {/* Document Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Information</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 block mb-1">Topic:</span>
                  <span className="text-gray-900 font-medium">{document.topic}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1">Type:</span>
                  <span className="text-gray-900 font-medium">{document.type.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1">Size:</span>
                  <span className="text-gray-900 font-medium">{document.size}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1">Uploaded:</span>
                  <span className="text-gray-900 font-medium">{document.uploadedAt}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1">Uploaded by:</span>
                  <span className="text-gray-900 font-medium">{document.uploadedBy}</span>
                </div>
              </div>
            </div>

            {/* AI-Generated Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🤖</span>
                <h2 className="text-lg font-semibold text-gray-900">AI Summary</h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{document.aiSummary}</p>
              
              {/* Key Concepts */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Concepts:</h3>
                <div className="flex flex-wrap gap-2">
                  {document.keyConcepts.map((concept, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Download and Share Buttons */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>📥</span>
                  <span>Download</span>
                </button>
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span>🔗</span>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments and Ratings Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Comments & Ratings</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Average Rating:</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-gray-900">{averageRating}</span>
                <span className="text-yellow-500">⭐</span>
              </div>
            </div>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6 pb-6 border-b border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors ${
                      star <= rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
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
            {comments.map((commentItem) => (
              <div key={commentItem.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm">
                    {commentItem.author.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{commentItem.author}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= commentItem.rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{commentItem.createdAt}</span>
                    </div>
                    <p className="text-gray-700">{commentItem.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;

