import React, { useState } from 'react';
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  volunteers: number;
  maxVolunteers: number;
  enrolled: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Community Garden Clean-up',
      description: 'Help maintain our local community garden',
      date: '2024-03-20',
      time: '09:00 AM',
      volunteers: 3,
      maxVolunteers: 10,
      enrolled: false
    },
    {
      id: '2',
      title: 'Food Bank Distribution',
      description: 'Assist in distributing food to those in need',
      date: '2024-03-21',
      time: '10:00 AM',
      volunteers: 5,
      maxVolunteers: 8,
      enrolled: false
    },
    {
      id: '3',
      title: 'Senior Center Visit',
      description: 'Spend time with elderly residents',
      date: '2024-03-22',
      time: '02:00 PM',
      volunteers: 2,
      maxVolunteers: 6,
      enrolled: false
    }
  ]);

  const handleEnroll = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (!task.enrolled && task.volunteers < task.maxVolunteers) {
          return {
            ...task,
            volunteers: task.volunteers + 1,
            enrolled: true
          };
        } else if (task.enrolled) {
          return {
            ...task,
            volunteers: task.volunteers - 1,
            enrolled: false
          };
        }
      }
      return task;
    }));
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Available Opportunities</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                <p className="text-gray-600 mb-4">{task.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{task.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{task.time}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{task.volunteers} / {task.maxVolunteers} volunteers</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleEnroll(task.id)}
                    disabled={!task.enrolled && task.volunteers >= task.maxVolunteers}
                    className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                      task.enrolled
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : task.volunteers >= task.maxVolunteers
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {task.enrolled ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Cancel Enrollment
                      </>
                    ) : task.volunteers >= task.maxVolunteers ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Full
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(task.volunteers / task.maxVolunteers) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}