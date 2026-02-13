import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type SumRoundResult = {
  timeMs: number;
  correct: boolean;
  a: number;
  b: number;
  timedOut?: boolean;
};

export type SumSettings = {
  answerMs: number;
  roundCount: number;
};

type SumSessionContextValue = {
  settings: SumSettings;
  currentRound: number;
  roundResults: SumRoundResult[];
  startSession: (s: SumSettings) => void;
  addRoundResult: (r: SumRoundResult) => void;
  nextRound: () => void;
  roundCount: number;
  isLastRound: boolean;
};

const SumSessionContext = createContext<SumSessionContextValue | null>(null);

export function SumSessionProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SumSettings | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<SumRoundResult[]>([]);

  const startSession = useCallback((s: SumSettings) => {
    setSettings(s);
    setCurrentRound(1);
    setRoundResults([]);
  }, []);

  const addRoundResult = useCallback((r: SumRoundResult) => {
    setRoundResults((prev) => [...prev, r]);
  }, []);

  const nextRound = useCallback(() => {
    setCurrentRound((r) => r + 1);
  }, []);

  const roundCount = settings?.roundCount ?? 1;
  const isLastRound = currentRound >= roundCount;

  const value: SumSessionContextValue = {
    settings: settings ?? { answerMs: 15_000, roundCount: 20 },
    currentRound,
    roundResults,
    startSession,
    addRoundResult,
    nextRound,
    roundCount,
    isLastRound,
  };

  return (
    <SumSessionContext.Provider value={value}>
      {children}
    </SumSessionContext.Provider>
  );
}

export function useSumSession() {
  const ctx = useContext(SumSessionContext);
  if (!ctx)
    throw new Error("useSumSession must be used inside SumSessionProvider");
  return ctx;
}
