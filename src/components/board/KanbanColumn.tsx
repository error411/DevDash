import { Droppable } from '@hello-pangea/dnd';
import type { AgedTask } from '../../state/selectors/agedTasks';
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
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => {
        const isDragOver = snapshot.isDraggingOver;
        return (
          <article
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex min-h-[22rem] flex-col rounded-lg border shadow-soft transition-all duration-200 ${
              isDragOver 
                ? 'bg-cyan-50/80 ring-2 ring-cyan-500/40 dark:bg-cyan-950/40 dark:ring-cyan-400/40' 
                : 'bg-white/90 dark:bg-neutral-900/90'
            } ${columnStyles[status]}`}
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
                tasks.map((task, index) => <TaskCard key={task.id} task={task} index={index} />)
              ) : (
                <div
                  className={`flex flex-1 items-center justify-center rounded-md border border-dashed px-4 py-8 text-center text-sm transition-all duration-200 ${
                    isDragOver
                      ? 'border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-300 scale-[0.98]'
                      : 'border-slate-200 text-slate-400 dark:border-neutral-800 dark:text-slate-500'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">{isDragOver ? '📥' : '👻'}</span>
                    <span>{isDragOver ? 'Drop here to move' : `No tasks in ${statusLabels[status]}`}</span>
                  </div>
                </div>
              )}
              {provided.placeholder}
            </div>
          </article>
        );
      }}
    </Droppable>
  );
};
