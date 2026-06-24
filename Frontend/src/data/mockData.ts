export interface Task {
  id: string;
  title: string;
  course?: string;
  deadline: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  description?: string;
  attachment?: {
    originalName: string;
    contentType: string;
    size: number;
  };
  aiMaterials?: { title: string; type: string; link: string }[];
}

export interface Habit {
  id: string;
  habitName: string;
  targetPeriod: number;
  currentStreak: number;
  userId: string;
  createdAt: string;
  lastCompletedDate?: string;
}

// Mock Data isolated for easy replacement with backend API later
const now = new Date();
const inHours = (hours: number) =>
  new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();

export const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Final Essay: Human Computer Interaction",
    course: "CS401",
    deadline: inHours(5),
    completed: false,
    priority: "high",
  },
  {
    id: "2",
    title: "Review Chapter 5-7 for Midterm",
    course: "Database Systems",
    deadline: inHours(20),
    completed: false,
    priority: "high",
  },
  {
    id: "3",
    title: "Submit Project Proposal",
    course: "Software Engineering",
    deadline: inHours(48),
    completed: false,
    priority: "medium",
  },
  {
    id: "4",
    title: "Read Article on UX Research Methods",
    course: "CS401",
    deadline: inHours(120),
    completed: true,
    priority: "low",
  },
];

export const MOCK_HABITS: Habit[] = [
  {
    id: "h1",
    habitName: "Deep Work",
    currentStreak: 2,
    targetPeriod: 30,
    userId: "",
    createdAt: "",
  },
  {
    id: "h2",
    habitName: "Reading",
    currentStreak: 15,
    targetPeriod: 30,
    userId: "",
    createdAt: "",
  },
  {
    id: "h3",
    habitName: "Drink Water",
    currentStreak: 1,
    targetPeriod: 30,
    userId: "",
    createdAt: "",
  },
];
