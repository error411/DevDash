import { atom } from 'recoil';
import type { TaskFilters } from '../../types/task';
import { localStorageEffect } from '../effects/localStorageEffect';

export const filtersState = atom<TaskFilters>({
  key: 'filtersState',
  default: {
    search: '',
    priority: 'all',
    tag: '',
  },
  effects: [localStorageEffect<TaskFilters>('devdash.filters')],
});
