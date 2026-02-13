import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Paper } from "@mantine/core";
import {
  DEFAULT_ROUND_COUNT,
  DEFAULT_SPEED_DEG_PER_SEC,
  MIN_ROUND_COUNT,
  MAX_ROUND_COUNT,
  MIN_SPEED_DEG_PER_SEC,
  MAX_SPEED_DEG_PER_SEC,
} from "../constants";
import { useClockSession } from "../context/ClockSessionContext";
import { ClockSettingsForm } from "../components/ClockSettingsForm";
import type { ClockSettings } from "../context/ClockSessionContext";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const defaultSettings: ClockSettings = {
  roundCount: DEFAULT_ROUND_COUNT,
  speedDegPerSec: DEFAULT_SPEED_DEG_PER_SEC,
};

export function ClockSettingsPage() {
  const navigate = useNavigate();
  const { startSession } = useClockSession();
  const [settings, setSettings] = useState<ClockSettings>(defaultSettings);

  const handleStart = () => {
    const clamped = {
      roundCount: clamp(settings.roundCount, MIN_ROUND_COUNT, MAX_ROUND_COUNT),
      speedDegPerSec: clamp(
        settings.speedDegPerSec,
        MIN_SPEED_DEG_PER_SEC,
        MAX_SPEED_DEG_PER_SEC
      ),
    };
    setSettings(clamped);
    startSession(clamped);
    navigate({ to: "/clock/play" });
  };

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <ClockSettingsForm
        value={settings}
        onChange={setSettings}
        onStart={handleStart}
      />
    </Paper>
  );
}
