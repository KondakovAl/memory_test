import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Stack, Title, Text } from "@mantine/core";
import { ClockSessionProvider } from "./context/ClockSessionContext";
import { BackLink } from "~/components";

export function ClockLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname === "/clock" || pathname === "/clock/") {
      navigate({ to: "/clock/settings" });
    }
  }, [pathname, navigate]);

  return (
    <ClockSessionProvider>
      <Stack align="center" gap="xl" maw={600} mx="auto">
        <BackLink to="/" title="К занятиям" />
        <Title order={1}>Тест циферблат</Title>
        <Text c="dimmed" ta="center">
          Стрелка движется — нажми «Стоп», когда она будет на 12 часах.
        </Text>
        <Outlet />
      </Stack>
    </ClockSessionProvider>
  );
}
