# React Senior Study Notes — Overview & Plan

> **Audience:** Senior React engineers (5–8 yrs) leveling up in early 2026.
> **React version:** 19 (stable since Dec 2024; React Compiler production-ready through 2025).
> **Format:** Mixed — assumes live coding + system design + Q&A.
> **Time budget:** ~30 hours over 14 days.

---

## File index

| # | File | Purpose |
| --- | --- | --- |
| 00 | `00-overview-and-plan.md` | This file — overview, reading order, 2-week plan, Day-14 checklist |
| 01 | `01-mental-models.md` | The four mental models (full depth, with code) |
| 02 | `02-react19-cheatsheet.md` | One-page React 19 reference |
| 03 | `03-qa.md` | 12 senior Q&A (3-min verbal format) |
| 04 | `04-practice-drills.md` | Live coding + system design drills |
| 05 | `05-resources.md` | Curated resources (current early 2026) |

---

## How to use

1. **Day 1:** Read 00 → 01 → 02 end-to-end to internalize the shape (~2 hours).
2. **Days 2–10:** Work the daily theme + relevant section from 01.
3. **Day 11:** Use 03 as your rehearsal script — speak out loud, timed at 3 min per answer.
4. **Day 12:** Run the live coding drill from 04. Record yourself.
5. **Day 13:** Run the system design drill from 04. Write it down.
6. **Day 14 morning:** Re-read 02 (cheat sheet) + Day-14 checklist below.

---

## Two-week study plan (~2–3 hours/day)

| Day | Theme | Deliverable |
| --- | --- | --- |
| 1 | React's mental model: render → reconcile → commit, Fiber, virtual DOM | Write a 1-page explainer in your own words |
| 2 | Core hooks deep dive: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext` | Identify 3 anti-patterns in your old code |
| 3 | React 19 forms & data: `useActionState`, `useFormStatus`, `useOptimistic`, Actions | Refactor a form using Actions |
| 4 | React 19 hooks: `use()`, `useTransition` (async), ref-as-prop, `useId` | Compare pre-19 vs 19 patterns for the same feature |
| 5 | Patterns: compound components, custom hooks, render props, headless components | Build a small headless `Tabs` from scratch |
| 6 | Performance: re-render causes, memoization calculus, keys, Suspense, transitions | Profile a slow component with React DevTools |
| 7 | React Compiler: what it does, what it doesn't, mental shift in how you write code | Read the compiler docs + try it on a project |
| 8 | SSR fundamentals: hydration, streaming, hydration mismatch, suspense boundaries | Compare classic SSR vs streaming SSR |
| 9 | RSC architecture: Server vs Client Components, server-only code, RSC payload | Decide which components in a sample app should be RSC |
| 10 | Next.js App Router: layouts, loading/error UI, Server Actions, data fetching | Build a small CRUD feature with Server Actions |
| 11 | Rehearsal: write answers to the 12 questions (see `03-qa.md`) | Time yourself: 3 min per answer |
| 12 | Live coding drill (see `04-practice-drills.md`) | Record yourself |
| 13 | System design drill (see `04-practice-drills.md`) | Write a design doc |
| 14 | Final review: cheat sheet + weak spots + mock rehearsal | Confidence check |

---

## Day-14 closing checklist

- [ ] Re-read `02-react19-cheatsheet.md` once.
- [ ] Speak the 12 answers out loud, 3 min each (from `03-qa.md`).
- [ ] Do one full live coding drill, timed (from `04-practice-drills.md`).
- [ ] Do one full system design drill, written.
- [ ] Mock rehearsal with a friend (or rubber duck).
- [ ] Sleep. (Performance matters on the day.)

---

*Last updated: early 2026. React 19 stable; React Compiler production-ready.*
