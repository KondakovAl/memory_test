import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Stack, Title, Group } from "@mantine/core";
import { ReactionSessionProvider } from "./context/ReactionSessionContext";
import { ColorKeyHint } from "./components/ColorKeyHint";
import { COLORS } from "./constants";
import { BackLink } from "~/components";

export function ReactionLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname === "/reaction" || pathname === "/reaction/") {
      navigate({ to: "/reaction/settings" });
    }
  }, [pathname, navigate]);

  return (
    <ReactionSessionProvider>
      <Stack align="center" gap="xl" maw={600} mx="auto">
        <BackLink to="/" title="К занятиям" />
        <Title order={1}>Реакция на цвет</Title>
        <Group gap="lg" justify="center" c="dimmed">
          {COLORS.map((color) => (
            <ColorKeyHint key={color} color={color} size={28} />
          ))}
        </Group>
        <Outlet />
      </Stack>
    </ReactionSessionProvider>
  );
}
