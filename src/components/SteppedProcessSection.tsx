import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface StepData {
  number: string;
  title: string;
  description: string;
}

interface SteppedProcessSectionProps {
  title: string;
  description: string;
  steps: StepData[];
  accentColor: string;
}

interface StepsProps {
  numSteps: number;
  stepsComplete: number;
  accentColor: string;
}

interface StepProps {
  num: number;
  isActive: boolean;
  accentColor: string;
}

interface StepContentProps {
  step: StepData;
  accentColor: string;
}

const SteppedProcessSection: React.FC<SteppedProcessSectionProps> = ({
  title,
  description,
  steps,
  accentColor,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const numSteps = steps.length;

  const handleSetStep = (direction: number) => {
    if (
      (currentStep === 0 && direction === -1) ||
      (currentStep === numSteps - 1 && direction === 1)
    ) {
      return;
    }
    setCurrentStep((prev) => prev + direction);
  };

  // Convert hex to RGB for opacity variations
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 99, g: 102, b: 241 }; // fallback to indigo
  };

  const rgb = hexToRgb(accentColor);
  const accentRgb = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

  return (
    <section
      dir="rtl"
      className="py-16 md:py-24 bg-neutral-100"
      style={
        {
          "--accent-color": accentColor,
          "--accent-rgb": accentRgb,
        } as React.CSSProperties
      }
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white shadow-xl rounded-2xl w-full max-w-4xl mx-auto overflow-hidden"
        >
          {/* Progress Steps Indicator */}
          <div className="p-6 md:p-8 border-b border-neutral-100">
            <Steps
              numSteps={numSteps}
              stepsComplete={currentStep + 1}
              accentColor={accentColor}
            />
          </div>

          {/* Step Content */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <StepContent
                key={currentStep}
                step={steps[currentStep]}
                accentColor={accentColor}
              />
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="p-6 md:p-8 bg-neutral-50 border-t border-neutral-100">
            <div className="flex items-center justify-between gap-4">
              <button
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 ${
                  currentStep === 0
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-neutral-700 hover:bg-neutral-200"
                }`}
                onClick={() => handleSetStep(-1)}
                disabled={currentStep === 0}
                aria-label="שלב קודם"
              >
                הקודם
              </button>

              {/* Step Counter */}
              <span className="text-sm text-neutral-700 font-medium">
                {currentStep + 1} / {numSteps}
              </span>

              <button
                className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--accent-color)] ${
                  currentStep === numSteps - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90 hover:shadow-lg"
                }`}
                style={{ backgroundColor: accentColor }}
                onClick={() => handleSetStep(1)}
                disabled={currentStep === numSteps - 1}
                aria-label="שלב הבא"
              >
                הבא
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Steps: React.FC<StepsProps> = ({ numSteps, stepsComplete, accentColor }) => {
  const stepArray = Array.from(Array(numSteps).keys());

  return (
    <div className="flex items-center justify-between gap-2 md:gap-3" dir="rtl">
      {stepArray.map((num) => {
        const stepNum = num + 1;
        const isActive = stepNum <= stepsComplete;
        const isCurrentStep = stepNum === stepsComplete;
        return (
          <React.Fragment key={stepNum}>
            <Step num={stepNum} isActive={isActive} accentColor={accentColor} />
            {stepNum !== stepArray.length && (
              <div className="flex-1 h-1 rounded-full bg-neutral-200 relative min-w-[20px] overflow-hidden">
                <motion.div
                  className="absolute inset-0 rounded-full origin-right"
                  style={{ backgroundColor: accentColor }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{ ease: "easeInOut", duration: 0.4 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Step: React.FC<StepProps> = ({ num, isActive, accentColor }) => {
  // Convert hex to RGB for the pulse effect
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 99, g: 102, b: 241 };
  };

  const rgb = hexToRgb(accentColor);

  return (
    <div className="relative">
      <div
        className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shrink-0 border-2 rounded-full font-semibold text-sm relative z-10 transition-colors duration-300`}
        style={{
          borderColor: isActive ? accentColor : "var(--nexo-smoke)",
          backgroundColor: isActive ? accentColor : "transparent",
          color: isActive ? "white" : "var(--nexo-smoke)",
        }}
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.svg
              key="icon-marker-check"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="1.6em"
              width="1.6em"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.125 }}
            >
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"></path>
            </motion.svg>
          ) : (
            <motion.span
              key="icon-marker-num"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.125 }}
            >
              {num}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {isActive && (
        <motion.div
          className="absolute z-0 -inset-1.5 rounded-full"
          style={{
            backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
};

const StepContent: React.FC<StepContentProps> = ({ step, accentColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="min-h-[200px] flex flex-col justify-center"
    >
      {/* Step Number Badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit"
        style={{
          backgroundColor: `${accentColor}15`,
          color: accentColor,
        }}
      >
        <span>שלב {step.number}</span>
      </div>

      {/* Step Title */}
      <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
        {step.title}
      </h3>

      {/* Step Description */}
      <p className="text-neutral-700 text-lg leading-relaxed">
        {step.description}
      </p>

      {/* Decorative Element */}
      <div
        className="mt-6 w-16 h-1 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
    </motion.div>
  );
};

export default SteppedProcessSection;
