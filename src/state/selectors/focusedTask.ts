import { selector } from 'recoil';
import { tasksState } from '../atoms/tasksAtom';
import type { Task } from '../../types/task';
import { focusedTaskIdState } from '../atoms/uiAtom';

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
