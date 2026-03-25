import { FormEvent, useState } from "react";
import Card from "./Card";

type SettingsScreenProps = {
  dailyGoal: number;
  weeklyGoal: number;
  onSave: (goals: { dailyGoal: number; weeklyGoal: number }) => void;
};

export default function SettingsScreen({ dailyGoal, weeklyGoal, onSave }: SettingsScreenProps) {
  const [daily, setDaily] = useState(dailyGoal);
  const [weekly, setWeekly] = useState(weeklyGoal);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave({
      dailyGoal: Math.max(1, daily),
      weeklyGoal: Math.max(1, weekly),
    });
  };

  return (
    <Card title="הגדרות יעדים">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-1.5 block text-slate-600">יעד יומי (ממתקים ליום)</span>
          <input
            type="number"
            min={1}
            value={daily}
            onChange={(event) => setDaily(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-slate-600">יעד שבועי (ממתקים לשבוע)</span>
          <input
            type="number"
            min={1}
            value={weekly}
            onChange={(event) => setWeekly(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
          />
        </label>

        <button className="w-full rounded-xl bg-mint-500 px-4 py-3 font-semibold text-white">שמירת יעדים</button>
      </form>
    </Card>
  );
}
