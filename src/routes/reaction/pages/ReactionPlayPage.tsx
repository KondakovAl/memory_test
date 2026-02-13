import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Paper, Group, Text, Stack } from "@mantine/core";
import { useReactionSession } from "../context/ReactionSessionContext";
import { COLORS, COLOR_HEX, COLOR_BY_KEY, type CircleColor } from "../constants";
import { useIsTouchDevice } from "../hooks";
import { ArrowKeyButtons } from "../components/ArrowKeyButtons";

function randomColor(): CircleColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

type ArrowKey = "ArrowLeft" | "ArrowDown" | "ArrowRight";

export function ReactionPlayPage() {
  const navigate = useNavigate();
  const isTouchDevice = useIsTouchDevice();
  const {
    currentRound,
    roundCount,
    addRoundResult,
    nextRound,
    isLastRound,
  } = useReactionSession();

  const [currentColor, setCurrentColor] = useState<CircleColor | null>(null);
  const [showCircle, setShowCircle] = useState(false);
  const showAtRef = useRef<number>(0);

  const goToNext = useCallback(() => {
    if (isLastRound) {
      navigate({ to: "/reaction/summary" });
      return;
    }
    nextRound();
    setCurrentColor(null);
    setShowCircle(false);
    setTimeout(() => {
      const color = randomColor();
      setCurrentColor(color);
      setShowCircle(true);
      showAtRef.current = Date.now();
    }, 300);
  }, [isLastRound, nextRound, navigate]);

  const handleArrowPress = useCallback(
    (key: ArrowKey) => {
      if (!showCircle || !currentColor) return;
      const pressedColor = COLOR_BY_KEY[key];
      const correct = pressedColor === currentColor;
      const timeMs = Date.now() - showAtRef.current;
      addRoundResult(timeMs, correct);
      setShowCircle(false);
      goToNext();
    },
    [showCircle, currentColor, addRoundResult, goToNext]
  );

  useEffect(() => {
    const color = randomColor();
    setCurrentColor(color);
    setShowCircle(true);
    showAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!showCircle || !currentColor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (
        key !== "ArrowLeft" &&
        key !== "ArrowDown" &&
        key !== "ArrowRight"
      )
        return;
      e.preventDefault();
      handleArrowPress(key as ArrowKey);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCircle, currentColor, handleArrowPress]);

  if (!currentColor) return null;

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <Text size="sm" c="dimmed" mb="md">
        Раунд {currentRound} из {roundCount}. ← красный, ↓ жёлтый, → зелёный
      </Text>
      <Stack gap="xl">
        <Group justify="center" style={{ minHeight: 200 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              backgroundColor: showCircle
                ? COLOR_HEX[currentColor]
                : "var(--mantine-color-gray-2)",
              transition: "background-color 0.1s",
            }}
          />
        </Group>
        {isTouchDevice && (
          <ArrowKeyButtons onPress={handleArrowPress} size={64} />
        )}
      </Stack>
    </Paper>
  );
}
