import { Group } from "@mantine/core";
import { ColorKeyHint } from "~/routes/reaction/components/ColorKeyHint";
import { COLORS } from "~/routes/reaction/constants";

type ActivityCardHintProps = {
  type: "memory" | "reaction" | "sum" | "clock" | "grid";
};

const CELL_SIZE = 40;
const SUM_CELL_SIZE = 40;

const GRID_HINT_CELL = 40;
const gridCellStyle = {
  width: GRID_HINT_CELL,
  height: GRID_HINT_CELL,
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  borderRadius: 4,
  border: "1px solid var(--mantine-color-gray-3)",
  backgroundColor: "var(--mantine-color-gray-0)",
  fontSize: 8,
  fontWeight: 700,
};

function GridHint() {
  const numbers = [12, 45, 78, 23, 50, 91, 34, 67, 19];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 9, color: "var(--mantine-color-dimmed)" }}>
        Цифра: 50
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        {numbers.map((n, i) => (
          <div key={i} style={gridCellStyle}>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

const CLOCK_HINT_SIZE = 56;
const CLOCK_HINT_CX = CLOCK_HINT_SIZE / 2;
const CLOCK_HINT_CY = CLOCK_HINT_SIZE / 2;
const CLOCK_HINT_R = (CLOCK_HINT_SIZE / 2) * 0.88;

function ClockHint() {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const marks = Array.from({ length: 12 }, (_, i) => {
    const a = toRad(i * 30 - 90);
    return {
      x1: CLOCK_HINT_CX + (CLOCK_HINT_R - 4) * Math.cos(a),
      y1: CLOCK_HINT_CY + (CLOCK_HINT_R - 4) * Math.sin(a),
      x2: CLOCK_HINT_CX + CLOCK_HINT_R * Math.cos(a),
      y2: CLOCK_HINT_CY + CLOCK_HINT_R * Math.sin(a),
    };
  });
  const handLen = CLOCK_HINT_R * 0.55;
  const handX = CLOCK_HINT_CX + handLen * Math.sin(0);
  const handY = CLOCK_HINT_CY - handLen * Math.cos(0);

  return (
    <svg
      width={CLOCK_HINT_SIZE}
      height={CLOCK_HINT_SIZE}
      viewBox={`0 0 ${CLOCK_HINT_SIZE} ${CLOCK_HINT_SIZE}`}
      style={{ display: "block" }}
    >
      <circle
        cx={CLOCK_HINT_CX}
        cy={CLOCK_HINT_CY}
        r={CLOCK_HINT_R}
        fill="var(--mantine-color-gray-0)"
        stroke="var(--mantine-color-gray-4)"
        strokeWidth={1.5}
      />
      {marks.map((m, i) => (
        <line
          key={i}
          x1={m.x1}
          y1={m.y1}
          x2={m.x2}
          y2={m.y2}
          stroke="var(--mantine-color-gray-5)"
          strokeWidth={i % 3 === 0 ? 1.5 : 1}
          strokeLinecap="round"
        />
      ))}
      <text
        x={CLOCK_HINT_CX}
        y={CLOCK_HINT_CY - CLOCK_HINT_R + 10}
        textAnchor="middle"
        fill="var(--mantine-color-gray-7)"
        fontSize={8}
        fontWeight={700}
      >
        12
      </text>
      <line
        x1={CLOCK_HINT_CX}
        y1={CLOCK_HINT_CY}
        x2={handX}
        y2={handY}
        stroke="var(--mantine-color-red-6)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle
        cx={CLOCK_HINT_CX}
        cy={CLOCK_HINT_CY}
        r={2.5}
        fill="var(--mantine-color-gray-5)"
      />
    </svg>
  );
}

const sumCellStyle = {
  width: SUM_CELL_SIZE,
  height: SUM_CELL_SIZE,
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  borderRadius: 6,
  border: "2px solid var(--mantine-color-gray-3)",
  backgroundColor: "var(--mantine-color-gray-0)",
  fontSize: 12,
  fontWeight: 700,
};

function SumHint() {
  return (
    <Group gap={4} justify="center" wrap="nowrap">
      <div style={sumCellStyle}>5</div>
      <div style={{ ...sumCellStyle, color: "var(--mantine-color-dimmed)" }}>
        ?
      </div>
      <div style={sumCellStyle}>9</div>
    </Group>
  );
}
const MEMORY_HIGHLIGHT_INDICES = [1, 4]; // две клетки «в подсвеченных красным»

function MemoryHint() {
  return (
    <Group gap={4} justify="center" wrap="nowrap">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            border: "2px solid",
            borderColor: MEMORY_HIGHLIGHT_INDICES.includes(i)
              ? "var(--mantine-color-red-6)"
              : "var(--mantine-color-default-border)",
            backgroundColor: MEMORY_HIGHLIGHT_INDICES.includes(i)
              ? "var(--mantine-color-red-1)"
              : "var(--mantine-color-gray-0)",
            fontSize: 10,
            color: "var(--mantine-color-dimmed)",
          }}
        >
          ?
        </div>
      ))}
    </Group>
  );
}

function ReactionHint() {
  return (
    <Group gap="md" justify="center" c="dimmed">
      {COLORS.map((color) => (
        <ColorKeyHint key={color} color={color} size={24} />
      ))}
    </Group>
  );
}

export function ActivityCardHint({ type }: ActivityCardHintProps) {
  return (
    <Group justify="center" mt="xs" style={{ margin: "auto 0" }}>
      {type === "memory" && <MemoryHint />}
      {type === "sum" && <SumHint />}
      {type === "reaction" && <ReactionHint />}
      {type === "clock" && <ClockHint />}
      {type === "grid" && <GridHint />}
    </Group>
  );
}
