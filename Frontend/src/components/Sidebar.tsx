import React from 'react';
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Target, 
  BarChart2, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { Logo } from './Logo';
import { useAppContext } from '../context/AppContext';

export const Sidebar = ({ 
  activeView, 
  onViewChange, 
  onLogout,
  isOpen,
  setIsOpen
}: { 
  activeView: string; 
  onViewChange: (v: string) => void; 
  onLogout: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}) => {
  const { firstName, lastName, profilePic } = useAppContext();
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'habits', icon: Target, label: 'Habits' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  ];
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 bg-navy text-white flex flex-col pt-8 pb-6 px-4 z-40 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex items-center justify-between px-4 mb-10">
        <Logo className="h-10 text-white" />
        {setIsOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">
          Workspace
        </div>
        
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
              activeView === item.id 
                ? 'bg-soft-blue/20 text-soft-blue-light font-medium shadow-[inset_2px_0_0_0_#3B82F6]' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-2">
        <button 
          onClick={() => onViewChange('settings')} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
            activeView === 'settings' 
              ? 'bg-soft-blue/20 text-soft-blue-light font-medium shadow-[inset_2px_0_0_0_#3B82F6]' 
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button 
          onClick={onLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-3 w-full p-3 mt-4 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md"
          >
            <Download className="w-5 h-5" />
            <span>Install App</span>
          </button>
        )}
        {/* User Profile Snippet */}
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center gap-3 px-2">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple to-soft-blue p-[2px]">
            <img 
              src={profilePic} 
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover bg-navy"
            />
          </div>
          <div className="max-w-[120px] truncate">
            <p className="text-sm font-semibold text-white truncate" title={`${firstName} ${lastName}`}>{firstName} {lastName}</p>
            <p className="text-[10px] text-slate-400 font-semibold bg-white/10 px-1.5 py-0.5 rounded-full w-max mt-0.5">Jipro Premium Acc</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
