import React, { createContext, useContext, useEffect, useState } from 'react';
import { Todo, Folder, TodoContextType, UserStats, PomodoroSettings, ViewMode } from '../types';
import { useAuth } from './AuthContext';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getFirestore 
} from 'firebase/firestore';

const defaultPomodoroSettings: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
};

const defaultUserStats: UserStats = {
  tasksCompleted: 0,
  streakDays: 0,
  achievements: [],
  productivityByHour: {},
  tasksByPriority: { low: 0, medium: 0, high: 0 },
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);
const db = getFirestore();

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(defaultPomodoroSettings);

  useEffect(() => {
    if (!user) return;

    // Subscribe to todos
    const todosQuery = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid)
    );

    const unsubscribeTodos = onSnapshot(todosQuery, (snapshot) => {
      const newTodos: Todo[] = [];
      snapshot.forEach((doc) => {
        newTodos.push({ id: doc.id, ...doc.data() } as Todo);
      });
      setTodos(newTodos);
    });

    // Subscribe to folders
    const foldersQuery = query(
      collection(db, 'folders'),
      where('userId', '==', user.uid)
    );

    const unsubscribeFolders = onSnapshot(foldersQuery, (snapshot) => {
      const newFolders: Folder[] = [];
      snapshot.forEach((doc) => {
        newFolders.push({ id: doc.id, ...doc.data() } as Folder);
      });
      setFolders(newFolders);
    });

    return () => {
      unsubscribeTodos();
      unsubscribeFolders();
    };
  }, [user]);

  const addTodo = async (text: string, folderId?: string, dueDate?: string) => {
    if (!user) return;

    const newTodo: Omit<Todo, 'id'> = {
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      folderId,
      dueDate,
      priority: 'medium',
      userId: user.uid,
    };

    const docRef = doc(collection(db, 'todos'));
    await setDoc(docRef, newTodo);
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const todoRef = doc(db, 'todos', id);
    await updateDoc(todoRef, {
      completed: !todo.completed
    });

    // Update stats if completed
    if (!todo.completed) {
      setUserStats(prev => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1,
        tasksByPriority: {
          ...prev.tasksByPriority,
          [todo.priority]: prev.tasksByPriority[todo.priority] + 1
        }
      }));
    }
  };

  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  const editTodo = async (id: string, updates: Partial<Todo>) => {
    await updateDoc(doc(db, 'todos', id), updates);
  };

  const addFolder = async (name: string) => {
    if (!user) return;

    const newFolder: Omit<Folder, 'id'> = {
      name,
      createdAt: new Date().toISOString(),
      userId: user.uid,
    };

    const docRef = doc(collection(db, 'folders'));
    await setDoc(docRef, newFolder);
  };

  const deleteFolder = async (id: string) => {
    await deleteDoc(doc(db, 'folders', id));
    // Delete associated todos
    todos
      .filter(todo => todo.folderId === id)
      .forEach(todo => deleteTodo(todo.id));
  };

  const getSuggestedTasks = (input: string): string[] => {
    const suggestions: Record<string, string[]> = {
      'groceries': ['Buy milk', 'Buy eggs', 'Buy bread', 'Buy fruits'],
      'workout': ['Do cardio', 'Lift weights', 'Stretch', 'Yoga'],
      'work': ['Check emails', 'Team meeting', 'Update reports', 'Client call'],
    };

    const matchingCategory = Object.keys(suggestions).find(
      category => input.toLowerCase().includes(category)
    );

    return matchingCategory ? suggestions[matchingCategory] : [];
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        folders,
        viewMode,
        userStats,
        pomodoroSettings,
        addTodo,
        toggleTodo,
        deleteTodo,
        editTodo,
        addFolder,
        deleteFolder,
        setViewMode,
        updatePomodoroSettings: (settings) => 
          setPomodoroSettings(prev => ({ ...prev, ...settings })),
        shareFolder: async (folderId, userIds) => {
          await updateDoc(doc(db, 'folders', folderId), {
            isShared: true,
            sharedWith: userIds
          });
        },
        makeTaskPublic: async (todoId, isPublic) => {
          await updateDoc(doc(db, 'todos', todoId), { isPublic });
        },
        assignTask: async (todoId, userIds) => {
          await updateDoc(doc(db, 'todos', todoId), { assignedTo: userIds });
        },
        addSubTask: async (todoId, text) => {
          const todo = todos.find(t => t.id === todoId);
          if (!todo) return;

          const newSubTask = {
            id: crypto.randomUUID(),
            text,
            completed: false
          };

          await updateDoc(doc(db, 'todos', todoId), {
            subtasks: [...(todo.subtasks || []), newSubTask]
          });
        },
        toggleSubTask: async (todoId, subTaskId) => {
          const todo = todos.find(t => t.id === todoId);
          if (!todo?.subtasks) return;

          const updatedSubtasks = todo.subtasks.map(st =>
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          );

          await updateDoc(doc(db, 'todos', todoId), {
            subtasks: updatedSubtasks
          });
        },
        startTaskTimer: async (todoId) => {
          await updateDoc(doc(db, 'todos', todoId), {
            timerStarted: new Date().toISOString()
          });
        },
        stopTaskTimer: async (todoId) => {
          const todo = todos.find(t => t.id === todoId);
          if (!todo?.timerStarted) return;

          const startTime = new Date(todo.timerStarted);
          const endTime = new Date();
          const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

          await updateDoc(doc(db, 'todos', todoId), {
            timerStarted: null,
            actualTime: (todo.actualTime || 0) + duration
          });
        },
        getSuggestedTasks,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}