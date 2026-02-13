import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Stack, Title, Text } from "@mantine/core";
import { MemorySessionProvider } from "./context/MemorySessionContext";
import { BackLink } from "~/components";

export function MemoryLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname === "/memory" || pathname === "/memory/") {
      navigate({ to: "/memory/settings" });
    }
  }, [pathname, navigate]);

  return (
    <MemorySessionProvider>
      <Stack align="center" gap="xl" maw={600} mx="auto">
        <BackLink to="/" title="К занятиям" />
        <Title order={1}>Сложение по позициям</Title>
        <Text c="dimmed" ta="center">
          Запомни цифры за заданное время. Затем сложи две цифры в подсвеченных
          красным клетках.
        </Text>
        <Outlet />
      </Stack>
    </MemorySessionProvider>
  );
}
