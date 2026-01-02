import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "lenis/dist/lenis.css";
import { initTracking } from "./utils/formTracking";

// Initialize form tracking to capture landing page and UTM parameters
initTracking();

// StrictMode helps identify potential issues:
// - Detects unsafe lifecycles and legacy API usage
// - Warns about deprecated findDOMNode usage
// - Detects unexpected side effects
// - Ensures reusable state (helps with Suspense/concurrent features)
// Note: StrictMode causes double-renders in development only (not production)
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
