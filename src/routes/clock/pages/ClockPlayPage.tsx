import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Paper, Group, Button, Stack, Text } from "@mantine/core";
import { useClockSession } from "../context/ClockSessionContext";
import { ClockFace } from "../components/ClockFace";

/** Ошибка в градусах от 12 часов (0–180) */
function errorFrom12(angleDeg: number): number {
  const normalized = ((angleDeg % 360) + 360) % 360;
  return Math.min(normalized, 360 - normalized);
}

/** Случайный стартовый угол: любая четверть, кроме последней (9–12 часов, 270–360°) */
function randomStartAngle(): number {
  return Math.random() * 270;
}

export function ClockPlayPage() {
  const navigate = useNavigate();
  const {
    settings,
    currentRound,
    roundCount,
    addRoundResult,
    nextRound,
    isLastRound,
  } = useClockSession();

  const [angle, setAngle] = useState(randomStartAngle);
  const [stopped, setStopped] = useState(false);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const goToNext = useCallback(() => {
    if (isLastRound) {
      navigate({ to: "/clock/summary" });
    } else {
      nextRound();
      setStopped(false);
      setAngle(randomStartAngle());
      lastTimeRef.current = 0;
    }
  }, [isLastRound, nextRound, navigate]);

  const handleStop = useCallback(() => {
    if (stopped) return;
    setStopped(true);
    cancelAnimationFrame(rafRef.current);

    const errorDeg = errorFrom12(angle);
    addRoundResult({ angleAtStop: angle, errorDeg });
    goToNext();
  }, [stopped, angle, addRoundResult, goToNext]);

  useEffect(() => {
    if (stopped) return;

    const speed = settings.speedDegPerSec;

    const tick = (now: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = now;
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setAngle((a) => a + speed * delta);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [settings.speedDegPerSec, currentRound, stopped]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleStop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleStop]);

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <Group justify="space-between" mb="md">
        <Text size="sm" c="dimmed">
          Раунд {currentRound} из {roundCount}
        </Text>
        <Text size="sm" c="dimmed">
          Пробел или кнопка — стоп
        </Text>
      </Group>

      <Stack gap="xl" align="center">
        <ClockFace angleDeg={angle} />

        <Button size="lg" onClick={handleStop} disabled={stopped}>
          Стоп
        </Button>
      </Stack>
    </Paper>
  );
}
