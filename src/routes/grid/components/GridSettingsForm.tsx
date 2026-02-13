import { Stack, NumberInput, Button, Title, Select } from "@mantine/core";
import {
  MIN_ROUND_COUNT,
  MAX_ROUND_COUNT,
  MIN_ANSWER_SEC,
  MAX_ANSWER_SEC,
  GRID_SIZE_OPTIONS,
} from "../constants";
import type { GridSettings } from "../context/GridSessionContext";

const msToSec = (ms: number) => Math.round(ms / 1000);
const secToMs = (s: number) => s * 1000;
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

type Props = {
  value: GridSettings;
  onChange: (s: GridSettings) => void;
  onStart: () => void;
};

export function GridSettingsForm({ value, onChange, onStart }: Props) {
  return (
    <Stack gap="lg">
      <Title order={3}>Настройки</Title>

      <Select
        label="Размер сетки"
        description="От 2×2 до 6×6"
        value={String(value.gridSize)}
        onChange={(v) => {
          const n = v ? parseInt(v, 10) : 3;
          onChange({ ...value, gridSize: n });
        }}
        data={GRID_SIZE_OPTIONS.map((n) => ({
          value: String(n),
          label: `${n} × ${n}`,
        }))}
      />

      <NumberInput
        label="Количество раундов"
        description={`От ${MIN_ROUND_COUNT} до ${MAX_ROUND_COUNT}`}
        min={MIN_ROUND_COUNT}
        max={MAX_ROUND_COUNT}
        value={value.roundCount}
        onChange={(v) => {
          const n = typeof v === "string" ? parseInt(v, 10) || 0 : Number(v);
          onChange({ ...value, roundCount: n });
        }}
        onBlur={() => {
          const n = clamp(value.roundCount, MIN_ROUND_COUNT, MAX_ROUND_COUNT);
          onChange({ ...value, roundCount: n });
        }}
      />

      <NumberInput
        label="Время на ответ (сек)"
        description={`От ${MIN_ANSWER_SEC} до ${MAX_ANSWER_SEC}`}
        min={MIN_ANSWER_SEC}
        max={MAX_ANSWER_SEC}
        value={msToSec(value.answerMs)}
        onChange={(v) => {
          const sec = typeof v === "string" ? parseInt(v, 10) || 0 : Number(v);
          onChange({ ...value, answerMs: secToMs(sec) });
        }}
        onBlur={() => {
          const sec = clamp(msToSec(value.answerMs), MIN_ANSWER_SEC, MAX_ANSWER_SEC);
          onChange({ ...value, answerMs: secToMs(sec) });
        }}
      />

      <Button size="lg" onClick={onStart} mt="md">
        Начать
      </Button>
    </Stack>
  );
}
