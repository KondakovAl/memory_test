import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { MemorySettings } from "../components/SettingsForm";

export type RoundResult = {
  timeMs: number;
  correct: boolean;
  digitA: number;
  digitB: number;
  timedOut?: boolean;
};

type MemorySessionContextValue = {
  settings: MemorySettings;
  setSettings: (s: MemorySettings) => void;
  currentRound: number;
  roundResults: RoundResult[];
  startSession: (s: MemorySettings) => void;
  addRoundResult: (
    result: Omit<RoundResult, "digitA" | "digitB"> & {
      digitA: number;
      digitB: number;
    },
  ) => void;
  nextRound: () => number;
  roundCount: number;
  isLastRound: boolean;
};

const MemorySessionContext = createContext<MemorySessionContextValue | null>(
  null,
);

export function MemorySessionProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MemorySettings | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);

  const startSession = useCallback((s: MemorySettings) => {
    setSettings(s);
    setCurrentRound(1);
    setRoundResults([]);
  }, []);

  const addRoundResult = useCallback(
    (result: {
      timeMs: number;
      correct: boolean;
      digitA: number;
      digitB: number;
      timedOut?: boolean;
    }) => {
      setRoundResults((prev) => [...prev, result]);
    },
    [],
  );

  const nextRound = useCallback(() => {
    setCurrentRound((r) => r + 1);
    return currentRound + 1;
  }, [currentRound]);

  const roundCount = settings?.roundCount ?? 1;
  const isLastRound = currentRound >= roundCount;

  const value: MemorySessionContextValue = {
    settings: settings ?? {
      digitsShowMs: 3000,
      answerMs: 30_000,
      digitsCount: 6,
      roundCount: 40,
    },
    setSettings: setSettings as (s: MemorySettings) => void,
    currentRound,
    roundResults,
    startSession,
    addRoundResult,
    nextRound,
    roundCount,
    isLastRound,
  };

  return (
    <MemorySessionContext.Provider value={value}>
      {children}
    </MemorySessionContext.Provider>
  );
}

export function useMemorySession() {
  const ctx = useContext(MemorySessionContext);
  if (!ctx)
    throw new Error(
      "useMemorySession must be used inside MemorySessionProvider",
    );
  return ctx;
}
