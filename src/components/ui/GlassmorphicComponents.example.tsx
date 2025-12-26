/**
 * USAGE EXAMPLES FOR GLASSMORPHIC COMPONENTS
 *
 * This file demonstrates how to use the new glassmorphic utilities and components
 * in the ProcessSection and other parts of the application.
 */

import React, { useState } from 'react';
import GlassmorphicCard from './GlassmorphicCard';
import AnimatedGradientBackground from './AnimatedGradientBackground';

// Example 1: ProcessSection with AnimatedGradientBackground
export function ProcessSectionExample() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="relative min-h-screen bg-hero-bg text-hero-fg py-20">
      {/* Animated gradient background that changes with each step */}
      <AnimatedGradientBackground activeStep={activeStep} />

      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 text-gradient-animated">
          Our Process
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <GlassmorphicCard
              key={step}
              glowColor={getStepColor(step)}
              intensity="medium"
              animated={activeStep === step}
              className="p-8 cursor-pointer"
              onClick={() => setActiveStep(step)}
            >
              <div className="text-6xl mb-4">{getStepIcon(step)}</div>
              <h3 className="text-2xl font-bold mb-2">Step {step}</h3>
              <p className="text-white/70">
                {getStepDescription(step)}
              </p>
            </GlassmorphicCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// Example 2: Using CSS utility classes directly
export function UtilityClassesExample() {
  return (
    <div className="bg-hero-bg min-h-screen p-8">
      {/* Premium glass card with glow */}
      <div className="glass-premium p-8 rounded-2xl max-w-md glow-primary">
        <h3 className="text-2xl font-bold mb-4 text-gradient-animated">
          Premium Feature
        </h3>
        <p className="text-white/80">
          This card uses the glass-premium utility class with glow-primary.
        </p>
      </div>

      {/* Dark glass card */}
      <div className="glass-dark p-8 rounded-2xl max-w-md mt-8">
        <h3 className="text-2xl font-bold mb-4 text-glow">
          Dark Glass Effect
        </h3>
        <p className="text-white/80">
          This card uses the glass-dark utility class.
        </p>
      </div>

      {/* Step-specific glow effects */}
      <div className="grid grid-cols-5 gap-4 mt-8">
        <div className="glass-premium p-4 rounded-lg glow-step-1">Step 1</div>
        <div className="glass-premium p-4 rounded-lg glow-step-2">Step 2</div>
        <div className="glass-premium p-4 rounded-lg glow-step-3">Step 3</div>
        <div className="glass-premium p-4 rounded-lg glow-step-4">Step 4</div>
        <div className="glass-premium p-4 rounded-lg glow-step-5">Step 5</div>
      </div>
    </div>
  );
}

// Example 3: Progress bar with glow effect
export function ProgressBarExample() {
  const [progress, setProgress] = useState(60);

  return (
    <div className="bg-hero-bg p-8">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-gradient-animated">
          Project Progress
        </h3>

        {/* Progress bar container */}
        <div className="glass-premium rounded-full h-4 overflow-hidden">
          {/* Progress fill with glow */}
          <div
            className="progress-glow h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between mt-4 text-white/60">
          <span>0%</span>
          <span className="text-glow-sm">{progress}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

// Example 4: Nested glassmorphic cards
export function NestedCardsExample() {
  return (
    <div className="bg-hero-bg min-h-screen p-8">
      <GlassmorphicCard
        intensity="strong"
        className="max-w-4xl mx-auto p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-gradient-animated">
          Feature Showcase
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassmorphicCard
            intensity="subtle"
            glowColor="#667eea"
            animated
            className="p-6"
          >
            <h3 className="text-xl font-bold mb-2">Design</h3>
            <p className="text-white/70">
              Beautiful glassmorphic designs with subtle animations.
            </p>
          </GlassmorphicCard>

          <GlassmorphicCard
            intensity="subtle"
            glowColor="#764ba2"
            animated
            className="p-6"
          >
            <h3 className="text-xl font-bold mb-2">Development</h3>
            <p className="text-white/70">
              Clean, performant code with modern techniques.
            </p>
          </GlassmorphicCard>
        </div>
      </GlassmorphicCard>
    </div>
  );
}

// Helper functions
function getStepColor(step: number): string {
  const colors = {
    1: '#667eea',
    2: '#764ba2',
    3: '#f5576c',
    4: '#ff9f40',
    5: '#4bc0c0',
  };
  return colors[step as keyof typeof colors];
}

function getStepIcon(step: number): string {
  const icons = {
    1: '🎯',
    2: '✨',
    3: '🚀',
    4: '💡',
    5: '🎉',
  };
  return icons[step as keyof typeof icons];
}

function getStepDescription(step: number): string {
  const descriptions = {
    1: 'Define your vision and goals',
    2: 'Create stunning designs',
    3: 'Build and develop',
    4: 'Test and refine',
    5: 'Launch and celebrate',
  };
  return descriptions[step as keyof typeof descriptions];
}
