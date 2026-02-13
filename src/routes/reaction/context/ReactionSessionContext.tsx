import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

export type ReactionRoundResult = {
  timeMs: number
  correct: boolean
}

type ReactionSettings = {
  roundCount: number
}

type ReactionSessionContextValue = {
  settings: ReactionSettings
  setSettings: (s: ReactionSettings) => void
  currentRound: number
  roundResults: ReactionRoundResult[]
  startSession: (s: ReactionSettings) => void
  addRoundResult: (timeMs: number, correct: boolean) => void
  nextRound: () => number
  roundCount: number
  isLastRound: boolean
}

const ReactionSessionContext = createContext<ReactionSessionContextValue | null>(null)

const defaultSettings: ReactionSettings = {
  roundCount: 30,
}

export function ReactionSessionProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<ReactionSettings>(defaultSettings)
  const [currentRound, setCurrentRound] = useState(1)
  const [roundResults, setRoundResults] = useState<ReactionRoundResult[]>([])

  const startSession = useCallback((s: ReactionSettings) => {
    setSettingsState(s)
    setCurrentRound(1)
    setRoundResults([])
  }, [])

  const addRoundResult = useCallback((timeMs: number, correct: boolean) => {
    setRoundResults((prev) => [...prev, { timeMs, correct }])
  }, [])

  const nextRound = useCallback(() => {
    setCurrentRound((r) => r + 1)
    return currentRound + 1
  }, [currentRound])

  const roundCount = settings.roundCount
  const isLastRound = currentRound >= roundCount

  const value: ReactionSessionContextValue = {
    settings,
    setSettings: setSettingsState,
    currentRound,
    roundResults,
    startSession,
    addRoundResult,
    nextRound,
    roundCount,
    isLastRound,
  }

  return (
    <ReactionSessionContext.Provider value={value}>
      {children}
    </ReactionSessionContext.Provider>
  )
}

export function useReactionSession() {
  const ctx = useContext(ReactionSessionContext)
  if (!ctx) throw new Error('useReactionSession must be used inside ReactionSessionProvider')
  return ctx
}
