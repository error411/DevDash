import { FormEvent, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { tasksState } from '../../state/atoms/tasksAtom';
import {
  priorityLabels,
  statusLabels,
  taskStatuses,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '../../types/task';

interface NewTaskFormState {
  title: string;
  description: string;
  priority: TaskPriority;
  tags: string;
  estimatedHours: string;
  status: TaskStatus;
}

const initialFormState: NewTaskFormState = {
  title: '',
  description: '',
  priority: 'medium',
  tags: '',
  estimatedHours: '1',
  status: 'backlog',
};

const createTaskId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `task-${Date.now()}`;

const parseTags = (tags: string) =>
  tags
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

export const NewTaskForm = () => {
  const setTasks = useSetRecoilState(tasksState);
  const [form, setForm] = useState<NewTaskFormState>(initialFormState);
  const [isOpen, setIsOpen] = useState(false);

  const updateForm = <Key extends keyof NewTaskFormState>(
    key: Key,
    value: NewTaskFormState[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = form.title.trim();
    const estimatedHours = Number(form.estimatedHours);

    if (!title || Number.isNaN(estimatedHours) || estimatedHours <= 0) {
      return;
    }

    const task: Task = {
      id: createTaskId(),
      title,
      description: form.description.trim(),
      priority: form.priority,
      tags: parseTags(form.tags),
      estimatedHours,
      status: form.status,
      createdAt: new Date().toISOString(),
    };

    setTasks((tasks) => [task, ...tasks]);
    setForm(initialFormState);
    setIsOpen(false);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300">
            Task Intake
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add a task directly to the board.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-neutral-700 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-200"
        >
          {isOpen ? 'Close' : 'New Task'}
        </button>
      </div>

      {isOpen && (
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            className="field md:col-span-2"
            value={form.title}
            onChange={(event) => updateForm('title', event.target.value)}
            placeholder="Task title"
            aria-label="Task title"
            required
          />

          <textarea
            className="min-h-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-slate-100 md:col-span-2"
            value={form.description}
            onChange={(event) => updateForm('description', event.target.value)}
            placeholder="Description"
            aria-label="Task description"
          />

          <select
            className="field"
            value={form.priority}
            onChange={(event) => updateForm('priority', event.target.value as TaskPriority)}
            aria-label="Task priority"
          >
            {Object.entries(priorityLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            className="field"
            value={form.status}
            onChange={(event) => updateForm('status', event.target.value as TaskStatus)}
            aria-label="Task status"
          >
            {taskStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>

          <input
            className="field"
            type="number"
            min="0.25"
            step="0.25"
            value={form.estimatedHours}
            onChange={(event) => updateForm('estimatedHours', event.target.value)}
            placeholder="Estimated hours"
            aria-label="Estimated hours"
            required
          />

          <input
            className="field"
            value={form.tags}
            onChange={(event) => updateForm('tags', event.target.value)}
            placeholder="Tags, comma separated"
            aria-label="Task tags"
          />

          <div className="flex justify-end gap-2 md:col-span-2">
            <button
              type="button"
              onClick={() => setForm(initialFormState)}
              className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800"
            >
              Reset
            </button>
            <button
              type="submit"
              className="h-10 rounded-md border border-cyan-600 bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:border-cyan-500 dark:bg-cyan-500 dark:text-cyan-950 dark:hover:bg-cyan-400"
            >
              Add Task
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
