import React, { useState, useMemo } from 'react';
import { Card } from './Card';
import { useAppContext } from '../context/AppContext';
import { CheckCircle2, Circle, Clock, Trash2, Lock, Search, Sparkles, ChevronDown, ChevronUp, FileText, Video, Link as LinkIcon, BookOpen, ExternalLink } from 'lucide-react';
import { Modal } from './Modal';
import { Task } from '../data/mockData';
import { calculatePriority, formatDeadline } from '../utils/dateUtils';
import { motion, AnimatePresence } from 'motion/react';

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'high': return 'WAKTU AKAN HABIS';
    case 'medium': return 'WAKTU DEKAT';
    default: return 'WAKTU SANTAI';
  }
};

export const TasksView = () => {
  const { tasks, toggleTask, deleteTask, addTask } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '', course: '', deadline: ''
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.deadline) {
      addTask({
        title: newTask.title,
        course: newTask.course || '',
        deadline: new Date(newTask.deadline).toISOString(),
        priority: calculatePriority(newTask.deadline),
        completed: false
      });
      
      setIsModalOpen(false);
      setNewTask({ title: '', course: '', deadline: '' });
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <Video className="w-4 h-4 text-rose-500" />;
      case 'pdf': case 'doc': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'book': case 'notes': return <BookOpen className="w-4 h-4 text-amber-500" />;
      default: return <LinkIcon className="w-4 h-4 text-purple" />;
    }
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.course?.toLowerCase().includes(q) ||
        t.aiMaterials?.some(m => m.title.toLowerCase().includes(q) || m.type.toLowerCase().includes(q))
      );
    }
    
    return filtered.sort((a, b) => {
      const timeA = new Date(a.deadline).getTime();
      const timeB = new Date(b.deadline).getTime();
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      return timeA - timeB;
    });
  }, [tasks, searchQuery]);

  const hasUrgentTasks = useMemo(() => {
    return tasks.some(t => !t.completed && calculatePriority(t.deadline ?? '') === 'high');
  }, [tasks]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-navy">All Tasks</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tasks or materials..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, y: 4, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm bg-purple text-white rounded-xl shadow-sm font-medium flex-shrink-0 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            + Add Task
          </motion.button>
        </div>
      </div>
      
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-neutral-light">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <Search className="w-8 h-8 text-slate-300" />
              <p className="text-slate-500">{searchQuery ? 'No matching tasks found.' : 'No tasks remaining!'}</p>
            </div>
          ) : filteredTasks.map(task => {
            const priority = calculatePriority(task.deadline ?? '');
            const isLocked = hasUrgentTasks && !task.completed && priority !== 'high';
            return (
            <div key={task.id} className="transition-colors overflow-hidden">
              <div 
                className={`p-5 flex items-center justify-between group hover:bg-slate-50/50 cursor-pointer ${task.completed ? 'opacity-60 bg-slate-50/30' : isLocked ? 'opacity-60 bg-slate-50/10' : ''}`}
                onClick={(e) => toggleExpand(task.id, e)}
              >
                <div className="flex items-start gap-4">
                   <motion.button 
                      whileHover={!isLocked ? { scale: 1.15 } : {}}
                      whileTap={!isLocked ? { scale: 0.8, rotate: -20, transition: { type: "spring", stiffness: 400, damping: 10 } } : {}}
                      className={`mt-0.5 ${isLocked ? 'cursor-not-allowed' : ''}`} 
                      onClick={(e) => {
                        e.stopPropagation();
                        !isLocked && toggleTask(task.id);
                      }}
                      disabled={isLocked}
                      title={isLocked ? 'Complete high priority tasks first' : ''}
                   >
                     {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-purple" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-slate-300" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-purple transition-colors" />
                      )}
                   </motion.button>
                   <div>
                     <h4 className={`font-medium ${task.completed ? 'text-slate-500 line-through' : isLocked ? 'text-slate-500' : 'text-navy'}`}>
                       {task.title}
                     </h4>
                     <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                       {task.course && <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">{task.course}</span>}
                       <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {formatDeadline(task.deadline)}</span>
                     </div>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wider hidden sm:block ${
                    priority === 'high' ? 'text-rose-500 bg-rose-50 border-rose-200' :
                    priority === 'medium' ? 'text-amber-500 bg-amber-50 border-amber-200' :
                    'text-slate-500 bg-slate-50 border-slate-200'
                  }`}>
                    {getPriorityLabel(priority)}
                  </span>
                  <div className="flex items-center gap-1">
                    <motion.button 
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      whileTap={{ scale: 0.8, y: 2, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task">
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Task Title *</label>
            <input 
              required
              autoFocus
              type="text" 
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              placeholder="e.g. Complete math assignment"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course (Optional)</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple"
                value={newTask.course}
                onChange={e => setNewTask({...newTask, course: e.target.value})}
                placeholder="e.g. CS101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline *</label>
              <input 
                required
                type="datetime-local" 
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple bg-white"
                value={newTask.deadline}
                onChange={e => setNewTask({...newTask, deadline: e.target.value})}
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-navy transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-purple text-white rounded-xl shadow-sm font-medium flex items-center gap-2"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

