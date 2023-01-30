import { customAlphabet } from 'nanoid';

export const generateId = (): string => {
  return customAlphabet('ABCDEF1234567890', 12)();
};
