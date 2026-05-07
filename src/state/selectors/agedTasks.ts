import { selector } from 'recoil';
import { tasksState } from '../atoms/tasksAtom';
import type { Task } from '../../types/task';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface AgedTask extends Task {
  ageInDays: number;
  isStale: boolean;
}

const getAgeInDays = (createdAt: string) => {
  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - createdTime) / MS_PER_DAY));
};

export const agedTasksSelector = selector<AgedTask[]>({
  key: 'agedTasksSelector',
  get: ({ get }) => {
    const tasks = get(tasksState);

    return tasks.map((task) => {
      const ageInDays = getAgeInDays(task.createdAt);

      return {
        ...task,
        ageInDays,
        isStale: ageInDays >= 7 && task.status !== 'done',
      };
    });
  },
});
