import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Check, X, Loader2 } from 'lucide-react';

export const GlobalFeedback = () => {
  const { feedback } = useAppContext();

  return (
    <AnimatePresence>
      {feedback.status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000]"
        >
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border ${
            feedback.status === 'loading' ? 'bg-white border-slate-200 text-navy dark:bg-slate-800 dark:border-slate-700 dark:text-white' :
            feedback.status === 'success' ? 'bg-emerald-500 border-emerald-600 text-white' :
            'bg-red-500 border-red-600 text-white'
          }`}>
            {feedback.status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
            {feedback.status === 'success' && <Check className="w-5 h-5" />}
            {feedback.status === 'error' && <X className="w-5 h-5" />}
            <span className="font-medium text-sm">
              {feedback.status === 'loading' ? 'Memproses...' : 
               feedback.status === 'success' ? 'Berhasil: ' + feedback.message :
               'Gagal: ' + feedback.message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
