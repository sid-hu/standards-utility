import { capitalize } from "./general"
import type { PB } from "./types"

export function proxify(o: any, handler: ProxyHandler<any>) {
    if (typeof o !== "object") {
        throw new Error("You cannot proxy a primitive!")
    }
    for (const prop of Object.getOwnPropertyNames(o)) {
        if (typeof o[prop] === "object") {
            o[prop] = proxify(o, handler)
        }
    }
    return new Proxy(o, handler)
}

export function writer<T extends object>(
    initial: T,
    updater: (value: T) => void,
    timeout = 1000
) {
    let last: NodeJS.Timeout
    return proxify((initial as any).toObject(), {
        set(target, prop, value) {
            (target as any)[prop] = value
            if (last) {
                clearTimeout(last)
            }
            last = setTimeout(() => updater(target), timeout)
            return true
        }
    })
}

function handleValue(
    v: any, objectHandler: (o: PB) => object
): any {
    if (typeof v !== "object") return v
    if (Array.isArray(v)) {
        return v.map(e => handleValue(e, objectHandler))
    }
    if (v.map_) {
        const result: { [key: string | symbol]: any } = {}
        for (const k of v.keys()) {
            result[k] = handleValue(v.get(k), objectHandler)
        }
        return new Proxy(result, {
            set: (_, prop, value) => {
                const ok = v.set(prop, value)
                if (ok) {
                    result[prop] = value
                }
                return !!ok
            },
            deleteProperty: (_, prop) => {
                const ok = v.del(prop)
                if (ok) {
                    delete result[prop]
                }
                return !!ok
            }
        })
    }
    if (Object.getPrototypeOf(v).toObject) {
        return objectHandler(v)
    }
}

export function proxyPB<T extends PB, O>(pb: T): O {
    const o = pb.toObject() as any
    for (const k in o) { //address reserved keywords
        if (k.startsWith("pb_")) {
            const n = k.replace("pb_", "")
            o[n] = o[k]
            delete o[k]
        }
    }

    const result: { [key: string]: any } = {}
    for (const key in o) {
        const valueKey = `_${key}`

        const getter = pb[`get${capitalize(key)}`]!.bind(pb)
        const setter = pb[`set${capitalize(key)}`]?.bind(pb)

        Object.defineProperty(result, valueKey, {
            value: handleValue(getter(), o => proxyPB(o)),
            enumerable: false,
            writable: true,
        })

        Object.defineProperty(
            result, key,
            {
                get: () => result[valueKey],
                set: setter ?
                    v => {
                        result[valueKey] = handleValue(v, o => proxyPB(o))
                        return setter(v)
                    } :
                    () => false
            }
        )
    }

    return result as O
}

export function pbFromObject<T extends PB, O>(c: new () => T, o: O): T {
    const pb = new c()
    for (const key in o) {
        pb[`set${capitalize(key)}`]?.(o[key])
    }
    return pb
}
