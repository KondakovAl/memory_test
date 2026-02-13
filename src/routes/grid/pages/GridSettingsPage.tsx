import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Paper } from "@mantine/core";
import {
  DEFAULT_ROUND_COUNT,
  DEFAULT_ANSWER_MS,
  DEFAULT_GRID_SIZE,
  MIN_ROUND_COUNT,
  MAX_ROUND_COUNT,
  MIN_ANSWER_SEC,
  MAX_ANSWER_SEC,
  MIN_GRID_SIZE,
  MAX_GRID_SIZE,
} from "../constants";
import { useGridSession } from "../context/GridSessionContext";
import { GridSettingsForm } from "../components/GridSettingsForm";
import type { GridSettings } from "../context/GridSessionContext";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const defaultSettings: GridSettings = {
  roundCount: DEFAULT_ROUND_COUNT,
  answerMs: DEFAULT_ANSWER_MS,
  gridSize: DEFAULT_GRID_SIZE,
};

export function GridSettingsPage() {
  const navigate = useNavigate();
  const { startSession } = useGridSession();
  const [settings, setSettings] = useState<GridSettings>(defaultSettings);

  const handleStart = () => {
    const clamped = {
      roundCount: clamp(settings.roundCount, MIN_ROUND_COUNT, MAX_ROUND_COUNT),
      answerMs: clamp(
        settings.answerMs,
        MIN_ANSWER_SEC * 1000,
        MAX_ANSWER_SEC * 1000
      ),
      gridSize: clamp(settings.gridSize, MIN_GRID_SIZE, MAX_GRID_SIZE),
    };
    setSettings(clamped);
    startSession(clamped);
    navigate({ to: "/grid/play" });
  };

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <GridSettingsForm
        value={settings}
        onChange={setSettings}
        onStart={handleStart}
      />
    </Paper>
  );
}
