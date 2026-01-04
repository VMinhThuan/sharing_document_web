import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CreateTopic = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    visibility: 'private',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleVisibilityChange = (visibility) => {
    setFormData({
      ...formData,
      visibility,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating topic:', formData);
    // TODO: Implement API call
    navigate('/topics');
  };

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[700px]">
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8 shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Create New Topic</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Topic Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter topic title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="e.g., Computer Science, Mathematics"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe what this topic is about..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Visibility Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Visibility *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleVisibilityChange('private')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.visibility === 'private'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-lg mb-1">🔒</div>
                  <div>Private</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleVisibilityChange('friends')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.visibility === 'friends'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-lg mb-1">👥</div>
                  <div>Friends</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleVisibilityChange('public')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.visibility === 'public'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-lg mb-1">🌐</div>
                  <div>Public</div>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Link
                to="/topics"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Topic
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTopic;

