import { MessageCircle, Target, Palette, Code2, Rocket, LucideIcon } from "lucide-react";

export interface ProcessStepDescription {
  summary: string;
  items: string[];
}

export interface ProcessStep {
  number: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: ProcessStepDescription;
  color: {
    gradient: string; // Tailwind gradient classes
    primary: string;  // Hex color for 3D
    secondary: string; // Hex color for 3D
    glow: string; // Glow color
  };
}

export const processSteps: ProcessStep[] = [
  {
    number: "1",
    icon: MessageCircle,
    title: "בירור צרכים",
    subtitle: "להבין את העסק שלכם לעומק",
    description: {
      summary: "חופרים עמוק כדי להבין את החזון והמטרות שלכם באמת.",
      items: [
        "מבינים את החזון, הלקוחות והאתגרים העסקיים",
        "מנתחים את השוק והמתחרים בתחום",
        "בונים על האמת שלכם, לא על תבניות",
        "יוצאים עם הבנה מלאה של הצרכים"
      ]
    },
    color: {
      gradient: "from-blue-500 via-indigo-500 to-violet-500",
      primary: "#3B82F6",
      secondary: "#6366F1",
      glow: "rgba(59, 130, 246, 0.5)",
    },
  },
  {
    number: "2",
    icon: Target,
    title: "אסטרטגיה ותכנון",
    subtitle: "מפת דרכים שמובילה להצלחה",
    description: {
      summary: "כל החלטה מבוססת על דאטה ותובנות, לא על תחושות.",
      items: [
        "בונים ארכיטקטורה טכנית מוצקה וסקיילבילית",
        "מגדירים פיצ'רים בסדר עדיפויות נכון",
        "מתווים תוכנית עבודה ריאלית עם לוחות זמנים",
        "מפה ברורה - מה בונים, למה ומתי"
      ]
    },
    color: {
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      primary: "#8B5CF6",
      secondary: "#A78BFA",
      glow: "rgba(139, 92, 246, 0.5)",
    },
  },
  {
    number: "3",
    icon: Palette,
    title: "עיצוב UX/UI",
    subtitle: "יופי שמניע לפעולה",
    description: {
      summary: "מעצבים חוויות שגורמות לאנשים לעצור ולפעול.",
      items: [
        "כל אלמנט נבנה במיוחד להמרה",
        "צבעים שמשדרים אמון, כפתורים שמזמינים ללחוץ",
        "מסעות משתמש אינטואיטיביים וזורמים",
        "משפיעים בזמן אמת עד שאתם מרוצים לגמרי"
      ]
    },
    color: {
      gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
      primary: "#D946EF",
      secondary: "#E879F9",
      glow: "rgba(217, 70, 239, 0.5)",
    },
  },
  {
    number: "4",
    icon: Code2,
    title: "פיתוח ואינטגרציה",
    subtitle: "טכנולוגיה שעובדת בשבילכם",
    description: {
      summary: "קוד נקי, מהיר ומאובטח שגדל איתכם לאורך זמן.",
      items: [
        "משלבים AI חכם ואוטומציות שחוסכות שעות",
        "חיבורים חלקים למערכות חיצוניות",
        "כל שבועיים גרסה עובדת עם אפשרות לפידבק",
        "שקיפות מלאה ואפס הפתעות"
      ]
    },
    color: {
      gradient: "from-rose-500 via-orange-500 to-amber-500",
      primary: "#F43F5E",
      secondary: "#FB7185",
      glow: "rgba(244, 63, 94, 0.5)",
    },
  },
  {
    number: "5",
    icon: Rocket,
    title: "השקה וצמיחה",
    subtitle: "ההצלחה שלכם מתחילה עכשיו",
    description: {
      summary: "ההשקה היא רק ההתחלה - אנחנו שותפים להצלחה לאורך זמן.",
      items: [
        "עוקבים אחרי מטריקות ומנתחים התנהגות משתמשים",
        "אופטימיזציות שוטפות לשיפור ביצועים",
        "טיפול בבעיות תוך שעות ספורות",
        "שותפות אמיתית להצלחה שלכם"
      ]
    },
    color: {
      gradient: "from-amber-500 via-green-500 to-emerald-500",
      primary: "#10B981",
      secondary: "#34D399",
      glow: "rgba(16, 185, 129, 0.5)",
    },
  },
];

// Labels for the ProcessSection component
export const processLabels = {
  stepPrefix: "רמה",
  stepSuffix: "מתוך 5",
  startLabel: "התחלה",
  endLabel: "השקה",
  scrollPrompt: "גלול להמשך",
};

// Helper function to get step by number
export const getStepByNumber = (stepNumber: string): ProcessStep | undefined => {
  return processSteps.find(step => step.number === stepNumber);
};

// Helper function to get next step
export const getNextStep = (currentStepNumber: string): ProcessStep | null => {
  const currentIndex = processSteps.findIndex(step => step.number === currentStepNumber);
  if (currentIndex === -1 || currentIndex === processSteps.length - 1) {
    return null;
  }
  return processSteps[currentIndex + 1];
};

// Helper function to get previous step
export const getPreviousStep = (currentStepNumber: string): ProcessStep | null => {
  const currentIndex = processSteps.findIndex(step => step.number === currentStepNumber);
  if (currentIndex <= 0) {
    return null;
  }
  return processSteps[currentIndex - 1];
};
