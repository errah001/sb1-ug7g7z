import React from 'react';
import { CheckSquare, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <CheckSquare className="w-8 h-8 text-emerald-500" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">TaskMaster</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src={user?.photoURL || ''}
            alt={user?.displayName || 'User'}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {user?.displayName}
          </span>
        </div>
        <ThemeToggle />
        <button
          onClick={signOut}
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}