export function randomDigit(): number {
  return Math.floor(Math.random() * 9) + 1
}

export function randomIndices(digitCount: number): [number, number] {
  let a = Math.floor(Math.random() * digitCount)
  let b = Math.floor(Math.random() * digitCount)
  while (b === a) b = Math.floor(Math.random() * digitCount)
  return a < b ? [a, b] : [b, a]
}
