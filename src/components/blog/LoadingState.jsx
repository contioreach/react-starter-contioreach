/* Shown while a route's data is in flight. Skeletons rather than a spinner, so
   the page does not visibly jump when the real content lands. */
export function ListingSkeleton() {
  return (
    <div aria-hidden className="grid animate-pulse gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="aspect-[16/9] bg-white/[0.04]" />
          <div className="space-y-3 p-6">
            <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
            <div className="h-3 w-full rounded bg-white/[0.04]" />
            <div className="h-3 w-5/6 rounded bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-4xl animate-pulse space-y-5 px-6 py-20">
      <div className="h-3 w-24 rounded bg-white/[0.06]" />
      <div className="h-10 w-4/5 rounded bg-white/[0.06]" />
      <div className="h-4 w-full rounded bg-white/[0.04]" />
      <div className="h-4 w-11/12 rounded bg-white/[0.04]" />
      <div className="mt-10 aspect-[16/8] rounded-3xl bg-white/[0.04]" />
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", children }) {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-16 text-center">
      <p className="text-lg font-medium text-white">{title}</p>
      <p className="mt-2 text-sm text-zinc-400">
        {children || "The content could not be loaded. Try again in a moment."}
      </p>
    </div>
  );
}

// Announced to assistive tech while a route's data loads.
export function LoadingAnnouncer({ loading }) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {loading ? "Loading" : ""}
    </span>
  );
}
