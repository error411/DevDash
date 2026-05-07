import { atom } from 'recoil';
import { localStorageEffect } from '../effects/localStorageEffect';

export const darkModeState = atom<boolean>({
  key: 'darkModeState',
  default: false,
  effects: [localStorageEffect<boolean>('devdash.darkMode')],
});

export const focusedTaskIdState = atom<string | null>({
  key: 'focusedTaskIdState',
  default: null,
});
