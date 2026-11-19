# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page personal portfolio built with React 19 + Vite 8 (plain JavaScript/JSX, no TypeScript). Styling is Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config.js`), animation uses `motion` (`motion/react`), icons come from `lucide-react`. The React Compiler is enabled through `@rolldown/plugin-babel` + `reactCompilerPreset()` in `vite.config.js`, so manual `useMemo`/`useCallback` is generally unnecessary.

## Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # ESLint (flat config: js recommended, react-hooks, react-refresh)
```

There is no test suite.

## Architecture

- Entry chain: `index.html` → `src/main.jsx` → `src/Router.jsx` (BrowserRouter) → `src/Layout.jsx` (route `/`, renders a fixed scroll-progress bar + `<Outlet/>`) → `src/App.jsx` (index route).
- `App.jsx` stacks the page sections in order: `Hero`, `About`, `MyCurrentStack`, `Education` (all in `src/Components/`). New sections are added there.
- Section headings use the shared `src/Components/ui/titles/SectionTitle.jsx` with a numbered Japanese subtitle (e.g. `"1. について"`, `"3. 私の教育"`) — follow that convention for new sections.
- `Hero.jsx` is a mouse-driven parallax: stacked full-bleed PNG layers from `img/` (`HEROBG`, `PANELSBG`, `HEROTITLE`, `HEROPROFILE`, `HERONOISE`), each shifted by `useMotionValue`/`useTransform` with a per-layer `strength`.
- Content is hard-coded in components (e.g. the `stacks` array in `MyCurrentStack.jsx` mapping categories → techs → logo imports). There is no CMS or data folder.

## Assets

- Images and fonts live at the project root in `img/` and `fonts/` (not in `src/assets/` or `public/`), and are imported with relative paths like `../../img/Logos/LogoReact.png` from components.
- Fonts are declared with `@font-face` in `src/index.css`: `Akira` (display/headings, `font-akira`) and `DM Sans` (body, `font-dm-sans`).

## Theming

All design tokens are in `src/index.css`: raw CSS variables in `:root` (e.g. `--page-bg`, `--red-primary`, status colors `--active`/`--inactive`/`--inProgress`, and darker `--page-bg-1x0` shades via `color-mix`), then exposed to Tailwind in the `@theme` block as `--color-*` / `--font-*`. To add a color utility (e.g. `bg-foo`), define the variable in `:root` and map it in `@theme`. `src/App.css` is currently empty.

## Gotchas

- Tailwind v4 only generates classes it can see as complete strings. Interpolated class names like `` `-translate-y-${subtitleY}` `` in `SectionTitle.jsx` will not be generated; use a lookup map of full class strings (as `Education.jsx` does with `stateClasses`) or inline `style`.
