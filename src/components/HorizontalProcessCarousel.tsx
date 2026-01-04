"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

interface HorizontalProcessCarouselProps {
  title: string;
  description: string;
  steps: ProcessStep[];
  accentColor: string;
}

interface StepCardProps {
  step: ProcessStep;
  accentColor: string;
}

const StepCard = ({ step, accentColor }: StepCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative h-[280px] w-[280px] sm:h-[320px] sm:w-[340px] md:h-[350px] md:w-[400px] flex-shrink-0 overflow-hidden rounded-2xl"
    >
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-neutral-100/80" />

      {/* Subtle border */}
      <div className="absolute inset-0 rounded-2xl border border-neutral-200/50" />

      {/* Shadow */}
      <div className="absolute inset-0 rounded-2xl shadow-lg shadow-neutral-900/5" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-5 sm:p-6 md:p-8">
        {/* Step number badge */}
        <div
          className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl text-xl sm:text-2xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: accentColor }}
        >
          {step.number}
        </div>

        {/* Title */}
        <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-neutral-900">
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-base sm:text-lg leading-relaxed text-neutral-600">
          {step.description}
        </p>

        {/* Decorative element */}
        <div
          className="absolute bottom-6 left-8 h-1 w-12 rounded-full opacity-30 transition-all duration-300 group-hover:w-20 group-hover:opacity-50"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </motion.div>
  );
};

const HorizontalProcessCarousel = ({
  title,
  description,
  steps,
  accentColor,
}: HorizontalProcessCarouselProps) => {
  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate scroll height based on number of steps
  // More steps = more scroll height needed
  const scrollMultiplier = Math.max(2, Math.min(4, steps.length * 0.5 + 1));

  // For RTL: Cards start visible on the right and scroll left as user scrolls down
  // Start at 1% (slightly right), end at -95% (scrolled far left)
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

  return (
    <section
      ref={targetRef}
      dir="rtl"
      className="relative bg-neutral-100"
      style={{ height: `${scrollMultiplier * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col items-center px-8 pt-20 pb-12 text-center">
          {/* Accent line */}
          <div
            className="mb-6 h-1 w-16 rounded-full"
            style={{ backgroundColor: accentColor }}
          />

          {/* Title */}
          <h2 className="mb-4 text-4xl font-bold text-neutral-900 md:text-5xl">
            {title}
          </h2>

          {/* Description */}
          <p className="max-w-2xl text-lg text-neutral-600 md:text-xl">
            {description}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="flex flex-1 items-center overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex gap-6 px-8"
          >
            {steps.map((step, index) => (
              <StepCard
                key={`${step.number}-${index}`}
                step={step}
                accentColor={accentColor}
              />
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <span className="text-sm text-neutral-500">גלול להמשך</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-6 w-4 rounded-full border-2 border-neutral-400 p-1"
          >
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalProcessCarousel;
