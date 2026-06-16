import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_TASKS, MOCK_HABITS, Task, Habit } from '../data/mockData';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

type FeedbackStatus = 'idle' | 'loading' | 'success' | 'error';
interface FeedbackState {
  status: FeedbackStatus;
  message: string;
}

interface AppContextType {
  tasks: Task[];
  habits: Habit[];
  theme: 'light' | 'dark';
  feedback: FeedbackState;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  updateTask: (id: string, updatedData: Partial<Task>) => Promise<void>; // <-- DITAMBAHKAN
  deleteTask: (id: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id'>) => Promise<void>;
  toggleHabitForToday: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  executeWithFeedback: (action: () => void | Promise<void>, successMessage: string) => Promise<void>;
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
  saveProfileToDb: (first: string, last: string, pic: string, occ: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Test Connection on Boot to satisfy constraints
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedback, setFeedback] = useState<FeedbackState>({ status: 'idle', message: '' });
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [profilePic, setProfilePic] = useState<string>("https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent");
  const [firstName, setFirstName] = useState<string>("Student");
  const [lastName, setLastName] = useState<string>("User");
  const [occupation, setOccupation] = useState<string>("University Student");

  const executeWithFeedback = useCallback(async (action: () => void | Promise<void>, successMessage: string) => {
    setFeedback({ status: 'loading', message: '' });
    try {
      await action();
      setFeedback({ status: 'success', message: successMessage });
      setTimeout(() => setFeedback({ status: 'idle', message: '' }), 2000);
    } catch (e: any) {
      setFeedback({ status: 'error', message: e.message || 'Telah terjadi kesalahan.' });
      setTimeout(() => setFeedback({ status: 'idle', message: '' }), 3000);
    }
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('heyjipro_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('heyjipro_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Track Auth State Change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Tasks, Habits and Profile for Authenticated User
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setHabits([]);
      setProfilePic("https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent");
      setFirstName("Student");
      setLastName("User");
      setOccupation("University Student");
      return;
    }

    // Real-time listener for the user profile document
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.firstName) setFirstName(data.firstName);
        if (data.lastName) setLastName(data.lastName);
        if (data.profilePic) setProfilePic(data.profilePic);
        if (data.occupation) setOccupation(data.occupation);
      } else {
        let fallbackFirst = 'Student';
        let fallbackLast = 'User';
        if (user.displayName) {
          const parts = user.displayName.split(' ');
          fallbackFirst = parts[0] || 'Student';
          fallbackLast = parts.slice(1).join(' ') || 'User';
        }
        setFirstName(fallbackFirst);
        setLastName(fallbackLast);
        setProfilePic(user.photoURL || "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent");
        setOccupation("University Student");
      }
    });

    const tasksPathName = `users/${user.uid}/tasks`;
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    
    // Real-time listener for Tasks
    const unsubscribeTasks = onSnapshot(tasksRef, (snapshot) => {
      const taskList: Task[] = [];
      snapshot.forEach((docSnap) => {
        taskList.push(docSnap.data() as Task);
      });

      // Onboarding: If user has no tasks yet, seed database with default tasks
      if (snapshot.empty) {
        const batch = writeBatch(db);
        MOCK_TASKS.forEach((t) => {
          const tDoc = doc(tasksRef, t.id);
          batch.set(tDoc, {
            ...t,
            createdAt: new Date().toISOString()
          });
        });
        batch.commit().catch(e => {
          console.error("Error seeding tasks:", e);
        });
      } else {
        setTasks(taskList);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, tasksPathName);
    });

    const habitsPathName = `users/${user.uid}/habits`;
    const habitsRef = collection(db, 'users', user.uid, 'habits');

    // Real-time listener for Habits
    const unsubscribeHabits = onSnapshot(habitsRef, (snapshot) => {
      const habitList: Habit[] = [];
      snapshot.forEach((docSnap) => {
        habitList.push(docSnap.data() as Habit);
      });

      // Onboarding: If user has no habits yet, seed database with default habits
      if (snapshot.empty) {
        const batch = writeBatch(db);
        MOCK_HABITS.forEach((h) => {
          const hDoc = doc(habitsRef, h.id);
          batch.set(hDoc, {
            ...h,
            createdAt: new Date().toISOString()
          });
        });
        batch.commit().catch(e => {
          console.error("Error seeding habits:", e);
        });
      } else {
        setHabits(habitList);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, habitsPathName);
    });

    return () => {
      unsubscribeUser();
      unsubscribeTasks();
      unsubscribeHabits();
    };
  }, [user]);

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!user) throw new Error('User tidak terautentikasi.');
    const path = `users/${user.uid}/tasks`;
    await executeWithFeedback(async () => {
      try {
        const tasksRef = collection(db, 'users', user.uid, 'tasks');
        const taskDoc = doc(tasksRef);
        const newTask: Task = {
          ...task,
          id: taskDoc.id
        };
        await setDoc(taskDoc, newTask);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }, 'Tugas ditambahkan');
  };

  const toggleTask = async (id: string) => {
    if (!user) throw new Error('User tidak terautentikasi.');
    const path = `users/${user.uid}/tasks/${id}`;
    await executeWithFeedback(async () => {
      try {
        const taskObj = tasks.find(t => t.id === id);
        if (!taskObj) return;
        const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
        await updateDoc(taskDocRef, { completed: !taskObj.completed });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }, 'Status tugas diperbarui');
  };

  // --- FUNGSI UPDATE TASK BARU DITAMBAHKAN DI SINI ---
  const updateTask = async (id: string, updatedData: Partial<Task>) => {
    if (!user) throw new Error('User tidak terautentikasi.');
    const path = `users/${user.uid}/tasks/${id}`;
    
    await executeWithFeedback(async () => {
      try {
        const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
        await updateDoc(taskDocRef, updatedData);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }, 'Tugas berhasil diperbarui');
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error('User tidak terautentikasi.');
    const path = `users/${user.uid}/tasks/${id}`;
    await executeWithFeedback(async () => {
      try {
        const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
        await deleteDoc(taskDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }, 'Tugas dihapus');
  };

  const addHabit = async (habit: Omit<Habit, 'id'>) => {
    if (!user) throw new Error('User tidak terautentikasi.');
    const path = `users/${user.uid}/habits`;
    await executeWithFeedback(async () => {
      try {
        const habitsRef = collection(db, 'users', user.uid, 'habits');
        const habitDoc = doc(habitsRef);
        const newHabit: Habit = {
          ...habit,
          id: habitDoc.id
        };
        await setDoc(habitDoc, newHabit);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }, 'Habit ditambahkan');
  };

  const toggleHabitForToday = async (id: string) => {
    if (!user) throw new Error('User tidak terautentikasi.');
    const path = `users/${user.uid}/habits/${id}`;
    await executeWithFeedback(async () => {
      try {
        const habitObj = habits.find(h => h.id === id);
        if (!habitObj) return;
        const today = new Date().toISOString().split('T')[0];
        const habitDocRef = doc(db, 'users', user.uid, 'habits', id);
        if (habitObj.lastCompletedDate === today) {
          await updateDoc(habitDocRef, { 
            progress: Math.max(0, habitObj.progress - 1), 
            lastCompletedDate: "" 
          });
        } else {
          await updateDoc(habitDocRef, { 
            progress: habitObj.progress + 1, 
            lastCompletedDate: today 
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }, 'Habit diperbarui');
  };

  const deleteHabit = async (id: string) => {
    if (!user) throw new Error('User tidak terautentikasi.');
    const path = `users/${user.uid}/habits/${id}`;
    await executeWithFeedback(async () => {
      try {
        const habitDocRef = doc(db, 'users', user.uid, 'habits', id);
        await deleteDoc(habitDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, path);
      }
    }, 'Habit dihapus');
  };

  const saveProfileToDb = async (first: string, last: string, pic: string, occ: string) => {
    if (!user) throw new Error('User tidak terautentikasi.');
    const path = `users/${user.uid}`;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        firstName: first,
        lastName: last,
        profilePic: pic,
        occupation: occ,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  return (
    <AppContext.Provider value={{
      tasks, habits, theme, feedback, toggleTheme, setTheme, 
      addTask, toggleTask, updateTask, deleteTask, // <-- UPDATE TASK DI-EXPORT DI SINI
      addHabit, toggleHabitForToday, deleteHabit, executeWithFeedback, user, authLoading,
      profilePic, setProfilePic, firstName, setFirstName, lastName, setLastName, occupation, setOccupation, saveProfileToDb
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};