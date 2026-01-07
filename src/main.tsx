import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";
// Lenis CSS is now fully inlined in index.html critical CSS to avoid render-blocking
import { initTracking } from "./utils/formTracking";
import { initAnalytics } from "./lib/analytics";

// Initialize form tracking to capture landing page and UTM parameters
initTracking();

// Initialize analytics (GA4 + Microsoft Clarity)
// Only runs in production - see lib/analytics.ts for configuration
initAnalytics();

// StrictMode helps identify potential issues:
// - Detects unsafe lifecycles and legacy API usage
// - Warns about deprecated findDOMNode usage
// - Detects unexpected side effects
// - Ensures reusable state (helps with Suspense/concurrent features)
// Note: StrictMode causes double-renders in development only (not production)
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary
        variant="page"
        onError={(error, errorInfo) => {
          // Log to console for debugging
          console.error('[App Error]', error, errorInfo);
          // Here you could integrate with error monitoring services like Sentry
        }}
      >
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>
);
