import { selector } from 'recoil';
import { tasksState } from '../state/atoms/tasksAtom';
import type { Task } from '../types/task';
import { focusedTaskIdState } from '../atoms/ui';

export const focusedTaskSelector = selector<Task | null>({
  key: 'focusedTaskSelector',
  get: ({ get }) => {
    const tasks = get(tasksState);
    const focusedId = get(focusedTaskIdState);

    if (!focusedId) {
      return null;
    }

    return tasks.find((task) => task.id === focusedId) ?? null;
  },
});
