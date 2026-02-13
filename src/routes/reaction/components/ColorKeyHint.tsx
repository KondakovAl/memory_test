import { Stack } from "@mantine/core";
import { COLOR_HEX, KEY_BY_COLOR, type CircleColor } from "../constants";

const ARROW_BY_KEY: Record<string, string> = {
  ArrowLeft: "←",
  ArrowDown: "↓",
  ArrowRight: "→",
};

type Props = {
  color: CircleColor;
  size?: number;
};

export function ColorKeyHint({ color, size = 24 }: Props) {
  const hex = COLOR_HEX[color];
  const key = KEY_BY_COLOR[color];
  const arrow = ARROW_BY_KEY[key];

  return (
    <Stack gap="xs" align="center">
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: hex,
          flexShrink: 0,
          border: "1px solid var(--mantine-color-default-border)",
        }}
      />
      <span style={{ fontSize: size, lineHeight: 1 }}>{arrow}</span>
    </Stack>
  );
}
