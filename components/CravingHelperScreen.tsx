import Card from "./Card";

const alternatives = [
  "לשתות כוס מים ולנשום עמוק דקה",
  "לאכול נשנוש קטן ומאוזן כמו יוגורט או אגוזים",
  "לקום ל-5 דקות הליכה או מתיחות",
];

export default function CravingHelperScreen() {
  return (
    <div className="space-y-4">
      <Card title="יש חשק עכשיו?">
        <p className="mb-3 text-sm text-slate-600">
          לפני שמחליטים, אפשר לנסות 3 צעדים קצרים ולבדוק אם החשק נרגע.
        </p>
        <ul className="space-y-2">
          {alternatives.map((item, index) => (
            <li key={item} className="rounded-xl bg-mint-50 p-3 text-sm text-slate-700 ring-1 ring-mint-100">
              <strong className="ml-1">{index + 1}.</strong>
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
