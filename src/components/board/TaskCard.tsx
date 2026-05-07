import { DragEvent, FormEvent, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { focusedTaskIdState } from '../../atoms/ui';
import type { AgedTask } from '../../selectors/agedTasks';
import { tasksState } from '../../state/atoms/tasksAtom';
import { priorityLabels, type TaskPriority } from '../../types/task';

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  critical: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
};

interface TaskCardProps {
  task: AgedTask;
}

const formatCreatedDate = (createdAt: string) =>
  Number.isNaN(new Date(createdAt).getTime())
    ? 'Unknown'
    : new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(createdAt));

const truncateNotes = (notes: string) => {
  const trimmedNotes = notes.trim();
  const maxPreviewLength = 72;

  if (trimmedNotes.length <= maxPreviewLength) {
    return trimmedNotes;
  }

  return `${trimmedNotes.slice(0, maxPreviewLength).trim()}...`;
};

export const TaskCard = ({ task }: TaskCardProps) => {
  const setTasks = useSetRecoilState(tasksState);
  const setFocusedTaskId = useSetRecoilState(focusedTaskIdState);
  const focusedTaskId = useRecoilValue(focusedTaskIdState);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState(task.notes);
  const isFocused = focusedTaskId === task.id;
  const notesPreview = truncateNotes(task.notes);

  const toggleFocus = () => {
    setFocusedTaskId((currentFocusedTaskId) =>
      currentFocusedTaskId === task.id ? null : task.id,
    );
  };

  const handleDragStart = (event: DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', task.id);
  };

  const openNotesModal = () => {
    setNotesDraft(task.notes);
    setIsNotesModalOpen(true);
  };

  const closeNotesModal = () => {
    setIsNotesModalOpen(false);
  };

  const saveNotes = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTasks((tasks) =>
      tasks.map((currentTask) =>
        currentTask.id === task.id ? { ...currentTask, notes: notesDraft.trim() } : currentTask,
      ),
    );
    setIsNotesModalOpen(false);
  };

  return (
    <>
      <article
        className={`group rounded-lg border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
          isFocused
            ? 'border-cyan-400 bg-cyan-50 shadow-lg ring-2 ring-cyan-500/25 dark:border-cyan-600 dark:bg-cyan-950/40 dark:ring-cyan-400/25'
            : 'border-slate-300 bg-white hover:border-cyan-300 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:border-cyan-700'
        }`}
        draggable
        onDragStart={handleDragStart}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              {task.project}
            </p>
            <h3 className="text-base font-semibold leading-6 text-slate-950 dark:text-white">
              {task.title}
            </h3>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{task.description}</p>

        {notesPreview && (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
            <p className="line-clamp-2 leading-5">{notesPreview}</p>
          </div>
        )}

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

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-300">
            {formatCreatedDate(task.createdAt)}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 ${
              task.isStale
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
          >
            {task.isStale ? `Aging ${task.ageInDays}d` : `${task.ageInDays}d old`}
          </span>
        </div>

        <footer className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-3 dark:border-neutral-800">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-500 dark:text-slate-400">Estimate</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {task.estimatedHours}h
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={openNotesModal}
              className="h-10 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 dark:border-neutral-700 dark:text-slate-200 dark:hover:border-amber-800 dark:hover:bg-amber-950/40 dark:hover:text-amber-200"
            >
              {task.notes.trim() ? 'Edit Notes' : 'Add Notes'}
            </button>
            <button
              type="button"
              onClick={toggleFocus}
              className={`h-10 rounded-md border px-3 text-sm font-semibold transition ${
                isFocused
                  ? 'border-cyan-300 bg-cyan-600 text-white hover:bg-cyan-700 dark:border-cyan-600 dark:bg-cyan-500 dark:text-cyan-950 dark:hover:bg-cyan-400'
                  : 'border-slate-200 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-neutral-700 dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-200'
              }`}
            >
              {isFocused ? 'Focused' : 'Focus'}
            </button>
          </div>
        </footer>
      </article>

      {isNotesModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={closeNotesModal}
        >
          <div
            className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`task-notes-title-${task.id}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                  {task.project}
                </p>
                <h2
                  id={`task-notes-title-${task.id}`}
                  className="mt-1 text-lg font-semibold text-slate-950 dark:text-white"
                >
                  {task.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeNotesModal}
                className="h-9 w-9 rounded-md border border-slate-200 text-lg leading-none text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 dark:border-neutral-700 dark:text-slate-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                aria-label="Close task notes modal"
              >
                x
              </button>
            </div>

            <form className="mt-5" onSubmit={saveNotes}>
              <label
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                htmlFor={`task-notes-${task.id}`}
              >
                Notes
              </label>
              <textarea
                id={`task-notes-${task.id}`}
                className="mt-2 min-h-56 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-slate-100"
                value={notesDraft}
                onChange={(event) => setNotesDraft(event.target.value)}
                placeholder="Add implementation notes, blockers, links, decisions, or follow-ups."
                autoFocus
              />

              <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={closeNotesModal}
                  className="h-10 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-md border border-cyan-600 bg-cyan-600 px-4 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:border-cyan-500 dark:bg-cyan-500 dark:text-cyan-950 dark:hover:bg-cyan-400"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
