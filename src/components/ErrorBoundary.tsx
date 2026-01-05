import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Props {
  children: ReactNode;
  /** Custom fallback UI to render on error */
  fallback?: ReactNode;
  /** Fallback variant - determines the style/size of default fallback */
  variant?: 'page' | 'section' | 'component';
  /** Optional error handler for custom logging/reporting */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Reset key - when this changes, the error boundary will reset */
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// ============================================
// MAIN ERROR BOUNDARY CLASS
// ============================================

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store error info for potential display
    this.setState({ errorInfo });

    // Log error details for debugging
    console.error('[ErrorBoundary] Error caught:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Call optional error handler for external logging (e.g., Sentry, analytics)
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when resetKey changes
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const variant = this.props.variant || 'page';

      // Render appropriate fallback based on variant
      switch (variant) {
        case 'component':
          return <ComponentErrorFallback onRetry={this.handleReset} />;
        case 'section':
          return <SectionErrorFallback onRetry={this.handleReset} />;
        case 'page':
        default:
          return (
            <PageErrorFallback
              onRetry={this.handleReset}
              onReload={this.handleReload}
              onGoHome={this.handleGoHome}
              error={this.state.error}
            />
          );
      }
    }

    return this.props.children;
  }
}

// ============================================
// PAGE-LEVEL ERROR FALLBACK
// Full-page error display for critical errors
// ============================================

interface PageErrorFallbackProps {
  onRetry?: () => void;
  onReload?: () => void;
  onGoHome?: () => void;
  error?: Error;
}

export const PageErrorFallback = ({
  onRetry,
  onReload,
  onGoHome,
  error,
}: PageErrorFallbackProps) => (
  <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
    <div className="text-center p-8 max-w-md">
      {/* Error Icon */}
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4 font-heebo text-foreground">
        משהו השתבש
      </h1>

      {/* Description */}
      <p className="text-muted-foreground mb-6 font-heebo">
        אנחנו מצטערים, משהו לא עבד כמו שצריך.
        <br />
        נסו לרענן את הדף או לחזור לדף הבית.
      </p>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && error && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg text-right text-sm font-mono text-muted-foreground overflow-auto max-h-32">
          {error.message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-heebo font-medium hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            נסו שוב
          </button>
        )}

        {onReload && (
          <button
            onClick={onReload}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-heebo font-medium hover:bg-muted/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            רענן דף
          </button>
        )}

        {onGoHome && (
          <button
            onClick={onGoHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg font-heebo font-medium hover:bg-muted/50 transition-colors"
          >
            <Home className="w-4 h-4" />
            דף הבית
          </button>
        )}
      </div>
    </div>
  </div>
);

// ============================================
// SECTION-LEVEL ERROR FALLBACK
// For sections within a page that can fail independently
// ============================================

interface SectionErrorFallbackProps {
  onRetry?: () => void;
  message?: string;
}

export const SectionErrorFallback = ({
  onRetry,
  message = 'לא ניתן לטעון את התוכן',
}: SectionErrorFallbackProps) => (
  <div className="py-12 px-4 text-center" dir="rtl">
    <div className="max-w-sm mx-auto">
      {/* Small warning icon */}
      <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Message */}
      <p className="text-muted-foreground font-heebo mb-4">{message}</p>

      {/* Retry button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-muted hover:bg-muted/80 text-foreground rounded-lg font-heebo transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          נסו שוב
        </button>
      )}
    </div>
  </div>
);

// ============================================
// COMPONENT-LEVEL ERROR FALLBACK
// Minimal fallback for small components (e.g., 3D backgrounds)
// ============================================

interface ComponentErrorFallbackProps {
  onRetry?: () => void;
}

export const ComponentErrorFallback = ({ onRetry }: ComponentErrorFallbackProps) => (
  <div
    className="w-full h-full min-h-[100px] flex items-center justify-center bg-muted/30 rounded-lg"
    dir="rtl"
  >
    <div className="text-center p-4">
      <p className="text-sm text-muted-foreground font-heebo mb-2">
        טעינה נכשלה
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 text-foreground rounded font-heebo transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          נסו שוב
        </button>
      )}
    </div>
  </div>
);

// ============================================
// WEBGL/3D SPECIFIC ERROR FALLBACK
// For heavy WebGL/3D components that might fail on low-end devices
// ============================================

export const WebGLErrorFallback = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-muted/50" />
);

// ============================================
// HIGHER-ORDER COMPONENT FOR EASY WRAPPING
// ============================================

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: Omit<Props, 'children'>
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary {...options}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}

export default ErrorBoundary;
