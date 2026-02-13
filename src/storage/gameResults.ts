/**
 * Хранение результатов игр в localStorage.
 * Один ключ — массив записей. Динамика: по типу игры смотрим последние сессии и показатель.
 */

import { useSyncExternalStore } from "react";

export const GAME_RESULTS_STORAGE_KEY = "memory_trainer_results";

export type GameType = "memory" | "sum" | "reaction" | "clock" | "grid";

/** Сводка одной сессии для отображения динамики */
export type MemorySessionMetrics = {
  gameType: "memory";
  correctCount: number;
  totalRounds: number;
  avgTimeMs: number;
  percentFaster: number;
  digitsCount: number;
  digitsShowMs: number;
  answerMs: number;
};

export type SumSessionMetrics = {
  gameType: "sum";
  correctCount: number;
  totalRounds: number;
  avgTimeMs: number;
  percentFaster: number;
  answerMs: number;
  roundCount: number;
};

export type ReactionSessionMetrics = {
  gameType: "reaction";
  correctCount: number;
  totalRounds: number;
  avgTimeMs: number;
  roundCount: number;
};

export type ClockSessionMetrics = {
  gameType: "clock";
  totalRounds: number;
  avgErrorDeg: number;
  roundCount: number;
};

export type GridSessionMetrics = {
  gameType: "grid";
  correctCount: number;
  totalRounds: number;
  avgTimeMs: number;
  percentFaster: number;
  gridSize: number;
  answerMs: number;
  roundCount: number;
};

export type SessionMetrics =
  | MemorySessionMetrics
  | SumSessionMetrics
  | ReactionSessionMetrics
  | ClockSessionMetrics
  | GridSessionMetrics;

export type StoredGameRecord = {
  id: string;
  gameType: GameType;
  timestamp: number;
  metrics: SessionMetrics;
};

function readRecords(): StoredGameRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GAME_RESULTS_STORAGE_KEY);
    if (raw == null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecords(records: StoredGameRecord[]): void {
  try {
    window.localStorage.setItem(
      GAME_RESULTS_STORAGE_KEY,
      JSON.stringify(records),
    );
  } catch {
    // ignore
  }
}

/** Подписчики на ключ — вызываем после записи, чтобы useLocalStorage обновился */
const listeners = new Set<() => void>();
export function subscribeGameResults(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}
function notifyGameResults(): void {
  listeners.forEach((cb) => cb());
}

/** Добавить запись о сессии (вызывать с summary-страницы один раз за визит) */
export function addGameResult(metrics: SessionMetrics): void {
  const records = readRecords();
  const record: StoredGameRecord = {
    id: `${metrics.gameType}-${Date.now()}`,
    gameType: metrics.gameType,
    timestamp: Date.now(),
    metrics,
  };
  records.push(record);
  writeRecords(records);
  cachedRaw = null; // сброс кэша, чтобы getSnapshot прочитал новые данные
  notifyGameResults();
}

export function getGameResults(): StoredGameRecord[] {
  return readRecords();
}

export function hasAnyResults(): boolean {
  return readRecords().length > 0;
}

/** Кэш для getSnapshot: одна и та же ссылка, пока данные не изменились (требование useSyncExternalStore) */
let cachedRaw: string | null = null;
let cachedSnapshot: StoredGameRecord[] = [];

function getSnapshotCached(): StoredGameRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GAME_RESULTS_STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    if (raw == null) {
      cachedSnapshot = [];
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw);
    cachedSnapshot = Array.isArray(parsed) ? parsed : [];
    return cachedSnapshot;
  } catch {
    cachedRaw = null;
    cachedSnapshot = [];
    return cachedSnapshot;
  }
}

/** Показатель динамики для графика/таблицы по типу игры */
export function getDynamicLabel(record: StoredGameRecord): string {
  const m = record.metrics;
  switch (m.gameType) {
    case "memory":
      return `Правильно ${m.correctCount}/${m.totalRounds}, ${(m.avgTimeMs / 1000).toFixed(1)} с, на ${Math.round(m.percentFaster)}% быстрее лимита`;
    case "sum":
      return `Правильно ${m.correctCount}/${m.totalRounds}, ${(m.avgTimeMs / 1000).toFixed(1)} с, на ${Math.round(m.percentFaster)}% быстрее лимита`;
    case "reaction":
      return `Правильно ${m.correctCount}/${m.totalRounds}, среднее ${Math.round(m.avgTimeMs)} мс`;
    case "clock":
      return `${m.totalRounds} раундов, средняя ошибка ${m.avgErrorDeg.toFixed(1)}°`;
    case "grid":
      return `Правильно ${m.correctCount}/${m.totalRounds}, ${(m.avgTimeMs / 1000).toFixed(1)} с, сетка ${m.gridSize}×${m.gridSize}`;
    default:
      return "";
  }
}

/** Числовой показатель для графика динамики (чем выше — тем лучше, где применимо) */
export function getDynamicValue(record: StoredGameRecord): number | null {
  const m = record.metrics;
  switch (m.gameType) {
    case "memory":
    case "sum":
    case "grid":
      return m.percentFaster; // % быстрее лимита — рост хорошо
    case "reaction":
      return m.avgTimeMs; // среднее время реакции (мс) — на графике «чем ниже, тем лучше»
    case "clock":
      return m.avgErrorDeg; // средняя ошибка в градусах — на графике «чем ниже, тем лучше»
    default:
      return null;
  }
}

/** Реактивное чтение списка результатов (обновляется после addGameResult) */
export function useGameResults(): StoredGameRecord[] {
  return useSyncExternalStore(
    subscribeGameResults,
    getSnapshotCached,
    () => [],
  );
}
