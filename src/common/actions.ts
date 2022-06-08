type PropertyOnSizeOptions = {
  [key in keyof CSSStyleDeclaration]+?: {
    axis: "x" | "y"
    compare: "greater" | "lesser",
    value: string,
    threshold: number | (() => number),
  }
}

export function propertyOnSize(
  node: HTMLElement, options: PropertyOnSizeOptions
) {
  const observer = new ResizeObserver(() => {
    for (const property in options) {
      const value = options[property]!.axis === "x" ?
        node.clientWidth :
        node.clientHeight

      const threshold = (typeof options[property]!.threshold) === "number" ?
        options[property]!.threshold as number :
        (options[property]!.threshold as (() => number))()

      if (options[property]!.compare === "greater" ?
        value > threshold :
        value < threshold
      ) {
        node.style[property] = options[property]!.value
        continue
      }
      node.style[property] = ""
    }
  })
  observer.observe(node)
  return {
    update(o: PropertyOnSizeOptions) {
      options = o
    },
    destroy() {
      observer.disconnect()
    }
  }
}