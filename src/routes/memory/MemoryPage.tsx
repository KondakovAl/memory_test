import { useState, useCallback } from "react";
import { Title, Text, Paper, Stack, Group } from "@mantine/core";

import { Timer } from "~/components/Timer";
import {
  DEFAULT_DIGITS_SHOW_MS,
  DEFAULT_ANSWER_MS,
  DEFAULT_ROUND_COUNT,
  DIGITS_COUNT,
} from "./constants";
import { randomDigit, randomIndices } from "./utils";
import { BackLink } from "~/components";
import { DigitGrid } from "./components/DigitGrid";
import { AnswerForm } from "./components/AnswerForm";
import { SettingsForm, type MemorySettings } from "./components/SettingsForm";

export type MemoryPhase = "settings" | "digits" | "squares";

const defaultSettings: MemorySettings = {
  digitsShowMs: DEFAULT_DIGITS_SHOW_MS,
  answerMs: DEFAULT_ANSWER_MS,
  digitsCount: DIGITS_COUNT,
  roundCount: DEFAULT_ROUND_COUNT,
};

export function MemoryPage() {
  const [phase, setPhase] = useState<MemoryPhase>("settings");
  const [settings, setSettings] = useState<MemorySettings>(defaultSettings);
  const [digits, setDigits] = useState<number[]>([]);
  const [highlightIndices, setHighlightIndices] = useState<[number, number]>([
    0, 0,
  ]);
  const [answer, setAnswer] = useState("");
  const [roundKey, setRoundKey] = useState(0);

  const startRound = useCallback(() => {
    setRoundKey((k) => k + 1);
    const count = settings.digitsCount;
    const d = Array.from({ length: count }, () => randomDigit());
    const [i, j] = randomIndices(count);
    setDigits(d);
    setHighlightIndices([i, j]);
    setAnswer("");
    setPhase("digits");
  }, [settings.digitsCount]);

  const handleDigitsTimerEnd = useCallback(() => setPhase("squares"), []);

  const handleAnswerTimeUp = useCallback(() => {
    startRound();
  }, [startRound]);

  const checkAnswer = useCallback(() => {
    startRound();
  }, [startRound]);

  return (
    <Stack align="center" gap="xl" maw={600} mx="auto">
      <BackLink to="/" title="К занятиям" />
      <Title order={1}>Сложение по позициям</Title>
      <Text c="dimmed" ta="center">
        Запомни цифры за заданное время. Затем сложи две цифры в подсвеченных
        красным клетках.
      </Text>

      {phase === "settings" && (
        <Paper p="xl" radius="md" withBorder w="100%">
          <SettingsForm
            value={settings}
            onChange={setSettings}
            onStart={startRound}
          />
        </Paper>
      )}

      {(phase === "digits" || phase === "squares") && (
        <Paper p="xl" radius="md" withBorder w="100%">
          {phase === "digits" && (
            <Group justify="center" mb="md">
              <Timer
                key={roundKey}
                durationMs={settings.digitsShowMs}
                autoStart
                onEnd={handleDigitsTimerEnd}
                size={56}
                strokeWidth={4}
              />
            </Group>
          )}
          <DigitGrid
            digits={digits}
            phase={phase}
            highlightIndices={highlightIndices}
            digitCount={settings.digitsCount}
          />

          {phase === "squares" && (
            <>
              <Group justify="center" mb="md">
                <Timer
                  key={`answer-${roundKey}`}
                  durationMs={settings.answerMs}
                  autoStart
                  onEnd={handleAnswerTimeUp}
                  size={48}
                  strokeWidth={3}
                />
              </Group>
              <AnswerForm
                value={answer}
                onChange={setAnswer}
                onCheck={checkAnswer}
              />
            </>
          )}
        </Paper>
      )}
    </Stack>
  );
}
