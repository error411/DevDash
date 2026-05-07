import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { agedTasksSelector } from '../../selectors/agedTasks';
import { filteredTasksSelector } from '../../state/selectors/taskSelectors';
import { taskStatuses } from '../../types/task';
import type { TaskStatus } from '../../types/task';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard = () => {
  const filteredTasks = useRecoilValue(filteredTasksSelector);
  const agedTasks = useRecoilValue(agedTasksSelector);

  const filteredTaskIds = useMemo(
    () => new Set(filteredTasks.map((task) => task.id)),
    [filteredTasks],
  );

  const tasks = useMemo(
    () => agedTasks.filter((task) => filteredTaskIds.has(task.id)),
    [agedTasks, filteredTaskIds],
  );

  const tasksByStatus = useMemo(
    () =>
      taskStatuses.reduce<Record<TaskStatus, typeof tasks>>(
        (groups, status) => ({
          ...groups,
          [status]: tasks.filter((task) => task.status === status),
        }),
        {
          backlog: [],
          'in-progress': [],
          blocked: [],
          done: [],
        },
      ),
    [tasks],
  );

  return (
    <section className="grid flex-1 gap-5 sm:gap-4 xl:grid-cols-4">
      {taskStatuses.map((status) => (
        <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
      ))}
    </section>
  );
};
