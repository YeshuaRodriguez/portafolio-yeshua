# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page personal portfolio built with React 19 + Vite 8 (plain JavaScript/JSX, no TypeScript). Styling is Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config.js`), animation uses `motion` (`motion/react`), icons come from `lucide-react`. The React Compiler is enabled through `@rolldown/plugin-babel` + `reactCompilerPreset()` in `vite.config.js`, so manual `useMemo`/`useCallback` is generally unnecessary. Remote: `github.com/YeshuaRodriguez/portafolio-yeshua` (branch `main`). The owner communicates in Spanish.

## Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # ESLint (flat config: js recommended, react-hooks, react-refresh)
```

There is no test suite.

## Architecture

- Entry chain: `index.html` → `src/main.jsx` → `src/Router.jsx` (BrowserRouter) → `src/Layout.jsx` (route `/`, fixed scroll-progress bar + `<Outlet/>`) → `src/App.jsx` (index route).
- `App.jsx` stacks the sections in order: `Hero` (next to `QuickNav`), `About`, `MyCurrentStack`, `Education`, `Projects`, `Contact` (all in `src/Components/`). New sections are added there.
- Each section has an `id` (`about`, `stack`, `education`, `projects`, `contact`) that `QuickNav.jsx` scrolls to via its `links` array (labels `1.`–`5.`). A new section needs an id and a QuickNav entry. QuickNav is the vertical quick-navigation bar next to the Hero; its thick right border (`border-r-5`, red on hover) is the intentional rail design (owner confirmed), not a card accent. Don't "fix" it if a design linter flags it.
- Sections are numbered with a Japanese subtitle (`"1. について"` … `"5. 連絡"`). Most use the shared `ui/titles/SectionTitle.jsx` (optional `alert` prop renders a pinging icon that opens a node, e.g. `ui/Tooltip.jsx`, on click); Education and Contact use their own left-aligned titles.
- Content is hard-coded as data arrays mapped by the component, not a CMS: `stacks` (MyCurrentStack), `education` + `sections` (Education, items keyed by `type`: certification | course | future, `status`: active | inProgress | inactive, optional `link`/`year`), `projects` (Projects, one open row at a time; `githubEnabled` toggles the repo link; `imageEnabled` toggles the image block, and `image: null` with `imageEnabled: true` shows the `[ CAPTURA ]` placeholder), `fields` (Contact).
- Project images are 17:10 (`aspect-[17/10]`, 340 px wide on `md+`), rendered with `object-contain` on a `page-bg` background so other ratios fit without cropping. Files are `assets/img/projects/<n>.webp`, named by project number, imported as `project<n>Img`. Export new ones at ~1360×800 WebP.
- The Projects disclaimer text lives in the `disclaimer` array in `Projects.jsx` (rendered by `ProjectsDisclaimer` inside `Tooltip`). `SectionTitle` takes `alertClassName` to position/size the popup (default `absolute right-0 top-8 w-72`; Projects uses a wider one, fixed full-width on mobile). `Tooltip` wraps `content` in a scrollable `div` (`max-h-[70vh]`), so it accepts JSX.
- `Hero.jsx` is a mouse-driven parallax: stacked full-bleed layers from `img/`, shifted by `useMotionValue`/`useTransform` with a per-layer `strength`; the `pointermove` listener is on `window`, so it reacts anywhere on the page.
- Reusable bits live in `src/Components/ui/` (`chips/TechChip.jsx`, `titles/SectionTitle.jsx`, `Tooltip.jsx`).

## Assets

- Assets live in a root-level `assets/` folder (not `src/assets/`): `assets/img/hero/` (Hero layers + `remolino-tinta.webp` used by Contact), `assets/img/Logos/` (stack logos), `assets/img/projects/`, `assets/img/iconos/` (favicons, not wired yet), `assets/fonts/`, `assets/documents/` (CV source `cvprueba.pdf`). Images are WebP. From `src/Components/` import as `../../assets/img/...`.
- `public/` holds `favicon.png` (what `index.html` uses) and the downloadable CV (`public/cv-yeshua-rodriguez.pdf`, linked from `About.jsx`).
- Fonts are declared with `@font-face` in `src/index.css` (`url("../assets/fonts/...")`): `Akira` (`font-akira`, display) and `DM Sans` (`font-dm-sans`, body).
- Unused files: `LogoClaude.svg`, `HEROTITLE (1).webp`, `HERONOISE2.webp`.
- `server/` is the backend (Express 5, CommonJS, own `package.json`/`node_modules`). `cd server && npm run dev` (port 3000, `node --watch --env-file=.env`; `.env` holds `RESEND_API_KEY`, gitignored). `POST /api/contact` sends the form fields as a plain-text email via Resend (`FROM`/`TO` constants in `app.js`); the visitor's email is only info in the body. No validation yet. In dev, Vite proxies `/api` → `localhost:3000` (`vite.config.js`); production hosting is undecided. ESLint has a `server/**` block with Node globals.
- Domain: `yeshuarodriguez.dev`, DNS on Cloudflare, verified in Resend via Cloudflare auto-setup (root domain and the `mail.` subdomain). Sender and recipient come from `MAIL_FROM` / `MAIL_TO` in `server/.env` (template in `server/.env.example`; `app.js` exits if any var is missing). Don't hardcode the recipient email in committed files (public repo).
- Hosting: two Cloudflare Workers. Front = Worker `portafolio-yeshua` serving `dist/` as static assets (`wrangler.jsonc` at the root, SPA fallback; Workers Builds runs `npm run build` + `npx wrangler deploy`, previews `npx wrangler versions upload`, Node pinned by `.node-version`). API = separate Worker (not built yet) running Express via `nodejs_compat` + `httpServerHandler`, routed at `yeshuarodriguez.dev/api/*`; `app.js` must move to ESM and drop `app.listen`/`process.exit` for that. Branches: `main` = production, `dev` = work/previews. In Workers, `MAIL_TO` and `RESEND_API_KEY` go in as secrets (`wrangler secret put`), not in `wrangler.toml` vars. Hardening plan: Turnstile, a WAF rate-limit rule (shared with the CV path), a KV daily cap, schema validation, a fixed `from` with the visitor in `reply_to`, a honeypot and a minimum time.

## Theming

All design tokens are in `src/index.css`: CSS variables in `:root` (`--page-bg`, `--red-primary`, status colors `--active`/`--inactive`/`--inProgress`, `--page-accent`, `--cream`, darker `--page-bg-1x0` via `color-mix`), exposed to Tailwind in the `@theme` block as `--color-*`. To add a color utility, define the variable in `:root` and map it in `@theme`. Text/borders use `cream` (`#e8e0d5`, a test that replaced Tailwind `white`; revert by swapping `-cream` back to `-white`). `src/App.css` is empty. Prefer existing variables over new ones, and tell the owner when one is added.

## Gotchas

- Tailwind v4 only generates classes it sees as complete strings. `SectionTitle.jsx` builds `` `-translate-y-${subtitleY}` `` / `-translate-x--${subtitleX}` dynamically, so those offsets are not generated (known, unfixed); use lookup maps of full class strings (as `Education.jsx` does with `stateClasses`).
- `Contact.jsx` section is full-bleed via negative margins (`-mx-4 sm:-mx-6 lg:-mx-8`) that cancel `<main>`'s padding in `App.jsx`; change both together.

## Status / TODO (remind the owner of these when relevant)

Done so far: Hero parallax, About with CV download, Stack, Education (timeline layout with per-section counter and `+`/`−`), Projects accordion (10 entries, images for 01/03/04/05/07/09/10, final disclaimer tooltip), Contact (frontend only, ink-swirl background), QuickNav 1–5, `--cream` palette test, assets reorganized into `assets/` and converted to WebP. First commit pushed to `main`; later changes may be uncommitted.

Pending:
- **Backend (started in `server/`):** Contact form posts to `/api/contact` (Resend, static sender). Still needs: production hosting for the server, field validations/regex (rules already shown as help text under each field: subject 3–80, name 2–60, email ≤100, phone optional 8–15 digits, message 20–1000) and a honeypot anti-spam field.
- **CV download rate limiter:** the PDF in `public/` is directly reachable, so a UI limiter is useless. Decide hosting first. Option A (recommended if on Cloudflare): rate-limiting rule on `/cv-yeshua-rodriguez.pdf` (e.g. 5 req/min/IP), no code. Option B: own endpoint (`/api/cv`) that applies the limiter and serves the PDF with `Content-Disposition: attachment`, PDF moved out of `public/`, button shows a message on `429`. Optional: Cloudflare Turnstile, download counter.
- **Projects content:** images for 02/06/08, years (`year: null`), GitHub repos + `githubEnabled`. Project images 1/7/9/10 are 1–1.5 MB; re-export at ~1360 px wide.
- **CV:** `documents/cvprueba.pdf` is currently published as the CV; replace with the final version when ready.
- **Badges:** add rest of the badges references to education section.
- **Tech debt:**  `SectionTitle` dynamic-class bug (see Gotchas); `Layout.jsx`/other leftovers not reviewed.
- **`index.html`:** `<title>` is still `portafolio-yeshua`; no meta description/OG tags; favicon points to `/favicon.png` (decide whether to use `assets/img/iconos/` instead); confirm `lang`.
- **QA:** the site has not been verified in a browser at mobile widths (QuickNav next to Hero, new sections). The Vite template `README.md` is unchanged.
