import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ScheduleView = () => {
  const { tasks } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  // State untuk data dari backend
  const [serverEvents, setServerEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

  // Mengambil data dari server
  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const start = new Date(year, month, 1).toISOString();
        const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
        
        const dummyUserId = "550e8400-e29b-41d4-a716-446655440000"; 

        const response = await fetch(`http://localhost:8080/api/schedule/user/${dummyUserId}?start=${start}&end=${end}`);
        
        if (response.ok) {
          const data = await response.json();
          setServerEvents(data);
        }
      } catch (error) {
        console.error("Gagal menyambungkan ke server:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [currentDate]);

  // Menggabungkan data
  const getTasksForDate = (day: number) => {
    const localTasks = tasks.filter(task => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear() &&
        !task.completed
      );
    });

    const backendEvents = serverEvents.filter(event => {
      if (!event.startTime) return false;
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    }).map(event => ({
      id: event.id,
      title: event.title,
      deadline: event.startTime, 
      completed: false
    }));

    return [...localTasks, ...backendEvents];
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
        <div className="grid grid-cols-7 border-b border-neutral-light bg-slate-50/50">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center font-semibold text-xs text-slate-500 py-3 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[minmax(100px,auto)]">
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b border-neutral-light/50 bg-slate-50/30 p-2 min-h-[100px]"></div>
          ))}

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