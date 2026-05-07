import { useRecoilState } from 'recoil';
import { darkModeState } from '../../state/atoms/uiAtom';

export const Header = () => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);

  return (
    <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-soft dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
          Developer Operations
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">
          DevDash
        </h1>
      </div>

      <button
        type="button"
        onClick={() => setDarkMode((value) => !value)}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-neutral-700 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-200"
      >
        <span
          className="h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_0_4px_rgba(6,182,212,0.14)]"
          aria-hidden="true"
        />
        {darkMode ? 'Dark' : 'Light'}
      </button>
    </header>
  );
};
