import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Bell, X } from 'lucide-react';

/**
 * Pengingat visual (toast) yang muncul otomatis saat ada task mendekati deadline
 * (dalam 24 jam). Ini PURELY VISUAL — tidak mengirim email. Untuk pengiriman
 * email gunakan NotificationBell (ikon bell di header).
 */
export const DeadlineNotification = () => {
  const { tasks } = useAppContext();
  const [notifications, setNotifications] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    // Cek task yang deadline-nya dalam 24 jam & belum selesai
    const now = new Date().getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    // localStorage biar tidak spam user setiap reload
    const notifiedIdsStr = localStorage.getItem('heyjipro_notified_tasks') || '[]';
    const notifiedIds: string[] = JSON.parse(notifiedIdsStr);

    const newUrgentTasks = tasks.filter((t) => {
      if (t.completed) return false;
      const dueTime = new Date(t.deadline).getTime();
      const timeDiff = dueTime - now;
      // Antara sekarang dan 24 jam ke depan
      return timeDiff > 0 && timeDiff <= oneDayInMs;
    });

    const toNotify = newUrgentTasks.filter((t) => !notifiedIds.includes(t.id));

    if (toNotify.length > 0) {
      // Bunyi bel pengingat
      try {
        const audio = new Audio(
          'https://cdn.freesound.org/previews/411/411088_5121236-lq.mp3',
        );
        audio.volume = 0.5;
        audio.play().catch(() => console.log('Audio playback prevented by browser policy'));
      } catch {
        /* noop */
      }

      // Tambah ke state
      const newNotifs = toNotify.map((t) => ({ id: t.id, title: t.title }));
      setNotifications((prev) => [...prev, ...newNotifs]);

      // Catat ke localStorage biar tidak muncul lagi
      const updatedIds = [...notifiedIds, ...toNotify.map((t) => t.id)];
      localStorage.setItem('heyjipro_notified_tasks', JSON.stringify(updatedIds));
    }
  }, [tasks]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AnimatePresence>
      <div className="fixed top-20 right-6 z-[9900] space-y-3 flex flex-col items-end pointer-events-none">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white dark:bg-slate-800 border-l-4 border-l-rose-500 rounded-lg shadow-xl p-4 w-80 pointer-events-auto relative overflow-hidden"
          >
            <button
              onClick={() => removeNotification(notif.id)}
              className="absolute top-2 right-2 text-slate-400 hover:text-navy dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full shrink-0">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div className="pr-4">
                <h4 className="text-sm font-bold text-navy dark:text-white leading-tight mb-1">
                  Deadline 1 Hari Lagi!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  "{notif.title}"
                </p>
                <p className="mt-2 text-[10px] flex items-center gap-1 text-slate-500">
                  <Bell className="w-3 h-3" /> Segera kerjakan sebelum tenggat
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};
