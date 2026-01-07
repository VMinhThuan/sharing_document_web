import { useState } from 'react';
import { Link } from 'react-router-dom';
import TopicCard from '../../components/TopicCard/TopicCard';

const TopicList = () => {
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');

  // Mock data
  const topics = [
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
      visibility: 'private',
      documentCount: 15,
      createdAt: '2 weeks ago',
    },
    {
      id: 4,
      title: 'UI/UX Design Principles',
      subject: 'Design',
      description: 'Fundamentals of user interface and experience design',
      visibility: 'public',
      documentCount: 6,
      createdAt: '3 days ago',
    },
    {
      id: 5,
      title: 'Database Systems',
      subject: 'Computer Science',
      description: 'Introduction to database design and SQL',
      visibility: 'public',
      documentCount: 10,
      createdAt: '5 days ago',
    },
    {
      id: 6,
      title: 'Vue.js Advanced Patterns',
      subject: 'Web Development',
      description: 'State management and component composition in Vue',
      visibility: 'friends',
      documentCount: 7,
      createdAt: '1 week ago',
    },
  ];

  // Get unique subjects from topics
  const subjects = ['all', ...new Set(topics.map(topic => topic.subject))];

  const filteredTopics = topics.filter(topic => {
    const matchesSubject = subjectFilter === 'all' || topic.subject === subjectFilter;
    const matchesVisibility = visibilityFilter === 'all' || topic.visibility === visibilityFilter;
    return matchesSubject && matchesVisibility;
  });

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Learning Topics</h1>
          <Link
            to="/admin/topics/create"
            className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base font-medium whitespace-nowrap"
          >
            + Create Topic
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-4 md:mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 md:gap-4">
            {/* Subject Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Subject:</label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="flex-1 sm:flex-none px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs md:text-sm text-gray-900 bg-white"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <label className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Visibility:</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setVisibilityFilter('all')}
                  className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                    visibilityFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setVisibilityFilter('public')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    visibilityFilter === 'public'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Public
                </button>
                <button
                  onClick={() => setVisibilityFilter('friends')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    visibilityFilter === 'friends'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Friends
                </button>
                <button
                  onClick={() => setVisibilityFilter('private')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    visibilityFilter === 'private'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Private
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No topics found with this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicList;

