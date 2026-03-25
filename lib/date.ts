const dayFormat = new Intl.DateTimeFormat("en-CA");

export const toDayKey = (date: Date) => dayFormat.format(date);

export const getLast7DayKeys = () => {
  const days: string[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(toDayKey(date));
  }

  return days;
};

export const hourFromIsoTime = (iso: string) => new Date(iso).getHours();
