# React 19 Cheat Sheet (one-page reference)

> For interview-day review. Read this once the morning of.

> See also: `01-mental-models.rd` (deep dives) · `03-interview-qa.rd` (rehearsal Q&A).

---

## Hooks

| Hook | Purpose | Gotcha |
| --- | --- | --- |
| `useState` | Local state | Identity stability matters for memoization |
| `useEffect` | Sync with external systems | Not for derived state — derive in render |
| `useMemo` | Cache expensive value | Compiler handles most cases; use for cross-boundary refs |
| `useCallback` | Stable function ref | Same; mostly Compiler territory |
| `useRef` | Mutable container, no re-render | Don't read/write during render |
| `useContext` | Subscribe to context | Subscribes the whole component |
| `useTransition` | Mark updates non-urgent | UI stays responsive during pending |
| `useDeferredValue` | Defer a value | Pairs with fast-changing inputs |
| **`useActionState`** | Form state machine | `[state, formAction, isPending]` |
| **`useFormStatus`** | Read parent form status | Must be inside form's subtree |
| **`useOptimistic`** | Optimistic UI | Reverts on action error automatically |
| **`use(promise)`** | Read a Promise | Suspends; needs `<Suspense>` boundary |
| **`use(context)`** | Read Context | Works inside conditionals |
| `useId` | Stable SSR-safe ID | Don't use for keys |
| `useSyncExternalStore` | Subscribe to external store | The right way to integrate non-React state |
| `useImperativeHandle` | Customize ref handle | Pair with `forwardRef` (or pass ref as prop) |
| `useLayoutEffect` | Sync DOM before paint | Blocks paint — use sparingly |
| `useDebugValue` | DevTools label | No-op in production |

## Components / APIs

- **Action** — async fn passed to `action` prop or form `action`. Handles pending/error/optimistic.
- **`"use client"`** — marks a module as a Client Component (Next.js).
- **`"use server"`** — marks a function as a Server Action (Next.js).
- **`<Suspense>`** — shows fallback while children are pending.
- **`<Profiler>`** — measures render performance.
- **`<StrictMode>`** — double-invokes components in dev to surface side effects.
- **`<ErrorBoundary>`** — class component, catches render errors.

## ref-as-prop (no more `forwardRef` in most cases)

```jsx
// Before
const Inner = forwardRef((props, ref) => <input ref={ref} {...props} />);

// React 19
function Inner({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

`forwardRef` still works but is no longer required for function components.

## React Compiler — quick rules

1. Components and hooks must be **pure**.
2. Don't mutate values during render.
3. Don't read/write refs during render (except initialization).
4. The Compiler infers dependencies from usage — no manual dependency arrays needed for memoization.
5. Use ESLint plugin to catch violations.

## Server Components vs Client Components — decision tree

```text
Need interactivity (onClick, onChange)? ──yes──► Client Component
                          │
                          no
                          │
Need browser APIs (localStorage, window)? ──yes──► Client Component
                          │
                          no
                          │
Heavy data / DB / secrets? ──yes──► Server Component
                          │
                          no
                          │
Both? ──► Server fetches, passes to Client via composition
```

## Async transitions (React 19)

```jsx
function Search({ onSearch }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const value = e.target.value;
    startTransition(async () => {
      const results = await fetchResults(value);
      onSearch(results);
    });
  }
}
```

`isPending` stays `true` until the async function resolves.

## Suspense vs Concurrent — quick distinction

- **Suspense** = boundary that shows fallback while children pending.
- **Concurrent rendering** = scheduler that can pause/abort/restart work.
- Suspense works *because of* concurrent rendering.

## Hydration mismatch — quick checklist

Server HTML must match first client render. Causes:

- `new Date()` in render
- `typeof window` checks
- `Intl` formatting differences
- `Math.random()` without `useId`

Fix: do these in `useEffect` (post-mount) or use `useId` / `useSyncExternalStore`.

## Memoization post-Compiler — when still manual

- Stable callbacks for non-React third-party widgets
- Object refs in `useEffect` deps
- Profiled hot paths the compiler missed

---

*React 19 stable since Dec 2024. Compiler production-ready through 2025.*
