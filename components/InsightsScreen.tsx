import Card from "./Card";

type InsightProps = {
  mostCommonTrigger: string;
  mostCommonHour: string;
  streakUnderGoal: number;
  dailyCounts: { dayLabel: string; count: number }[];
};

export default function InsightsScreen({
  mostCommonTrigger,
  mostCommonHour,
  streakUnderGoal,
  dailyCounts,
}: InsightProps) {
  const max = Math.max(...dailyCounts.map((item) => item.count), 1);

  return (
    <div className="space-y-4">
      <Card title="תובנות">
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            טריגר נפוץ: <strong>{mostCommonTrigger}</strong>
          </p>
          <p>
            שעה נפוצה: <strong>{mostCommonHour}</strong>
          </p>
          <p>
            רצף ימים מתחת ליעד: <strong>{streakUnderGoal}</strong>
          </p>
        </div>
      </Card>

      <Card title="שבוע אחרון">
        <div className="space-y-2">
          {dailyCounts.map((item) => (
            <div key={item.dayLabel} className="flex items-center gap-2 text-sm">
              <span className="w-9 text-slate-500">{item.dayLabel}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-mint-500"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
              <span className="w-4 text-center">{item.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
