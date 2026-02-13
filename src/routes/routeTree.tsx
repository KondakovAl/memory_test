import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { StartPage } from "~/routes/index";
import { MemoryLayout } from "~/routes/memory/MemoryLayout";
import { MemorySettingsPage } from "~/routes/memory/pages/MemorySettingsPage";
import { MemoryRoundPage } from "~/routes/memory/pages/MemoryRoundPage";
import { MemoryResultPage } from "~/routes/memory/pages/MemoryResultPage";
import { MemorySummaryPage } from "~/routes/memory/pages/MemorySummaryPage";
import { ReactionLayout } from "~/routes/reaction/ReactionLayout";
import { ReactionSettingsPage } from "~/routes/reaction/pages/ReactionSettingsPage";
import { ReactionPlayPage } from "~/routes/reaction/pages/ReactionPlayPage";
import { ReactionSummaryPage } from "~/routes/reaction/pages/ReactionSummaryPage";
import { SumLayout } from "~/routes/sum/SumLayout";
import { SumSettingsPage } from "~/routes/sum/pages/SumSettingsPage";
import { SumRoundPage } from "~/routes/sum/pages/SumRoundPage";
import { SumSummaryPage } from "~/routes/sum/pages/SumSummaryPage";
import { ClockLayout } from "~/routes/clock/ClockLayout";
import { ClockSettingsPage } from "~/routes/clock/pages/ClockSettingsPage";
import { ClockPlayPage } from "~/routes/clock/pages/ClockPlayPage";
import { ClockSummaryPage } from "~/routes/clock/pages/ClockSummaryPage";
import { GridLayout } from "~/routes/grid/GridLayout";
import { GridSettingsPage } from "~/routes/grid/pages/GridSettingsPage";
import { GridPlayPage } from "~/routes/grid/pages/GridPlayPage";
import { GridSummaryPage } from "~/routes/grid/pages/GridSummaryPage";
import { ResultsPage } from "~/routes/results/ResultsPage";

const rootRoute = createRootRoute({
  component: () => (
    <div style={{ minHeight: "100vh", padding: 24 }}>
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: StartPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: ResultsPage,
});

const memoryLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/memory",
  component: MemoryLayout,
});

const memorySettingsRoute = createRoute({
  getParentRoute: () => memoryLayoutRoute,
  path: "settings",
  component: MemorySettingsPage,
});

const memoryRoundRoute = createRoute({
  getParentRoute: () => memoryLayoutRoute,
  path: "round",
  component: MemoryRoundPage,
});

const memoryResultRoute = createRoute({
  getParentRoute: () => memoryLayoutRoute,
  path: "result",
  component: MemoryResultPage,
});

const memorySummaryRoute = createRoute({
  getParentRoute: () => memoryLayoutRoute,
  path: "summary",
  component: MemorySummaryPage,
});

const memoryRoute = memoryLayoutRoute.addChildren([
  memorySettingsRoute,
  memoryRoundRoute,
  memoryResultRoute,
  memorySummaryRoute,
]);

const reactionLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reaction",
  component: ReactionLayout,
});

const reactionSettingsRoute = createRoute({
  getParentRoute: () => reactionLayoutRoute,
  path: "settings",
  component: ReactionSettingsPage,
});

const reactionPlayRoute = createRoute({
  getParentRoute: () => reactionLayoutRoute,
  path: "play",
  component: ReactionPlayPage,
});

const reactionSummaryRoute = createRoute({
  getParentRoute: () => reactionLayoutRoute,
  path: "summary",
  component: ReactionSummaryPage,
});

const reactionRoute = reactionLayoutRoute.addChildren([
  reactionSettingsRoute,
  reactionPlayRoute,
  reactionSummaryRoute,
]);

const sumLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sum",
  component: SumLayout,
});

const sumSettingsRoute = createRoute({
  getParentRoute: () => sumLayoutRoute,
  path: "settings",
  component: SumSettingsPage,
});

const sumRoundRoute = createRoute({
  getParentRoute: () => sumLayoutRoute,
  path: "round",
  component: SumRoundPage,
});

const sumSummaryRoute = createRoute({
  getParentRoute: () => sumLayoutRoute,
  path: "summary",
  component: SumSummaryPage,
});

const sumRoute = sumLayoutRoute.addChildren([
  sumSettingsRoute,
  sumRoundRoute,
  sumSummaryRoute,
]);

const clockLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/clock",
  component: ClockLayout,
});

const clockSettingsRoute = createRoute({
  getParentRoute: () => clockLayoutRoute,
  path: "settings",
  component: ClockSettingsPage,
});

const clockPlayRoute = createRoute({
  getParentRoute: () => clockLayoutRoute,
  path: "play",
  component: ClockPlayPage,
});

const clockSummaryRoute = createRoute({
  getParentRoute: () => clockLayoutRoute,
  path: "summary",
  component: ClockSummaryPage,
});

const clockRoute = clockLayoutRoute.addChildren([
  clockSettingsRoute,
  clockPlayRoute,
  clockSummaryRoute,
]);

const gridLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/grid",
  component: GridLayout,
});

const gridSettingsRoute = createRoute({
  getParentRoute: () => gridLayoutRoute,
  path: "settings",
  component: GridSettingsPage,
});

const gridPlayRoute = createRoute({
  getParentRoute: () => gridLayoutRoute,
  path: "play",
  component: GridPlayPage,
});

const gridSummaryRoute = createRoute({
  getParentRoute: () => gridLayoutRoute,
  path: "summary",
  component: GridSummaryPage,
});

const gridRoute = gridLayoutRoute.addChildren([
  gridSettingsRoute,
  gridPlayRoute,
  gridSummaryRoute,
]);

const routeTree = rootRoute.addChildren([
  indexRoute,
  resultsRoute,
  memoryRoute,
  reactionRoute,
  sumRoute,
  clockRoute,
  gridRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
