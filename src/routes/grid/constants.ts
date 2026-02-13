export const DEFAULT_ROUND_COUNT = 15;
export const MIN_ROUND_COUNT = 1;
export const MAX_ROUND_COUNT = 50;

export const DEFAULT_ANSWER_MS = 20_000;
export const MIN_ANSWER_SEC = 5;
export const MAX_ANSWER_SEC = 60;

export const MIN_GRID_SIZE = 2;
export const MAX_GRID_SIZE = 6;
export const DEFAULT_GRID_SIZE = 3;

export const GRID_SIZE_OPTIONS = [2, 3, 4, 5, 6] as const;
/** Числа в центре клеток: от 10 до 99 */
export const CENTER_MIN = 10;
export const CENTER_MAX = 99;
/** Цифра раунда N: от 10 до 99 (к ней ищем ближайшее в сетке) */
export const ROUND_DIGIT_MIN = 10;
export const ROUND_DIGIT_MAX = 99;

export const CELL_SIZE = 72;
