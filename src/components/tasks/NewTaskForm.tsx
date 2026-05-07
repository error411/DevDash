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
  project: string;
  notes: string;
  priority: TaskPriority;
  tags: string;
  estimatedHours: string;
  status: TaskStatus;
}

const initialFormState: NewTaskFormState = {
  title: '',
  description: '',
  project: '',
  notes: '',
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

  const closeModal = () => {
    setIsOpen(false);
  };

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
      project: form.project.trim() || 'Unassigned',
      notes: form.notes.trim(),
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
    <section className="fixed inset-x-5 bottom-4 z-40 rounded-lg border border-slate-200 bg-white p-4 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 sm:static sm:inset-auto sm:z-auto sm:shadow-soft">
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
          onClick={() => setIsOpen(true)}
          className="h-10 rounded-md border border-cyan-600 bg-cyan-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-700 hover:shadow-md dark:border-cyan-500 dark:bg-cyan-500 dark:text-cyan-950 dark:hover:bg-cyan-400"
        >
          New Task
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={closeModal}
        >
          <div
            className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-task-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="new-task-title"
                  className="text-lg font-semibold text-slate-950 dark:text-white"
                >
                  New Task
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Capture the work and send it to the right board column.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="h-9 w-9 rounded-md border border-slate-200 text-lg leading-none text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-neutral-700 dark:text-slate-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                aria-label="Close new task modal"
              >
                x
              </button>
            </div>

            <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
              <input
                className="field md:col-span-2"
                value={form.project}
                onChange={(event) => updateForm('project', event.target.value)}
                placeholder="Project, e.g. Viking Battery Website"
                aria-label="Project"
                autoFocus
                required
              />
              
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

              <textarea
                className="min-h-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-slate-100 md:col-span-2"
                value={form.notes}
                onChange={(event) => updateForm('notes', event.target.value)}
                placeholder="Notes"
                aria-label="Task notes"
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

              <div className="flex items-center gap-2">
                <input
                  className="field w-24"
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={form.estimatedHours}
                  onChange={(event) => updateForm('estimatedHours', event.target.value)}
                  placeholder="1"
                  aria-label="Estimated hours"
                  required
                />
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  hour(s)
                </span>
              </div>

              <input
                className="field"
                value={form.tags}
                onChange={(event) => updateForm('tags', event.target.value)}
                placeholder="Tags, comma separated"
                aria-label="Task tags"
              />

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-neutral-800 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setForm(initialFormState)}
                  className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-md border border-cyan-600 bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:border-cyan-500 dark:bg-cyan-500 dark:text-cyan-950 dark:hover:bg-cyan-400"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
