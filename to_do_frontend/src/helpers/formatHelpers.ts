export const formatMinutesToStringDDhhmm = (minutes: number): string => {
  const days = Math.floor(minutes / 1440);
  minutes %= 1440;
  const hours = Math.floor(minutes / 60);
  minutes %= 60;
  const daysString = days > 0 ? `${Math.floor(days)} days ` : "";
  const hoursString =
    hours > 0 || days > 0 ? `${Math.floor(hours)} hours ` : "";
  const minutesString = `${Math.floor(minutes)} minutes`;
  return daysString + hoursString + minutesString;
};
