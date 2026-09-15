# Practice Drills

> See also: `00-overview-and-plan.rd` (when to run these) · `03-interview-qa.rd` (verbal rehearsal) · `01-mental-models.rd` (concepts to lean on).

---

## Live Coding Drill (30 min, record yourself)

### Build: "Debounced search input with results" — React 19 style

**Requirements:**

- Input field with debounced value (300 ms).
- Results list fetched from a mock API (Promise you `await`).
- Loading state via `useTransition`.
- Empty / error states.
- Bonus: optimistic "favorite" toggle per result.

**Narrate as you code:**

- "I'm choosing `useTransition` here because…"
- "I'm NOT memoizing because the Compiler will handle it…"
- "This is a Client Component because of `onChange`…"
- "The fetch function would be a Server Action in production because…"

**Evaluation criteria:**

- Did you choose hooks deliberately?
- Did you explain trade-offs?
- Did you handle errors?
- Did you keep the data flow obvious?

### Variation prompts (pick one if you want extra reps)

- "Add keyboard navigation (↑/↓ to select result, Enter to commit)."
- "Cache the last 5 searches and show them in a recent list."
- "Add an abort controller so out-of-order responses don't overwrite the latest."
- "Refactor to a custom hook `useDebouncedSearch` and explain why."

---

## System Design Drill (45 min, written)

### Design: Reddit-style feed with React constraints

**Requirements:**

- Server-rendered initial feed (SEO + first paint).
- Optimistic upvotes.
- Infinite scroll without losing scroll position.
- Real-time new comments (SSE or WebSocket).
- Per-row error boundary.

### Your design doc must answer

1. **Which components are Server vs Client? Why?**
   - List each component with its boundary type and justification.
   - Identify which components fetch data and where.

2. **Where do Suspense boundaries go? Why those cuts?**
   - Mark each boundary on the tree.
   - Explain what each boundary buys you (faster paint, better error isolation, etc.).

3. **How do you handle optimistic upvotes across the list?**
   - Where does the optimistic state live?
   - How does it reconcile with server state?
   - What happens on error — row level or page level?

4. **How do you preserve scroll position on infinite scroll?**
   - What library or pattern? (`@tanstack/react-virtual`, custom, etc.)
   - How do you handle the URL (`?page=N` or cursor)?

5. **How do you integrate real-time updates without breaking SSR?**
   - SSE vs WebSocket trade-off.
   - Where does the subscription live (Client Component)?
   - How do you avoid hydration mismatches with new comments?

6. **What does the data flow look like end-to-end?**
   - One-paragraph narrative: request → server fetch → RSC payload → hydration → client interactivity → optimistic mutation → server confirmation → UI reconcile.

### Bonus: design constraints to push yourself

- 10,000 items in the feed (force virtualization).
- Offline mode (cache last feed, queue mutations).
- Multi-tab consistency (upvote in tab A → tab B updates).
- Accessibility: keyboard nav, screen reader announcements for new comments.

---

## Mock Interview (Day 14, optional but recommended)

Pair with a friend (or use a rubber duck / record yourself). Structure:

1. **Warm-up (10 min):** Ask 2 random Q&A from `03-interview-qa.rd`. Have them time you.
2. **Live coding (30 min):** Run the search drill above. Have them throw in "wait, what if we need X?" mid-build.
3. **System design (30 min):** Walk through the Reddit feed design. Have them challenge trade-offs.
4. **Debrief (10 min):** What felt shaky? Re-read the relevant section of `01-mental-models.rd`.

---

*See also: `05-resources.rd` for further reading.*
