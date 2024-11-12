import React, { useState } from 'react';
import { Check, Pencil, Trash2, X, Clock, Share2, MapPin, Play, Square } from 'lucide-react';
import { Todo } from '../types';
import { useTodo } from '../context/TodoContext';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo, editTodo, startTaskTimer, stopTaskTimer } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleEdit = () => {
    if (editText.trim()) {
      editTodo(todo.id, {
        text: editText,
        dueDate: editDueDate || undefined,
        priority: editPriority,
      });
      setIsEditing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 dark:text-red-400';
      case 'medium':
        return 'text-yellow-500 dark:text-yellow-400';
      default:
        return 'text-emerald-500 dark:text-emerald-400';
    }
  };

  return (
    <div className="group flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => toggleTodo(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
        }`}
      >
        {todo.completed && <Check className="w-4 h-4 text-white" />}
      </button>

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            autoFocus
          />
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Todo['priority'])}
            className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={handleEdit}
            className="p-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p
                className={`text-gray-800 dark:text-gray-200 ${
                  todo.completed ? 'line-through text-gray-500 dark:text-gray-500' : ''
                }`}
              >
                {todo.text}
              </p>
              <span className={`text-sm font-medium ${getPriorityColor(todo.priority)}`}>
                {todo.priority}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
              {todo.dueDate && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
              {todo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {todo.location.name}
                </span>
              )}
              {todo.isPublic && (
                <span className="flex items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  Public
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!todo.completed && (
              <button
                onClick={() => todo.timerStarted ? stopTaskTimer(todo.id) : startTaskTimer(todo.id)}
                className="p-1 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                {todo.timerStarted ? (
                  <Square className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}