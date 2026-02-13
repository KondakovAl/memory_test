import { CENTER_MIN, CENTER_MAX, ROUND_DIGIT_MIN, ROUND_DIGIT_MAX } from "./constants";

export type GridCell = {
  centerNumber: number;
};

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Генерирует сетку N×N: в каждой клетке случайное число (10–99), все уникальны. */
export function generateGrid(gridSize: number): GridCell[] {
  const used = new Set<number>();
  const cells: GridCell[] = [];
  const total = gridSize * gridSize;

  for (let i = 0; i < total; i++) {
    let center: number;
    do {
      center = randomInt(CENTER_MIN, CENTER_MAX);
    } while (used.has(center));
    used.add(center);
    cells.push({ centerNumber: center });
  }

  return cells;
}

/** Случайная цифра раунда N (10–99). */
export function generateRoundDigit(): number {
  return randomInt(ROUND_DIGIT_MIN, ROUND_DIGIT_MAX);
}

/** Число в клетке, ближайшей к N. При равенстве расстояний — первое из таких. */
export function getCorrectAnswer(cells: GridCell[], roundDigit: number): number {
  let best = cells[0];
  let bestDist = Math.abs(cells[0].centerNumber - roundDigit);

  for (let i = 1; i < cells.length; i++) {
    const d = Math.abs(cells[i].centerNumber - roundDigit);
    if (d < bestDist) {
      bestDist = d;
      best = cells[i];
    }
  }

  return best.centerNumber;
}
