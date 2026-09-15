# The Four Mental Models

These are the four mental models a senior React engineer must internalize. They form the spine of most interview answers.

> See also: `02-react19-cheatsheet.rd` (one-page reference) · `03-interview-qa.rd` (12 senior Q&A).

---

## Mental Model A — How React thinks about your code

### The core loop

```text
state ──► render() ──► Virtual DOM (fiber tree)
                          │
                          ▼
                    Reconciliation (diff old vs new)
                          │
                          ▼
                    Commit (mutate real DOM, run effects)
```

### Three non-negotiable facts

1. **Render is interruptible and pure.**
   Since React 18, rendering can be paused, aborted, or restarted. Side effects and side-effecting APIs do NOT belong in render — only in `useEffect` or event handlers.

2. **Two phases: render vs commit.**
   - *Render* is pure, can be retried, never touches the DOM.
   - *Commit* is one-shot, synchronous, mutates the DOM, runs effects.
   - `useLayoutEffect` runs *during* commit (after DOM mutation, before paint).
   - `useEffect` runs *after* paint.

3. **Keys are for identity, not performance.**
   A bad key (e.g. array `index` on a reorderable list) breaks reconciliation correctness — components remount, state is lost. This is the #1 most common interview gotcha about lists.

### The senior answer pattern for "what happens when you call setState?"

> React schedules a re-render. The component function runs again with the new state. The output is a new fiber tree. React diffs it against the previous one (reconciliation). If the diff is non-empty, it commits to the DOM and runs effects. In concurrent mode, the render can be interrupted and restarted; the commit cannot.

### Bonus depth: Fiber

- Each component instance is a "fiber" node — a unit of work.
- Fibers form a tree (parent/child/sibling).
- React maintains a "current" tree and a "work-in-progress" tree during concurrent rendering.
- Updates have a `lane` (priority) — transitions are lower priority than user input.

---

## Mental Model B — React 19's form & data model

### Pre-19 manual orchestration

```jsx
function Form() {
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      try { await save(name); } catch (e) { setError(e); }
    });
  }
  return <form onSubmit={onSubmit}>...</form>;
}
```

### React 19 declarative version

```jsx
async function saveName(prev, formData) {
  const name = formData.get("name");
  await save(name);
  return { ok: true };
}

function Form() {
  const [state, action, isPending] = useActionState(saveName, { ok: false });
  const [optimistic, setOptimistic] = useOptimistic(state);

  return (
    <form action={action}>
      <input name="name" />
      <SubmitButton />
      {optimistic.ok && <p>Saved!</p>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Saving…" : "Save"}</button>;
}
```

### The four pieces — and how they compose

| Piece | Role |
| --- | --- |
| **Action** | Async function that mutates state, runs on submit. Can be a Server Action. |
| **`useActionState(action, initial)`** | Returns `[state, formAction, isPending]`. Replaces `useState` + `useTransition` boilerplate. |
| **`useFormStatus()`** | Inside a form's subtree, reads parent form's status (pending, data, method, action). |
| **`useOptimistic(state, update)`** | Shows optimistic value during action, snaps back if action fails. |

**Critical detail:** `useFormStatus` must be called inside a form's component subtree (a descendant of `<form>`). Calling it elsewhere returns stale status.

### `use()` — the other big shift

`use()` reads a Promise or a Context. It is the only hook you can call **conditionally**:

```jsx
function Profile({ userPromise, theme }) {
  const user = use(userPromise); // suspends until resolved
  const ctx = use(theme);        // OK to call inside conditionals
  return <div className={ctx}>{user.name}</div>;
}
```

- `use(promise)` integrates with Suspense — the component suspends until the promise resolves, showing the nearest `<Suspense>` fallback.
- `use(context)` works inside conditionals, unlike `useContext`.

### Optimistic updates — the canonical pattern

```jsx
function LikeButton({ postId, initialLikes }) {
  const [likes, setOptimisticLikes] = useOptimistic(initialLikes);
  const [, startTransition] = useTransition();

  function like() {
    startTransition(async () => {
      setOptimisticLikes((n) => n + 1);  // instant UI
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      // On error, setOptimisticLikes reverts automatically when this transition ends.
    });
  }

  return <button onClick={like}>♥ {likes}</button>;
}
```

---

## Mental Model C — Performance is about commits, not renders

