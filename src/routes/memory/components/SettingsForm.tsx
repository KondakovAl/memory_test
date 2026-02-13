import { Stack, NumberInput, Button, Title } from "@mantine/core";
import {
  MIN_DIGITS_SHOW_SEC,
  MAX_DIGITS_SHOW_SEC,
  MIN_ANSWER_SEC,
  MAX_ANSWER_SEC,
  MIN_DIGITS_COUNT,
  MAX_DIGITS_COUNT,
  MIN_ROUND_COUNT,
  MAX_ROUND_COUNT,
} from "../constants";

export type MemorySettings = {
  digitsShowMs: number;
  answerMs: number;
  digitsCount: number;
  roundCount: number;
};

const msToSec = (ms: number) => Math.round(ms / 1000);
const secToMs = (s: number) => s * 1000;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

type SettingsFormProps = {
  value: MemorySettings;
  onChange: (s: MemorySettings) => void;
  onStart: () => void;
};

export function SettingsForm({ value, onChange, onStart }: SettingsFormProps) {
  return (
    <Stack gap="lg">
      <Title order={3}>Настройки</Title>

      <NumberInput
        label="Время показа цифр (сек)"
        description={`От ${MIN_DIGITS_SHOW_SEC} до ${MAX_DIGITS_SHOW_SEC}`}
        min={MIN_DIGITS_SHOW_SEC}
        max={MAX_DIGITS_SHOW_SEC}
        value={msToSec(value.digitsShowMs)}
        onChange={(v) => {
          const sec = typeof v === "string" ? parseInt(v, 10) || 0 : Number(v);
          onChange({ ...value, digitsShowMs: secToMs(sec) });
        }}
        onBlur={() => {
          const sec = clamp(
            msToSec(value.digitsShowMs),
            MIN_DIGITS_SHOW_SEC,
            MAX_DIGITS_SHOW_SEC,
          );
          onChange({ ...value, digitsShowMs: secToMs(sec) });
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
          const sec = clamp(
            msToSec(value.answerMs),
            MIN_ANSWER_SEC,
            MAX_ANSWER_SEC,
          );
          onChange({ ...value, answerMs: secToMs(sec) });
        }}
      />

      <NumberInput
        label="Количество цифр"
        description={`От ${MIN_DIGITS_COUNT} до ${MAX_DIGITS_COUNT}`}
        min={MIN_DIGITS_COUNT}
        max={MAX_DIGITS_COUNT}
        value={value.digitsCount}
        onChange={(v) => {
          const n = typeof v === "string" ? parseInt(v, 10) || 0 : Number(v);
          onChange({ ...value, digitsCount: n });
        }}
        onBlur={() => {
          const n = clamp(
            value.digitsCount,
            MIN_DIGITS_COUNT,
            MAX_DIGITS_COUNT,
          );
          onChange({ ...value, digitsCount: n });
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
