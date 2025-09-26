export const createAlphabet = (): string[] => {
  return Array.from({length: 26}, (_v, i) => String.fromCharCode(65 + i));
};
