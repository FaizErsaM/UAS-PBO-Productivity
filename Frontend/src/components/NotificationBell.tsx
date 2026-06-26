import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bell, Mail, Clock, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Task } from '../data/mockData';
import { formatDeadline } from '../utils/dateUtils';

interface RowFeedback {
  status: 'loading' | 'success' | 'error';
  message: string;
}

const HOURS_IN_MS = 60 * 60 * 1000;

const formatCountdown = (deadlineIso: string): { label: string; overdue: boolean } => {
  const diffMs = new Date(deadlineIso).getTime() - Date.now();
  const overdue = diffMs < 0;
  const absMs = Math.abs(diffMs);
  const hours = Math.floor(absMs / HOURS_IN_MS);
  const days = Math.floor(hours / 24);

  if (days > 0) return { label: `${days}h ${hours % 24}j lagi`, overdue };
  if (hours > 0) return { label: `${hours}j lagi`, overdue };
  const mins = Math.floor(absMs / (60 * 1000));
  return { label: `${mins}m lagi`, overdue };
};

export const NotificationBell: React.FC = () => {
  const { tasks, sendTestEmail } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, RowFeedback>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Hitung task overdue & mendekati deadline (dalam 24 jam).
  const { overdueTasks, approachingTasks } = useMemo(() => {
    const now = Date.now();
    const overdue: Task[] = [];
    const approaching: Task[] = [];
    for (const t of tasks) {
      if (t.completed) continue;
      const diffMs = new Date(t.deadline).getTime() - now;
      if (diffMs < 0) overdue.push(t);
      else if (diffMs <= 24 * HOURS_IN_MS) approaching.push(t);
    }
    return { overdueTasks: overdue, approachingTasks: approaching };
  }, [tasks]);

  const totalCount = overdueTasks.length + approachingTasks.length;

  // Click-outside handler
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const handleSend = async (task: Task, type: 'approaching' | 'overdue') => {
    setSendingId(task.id);
    setFeedback((prev) => ({ ...prev, [task.id]: { status: 'loading', message: 'Mengirim...' } }));
    try {
      const result = await sendTestEmail(task.id, type);
      if (result.sent) {
        setFeedback((prev) => ({
          ...prev,
          [task.id]: { status: 'success', message: `Terkirim ke ${result.recipient}` },
        }));
      } else {
        setFeedback((prev) => ({
          ...prev,
          [task.id]: { status: 'error', message: result.error || 'Gagal mengirim email' },
        }));
      }
    } catch (e: any) {
      setFeedback((prev) => ({
        ...prev,
        [task.id]: { status: 'error', message: e.message || 'Gagal mengirim email' },
      }));
    } finally {
      setSendingId(null);
    }
  };

  const renderRow = (task: Task, type: 'approaching' | 'overdue') => {
    const isOverdue = type === 'overdue';
    const fb = feedback[task.id];
    const isSending = sendingId === task.id;
    const countdown = formatCountdown(task.deadline);

    return (
      <div
        key={task.id}
        className="rounded-lg border border-slate-200 bg-white p-3 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="w-3 h-3" />
                {formatDeadline(task.deadline)}
              </span>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isOverdue
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isOverdue ? 'Terlewat' : countdown.label}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback bar (menggantikan global toast) */}
        {fb && (
          <div
            className={`mt-2 flex items-center gap-1.5 text-[11px] font-medium ${
              fb.status === 'success'
                ? 'text-emerald-600'
                : fb.status === 'error'
                  ? 'text-rose-600'
                  : 'text-slate-500'
            }`}
          >
            {fb.status === 'success' && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
            {fb.status === 'error' && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
            {fb.status === 'loading' && <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />}
            <span className="truncate">{fb.message}</span>
          </div>
        )}

        <button
          onClick={() => handleSend(task, type)}
          disabled={isSending}
          className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-navy text-white hover:bg-navy/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Mail className="w-3.5 h-3.5" />
          )}
          {isSending ? 'Mengirim...' : 'Kirim Email'}
        </button>
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="p-2.5 bg-white border border-neutral-light rounded-xl text-slate-500 hover:text-navy hover:bg-slate-50 transition-all shadow-sm relative cursor-pointer"
        aria-label="Notifikasi deadline"
      >
        <Bell className="w-5 h-5" />
        {totalCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {totalCount > 9 ? '9+' : totalCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-navy flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifikasi Deadline
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
              {totalCount}
            </span>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto">
            {totalCount === 0 ? (
              <div className="px-4 py-10 flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-700">Tidak ada notifikasi. Mantap!</p>
                <p className="text-xs text-slate-400">Semua task aman dari deadline dekat.</p>
              </div>
            ) : (
              <div className="p-3 space-y-4">
                {/* Terlambat */}
                {overdueTasks.length > 0 && (
                  <section>
                    <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-rose-600 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Terlambat ({overdueTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {overdueTasks.map((t) => renderRow(t, 'overdue'))}
                    </div>
                  </section>
                )}

                {/* Mendekati Deadline */}
                {approachingTasks.length > 0 && (
                  <section>
                    <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-600 mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      Mendekati Deadline ({approachingTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {approachingTasks.map((t) => renderRow(t, 'approaching'))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-[11px] text-slate-500">
              Email dikirim ke alamat email akunmu
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
