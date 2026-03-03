import React from 'react';
import { useAuthStore } from '../store/authStore';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, {user?.name}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-900">Events Completed</h3>
            <p className="text-3xl font-bold text-indigo-600">{user?.eventsCompleted}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">Rating</h3>
            <p className="text-3xl font-bold text-green-600">{user?.rating}/5.0</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900">Role</h3>
            <p className="text-3xl font-bold text-purple-600 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            <p className="text-gray-600">No upcoming events</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-gray-600">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}