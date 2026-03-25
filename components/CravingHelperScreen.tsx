import Card from "./Card";

const alternatives = [
  "לשתות כוס מים קרים ולנשום עמוק במשך דקה",
  "לאכול משהו קטן עם חלבון כמו יוגורט או אגוזים",
  "לעשות הליכה קצרה של 5 דקות או מתיחות",
];

export default function CravingHelperScreen() {
  return (
    <div className="space-y-4">
      <Card title="רגע לפני ממתק">
        <p className="mb-3 text-sm text-slate-600">
          אפשר לנסות אחת מהאפשרויות האלו ולבדוק איך החשק מרגיש אחרי 10 דקות.
        </p>
        <ul className="space-y-2">
          {alternatives.map((item) => (
            <li key={item} className="rounded-xl bg-mint-50 p-3 text-sm text-slate-700 ring-1 ring-mint-100">
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
