import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Stack, Title, Text } from "@mantine/core";
import { SumSessionProvider } from "./context/SumSessionContext";
import { BackLink } from "~/components";

export function SumLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname === "/sum" || pathname === "/sum/") {
      navigate({ to: "/sum/settings" });
    }
  }, [pathname, navigate]);

  return (
    <SumSessionProvider>
      <Stack align="center" gap="xl" maw={600} mx="auto">
        <BackLink to="/" title="К занятиям" />
        <Title order={1}>Сложение двух чисел</Title>
        <Text c="dimmed" ta="center">
          Два числа слева и справа — введи их сумму в поле по центру.
        </Text>
        <Outlet />
      </Stack>
    </SumSessionProvider>
  );
}
