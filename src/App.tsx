import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Header } from './components/layout/Header';
import { SearchFilters } from './components/filters/SearchFilters';
import { FocusPanel } from './components/FocusPanel';
import { NewTaskForm } from './components/tasks/NewTaskForm';
import { StatsGrid } from './components/stats/StatsGrid';
import { KanbanBoard } from './components/board/KanbanBoard';
import { darkModeState } from './state/atoms/uiAtom';

const App = () => {
  const darkMode = useRecoilValue(darkModeState);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 transition-colors duration-300 dark:bg-neutral-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <Header />
        <StatsGrid />
        <section className="grid gap-4 lg:grid-cols-2">
          <FocusPanel />
          <NewTaskForm />
        </section>
        <SearchFilters />
        <KanbanBoard />
      </div>
    </main>
  );
};

export default App;
