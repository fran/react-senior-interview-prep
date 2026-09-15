# 12 Senior Interview Q&A (3-min verbal format)

> Practice each out loud, timed at 3 minutes. Goal: skeleton answers you can flesh out under pressure.

> See also: `01-mental-models.rd` (the deep material behind these answers) · `02-react19-cheatsheet.rd` (quick ref).

---

### Q1. Walk me through what happens when this component renders and `setState` is called

**Skeleton answer:**

1. React schedules a re-render (assigns a lane/priority).
2. The component function runs again with the new state.
3. The output is a new fiber tree.
4. React diffs it against the previous one (reconciliation).
5. If the diff is non-empty, commit phase runs: DOM mutation, layout effects, paint.
6. `useEffect` runs after paint.
7. In concurrent mode, render can be interrupted; commit cannot.

**Bonus:** mention Fiber as the unit of work, the work-in-progress tree, and that `useTransition` lowers the lane priority.

---

### Q2. What's the difference between `useMemo` and `useCallback`? When do you actually need them post-Compiler?

**Skeleton answer:**

- `useMemo` caches a computed value; `useCallback` is `useMemo(fn, [])` for function refs.
- Both are optimization, not semantics. Removing them shouldn't break correctness.
- React Compiler auto-inserts memoization for components and hooks based on AST analysis.
- **Still need manual memo when:**
  - Passing callbacks to non-React third-party widgets (referential identity matters).
  - Objects passed to `useEffect` deps.
  - Profiling shows hot paths the compiler missed.

---

### Q3. When would you use a Server Component vs a Client Component?

**Skeleton answer:**

- **Server Component:** heavy data fetching, secrets, large deps, no interactivity, SEO-critical content. Doesn't ship JS.
- **Client Component:** interactivity (events, state), browser APIs, third-party UI libs that need hydration.
- **Hybrid:** Server fetches and renders structure, Client handles interaction. Pass Server Components as children/props to Client Components to keep server work on the server.
- **Heuristic:** start with everything as Server Component; add `"use client"` only where you need hooks/events.

---

### Q4. How does the React Compiler decide what to memoize?

**Skeleton answer:**

- AST-level analysis during build.
- Tracks which values flow into components and hooks.
- Inserts memoization where a value would otherwise change identity unnecessarily.
- **Requires pure components** — no mutations during render, no ref reads during render.
- **Doesn't memoize:** side effects, cross-module boundaries without `/*#__PURE__*/`, large lists (virtualization is still your job), effects themselves.

---

### Q5. Explain `useEffect` cleanup. What happens if you don't return a cleanup function?

**Skeleton answer:**

- Cleanup runs before the next effect and on unmount.
- Use it for: subscriptions, timers, event listeners, manual DOM mutations.
- Without cleanup: subscriptions leak (memory grows), timers keep firing, listeners stack.
- Example pattern:

  ```jsx
  useEffect(() => {
    const sub = api.subscribe(handler);
    return () => sub.unsubscribe();
  }, [handler]);
  ```

**Bonus:** mention `useEffect` is for syncing with *external* systems, not for derived state (which should be computed in render).

---

### Q6. How do you debug a performance issue in a React app?

**Skeleton answer:**

1. Reproduce with React DevTools Profiler.
2. Identify commits with long render times.
3. Walk the component tree to find expensive components.
4. Use `why-did-you-render` to catch wasteful re-renders.
5. Check for: missing keys, unstable callbacks, context overuse, large lists without virtualization.
6. Measure before fixing — don't memoize on speculation.
7. For Server Components: check the RSC payload size in the network tab.

**Bonus:** mention the Compiler changes the default — fewer manual memoization questions, more "is the architecture right?"

---

### Q7. Design optimistic updates for a "like" button using React 19

**Skeleton answer:**

