import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTodo } from '../context/TodoContext';
import { TodoItem } from './TodoItem';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-700' },
  { id: 'inProgress', title: 'In Progress', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 'completed', title: 'Completed', color: 'bg-emerald-50 dark:bg-emerald-900/20' },
];

export function KanbanView() {
  const { todos, editTodo } = useTodo();

  const getTodosByStatus = (status: string) => {
    switch (status) {
      case 'inProgress':
        return todos.filter(todo => !todo.completed && todo.timerStarted);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos.filter(todo => !todo.completed && !todo.timerStarted);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const todo = todos.find(t => t.id === draggableId);
    if (!todo) return;

    if (destination.droppableId === 'completed') {
      editTodo(draggableId, { completed: true });
    } else if (destination.droppableId === 'inProgress') {
      editTodo(draggableId, { timerStarted: new Date().toISOString() });
    } else {
      editTodo(draggableId, { completed: false, timerStarted: null });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <div key={column.id} className={`rounded-lg p-4 ${column.color}`}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {column.title}
            </h3>
            
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3"
                >
                  {getTodosByStatus(column.id).map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TodoItem todo={todo} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}