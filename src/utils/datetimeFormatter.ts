export default function (
  value: string | number | Date | undefined | null,
  isUTC: boolean = false,
  dateOptions: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" },
  timeOptions: Intl.DateTimeFormatOptions = { hourCycle: "h24" },
): string {
  const default_locale = "en";

  if (!value) return "-";

  const thedate = new Date(value);
  let options: Intl.DateTimeFormatOptions = {};

  if (isUTC) {
    options = { timeZone: "UTC" };
  } else {
    options = { timeZone: "Europe/Athens" };
  }

  return (
    thedate.toLocaleDateString(default_locale, { ...options, ...dateOptions }) +
    " " +
    thedate.toLocaleTimeString(default_locale, { ...options, ...timeOptions })
  );
}
