// Service-to-Background mapping configuration
// Each service gets a unique animated background based on its theme

export type BackgroundType = 'squares' | 'dotgrid' | 'ripplegrid' | 'prismaticburst' | 'terminal' | 'orb';

export interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  backgroundColor?: string;
}

export interface BackgroundConfig {
  type: BackgroundType;
  props: Record<string, any>;
}

export const serviceBackgrounds: Record<string, BackgroundConfig> = {
  // Orb - glowing interactive sphere
  'web-development': {
    type: 'orb',
    props: {
      hue: 270,  // Purple for web-dev
      hoverIntensity: 0.5,
      rotateOnHover: true,
      forceHoverState: false,
      backgroundColor: '#0a0a0a'
    }
  },
  'strategy': {
    type: 'squares',
    props: {
      speed: 0.2,
      squareSize: 60,
      direction: 'right',
      borderColor: 'rgba(168, 85, 247, 0.12)',
      hoverFillColor: 'rgba(168, 85, 247, 0.08)'
    }
  },

  // DotGrid - interactive data points with GSAP inertia physics
  'ecommerce': {
    type: 'dotgrid',
    props: {
      dotSize: 10,
      gap: 20,
      baseColor: '#10b981',
      activeColor: '#34d399',
      proximity: 120,
      speedTrigger: 100,
      shockRadius: 250,
      shockStrength: 5,
      maxSpeed: 5000,
      resistance: 750,
      returnDuration: 1.5
    }
  },
  'seo': {
    type: 'dotgrid',
    props: {
      dotSize: 8,
      gap: 18,
      baseColor: '#f59e0b',
      activeColor: '#fbbf24',
      proximity: 100,
      speedTrigger: 80,
      shockRadius: 200,
      shockStrength: 4,
      maxSpeed: 5000,
      resistance: 800,
      returnDuration: 1.2
    }
  },

  // RippleGrid - spreading influence with mouse interaction
  'branding': {
    type: 'ripplegrid',
    props: {
      enableRainbow: false,
      gridColor: '#ec4899', // Pink for branding
      rippleIntensity: 0.05,
      gridSize: 10,
      gridThickness: 15,
      fadeDistance: 1.5,
      vignetteStrength: 2.0,
      glowIntensity: 0.1,
      opacity: 0.8,
      mouseInteraction: true,
      mouseInteractionRadius: 1.2
    }
  },
  'social-media': {
    type: 'ripplegrid',
    props: {
      enableRainbow: false,
      gridColor: '#8b5cf6', // Purple for social media
      rippleIntensity: 0.05,
      gridSize: 10,
      gridThickness: 15,
      fadeDistance: 1.5,
      vignetteStrength: 2.0,
      glowIntensity: 0.1,
      opacity: 0.8,
      mouseInteraction: true,
      mouseInteractionRadius: 1.2
    }
  },

  // PrismaticBurst - dynamic light rays
  'digital-marketing': {
    type: 'prismaticburst',
    props: {
      animationType: 'rotate3d',
      intensity: 2,
      speed: 0.5,
      distort: 1.0,
      paused: false,
      offset: { x: 0, y: 0 },
      hoverDampness: 0.25,
      rayCount: 24,
      mixBlendMode: 'lighten',
      colors: ['#ff007a', '#4d3dff', '#ffffff'] // Pink, blue, white - marketing vibes
    }
  },
  'app-development': {
    type: 'prismaticburst',
    props: {
      animationType: 'rotate3d',
      intensity: 1.8,
      speed: 0.4,
      distort: 0.8,
      paused: false,
      offset: { x: 0, y: 0 },
      hoverDampness: 0.3,
      rayCount: 20,
      mixBlendMode: 'lighten',
      colors: ['#03b3c3', '#0e5ea5', '#ffffff'] // Cyan, blue, white - tech vibes
    }
  },

  // FaultyTerminal - tech/code aesthetic (WebGL shader effect)
  'ai-automation': {
    type: 'terminal',
    props: {
      scale: 1.5,
      gridMul: [2, 1] as [number, number],
      digitSize: 1.2,
      timeScale: 1,
      scanlineIntensity: 1,
      glitchAmount: 1,
      flickerAmount: 1,
      noiseAmp: 1,
      chromaticAberration: 0,
      dither: 0,
      curvature: 0,
      tint: '#00ff88', // Green tint for AI
      mouseReact: true,
      mouseStrength: 0.5,
      pageLoadAnimation: true,
      brightness: 0.8
    }
  },
  'ai-images': {
    type: 'terminal',
    props: {
      scale: 1.5,
      gridMul: [2, 1] as [number, number],
      digitSize: 1.2,
      timeScale: 1,
      scanlineIntensity: 1,
      glitchAmount: 1.2,
      flickerAmount: 1,
      noiseAmp: 1,
      chromaticAberration: 2,
      dither: 0,
      curvature: 0,
      tint: '#ff00ff', // Magenta tint for creative AI
      mouseReact: true,
      mouseStrength: 0.5,
      pageLoadAnimation: true,
      brightness: 0.8
    }
  },
  'custom-development': {
    type: 'terminal',
    props: {
      scale: 1.5,
      gridMul: [2, 1] as [number, number],
      digitSize: 1.2,
      timeScale: 1,
      scanlineIntensity: 1,
      glitchAmount: 1,
      flickerAmount: 1,
      noiseAmp: 1,
      chromaticAberration: 0,
      dither: 0,
      curvature: 0.1,
      tint: '#00ffff', // Cyan tint for custom dev
      mouseReact: true,
      mouseStrength: 0.5,
      pageLoadAnimation: true,
      brightness: 0.8
    }
  }
};

export const getBackgroundConfig = (slug: string): BackgroundConfig | null => {
  return serviceBackgrounds[slug] || null;
};
