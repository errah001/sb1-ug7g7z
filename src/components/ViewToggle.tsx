import React from 'react';
import { LayoutList, Kanban, Calendar } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { ViewMode } from '../types';

export function ViewToggle() {
  const { viewMode, setViewMode } = useTodo();

  const views: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: 'list', icon: <LayoutList className="w-5 h-5" />, label: 'List' },
    { mode: 'kanban', icon: <Kanban className="w-5 h-5" />, label: 'Kanban' },
    { mode: 'calendar', icon: <Calendar className="w-5 h-5" />, label: 'Calendar' },
  ];

  return (
    <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
      {views.map(({ mode, icon, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            viewMode === mode
              ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50'
          }`}
        >
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}