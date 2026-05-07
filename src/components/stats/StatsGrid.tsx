import { useRecoilValue } from 'recoil';
import {
  completionPercentageSelector,
  taskStatisticsSelector,
} from '../../state/selectors/taskSelectors';

const statItems = [
  { key: 'total', label: 'Total Tasks' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'estimatedHours', label: 'Est. Hours' },
] as const;

export const StatsGrid = () => {
  const stats = useRecoilValue(taskStatisticsSelector);
  const completion = useRecoilValue(completionPercentageSelector);

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {statItems.map((item) => (
        <article
          key={item.key}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-cyan-800"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">
            {stats[item.key]}
          </p>
        </article>
      ))}

      <article className="rounded-lg border border-cyan-200 bg-cyan-50 p-4 shadow-soft dark:border-cyan-900/80 dark:bg-cyan-950/30">
        <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Completion</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="text-3xl font-semibold text-cyan-950 dark:text-cyan-100">{completion}%</p>
          <div className="mb-2 h-2 w-24 overflow-hidden rounded-full bg-cyan-200 dark:bg-cyan-950">
            <div className="h-full bg-cyan-600 transition-all" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </article>
    </section>
  );
};
