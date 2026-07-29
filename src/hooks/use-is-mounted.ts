import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * Returns false during SSR and the initial client render, then true after
 * hydration completes. Used to defer rendering of client-only state (e.g.
 * auth UI derived from a cookie the server never sees) without triggering
 * a hydration mismatch. Preferred over the classic
 * `useEffect(() => setMounted(true), [])` pattern, which eslint's
 * react-hooks/set-state-in-effect rule now flags.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
