import type { Box as PBBox } from "../proto/local/generic_pb";
import { Row as PBRow, Measures as PBMeasures } from "../proto/local/data_pb";
import { Box } from "../types/generic";
import { avg, max, min } from "./math";

export function containedX(b1: PBBox, b2: PBBox) {
  const box = new Box(b1.toObject())
  const [_, my] = new Box(b2.toObject()).midpoint
  return my >= box.getY1() && my <= box.getY2()
}

export function containedY(b1: PBBox, b2: PBBox) {
  const box = new Box(b1.toObject())
  const [mx, _] = new Box(b2.toObject()).midpoint
  return mx >= box.getX1() && mx <= box.getX2()
}

export type NormalizationControls = {
  threshold: number
  lineMargin: number
}

export function constructMeasures(
  input: { box: PBBox, score: number }[],
  options: NormalizationControls,
) {
  const boxes: PBBox[] = []
  for (const entry of input) {
    if (entry.score > options.threshold) {
      boxes.push(entry.box)
    }
  }

  const boxRows: PBBox[][] = []
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

  const bounds = new Box({ x1: 1, x2: 0, y1: 1, y2: 0 })
  //intermediate pass: create row bounds
  for (const r of boxRows) {
    const top = min(r.map(b => b.getY1()))
    const left = min(r.map(b => b.getX1()))

    const right = max(r.map(b => b.getX2()))
    const bottom = max(r.map(b => b.getY2()))

    if (left < bounds.getX1()) {
      bounds.setX1(left)
    }
    if (top < bounds.getY1()) {
      bounds.setY1(top)
    }
    if (right > bounds.getX2()) {
      bounds.setX2(right)
    }
    if (bottom > bounds.getY2()) {
      bounds.setY2(bottom)
    }
  }

  const rows: PBRow[] = []
  //second pass: construct Rows from list of boxes and normalize to bounds
  for (const r of boxRows) {
    const row = new PBRow()

    const rawOffset = avg(r.map(b => b.getY1()))
    row.setOffset((rawOffset - bounds.getY1()) / bounds.height)

    const rawThickness = avg(r.map(b => b.getY2() - b.getY1()))
    row.setThickness(rawThickness / bounds.height)

    //collect all barlines from boxes and sort them
    const lines = []
    for (const box of r) {
      lines.push(box.getX1())
      lines.push(box.getX2())
    }
    lines.sort()

    //remove duplicate barlines
    row.addLines((lines[0] - bounds.getX1()) / bounds.width)
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] - lines[i - 1] > (options.lineMargin ?? 0.02)) {
        row.addLines((lines[i] - bounds.getX1()) / bounds.width)
      }
    }

    rows.push(row)
  }

  const measures = new PBMeasures()
  measures.setBounds(bounds)
  measures.setRowsList(rows)

  return measures
}
