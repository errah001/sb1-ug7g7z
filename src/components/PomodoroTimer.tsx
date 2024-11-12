import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import useSound from 'use-sound';

export function PomodoroTimer() {
  const { pomodoroSettings } = useTodo();
  const [timeLeft, setTimeLeft] = useState(pomodoroSettings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  
  const [playStart] = useSound('/sounds/start.mp3');
  const [playComplete] = useSound('/sounds/complete.mp3');

  useEffect(() => {
    let interval: number;
    
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playComplete();
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    if (isBreak) {
      setTimeLeft(pomodoroSettings.workDuration * 60);
      setIsBreak(false);
    } else {
      setSessionCount((count) => count + 1);
      const isLongBreak = (sessionCount + 1) % pomodoroSettings.longBreakInterval === 0;
      setTimeLeft(
        (isLongBreak ? pomodoroSettings.longBreakDuration : pomodoroSettings.breakDuration) * 60
      );
      setIsBreak(true);
    }
  };

  const toggleTimer = () => {
    if (!isRunning) playStart();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(pomodoroSettings.workDuration * 60);
    setIsBreak(false);
    setSessionCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </h3>
        
        <div className="text-4xl font-bold text-emerald-500">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 transition-colors"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Coffee className="w-4 h-4" />
          <span>Session {sessionCount + 1}</span>
        </div>
      </div>
    </div>
  );
}