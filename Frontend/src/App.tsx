import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { TasksView } from "./components/TasksView";
import { ScheduleView } from "./components/ScheduleView";
import { HabitsView } from "./components/HabitsView";
import { AnalyticsView } from "./components/AnalyticsView";
import { SettingsView } from "./components/SettingsView";
import { LandingPage } from "./components/LandingPage";
import { AiChat } from "./components/AiChat";
import { IntroSplashScreen } from "./components/IntroSplashScreen";
import { GlobalFeedback } from "./components/GlobalFeedback";
import { CustomCursor } from "./components/CustomCursor";
import { DeadlineNotification } from "./components/DeadlineNotification";
import { useAppContext } from "./context/AppContext";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

 const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");

  setIsLoggedIn(false);
  setActiveView("dashboard");
  setIsSidebarOpen(false);
};

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onViewChange={setActiveView} />;
      case "tasks":
        return <TasksView />;
      case "schedule":
        return <ScheduleView />;
      case "habits":
        return <HabitsView />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView onLogout={handleLogout} />;
      default:
        return <Dashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <>
      <CustomCursor />
      <GlobalFeedback />
      <DeadlineNotification />

      {isInstallable && isLoggedIn && (
        <button 
          onClick={handleInstallClick}
          className="fixed bottom-6 right-24 z-50 bg-purple text-white px-5 py-3 rounded-full shadow-xl hover:bg-purple-dark transition-all duration-300 flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Install App
        </button>
      )}

      {showIntro ? (
        <IntroSplashScreen onComplete={() => setShowIntro(false)} />
      ) : !isLoggedIn ? (
        <LandingPage
          onLogin={() => {
            setIsLoggedIn(true);
          }}
        />
      ) : (
        <div className="flex h-screen overflow-hidden bg-[#F9FAFB] dark:bg-navy-dark font-sans selection:bg-purple selection:text-white transition-colors duration-300">
          {/* Sidebar Navigation */}
          <Sidebar
            activeView={activeView}
            onViewChange={(v) => {
              setActiveView(v);
              setIsSidebarOpen(false);
            }}
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />

          {/* Overlay Backdrop for Mobile */}
          {isSidebarOpen && <div className="fixed inset-0 bg-navy/60 backdrop-blur-xs z-30 lg:hidden transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)} />}

          {/* Main Workspace */}
          <main className="flex-1 lg:ml-64 h-full overflow-y-auto w-full transition-all duration-300">
            <div className="px-4 py-6 md:px-10 md:py-10 mx-auto max-w-7xl min-h-full">
              <Header onMenuClick={() => setIsSidebarOpen(true)} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -15 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
              <AiChat />
            </div>
          </main>
        </div>
      )}
    </>
  );
}
