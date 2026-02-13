import { Stack, NumberInput, Button, Title } from "@mantine/core";
import {
  MIN_ANSWER_SEC,
  MAX_ANSWER_SEC,
  MIN_ROUND_COUNT,
  MAX_ROUND_COUNT,
} from "../constants";
import type { SumSettings } from "../context/SumSessionContext";

const msToSec = (ms: number) => Math.round(ms / 1000);
const secToMs = (s: number) => s * 1000;
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

type Props = {
  value: SumSettings;
  onChange: (s: SumSettings) => void;
  onStart: () => void;
};

export function SumSettingsForm({ value, onChange, onStart }: Props) {
  return (
    <Stack gap="lg">
      <Title order={3}>Настройки</Title>

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
          const sec = clamp(
            msToSec(value.answerMs),
            MIN_ANSWER_SEC,
            MAX_ANSWER_SEC,
          );
          onChange({ ...value, answerMs: secToMs(sec) });
        }}
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

      <Button size="lg" onClick={onStart} mt="md">
        Начать
      </Button>
    </Stack>
  );
}
