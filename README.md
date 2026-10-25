# chat-with-your-pdfs-frontend

Basic React + TypeScript app scaffolded with Vite.

## Setup

```powershell
npm install
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Folder structure

```text
src/
  assets/            static images and fonts
  components/        UI shared by more than one feature
  features/          domain modules (empty for now)
  hooks/             shared hooks
  lib/               clients and small shared helpers
  pages/             screen-level components
  styles/            global CSS only
  types/             shared TypeScript types
  App.tsx            app shell; renders the current page
  main.tsx           React entry
  vite-env.d.ts
public/              files served as-is
```

Import from `src/` with the `@/` alias, for example `@/pages/HomePage`.
