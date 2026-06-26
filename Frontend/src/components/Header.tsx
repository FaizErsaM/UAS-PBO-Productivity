import React, { useState, useEffect } from 'react';
import { Menu, Clock } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export const Header = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDate = new Intl.DateTimeFormat('id-ID', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  }).format(time);

  const currentTimeStr = time.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const hour = time.getHours();
  let greeting = 'Selamat Pagi';
  if (hour >= 11 && hour < 15) {
    greeting = 'Selamat Siang';
  } else if (hour >= 15 && hour < 18) {
    greeting = 'Selamat Sore';
  } else if (hour >= 18 || hour < 4) {
    greeting = 'Selamat Malam';
  }

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-navy hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
            id="mobile-menu-toggle"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-1 tracking-tight">
            {greeting} Sobat JIPRO
          </h1>
          <p className="text-slate-500 font-medium text-xs md:text-sm flex items-center gap-2 flex-wrap mt-1">
            <span className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors font-semibold text-slate-700">
              {currentDate}
            </span>
            <span className="text-slate-300">•</span>
            <span className="bg-purple/10 text-purple border border-purple/20 px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1.5 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-purple shrink-0 animate-pulse" />
              {currentTimeStr}
            </span>
            <span className="text-slate-300">•</span>
            <span className="italic text-slate-400">Small progress is still progress.</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 self-end sm:self-auto">
        <NotificationBell />
      </div>
    </header>
  );
};
