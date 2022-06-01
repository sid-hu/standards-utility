import { capitalize } from "../common/general"
import type { PB } from "../types/generic"

export function proxyPB<T extends PB>(pb: T, onupdate: () => void): T {
  const o = pb.toObject() as any
  for (const k in o) { //address reserved keywords
    if (k.startsWith("pb_")) {
      const n = k.replace("pb_", "")
      o[n] = o[k]
      delete o[k]
    }
  }

  for (const key in o) {
    const setterKey = `set${capitalize(key)}`
    const setter = pb[setterKey]?.bind(pb)

    if (setter) {
      Object.defineProperty(
        pb, setterKey,
        {
          enumerable: true,
          value: (v: any) => {
            onupdate()
            setter(v)
          },
        }
      )
    }
  }

  return pb
}
