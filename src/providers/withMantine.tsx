import { ComponentType } from "react";
import { MantineProvider } from "@mantine/core";

export function withMantine(Component: ComponentType) {
  return function WithMantine() {
    return (
      <MantineProvider defaultColorScheme="light">
        <Component />
      </MantineProvider>
    );
  };
}
