import { Writable, writable } from "svelte/store"

export function required(s: string | []): boolean {
    if (typeof s === "string") {
        return s.trim().length > 0
    }
    if (Array.isArray(s)) {
        return s.length > 0
    }
    return false
}

export function integer(s: string): boolean {
    return !isNaN(parseInt(s))
}

export function number(s: string): boolean {
    return !isNaN(parseFloat(s))
}

type InitialShape = { [key: string]: any }

type ErrorStore<T extends InitialShape> = {
    [key in keyof T]: {
        ok: boolean
        value: T[key]
    }
}

export function validation(
    node: HTMLInputElement,
    p: {
        key: string
        store: Writable<ErrorStore<any>>
        validator: (s: any) => boolean
    }
) {
    const handler = () => {
        p.store.update(s => {
            s[p.key].ok = p.validator(s)
            s[p.key].value = node.value
            return s
        })
    }

    p.store.subscribe(s => node.value = s[p.key].value)
    node.addEventListener("input", handler)

    return {
        destroy() {
            node.removeEventListener("input", handler)
        }
    }
}

export function createForm<T extends InitialShape>(i: T) {
    const initial: ErrorStore<any> = {}
    for (const k in i) {
        initial[k] = {
            ok: true,
            value: i,
        }
    }
    return writable<ErrorStore<T>>(initial)
}
