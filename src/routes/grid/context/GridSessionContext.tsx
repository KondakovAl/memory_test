import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type GridRoundResult = {
  correct: boolean;
  correctAnswer: number;
  timeMs: number;
  timedOut?: boolean;
};

export type GridSettings = {
  roundCount: number;
  answerMs: number;
  gridSize: number;
};

type GridSessionContextValue = {
  settings: GridSettings;
  currentRound: number;
  roundResults: GridRoundResult[];
  startSession: (s: GridSettings) => void;
  addRoundResult: (r: GridRoundResult) => void;
  nextRound: () => void;
  roundCount: number;
  isLastRound: boolean;
};

const GridSessionContext = createContext<GridSessionContextValue | null>(null);

export function GridSessionProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GridSettings | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<GridRoundResult[]>([]);

  const startSession = useCallback((s: GridSettings) => {
    setSettings(s);
    setCurrentRound(1);
    setRoundResults([]);
  }, []);

  const addRoundResult = useCallback((r: GridRoundResult) => {
    setRoundResults((prev) => [...prev, r]);
  }, []);

  const nextRound = useCallback(() => {
    setCurrentRound((r) => r + 1);
  }, []);

  const roundCount = settings?.roundCount ?? 1;
  const isLastRound = currentRound >= roundCount;

  const value: GridSessionContextValue = {
    settings: settings ?? { roundCount: 15, answerMs: 20_000, gridSize: 3 },
    currentRound,
    roundResults,
    startSession,
    addRoundResult,
    nextRound,
    roundCount,
    isLastRound,
  };

  return (
    <GridSessionContext.Provider value={value}>
      {children}
    </GridSessionContext.Provider>
  );
}

export function useGridSession() {
  const ctx = useContext(GridSessionContext);
  if (!ctx)
    throw new Error("useGridSession must be used inside GridSessionProvider");
  return ctx;
}
