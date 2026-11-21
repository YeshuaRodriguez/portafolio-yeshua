# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page personal portfolio built with React 19 + Vite 8 (plain JavaScript/JSX, no TypeScript). Styling is Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config.js`), animation uses `motion` (`motion/react`), smooth scroll uses Lenis, icons come from `lucide-react`. The React Compiler is enabled in `vite.config.js`, so manual `useMemo`/`useCallback` is generally unnecessary. Remote: `github.com/YeshuaRodriguez/portafolio-yeshua`. The owner communicates in Spanish.

```bash
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # ESLint (flat config: js recommended, react-hooks, react-refresh)
```

There is no test suite.

## Architecture

The entry chain is `index.html` → `src/main.jsx` (mounts Lenis and `MotionConfig`) → `src/Router.jsx` → `src/Layout.jsx` (navigation + `<Outlet/>`) → `src/App.jsx`, which stacks the sections from `src/Components/` in order: Hero, About, Stack, Education, Projects, Contact. Each section has an `id` and a numbered Japanese subtitle (`1. について` … `5. 連絡`); About and Projects use the shared `ui/titles/SectionTitle.jsx` (its optional `alert` opens a popup such as `ui/Tooltip.jsx`), the others have their own titles. Content is hard-coded as data arrays at the top of each component (`stacks`, `education`, `projects`, `fields`), not a CMS.

**Navigation** lives in `src/Components/nav/` and follows the owner's Claude Design mockups ("Rieles simétricos" for desktop, "Móvil 9:16" for mobile). `sections.js` is the single list of sections plus the helpers to jump to one (`goTo`, via Lenis) and to compute the active one; adding a section means giving it an `id` and an entry there. On `lg+` two fixed rails sit vertically centered on each side, the same height as the Hero image: `QuickNav` on the left and `ScrollProgress` (scroll fill, counter) on the right. Their geometry comes from three CSS variables in `index.css` (`--rail-inset`, `--rail-clear`, `--rail-h`); `--rail-clear` is also the side padding of `<main>`, so content never runs under the rails. Contact is full-bleed and wider than that column, so `Layout.jsx` pushes the rails up and away as Contact arrives, like a sticky element ending. Below `lg`, `MobileNav` is a fixed top bar instead. The design used other fonts and colors; the build maps them to the project tokens.

**Animations** go through `src/animations.js`: functions (`inUp`, `inDown`, `inRight`, `fadeIn`) that return props to spread on a `motion.*` element, e.g. `<motion.h2 {...inUp()} />`. They reveal once on entering the viewport with a small default delay and accept `delay`, `duration`, `distance`/`blur`, etc.; new ones should be built on the shared `reveal()` helper. The owner's conventions: in stacked titles the upper line rises (`inUp`) and the lower one drops (`inDown`) so both seem to come out of the middle; content paragraphs use `fadeIn`; lists cascade by giving each item `delay = step * (i + 1)` (0.1 s for long lists, 0.2 s for the form). Avoid `fadeIn` on many small elements, since animated blur is heavy on mobile. One-off coordinated effects stay local to their component (the Education timeline line drawing down with its diamonds popping in as it reaches them). `MotionConfig reducedMotion="user"` handles reduced motion; imperative `animate()` calls must check it themselves.

**Lenis** is mounted once as `<ReactLenis root>`. It drives the real window scroll, so `motion`'s `useScroll` keeps working. Any nested scrollable box needs `data-lenis-prevent` (as `Tooltip` has), or Lenis swallows its wheel events.

`Hero.jsx` is a mouse-driven parallax of stacked image layers (`useMotionValue`/`useTransform`, listener on `window`), in a 16:10 box at every width. Offsets inside it should be relative (percentages), because the box is much smaller on mobile.

## Assets

Assets live in a root-level `assets/` folder (not `src/assets/`), all images as WebP; from `src/Components/` import them as `../../assets/img/...`. Project images are 17:10, named `assets/img/projects/<n>.webp`, exported at ~1360×800. `public/` holds `favicon.png`, the OG image and the downloadable CV. Fonts (`Akira` for display, `DM Sans` for body) are declared with `@font-face` in `src/index.css`.

## Backend and hosting

`server/` is the contact API: Express 5 running as the Cloudflare Worker `portafolio-yeshua-api` (route `www.yeshuarodriguez.dev/api/*`), with its own `package.json`. Locally run `cd server && npm run dev` (`wrangler dev` on 8787, reads `server/.env`, template in `.env.example`); Vite proxies `/api` there. Leftover `workerd` processes can keep serving old code on 8787, so kill them if changes don't show. `POST /api/contact` checks, in order: config, `Origin`, JSON content type and size, honeypot and minimum fill time (these two fake a success), Valibot schema, Turnstile, and a KV daily cap; then it sends via Resend with a fixed `from` and the visitor as `replyTo`. `Contact.jsx` mirrors the same field rules natively and maps the returned `error` code to a message. Config comes from `import { env } from "cloudflare:workers"`; secrets are `RESEND_API_KEY`, `MAIL_TO` and `TURNSTILE_SECRET_KEY` (`npx wrangler secret list` in `server/`). The repo is public: never commit the recipient email or secrets.

The front is a second Worker, `portafolio-yeshua`, serving `dist/` as static assets (root `wrangler.jsonc`). Both deploy through Workers Builds with watch paths, so each one only rebuilds for its own files. `main` is production and `dev` is for previews. **Push `main` before `dev`**: if the same commit reaches `dev` first, it gets built only as a preview and production keeps the old version (fix with `npx wrangler versions deploy <id>@100%`). The Cloudflare dashboard side (redirect root → `www`, WAF rate limit on the contact and CV paths) is done; don't bring it up again, and use `wrangler` for read-only checks.

## Theming

All design tokens are CSS variables in `:root` in `src/index.css`, exposed to Tailwind in the `@theme` block as `--color-*`; to add a color utility, define the variable and map it there. Text and borders use `cream` instead of `white`. Prefer existing variables over new ones, and tell the owner when one is added.

## Gotchas

- Tailwind v4 only generates classes it sees as complete strings. Never build class names dynamically (`` `-translate-y-${n}` ``); use fixed classes or lookup maps of full class strings.
- Contact's full-bleed comes from negative margins that cancel `<main>`'s padding (including `--rail-clear` on `lg+`); change both together.
- Big Akira titles overflow on mobile and push the page wider (a white strip at the side); size them down at small breakpoints.

## Keeping this file current

Update this file whenever a major change is made (new section or feature, architecture or infra change, a TODO done or added, a decision by the owner). Keep it accurate and general rather than a changelog.

## Owner-side pending (remind the owner at the start of every session until they say it's done)

- Replace the placeholder CV (`public/cv-yeshua-rodriguez.pdf`, source `assets/documents/cvprueba.pdf`) with the final version.

## Pending (remind the owner when relevant)

Responsive is done for the navigation, Hero and About; Stack, Education, Projects and Contact still need a pass, keeping in mind that the content column on `lg` is narrower because of the rails. The site, including the new navigation and animations, still has to be checked in a real browser at several widths (390 to 1920) and on short viewports. Projects is missing images for 02/06/08 and the GitHub repos, and images 1/7/9/10 are 1–1.5 MB and should be re-exported. Contact needs social network links. The only parts still without animation are the Education group headers and the CV button. The `README.md` is still the Vite template.
