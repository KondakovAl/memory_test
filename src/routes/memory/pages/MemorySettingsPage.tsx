import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Paper } from "@mantine/core";
import {
  DEFAULT_DIGITS_SHOW_MS,
  DEFAULT_ANSWER_MS,
  DIGITS_COUNT,
  DEFAULT_ROUND_COUNT,
  MIN_DIGITS_SHOW_SEC,
  MAX_DIGITS_SHOW_SEC,
  MIN_ANSWER_SEC,
  MAX_ANSWER_SEC,
  MIN_DIGITS_COUNT,
  MAX_DIGITS_COUNT,
  MIN_ROUND_COUNT,
  MAX_ROUND_COUNT,
} from "../constants";
import { useMemorySession } from "../context/MemorySessionContext";
import { SettingsForm, type MemorySettings } from "../components/SettingsForm";

const defaultSettings: MemorySettings = {
  digitsShowMs: DEFAULT_DIGITS_SHOW_MS,
  answerMs: DEFAULT_ANSWER_MS,
  digitsCount: DIGITS_COUNT,
  roundCount: DEFAULT_ROUND_COUNT,
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

function clampSettings(s: MemorySettings): MemorySettings {
  return {
    digitsShowMs: clamp(
      s.digitsShowMs,
      MIN_DIGITS_SHOW_SEC * 1000,
      MAX_DIGITS_SHOW_SEC * 1000,
    ),
    answerMs: clamp(
      s.answerMs,
      MIN_ANSWER_SEC * 1000,
      MAX_ANSWER_SEC * 1000,
    ),
    digitsCount: clamp(s.digitsCount, MIN_DIGITS_COUNT, MAX_DIGITS_COUNT),
    roundCount: clamp(s.roundCount, MIN_ROUND_COUNT, MAX_ROUND_COUNT),
  };
}

export function MemorySettingsPage() {
  const navigate = useNavigate();
  const { startSession } = useMemorySession();
  const [settings, setSettings] = useState<MemorySettings>(defaultSettings);

  const handleStart = () => {
    const clamped = clampSettings(settings);
    setSettings(clamped);
    startSession(clamped);
    navigate({ to: "/memory/round" });
  };

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <SettingsForm
        value={settings}
        onChange={setSettings}
        onStart={handleStart}
      />
    </Paper>
  );
}
