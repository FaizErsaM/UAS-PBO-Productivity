import React, { useState } from 'react';
import { Card } from './Card';
import { useAppContext } from '../context/AppContext';
import { Target, Plus, Minus, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Habit } from '../data/mockData';

export const HabitsView = () => {
  const { habits, addHabit, toggleHabitForToday, deleteHabit } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'manual' | 'ai'>('manual');
  
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    title: '', goal: 30, unit: 'days'
  });

  const [aiGoal, setAiGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHabits, setGeneratedHabits] = useState<any[]>([]);

  const openModal = () => {
    setIsModalOpen(true);
    setModalTab('ai'); // AI first for the cool factor
    setAiGoal('');
    setGeneratedHabits([]);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.title && newHabit.goal) {
      addHabit({
        title: newHabit.title,
        goal: Number(newHabit.goal),
        unit: 'days', // Force 'days' for period goals
        progress: 0,
        category: 'General'
      });
      setIsModalOpen(false);
      setNewHabit({ title: '', goal: 30, unit: 'days' });
    }
  };

  const generateAiHabits = async () => {
    if (!aiGoal.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: aiGoal })
      });
      const data = await response.json();
      if (data.habits && Array.isArray(data.habits)) {
        setGeneratedHabits(data.habits);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAiHabit = (habitToCreate: any) => {
    addHabit({
      title: habitToCreate.title,
      goal: Number(habitToCreate.goal || 30),
      unit: 'days',
      progress: 0,
      category: habitToCreate.category || 'General'
    });
    setGeneratedHabits(generatedHabits.filter(h => h.title !== habitToCreate.title));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy">Habit Tracker</h2>
        <button 
          onClick={openModal}
          className="px-4 py-2 text-sm bg-purple text-white rounded-xl shadow-sm hover:bg-purple-light transition-colors font-medium"
        >
          + New Habit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {habits.map(habit => {
           const percent = Math.min(100, Math.round((habit.progress / habit.goal) * 100));
           return (
             <Card key={habit.id} className="flex flex-col relative group">
               <button 
                 onClick={() => deleteHabit(habit.id)}
                 className="absolute top-4 right-4 p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-500 rounded-lg hover:bg-rose-50"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
               <div className="flex items-start justify-between mb-4">
                 <div className="flex items-start gap-3 w-full pr-6">
                   <div className="w-10 h-10 shrink-0 rounded-xl bg-purple/10 flex items-center justify-center text-purple">
                     <Target className="w-5 h-5" />
                   </div>
                   <h3 className="font-semibold text-navy leading-relaxed pt-1.5 break-words max-w-full">{habit.title}</h3>
                 </div>
               </div>
               
               <div className="mt-auto">
                 <div className="flex justify-between items-center text-sm font-medium mb-2">
                   <div className="flex flex-col">
                     <span className="text-slate-500">Progress</span>
                     {habit.category && <span className="text-[10px] text-purple font-semibold uppercase tracking-wider">{habit.category}</span>}
                   </div>
                   <span className="text-navy min-w-[3rem] text-right font-semibold">{habit.progress} / {habit.goal} days</span>
                 </div>
                 
                 {habit.lastCompletedDate === new Date().toISOString().split('T')[0] ? (
                   <button
                     onClick={() => toggleHabitForToday(habit.id)}
                     className="w-full py-2 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl font-medium text-sm transition-colors hover:bg-emerald-100 mb-2"
                   >
                     <Target className="w-4 h-4" /> Completed Today
                   </button>
                 ) : (
                   <button
                     onClick={() => toggleHabitForToday(habit.id)}
                     className="w-full py-2 flex items-center justify-center gap-2 bg-purple text-white rounded-xl font-medium text-sm transition-colors hover:bg-purple-light mb-2 shadow-sm"
                   >
                     <Plus className="w-4 h-4" /> Mark as Done Today
                   </button>
                 )}

                 <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                   <div 
                     style={{ width: `${percent}%` }}
                     className={`h-full ${percent >= 100 ? 'bg-emerald-500' : 'bg-purple'} transition-all duration-300`}
                   ></div>
                 </div>
               </div>
             </Card>
           );
         })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Habit">
        
        <div className="flex border-b border-slate-200 mb-6">
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${modalTab === 'ai' ? 'text-purple border-b-2 border-purple' : 'text-slate-500 hover:text-navy'}`}
            onClick={() => setModalTab('ai')}
          >
            AI Assistant
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium transition-colors ${modalTab === 'manual' ? 'text-purple border-b-2 border-purple' : 'text-slate-500 hover:text-navy'}`}
            onClick={() => setModalTab('manual')}
          >
            Manual Entry
          </button>
        </div>

        {modalTab === 'manual' ? (
          <form onSubmit={handleAddHabit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Habit Name *</label>
              <input 
                required
                autoFocus
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple"
                value={newHabit.title}
                onChange={e => setNewHabit({...newHabit, title: e.target.value})}
                placeholder="e.g. Read a book"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Period (Days) *</label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple"
                value={newHabit.goal}
                onChange={e => setNewHabit({...newHabit, goal: parseInt(e.target.value) || 1})}
                placeholder="e.g. 30"
              />
              <p className="text-xs text-slate-500 mt-1.5">How many days do you want to track this habit?</p>
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
                className="px-4 py-2 text-sm bg-purple text-white rounded-xl shadow-sm hover:bg-purple-light transition-colors font-medium"
              >
                Create Habit
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">What do you want to achieve or become?</label>
              <div className="flex gap-2">
                <input 
                  autoFocus
                  type="text" 
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50 focus:border-purple"
                  value={aiGoal}
                  onChange={e => setAiGoal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && generateAiHabits()}
                  placeholder="e.g. I want to be a software engineer"
                />
                <button 
                  type="button"
                  onClick={generateAiHabits}
                  disabled={isGenerating || !aiGoal.trim()}
                  className="px-4 py-2 text-sm bg-slate-900 text-white rounded-xl shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate AI'}
                </button>
              </div>
            </div>

            {generatedHabits.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-slate-700">AI Suggestions:</h4>
                <div className="space-y-2">
                  {generatedHabits.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-purple/5 border border-purple/10 rounded-xl">
                      <div>
                        <p className="font-medium text-navy text-sm">{h.title}</p>
                        <p className="text-xs text-slate-500">{h.goal} days target &bull; {h.category || 'General'}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleAddAiHabit(h)}
                        className="p-1.5 bg-white text-purple hover:bg-purple hover:text-white rounded-lg border border-purple/20 transition-colors"
                        title="Add to Tracker"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {generatedHabits.length === 0 && !isGenerating && aiGoal && (
               <p className="text-sm text-slate-500 text-center py-4">Press Generate AI to get personalized habits.</p>
            )}

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-navy transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
