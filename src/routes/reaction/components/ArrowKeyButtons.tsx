import { Group, UnstyledButton } from "@mantine/core";

const ARROWS = [
  { key: "ArrowLeft" as const, label: "←" },
  { key: "ArrowDown" as const, label: "↓" },
  { key: "ArrowRight" as const, label: "→" },
];

type ArrowKey = "ArrowLeft" | "ArrowDown" | "ArrowRight";

type Props = {
  onPress: (key: ArrowKey) => void;
  size?: number;
};

export function ArrowKeyButtons({ onPress, size = 56 }: Props) {
  return (
    <Group justify="center" gap="md" wrap="nowrap">
      {ARROWS.map(({ key, label }) => (
        <UnstyledButton
          key={key}
          onPointerDown={(e) => {
            e.preventDefault();
            onPress(key);
          }}
          style={{
            width: size,
            height: size,
            borderRadius: 12,
            border: "2px solid var(--mantine-color-default-border)",
            backgroundColor: "var(--mantine-color-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.5,
            lineHeight: 1,
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          styles={{
            root: {
              "&:active": {
                backgroundColor: "var(--mantine-color-gray-2)",
              },
            },
          }}
        >
          {label}
        </UnstyledButton>
      ))}
    </Group>
  );
}
