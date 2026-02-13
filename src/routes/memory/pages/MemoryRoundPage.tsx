import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Paper, Group } from "@mantine/core";
import { Timer } from "~/components/Timer";
import { randomDigit, randomIndices } from "../utils";
import { useMemorySession } from "../context/MemorySessionContext";
import { DigitGrid } from "../components/DigitGrid";
import { AnswerForm } from "../components/AnswerForm";

type RoundPhase = "digits" | "squares";

export function MemoryRoundPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { settings, currentRound, roundCount, addRoundResult, nextRound } =
    useMemorySession();
  const [phase, setPhase] = useState<RoundPhase>("digits");
  const [digits, setDigits] = useState<number[]>([]);
  const [highlightIndices, setHighlightIndices] = useState<[number, number]>([
    0, 0,
  ]);
  const [answer, setAnswer] = useState("");
  const answerStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (phase === "squares") {
      inputRef.current?.focus();
    }
  }, [phase]);

  useEffect(() => {
    const count = settings.digitsCount;
    setDigits(Array.from({ length: count }, () => randomDigit()));
    setHighlightIndices(randomIndices(count));
    setPhase("digits");
    setAnswer("");
  }, [currentRound, settings.digitsCount]);

  const handleDigitsTimerEnd = useCallback(() => {
    answerStartTimeRef.current = Date.now();
    setPhase("squares");
  }, []);

  const goToNextRound = useCallback(() => {
    const isLastRound = currentRound >= roundCount;
    if (isLastRound) {
      navigate({ to: "/memory/summary" });
    } else {
      nextRound();
      navigate({ to: "/memory/round" });
    }
  }, [currentRound, roundCount, nextRound, navigate]);

  const handleAnswerTimeUp = useCallback(() => {
    const timeMs = Date.now() - answerStartTimeRef.current;
    addRoundResult({
      timeMs,
      correct: false,
      digitA: digits[highlightIndices[0]],
      digitB: digits[highlightIndices[1]],
      timedOut: true,
    });
    goToNextRound();
  }, [addRoundResult, digits, highlightIndices, goToNextRound]);

  const checkAnswer = useCallback(() => {
    const timeMs = Date.now() - answerStartTimeRef.current;
    const expected = digits[highlightIndices[0]] + digits[highlightIndices[1]];
    const value = parseInt(answer.trim(), 10);
    const correct = value === expected;
    addRoundResult({
      timeMs,
      correct,
      digitA: digits[highlightIndices[0]],
      digitB: digits[highlightIndices[1]],
    });
    goToNextRound();
  }, [answer, digits, highlightIndices, addRoundResult, goToNextRound]);

  if (digits.length === 0) return null;

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <Group justify="space-between" mb="md">
        <span>
          Раунд {currentRound} из {roundCount}
        </span>
      </Group>
      {phase === "digits" && (
        <Group justify="center" mb="md">
          <Timer
            key="digits"
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
              key="answer"
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
            inputRef={inputRef}
          />
        </>
      )}
    </Paper>
  );
}
