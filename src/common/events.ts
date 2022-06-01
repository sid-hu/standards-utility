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
