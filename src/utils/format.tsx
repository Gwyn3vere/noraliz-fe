const rtf = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

export function formatEditedTime(dateString: string) {
  const date = new Date(dateString);

  const diffMs = date.getTime() - Date.now();

  const minutes = Math.round(diffMs / 1000 / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (Math.abs(days) >= 1) {
    value = days;
    unit = "day";
  } else if (Math.abs(hours) >= 1) {
    value = hours;
    unit = "hour";
  } else {
    value = minutes;
    unit = "minute";
  }

  return `Edited: ${rtf.format(value, unit)}`;
}
