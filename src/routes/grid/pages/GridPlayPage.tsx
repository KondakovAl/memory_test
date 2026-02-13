import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Paper,
  Group,
  SimpleGrid,
  TextInput,
  Button,
  Stack,
  Text,
} from "@mantine/core";
import { Timer } from "~/components/Timer";
import { useGridSession } from "../context/GridSessionContext";
import {
  generateGrid,
  generateRoundDigit,
  getCorrectAnswer,
  getCorrectCellIndex,
  type GridCell,
} from "../utils";
import { GridCell as GridCellComponent } from "../components/GridCell";

export function GridPlayPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    settings,
    currentRound,
    roundCount,
    addRoundResult,
    nextRound,
    isLastRound,
  } = useGridSession();

  const [cells, setCells] = useState<GridCell[]>([]);
  const [roundDigit, setRoundDigit] = useState<number>(0);
  const [answer, setAnswer] = useState("");
  const answerStartRef = useRef<number>(0);

  const gridSize = settings.gridSize ?? 3;

  useEffect(() => {
    setCells(generateGrid(gridSize));
    setRoundDigit(generateRoundDigit());
    setAnswer("");
    answerStartRef.current = Date.now();
  }, [currentRound, gridSize]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentRound, cells]);

  const goToNext = useCallback(() => {
    if (isLastRound) {
      navigate({ to: "/grid/summary" });
    } else {
      nextRound();
    }
  }, [isLastRound, nextRound, navigate]);

  const handleTimerEnd = useCallback(() => {
    const correctAnswer = getCorrectAnswer(cells, roundDigit);
    const timeMs = Date.now() - answerStartRef.current;
    addRoundResult({ correct: false, correctAnswer, timeMs, timedOut: true });
    goToNext();
  }, [cells, roundDigit, addRoundResult, goToNext]);

  const handleSubmit = useCallback(() => {
    const correctAnswer = getCorrectAnswer(cells, roundDigit);
    const correctCellIndex = getCorrectCellIndex(cells, roundDigit);
    const value = parseInt(answer.trim(), 10);
    const correct =
      !Number.isNaN(value) &&
      value >= 1 &&
      value <= cells.length &&
      value === correctCellIndex;
    const timeMs = Date.now() - answerStartRef.current;
    addRoundResult({ correct, correctAnswer, timeMs });
    goToNext();
  }, [answer, cells, roundDigit, addRoundResult, goToNext]);

  if (cells.length === 0) return null;

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <Group justify="space-between" mb="md">
        <Text size="sm" c="dimmed">
          Раунд {currentRound} из {roundCount}
        </Text>
      </Group>

      <Stack gap="xl">
        <Text fw={600} size="lg" ta="center">
          Цифра раунда: {roundDigit}
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          Введите порядковый номер клетки (1–{cells.length})
        </Text>
        <SimpleGrid cols={gridSize} spacing="md" w="fit-content" mx="auto">
          {cells.map((cell, i) => (
            <GridCellComponent
              key={i}
              cell={cell}
              cellIndex={i + 1}
              onSelect={(index) => setAnswer(String(index))}
            />
          ))}
        </SimpleGrid>

        <Group justify="center">
          <Timer
            key={`grid-${currentRound}`}
            durationMs={settings.answerMs}
            autoStart
            onEnd={handleTimerEnd}
            size={48}
            strokeWidth={3}
          />
        </Group>

        <Stack gap="xs">
          <TextInput
            ref={inputRef}
            label={`Номер клетки (1–${cells.length})`}
            placeholder="№"
            type="number"
            min={1}
            max={cells.length}
            value={answer}
            onChange={(e) => setAnswer(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            onBlur={() => inputRef.current?.focus()}
          />
          <Button onClick={handleSubmit}>Далее</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
