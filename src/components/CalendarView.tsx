import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useTodo } from '../context/TodoContext';

export function CalendarView() {
  const { todos } = useTodo();

  const events = todos.map(todo => ({
    id: todo.id,
    title: todo.text,
    start: todo.dueDate,
    backgroundColor: todo.completed ? '#10B981' : 
      todo.priority === 'high' ? '#EF4444' :
      todo.priority === 'medium' ? '#F59E0B' : '#10B981',
    borderColor: 'transparent',
    textColor: '#ffffff',
    className: todo.completed ? 'line-through opacity-50' : '',
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        height="auto"
        eventClick={({ event }) => {
          const todo = todos.find(t => t.id === event.id);
          if (todo) {
            // Handle event click - could show a modal with task details
            console.log('Todo clicked:', todo);
          }
        }}
      />
    </div>
  );
}