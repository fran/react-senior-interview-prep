const App = () => {
  return (
    <main className="flex min-h-svh items-center justify-center bg-zinc-950 px-6 text-zinc-50">
      <section
        className="flex max-w-xl flex-col items-center gap-4 text-center"
        aria-labelledby="hello-heading"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
          React 19
        </p>
        <h1
          id="hello-heading"
          className="text-6xl font-semibold tracking-tight"
        >
          Hello
        </h1>
        <p className="text-lg text-zinc-400">
          Practice drills sandbox. Start in{' '}
          <code className="rounded bg-zinc-900 px-2 py-1 font-mono text-sm text-zinc-200">
            src/App.tsx
          </code>.
        </p>
      </section>
    </main>
  )
}

export default App
