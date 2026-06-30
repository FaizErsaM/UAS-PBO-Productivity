import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { MOCK_TASKS, MOCK_HABITS, Task, Habit } from "../data/mockData";

// URL Backend Spring Boot Pangeran
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8081/api"}`;

// Interface lokal User tiruan untuk menggantikan tipe Supabase lama
interface AppUser {
  id: string;
  username: string;
  email: string;
}

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
  addTask: (task: Omit<Task, "id">, file?: File | null) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  updateTask: (
    id: string,
    updatedData: Partial<Task>,
    file?: File | null,
    removeFile?: boolean,
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getAttachmentUrl: (taskId: string) => string;
  sendTestEmail: (
    taskId: string,
    type: "approaching" | "overdue",
  ) => Promise<{
    sent: boolean;
    recipient?: string;
    subject?: string;
    error?: string;
  }>;
  clearNotificationLog: (taskId: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, "id">) => Promise<void>;
  toggleHabitForToday: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  setHabits: (habits: Habit[]) => void;
  executeWithFeedback: (
    action: () => void | Promise<void>,
    successMessage: string,
  ) => Promise<void>;
  user: AppUser | null;
  authLoading: boolean;
  loginUser: (token: string, userData: AppUser) => void; // Fungsi tambahan untuk login handler
  logoutUser: () => void; // Fungsi tambahan untuk logout handler
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
  getSettingGrid: () => Promise<any[]>;
  saveGridToDb: (newGridItems: any[]) => Promise<void>;
  getAuthHeadersForFormData: () => HeadersInit;
  updateGridItemInDb: (
    itemId: string,
    updatedItemData: { label: string; value: string; iconName: string },
  ) => Promise<void>;
  deleteGridItemFromDb: (itemId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Backend (TaskModel) mengirim field attachment yang FLAT:
 *   attachmentOriginalName, attachmentStoredName, attachmentContentType, attachmentSize
 * Sedangkan frontend (Task interface di mockData.ts) expect nested object:
 *   task.attachment = { originalName, contentType, size }
 *
 * Helper ini menormalisasi response backend supaya UI bisa baca task.attachment.
 * Pure function, gak butuh React state.
 */
const normalizeTaskAttachment = (t: any): Task => {
  const {
    attachmentStoredName,
    attachmentOriginalName,
    attachmentContentType,
    attachmentSize,
    ...rest
  } = t;
  return {
    ...rest,
    attachment: attachmentStoredName
      ? {
          originalName: attachmentOriginalName,
          contentType: attachmentContentType,
          size: attachmentSize,
        }
      : undefined,
  } as Task;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [feedback, setFeedback] = useState<FeedbackState>({
    status: "idle",
    message: "",
  });
  const [user, setUser] = useState<AppUser | null>(null);
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

  // Fungsi pembantu untuk membuat authorization header berisi token JWT
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("heyjipro_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  // Sama seperti getAuthHeaders, tapi TANPA Content-Type.
  // Dipakai untuk multipart/form-data — browser yang set boundary otomatis.
  const getAuthHeadersForFormData = useCallback((): HeadersInit => {
    const token = localStorage.getItem("heyjipro_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // URL download dokumen task
  const getAttachmentUrl = useCallback(
    (taskId: string) => `${API_BASE_URL}/tasks/${taskId}/attachment`,
    [],
  );

  // Kirim email notifikasi test untuk task tertentu. BYPASS guard backend.
  // Return { sent, recipient, subject, error? }.
  const sendTestEmail = useCallback(
    async (taskId: string, type: "approaching" | "overdue") => {
      const res = await fetch(
        `${API_BASE_URL}/notifications/test-email/${taskId}?type=${type}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        },
      );
      if (!res.ok) throw new Error("Gagal kirim test email");
      return res.json();
    },
    [getAuthHeaders],
  );

  // Hapus notification log untuk task supaya bisa di-notify ulang.
  const clearNotificationLog = useCallback(
    async (taskId: string) => {
      await fetch(`${API_BASE_URL}/notifications/log/${taskId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    },
    [getAuthHeaders],
  );

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

  // 1. Sinkronisasi Sesi Lokal JWT (Menggantikan Supabase Auth Listener)
  useEffect(() => {
    const storedUser = localStorage.getItem("heyjipro_user");
    const storedToken = localStorage.getItem("heyjipro_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);
  }, []);

  // Fungsi yang dipanggil saat halaman login Anda sukses menerima token dari backend
  const loginUser = (token: string, userData: AppUser) => {
    localStorage.setItem("heyjipro_token", token);
    localStorage.setItem("heyjipro_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("heyjipro_token");
    localStorage.removeItem("heyjipro_user");
    setUser(null);
  };

  // 2. Fetch Data dari Spring Boot Backend dengan header JWT
  const fetchDataFromBackend = useCallback(async () => {
    if (!user) return;
    try {
      const headers = getAuthHeaders();
      const [tasksRes, habitsRes, profileRes] = await Promise.all([
        fetch(`${API_BASE_URL}/tasks/user/${user.id}`, { headers }),
        fetch(`${API_BASE_URL}/habits/user/${user.id}`, { headers }),
        fetch(`${API_BASE_URL}/settings/${user.id}`, { headers }),
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        const normalized = tasksData.map((t: any) =>
          normalizeTaskAttachment(t),
        );
        setTasks(normalized);
      }
      if (habitsRes.ok) {
        const habitsData = await habitsRes.json();
        setHabits(habitsData);
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
  }, [user, getAuthHeaders]);

  useEffect(() => {
    if (user) {
      fetchDataFromBackend();
    } else {
      setTasks([]);
      setHabits([]);
      setFirstName("");
      setLastName("");
    }
  }, [user, fetchDataFromBackend]);

  // 3. Operasi CRUD yang disematkan Header Keamanan
  const addTask = async (task: Omit<Task, "id">, file: File | null = null) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const formData = new FormData();
      // part "task" sebagai JSON blob
      formData.append(
        "task",
        new Blob([JSON.stringify({ ...task, userId: user.id })], {
          type: "application/json",
        }),
      );
      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeadersForFormData(),
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Gagal menyimpan tugas ke server");
      }

      const newTask = await response.json();
      setTasks((prev) => [...prev, normalizeTaskAttachment(newTask)]);
    }, "Tugas ditambahkan");
  };

  const updateTask = async (
    id: string,
    updatedData: Partial<Task>,
    file: File | null = null,
    removeFile: boolean = false,
  ) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const formData = new FormData();
      formData.append(
        "task",
        new Blob([JSON.stringify(updatedData)], { type: "application/json" }),
      );
      if (file) {
        formData.append("file", file);
      }

      const url = new URL(`${API_BASE_URL}/tasks/${id}`);
      if (removeFile) {
        url.searchParams.set("removeFile", "true");
      }

      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: getAuthHeadersForFormData(),
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Gagal memperbarui tugas");
      }

      const updated = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? normalizeTaskAttachment(updated) : t)),
      );
    }, "Tugas berhasil diperbarui");
  };

  const toggleTask = async (id: string) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Gagal memperbarui status tugas");

      const updated = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? normalizeTaskAttachment(updated) : t)),
      );
    }, "Status tugas diperbarui");
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Gagal menghapus tugas");

      setTasks((prev) => prev.filter((t) => t.id !== id));
    }, "Tugas dihapus");
  };

  const addHabit = async (habit: Omit<Habit, "id">) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/habits/manual`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: user.id,
          habitName: (habit as any).habitName,
          targetPeriod: (habit as any).targetPeriod ?? 30,
        }),
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

    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/habits/${id}/done`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Gagal memperbarui habit");
      }

      setHabits((prev) =>
        prev.map((h) =>
          h.id === id
            ? {
                ...h,
                currentStreak: h.currentStreak + 1,
                lastCompletedDate: new Date().toISOString().split("T")[0],
              }
            : h,
        ),
      );
    }, "Habit diperbarui");
  };

  const deleteHabit = async (id: string) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/habits/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
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
      const response = await fetch(
        `${API_BASE_URL}/settings/profile/${user.id}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok) throw new Error("Gagal menyimpan profil");

      setFirstName(first);
      setLastName(last);
      setProfilePic(pic);
      setOccupation(occ);
    }, "Profil berhasil disimpan");
  };

  // 1. Ambil data grid secara spesifik
  const getSettingGrid = useCallback(async () => {
    if (!user) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/settings/grid/${user.id}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Gagal mengambil data grid:", error);
    }
    return [];
  }, [user, getAuthHeaders]);

  // 2. Simpan/Menimpa Massal Daftar Grid (POST)
  const saveGridToDb = async (newGridItems: any[]) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(`${API_BASE_URL}/settings/grid/${user.id}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newGridItems), // Mengirimkan Array List utuh
      });

      if (!response.ok)
        throw new Error("Gagal memperbarui susunan grid profil");
    }, "Susunan informasi grid berhasil disimpan!");
  };

  // 3. Mengubah Satu Item Grid Spesifik (PUT)
  const updateGridItemInDb = async (
    itemId: string,
    updatedItemData: { label: string; value: string; iconName: string },
  ) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(
        `${API_BASE_URL}/settings/grid/item/${user.id}/${itemId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(updatedItemData),
        },
      );

      if (!response.ok) throw new Error("Gagal mengubah item grid");
    }, "Item grid berhasil diperbarui!");
  };

  // 4. Menghapus Satu Item Grid Spesifik (DELETE)
  const deleteGridItemFromDb = async (itemId: string) => {
    if (!user) throw new Error("User tidak terautentikasi.");
    await executeWithFeedback(async () => {
      const response = await fetch(
        `${API_BASE_URL}/settings/grid/item/${user.id}/${itemId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        },
      );

      if (!response.ok) throw new Error("Gagal menghapus item grid");
    }, "Item grid berhasil dihapus!");
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
        getAttachmentUrl,
        sendTestEmail,
        clearNotificationLog,
        addHabit,
        toggleHabitForToday,
        deleteHabit,
        setHabits,
        executeWithFeedback,
        user,
        authLoading,
        loginUser,
        logoutUser,
        profilePic,
        setProfilePic,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        occupation,
        setOccupation,
        saveProfileToDb,
        getSettingGrid,
        getAuthHeadersForFormData,
        saveGridToDb,
        updateGridItemInDb,
        deleteGridItemFromDb,
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
