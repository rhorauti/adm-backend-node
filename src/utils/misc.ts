export const emptyStringToNull = (obj: Record<string, any>): void => {
  Object.entries(obj).forEach(([key, value]) => {
    if ((typeof obj[key] === 'string' || typeof obj[key] === 'undefined') && value.trim() === '') {
      obj[key] = null;
    }
  });
};

type DateFormat = 'short' | 'long' | 'medium' | 'full';

const countrySetup = 'pt-BR';

export const dateAndHourFormatted = (
  dateAndHour: Date,
  dateFormat: DateFormat = 'short',
  timeFormat: DateFormat = 'short',
): string => {
  return new Intl.DateTimeFormat(countrySetup, {
    dateStyle: dateFormat,
    timeStyle: timeFormat,
  }).format(dateAndHour);
};
