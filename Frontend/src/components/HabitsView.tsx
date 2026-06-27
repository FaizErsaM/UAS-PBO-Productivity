import React, { useState, useEffect } from "react";
import { Card } from "./Card";
import { Target, Plus, Trash2, CheckCircle, XCircle, X } from "lucide-react";
import { Modal } from "./Modal";
import { useAppContext } from "../context/AppContext";

interface Habit {
  id: string;
  userId: string;
  habitName: string;
  targetPeriod: number;
  currentStreak: number;
  createdAt: string;
  lastCompletedDate?: string;
}

interface Notification {
  message: string;
  type: "success" | "error" | "warning";
}

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8081/api"}/habits`;

export const HabitsView = () => {
  const { user, setHabits: setContextHabits } = useAppContext();
  const userId = user?.id ?? "00000000-0000-0000-0000-000000000001";
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"manual" | "ai">("ai");

  const [habitName, setHabitName] = useState("");
  const [targetPeriod, setTargetPeriod] = useState(30);

  const [aiGoal, setAiGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const [notification, setNotification] = useState<Notification | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchHabits();
  }, [userId]);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/${userId}`);
      const data = await response.json();
      setHabits(data);
      setContextHabits(data); // sync ke AppContext
    } catch (error) {
      console.error("Gagal mengambil data habits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddManualHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    try {
      const response = await fetch(`${API_URL}/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          habitName: habitName,
          targetPeriod: targetPeriod,
        }),
      });
      if (response.ok) {
        await fetchHabits(); // ini juga sync ke AppContext
        setIsModalOpen(false);
        setHabitName("");
        setTargetPeriod(30);
        showNotification("Habit berhasil ditambahkan! 🎯", "success");
      }
    } catch (error) {
      console.error("Gagal membuat habit:", error);
      showNotification("Gagal membuat habit. Coba lagi!", "error");
    }
  };

  const handleGetAiSuggestion = async () => {
    if (!aiGoal.trim()) return;
    setIsGenerating(true);
    setAiSuggestion("");
    try {
      const response = await fetch(`${API_URL}/ai-suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userGoal: aiGoal }),
      });
      const data = await response.json();
      setAiSuggestion(data.suggestedHabit);
    } catch (error) {
      console.error("Gagal mendapat saran AI:", error);
      showNotification("Gagal mendapat saran AI. Coba lagi!", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAiHabit = async () => {
    if (!aiSuggestion) return;
    try {
      const response = await fetch(`${API_URL}/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          habitName: aiSuggestion,
          targetPeriod: 30,
        }),
      });
      if (response.ok) {
        await fetchHabits(); // ini juga sync ke AppContext
        setIsModalOpen(false);
        setAiGoal("");
        setAiSuggestion("");
        showNotification("Habit dari AI berhasil ditambahkan! 🤖", "success");
      }
    } catch (error) {
      console.error("Gagal menambah habit dari AI:", error);
      showNotification("Gagal menambah habit. Coba lagi!", "error");
    }
  };

  const handleMarkDone = async (habitId: string) => {
    try {
      const response = await fetch(`${API_URL}/${habitId}/done`, {
        method: "POST",
      });
      if (response.ok) {
        await fetchHabits(); // ini juga sync ke AppContext
        showNotification("Check-in berhasil! Streak bertambah 🔥", "success");
      } else {
        const error = await response.json();
        showNotification(error.message, "warning");
      }
    } catch (error) {
      console.error("Gagal mark as done:", error);
      showNotification("Gagal check-in. Coba lagi!", "error");
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    setDeleteConfirm(habitId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const response = await fetch(`${API_URL}/${deleteConfirm}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchHabits(); // ini juga sync ke AppContext
        showNotification("Habit berhasil dihapus!", "success");
      }
    } catch (error) {
      console.error("Gagal hapus habit:", error);
      showNotification("Gagal hapus habit. Coba lagi!", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : notification.type === "error"
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {notification.type === "success" && (
            <CheckCircle className="w-4 h-4 shrink-0" />
          )}
          {notification.type === "error" && (
            <XCircle className="w-4 h-4 shrink-0" />
          )}
          {notification.type === "warning" && (
            <XCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-1 opacity-60 hover:opacity-100"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="font-semibold text-navy">Hapus Habit?</h3>
            </div>
            <p className="text-sm text-slate-500 mb-5">
              Habit dan semua data check-in akan dihapus permanen. Tidak bisa dikembalikan!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 text-sm font-medium text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy">Habit Tracker</h2>
        <button
          onClick={() => { setIsModalOpen(true); setModalTab("ai"); }}
          className="px-4 py-2 text-sm bg-purple text-white rounded-xl shadow-sm hover:bg-purple-light transition-colors font-medium"
        >
          + New Habit
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-slate-400 py-12">Memuat habits...</p>
      ) : habits.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-purple/10 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-purple" />
          </div>
          <h3 className="font-semibold text-navy mb-1">Belum ada habit</h3>
          <p className="text-sm text-slate-400 mb-4">
            Mulai bangun kebiasaan positifmu sekarang!
          </p>
          <button
            onClick={() => { setIsModalOpen(true); setModalTab("ai"); }}
            className="px-4 py-2 text-sm bg-purple text-white rounded-xl shadow-sm hover:bg-purple-light transition-colors font-medium"
          >
            + Buat Habit Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {habits.map((habit) => {
            const percent = Math.min(
              100,
              Math.round((habit.currentStreak / habit.targetPeriod) * 100),
            );
            return (
              <Card key={habit.id} className="flex flex-col relative group">
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="absolute top-3 right-3 p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-500 rounded-lg hover:bg-rose-50"
                  title="Hapus habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-purple/10 flex items-center justify-center text-purple">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-navy leading-relaxed pt-1.5 pr-6">
                    {habit.habitName}
                  </h3>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-center text-sm font-medium mb-2">
                    <span className="text-slate-500">Streak</span>
                    <span className="text-navy font-semibold">
                      {habit.currentStreak} / {habit.targetPeriod} hari
                    </span>
                  </div>

                  <button
                    onClick={() => handleMarkDone(habit.id)}
                    className="w-full py-2 flex items-center justify-center gap-2 bg-purple text-white rounded-xl font-medium text-sm transition-colors hover:bg-purple-light mb-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Mark as Done Today
                  </button>

                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div
                      style={{ width: `${percent}%` }}
                      className={`h-full ${percent >= 100 ? "bg-emerald-500" : "bg-purple"} transition-all duration-300`}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Habit Baru"
      >
        <div className="flex border-b border-slate-200 mb-6">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${modalTab === "ai" ? "text-purple border-b-2 border-purple" : "text-slate-500"}`}
            onClick={() => setModalTab("ai")}
          >
            AI Assistant
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${modalTab === "manual" ? "text-purple border-b-2 border-purple" : "text-slate-500"}`}
            onClick={() => setModalTab("manual")}
          >
            Manual Entry
          </button>
        </div>

        {modalTab === "manual" ? (
          <form onSubmit={handleAddManualHabit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nama Habit *
              </label>
              <input
                required
                autoFocus
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder="contoh: Baca buku 30 menit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Target (Hari) *
              </label>
              <input
                required
                type="number"
                min="1"
                max="31"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50"
                value={targetPeriod}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setTargetPeriod(Math.min(31, Math.max(1, val)));
                }}
              />
              {targetPeriod > 31 && (
                <p className="text-xs text-rose-500 mt-1">Maksimal 31 hari</p>
              )}
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-purple text-white rounded-xl"
              >
                Buat Habit
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Apa yang ingin kamu capai?
              </label>
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/50"
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGetAiSuggestion()}
                  placeholder="contoh: Saya ingin jadi software engineer"
                />
                <button
                  type="button"
                  onClick={handleGetAiSuggestion}
                  disabled={isGenerating || !aiGoal.trim()}
                  className="px-4 py-2 text-sm bg-slate-900 text-white rounded-xl disabled:opacity-50"
                >
                  {isGenerating ? "Loading..." : "Generate"}
                </button>
              </div>
            </div>

            {aiSuggestion && (
              <div className="p-4 bg-purple/5 border border-purple/20 rounded-xl">
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Saran AI:
                </p>
                <p className="text-navy font-semibold">{aiSuggestion}</p>
                <button
                  onClick={handleAddAiHabit}
                  className="mt-3 w-full py-2 text-sm bg-purple text-white rounded-xl hover:bg-purple-light transition-colors"
                >
                  + Tambah Habit Ini
                </button>
              </div>
            )}

            <div className="pt-4 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-slate-600"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};