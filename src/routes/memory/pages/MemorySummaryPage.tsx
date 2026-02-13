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
import { useMemorySession } from "../context/MemorySessionContext";
import { addGameResult } from "~/storage/gameResults";

export function MemorySummaryPage() {
  const navigate = useNavigate();
  const { roundResults, settings } = useMemorySession();
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

  const data = roundResults.map((r, i) => ({
    question: i + 1,
    timeSec: Math.round(r.timeMs / 1000),
    correct: r.correct ? "Да" : "Нет",
  }));

  useEffect(() => {
    if (saved.current || roundResults.length === 0 || !settings) return;
    saved.current = true;
    addGameResult({
      gameType: "memory",
      correctCount,
      totalRounds: roundResults.length,
      avgTimeMs,
      percentFaster,
      digitsCount: settings.digitsCount,
      digitsShowMs: settings.digitsShowMs,
      answerMs: settings.answerMs,
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
          Время на ответ по вопросам
        </Title>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="question" name="Вопрос" />
              <YAxis name="Время (сек)" unit=" с" domain={[0, maxTimeSec]} />
              <Tooltip
                formatter={(value: number) => [`${value} с`, "Время"]}
                labelFormatter={(label) => `Вопрос ${label}`}
              />
              <Bar
                dataKey="timeSec"
                fill="var(--mantine-color-blue-6)"
                name="Время (сек)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Button
          mt="md"
          variant="light"
          onClick={() => navigate({ to: "/memory/settings" })}
        >
          К настройкам
        </Button>
      </Paper>
    </Stack>
  );
}
