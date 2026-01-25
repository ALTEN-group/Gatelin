export const isEqual = (val1: unknown, val2: unknown) => {
  return JSON.stringify(val1) === JSON.stringify(val2);
};
