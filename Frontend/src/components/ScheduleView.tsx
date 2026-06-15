import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatDeadline } from '../utils/dateUtils';

export const ScheduleView = () => {
  const { tasks } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  // Adjust so Monday is 0, Sunday is 6 (or keep Sunday 0, Saturday 6 depending on preference)
  // Let's use standard Sunday=0 for easier Date mapping, but display Monday first
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

  const getTasksForDate = (day: number) => {
    return tasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear() &&
        !task.completed
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy">Schedule & Reminders</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-xl shadow-sm border border-neutral-light overflow-hidden">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-50 text-slate-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 font-semibold text-navy min-w-[140px] text-center">
              {monthName}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-50 text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button className="hidden md:block px-4 py-2 text-sm bg-purple text-white rounded-xl shadow-sm hover:bg-purple-light transition-colors font-medium">
            + Add Event
          </button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden bg-white">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-neutral-light bg-slate-50/50">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center font-semibold text-xs text-slate-500 py-3 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-[minmax(100px,auto)]">
          {/* Empty cells before start of month */}
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b border-neutral-light/50 bg-slate-50/30 p-2 min-h-[100px]"></div>
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday = 
              new Date().getDate() === day && 
              new Date().getMonth() === currentDate.getMonth() && 
              new Date().getFullYear() === currentDate.getFullYear();
            
            const dayTasks = getTasksForDate(day);

            return (
              <div 
                key={day} 
                className={`border-r border-b border-neutral-light/50 p-2 transition-colors hover:bg-slate-50/50 group min-h-[120px] ${
                  isToday ? 'bg-purple/5' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-purple text-white shadow-md' : 'text-slate-600 group-hover:text-purple'
                  }`}>
                    {day}
                  </span>
                </div>
                
                <div className="space-y-1.5 mt-1">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="text-[10px] sm:text-xs p-1.5 rounded-md bg-purple/10 border border-purple/20 text-purple font-medium truncate flex-col sm:flex-row items-start sm:items-center gap-1 shadow-sm leading-tight"
                      title={task.title}
                    >
                      <div className="truncate">{task.title}</div>
                      <div className="text-purple/80 flex items-center text-[9px] mt-0.5">
                         <Clock className="w-2.5 h-2.5 mr-0.5 inline-block" />
                         {new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
