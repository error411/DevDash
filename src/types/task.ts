export type TaskStatus = 'backlog' | 'in-progress' | 'blocked' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  tags: string[];
  estimatedHours: number;
  status: TaskStatus;
  createdAt: string;
}

export interface TaskFilters {
  search: string;
  priority: TaskPriority | 'all';
  tag: string;
}

export interface TaskStatistics {
  total: number;
  backlog: number;
  inProgress: number;
  blocked: number;
  done: number;
  estimatedHours: number;
}

export const taskStatuses: TaskStatus[] = ['backlog', 'in-progress', 'blocked', 'done'];

export const statusLabels: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  'in-progress': 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};
