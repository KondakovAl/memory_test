import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { withProviders } from "~/providers";
import { router } from "~/routes/routeTree";

import "@mantine/core/styles.css";

function App() {
  return <RouterProvider router={router} />;
}

const AppWithProviders = withProviders(App);

createRoot(document.getElementById("root")!).render(<AppWithProviders />);
