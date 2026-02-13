import { Link } from "@tanstack/react-router";
import {
  Paper,
  Title,
  Button,
  Stack,
  Text,
  Group,
  SimpleGrid,
} from "@mantine/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useGameResults,
  getDynamicLabel,
  getDynamicValue,
  type StoredGameRecord,
  type GameType,
} from "~/storage/gameResults";

const GAME_NAMES: Record<GameType, string> = {
  memory: "Сложение по позициям",
  sum: "Сложение двух чисел",
  reaction: "Реакция на цвет",
  clock: "Тест циферблат",
  grid: "Таблица N×N",
};

/** Подпись оси Y и формат значения для тултипа по типу игры */
const Y_AXIS_CONFIG: Record<
  GameType,
  { label: string; formatter?: (v: number) => string }
> = {
  memory: { label: "% быстрее лимита" },
  sum: { label: "% быстрее лимита" },
  reaction: { label: "Время (мс)", formatter: (v) => `${Math.round(v)} мс` },
  clock: {
    label: "Средняя ошибка (°)",
    formatter: (v) => `${Number(v).toFixed(1)}°`,
  },
  grid: { label: "% быстрее лимита" },
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Section({
  gameType,
  records,
}: {
  gameType: GameType;
  records: StoredGameRecord[];
}) {
  const sorted = [...records].sort((a, b) => a.timestamp - b.timestamp);
  const chartData = sorted.map((r) => {
    const value = getDynamicValue(r);
    return {
      date: formatDate(r.timestamp),
      shortDate: new Date(r.timestamp).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      }),
      value: value ?? 0,
      label: getDynamicLabel(r),
    };
  });

  return (
    <Paper p="lg" radius="md" withBorder>
      <Title order={3} mb="md">
        {GAME_NAMES[gameType]}
      </Title>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Сессий: {records.length}. Показатель динамики:{" "}
          {gameType === "clock"
            ? "чем меньше средняя ошибка (градусы) — тем лучше"
            : gameType === "reaction"
              ? "среднее время реакции (мс) — чем ниже, тем лучше"
              : "процент быстрее лимита времени (рост — хорошо)."}
        </Text>
        {chartData.length > 0 && (
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shortDate" />
                <YAxis
                  name={Y_AXIS_CONFIG[gameType].label}
                  unit={gameType === "reaction" ? " мс" : gameType === "clock" ? "°" : undefined}
                  domain={
                    gameType === "reaction" || gameType === "clock"
                      ? ["auto", "auto"]
                      : undefined
                  }
                />
                {/* @ts-ignore */}
                <Tooltip
                  formatter={(value: number, _name, props: unknown) => {
                    const payload = (props as { payload?: { label: string } })
                      ?.payload;
                    const fmt = Y_AXIS_CONFIG[gameType].formatter;
                    const display =
                      fmt != null && payload
                        ? `${payload.label} (${fmt(value)})`
                        : (payload?.label ?? String(value));
                    return [display, "Результат"];
                  }}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as { date?: string })?.date ?? ""
                  }
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--mantine-color-blue-6)"
                  dot={{ r: 3 }}
                  name="Показатель"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Stack>
    </Paper>
  );
}

export function ResultsPage() {
  const results = useGameResults();

  const byGame = results.reduce<Record<GameType, StoredGameRecord[]>>(
    (acc, r) => {
      if (!acc[r.gameType]) acc[r.gameType] = [];
      acc[r.gameType].push(r);
      return acc;
    },
    {} as Record<GameType, StoredGameRecord[]>,
  );

  const gameTypes: GameType[] = ["memory", "sum", "reaction", "clock", "grid"];
  const sections = gameTypes.filter((t) => (byGame[t]?.length ?? 0) > 0);

  return (
    <Stack gap="xl" maw={1000} mx="auto">
      <Group justify="space-between" align="center">
        <Title order={1}>Ваши результаты</Title>
        <Button component={Link} to="/" variant="light">
          На главную
        </Button>
      </Group>
      <Text c="dimmed">
        Динамика по типам занятий. Каждая законченная игра сохраняется и
        отображается здесь.
      </Text>
      {sections.length === 0 ? (
        <Paper p="xl" withBorder>
          <Text c="dimmed" ta="center">
            Пока нет сохранённых результатов. Завершите любую игру — запись
            появится здесь.
          </Text>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {sections.map((gameType) => (
            <Section
              key={gameType}
              gameType={gameType}
              records={byGame[gameType] ?? []}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
