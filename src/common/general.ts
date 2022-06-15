export function withoutElement<T>(list: T[], index: number) {
  return [...list.slice(0, index), ...list.slice(index + 1)]
}

export function replaceLast(s: string, match: string): string {
  if (s.endsWith(match)) {
    return s.slice(0, s.length - match.length)
  }
  return s
}

export function capitalize(s: string): string {
  return `${s[0].toUpperCase()}${s.slice(1)}`
}

export function imageFromBytes(array: Uint8Array): string {
  return URL.createObjectURL(
    new Blob([array], { type: "image" })
  )
}

export function removeWhitespace(strings: string[]): string[] {
  return strings.filter(s => s.length > 0)
}

export function classList(...classes: string[]): string {
  const list: string[] = []
  for (const c of classes) {
    for (const inner of removeWhitespace(c.split(" "))) {
      list.push(inner)
    }
  }
  return list.join(" ")
}

export function styleList(style: { [key: string]: string | null }): string {
  let result = []
  for (const rule in style) {
    if (style[rule] !== null) {
      result.push(`${rule}: ${style[rule]};`)
    }
  }
  return result.join(" ")
}

export function debounce(callback: () => void, time = 200): () => void {
  let lastTriggered = 0
  return () => {
    if ((Date.now() - lastTriggered) > time) {
      callback()
      lastTriggered = Date.now()
    }
  }
}

export type Stop<T> = {
  position: number
  value: T
}

export function colorRamp<T>(value: number, stops: Stop<T>[]): T {
  stops = stops.sort((a, b) => a.position - b.position)
  for (let i = 0; i < stops.length; i++) {
    if (
      value >= (stops[i - 1]?.position ?? 0) &&
      value <= stops[i].position
    ) {
      return stops[i].value
    }
  }
  return stops[stops.length - 1].value
}
