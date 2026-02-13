import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Paper } from '@mantine/core'
import { DEFAULT_ROUND_COUNT, MIN_ROUND_COUNT, MAX_ROUND_COUNT } from '../constants'
import { useReactionSession } from '../context/ReactionSessionContext'
import { ReactionSettingsForm, type ReactionSettings } from '../components/ReactionSettingsForm'

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n))

const defaultSettings: ReactionSettings = {
  roundCount: DEFAULT_ROUND_COUNT,
}

export function ReactionSettingsPage() {
  const navigate = useNavigate()
  const { startSession } = useReactionSession()
  const [settings, setSettings] = useState<ReactionSettings>(defaultSettings)

  const handleStart = () => {
    const clamped = {
      roundCount: clamp(settings.roundCount, MIN_ROUND_COUNT, MAX_ROUND_COUNT),
    }
    setSettings(clamped)
    startSession(clamped)
    navigate({ to: '/reaction/play' })
  }

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <ReactionSettingsForm
        value={settings}
        onChange={setSettings}
        onStart={handleStart}
      />
    </Paper>
  )
}
