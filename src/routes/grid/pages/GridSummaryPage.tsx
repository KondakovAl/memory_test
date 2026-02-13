import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Paper, Title, Button, Stack, Text, Group } from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGridSession } from "../context/GridSessionContext";
import { addGameResult } from "~/storage/gameResults";

export function GridSummaryPage() {
  const navigate = useNavigate();
  const { roundResults, settings } = useGridSession();
  const saved = useRef(false);

  const correctCount = roundResults.filter((r) => r.correct).length;
  const incorrectCount = roundResults.length - correctCount;
  const maxTimeSec = Math.round(settings.answerMs / 1000);
  const maxTimeMs = settings.answerMs;
  const avgTimeMs =
    roundResults.length > 0
      ? roundResults.reduce((s, r) => s + r.timeMs, 0) / roundResults.length
      : 0;
  const avgTimeSec = (avgTimeMs / 1000).toFixed(1);
  const percentFaster =
    maxTimeMs > 0
      ? Math.max(0, ((maxTimeMs - avgTimeMs) / maxTimeMs) * 100)
      : 0;

  const timeData = roundResults.map((r, i) => ({
    round: i + 1,
    timeSec: Math.round(r.timeMs / 1000),
    correct: r.correct ? "Да" : "Нет",
  }));

  useEffect(() => {
    if (saved.current || roundResults.length === 0 || !settings) return;
    saved.current = true;
    addGameResult({
      gameType: "grid",
      correctCount,
      totalRounds: roundResults.length,
      avgTimeMs,
      percentFaster,
      gridSize: settings.gridSize,
      answerMs: settings.answerMs,
      roundCount: settings.roundCount,
    });
  }, [roundResults.length, settings, correctCount, avgTimeMs, percentFaster]);

  return (
    <Stack gap="xl" w="100%">
      <Paper p="xl" radius="md" withBorder w="100%">
        <Title order={3} mb="md">
          Результаты
        </Title>
        <Group gap="xl" mb="md">
          <Text fw={600}>
            Правильно: {correctCount} из {roundResults.length}
          </Text>
          <Text c="dimmed">Неправильно: {incorrectCount}</Text>
        </Group>
        <Stack gap="xs" mb="xl">
          <Text size="sm">
            Среднее время на ответ: <strong>{avgTimeSec} с</strong>
          </Text>
          <Text size="sm" c="dimmed">
            Ваше время было на{" "}
            <strong>{Math.round(percentFaster)}%</strong> быстрее максимального (
            {maxTimeSec} с).
          </Text>
        </Stack>
        <Title order={4} mb="md">
          Время на ответ по раундам
        </Title>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={timeData}
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" name="Раунд" />
              <YAxis name="Время (сек)" unit=" с" domain={[0, maxTimeSec]} />
              <Tooltip
                formatter={(value: number) => [`${value} с`, "Время"]}
                labelFormatter={(label) => `Раунд ${label}`}
              />
              <Bar
                dataKey="timeSec"
                fill="var(--mantine-color-teal-6)"
                name="Время (сек)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Button
          mt="md"
          variant="light"
          onClick={() => navigate({ to: "/grid/settings" })}
        >
          К настройкам
        </Button>
      </Paper>
    </Stack>
  );
}
