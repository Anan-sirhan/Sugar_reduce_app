"use client";

import { useEffect, useMemo, useState } from "react";
import CravingHelperScreen from "@/components/CravingHelperScreen";
import HomeScreen from "@/components/HomeScreen";
import InsightsScreen from "@/components/InsightsScreen";
import LogsList from "@/components/LogsList";
import QuickLogForm from "@/components/QuickLogForm";
import SettingsScreen from "@/components/SettingsScreen";
import { getLast7DayKeys, hourFromIsoTime, toDayKey } from "@/lib/date";
import { loadData, saveData } from "@/lib/storage";
import { AppData, SweetLog, SweetReason } from "@/lib/types";

type View = "home" | "log" | "insights" | "craving" | "settings";

const reasonText: Record<SweetReason, string> = {
  hunger: "רעב",
  stress: "סטרס",
  boredom: "שעמום",
  habit: "הרגל",
  social: "אירוע חברתי",
};

export default function Page() {
  const [data, setData] = useState<AppData | null>(null);
  const [view, setView] = useState<View>("home");
  const [editingLog, setEditingLog] = useState<SweetLog | null>(null);

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

    let streak = 0;
    for (let i = last7.length - 1; i >= 0; i -= 1) {
      const count = logsByDay.get(last7[i])?.length ?? 0;
      if (count <= data.dailyGoal) {
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

  const updateLog = (values: {
    whatAte: string;
    time: string;
    reason: SweetReason;
    cravingLevel: 1 | 2 | 3 | 4 | 5;
    physicallyHungry: boolean;
  }) => {
    if (!editingLog) {
      return;
    }

    setData((prev) =>
      prev
        ? {
            ...prev,
            logs: prev.logs.map((log) =>
              log.id === editingLog.id
                ? {
                    ...log,
                    ...values,
                    time: new Date(values.time).toISOString(),
                  }
                : log,
            ),
          }
        : prev,
    );

    setEditingLog(null);
    setView("home");
  };

  const deleteLog = (id: string) => {
    setData((prev) => (prev ? { ...prev, logs: prev.logs.filter((log) => log.id !== id) } : prev));
  };

  const saveGoals = (goals: { dailyGoal: number; weeklyGoal: number }) => {
    setData((prev) => (prev ? { ...prev, ...goals } : prev));
    setView("home");
  };

  return (
    <main className="mx-auto min-h-dvh max-w-md space-y-4 px-4 pb-6 pt-5 sm:pt-6">
      <header className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <h1 className="text-xl font-bold text-slate-800">איזון מתוק</h1>
        <p className="text-sm text-slate-500">שינויים קטנים, תחושה טובה, בקצב שלך.</p>
      </header>

      <nav className="grid grid-cols-4 gap-1 rounded-2xl bg-white p-1.5 ring-1 ring-slate-100">
        <button
          onClick={() => setView("home")}
          className={`rounded-xl py-2 text-xs ${view === "home" ? "bg-mint-500 text-white" : "text-slate-600"}`}
        >
          בית
        </button>
        <button
          onClick={() => setView("insights")}
          className={`rounded-xl py-2 text-xs ${view === "insights" ? "bg-mint-500 text-white" : "text-slate-600"}`}
        >
          תובנות
        </button>
        <button
          onClick={() => setView("craving")}
          className={`rounded-xl py-2 text-xs ${view === "craving" ? "bg-mint-500 text-white" : "text-slate-600"}`}
        >
          חשק
        </button>
        <button
          onClick={() => setView("settings")}
          className={`rounded-xl py-2 text-xs ${view === "settings" ? "bg-mint-500 text-white" : "text-slate-600"}`}
        >
          יעדים
        </button>
      </nav>

      {view === "home" && (
        <>
          <HomeScreen
            todayCount={metrics.todayCount}
            dailyGoal={data.dailyGoal}
            weeklyGoal={data.weeklyGoal}
            weeklyCount={metrics.weeklyCount}
            onQuickAdd={() => {
              setEditingLog(null);
              setView("log");
            }}
            onCravingHelp={() => setView("craving")}
          />
          <LogsList
            logs={data.logs}
            onEdit={(log) => {
              setEditingLog(log);
              setView("log");
            }}
            onDelete={deleteLog}
          />
        </>
      )}

      {view === "log" && (
        <section className="rounded-2xl bg-white p-4 ring-1 ring-slate-100">
          <h2 className="mb-3 text-base font-semibold text-slate-700">
            {editingLog ? "עריכת רישום" : "רישום מהיר"}
          </h2>
          <QuickLogForm
            onSubmit={editingLog ? updateLog : addLog}
            initialValues={editingLog ?? undefined}
            onCancel={() => {
              setEditingLog(null);
              setView("home");
            }}
            submitText={editingLog ? "שמירת שינויים" : "שמירה"}
          />
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

      {view === "settings" && (
        <SettingsScreen
          dailyGoal={data.dailyGoal}
          weeklyGoal={data.weeklyGoal}
          onSave={saveGoals}
        />
      )}
    </main>
  );
}
