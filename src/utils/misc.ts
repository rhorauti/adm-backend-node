export const emptyStringToNull = (obj: Record<string, any>): void => {
  Object.entries(obj).forEach(([key, value]) => {
    if ((typeof obj[key] === 'string' || typeof obj[key] === 'undefined') && value.trim() === '') {
      obj[key] = null;
    }
  });
};
