import { atom } from 'recoil';
import { seedTasks } from '../../data/seedTasks';
import type { Task } from '../../types/task';
import { localStorageEffect } from '../effects/localStorageEffect';

const seedTasksById = new Map(seedTasks.map((task) => [task.id, task]));

const migrateTasks = (tasks: Task[]) =>
  tasks.map((task) => ({
    ...task,
    createdAt: task.createdAt ?? seedTasksById.get(task.id)?.createdAt ?? new Date().toISOString(),
    project: task.project ?? seedTasksById.get(task.id)?.project ?? 'Unassigned',
    notes: task.notes ?? seedTasksById.get(task.id)?.notes ?? '',
  }));

export const tasksState = atom<Task[]>({
  key: 'tasksState',
  default: seedTasks,
  effects: [localStorageEffect<Task[]>('devdash.tasks', { migrate: migrateTasks })],
});
