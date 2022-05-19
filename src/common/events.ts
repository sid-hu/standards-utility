import { onDestroy } from "svelte"

export function useKey(key: string, callback: () => void) {
    const handler = (e: KeyboardEvent) => {
        if (e.key === key) {
            callback()
        }
    }

    const cleanup = () => window.removeEventListener("keydown", handler)
    window.addEventListener("keydown", handler)

    onDestroy(cleanup)
}

export function useClose(callback: () => void) {
    useKey("Escape", callback)
}
