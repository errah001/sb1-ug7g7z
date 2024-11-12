import React, { useState, useEffect } from 'react';
import { Plus, Clock, Share2, MapPin } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { Priority } from '../types';

interface AddTodoProps {
  folderId?: string;
}

export function AddTodo({ folderId }: AddTodoProps) {
  const { addTodo, getSuggestedTasks } = useTodo();
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (text.length > 2) {
      const newSuggestions = getSuggestedTasks(text);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo({
        text,
        folderId,
        dueDate: dueDate || undefined,
        priority,
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
        isPublic,
        location: location ? { name: location } : undefined,
      });
      setText('');
      setDueDate('');
      setPriority('medium');
      setEstimatedTime('');
      setIsPublic(false);
      setLocation('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setText(suggestion);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
        
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <input
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="Est. minutes"
            className="w-24 px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-gray-500" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Public</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors dark:focus:ring-offset-gray-800"
      >
        <Plus className="w-5 h-5 inline-block mr-2" />
        Add Task
      </button>
    </form>
  );
}