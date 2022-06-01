export function avg(numbers: number[]): number {
  let sum = 0
  for (const n of numbers) {
    sum += n
  }
  return sum / numbers.length
}

export function min(numbers: number[]): number {
  let minimum = Infinity
  for (const n of numbers) {
    if (n < minimum) {
      minimum = n
    }
  }
  return minimum
}

export function max(numbers: number[]): number {
  let minimum = -Infinity
  for (const n of numbers) {
    if (n > minimum) {
      minimum = n
    }
  }
  return minimum
}
