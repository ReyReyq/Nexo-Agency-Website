# Glassmorphic Components - Quick Reference

## 🎨 CSS Utilities

### Glass Effects
```css
.glass-premium   /* Light glass: 5% white, 12px blur */
.glass-dark      /* Dark glass: 40% black, 16px blur */
```

### Glow Effects
```css
.glow-primary    /* Primary color glow */
.glow-step-1     /* Blue glow #667eea */
.glow-step-2     /* Purple glow #764ba2 */
.glow-step-3     /* Pink glow #f5576c */
.glow-step-4     /* Orange glow #ff9f40 */
.glow-step-5     /* Teal glow #4bc0c0 */
```

### Text & Progress
```css
.text-gradient-animated  /* Animated gradient text */
.progress-glow          /* Pulsing progress bar glow */
```

---

## 🃏 GlassmorphicCard Component

### Import
```tsx
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
```

### Basic Usage
```tsx
<GlassmorphicCard className="p-8">
  Content here
</GlassmorphicCard>
```

### With All Props
```tsx
<GlassmorphicCard
  glowColor="#667eea"
  intensity="medium"  // 'subtle' | 'medium' | 'strong'
  animated={true}
  className="p-8"
>
  Content here
</GlassmorphicCard>
```

---

## 🌈 AnimatedGradientBackground Component

### Import
```tsx
import AnimatedGradientBackground from '@/components/ui/AnimatedGradientBackground';
```

### Usage
```tsx
<section className="relative bg-hero-bg">
  <AnimatedGradientBackground activeStep={1} />

  <div className="relative z-10">
    Your content here
  </div>
</section>
```

**activeStep**: 1-5 (changes color palette)

---

## 📦 Common Patterns

### ProcessSection Pattern
```tsx
function ProcessSection() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="relative bg-hero-bg min-h-screen py-20">
      <AnimatedGradientBackground activeStep={activeStep} />

      <div className="relative z-10 container mx-auto">
        <h2 className="text-5xl font-bold text-gradient-animated">
          Title
        </h2>

        <div className="grid grid-cols-5 gap-6">
          {steps.map((step) => (
            <GlassmorphicCard
              key={step.id}
              glowColor={step.color}
              animated={activeStep === step.id}
              onClick={() => setActiveStep(step.id)}
            >
              {step.content}
            </GlassmorphicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Card with Utilities
```tsx
<div className="glass-premium glow-step-1 p-8 rounded-2xl">
  <h3 className="text-gradient-animated">Title</h3>
  <p>Content</p>
</div>
```

### Progress Bar
```tsx
<div className="glass-premium rounded-full h-4 overflow-hidden">
  <div
    className="progress-glow h-full bg-primary"
    style={{ width: '60%' }}
  />
</div>
```

---

## 🎯 Step Colors Reference

| Step | Color Name | Hex Code | CSS Class |
|------|-----------|----------|-----------|
| 1    | Blue      | #667eea  | glow-step-1 |
| 2    | Purple    | #764ba2  | glow-step-2 |
| 3    | Pink      | #f5576c  | glow-step-3 |
| 4    | Orange    | #ff9f40  | glow-step-4 |
| 5    | Teal      | #4bc0c0  | glow-step-5 |

---

## ⚡ Performance Tips

1. Only one AnimatedGradientBackground per section
2. Use CSS utilities when you don't need animation
3. Prefer `intensity="subtle"` for nested cards
4. Test on mobile devices (blur can be expensive)

---

## 🎨 Design System

**Background**: `bg-hero-bg` (very dark)
**Text**: `text-hero-fg` (white)
**Accent**: `hsl(var(--primary))` (neon pink)

---

## 📱 Responsive Example

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
  {items.map((item) => (
    <GlassmorphicCard
      key={item.id}
      glowColor={item.color}
      intensity="medium"
      className="p-4 md:p-6 lg:p-8"
    >
      {item.content}
    </GlassmorphicCard>
  ))}
</div>
```

---

## 🔗 Files

- **CSS**: `/src/index.css`
- **GlassmorphicCard**: `/src/components/ui/GlassmorphicCard.tsx`
- **AnimatedGradientBackground**: `/src/components/ui/AnimatedGradientBackground.tsx`
- **Examples**: `/src/components/ui/GlassmorphicComponents.example.tsx`
- **Full Docs**: `/src/components/ui/GLASSMORPHIC_COMPONENTS.md`
