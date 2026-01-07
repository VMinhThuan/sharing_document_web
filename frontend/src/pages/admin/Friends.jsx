const Friends = () => {
  // Mock data - Friends list
  const friends = [
    {
      id: 1,
      name: 'Jane Smith',
      email: 'jane@example.com',
      mutualTopics: 5,
      avatar: 'JS',
      status: 'online',
    },
    {
      id: 2,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      mutualTopics: 3,
      avatar: 'BJ',
      status: 'offline',
    },
    {
      id: 3,
      name: 'Alice Williams',
      email: 'alice@example.com',
      mutualTopics: 8,
      avatar: 'AW',
      status: 'online',
    },
    {
      id: 4,
      name: 'David Lee',
      email: 'david@example.com',
      mutualTopics: 12,
      avatar: 'DL',
      status: 'online',
    },
  ];

  // Mock data - Pending friend requests
  const friendRequests = [
    {
      id: 1,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      avatar: 'CB',
      sentAt: '2 hours ago',
    },
    {
      id: 2,
      name: 'Diana Prince',
      email: 'diana@example.com',
      avatar: 'DP',
      sentAt: '1 day ago',
    },
  ];

  // Mock data - AI-based suggested friends
  const suggestedFriends = [
    {
      id: 1,
      name: 'Eve Adams',
      email: 'eve@example.com',
      avatar: 'EA',
      mutualFriends: 3,
      commonTopics: 2,
      aiReason: 'Similar interests in Machine Learning',
    },
    {
      id: 2,
      name: 'Frank Miller',
      email: 'frank@example.com',
      avatar: 'FM',
      mutualFriends: 5,
      commonTopics: 4,
      aiReason: 'Active in Computer Science topics',
    },
    {
      id: 3,
      name: 'Grace Chen',
      email: 'grace@example.com',
      avatar: 'GC',
      mutualFriends: 2,
      commonTopics: 3,
      aiReason: 'Shared document preferences',
    },
  ];

  const handleAcceptRequest = (id) => {
    console.log('Accepting request:', id);
    // TODO: Implement API call
  };

  const handleRejectRequest = (id) => {
    console.log('Rejecting request:', id);
    // TODO: Implement API call
  };

  const handleAddFriend = (id) => {
    console.log('Adding friend:', id);
    // TODO: Implement API call
  };

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Friends & Connections</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Friends List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Friends ({friends.length})</h2>
              {friends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                            {friend.avatar}
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{friend.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{friend.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {friend.mutualTopics} mutual topics
                          </p>
                        </div>
                        <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium whitespace-nowrap">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  No friends yet. Start adding friends to share documents!
                </div>
              )}
            </div>
          </div>

          {/* Pending Friend Requests */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Pending Requests ({friendRequests.length})
              </h2>
              {friendRequests.length > 0 ? (
                <div className="space-y-4">
                  {friendRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-medium">
                          {request.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{request.name}</h3>
                          <p className="text-xs text-gray-400">{request.sentAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No pending friend requests.
                </div>
              )}
            </div>
          </div>

          {/* AI-Based Suggested Friends */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🤖</span>
                <h2 className="text-xl font-semibold text-gray-900">Suggested Friends</h2>
              </div>
              {suggestedFriends.length > 0 ? (
                <div className="space-y-4">
                  {suggestedFriends.map((suggested) => (
                    <div
                      key={suggested.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-medium">
                          {suggested.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{suggested.name}</h3>
                          <p className="text-xs text-gray-500 truncate">{suggested.email}</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-1">
                          {suggested.mutualFriends} mutual friends • {suggested.commonTopics} common topics
                        </p>
                        <p className="text-xs text-blue-600 italic">🤖 {suggested.aiReason}</p>
                      </div>
                      <button
                        onClick={() => handleAddFriend(suggested.id)}
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Add Friend
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No suggested friends at the moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;

