import React from 'react';
import { Header } from '../components/Header';
import { AddFolder } from '../components/AddFolder';
import { FolderList } from '../components/FolderList';
import { AddTodo } from '../components/AddTodo';
import { TodoList } from '../components/TodoList';
import { ProgressBar } from '../components/ProgressBar';
import { useTodo } from '../context/TodoContext';

export function TodoApp() {
  const { todos } = useTodo();
  const unorganizedTodos = todos.filter((todo) => !todo.folderId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <Header />
          
          <div className="space-y-6">
            <AddFolder />
            <FolderList />
            
            {unorganizedTodos.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Unorganized Tasks
                </h2>
                
                <div className="mb-4">
                  <ProgressBar todos={unorganizedTodos} />
                </div>

                <div className="mb-4">
                  <AddTodo />
                </div>

                <TodoList todos={unorganizedTodos} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}