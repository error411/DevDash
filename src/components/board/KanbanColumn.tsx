import { statusLabels, type Task, type TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';

const columnStyles: Record<TaskStatus, string> = {
  backlog: 'border-slate-200 dark:border-neutral-800',
  'in-progress': 'border-cyan-200 dark:border-cyan-900/80',
  blocked: 'border-rose-200 dark:border-rose-900/80',
  done: 'border-emerald-200 dark:border-emerald-900/80',
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export const KanbanColumn = ({ status, tasks }: KanbanColumnProps) => {
  return (
    <article
      className={`flex min-h-[22rem] flex-col rounded-lg border bg-white/90 shadow-soft dark:bg-neutral-900/90 ${columnStyles[status]}`}
    >
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-neutral-800">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300">
          {statusLabels[status]}
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
          {tasks.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-3">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400 dark:border-neutral-800 dark:text-slate-500">
            No matching tasks
          </div>
        )}
      </div>
    </article>
  );
};
