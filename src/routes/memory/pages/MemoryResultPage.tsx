import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Paper } from "@mantine/core";
import { useMemorySession } from "../context/MemorySessionContext";
import { NextButton } from "../components/NextButton";

export function MemoryResultPage() {
  const navigate = useNavigate();
  const { roundResults, nextRound, isLastRound } = useMemorySession();

  const lastResult = roundResults[roundResults.length - 1];

  useEffect(() => {
    if (roundResults.length > 0) return;
    navigate({ to: "/memory/settings" });
  }, [roundResults.length, navigate]);

  if (!lastResult) return null;

  return (
    <Paper p="xl" radius="md" withBorder w="100%">
      <NextButton
        label={isLastRound ? "К результатам" : "Далее"}
        onNext={() => {
          if (isLastRound) {
            navigate({ to: "/memory/summary" });
          } else {
            nextRound();
            navigate({ to: "/memory/round" });
          }
        }}
      />
    </Paper>
  );
}
