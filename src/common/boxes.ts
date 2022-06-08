import { Wrap } from "../types/generic";

import type { Box } from "../proto/local/generic";
import type { Measures, Row } from "../proto/local/data";

import { avg, max, min } from "./math";

export function containedX(b1: Box, b2: Box) {
  const [_, my] = Wrap.Box(b2).midpoint()
  return my >= b1.y1 && my <= b1.y2
}

export function containedY(b1: Box, b2: Box) {
  const [mx, _] = Wrap.Box(b2).midpoint()
  return mx >= b1.x1 && mx <= b1.x2
}

export type NormalizationControls = {
  threshold: number
  lineMargin: number
}

export function constructMeasures(
  input: { box: Box, score: number }[],
  options: NormalizationControls,
): Measures {
  const boxes: Box[] = []
  for (const entry of input) {
    if (entry.score > options.threshold) {
      boxes.push(entry.box)
    }
  }

  const boxRows: Box[][] = []
  //first pass: separate boxes into lists of boxes, each one
  // part of a specific row
  for (let i = 0; i < boxes.length; i++) {
    let added = false
    for (const current of boxRows) {
      if (containedX(current[current.length - 1], boxes[i])) {
        current.push(boxes[i])
        added = true
        break
      }
    }
    if (!added) {
      boxRows.push([boxes[i]])
    }
  }

  const bounds = Wrap.Box({ x1: 1, x2: 0, y1: 1, y2: 0 })
  //intermediate pass: create row bounds
  for (const r of boxRows) {
    const top = min(r.map(b => b.y1))
    const left = min(r.map(b => b.x1))

    const right = max(r.map(b => b.x2))
    const bottom = max(r.map(b => b.y2))

    if (left < bounds.x1) {
      bounds.x1 = left
    }
    if (top < bounds.y1) {
      bounds.y1 = top
    }
    if (right > bounds.x2) {
      bounds.x2 = right
    }
    if (bottom > bounds.y2) {
      bounds.y2 = bottom
    }
  }

  const rows: Row[] = []
  //second pass: construct Rows from list of boxes and normalize to bounds
  for (const r of boxRows) {
    const rawOffset = avg(r.map(b => b.y1))
    const rawThickness = avg(r.map(b => b.y2 - b.y1))

    const row: Row = {
      thickness: rawThickness / bounds.height(),
      offset: (rawOffset - bounds.y1) / bounds.height(),
      lines: [],
    }

    //collect all barlines from boxes and sort them
    const lines = []
    for (const box of r) {
      lines.push(box.x1)
      lines.push(box.x2)
    }
    lines.sort()

    //remove duplicate barlines
    row.lines.push((lines[0] - bounds.x1) / bounds.width())
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] - lines[i - 1] > (options.lineMargin ?? 0.02)) {
        row.lines.push((lines[i] - bounds.x1) / bounds.width())
      }
    }

    rows.push(row)
  }

  //third pass: sort rows based on offset
  rows.sort((a, b) => a.offset - b.offset)

  return {
    rows: rows,
    bounds: bounds,
  }
}
