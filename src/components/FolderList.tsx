import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, Trash2 } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { TodoList } from './TodoList';
import { AddTodo } from './AddTodo';
import { ProgressBar } from './ProgressBar';

interface FolderItemProps {
  folderId: string;
  folderName: string;
  onDelete: () => void;
}

function FolderItem({ folderId, folderName, onDelete }: FolderItemProps) {
  const { todos } = useTodo();
  const [isExpanded, setIsExpanded] = useState(true);
  const folderTodos = todos.filter((todo) => todo.folderId === folderId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg py-1 px-2 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{folderName}</h2>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {folderTodos.filter(t => t.completed).length}/{folderTodos.length} done
            </span>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-2">
          <ProgressBar todos={folderTodos} />
        </div>

        <div
          className={`space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0'
          }`}
        >
          <div className="mb-4">
            <AddTodo folderId={folderId} />
          </div>

          <TodoList todos={folderTodos} />
        </div>
      </div>
    </div>
  );
}

export function FolderList() {
  const { folders, deleteFolder } = useTodo();

  return (
    <div className="space-y-6">
      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folderId={folder.id}
          folderName={folder.name}
          onDelete={() => deleteFolder(folder.id)}
        />
      ))}
    </div>
  );
}