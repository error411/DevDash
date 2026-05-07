// src/atoms/ui.ts
import { atom } from 'recoil'

export const focusedTaskIdState = atom<string | null>({
  key: 'focusedTaskIdState',
  default: null,
})