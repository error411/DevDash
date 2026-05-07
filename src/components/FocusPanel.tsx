import { useRecoilValue, useSetRecoilState } from 'recoil';
import { focusedTaskIdState } from '../state/atoms/uiAtom';
import { focusedTaskSelector } from '../state/selectors/focusedTask';

export const FocusPanel = () => {
  const focusedTask = useRecoilValue(focusedTaskSelector);
  const setFocusedTaskId = useSetRecoilState(focusedTaskIdState);

  if (!focusedTask) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300">
          Focus Mode
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No task selected.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 shadow-soft dark:border-cyan-900/80 dark:bg-cyan-950/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
            Current Focus
          </h2>
          <p className="mt-2 text-lg font-semibold text-cyan-950 dark:text-cyan-100">
            {focusedTask.title}
          </p>
          <p className="mt-1 text-sm leading-6 text-cyan-900/80 dark:text-cyan-100/75">
            {focusedTask.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFocusedTaskId(null)}
          className="h-10 rounded-md border border-cyan-300 px-3 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100 dark:border-cyan-800 dark:text-cyan-200 dark:hover:bg-cyan-950"
        >
          Clear
        </button>
      </div>
    </section>
  );
};
