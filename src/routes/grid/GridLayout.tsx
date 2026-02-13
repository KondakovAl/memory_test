import { useEffect } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Stack, Title, Text } from "@mantine/core";
import { GridSessionProvider } from "./context/GridSessionContext";
import { BackLink } from "~/components";

export function GridLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname === "/grid" || pathname === "/grid/") {
      navigate({ to: "/grid/settings" });
    }
  }, [pathname, navigate]);

  return (
    <GridSessionProvider>
      <Stack align="center" gap="xl" maw={600} mx="auto">
        <BackLink to="/" title="К занятиям" />
        <Title order={1}>Таблица 3×3</Title>
        <Text c="dimmed" ta="center">
          Над сеткой дана цифра раунда. Выбери число из клетки, наиболее близкое
          к ней, и введи его в ответ. На ячейку можно нажать, тогда цифра
          подставится в ответ.
        </Text>
        <Outlet />
      </Stack>
    </GridSessionProvider>
  );
}
