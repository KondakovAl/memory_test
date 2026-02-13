import { Stack, NumberInput, Button, Title } from "@mantine/core";
import {
  MIN_ROUND_COUNT,
  MAX_ROUND_COUNT,
  MIN_SPEED_DEG_PER_SEC,
  MAX_SPEED_DEG_PER_SEC,
} from "../constants";
import type { ClockSettings } from "../context/ClockSessionContext";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

type Props = {
  value: ClockSettings;
  onChange: (s: ClockSettings) => void;
  onStart: () => void;
};

export function ClockSettingsForm({ value, onChange, onStart }: Props) {
  return (
    <Stack gap="lg">
      <Title order={3}>Настройки</Title>

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
        label="Скорость стрелки (градусов/сек)"
        description={`От ${MIN_SPEED_DEG_PER_SEC} до ${MAX_SPEED_DEG_PER_SEC}`}
        min={MIN_SPEED_DEG_PER_SEC}
        max={MAX_SPEED_DEG_PER_SEC}
        value={value.speedDegPerSec}
        onChange={(v) => {
          const n = typeof v === "string" ? parseInt(v, 10) || 0 : Number(v);
          onChange({ ...value, speedDegPerSec: n });
        }}
        onBlur={() => {
          const n = clamp(
            value.speedDegPerSec,
            MIN_SPEED_DEG_PER_SEC,
            MAX_SPEED_DEG_PER_SEC
          );
          onChange({ ...value, speedDegPerSec: n });
        }}
      />

      <Button size="lg" onClick={onStart} mt="md">
        Начать
      </Button>
    </Stack>
  );
}
