import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filtersState } from '../../state/atoms/filtersAtom';
import { availableTagsSelector } from '../../state/selectors/taskSelectors';
import { priorityLabels, type TaskFilters, type TaskPriority } from '../../types/task';
import { useDebounce } from '../../hooks/useDebounce';

export const SearchFilters = () => {
  const [filters, setFilters] = useRecoilState(filtersState);
  const tags = useRecoilValue(availableTagsSelector);
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 250);

  const updateFilter = <Key extends keyof TaskFilters>(key: Key, value: TaskFilters[Key]) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      updateFilter('search', debouncedSearch);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    if (filters.search === '') {
      setLocalSearch('');
    }
  }, [filters.search]);

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateFilter('priority', event.target.value as TaskPriority | 'all');
  };

  return (
    <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-[1fr_180px_180px_auto]">
      <input
        className="field"
        type="search"
        value={localSearch}
        onChange={(event) => setLocalSearch(event.target.value)}
        placeholder="Search title, description, or tag"
        aria-label="Search tasks"
      />

      <select
        className="field"
        value={filters.priority}
        onChange={handlePriorityChange}
        aria-label="Filter by priority"
      >
        <option value="all">All priorities</option>
        {Object.entries(priorityLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        className="field"
        value={filters.tag}
        onChange={(event) => updateFilter('tag', event.target.value)}
        aria-label="Filter by tag"
      >
        <option value="">All tags</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => setFilters({ search: '', priority: 'all', tag: '' })}
        className="h-11 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-neutral-700 dark:text-slate-200 dark:hover:bg-neutral-800"
      >
        Reset
      </button>
    </section>
  );
};
