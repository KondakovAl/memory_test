import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Paper,
  Group,
  Box,
  Text,
  TextInput,
  Button,
  Stack,
} from "@mantine/core";
import { Timer } from "~/components/Timer";
import { useSumSession } from "../context/SumSessionContext";
import { randomAddend } from "../utils";
import { CELL_SIZE } from "../constants";

const cellStyle = {
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  borderRadius: 8,
  border: "2px solid var(--mantine-color-gray-3)",
  backgroundColor: "var(--mantine-color-gray-0)",
};

export function SumRoundPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    settings,
    currentRound,
    roundCount,
    addRoundResult,
    nextRound,
    isLastRound,
  } = useSumSession();

  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [answer, setAnswer] = useState("");
  const answerStartRef = useRef<number>(0);

  useEffect(() => {
    setA(randomAddend());
    setB(randomAddend());
    setAnswer("");
    answerStartRef.current = Date.now();
  }, [currentRound]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentRound, a, b]);

  const goToNext = useCallback(() => {
    if (isLastRound) {
      navigate({ to: "/sum/summary" });
    } else {
      nextRound();
      navigate({ to: "/sum/round" });
    }
  }, [isLastRound, nextRound, navigate]);

  const handleTimerEnd = useCallback(() => {
    const timeMs = Date.now() - answerStartRef.current;
    addRoundResult({
      timeMs,
      correct: false,
      a,
      b,
      timedOut: true,
    });
    goToNext();
  }, [addRoundResult, a, b, goToNext]);

  const handleSubmit = useCallback(() => {
    const timeMs = Date.now() - answerStartRef.current;
    const expected = a + b;
    const value = parseInt(answer.trim(), 10);
    const correct = !Number.isNaN(value) && value === expected;
    addRoundResult({ timeMs, correct, a, b });
    goToNext();
  }, [answer, a, b, addRoundResult, goToNext]);

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <Group justify="space-between" mb="md">
        <span>
          Раунд {currentRound} из {roundCount}
        </span>
      </Group>

      <Stack gap="xl" align="stretch">
        <Group justify="center" gap="md" wrap="nowrap" align="stretch">
          <Box w={CELL_SIZE} h={CELL_SIZE} style={cellStyle}>
            <Text fw={700} size="xl">
              {a}
            </Text>
          </Box>
          <TextInput
            ref={inputRef}
            placeholder="?"
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            onBlur={() => inputRef.current?.focus()}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              boxSizing: "border-box",
            }}
            styles={{
              input: {
                textAlign: "center",
                borderRadius: 8,
                border: "2px solid var(--mantine-color-gray-3)",
                fontSize: "var(--mantine-font-size-xl)",
                fontWeight: 700,
                height: CELL_SIZE,
              },
            }}
          />
          <Box w={CELL_SIZE} h={CELL_SIZE} style={cellStyle}>
            <Text fw={700} size="xl">
              {b}
            </Text>
          </Box>
        </Group>

        <Group justify="center">
          <Timer
            key={`round-${currentRound}`}
            durationMs={settings.answerMs}
            autoStart
            onEnd={handleTimerEnd}
            size={48}
            strokeWidth={3}
          />
        </Group>

        <Button onClick={handleSubmit}>Далее</Button>
      </Stack>
    </Paper>
  );
}
