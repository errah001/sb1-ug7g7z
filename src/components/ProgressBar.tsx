import React from 'react';
import { Todo } from '../types';

interface ProgressBarProps {
  todos: Todo[];
}

export function ProgressBar({ todos }: ProgressBarProps) {
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const progress = todos.length > 0 ? (completedTodos / todos.length) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{completedTodos} of {todos.length} tasks completed</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}