import { lazy, Suspense, memo } from 'react';
import { getBackgroundConfig, type BackgroundConfig } from '@/config/serviceBackgrounds';

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
const BackgroundRenderer = memo(({ config }: { config: BackgroundConfig }) => {
  switch (config.type) {
    case 'squares':
      return (
        <Suspense fallback={<BackgroundLoader />}>
          <Squares {...config.props} />
        </Suspense>
      );
    case 'dotgrid':
      return (
        <Suspense fallback={<BackgroundLoader />}>
          <DotGrid {...config.props} />
        </Suspense>
      );
    case 'ripplegrid':
      return (
        <Suspense fallback={<BackgroundLoader />}>
          <RippleGrid {...config.props} />
        </Suspense>
      );
    case 'prismaticburst':
      return (
        <Suspense fallback={<BackgroundLoader />}>
          <PrismaticBurst {...config.props} />
        </Suspense>
      );
    case 'terminal':
      return (
        <Suspense fallback={<BackgroundLoader />}>
          <FaultyTerminal {...config.props} />
        </Suspense>
      );
    case 'orb':
      return (
        <Suspense fallback={<BackgroundLoader />}>
          <Orb {...config.props} />
        </Suspense>
      );
    default:
      return <BackgroundLoader />;
  }
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
