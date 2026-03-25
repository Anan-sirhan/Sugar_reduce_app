import Card from "./Card";

type HomeScreenProps = {
  todayCount: number;
  weeklyGoal: number;
  weeklyCount: number;
  onQuickAdd: () => void;
  onCravingHelp: () => void;
};

export default function HomeScreen({
  todayCount,
  weeklyGoal,
  weeklyCount,
  onQuickAdd,
  onCravingHelp,
}: HomeScreenProps) {
  const progress = Math.min(100, Math.round((weeklyCount / weeklyGoal) * 100));

  return (
    <div className="space-y-4">
      <Card title="היום שלי">
        <div className="text-3xl font-bold text-mint-700">{todayCount}</div>
        <p className="mt-1 text-sm text-slate-600">ממתקים שנרשמו היום</p>
      </Card>

      <Card title="התקדמות מטרה שבועית">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span>
            {weeklyCount} מתוך {weeklyGoal}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-mint-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <div className="grid gap-3">
        <button
          onClick={onQuickAdd}
          className="rounded-xl bg-mint-500 px-4 py-3 font-semibold text-white"
        >
          רשמתי ממתק
        </button>
        <button
          onClick={onCravingHelp}
          className="rounded-xl bg-white px-4 py-3 font-semibold text-mint-700 ring-1 ring-mint-200"
        >
          יש לי חשק עכשיו
        </button>
      </div>
    </div>
  );
}
