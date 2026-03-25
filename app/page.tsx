"use client";

import { useEffect, useMemo, useState } from "react";
import CravingHelperScreen from "@/components/CravingHelperScreen";
import HomeScreen from "@/components/HomeScreen";
import InsightsScreen from "@/components/InsightsScreen";
import QuickLogForm from "@/components/QuickLogForm";
import { getLast7DayKeys, hourFromIsoTime, toDayKey } from "@/lib/date";
import { loadData, saveData } from "@/lib/storage";
import { AppData, SweetLog, SweetReason } from "@/lib/types";

type View = "home" | "log" | "insights" | "craving";

const reasonText: Record<SweetReason, string> = {
  hunger: "רעב",
  stress: "לחץ",
  boredom: "שעמום",
  habit: "הרגל",
  social: "חברתי",
};

export default function Page() {
  const [data, setData] = useState<AppData | null>(null);
  const [view, setView] = useState<View>("home");

  useEffect(() => {
    setData(loadData());
  }, []);

  useEffect(() => {
    if (!data) return;
    saveData(data);
  }, [data]);

  const metrics = useMemo(() => {
    if (!data) {
      return null;
    }

    const today = toDayKey(new Date());
    const logsByDay = new Map<string, SweetLog[]>();

    data.logs.forEach((log) => {
      const day = toDayKey(new Date(log.time));
      const list = logsByDay.get(day) ?? [];
      list.push(log);
      logsByDay.set(day, list);
    });

    const last7 = getLast7DayKeys();
    const weeklyCount = last7.reduce((sum, day) => sum + (logsByDay.get(day)?.length ?? 0), 0);
    const todayCount = logsByDay.get(today)?.length ?? 0;

    const reasonCounter = new Map<SweetReason, number>();
    const hourCounter = new Map<number, number>();

    data.logs.forEach((log) => {
      reasonCounter.set(log.reason, (reasonCounter.get(log.reason) ?? 0) + 1);
      const hour = hourFromIsoTime(log.time);
      hourCounter.set(hour, (hourCounter.get(hour) ?? 0) + 1);
    });

    const mostCommonTrigger = [...reasonCounter.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "habit";
    const mostCommonHour = [...hourCounter.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

    const perDayGoal = Math.max(1, Math.floor(data.weeklyGoal / 7));
    let streak = 0;
    for (let i = last7.length - 1; i >= 0; i -= 1) {
      const count = logsByDay.get(last7[i])?.length ?? 0;
      if (count <= perDayGoal) {
        streak += 1;
      } else {
        break;
      }
    }

    const dailyCounts = last7.map((day) => {
      const date = new Date(day);
      return {
        dayLabel: date.toLocaleDateString("he-IL", { weekday: "short" }),
        count: logsByDay.get(day)?.length ?? 0,
      };
    });

    return {
      todayCount,
      weeklyCount,
      mostCommonTrigger: reasonText[mostCommonTrigger],
      mostCommonHour: mostCommonHour === undefined ? "—" : `${String(mostCommonHour).padStart(2, "0")}:00`,
      streakUnderGoal: streak,
      dailyCounts,
    };
  }, [data]);

  if (!data || !metrics) {
    return <main className="mx-auto min-h-dvh max-w-md p-4">טוען...</main>;
  }

  const addLog = (values: {
    whatAte: string;
    time: string;
    reason: SweetReason;
    cravingLevel: 1 | 2 | 3 | 4 | 5;
    physicallyHungry: boolean;
  }) => {
    const newLog: SweetLog = {
      id: crypto.randomUUID(),
      whatAte: values.whatAte,
      time: new Date(values.time).toISOString(),
      reason: values.reason,
      cravingLevel: values.cravingLevel,
      physicallyHungry: values.physicallyHungry,
    };

    setData((prev) => (prev ? { ...prev, logs: [newLog, ...prev.logs] } : prev));
    setView("home");
  };

  return (
    <main className="mx-auto min-h-dvh max-w-md space-y-4 p-4">
      <header className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h1 className="text-xl font-bold text-slate-800">איזון מתוק</h1>
        <p className="text-sm text-slate-500">צעדים קטנים, קצב שמתאים לך.</p>
      </header>

      <nav className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-2 ring-1 ring-slate-100">
        <button
          onClick={() => setView("home")}
          className={`rounded-xl py-2 text-sm ${view === "home" ? "bg-mint-500 text-white" : "text-slate-600"}`}
        >
          בית
        </button>
        <button
          onClick={() => setView("insights")}
          className={`rounded-xl py-2 text-sm ${view === "insights" ? "bg-mint-500 text-white" : "text-slate-600"}`}
        >
          תובנות
        </button>
        <button
          onClick={() => setView("craving")}
          className={`rounded-xl py-2 text-sm ${view === "craving" ? "bg-mint-500 text-white" : "text-slate-600"}`}
        >
          עזרה לחשק
        </button>
      </nav>

      {view === "home" && (
        <HomeScreen
          todayCount={metrics.todayCount}
          weeklyGoal={data.weeklyGoal}
          weeklyCount={metrics.weeklyCount}
          onQuickAdd={() => setView("log")}
          onCravingHelp={() => setView("craving")}
        />
      )}

      {view === "log" && (
        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
          <h2 className="mb-3 text-base font-semibold text-slate-700">רישום מהיר</h2>
          <QuickLogForm onSubmit={addLog} />
        </section>
      )}

      {view === "insights" && (
        <InsightsScreen
          mostCommonTrigger={metrics.mostCommonTrigger}
          mostCommonHour={metrics.mostCommonHour}
          streakUnderGoal={metrics.streakUnderGoal}
          dailyCounts={metrics.dailyCounts}
        />
      )}

      {view === "craving" && <CravingHelperScreen />}
    </main>
  );
}
