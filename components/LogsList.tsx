import Card from "./Card";
import { SweetLog, SweetReason } from "@/lib/types";

const reasonText: Record<SweetReason, string> = {
  hunger: "רעב",
  stress: "סטרס",
  boredom: "שעמום",
  habit: "הרגל",
  social: "אירוע חברתי",
};

type LogsListProps = {
  logs: SweetLog[];
  onEdit: (log: SweetLog) => void;
  onDelete: (id: string) => void;
};

export default function LogsList({ logs, onEdit, onDelete }: LogsListProps) {
  return (
    <Card title="הרישומים האחרונים">
      {logs.length === 0 ? (
        <p className="text-sm text-slate-500">עדיין אין רישומים. אפשר להתחיל ברישום קטן אחד.</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li key={log.id} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-800">{log.whatAte}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(log.time).toLocaleString("he-IL", {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className="rounded-full bg-mint-100 px-2 py-1 text-xs text-mint-700">
                  {reasonText[log.reason]}
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-600">
                חשק: {log.cravingLevel}/5 · רעב פיזי: {log.physicallyHungry ? "כן" : "לא"}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onEdit(log)}
                  className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200"
                >
                  עריכה
                </button>
                <button
                  onClick={() => onDelete(log.id)}
                  className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100"
                >
                  מחיקה
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
