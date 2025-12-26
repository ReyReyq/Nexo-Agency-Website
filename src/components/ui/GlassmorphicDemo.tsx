/**
 * GLASSMORPHIC COMPONENTS DEMO
 *
 * This is a comprehensive demo page that showcases all glassmorphic components
 * and utilities. Use this to test and verify the implementation.
 *
 * To use: Import this component into your app and render it on a test route.
 */

import React, { useState } from 'react';
import GlassmorphicCard from './GlassmorphicCard';
import AnimatedGradientBackground from './AnimatedGradientBackground';

const GlassmorphicDemo = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [progress, setProgress] = useState(60);

  const steps = [
    { id: 1, icon: '🎯', title: 'Discovery', color: '#667eea', description: 'Understanding your vision and goals' },
    { id: 2, icon: '✨', title: 'Design', color: '#764ba2', description: 'Creating stunning visual experiences' },
    { id: 3, icon: '🚀', title: 'Development', color: '#f5576c', description: 'Building with cutting-edge tech' },
    { id: 4, icon: '💡', title: 'Testing', color: '#ff9f40', description: 'Ensuring quality and performance' },
    { id: 5, icon: '🎉', title: 'Launch', color: '#4bc0c0', description: 'Going live and celebrating success' },
  ];

  return (
    <div className="min-h-screen bg-hero-bg text-hero-fg">
      {/* Section 1: ProcessSection Demo */}
      <section className="relative min-h-screen py-20">
        <AnimatedGradientBackground activeStep={activeStep} />

        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-6xl font-bold text-center mb-4 text-gradient-animated">
            Glassmorphic Components Demo
          </h1>
          <p className="text-center text-white/60 mb-16 text-xl">
            Click on any step to see the background animation change
          </p>

          {/* Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {steps.map((step) => (
              <GlassmorphicCard
                key={step.id}
                glowColor={step.color}
                intensity="medium"
                animated={activeStep === step.id}
                className="p-6 cursor-pointer transition-all duration-300"
                onClick={() => setActiveStep(step.id)}
              >
                <div className="text-6xl mb-4 text-center">{step.icon}</div>
                <h3 className="text-2xl font-bold mb-2 text-center">{step.title}</h3>
                <p className="text-white/70 text-sm text-center">
                  {step.description}
                </p>
                {activeStep === step.id && (
                  <div className="mt-4 text-center">
                    <span className="text-xs text-primary font-semibold">ACTIVE</span>
                  </div>
                )}
              </GlassmorphicCard>
            ))}
          </div>

          {/* Active Step Indicator */}
          <div className="text-center">
            <p className="text-white/40 text-sm">Active Step: {activeStep}</p>
          </div>
        </div>
      </section>

      {/* Section 2: Intensity Levels Demo */}
      <section className="relative py-20 bg-gradient-to-b from-hero-bg to-black/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient-animated">
            Intensity Levels
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <GlassmorphicCard intensity="subtle" className="p-8">
              <h3 className="text-2xl font-bold mb-2">Subtle</h3>
              <p className="text-white/70">5% opacity, small blur</p>
              <div className="mt-4 text-sm text-white/50">
                bg-white/5 backdrop-blur-sm
              </div>
            </GlassmorphicCard>

            <GlassmorphicCard intensity="medium" className="p-8">
              <h3 className="text-2xl font-bold mb-2">Medium</h3>
              <p className="text-white/70">10% opacity, medium blur</p>
              <div className="mt-4 text-sm text-white/50">
                bg-white/10 backdrop-blur-md
              </div>
            </GlassmorphicCard>

            <GlassmorphicCard intensity="strong" className="p-8">
              <h3 className="text-2xl font-bold mb-2">Strong</h3>
              <p className="text-white/70">15% opacity, large blur</p>
              <div className="mt-4 text-sm text-white/50">
                bg-white/15 backdrop-blur-lg
              </div>
            </GlassmorphicCard>
          </div>
        </div>
      </section>

      {/* Section 3: CSS Utilities Demo */}
      <section className="relative py-20 bg-hero-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient-animated">
            CSS Utility Classes
          </h2>

          <div className="max-w-5xl mx-auto space-y-8">
            {/* Glass Premium */}
            <div className="glass-premium p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-2">Glass Premium</h3>
              <p className="text-white/70">Using .glass-premium utility class</p>
              <code className="text-xs text-primary mt-2 block">
                className="glass-premium p-8 rounded-2xl"
              </code>
            </div>

            {/* Glass Dark */}
            <div className="glass-dark p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-2">Glass Dark</h3>
              <p className="text-white/70">Using .glass-dark utility class</p>
              <code className="text-xs text-primary mt-2 block">
                className="glass-dark p-8 rounded-2xl"
              </code>
            </div>

            {/* Glow Effects */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-center">Step Glow Effects</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="glass-premium glow-step-1 p-6 rounded-xl text-center">
                  <div className="text-3xl mb-2">1</div>
                  <div className="text-sm text-white/60">Blue</div>
                </div>
                <div className="glass-premium glow-step-2 p-6 rounded-xl text-center">
                  <div className="text-3xl mb-2">2</div>
                  <div className="text-sm text-white/60">Purple</div>
                </div>
                <div className="glass-premium glow-step-3 p-6 rounded-xl text-center">
                  <div className="text-3xl mb-2">3</div>
                  <div className="text-sm text-white/60">Pink</div>
                </div>
                <div className="glass-premium glow-step-4 p-6 rounded-xl text-center">
                  <div className="text-3xl mb-2">4</div>
                  <div className="text-sm text-white/60">Orange</div>
                </div>
                <div className="glass-premium glow-step-5 p-6 rounded-xl text-center">
                  <div className="text-3xl mb-2">5</div>
                  <div className="text-sm text-white/60">Teal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Progress Bar Demo */}
      <section className="relative py-20 bg-gradient-to-b from-hero-bg to-black/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient-animated">
            Progress Bar with Glow
          </h2>

          <GlassmorphicCard intensity="strong" className="max-w-2xl mx-auto p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Project Progress</h3>
              <span className="text-3xl font-bold text-glow-sm">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="glass-premium rounded-full h-4 overflow-hidden mb-6">
              <div
                className="progress-glow h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <button
                onClick={() => setProgress(Math.max(0, progress - 10))}
                className="glass-premium px-6 py-2 rounded-lg hover:glow-primary transition-all"
              >
                -10%
              </button>
              <button
                onClick={() => setProgress(Math.min(100, progress + 10))}
                className="glass-premium px-6 py-2 rounded-lg hover:glow-primary transition-all"
              >
                +10%
              </button>
              <button
                onClick={() => setProgress(50)}
                className="glass-premium px-6 py-2 rounded-lg hover:glow-primary transition-all flex-1"
              >
                Reset to 50%
              </button>
            </div>
          </GlassmorphicCard>
        </div>
      </section>

      {/* Section 5: Nested Cards Demo */}
      <section className="relative py-20 bg-hero-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gradient-animated">
            Nested Cards
          </h2>

          <GlassmorphicCard intensity="strong" className="max-w-4xl mx-auto p-8">
            <h3 className="text-3xl font-bold mb-6">Feature Showcase</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassmorphicCard
                intensity="subtle"
                glowColor="#667eea"
                animated
                className="p-6"
              >
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold mb-2">Lightning Fast</h4>
                <p className="text-white/70 text-sm">
                  Optimized for performance with CSS animations
                </p>
              </GlassmorphicCard>

              <GlassmorphicCard
                intensity="subtle"
                glowColor="#764ba2"
                animated
                className="p-6"
              >
                <div className="text-4xl mb-4">🎨</div>
                <h4 className="text-xl font-bold mb-2">Beautiful Design</h4>
                <p className="text-white/70 text-sm">
                  Premium glassmorphic effects with subtle animations
                </p>
              </GlassmorphicCard>

              <GlassmorphicCard
                intensity="subtle"
                glowColor="#f5576c"
                animated
                className="p-6"
              >
                <div className="text-4xl mb-4">📱</div>
                <h4 className="text-xl font-bold mb-2">Responsive</h4>
                <p className="text-white/70 text-sm">
                  Works seamlessly on all screen sizes
                </p>
              </GlassmorphicCard>

              <GlassmorphicCard
                intensity="subtle"
                glowColor="#4bc0c0"
                animated
                className="p-6"
              >
                <div className="text-4xl mb-4">🔧</div>
                <h4 className="text-xl font-bold mb-2">Customizable</h4>
                <p className="text-white/70 text-sm">
                  Flexible props and utility classes for any use case
                </p>
              </GlassmorphicCard>
            </div>
          </GlassmorphicCard>
        </div>
      </section>

      {/* Section 6: Text Effects Demo */}
      <section className="relative py-20 bg-gradient-to-b from-hero-bg to-black/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-6xl font-bold mb-8 text-gradient-animated">
            Animated Gradient Text
          </h2>
          <p className="text-2xl mb-8 text-glow">
            Text with Glow Effect
          </p>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            These text effects are achieved using CSS utility classes like
            <code className="text-primary mx-2">.text-gradient-animated</code>
            and
            <code className="text-primary mx-2">.text-glow</code>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-white/40">
        <p>Glassmorphic Components Demo - NEXO Vision</p>
        <p className="text-sm mt-2">All components ready for production use</p>
      </footer>
    </div>
  );
};

export default GlassmorphicDemo;
