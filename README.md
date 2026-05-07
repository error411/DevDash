# DevDash

DevDash is a React + TypeScript + Vite developer dashboard with a Recoil-powered Kanban board, TailwindCSS styling, dark mode, persisted local state, and task search/filtering.

## Features

- Kanban board with Backlog, In Progress, Blocked, and Done columns
- Recoil atoms and selectors split into dedicated state folders
- Selectors for filtered tasks, task statistics, and completion percentage
- LocalStorage persistence for tasks, filters, and dark mode
- Responsive TailwindCSS dashboard UI
- Sample seed task data
- Docker and nginx production serving support

## Setup

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Docker

```bash
docker compose up --build
```

The container serves the production build at `http://localhost:8080`.

## Project Structure

```text
src/
  components/
    board/
    filters/
    layout/
    stats/
  data/
  state/
    atoms/
    effects/
    selectors/
  types/
```
