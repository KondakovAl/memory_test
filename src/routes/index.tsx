import { Link } from "@tanstack/react-router";
import { Title, Text, Stack, SimpleGrid, Card, Group, Button } from "@mantine/core";
import { ActivityCardHint } from "~/components/ActivityCardHint";
import { useGameResults } from "~/storage/gameResults";

const ACTIVITIES = [
  {
    path: "/memory/settings",
    title: "Сложение по позициям",
    description:
      "Запомни N цифр за M секунд, затем сложи две цифры в подсвеченных клетках.",
    hintType: "memory" as const,
  },
  {
    path: "/sum/settings",
    title: "Сложение двух чисел",
    description:
      "Два числа слева и справа — введи их сумму в поле по центру. Есть время на ответ и количество раундов.",
    hintType: "sum" as const,
  },
  {
    path: "/reaction/settings",
    title: "Реакция на цвет",
    description:
      "Загораются кружки красного, жёлтого и зелёного цвета. Гаси их клавишами-стрелками.",
    hintType: "reaction" as const,
  },
  {
    path: "/clock/settings",
    title: "Тест циферблат",
    description:
      "Стрелка движется по циферблату. Останови её на 12 часах (Пробел или кнопка «Стоп»).",
    hintType: "clock" as const,
  },
  {
    path: "/grid/settings",
    title: "Таблица NxN",
    description:
      "Дана цифра раунда. В сетке NxN — числа в клетках. Введи число из клетки, наиболее близкой к цифре раунда.",
    hintType: "grid" as const,
  },
] as const;

export function StartPage() {
  const results = useGameResults();
  const hasResults = results.length > 0;

  return (
    <Stack align="center" gap="xl" maw={1200} mx="auto">
      <Group justify="flex-end" w="100%" style={{ alignSelf: "stretch" }}>
        {hasResults && (
          <Button component={Link} to="/results" variant="light" size="sm">
            Ваши результаты
          </Button>
        )}
      </Group>
      <Title order={1}>Тренировка памяти</Title>
      <Text c="dimmed" ta="center">
        Выберите вид занятия
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" w="100%">
        {ACTIVITIES.map((activity) => (
          <Link
            key={activity.path}
            to={activity.path}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              component="div"
              style={{ cursor: "pointer", height: "100%" }}
              styles={{ root: { height: "100%" } }}
            >
              <Stack gap="xs" style={{ height: "100%" }}>
                <Title order={3}>{activity.title}</Title>
                <Text size="sm" c="dimmed">
                  {activity.description}
                </Text>
                {"hintType" in activity && activity.hintType && (
                  <ActivityCardHint type={activity.hintType} />
                )}
              </Stack>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
