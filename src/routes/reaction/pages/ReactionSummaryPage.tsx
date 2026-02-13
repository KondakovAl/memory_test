import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Paper, Title, Button, Stack, Text, Group } from '@mantine/core'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useReactionSession } from '../context/ReactionSessionContext'
import { addGameResult } from '~/storage/gameResults'

export function ReactionSummaryPage() {
  const navigate = useNavigate()
  const { roundResults, settings } = useReactionSession()
  const saved = useRef(false)

  const correctCount = roundResults.filter((r) => r.correct).length
  const incorrectCount = roundResults.length - correctCount
  const avgTimeMs =
    roundResults.length > 0
      ? roundResults.reduce((s, r) => s + r.timeMs, 0) / roundResults.length
      : 0

  const data = roundResults.map((r, i) => ({
    round: i + 1,
    timeMs: r.timeMs,
    correct: r.correct ? 'Да' : 'Нет',
  }))

  useEffect(() => {
    if (saved.current || roundResults.length === 0) return
    saved.current = true
    addGameResult({
      gameType: 'reaction',
      correctCount,
      totalRounds: roundResults.length,
      avgTimeMs,
      roundCount: settings.roundCount,
    })
  }, [roundResults.length, settings.roundCount, correctCount, avgTimeMs])

  return (
    <Stack gap="xl" w="100%">
      <Paper p="xl" radius="md" withBorder w="100%">
        <Title order={3} mb="md">
          Результаты
        </Title>
        <Group gap="xl" mb="xl">
          <Text fw={600}>
            Правильно: {correctCount} из {roundResults.length}
          </Text>
          <Text c="dimmed">Неправильно: {incorrectCount}</Text>
        </Group>
        <Title order={4} mb="md">
          Время реакции (мс)
        </Title>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" name="Раунд" />
              <YAxis name="Время (мс)" />
              <Tooltip
                formatter={(value: number) => [`${value} мс`, 'Время']}
                labelFormatter={(label) => `Раунд ${label}`}
              />
              <Bar
                dataKey="timeMs"
                fill="var(--mantine-color-blue-6)"
                name="Время (мс)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Button
          mt="md"
          variant="light"
          onClick={() => navigate({ to: '/reaction/settings' })}
        >
          К настройкам
        </Button>
      </Paper>
    </Stack>
  )
}
