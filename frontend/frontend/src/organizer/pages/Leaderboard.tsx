import React from 'react';
import { Trophy } from 'lucide-react';

export function Leaderboard() {
  const volunteers = [
    {
      id: '1',
      name: 'John Doe',
      eventsCompleted: 15,
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: '2',
      name: 'Jane Smith',
      eventsCompleted: 12,
      rating: 4.7,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      eventsCompleted: 10,
      rating: 4.5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Volunteers</h2>
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>

        <div className="space-y-6">
          {volunteers.map((volunteer, index) => (
            <div
              key={volunteer.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 relative">
                  {index === 0 && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <img
                    src={volunteer.avatar}
                    alt={volunteer.name}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {volunteer.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {volunteer.eventsCompleted} events completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {volunteer.rating}
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Most Active This Month
          </h3>
          <div className="space-y-2">
            {volunteers.slice(0, 3).map((volunteer) => (
              <div
                key={volunteer.id}
                className="flex items-center justify-between"
              >
                <span className="text-gray-600">{volunteer.name}</span>
                <span className="font-semibold">{volunteer.eventsCompleted} events</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Highest Rated
          </h3>
          <div className="space-y-2">
            {volunteers
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-600">{volunteer.name}</span>
                  <span className="font-semibold">{volunteer.rating} ⭐</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Achievements
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}