import { AppData } from "./types";

export const STORAGE_KEY = "sugar_reduce_data_v1";

const now = new Date();
const day = 24 * 60 * 60 * 1000;

const seededLogs = [
  {
    id: "seed-1",
    whatAte: "שוקולד קטן",
    time: new Date(now.getTime() - day * 1 + 1000 * 60 * 60 * 10).toISOString(),
    reason: "stress",
    cravingLevel: 4,
    physicallyHungry: false,
  },
  {
    id: "seed-2",
    whatAte: "עוגייה",
    time: new Date(now.getTime() - day * 2 + 1000 * 60 * 60 * 16).toISOString(),
    reason: "habit",
    cravingLevel: 3,
    physicallyHungry: false,
  },
  {
    id: "seed-3",
    whatAte: "גלידה",
    time: new Date(now.getTime() - day * 4 + 1000 * 60 * 60 * 14).toISOString(),
    reason: "social",
    cravingLevel: 2,
    physicallyHungry: false,
  },
  {
    id: "seed-4",
    whatAte: "סוכריה",
    time: new Date(now.getTime() - 1000 * 60 * 60 * 3).toISOString(),
    reason: "boredom",
    cravingLevel: 2,
    physicallyHungry: false,
  },
] as AppData["logs"];

export const seedData: AppData = {
  weeklyGoal: 9,
  logs: seededLogs,
};

export function loadData(): AppData {
  if (typeof window === "undefined") {
    return seedData;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }

  try {
    return JSON.parse(raw) as AppData;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }
}

export function saveData(data: AppData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
