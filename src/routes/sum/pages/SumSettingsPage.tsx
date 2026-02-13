import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Paper } from "@mantine/core";
import {
  DEFAULT_ANSWER_MS,
  DEFAULT_ROUND_COUNT,
  MIN_ANSWER_SEC,
  MAX_ANSWER_SEC,
  MIN_ROUND_COUNT,
  MAX_ROUND_COUNT,
} from "../constants";
import { useSumSession } from "../context/SumSessionContext";
import { SumSettingsForm } from "../components/SumSettingsForm";
import type { SumSettings } from "../context/SumSessionContext";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const defaultSettings: SumSettings = {
  answerMs: DEFAULT_ANSWER_MS,
  roundCount: DEFAULT_ROUND_COUNT,
};

export function SumSettingsPage() {
  const navigate = useNavigate();
  const { startSession } = useSumSession();
  const [settings, setSettings] = useState<SumSettings>(defaultSettings);

  const handleStart = () => {
    const clamped = {
      answerMs: clamp(
        settings.answerMs,
        MIN_ANSWER_SEC * 1000,
        MAX_ANSWER_SEC * 1000,
      ),
      roundCount: clamp(settings.roundCount, MIN_ROUND_COUNT, MAX_ROUND_COUNT),
    };
    setSettings(clamped);
    startSession(clamped);
    navigate({ to: "/sum/round" });
  };

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <SumSettingsForm
        value={settings}
        onChange={setSettings}
        onStart={handleStart}
      />
    </Paper>
  );
}
