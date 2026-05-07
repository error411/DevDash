import { atom } from 'recoil';
import { seedTasks } from '../../data/seedTasks';
import type { Task } from '../../types/task';
import { localStorageEffect } from '../effects/localStorageEffect';

export const tasksState = atom<Task[]>({
  key: 'tasksState',
  default: seedTasks,
  effects: [localStorageEffect<Task[]>('devdash.tasks')],
});