### The misconception

Most developers memoize to "prevent re-renders." But:

- **Re-render is cheap.** Running a function component is just function calls.
- **Reconciliation is fast** (O(n) with heuristics — keys, type identity).
- **Commit is what hurts** — it mutates the DOM, runs layout effects, forces reflow.

So the calculus is: *will the commit do expensive DOM work?* If yes, memoize. If no, let it re-render.

### When memoization actually matters (pre-Compiler)

- Large list of expensive children (e.g. 1000 row table with non-trivial cell render).
- A child re-renders visibly because of prop churn (e.g. animations).
- Stable callbacks needed as `useEffect` deps or passed to non-React libs.
- Avoiding cascading re-renders through Context.

### React Compiler (stable 2025) shifts the calculus

The Compiler auto-inserts memoization based on AST analysis. You can mostly stop manually wrapping in `React.memo` / `useMemo` / `useCallback`.

### What the Compiler does NOT do

- ❌ Memoize across component boundaries you didn't mark with `/*#__PURE__*/` or proper memo boundaries.
- ❌ Help with large lists (still need virtualization — `react-virtuoso`, `@tanstack/react-virtual`).
- ❌ Fix bad architecture (parent re-renders 1000 children is still bad).
- ❌ Replace thoughtful Suspense boundaries for streaming.
- ❌ Help non-pure components (mutations during render break assumptions).

### When to still use manual memoization post-Compiler

- Stable callbacks passed to non-React third-party widgets (e.g. a Chart.js instance).
- Referential equality for objects passed to `useEffect` deps.
- Hot paths you've profiled in DevTools.

### Profiling workflow

1. Open React DevTools Profiler.
2. Record an interaction.
3. Find commits with long render times.
4. Walk the tree to find expensive components.
5. Use `why-did-you-render` to catch wasteful re-renders.
6. Measure before fixing — don't guess.

---

## Mental Model D — RSC is two trees with different rules

### Server Components (RSC)

- Render on the server, **never ship JavaScript** to the client.
- Can: read filesystem, env vars, DB directly; render huge trees; nest other Server Components.
- Cannot: use hooks (`useState`, `useEffect`); handle events (`onClick`, `onChange`); access browser APIs.

### Client Components

- Regular React components you know — they hydrate on the client.
- Marked with `"use client"` at the top of the file.
- Can: use hooks, handle events, access browser APIs.
- Cannot: directly access server-only resources (secrets, DB).

### The architecture

```text
   Server tree                Client tree
   ────────────               ────────────
   Heavy data fetching        Interactivity
   DB / fs / secrets          Browser APIs
   No JS shipped              Hydration cost
   No interactivity           No server secrets
        │                          │
        └──── composition ─────────┘
              (passing Server Components
               as children/props to Client
               Components is the key pattern)
```

### The pattern senior interviewers care about

You can pass a Server Component *as a prop* to a Client Component, and the Client Component will render it without re-fetching:

```jsx
// page.js (server)
import { ClientWrapper } from "./client";
import { HeavyData } from "./heavy"; // server component

export default async function Page() {
  const data = await db.query(...);
  return (
    <ClientWrapper>
      <HeavyData data={data} /> {/* stays server-rendered */}
    </ClientWrapper>
  );
}
```

### Server Actions

- Async functions that run on the server, callable from client forms.
- Forms can submit directly to a Server Action — no API route needed for internal mutations.
- Use for: forms in your own app, optimistic mutations, type-safe RPC.
- Use API routes for: external clients, webhooks, public APIs, when you need HTTP semantics.

### Streaming SSR

- Server sends HTML in chunks as data resolves.
- `<Suspense>` boundaries let independent parts stream independently.
- Each boundary shows its fallback while its data is pending.
- Hydration happens per-boundary, not page-at-a-time.

### Hydration gotchas

Server HTML must match first client render. Common causes of mismatch:

- `new Date()` in render (different on server vs client).
- `typeof window` checks.
- Locale differences (`Intl` formatting).
- Random values without `useId`.

Fix: do these in `useEffect` (post-mount) or use `useId` / `useSyncExternalStore`.

---

*See also: `02-react19-cheatsheet.rd` (one-page reference) · `03-interview-qa.rd` (12 senior Q&A) · `04-practice-drills.rd` (live coding + system design).*
