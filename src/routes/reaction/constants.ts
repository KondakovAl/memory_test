export const DEFAULT_ROUND_COUNT = 30;
export const MIN_ROUND_COUNT = 5;
export const MAX_ROUND_COUNT = 100;

export type CircleColor = "red" | "yellow" | "green";

export const COLORS: CircleColor[] = ["red", "yellow", "green"];

export const KEY_BY_COLOR: Record<CircleColor, string> = {
  red: "ArrowLeft",
  yellow: "ArrowDown",
  green: "ArrowRight",
};

export const COLOR_BY_KEY: Record<string, CircleColor> = {
  ArrowLeft: "red",
  ArrowDown: "yellow",
  ArrowRight: "green",
};

export const COLOR_HEX: Record<CircleColor, string> = {
  red: "var(--mantine-color-red-6)",
  yellow: "var(--mantine-color-yellow-5)",
  green: "var(--mantine-color-teal-6)",
};
