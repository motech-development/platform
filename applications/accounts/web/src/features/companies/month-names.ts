export function monthNames(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    timeZone: 'UTC',
  });

  return Array.from({ length: 12 }, (_, month) =>
    formatter.format(new Date(Date.UTC(2020, month, 1))),
  );
}
