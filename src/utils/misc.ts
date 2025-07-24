export const emptyStringToNull = (obj: Record<string, any>): void => {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof obj[key] === 'string' && value.trim() === '') {
      obj[key] = null;
    }
  });
};
