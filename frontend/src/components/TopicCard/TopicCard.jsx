import { Link } from 'react-router-dom';

const TopicCard = ({ topic }) => {
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

  return (
    <Link to={`/admin/topics/${topic.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 flex-1">{topic.title}</h3>
          {getVisibilityBadge(topic.visibility)}
        </div>
        <p className="text-xs md:text-sm text-gray-600 mb-2">{topic.subject}</p>
        <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mb-3 md:mb-4">{topic.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{topic.documentCount || 0} documents</span>
          <span>{topic.createdAt}</span>
        </div>
      </div>
    </Link>
  );
};

export default TopicCard;

