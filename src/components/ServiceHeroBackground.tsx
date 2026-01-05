import { lazy, Suspense, memo } from 'react';
import { getBackgroundConfig, type BackgroundConfig } from '@/config/serviceBackgrounds';
import ErrorBoundary, { WebGLErrorFallback } from '@/components/ErrorBoundary';

// Lazy load heavy background components
const Squares = lazy(() => import('@/components/ui/Squares'));
const DotGrid = lazy(() => import('@/components/ui/DotGrid'));
const RippleGrid = lazy(() => import('@/components/ui/RippleGrid'));
const PrismaticBurst = lazy(() => import('@/components/ui/PrismaticBurst'));
const FaultyTerminal = lazy(() => import('@/components/ui/FaultyTerminal'));
const Orb = lazy(() => import('@/components/ui/Orb'));

interface ServiceHeroBackgroundProps {
  slug: string;
  fallbackGradient?: string;
}

// Simple loading fallback
const BackgroundLoader = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent" />
);

// Render the appropriate background based on config
// Wrapped in ErrorBoundary to gracefully handle WebGL/3D errors
const BackgroundRenderer = memo(({ config }: { config: BackgroundConfig }) => {
  const renderComponent = () => {
    switch (config.type) {
      case 'squares':
        return <Squares {...config.props} />;
      case 'dotgrid':
        return <DotGrid {...config.props} />;
      case 'ripplegrid':
        return <RippleGrid {...config.props} />;
      case 'prismaticburst':
        return <PrismaticBurst {...config.props} />;
      case 'terminal':
        return <FaultyTerminal {...config.props} />;
      case 'orb':
        return <Orb {...config.props} />;
      default:
        return <BackgroundLoader />;
    }
  };

  return (
    <ErrorBoundary
      variant="component"
      fallback={<WebGLErrorFallback />}
      onError={(error) => {
        console.warn(`[ServiceHeroBackground] ${config.type} component failed:`, error.message);
      }}
    >
      <Suspense fallback={<BackgroundLoader />}>
        {renderComponent()}
      </Suspense>
    </ErrorBoundary>
  );
});

BackgroundRenderer.displayName = 'BackgroundRenderer';

const ServiceHeroBackground = memo(({ slug, fallbackGradient }: ServiceHeroBackgroundProps) => {
  const config = getBackgroundConfig(slug);

  if (!config) {
    // Fallback to gradient if no background config found
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: fallbackGradient || 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, transparent 100%)'
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background with pointer events enabled for mouse interaction */}
      <div className="absolute inset-0 w-full h-full">
        <BackgroundRenderer config={config} />
      </div>
      {/* Gradient overlays - pointer-events-none so they don't block mouse */}
      <div className="absolute inset-0 bg-gradient-to-t from-hero-bg via-hero-bg/40 to-transparent pointer-events-none" />
    </div>
  );
});

ServiceHeroBackground.displayName = 'ServiceHeroBackground';

export default ServiceHeroBackground;
