import { useRecoilValue, useSetRecoilState } from 'recoil';
import { focusedTaskIdState } from '../../atoms/ui';
import { tasksState } from '../../state/atoms/tasksAtom';
import {
  priorityLabels,
  statusLabels,
  taskStatuses,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '../../types/task';

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  critical: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
};

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const setTasks = useSetRecoilState(tasksState);
  const setFocusedTaskId = useSetRecoilState(focusedTaskIdState);
  const focusedTaskId = useRecoilValue(focusedTaskIdState);
  const isFocused = focusedTaskId === task.id;

  const updateStatus = (status: TaskStatus) => {
    setTasks((tasks) =>
      tasks.map((currentTask) =>
        currentTask.id === task.id ? { ...currentTask, status } : currentTask,
      ),
    );
  };

  return (
    <article
      className={`group rounded-lg border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
        isFocused
          ? 'border-cyan-300 bg-cyan-50 shadow-md ring-2 ring-cyan-500/20 dark:border-cyan-700 dark:bg-cyan-950/30 dark:ring-cyan-400/20'
          : 'border-slate-200 bg-white hover:border-cyan-200 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-cyan-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-6 text-slate-950 dark:text-white">{task.title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
          {priorityLabels[task.priority]}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{task.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-neutral-700 dark:text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <footer className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 dark:border-neutral-800">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-500 dark:text-slate-400">Estimate</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {task.estimatedHours}h
          </span>
        </div>

        <select
          className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-200"
          value={task.status}
          onChange={(event) => updateStatus(event.target.value as TaskStatus)}
          aria-label={`Move ${task.title}`}
        >
          {taskStatuses.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setFocusedTaskId(task.id)}
          className={`h-10 rounded-md border px-3 text-sm font-semibold transition ${
            isFocused
              ? 'border-cyan-300 bg-cyan-600 text-white hover:bg-cyan-700 dark:border-cyan-600 dark:bg-cyan-500 dark:text-cyan-950 dark:hover:bg-cyan-400'
              : 'border-slate-200 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-neutral-700 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-200'
          }`}
        >
          {isFocused ? 'Focused' : 'Focus'}
        </button>
      </footer>
    </article>
  );
};
