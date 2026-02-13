import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type ClockRoundResult = {
  /** Угол остановки в градусах (0 = 12 часов) */
  angleAtStop: number;
  /** Ошибка в градусах от 12 часов (0 = идеально) */
  errorDeg: number;
};

export type ClockSettings = {
  roundCount: number;
  speedDegPerSec: number;
};

type ClockSessionContextValue = {
  settings: ClockSettings;
  currentRound: number;
  roundResults: ClockRoundResult[];
  startSession: (s: ClockSettings) => void;
  addRoundResult: (r: ClockRoundResult) => void;
  nextRound: () => void;
  roundCount: number;
  isLastRound: boolean;
};

const ClockSessionContext = createContext<ClockSessionContextValue | null>(null);

export function ClockSessionProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ClockSettings | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<ClockRoundResult[]>([]);

  const startSession = useCallback((s: ClockSettings) => {
    setSettings(s);
    setCurrentRound(1);
    setRoundResults([]);
  }, []);

  const addRoundResult = useCallback((r: ClockRoundResult) => {
    setRoundResults((prev) => [...prev, r]);
  }, []);

  const nextRound = useCallback(() => {
    setCurrentRound((r) => r + 1);
  }, []);

  const roundCount = settings?.roundCount ?? 1;
  const isLastRound = currentRound >= roundCount;

  const value: ClockSessionContextValue = {
    settings: settings ?? {
      roundCount: 10,
      speedDegPerSec: 120,
    },
    currentRound,
    roundResults,
    startSession,
    addRoundResult,
    nextRound,
    roundCount,
    isLastRound,
  };

  return (
    <ClockSessionContext.Provider value={value}>
      {children}
    </ClockSessionContext.Provider>
  );
}

export function useClockSession() {
  const ctx = useContext(ClockSessionContext);
  if (!ctx)
    throw new Error("useClockSession must be used inside ClockSessionProvider");
  return ctx;
}
