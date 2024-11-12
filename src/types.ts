export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  folderId?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  isPublic?: boolean;
  assignedTo?: string[];
  tags?: string[];
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  isShared?: boolean;
  sharedWith?: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface UserStats {
  tasksCompleted: number;
  streakDays: number;
  achievements: Achievement[];
  productivityByHour: Record<number, number>;
  tasksByPriority: Record<string, number>;
}

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

export type ViewMode = 'list' | 'kanban' | 'calendar';

export type TodoContextType = {
  todos: Todo[];
  folders: Folder[];
  viewMode: ViewMode;
  userStats: UserStats;
  pomodoroSettings: PomodoroSettings;
  addTodo: (text: string, folderId?: string, dueDate?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, updates: Partial<Todo>) => void;
  addFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
  shareFolder: (folderId: string, userIds: string[]) => void;
  makeTaskPublic: (todoId: string, isPublic: boolean) => void;
  assignTask: (todoId: string, userIds: string[]) => void;
  addSubTask: (todoId: string, text: string) => void;
  toggleSubTask: (todoId: string, subTaskId: string) => void;
  startTaskTimer: (todoId: string) => void;
  stopTaskTimer: (todoId: string) => void;
  getSuggestedTasks: (input: string) => string[];
};