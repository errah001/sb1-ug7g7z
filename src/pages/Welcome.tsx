import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Welcome() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    await signInWithGoogle();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckSquare className="w-16 h-16 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TaskMaster
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Organize your tasks, boost your productivity
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
            <h2 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              Features
            </h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>✓ Organize tasks in folders</li>
              <li>✓ Track progress with visual indicators</li>
              <li>✓ Set due dates for better planning</li>
              <li>✓ Sync across devices</li>
            </ul>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          >
            <LogIn className="w-5 h-5" />
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}