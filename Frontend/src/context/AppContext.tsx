import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { MOCK_TASKS, MOCK_HABITS, Task, Habit } from "../data/mockData";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// URL Backend Spring Boot Pangeran
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8081"}/api`;

type FeedbackStatus = "idle" | "loading" | "success" | "error";
interface FeedbackState {
  status: FeedbackStatus;
  message: string;
}

interface AppContextType {
  tasks: Task[];
  habits: Habit[];
  theme: "light" | "dark";
  feedback: FeedbackState;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  updateTask: (id: string, updatedData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, "id">) => Promise<void>;
  toggleHabitForToday: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  executeWithFeedback: (
    action: () => void | Promise<void>,
    successMessage: string,
  ) => Promise<void>;
  user: User | null;
  authLoading: boolean;
  profilePic: string;
  setProfilePic: (url: string) => void;
  firstName: string;
  setFirstName: (name: string) => void;
  lastName: string;
  setLastName: (name: string) => void;
  occupation: string;
  setOccupation: (occ: string) => void;
  saveProfileToDb: (
    first: string,
    last: string,
    pic: string,
    occ: string,
  ) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [feedback, setFeedback] = useState<FeedbackState>({
    status: "idle",
    message: "",
  });
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  // State Profil
  const [profilePic, setProfilePic] = useState<string>(
    "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent",
  );
  const [firstName, setFirstName] = useState<string>("Student");
  const [lastName, setLastName] = useState<string>("User");
  const [occupation, setOccupation] = useState<string>("University Student");

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (
      (localStorage.getItem("heyjipro_theme") as "light" | "dark") || "light"
    );
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("heyjipro_theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const executeWithFeedback = useCallback(
    async (action: () => void | Promise<void>, successMessage: string) => {
      setFeedback({ status: "loading", message: "" });
      try {
        await action();
        setFeedback({ status: "success", message: successMessage });
        setTimeout(() => setFeedback({ status: "idle", message: "" }), 2000);
      } catch (e: any) {
        setFeedback({
          status: "error",
          message: e.message || "Telah terjadi kesalahan.",
        });
        setTimeout(() => setFeedback({ status: "idle", message: "" }), 3000);
      }
    },
    [],
  );

  // 1. Integrasi Supabase Auth
  useEffect(() => {
    // Ambil sesi awal saat aplikasi dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Dengarkan perubahan login/logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Data dari Spring Boot Backend (Menggantikan onSnapshot)
  const fetchDataFromBackend = useCallback(async () => {
    if (!user) return;
    try {
      // PERHATIAN: Pastikan teman kelompok Anda membuat endpoint GET ini di Spring Boot
      const [tasksRes, habitsRes, profileRes] = await Promise.all([
        fetch(`${API_BASE_URL}/tasks/user/${user.id}`),
        fetch(`${API_BASE_URL}/habits/user/${user.id}`),
        fetch(`${API_BASE_URL}/users/${user.id}`), // Endpoint untuk profil
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.length > 0 ? tasksData : MOCK_TASKS); // Gunakan mock jika kosong sementara
      }
      if (habitsRes.ok) {
        const habitsData = await habitsRes.json();
        setHabits(habitsData.length > 0 ? habitsData : MOCK_HABITS);
      }
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.firstName) setFirstName(profileData.firstName);
        if (profileData.lastName) setLastName(profileData.lastName);
        if (profileData.profilePic) setProfilePic(profileData.profilePic);
        if (profileData.occupation) setOccupation(profileData.occupation);
      }
    } catch (error) {
      console.error("Gagal menarik data dari backend:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDataFromBackend();
    } else {
      setTasks([]);
      setHabits([]);
      setFirstName("Student");
      setLastName("User");
    }
  }, [user, fetchDataFromBackend]);

  // 3. Modifikasi Operasi CRUD ke Spring Boot
  const addTask = async (task: Omit<Task, "id">) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, userId: user.id }),
      });
      if (!response.ok) throw new Error("Gagal menyimpan tugas ke server");

      // Update state lokal agar UI langsung berubah tanpa perlu refresh
      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);
    }, "Tugas ditambahkan");
  };

  const updateTask = async (id: string, updatedData: Partial<Task>) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Gagal memperbarui tugas");

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)),
      );
    }, "Tugas berhasil diperbarui");
  };

  const toggleTask = async (id: string) => {
    const taskObj = tasks.find((t) => t.id === id);
    if (!taskObj) return;
    await updateTask(id, { completed: !taskObj.completed });
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Gagal menghapus tugas");

      setTasks((prev) => prev.filter((t) => t.id !== id));
    }, "Tugas dihapus");
  };

  const addHabit = async (habit: Omit<Habit, "id">) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/habits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...habit, userId: user.id }),
      });
      if (!response.ok) throw new Error("Gagal menyimpan habit");

      const newHabit = await response.json();
      setHabits((prev) => [...prev, newHabit]);
    }, "Habit ditambahkan");
  };

  const toggleHabitForToday = async (id: string) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    const habitObj = habits.find((h) => h.id === id);
    if (!habitObj) return;

    const today = new Date().toISOString().split("T")[0];
    const isCompletedToday = habitObj.lastCompletedDate === today;

    const updatedData = {
      progress: isCompletedToday
        ? Math.max(0, habitObj.progress - 1)
        : habitObj.progress + 1,
      lastCompletedDate: isCompletedToday ? "" : today,
    };

    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/habits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Gagal memperbarui habit");

      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...updatedData } : h)),
      );
    }, "Habit diperbarui");
  };

  const deleteHabit = async (id: string) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/habits/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Gagal menghapus habit");

      setHabits((prev) => prev.filter((h) => h.id !== id));
    }, "Habit dihapus");
  };

  const saveProfileToDb = async (
    first: string,
    last: string,
    pic: string,
    occ: string,
  ) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const payload = {
        firstName: first,
        lastName: last,
        profilePic: pic,
        occupation: occ,
      };
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT", // Atau POST tergantung pengaturan backend tim Anda
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Gagal menyimpan profil");

      setFirstName(first);
      setLastName(last);
      setProfilePic(pic);
      setOccupation(occ);
    }, "Profil berhasil disimpan");
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        habits,
        theme,
        feedback,
        toggleTheme,
        setTheme,
        addTask,
        toggleTask,
        updateTask,
        deleteTask,
        addHabit,
        toggleHabitForToday,
        deleteHabit,
        executeWithFeedback,
        user,
        authLoading,
        profilePic,
        setProfilePic,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        occupation,
        setOccupation,
        saveProfileToDb,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
