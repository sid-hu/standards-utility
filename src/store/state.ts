export function proxyPB<T extends object>(pb: T, handler: () => void) {
  return new Proxy(pb, {
    set: (_, p, v) => {
      (pb as any)[p] = v
      handler()
      return true
    }
  })
}
