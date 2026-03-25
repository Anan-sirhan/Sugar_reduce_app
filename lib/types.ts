export type SweetReason = "hunger" | "stress" | "boredom" | "habit" | "social";

export type SweetLog = {
  id: string;
  whatAte: string;
  time: string;
  reason: SweetReason;
  cravingLevel: 1 | 2 | 3 | 4 | 5;
  physicallyHungry: boolean;
};

export type AppData = {
  dailyGoal: number;
  weeklyGoal: number;
  logs: SweetLog[];
};
