import React, { useMemo, useState } from 'react';
import { Card } from './Card';
import { useAppContext } from '../context/AppContext';
import { CheckCircle2, Circle, Clock, Flame, BookOpen, Droplets, ChevronRight, Play, Target, Lock } from 'lucide-react';
import { calculatePriority, formatDeadline } from '../utils/dateUtils';
import { DeepWorkView } from './DeepWorkView';

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'high': return 'WAKTU AKAN HABIS';
    case 'medium': return 'WAKTU DEKAT';
    default: return 'WAKTU SANTAI';
  }
};

export const Dashboard = ({ onViewChange }: { onViewChange?: (view: string) => void }) => {
  const { tasks, habits, toggleTask, toggleHabitForToday } = useAppContext();
  const [showDeepWork, setShowDeepWork] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-rose-500 bg-rose-50 border-rose-200';
      case 'medium': return 'text-amber-500 bg-amber-50 border-amber-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const getHabitIcon = (title: string) => {
    if (title.includes('Work')) return <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />;
    if (title.includes('Read')) return <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-purple" />;
    if (title.includes('Water')) return <Droplets className="w-4 h-4 md:w-5 md:h-5 text-soft-blue" />;
    return <Target className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />;
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const timeA = new Date(a.deadline).getTime();
      const timeB = new Date(b.deadline).getTime();
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      return timeA - timeB;
    });
  }, [tasks]);

  const hasUrgentTasks = useMemo(() => {
    return tasks.some(t => !t.completed && calculatePriority(t.deadline ?? '') === 'high');
  }, [tasks]);

  const priorityTasks = sortedTasks.slice(0, 4); // Show top 4 closest
  const mainFocus = sortedTasks.find(t => !t.completed) || sortedTasks[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
    {/* Dashboard Stats dari Backend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <p className="text-3xl font-bold text-navy">{tasks.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total Task</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-3xl font-bold text-purple">{tasks.filter(t => t.completed).length}</p>
          <p className="text-sm text-slate-500 mt-1">Task Selesai</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-3xl font-bold text-amber-500">{tasks.filter(t => !t.completed).length}</p>
          <p className="text-sm text-slate-500 mt-1">Task Pending</p>
        </Card>
        <Card className="text-center p-4">
          <p className="text-3xl font-bold text-emerald-500">{habits.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total Habit</p>
        </Card>
      </div>  
      {/* Top Section: Focus & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Focus Card - Purple Gradient emphasis */}
        <Card className="lg:col-span-2 relative overflow-hidden group bg-gradient-to-br from-navy to-navy-light text-white border-none padding-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 p-8 flex flex-col h-full justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-light animate-pulse"></div>
                Today's Primary Focus
              </span>
              <h2 className="text-3xl font-bold mb-2">{mainFocus ? mainFocus.title : "All Clear!"}</h2>
              {mainFocus && (
                <p className="text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Due: {formatDeadline(mainFocus.deadline)} {mainFocus.course && `• ${mainFocus.course}`}
                </p>
              )}
            </div>
            
            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setShowDeepWork(true)}
                className="px-6 py-3 bg-purple hover:bg-purple-light text-white rounded-xl font-medium transition-colors shadow-lg shadow-purple/25 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Enter Deep Work
              </button>
            </div>
          </div>
        </Card>

        {/* Deep Work Modal */}
        {showDeepWork && <DeepWorkView onClose={() => setShowDeepWork(false)} />}

        {/* Mini Analytics / Progress */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-navy mb-1">Daily Progress</h3>
            <p className="text-sm text-slate-500 mb-6">{tasks.filter(t => t.completed).length} of {tasks.length} tasks completed</p>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple bg-purple/10">
                    On Track
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-purple">
                    {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-purple/10">
                <div style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple rounded-full transition-all duration-1000"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-4">
            <p className="text-sm text-slate-600 font-medium italic">
              "Small progress is still progress. Keep the momentum going!"
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Task List */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-navy">Priority Tasks</h3>
            <button onClick={() => onViewChange?.('tasks')} className="text-sm font-medium text-purple hover:text-purple-light transition-colors flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-3">
            {priorityTasks.length > 0 ? priorityTasks.map(task => {
              const priority = calculatePriority(task.deadline ?? '');
              const isLocked = hasUrgentTasks && !task.completed && priority !== 'high';
              
              return (
                <div 
                  key={task.id} 
                  className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    task.completed 
                      ? 'bg-slate-50/50 border-transparent opacity-60' 
                      : isLocked ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-neutral-light hover:border-purple/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button 
                      onClick={() => !isLocked && toggleTask(task.id)}
                      disabled={isLocked}
                      className={`mt-1 focus:outline-none flex-shrink-0 ${isLocked ? 'cursor-not-allowed' : ''}`}
                      title={isLocked ? 'Complete high priority tasks first' : ''}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-purple transition-transform hover:scale-110" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-slate-300" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 group-hover:text-purple transition-all duration-200 hover:scale-110" />
                      )}
                    </button>
                    <div>
                      <h4 className={`font-medium transition-colors ${task.completed ? 'text-slate-400 line-through' : isLocked ? 'text-slate-400' : 'text-navy'}`}>
                        {task.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                        {task.course && (
                          <span className="flex items-center gap-1 font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {task.course}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDeadline(task.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!task.completed && (
                    <div className="hidden sm:block">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getPriorityColor(priority)} uppercase tracking-wider`}>
                        {getPriorityLabel(priority)}
                      </span>
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="p-4 text-center text-slate-500">All tasks completed! ✨</div>
            )}
          </div>
        </Card>

        {/* Habit Tracker */}
        <Card>
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-navy mb-6">Daily Habits</h3>
            
            <div className="space-y-5 flex-1">
              {habits.map(habit => {
                const percent = Math.min(100, Math.round((habit.progress / habit.goal) * 100));
                return (
                  <div key={habit.id} className="group">
                    <div className="flex items-start justify-between mb-2">
                       <button 
                         onClick={() => toggleHabitForToday(habit.id)}
                         className="flex items-start gap-2 group-hover:opacity-80 transition-opacity text-left pr-4"
                       >
                        <div className={`p-2 shrink-0 rounded-lg transition-colors mt-0.5 ${habit.lastCompletedDate === new Date().toISOString().split('T')[0] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 group-hover:bg-purple/5'}`}>
                          {habit.lastCompletedDate === new Date().toISOString().split('T')[0] ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : getHabitIcon(habit.title)}
                        </div>
                        <span className={`font-medium text-sm leading-normal mt-1 break-words max-w-full ${habit.lastCompletedDate === new Date().toISOString().split('T')[0] ? 'text-emerald-700' : 'text-navy'}`}>{habit.title}</span>
                       </button>
                       <span className="text-sm font-semibold text-slate-500 shrink-0 whitespace-nowrap pt-2">
                        {habit.progress} <span className="text-slate-400 font-normal">/ {habit.goal}</span>
                       </span>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-100">
                      <div 
                        style={{ width: `${percent}%` }} 
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full transition-all duration-1000 ${percent >= 100 ? 'bg-emerald-500' : 'bg-soft-blue'}`}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <button onClick={() => onViewChange?.('habits')} className="w-full mt-6 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:text-navy hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer">
              + New Habit
            </button>
          </div>
        </Card>
      </div>

    </div>
  );
};
