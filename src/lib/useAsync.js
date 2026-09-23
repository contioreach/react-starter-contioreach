import { useEffect, useRef, useState } from "react";

/* The one data-fetching primitive in this app. A framework would hand you
   this; in a plain React SPA it is about thirty lines, and writing it out is
   more honest than pulling in a query library for four call sites.

   It tracks loading and error state, and ignores the result of a request that
   has been superseded — so navigating quickly between two posts can never
   render the slower one's response over the newer one. */
export function useAsync(loader, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  /* Incremented on every run; a resolved promise whose id no longer matches
     belongs to a navigation the user has already left behind. */
  const runId = useRef(0);

  useEffect(() => {
    const id = ++runId.current;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    loader()
      .then((data) => {
        if (id === runId.current) setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (id === runId.current) setState({ data: null, error, loading: false });
      });

    return () => {
      // A cleanup means this run is stale, even if it is still in flight.
      if (id === runId.current) runId.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
