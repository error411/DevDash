import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { filteredTasksSelector } from '../../state/selectors/taskSelectors';
import { taskStatuses } from '../../types/task';
import type { TaskStatus } from '../../types/task';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard = () => {
  const tasks = useRecoilValue(filteredTasksSelector);

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
    <section className="grid flex-1 gap-4 xl:grid-cols-4">
      {taskStatuses.map((status) => (
        <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
      ))}
    </section>
  );
};
