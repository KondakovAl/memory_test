import { Box, Group, Text } from "@mantine/core";
import { DIGIT_SIZE } from "../constants";

type Phase = "idle" | "digits" | "squares" | "result";

type DigitGridProps = {
  digits: number[];
  phase: Phase;
  highlightIndices: [number, number];
  digitCount: number;
};

export function DigitGrid({
  digits,
  phase,
  highlightIndices,
  digitCount,
}: DigitGridProps) {
  const isHighlighted = (i: number) =>
    phase !== "digits" &&
    (i === highlightIndices[0] || i === highlightIndices[1]);

  return (
    <Group justify="center" gap="md" mb="xl">
      {Array.from({ length: digitCount }, (_, i) => (
        <Box
          key={i}
          w={DIGIT_SIZE}
          h={DIGIT_SIZE}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            border: "2px solid",
            borderColor: isHighlighted(i)
              ? "var(--mantine-color-red-6)"
              : "var(--mantine-color-gray-3)",
            backgroundColor: isHighlighted(i)
              ? "var(--mantine-color-red-1)"
              : "var(--mantine-color-gray-0)",
          }}
        >
          {phase === "digits" ? (
            <Text fw={700} size="xl">
              {digits[i]}
            </Text>
          ) : null}
        </Box>
      ))}
    </Group>
  );
}
