import { useMemo, memo } from "react";

/**
 * AboutRibbonBackground - Same as RibbonBackground but without top ribbons
 * Used in AboutSection for visual continuity
 *
 * Performance optimizations:
 * - Wrapped with React.memo to prevent re-renders when parent state changes
 * - Uses useMemo for stable style objects to prevent unnecessary re-renders
 * - Unique gradient IDs (about-grad-*) to prevent conflicts with RibbonBackground
 * - CSS handles reduced-motion preference directly (no JS state needed)
 */

// Memoized animation styles to prevent object recreation on re-renders
const animationStyles = {
  ribbon3: { animationDelay: "0.6s", animationDuration: "14s" },
  ribbon4: { animationDelay: "1s", animationDuration: "13s" },
  ribbon5: { animationDelay: "1.3s", animationDuration: "11s" },
  ribbon6: { animationDelay: "1.5s", animationDuration: "15s" },
  ribbon7: { animationDelay: "1.8s", animationDuration: "14s" },
  ribbon8: { animationDelay: "2s", animationDuration: "13s" },
  ribbonRight: { animationDelay: "0.9s", animationDuration: "13s" },
} as const;

const AboutRibbonBackground = () => {
  // Memoize CSS to prevent re-injection on re-renders
  const cssStyles = useMemo(() => `
    .about-ribbon-background {
      position: absolute;
      inset: 0;
      overflow: visible;
      pointer-events: none;
      z-index: 0;
    }

    .about-ribbon-svg {
      position: absolute;
      width: 100%;
      height: 200%;
      min-width: 1200px;
      top: 0;
    }

    .about-ribbon-path {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      mix-blend-mode: multiply;
    }

    @keyframes aboutRibbonFloat {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(20px) rotate(0.5deg);
      }
    }

    @keyframes aboutRibbonDraw {
      from {
        stroke-dashoffset: 4000;
      }
      to {
        stroke-dashoffset: 0;
      }
    }

    .about-ribbon-anim {
      stroke-dasharray: 4000;
      stroke-dashoffset: 0;
      animation:
        aboutRibbonDraw 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards,
        aboutRibbonFloat 10s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      .about-ribbon-anim {
        animation: none;
        transition: none;
      }
    }
  `, []);

  return (
    <div className="about-ribbon-background">
      <style>{cssStyles}</style>

      <svg
        className="about-ribbon-svg"
        viewBox="0 0 1440 1800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Gradient 1: Deep Purple to Hot Pink - unique ID for AboutRibbonBackground */}
          <linearGradient id="about-grad-purple-pink" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>

          {/* Gradient 2: Royal Blue to Cyan - unique ID for AboutRibbonBackground */}
          <linearGradient id="about-grad-blue-cyan" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>

          {/* Gradient 3: Subtle Gold/Orange - unique ID for AboutRibbonBackground */}
          <linearGradient id="about-grad-warm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* TOP RIBBONS REMOVED - Only keeping side and bottom ribbons */}

        {/*
           Ribbon 3: LEFT EDGE - Vertical Accent
           S-curve along left edge connecting top and bottom zones
        */}
        <path
          className="about-ribbon-path about-ribbon-anim"
          d="M -40,350 Q 100,380 130,480 Q 160,580 80,650 Q 0,720 100,800"
          stroke="url(#about-grad-blue-cyan)"
          strokeWidth="50"
          opacity="0.4"
          style={animationStyles.ribbon3}
        />

        {/*
           Ribbon 4: BOTTOM-LEFT - Rising Wave
           Upward wave from bottom-left corner
        */}
        <path
          className="about-ribbon-path about-ribbon-anim"
          d="M -30,950 Q 100,870 180,780 Q 260,690 340,740 Q 420,790 380,700"
          stroke="url(#about-grad-blue-cyan)"
          strokeWidth="60"
          opacity="0.5"
          style={animationStyles.ribbon4}
        />

        {/*
           Ribbon 5: BOTTOM-RIGHT - Elegant Swoop
           Smooth curve from bottom-right toward center-bottom
        */}
        <path
          className="about-ribbon-path about-ribbon-anim"
          d="M 1500,950 Q 1400,880 1320,800 Q 1240,720 1140,770 Q 1040,820 1000,740"
          stroke="url(#about-grad-warm)"
          strokeWidth="55"
          opacity="0.55"
          style={animationStyles.ribbon5}
        />

        {/* ========== CONTINUATION RIBBONS ========== */}

        {/*
           Ribbon 6: LEFT EDGE CONTINUATION
           S-curve continuing from left side
        */}
        <path
          className="about-ribbon-path about-ribbon-anim"
          d="M 100,800 Q 180,900 120,1000 Q 60,1100 150,1200 Q 240,1300 180,1400"
          stroke="url(#about-grad-purple-pink)"
          strokeWidth="50"
          opacity="0.4"
          style={animationStyles.ribbon6}
        />

        {/*
           Ribbon 7: RIGHT EDGE CONTINUATION
           Sweeping curve on right side
        */}
        <path
          className="about-ribbon-path about-ribbon-anim"
          d="M 1320,800 Q 1400,900 1350,1050 Q 1300,1200 1380,1350 Q 1460,1500 1380,1600"
          stroke="url(#about-grad-blue-cyan)"
          strokeWidth="55"
          opacity="0.45"
          style={animationStyles.ribbon7}
        />

        {/*
           Ribbon 8: BOTTOM CENTER-LEFT - Subtle accent
        */}
        <path
          className="about-ribbon-path about-ribbon-anim"
          d="M -40,1100 Q 100,1150 200,1250 Q 300,1350 250,1450"
          stroke="url(#about-grad-warm)"
          strokeWidth="45"
          opacity="0.35"
          style={animationStyles.ribbon8}
        />

        {/*
           Ribbon: RIGHT MIDDLE - Elegant S-Wave (Purple-Pink)
           Flowing curve on right side, visible in middle vertical area
        */}
        <path
          className="about-ribbon-path about-ribbon-anim"
          d="M 1500,420 Q 1380,480 1320,550 Q 1260,620 1340,680 Q 1420,740 1280,700"
          stroke="url(#about-grad-purple-pink)"
          strokeWidth="55"
          opacity="0.45"
          style={animationStyles.ribbonRight}
        />

      </svg>
    </div>
  );
};

AboutRibbonBackground.displayName = 'AboutRibbonBackground';

export default memo(AboutRibbonBackground);
