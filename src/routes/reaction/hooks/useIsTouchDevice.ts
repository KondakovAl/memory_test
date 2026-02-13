import { useState, useEffect } from "react";

/**
 * Определяет, что основное устройство ввода — тач (телефон, планшет с тач-экраном).
 * Использует pointer: coarse и maxTouchPoints, чтобы не полагаться только на ontouchstart
 * (он может быть true и на ноутбуках с тачскрином).
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    const hasTouch =
      typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
    setIsTouch(Boolean(coarse || hasTouch));
  }, []);

  return isTouch;
}
