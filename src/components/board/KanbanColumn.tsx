import { DragEvent, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import type { AgedTask } from '../../selectors/agedTasks';
import { tasksState } from '../../state/atoms/tasksAtom';
import { statusLabels, type TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';

const columnStyles: Record<TaskStatus, string> = {
  backlog: 'border-slate-200 dark:border-neutral-800',
  'in-progress': 'border-cyan-200 dark:border-cyan-900/80',
  blocked: 'border-rose-200 dark:border-rose-900/80',
  done: 'border-emerald-200 dark:border-emerald-900/80',
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: AgedTask[];
}

export const KanbanColumn = ({ status, tasks }: KanbanColumnProps) => {
  const setTasks = useSetRecoilState(tasksState);
  const [isDragOver, setIsDragOver] = useState(false);

  const moveTaskToColumn = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');

    setIsDragOver(false);

    if (taskId) {
      moveTaskToColumn(taskId);
    }
  };

  return (
    <article
      className={`flex min-h-[22rem] flex-col rounded-lg border bg-white/90 shadow-soft transition dark:bg-neutral-900/90 ${
        isDragOver ? 'ring-2 ring-cyan-500/30 dark:ring-cyan-400/30' : ''
      } ${columnStyles[status]}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-neutral-800">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300">
          {statusLabels[status]}
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-neutral-800 dark:text-slate-300">
          {tasks.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-3">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div
            className={`flex flex-1 items-center justify-center rounded-md border border-dashed px-4 py-8 text-center text-sm transition ${
              isDragOver
                ? 'border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-300'
                : 'border-slate-200 text-slate-400 dark:border-neutral-800 dark:text-slate-500'
            }`}
          >
            Drop tasks here
          </div>
        )}
      </div>
    </article>
  );
};
