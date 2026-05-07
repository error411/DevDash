import { useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { agedTasksSelector } from '../../state/selectors/agedTasks';
import { filteredTasksSelector } from '../../state/selectors/taskSelectors';
import { tasksState } from '../../state/atoms/tasksAtom';
import { taskStatuses } from '../../types/task';
import type { TaskStatus } from '../../types/task';
import { KanbanColumn } from './KanbanColumn';

export const KanbanBoard = () => {
  const filteredTasks = useRecoilValue(filteredTasksSelector);
  const agedTasks = useRecoilValue(agedTasksSelector);
  const setTasks = useSetRecoilState(tasksState);

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

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === draggableId ? { ...task, status: destination.droppableId as TaskStatus } : task
      ),
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <section className="grid flex-1 gap-5 sm:gap-4 xl:grid-cols-4">
        {taskStatuses.map((status) => (
          <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} />
        ))}
      </section>
    </DragDropContext>
  );
};
