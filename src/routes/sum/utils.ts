import { MIN_ADDEND, MAX_ADDEND } from "./constants";

export function randomAddend(): number {
  return MIN_ADDEND + Math.floor(Math.random() * (MAX_ADDEND - MIN_ADDEND + 1));
}
