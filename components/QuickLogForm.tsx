import { FormEvent, useMemo, useState } from "react";
import { SweetLog, SweetReason } from "@/lib/types";

const reasons: { value: SweetReason; label: string }[] = [
  { value: "hunger", label: "רעב" },
  { value: "stress", label: "סטרס" },
  { value: "boredom", label: "שעמום" },
  { value: "habit", label: "הרגל" },
  { value: "social", label: "אירוע חברתי" },
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
  initialValues?: Partial<SweetLog>;
  onCancel?: () => void;
  submitText?: string;
};

const defaultTime = new Date().toISOString().slice(0, 16);

export default function QuickLogForm({
  onSubmit,
  initialValues,
  onCancel,
  submitText = "שמירה",
}: QuickLogFormProps) {
  const initialState = useMemo<FormValues>(
    () => ({
      whatAte: initialValues?.whatAte ?? "",
      time: initialValues?.time
        ? new Date(initialValues.time).toISOString().slice(0, 16)
        : defaultTime,
      reason: initialValues?.reason ?? "hunger",
      cravingLevel: initialValues?.cravingLevel ?? 3,
      physicallyHungry: initialValues?.physicallyHungry ?? false,
    }),
    [initialValues],
  );

  const [form, setForm] = useState<FormValues>(initialState);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.whatAte.trim()) {
      return;
    }

    onSubmit(form);
    if (!initialValues?.id) {
      setForm((prev) => ({ ...prev, whatAte: "" }));
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm">
        <span className="mb-1.5 block text-slate-600">מה בחרתי לאכול?</span>
        <input
          required
          value={form.whatAte}
          onChange={(event) => setForm((prev) => ({ ...prev, whatAte: event.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
          placeholder="לדוגמה: שוקולד קטן"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block text-slate-600">מתי זה קרה?</span>
        <input
          type="datetime-local"
          value={form.time}
          onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block text-slate-600">מה הכי תיאר את הרגע?</span>
        <select
          value={form.reason}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, reason: event.target.value as SweetReason }))
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5"
        >
          {reasons.map((reason) => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block text-slate-600">רמת החשק (1-5)</span>
        <input
          type="range"
          min={1}
          max={5}
          value={form.cravingLevel}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              cravingLevel: Number(event.target.value) as FormValues["cravingLevel"],
            }))
          }
          className="w-full"
        />
        <span className="text-mint-700">{form.cravingLevel}</span>
      </label>

      <fieldset className="text-sm">
        <legend className="mb-2 text-slate-600">האם היה רעב פיזי?</legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <input
              type="radio"
              checked={form.physicallyHungry}
              onChange={() => setForm((prev) => ({ ...prev, physicallyHungry: true }))}
            />
            כן
          </label>
          <label className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <input
              type="radio"
              checked={!form.physicallyHungry}
              onChange={() => setForm((prev) => ({ ...prev, physicallyHungry: false }))}
            />
            לא
          </label>
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-white px-4 py-3 font-semibold text-slate-600 ring-1 ring-slate-200"
          >
            ביטול
          </button>
        )}
        <button className="rounded-xl bg-mint-500 px-4 py-3 font-semibold text-white">
          {submitText}
        </button>
      </div>
    </form>
  );
}
