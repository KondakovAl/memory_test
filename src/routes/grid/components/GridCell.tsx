import { Box, Text, UnstyledButton } from "@mantine/core";
import { CELL_SIZE } from "../constants";
import type { GridCell as GridCellType } from "../utils";

const cellStyle = {
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  borderRadius: 8,
  border: "2px solid var(--mantine-color-gray-3)",
  backgroundColor: "var(--mantine-color-gray-0)",
  width: CELL_SIZE,
  height: CELL_SIZE,
};

type Props = {
  cell: GridCellType;
  onSelect?: (value: number) => void;
};

export function GridCell({ cell, onSelect }: Props) {
  const content = (
    <Text fw={700} size="xl">
      {cell.centerNumber}
    </Text>
  );

  if (onSelect) {
    return (
      <UnstyledButton
        onClick={() => onSelect(cell.centerNumber)}
        style={cellStyle}
        styles={{
          root: {
            "&:hover": { backgroundColor: "var(--mantine-color-gray-1)" },
            "&:active": { backgroundColor: "var(--mantine-color-gray-2)" },
          },
        }}
      >
        {content}
      </UnstyledButton>
    );
  }

  return (
    <Box w={CELL_SIZE} h={CELL_SIZE} style={cellStyle}>
      {content}
    </Box>
  );
}