- `useOptimistic(initialState, updateFn)` returns `[optimisticState, addOptimistic]`.
- On click: call `addOptimistic(n => n + 1)` inside `startTransition`.
- Send the server request inside the same transition.
- On server error: the optimistic value reverts when the transition ends.
- Server Actions make this cleaner — the action is just an async function.

```jsx
const [likes, addOptimistic] = useOptimistic(initialLikes);

function like() {
  addOptimistic(n => n + 1);
  startTransition(async () => {
    await toggleLike(postId);
  });
}
```

---

### Q8. What's the difference between Suspense and concurrent rendering?

**Skeleton answer:**

- **Suspense** is a *boundary* — a component that shows a fallback while its children are pending.
- **Concurrent rendering** is the *scheduler* — can pause, abort, or restart rendering of work.
- Suspense works *because of* concurrent rendering. Without concurrency, Suspense couldn't show a fallback while waiting.
- Practical: Suspense for data + transitions = UI stays responsive while data loads.

---

### Q9. When would you NOT use Next.js?

**Skeleton answer:**

- Pure client-side apps with no SEO needs (internal tools, dashboards).
- When the team is stronger in another framework (Remix, Astro, SvelteKit).
- When you need full SPA behavior with no server rendering at all.
- When hosting constraints rule out Node.js runtime (Vercel, Cloudflare, AWS — though most support Next now).
- When the cost of learning the App Router + RSC model exceeds the benefit.

**Bonus:** mention that "use Next.js" is rarely the wrong answer for a content-heavy public site in 2026.

---

### Q10. Explain hydration. What can go wrong?

**Skeleton answer:**

- Server renders HTML and sends it to the browser.
- Browser displays HTML immediately (fast first paint).
- React loads, "hydrates" the HTML — attaches event listeners, reconciles with virtual DOM.
- **Hydration mismatch** = server HTML ≠ first client render. React warns and re-renders the mismatched part.
- Common causes: `new Date()` in render, `typeof window`, `Math.random()`, locale-dependent formatting.
- **Fixes:** do time/random/locale-dependent work in `useEffect`, use `useId`, use `useSyncExternalStore` for external state.

---

### Q11. What's a Server Action? When would you use it vs an API route?

**Skeleton answer:**

- **Server Action** = async function marked `"use server"` that runs on the server, callable from client (typically via a form action or directly).
- **API route** = HTTP endpoint that returns JSON.
- **Use Server Action for:** forms in your own app, type-safe mutations, optimistic updates, no need for external clients.
- **Use API route for:** external clients (mobile, third-party), webhooks, public APIs, when you need HTTP semantics (auth, caching headers, rate limiting per client).

**Bonus:** Server Actions are essentially RPC. API routes are REST. Choose based on who calls them.

---

### Q12. Walk me through reconciliation. Why are keys important?

**Skeleton answer:**

- React diffs the previous fiber tree against the new one to compute the minimum DOM mutations.
- **Heuristics:** same component type at same position → reuse; different type → unmount + remount.
- **Keys** identify a child across renders within a list. Without stable keys, React matches by position — which breaks when items reorder/insert/delete (state is lost, components remount).
- Bad keys (index, random per render) cause correctness bugs, not just perf bugs.
- Keys are for *identity*, not for *performance* — though stable keys also help reconciliation skip work.

---

## Rehearsal tips

- **Time yourself** — 3 minutes per answer, then stop. If you ran long, cut the bonus; if short, expand Q1 or Q8.
- **Speak, don't read** — record yourself and listen back. The interview is verbal.
- **Lead with the answer** — don't bury it in preamble. "React schedules a re-render..." is a strong opener.
- **Use "it depends" honestly** — only when you immediately follow with what it depends on.
- **Pair Q1 + Q12** — they share material (reconciliation, fiber). Practice them back-to-back.

---

*See also: `01-mental-models.rd` (deep dives) · `04-practice-drills.rd` (live coding + system design) · `05-resources.rd` (further reading).*
