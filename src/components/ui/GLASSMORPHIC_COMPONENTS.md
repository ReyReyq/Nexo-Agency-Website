# Glassmorphic Components & Utilities

Premium glassmorphic styles and utility components for the NEXO Vision ProcessSection and other dark-themed sections.

## Table of Contents

- [CSS Utilities](#css-utilities)
- [GlassmorphicCard Component](#glassmorphiccard-component)
- [AnimatedGradientBackground Component](#animatedgradientbackground-component)
- [Usage Examples](#usage-examples)
- [Design Tokens](#design-tokens)

---

## CSS Utilities

### Glassmorphism Effects

#### `.glass-premium`
Premium glassmorphic effect with subtle transparency and blur.

```tsx
<div className="glass-premium p-8 rounded-2xl">
  Content here
</div>
```

**Properties:**
- Background: `rgba(255, 255, 255, 0.05)`
- Backdrop blur: `12px`
- Border: `1px solid rgba(255, 255, 255, 0.1)`
- Box shadow: Multi-layer with inset highlight

#### `.glass-dark`
Darker glassmorphic effect for hero sections.

```tsx
<div className="glass-dark p-8 rounded-2xl">
  Content here
</div>
```

**Properties:**
- Background: `rgba(0, 0, 0, 0.4)`
- Backdrop blur: `16px`
- Border: `1px solid rgba(255, 255, 255, 0.08)`
- Box shadow: Deeper shadows with subtle inset highlight

### Glow Effects

#### `.glow-primary`
Primary color glow effect using CSS variables.

```tsx
<div className="glass-premium glow-primary">
  Glowing content
</div>
```

#### `.glow-step-1` through `.glow-step-5`
Step-specific glow colors for the ProcessSection.

```tsx
<div className="glass-premium glow-step-1">Step 1</div>
<div className="glass-premium glow-step-2">Step 2</div>
<div className="glass-premium glow-step-3">Step 3</div>
<div className="glass-premium glow-step-4">Step 4</div>
<div className="glass-premium glow-step-5">Step 5</div>
```

**Colors:**
- Step 1: Blue `#667eea`
- Step 2: Purple `#764ba2`
- Step 3: Pink `#f5576c`
- Step 4: Orange `#ff9f40`
- Step 5: Teal `#4bc0c0`

### Text Effects

#### `.text-gradient-animated`
Animated gradient text with smooth color transitions.

```tsx
<h1 className="text-gradient-animated text-5xl font-bold">
  Premium Heading
</h1>
```

**Properties:**
- Gradient: Multi-color with 300% background size
- Animation: 4s infinite gradient shift
- Background clip: Text

### Progress Effects

#### `.progress-glow`
Glowing progress bar with pulsing animation.

```tsx
<div className="progress-glow h-4 bg-primary rounded-full"
     style={{ width: '60%' }} />
```

**Features:**
- Pulsing glow animation (2s cycle)
- Primary color based
- Smooth transitions

---

## GlassmorphicCard Component

A flexible glassmorphic card component with optional glow effects and animations.

### Props

```tsx
interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;           // Hex color for glow effect
  intensity?: 'subtle' | 'medium' | 'strong';
  animated?: boolean;           // Enables hover animations and glow pulse
}
```

### Intensity Levels

- **subtle**: `bg-white/5 backdrop-blur-sm`
- **medium**: `bg-white/10 backdrop-blur-md` (default)
- **strong**: `bg-white/15 backdrop-blur-lg`

### Features

- Glassmorphic background with customizable blur intensity
- Optional colored glow effect with pulsing animation
- Subtle border gradient overlay
- Bottom highlight for depth
- Hover scale animation when `animated={true}`
- Works beautifully on dark backgrounds

### Usage

```tsx
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

// Basic usage
<GlassmorphicCard className="p-8">
  <h3>Card Title</h3>
  <p>Card content</p>
</GlassmorphicCard>

// With glow and animation
<GlassmorphicCard
  glowColor="#667eea"
  intensity="strong"
  animated={true}
  className="p-8"
>
  <h3>Animated Card</h3>
</GlassmorphicCard>

// Subtle card
<GlassmorphicCard
  intensity="subtle"
  className="p-6"
>
  <p>Minimal glass effect</p>
</GlassmorphicCard>
```

---

## AnimatedGradientBackground Component

Creates a subtle animated gradient mesh background with step-specific color palettes.

### Props

```tsx
interface AnimatedGradientBackgroundProps {
  activeStep: number;    // 1-5, determines color palette
  className?: string;
}
```

### Features

- **Multiple gradient blobs** that slowly move and scale
- **Color transitions** based on activeStep (using Framer Motion)
- **CSS animations** for performance (not JS-based)
- **Grain/noise overlay** for subtle texture
- **Vignette effect** for depth
- **Seamless fade** at top and bottom
- **5 unique color palettes** matching the process steps

### Color Palettes

Each step has a unique 3-color palette:

1. **Step 1**: Blue-focused `(#667eea, #677eea, #764ba2)`
2. **Step 2**: Purple-focused `(#764ba2, #f5576c, #667eea)`
3. **Step 3**: Pink-focused `(#f5576c, #ff9f40, #764ba2)`
4. **Step 4**: Orange-focused `(#ff9f40, #4bc0c0, #f5576c)`
5. **Step 5**: Teal-focused `(#4bc0c0, #667eea, #ff9f40)`

### Usage

```tsx
import AnimatedGradientBackground from '@/components/ui/AnimatedGradientBackground';

function ProcessSection() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="relative min-h-screen bg-hero-bg">
      {/* Animated background */}
      <AnimatedGradientBackground activeStep={activeStep} />

      {/* Content */}
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </section>
  );
}
```

### Performance

- Uses CSS animations and transforms for 60fps performance
- Gradient blobs are `pointer-events-none` to not interfere with UI
- Optimized blur and opacity values
- Framer Motion only used for color transitions between steps

---

## Usage Examples

### Example 1: ProcessSection Integration

```tsx
import { useState } from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import AnimatedGradientBackground from '@/components/ui/AnimatedGradientBackground';

function ProcessSection() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, icon: '🎯', title: 'Discovery', color: '#667eea' },
    { id: 2, icon: '✨', title: 'Design', color: '#764ba2' },
    { id: 3, icon: '🚀', title: 'Development', color: '#f5576c' },
    { id: 4, icon: '💡', title: 'Testing', color: '#ff9f40' },
    { id: 5, icon: '🎉', title: 'Launch', color: '#4bc0c0' },
  ];

  return (
    <section className="relative min-h-screen bg-hero-bg text-hero-fg py-20">
      <AnimatedGradientBackground activeStep={activeStep} />

      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-gradient-animated">
          Our Process
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step) => (
            <GlassmorphicCard
              key={step.id}
              glowColor={step.color}
              intensity="medium"
              animated={activeStep === step.id}
              className="p-8 cursor-pointer"
              onClick={() => setActiveStep(step.id)}
            >
              <div className="text-6xl mb-4">{step.icon}</div>
              <h3 className="text-2xl font-bold">{step.title}</h3>
            </GlassmorphicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Example 2: Progress Tracker

```tsx
function ProgressTracker({ progress }: { progress: number }) {
  return (
    <GlassmorphicCard intensity="strong" className="p-6">
      <h3 className="text-xl font-bold mb-4 text-gradient-animated">
        Project Progress
      </h3>

      {/* Progress bar */}
      <div className="glass-premium rounded-full h-3 overflow-hidden mb-2">
        <div
          className="progress-glow h-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-white/60">
        <span>0%</span>
        <span className="text-glow-sm">{progress}%</span>
        <span>100%</span>
      </div>
    </GlassmorphicCard>
  );
}
```

### Example 3: Feature Grid

```tsx
function FeatureGrid() {
  const features = [
    { title: 'Fast', color: '#667eea', glow: 'glow-step-1' },
    { title: 'Secure', color: '#764ba2', glow: 'glow-step-2' },
    { title: 'Scalable', color: '#f5576c', glow: 'glow-step-3' },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {features.map((feature) => (
        <GlassmorphicCard
          key={feature.title}
          glowColor={feature.color}
          animated
          className="p-8 text-center"
        >
          <h3 className="text-2xl font-bold">{feature.title}</h3>
        </GlassmorphicCard>
      ))}
    </div>
  );
}
```

---

## Design Tokens

These components use the existing NEXO design tokens from `index.css`:

```css
--primary: 328 100% 54%;           /* Neon pink */
--hero-bg: 0 0% 4%;                /* Dark background */
--hero-fg: 0 0% 100%;              /* White text */
--neon-pink: 328 100% 54%;         /* Brand accent */
```

### Color References

Access colors using HSL format:
```tsx
hsl(var(--primary))
hsl(var(--hero-bg))
hsl(var(--hero-fg))
```

---

## Best Practices

1. **Use on dark backgrounds**: These components are optimized for dark (`bg-hero-bg`) backgrounds

2. **Combine utilities**: Mix CSS utilities with components for maximum flexibility
   ```tsx
   <div className="glass-premium glow-step-1 hover-lift">
     <h3 className="text-gradient-animated">Title</h3>
   </div>
   ```

3. **Performance**: AnimatedGradientBackground should be used sparingly (one per section)

4. **Accessibility**: Ensure text contrast meets WCAG standards on glass backgrounds

5. **Responsive design**: Test glass effects on different screen sizes and adjust blur/opacity as needed

---

## Browser Support

- Modern browsers with backdrop-filter support (Chrome 76+, Safari 14+, Firefox 103+)
- Fallback: Basic transparency without blur on older browsers
- Uses `-webkit-backdrop-filter` for Safari compatibility

---

## Future Enhancements

Potential improvements:
- [ ] Additional intensity levels
- [ ] More color palette presets
- [ ] Interactive hover states
- [ ] Accessibility improvements
- [ ] Dark/light mode variants
- [ ] Additional animation options
