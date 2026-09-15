# Resources (current as of early 2026)

> See also: `01-mental-models.rd` (deep dives) · `03-interview-qa.rd` (rehearsal Q&A).

---

## Primary

- **react.dev** — official docs. Read `learn/`, especially:
  - `thinking-in-react`
  - `render-and-commit`
  - `reconciliation`
  - `scaling-up-with-reducer-and-context`
  - `react-compiler` section
- **react.dev/reference** — API reference for every hook (incl. React 19).

## Deep dives (mental model)

- **Overreacted.io** (Dan Abramov) — mental model essays. Older posts are still gold.
- **Joy of React** (Josh Comeau) — `joyofreact.xyz`. Friendly but technically accurate.
- **React Compiler docs** — `react.dev/learn/react-compiler`.

## Next.js / RSC

- **nextjs.org/docs** — App Router docs. Focus on:
  - Server Components
  - Server Actions
  - Data fetching patterns
  - Streaming / Suspense
- **nextjs.org/docs/app/building-your-application/rendering** — when to choose which rendering mode.

## RFCs & internals

- **reactwg** on GitHub — React Working Group discussions, RFCs, decisions.
- **github.com/facebook/react** — source code for the brave. The `packages/react-reconciler` directory is reconciliation.

## Performance

- **React DevTools Profiler** — built into `react-devtools`. Learn the "flamegraph" view.
- **why-did-you-render** — `github.com/welldone-software/why-did-you-render`. Catch wasteful re-renders.
- **TanStack Virtual / react-virtuoso** — large list virtualization.

## State management (if it comes up)

- **Zustand** — `github.com/pmndrs/zustand`. Minimal, idiomatic for most apps.
- **Jotai** — atomic state, good for derived state.
- **Redux Toolkit** — still relevant for large apps with complex state.
- **TanStack Query** — server state. The right tool for most "data fetching" problems.

## Testing (if it comes up)

- **React Testing Library** — `testing-library.com/react`. User-centric testing.
- **Vitest** — fast, modern test runner.
- **Playwright** — for end-to-end.

## Verbal interview prep (general)

- **"System Design Interview" by Alex Xu** — general patterns, not React-specific but useful for the design drill.
- **Pramp / interviewing.io** — free/cheap mock interviews with peers.

---

*Verify URLs and version numbers before citing in interviews — docs move. Last review: early 2026.*
