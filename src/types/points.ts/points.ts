import { ClassificationEntry } from '@app/types/classifications';

export const computePoints = (entry: ClassificationEntry): number => {
  return 3 * entry.won + entry.drawn;
};
