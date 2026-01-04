import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo, memo } from "react";
import { processSteps as defaultProcessSteps, processLabels as defaultProcessLabels, type ProcessStep } from "@/data/processSteps";
import ProcessStepVisual from "./ProcessStepVisual";

// Animation variants for content transitions - defined outside component to prevent recreation
const contentVariants = {
  initial: { opacity: 0, y: 30, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -30, filter: "blur(8px)" },
};

// Type alias for process steps
type AnyProcessStep = ProcessStep;

// Memoized Step Indicator component
interface StepIndicatorProps {
  step: AnyProcessStep;
  index: number;
  activeStep: number;
  isLast: boolean;
}

const StepIndicator = memo(({ step, index, activeStep, isLast }: StepIndicatorProps) => {
  const isActive = activeStep === index;
  const isPast = activeStep > index;
  const isActiveOrPast = activeStep >= index;

  return (
    <motion.div
      className="relative"
      animate={{ scale: isActive ? 1 : 0.92 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
          isActive
            ? "bg-primary border-primary"
            : isPast
            ? "bg-primary/20 border-primary/40"
            : "bg-[#1a1a1a]/5 border-[#1a1a1a]/10"
        }`}
      >
        <step.icon
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transition-colors duration-200 ${
            isActiveOrPast ? "text-white" : "text-[#1a1a1a]/40"
          }`}
        />
      </div>
      {!isLast && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 right-full w-1.5 sm:w-2 h-0.5 transition-colors duration-200 ${
            isPast ? "bg-primary" : "bg-[#1a1a1a]/10"
          }`}
        />
      )}
    </motion.div>
  );
});

StepIndicator.displayName = 'StepIndicator';

// Component props
interface ProcessSectionProps {
  serviceId?: string; // Kept for backwards compatibility, currently unused
}

const ProcessSection = memo((_props: ProcessSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const lastStepChangeTime = useRef(0);

  // Use default process steps (service-specific steps removed due to data corruption)
  const { processSteps, processLabels } = useMemo(() => {
    return {
      processSteps: defaultProcessSteps,
      processLabels: defaultProcessLabels
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false, // Prevent layout thrashing
  });

  // Debounced scroll detection - single source of truth
  // Scale progress so all steps complete within usable scroll range
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const now = Date.now();
    // Debounce: minimum 100ms between step changes
    if (now - lastStepChangeTime.current < 100) return;

    // Ensure all steps complete before section ends
    // Clamp to ensure we don't exceed step count
    const stepIndex = Math.min(
      Math.floor(latest * processSteps.length),
      processSteps.length - 1
    );

    if (stepIndex !== activeStep) {
      lastStepChangeTime.current = now;
      setActiveStep(stepIndex);
    }
  });

  const currentStep = processSteps[activeStep];

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{
        // Total height: enough scroll for all steps + viewport for last step visibility
        // Each step needs ~50vh of scroll, plus 100vh for the sticky content
        height: `${processSteps.length * 50 + 50}vh`,
        backgroundColor: '#FAF9F6'
      }}
      dir="rtl"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 min-h-screen min-h-[100dvh] overflow-hidden flex items-center justify-center lg:items-center">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Mobile: Full height flex container for vertical distribution */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full lg:h-auto flex flex-col lg:block pt-28 pb-4 lg:pt-0 lg:pb-0">
          {/* Mobile: Use flex-col with proper distribution */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-20 lg:items-center max-w-6xl mx-auto flex-1 lg:flex-none">

            {/* Left Side - Step Content (Text first on mobile) */}
            <div className="order-1 lg:order-1 flex-shrink-0">
              {/* Step indicators - uses memoized StepIndicator component */}
              <div className="flex gap-1.5 sm:gap-2 lg:gap-2 mb-4 sm:mb-6 lg:mb-8">
                {processSteps.map((step, index) => (
                  <StepIndicator
                    key={step.number}
                    step={step}
                    index={index}
                    activeStep={activeStep}
                    isLast={index === processSteps.length - 1}
                  />
                ))}
              </div>

              {/* Main Content - AnimatePresence handles transitions */}
              <div className="relative min-h-[140px] sm:min-h-[180px] lg:min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                      duration: 0.35,
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                  >
                    <span className="inline-block text-[#1a1a1a] text-xs md:text-sm font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-3 lg:mb-4">
                      {processLabels.stepPrefix} {currentStep.number} {processLabels.stepSuffix}
                    </span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-black mb-2 lg:mb-3">
                      <span style={{ color: currentStep.color.primary }}>
                        {currentStep.title}
                      </span>
                    </h2>

                    <h3 className="text-[#2d2d2d] text-base sm:text-lg md:text-xl font-semibold mb-3 lg:mb-5">
                      {currentStep.subtitle}
                    </h3>

                    {/* Summary */}
                    <p className="text-[#1a1a1a] text-sm md:text-lg font-semibold mb-3 lg:mb-4">
                      {currentStep.description.summary}
                    </p>
                    {/* Bullet Points */}
                    <ul className="space-y-1.5 lg:space-y-2 text-[#3d3d3d] text-sm md:text-lg leading-relaxed lg:leading-[1.7] max-w-lg">
                      {currentStep.description.items.map((item, i) => (
                        <li key={i} className="flex gap-2 sm:gap-3">
                          <span className="text-primary font-bold mt-0.5 sm:mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Enhanced Progress bar - Desktop only (inside content) */}
              <div className="mt-8 hidden lg:block">
                {/* Track */}
                <div className="h-2 bg-[#1a1a1a]/10 rounded-full overflow-visible relative">
                  {/* Solid color fill with subtle glow */}
                  <motion.div
                    className="h-full rounded-full absolute inset-y-0 right-0"
                    style={{
                      backgroundColor: currentStep.color.primary,
                    }}
                    animate={{
                      width: `${((activeStep + 1) / processSteps.length) * 100}%`,
                    }}
                    transition={{
                      width: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    }}
                  />
                </div>

                {/* Labels */}
                <div className="flex justify-between mt-3 text-xs text-[#404040] font-medium">
                  <span>{processLabels.startLabel}</span>
                  <span>{processLabels.endLabel}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Visual (Below text on mobile) */}
            <div className="order-2 lg:order-2 flex justify-center items-center flex-1 lg:flex-none">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-96 lg:h-96">
                <ProcessStepVisual
                  activeStep={activeStep}
                  stepNumber={currentStep.number}
                />
              </div>
            </div>
          </div>

          {/* Mobile Progress Bar - At bottom */}
          <div className="pt-2 lg:hidden flex-shrink-0">
            {/* Track */}
            <div className="h-1.5 sm:h-2 bg-[#1a1a1a]/10 rounded-full overflow-visible relative">
              {/* Solid color fill */}
              <motion.div
                className="h-full rounded-full absolute inset-y-0 right-0"
                style={{
                  backgroundColor: currentStep.color.primary,
                }}
                animate={{
                  width: `${((activeStep + 1) / processSteps.length) * 100}%`,
                }}
                transition={{
                  width: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                }}
              />
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-[#404040] font-medium">
              <span>{processLabels.startLabel}</span>
              <span>{processLabels.endLabel}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
});

ProcessSection.displayName = 'ProcessSection';

export default ProcessSection;
