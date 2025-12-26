import { motion, AnimatePresence } from "framer-motion";
import { IconCloud } from "./ui/icon-cloud";
import ASCIIText from "./ui/ascii-text";
import FallingText from "./ui/FallingText";
import { LaunchNotifications } from "./ui/LaunchNotifications";
import TrueFocus from "./ui/TrueFocus";
import { MessageCircle, Target, Palette, Code2, Rocket, LucideIcon } from "lucide-react";

// Questions for Step 1 (בירור צרכים - Requirements Analysis)
// Use | delimiter to keep questions as complete units - short, punchy questions
const requirementsQuestions = "מה המטרה? | מי הקהל? | מה התקציב? | אילו בעיות? | מה החשוב? | למי בונים? | איך נמדוד הצלחה? | מה מייחד אתכם? | מתי צריך?";

interface ProcessStepVisualProps {
  activeStep: number;
  stepNumber: string;
}

// Dev tools and languages for step 4 (Building)
const devToolImages = [
  "https://cdn.simpleicons.org/react/61DAFB",
  "https://cdn.simpleicons.org/typescript/3178C6",
  "https://cdn.simpleicons.org/javascript/F7DF1E",
  "https://cdn.simpleicons.org/nodedotjs/339933",
  "https://cdn.simpleicons.org/nextdotjs/000000",
  "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  "https://cdn.simpleicons.org/python/3776AB",
  "https://cdn.simpleicons.org/postgresql/4169E1",
  "https://cdn.simpleicons.org/mongodb/47A248",
  "https://cdn.simpleicons.org/docker/2496ED",
  "https://cdn.simpleicons.org/git/F05032",
  "https://cdn.simpleicons.org/github/181717",
  "https://cdn.simpleicons.org/figma/F24E1E",
  "https://cdn.simpleicons.org/vercel/000000",
  "https://cdn.simpleicons.org/amazonaws/FF9900",
  "https://cdn.simpleicons.org/graphql/E10098",
  "https://cdn.simpleicons.org/prisma/2D3748",
  "https://cdn.simpleicons.org/redux/764ABC",
  "https://cdn.simpleicons.org/sass/CC6699",
  "https://cdn.simpleicons.org/webpack/8DD6F9",
];

// Step colors - matching processSteps gradients
const stepColors = [
  { from: "#3B82F6", to: "#6366F1" },  // Blue to indigo (בירור צרכים)
  { from: "#8B5CF6", to: "#A78BFA" },  // Violet to lighter violet (אסטרטגיה)
  { from: "#D946EF", to: "#E879F9" },  // Fuchsia to pink (עיצוב)
  { from: "#F43F5E", to: "#FB7185" },  // Rose to orange (פיתוח)
  { from: "#10B981", to: "#34D399" },  // Green to emerald (השקה)
];

// Icons for each step
const stepIcons: LucideIcon[] = [MessageCircle, Target, Palette, Code2, Rocket];

// Unified animation timing - 350ms to match parent
const ANIMATION_DURATION = 0.35;

const ProcessStepVisual = ({ activeStep, stepNumber }: ProcessStepVisualProps) => {
  const colors = stepColors[activeStep];
  const Icon = stepIcons[activeStep];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main content - different visuals for specific steps */}
      <AnimatePresence mode="wait">
        {activeStep === 0 ? (
          // Step 1: FallingText with requirements questions
          <motion.div
            key="falling-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: ANIMATION_DURATION, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 w-72 h-72 md:w-[380px] md:h-[380px] -translate-x-20 md:-translate-x-32"
          >
            <FallingText
              text={requirementsQuestions}
              highlightWords={["מטרה", "קהל", "תקציב", "הצלחה", "מייחד"]}
              trigger="scroll"
              gravity={0.6}
              fontSize="1.25rem"
              fontWeight="600"
              fontFamily="Heebo, sans-serif"
            />
          </motion.div>
        ) : activeStep === 1 ? (
          // Step 2: TrueFocus with strategy keywords
          <motion.div
            key="true-focus"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: ANIMATION_DURATION, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 w-80 h-64 md:w-[420px] md:h-[300px] flex items-center justify-center"
          >
            <TrueFocus
              sentence="דאטה | תובנות | אסטרטגיה"
              separator="|"
              manualMode={false}
              blurAmount={5}
              borderColor="#8B5CF6"
              glowColor="rgba(139, 92, 246, 0.6)"
              animationDuration={0.5}
              pauseBetweenAnimations={1.5}
            />
          </motion.div>
        ) : activeStep === 2 ? (
          // Step 3: ASCII Text with "Design"
          <motion.div
            key="ascii-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: ANIMATION_DURATION, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 w-80 h-80 md:w-[420px] md:h-[420px]"
          >
            <ASCIIText
              text="Design"
              asciiFontSize={5}
              textFontSize={80}
              textColor="#8B5CF6"
              planeBaseHeight={4}
              enableWaves={true}
            />
          </motion.div>
        ) : activeStep === 3 ? (
          // Step 4: Icon Cloud with dev tools
          <motion.div
            key="icon-cloud"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: ANIMATION_DURATION, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10"
          >
            <IconCloud images={devToolImages} />
          </motion.div>
        ) : activeStep === 4 ? (
          // Step 5: Launch - Animated notification feed
          <motion.div
            key="launch-notifications"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: ANIMATION_DURATION, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 w-80 md:w-[340px]"
          >
            <LaunchNotifications />
          </motion.div>
        ) : (
          // Other steps: Animated icon
          <motion.div
            key={`icon-${activeStep}`}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
            transition={{ duration: ANIMATION_DURATION, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10"
          >
            {/* Icon container with gradient */}
            <motion.div
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
              }}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon className="w-16 h-16 md:w-20 md:h-20 text-white" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step number badge - simple, no complex animations */}
      <motion.div
        className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white border-2 border-primary/20 flex items-center justify-center shadow-md z-20"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={stepNumber}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="text-xl md:text-2xl font-black text-primary"
          >
            {stepNumber}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProcessStepVisual;
