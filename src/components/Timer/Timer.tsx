import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import type { TimerProps, TimerHandle } from "./types";

const DEFAULT_SIZE = 80;
const DEFAULT_STROKE_WIDTH = 6;
const DEFAULT_TICK_MS = 100;

export const Timer = forwardRef<TimerHandle, TimerProps>(function Timer(
  {
    durationMs,
    size = DEFAULT_SIZE,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    autoStart = false,
    strokeColor = "var(--mantine-color-blue-6)",
    trackColor = "var(--mantine-color-gray-2)",
    tickIntervalMs = DEFAULT_TICK_MS,
    onStart,
    onPause,
    onResume,
    onEnd,
    onTick,
  },
  ref,
) {
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(durationMs);
  const endFiredRef = useRef(false);

  remainingRef.current = remainingMs;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning && !isPaused) return;
    clearTimer();
    endFiredRef.current = false;
    if (isPaused) {
      setIsPaused(false);
      onResume?.();
    } else {
      setRemainingMs(durationMs);
      remainingRef.current = durationMs;
      onStart?.();
    }
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setRemainingMs((prev) => {
        const next = Math.max(0, prev - tickIntervalMs);
        onTick?.(next);
        if (next <= 0) {
          clearTimer();
          setIsRunning(false);
          if (!endFiredRef.current) {
            endFiredRef.current = true;
            queueMicrotask(() => onEnd?.());
          }
        }
        return next;
      });
    }, tickIntervalMs);
  }, [
    durationMs,
    tickIntervalMs,
    isRunning,
    isPaused,
    onStart,
    onResume,
    onTick,
    onEnd,
    clearTimer,
  ]);

  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;
    clearTimer();
    setIsPaused(true);
    setIsRunning(false);
    onPause?.();
  }, [isRunning, isPaused, onPause, clearTimer]);

  const resume = useCallback(() => {
    if (!isPaused) return;
    start();
  }, [isPaused, start]);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setIsPaused(false);
    setRemainingMs(durationMs);
    remainingRef.current = durationMs;
    endFiredRef.current = false;
  }, [durationMs, clearTimer]);

  useImperativeHandle(
    ref,
    () => ({
      start,
      pause,
      resume,
      reset,
      getRemainingMs: () => remainingRef.current,
    }),
    [start, pause, resume, reset],
  );

  useEffect(() => {
    if (autoStart) start();
    return clearTimer;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const progress = durationMs > 0 ? remainingMs / durationMs : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", display: "block" }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: `stroke-dashoffset ${tickIntervalMs}ms linear` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.3,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {remainingSeconds}
      </div>
    </div>
  );
});
