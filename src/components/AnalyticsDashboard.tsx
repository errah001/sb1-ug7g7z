import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTodo } from '../context/TodoContext';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function AnalyticsDashboard() {
  const { todos, userStats } = useTodo();

  const completedTasks = todos.filter(todo => todo.completed).length;
  const totalTasks = todos.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const productivityData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Tasks Completed',
        data: Array.from({ length: 24 }, (_, i) => userStats.productivityByHour[i] || 0),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [
          userStats.tasksByPriority.high || 0,
          userStats.tasksByPriority.medium || 0,
          userStats.tasksByPriority.low || 0,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Completion Rate
          </h3>
          <div className="text-3xl font-bold text-emerald-500">
            {completionRate.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Current Streak
          </h3>
          <div className="text-3xl font-bold text-emerald-500">
            {userStats.streakDays} days
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Keep up the momentum!
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Latest Achievement
          </h3>
          {userStats.achievements.length > 0 ? (
            <>
              <div className="text-xl font-semibold text-emerald-500">
                {userStats.achievements[userStats.achievements.length - 1].name}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unlocked {format(
                  new Date(userStats.achievements[userStats.achievements.length - 1].unlockedAt),
                  'MMM d, yyyy'
                )}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete tasks to earn achievements!
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Productivity by Hour
          </h3>
          <Line data={productivityData} options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
              }
            }
          }} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Tasks by Priority
          </h3>
          <Doughnut data={priorityData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
}