import React, { useMemo } from 'react';
import { Card } from './Card';
import { TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#e879f9', '#38bdf8', '#34d399', '#fbbf24', '#f87171'];

export const AnalyticsView = () => {
  const { tasks, habits } = useAppContext();

  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  // Calculate average habit success rate
  const habitSuccessRates = habits.map(h => Math.min(100, (h.progress / h.goal) * 100));
  const avgHabitSuccess = habits.length > 0 
    ? Math.round(habitSuccessRates.reduce((a, b) => a + b, 0) / habits.length)
    : 0;

  // Prepare Task completion data
  const taskData = useMemo(() => {
    return tasks.map(t => ({
      name: t.title,
      completionRate: t.completed ? 100 : 0,
      isCompleted: t.completed
    }));
  }, [tasks]);

  // Prepare Habit Progress data
  const habitProgressData = useMemo(() => {
    return habits.map(h => ({
      name: h.title,
      progress: h.progress,
      goal: h.goal,
      percentage: Math.min(100, Math.round((h.progress / h.goal) * 100))
    }));
  }, [habits]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy">Productivity Analytics</h2>
        <p className="text-sm text-slate-500">Your performance insights based on your current data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple/10 rounded-xl flex items-center justify-center text-purple">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Tasks Completed</p>
            <h3 className="text-2xl font-bold text-navy">{completedTasks} <span className="text-sm text-slate-400 font-normal">/ {tasks.length}</span></h3>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completion Rate</p>
            <h3 className="text-2xl font-bold text-navy">{completionRate}%</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 bg-soft-blue/10 rounded-xl flex items-center justify-center text-soft-blue">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Habit Success</p>
            <h3 className="text-2xl font-bold text-navy">{avgHabitSuccess}%</h3>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="mb-6 border-b border-slate-100 pb-3">
            <h3 className="text-lg font-semibold text-navy">Specific Tasks Completion</h3>
            <p className="text-sm text-slate-500 mt-1">
              Shows the completion status of each specific task you have inputted.
            </p>
          </div>
          {taskData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskData} layout="vertical" margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(val) => `${val}%`} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }} 
                    width={110} 
                    tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                  />
                  <Tooltip 
                    wrapperClassName="text-sm font-medium border-0 shadow-lg rounded-xl"
                    formatter={(value: number, name: string, props: any) => [props.payload.isCompleted ? 'Completed (100%)' : 'Pending (0%)', 'Status']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="completionRate" name="Completion Rate" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
               No tasks available
             </div>
          )}
        </Card>

        <Card>
          <div className="mb-6 border-b border-slate-100 pb-3">
            <h3 className="text-lg font-semibold text-navy">Habit Goal Progress</h3>
            <p className="text-sm text-slate-500 mt-1">
              Tracks your cumulative daily progress against your target duration (e.g., 30 days) for each specific habit.
            </p>
          </div>
          {habitProgressData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitProgressData} layout="vertical" margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(val) => `${val}%`} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }} 
                    width={110} 
                    tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                  />
                  <Tooltip 
                    wrapperClassName="text-sm font-medium border-0 shadow-lg rounded-xl"
                    formatter={(value: number, name: string, props: any) => [`${value}% (${props.payload.progress}/${props.payload.goal} days)`, 'Completion Rate']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="percentage" name="Completion Rate" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
               No habits available
             </div>
          )}
        </Card>
      </div>
    </div>
  );
};
