# Animated Background Components

This directory contains animated background components for service pages.

## Available Components

### 1. Squares
Animated grid pattern with moving squares.

```tsx
import Squares from '@/components/ui/Squares';

<Squares
  speed={0.5}
  squareSize={40}
  direction='diagonal' // 'up' | 'down' | 'left' | 'right' | 'diagonal'
  borderColor='#fff'
  hoverFillColor='#222'
/>
```

**Best for:** Web Development, Strategy (structured, modular feel)

### 2. DotGrid
Interactive dot grid with shock wave effects on mouse movement.

```tsx
import DotGrid from '@/components/ui/DotGrid';

<DotGrid
  dotSize={16}
  gap={32}
  baseColor="#5227FF"
  activeColor="#5227FF"
  proximity={150}
  speedTrigger={100}
  shockRadius={250}
  shockStrength={5}
  maxSpeed={5000}
  resistance={750}
  returnDuration={1.5}
/>
```

**Best for:** E-commerce, SEO (data points, search results)

### 3. RippleGrid
Wave/ripple effect grid with WebGL rendering.

```tsx
import RippleGrid from '@/components/ui/RippleGrid';

<RippleGrid
  enableRainbow={false}
  gridColor="#ffffff"
  rippleIntensity={0.05}
  gridSize={10}
  gridThickness={15}
  mouseInteraction={true}
  mouseInteractionRadius={1.2}
  opacity={0.8}
/>
```

**Requires:** `ogl` package
**Best for:** Branding, Social Media (influence spreading)

### 4. Hyperspeed
3D road/highway animation with car lights.

```tsx
import Hyperspeed, { hyperspeedPresets } from '@/components/ui/Hyperspeed';

<Hyperspeed
  effectOptions={{
    length: 400,
    roadWidth: 10,
    fov: 90,
    colors: hyperspeedPresets.marketing.colors
  }}
/>
```

**Requires:** `three`, `postprocessing` packages
**Best for:** Digital Marketing, App Development (speed, momentum)

### 5. FaultyTerminal
CRT terminal effect with typing animation and glitches.

```tsx
import FaultyTerminal, { terminalPresets } from '@/components/ui/FaultyTerminal';

<FaultyTerminal
  text={terminalPresets.aiAutomation}
  typingSpeed={50}
  glitchIntensity={0.3}
  textColor="#00ff00"
  glowColor="#00ff00"
  scanlineOpacity={0.1}
/>
```

**Best for:** AI & Automation, AI Images, Custom Development (tech/code feel)

## Service-to-Background Mapping

| Service | Background | Reasoning |
|---------|------------|-----------|
| web-development | Squares | Grid pattern evokes code structure |
| ecommerce | DotGrid | Dots represent products, clicks |
| branding | RippleGrid | Waves = brand influence |
| ai-automation | FaultyTerminal | Terminal aesthetic fits AI |
| digital-marketing | Hyperspeed | Speed = marketing reach |
| seo | DotGrid | Data points, rankings |
| social-media | RippleGrid | Ripples = viral spread |
| ai-images | FaultyTerminal | Glitch = AI-generated |
| strategy | Squares | Structured planning |
| app-development | Hyperspeed | Speed = performance |
| custom-development | FaultyTerminal | Code/terminal feel |

## Usage in ServiceDetail

The backgrounds are automatically selected based on the service slug in `ServiceDetail.tsx`.
Each background is wrapped in an absolute positioned container within the hero section.
