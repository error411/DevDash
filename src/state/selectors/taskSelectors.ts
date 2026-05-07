import { selector } from 'recoil';
import { filtersState } from '../atoms/filtersAtom';
import { tasksState } from '../atoms/tasksAtom';
import type { TaskStatistics } from '../../types/task';

export const availableTagsSelector = selector<string[]>({
  key: 'availableTagsSelector',
  get: ({ get }) => {
    const tasks = get(tasksState);
    return Array.from(new Set(tasks.flatMap((task) => task.tags))).sort();
  },
});

export const filteredTasksSelector = selector({
  key: 'filteredTasksSelector',
  get: ({ get }) => {
    const tasks = get(tasksState);
    const filters = get(filtersState);
    const normalizedSearch = filters.search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description.toLowerCase().includes(normalizedSearch) ||
        task.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchesTag = filters.tag === '' || task.tags.includes(filters.tag);

      return matchesSearch && matchesPriority && matchesTag;
    });
  },
});

export const taskStatisticsSelector = selector<TaskStatistics>({
  key: 'taskStatisticsSelector',
  get: ({ get }) => {
    const tasks = get(tasksState);

    return tasks.reduce<TaskStatistics>(
      (stats, task) => ({
        total: stats.total + 1,
        backlog: stats.backlog + (task.status === 'backlog' ? 1 : 0),
        inProgress: stats.inProgress + (task.status === 'in-progress' ? 1 : 0),
        blocked: stats.blocked + (task.status === 'blocked' ? 1 : 0),
        done: stats.done + (task.status === 'done' ? 1 : 0),
        estimatedHours: stats.estimatedHours + task.estimatedHours,
      }),
      {
        total: 0,
        backlog: 0,
        inProgress: 0,
        blocked: 0,
        done: 0,
        estimatedHours: 0,
      },
    );
  },
});

export const completionPercentageSelector = selector<number>({
  key: 'completionPercentageSelector',
  get: ({ get }) => {
    const stats = get(taskStatisticsSelector);
    return stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);
  },
});
