import type { AtomEffect } from 'recoil';

interface LocalStorageEffectOptions<T> {
  migrate?: (value: T) => T;
}

export const localStorageEffect =
  <T>(key: string, options: LocalStorageEffectOptions<T> = {}): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);

    if (savedValue !== null) {
      try {
        const parsedValue = JSON.parse(savedValue) as T;
        const migratedValue = options.migrate ? options.migrate(parsedValue) : parsedValue;

        setSelf(migratedValue);
        localStorage.setItem(key, JSON.stringify(migratedValue));
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
