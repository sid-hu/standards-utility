import { onDestroy } from "svelte"

export function useKey(key: string, callback: () => void) {
  const handler = (e: KeyboardEvent) => {
    if (e.key === key) {
      callback()
    }
  }

  window.addEventListener("keydown", handler)
  onDestroy(() => window.removeEventListener("keydown", handler))
}

export function useClose(callback: () => void) {
  useKey("Escape", callback)
}

export function useMemo<T>(
  calculation: () => T,
  changed: (cached: T) => boolean
): () => T {
  let cached: T | undefined
  return () => {
    if (cached === undefined || changed(cached)) {
      cached = calculation()
    }
    return cached
  }
}
