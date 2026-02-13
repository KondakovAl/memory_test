import { Stack, NumberInput, Button, Title } from "@mantine/core";
import { MIN_ROUND_COUNT, MAX_ROUND_COUNT } from "../constants";

export type ReactionSettings = {
  roundCount: number;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

type Props = {
  value: ReactionSettings;
  onChange: (s: ReactionSettings) => void;
  onStart: () => void;
};

export function ReactionSettingsForm({ value, onChange, onStart }: Props) {
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
      <Button size="lg" onClick={onStart} mt="md">
        Начать
      </Button>
    </Stack>
  );
}
