export type TimerCallbacks = {
  onStart?: () => void
  onPause?: () => void
  onResume?: () => void
  onEnd?: () => void
  onTick?: (remainingMs: number) => void
}

export type TimerProps = TimerCallbacks & {
  /** Длительность таймера в миллисекундах */
  durationMs: number
  /** Размер SVG (ширина и высота) в пикселях */
  size?: number
  /** Толщина обводки круга */
  strokeWidth?: number
  /** Запускать ли таймер сразу при монтировании */
  autoStart?: boolean
  /** Цвет заливки круга (оставшееся время) */
  strokeColor?: string
  /** Цвет фона круга (прошедшее время) */
  trackColor?: string
  /** Интервал вызова onTick в мс */
  tickIntervalMs?: number
}

export type TimerHandle = {
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  getRemainingMs: () => number
}
