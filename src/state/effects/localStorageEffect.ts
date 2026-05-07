import type { AtomEffect } from 'recoil';

export const localStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);

    if (savedValue !== null) {
      try {
        setSelf(JSON.parse(savedValue) as T);
      } catch {
        localStorage.removeItem(key);
      }
    }

    onSet((newValue, _oldValue, isReset) => {
      if (isReset) {
        localStorage.removeItem(key);
        return;
      }

      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
