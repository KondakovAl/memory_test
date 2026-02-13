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
import { useClockSession } from "../context/ClockSessionContext";
import { addGameResult } from "~/storage/gameResults";

export function ClockSummaryPage() {
  const navigate = useNavigate();
  const { roundResults, settings } = useClockSession();
  const saved = useRef(false);

  const avgError =
    roundResults.length > 0
      ? Math.round(
          (roundResults.reduce((s, r) => s + r.errorDeg, 0) / roundResults.length) * 10
        ) / 10
      : 0;

  const data = roundResults.map((r, i) => ({
    round: i + 1,
    errorDeg: Math.round(r.errorDeg * 10) / 10,
  }));

  useEffect(() => {
    if (saved.current || roundResults.length === 0 || !settings) return;
    saved.current = true;
    addGameResult({
      gameType: "clock",
      totalRounds: roundResults.length,
      avgErrorDeg: avgError,
      roundCount: settings.roundCount,
    });
  }, [roundResults.length, settings, avgError]);

  return (
    <Stack gap="xl" w="100%">
      <Paper p="xl" radius="md" withBorder w="100%">
        <Title order={3} mb="md">
          Результаты
        </Title>
        <Group gap="xl" mb="xl">
          <Text fw={600}>Раундов: {roundResults.length}</Text>
          <Text c="dimmed">Средняя ошибка: {avgError}°</Text>
        </Group>
        <Title order={4} mb="md">
          Ошибка от 12 часов по раундам (°)
        </Title>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="round" name="Раунд" />
              <YAxis name="Ошибка (°)" />
              <Tooltip
                formatter={(value: number) => [`${value}°`, "Ошибка"]}
                labelFormatter={(label) => `Раунд ${label}`}
              />
              <Bar
                dataKey="errorDeg"
                fill="var(--mantine-color-orange-6)"
                name="Ошибка (°)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Button
          mt="md"
          variant="light"
          onClick={() => navigate({ to: "/clock/settings" })}
        >
          К настройкам
        </Button>
      </Paper>
    </Stack>
  );
}
