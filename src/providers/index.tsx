import { ComponentType } from "react";

import { withMantine } from "./withMantine";

export function withProviders(Component: ComponentType) {
  return [withMantine].reduceRight((Target, wrap) => wrap(Target), Component);
}
