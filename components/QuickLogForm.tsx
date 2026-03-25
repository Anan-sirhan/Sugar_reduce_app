import { FormEvent, useState } from "react";
import { SweetReason } from "@/lib/types";

const reasons: { value: SweetReason; label: string }[] = [
  { value: "hunger", label: "רעב" },
  { value: "stress", label: "לחץ" },
  { value: "boredom", label: "שעמום" },
  { value: "habit", label: "הרגל" },
  { value: "social", label: "חברתי" },
];

type FormValues = {
  whatAte: string;
  time: string;
  reason: SweetReason;
  cravingLevel: 1 | 2 | 3 | 4 | 5;
  physicallyHungry: boolean;
};

type QuickLogFormProps = {
  onSubmit: (values: FormValues) => void;
};

export default function QuickLogForm({ onSubmit }: QuickLogFormProps) {
  const defaultTime = new Date().toISOString().slice(0, 16);
  const [form, setForm] = useState<FormValues>({
    whatAte: "",
    time: defaultTime,
    reason: "hunger",
    cravingLevel: 3,
    physicallyHungry: false,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.whatAte.trim()) {
      return;
    }

    onSubmit(form);
    setForm((prev) => ({ ...prev, whatAte: "" }));
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="block text-sm">
        <span className="mb-1 block text-slate-600">מה אכלתי</span>
        <input
          required
          value={form.whatAte}
          onChange={(event) => setForm((prev) => ({ ...prev, whatAte: event.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
          placeholder="לדוגמה: שוקולד קטן"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-slate-600">שעה</span>
        <input
          type="datetime-local"
          value={form.time}
          onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-slate-600">סיבה</span>
        <select
          value={form.reason}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, reason: event.target.value as SweetReason }))
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
        >
          {reasons.map((reason) => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-slate-600">רמת חשק 1-5</span>
        <input
          type="range"
          min={1}
          max={5}
          value={form.cravingLevel}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, cravingLevel: Number(event.target.value) as FormValues["cravingLevel"] }))
          }
          className="w-full"
        />
        <span className="text-mint-700">{form.cravingLevel}</span>
      </label>

      <fieldset className="text-sm">
        <legend className="mb-1 text-slate-600">האם הייתי רעב/ה פיזית?</legend>
        <div className="flex gap-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.physicallyHungry}
              onChange={() => setForm((prev) => ({ ...prev, physicallyHungry: true }))}
            />
            כן
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!form.physicallyHungry}
              onChange={() => setForm((prev) => ({ ...prev, physicallyHungry: false }))}
            />
            לא
          </label>
        </div>
      </fieldset>

      <button className="w-full rounded-xl bg-mint-500 px-4 py-3 font-semibold text-white">
        שמירה
      </button>
    </form>
  );
}
