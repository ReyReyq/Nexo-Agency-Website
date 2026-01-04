import {
  Search,
  Target,
  Megaphone,
  BarChart3,
  Rocket,
  Users,
  FileSearch,
  Link2,
  TrendingUp,
  Calendar,
  MessageCircle,
  Heart,
  Lightbulb,
  Palette,
  BookOpen,
  Layers,
  Compass,
  PieChart,
  Map,
  CheckCircle,
  type LucideIcon
} from "lucide-react";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ServiceProcessStepDescription {
  summary: string;
  items: string[];
}

export interface ServiceProcessStep {
  number: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: ServiceProcessStepDescription;
  color: {
    gradient: string;
    primary: string;
    secondary: string;
    glow: string;
  };
}

export interface ServiceProcessConfig {
  serviceId: string;
  steps: ServiceProcessStep[];
  labels: {
    stepPrefix: string;
    stepSuffix: string;
    startLabel: string;
    endLabel: string;
    scrollPrompt: string;
  };
}

// ============================================
// DIGITAL MARKETING PROCESS STEPS
// ============================================

export const digitalMarketingProcess: ServiceProcessConfig = {
  serviceId: "digital-marketing",
  steps: [
    {
      number: "1",
      icon: Target,
      title: "הגדרת מטרות",
      subtitle: "מבינים את היעדים העסקיים שלכם",
      description: {
        summary: "מגדירים יעדים מדידים ברורים, אסטרטגיה שיווקית ממוקדת ותוכנית פעולה.",
        items: [
          "הגדרת KPIs עסקיים: הכנסות, לידים, המרות",
          "ניתוח קהל היעד והתנהגות צרכנים",
          "בחירת ערוצים דיגיטליים מתאימים",
          "הגדרת תקציב ולוחות זמנים"
        ]
      },
      color: {
        gradient: "from-orange-500 via-amber-500 to-yellow-500",
        primary: "#f97316",
        secondary: "#fb923c",
        glow: "rgba(249, 115, 22, 0.5)",
      },
    },
    {
      number: "2",
      icon: Users,
      title: "מחקר קהלים",
      subtitle: "מזהים את הלקוחות האידיאליים שלכם",
      description: {
        summary: "מנתחים לעומק את קהל היעד – דמוגרפיה, התנהגות, צרכים ונקודות כאב.",
        items: [
          "בניית פרסונות לקוחות מפורטות",
          "מיפוי מסע לקוח ונקודות מגע",
          "ניתוח מתחרים ובידול מהם",
          "זיהוי הזדמנויות שוק חדשות"
        ]
      },
      color: {
        gradient: "from-amber-500 via-yellow-500 to-lime-500",
        primary: "#eab308",
        secondary: "#facc15",
        glow: "rgba(234, 179, 8, 0.5)",
      },
    },
    {
      number: "3",
      icon: Megaphone,
      title: "השקת קמפיינים",
      subtitle: "מפעילים קמפיינים ממוקדים בכל הפלטפורמות",
      description: {
        summary: "משיקים קמפיינים בכל הערוצים הרלוונטיים, עם מסרים ממוקדים וקריאייטיב מנצח.",
        items: [
          "פרסום בגוגל ורשתות חברתיות",
          "יצירת תוכן שיווקי ממיר",
          "בניית דפי נחיתה אופטימליים",
          "הפעלת A/B Testing לשיפור מתמיד"
        ]
      },
      color: {
        gradient: "from-lime-500 via-green-500 to-emerald-500",
        primary: "#22c55e",
        secondary: "#4ade80",
        glow: "rgba(34, 197, 94, 0.5)",
      },
    },
    {
      number: "4",
      icon: BarChart3,
      title: "ניטור וניתוח",
      subtitle: "עוקבים אחרי כל מטריקה חשובה",
      description: {
        summary: "מנטרים ביצועים בזמן אמת ומנתחים נתונים לקבלת החלטות מבוססות דאטה.",
        items: [
          "דוחות ביצועים שבועיים וחודשיים",
          "ניתוח ROI והחזר על השקעה",
          "זיהוי מגמות והזדמנויות חדשות",
          "התאמת אסטרטגיה בזמן אמת"
        ]
      },
      color: {
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        primary: "#14b8a6",
        secondary: "#2dd4bf",
        glow: "rgba(20, 184, 166, 0.5)",
      },
    },
    {
      number: "5",
      icon: Rocket,
      title: "אופטימיזציה וצמיחה",
      subtitle: "משפרים באופן מתמיד לתוצאות טובות יותר",
      description: {
        summary: "אופטימיזציה מתמדת של הקמפיינים והתוכן לשיפור ביצועים והגדלת החזר השקעה.",
        items: [
          "שיפור יחסי המרה ועלויות רכישה",
          "הרחבת קמפיינים מצליחים לקהלים חדשים",
          "בדיקות ושיפורים מתמידים",
          "סקיילינג של מה שעובד – צמיחה בטוחה"
        ]
      },
      color: {
        gradient: "from-cyan-500 via-blue-500 to-indigo-500",
        primary: "#3b82f6",
        secondary: "#60a5fa",
        glow: "rgba(59, 130, 246, 0.5)",
      },
    },
  ],
  labels: {
    stepPrefix: "שלב",
    stepSuffix: "מתוך 5",
    startLabel: "התחלה",
    endLabel: "צמיחה",
    scrollPrompt: "גלול להמשך",
  },
};

// ============================================
// SEO PROCESS STEPS
// ============================================

export const seoProcess: ServiceProcessConfig = {
  serviceId: "seo",
  steps: [
    {
      number: "1",
      icon: FileSearch,
      title: "אבחון טכני",
      subtitle: "מזהים את הבעיות שמונעות דירוג",
      description: {
        summary: "סריקה מקיפה של האתר לזיהוי בעיות טכניות שפוגעות בדירוג בגוגל.",
        items: [
          "בדיקת מהירות: טעינה, ביצועים, חוויה",
          "ניתוח מבנה האתר וארכיטקטורת מידע",
          "זיהוי שגיאות סריקה ואינדקסציה",
          "בדיקת תאימות למובייל"
        ]
      },
      color: {
        gradient: "from-blue-500 via-indigo-500 to-violet-500",
        primary: "#3b82f6",
        secondary: "#6366f1",
        glow: "rgba(59, 130, 246, 0.5)",
      },
    },
    {
      number: "2",
      icon: Search,
      title: "מחקר מילות מפתח",
      subtitle: "מוצאים את מה שהלקוחות מחפשים",
      description: {
        summary: "מחקר מעמיק של מילות המפתח הרלוונטיות ביותר לעסק שלכם.",
        items: [
          "זיהוי מילות מפתח עם פוטנציאל תנועה",
          "ניתוח כוונת חיפוש (Search Intent)",
          "מיפוי הזדמנויות לתוכן ארוך טווח",
          "אסטרטגיית מילים לטווח קצר וארוך"
        ]
      },
      color: {
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        primary: "#8b5cf6",
        secondary: "#a78bfa",
        glow: "rgba(139, 92, 246, 0.5)",
      },
    },
    {
      number: "3",
      icon: Layers,
      title: "אופטימיזציה On-Page",
      subtitle: "משפרים את התוכן והמבנה הפנימי",
      description: {
        summary: "אופטימיזציה של כל עמוד, תוכן ואלמנטים טכניים לדירוג מיטבי.",
        items: [
          "כתיבת כותרות ותיאורים ממירים (Meta)",
          "אופטימיזציית תוכן למילות מפתח",
          "שיפור מבנה כותרות ולינקים פנימיים",
          "הטמעת Schema Markup לתוצאות עשירות"
        ]
      },
      color: {
        gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
        primary: "#d946ef",
        secondary: "#e879f9",
        glow: "rgba(217, 70, 239, 0.5)",
      },
    },
    {
      number: "4",
      icon: Link2,
      title: "בניית סמכות",
      subtitle: "משיגים קישורים איכותיים לאתר",
      description: {
        summary: "בניית פרופיל קישורים חזק שמגביר את הסמכות והאמינות של האתר.",
        items: [
          "יצירת תוכן שמושך קישורים טבעיים",
          "יחסי ציבור דיגיטליים ופרסומים",
          "בניית שותפויות אסטרטגיות",
          "ניטור וניקוי קישורים פוגעניים"
        ]
      },
      color: {
        gradient: "from-rose-500 via-red-500 to-orange-500",
        primary: "#f43f5e",
        secondary: "#fb7185",
        glow: "rgba(244, 63, 94, 0.5)",
      },
    },
    {
      number: "5",
      icon: TrendingUp,
      title: "מעקב וצמיחה",
      subtitle: "SEO הוא מרתון, לא ספרינט",
      description: {
        summary: "מעקב רציף אחרי הדירוגים והתנועה עם שיפורים מתמידים לצמיחה עקבית.",
        items: [
          "דוחות דירוג ותנועה אורגנית חודשיים",
          "ניתוח התקדמות מול מתחרים",
          "זיהוי הזדמנויות חדשות לתוכן",
          "עדכונים בהתאם לשינויי אלגוריתם"
        ]
      },
      color: {
        gradient: "from-orange-500 via-amber-500 to-yellow-500",
        primary: "#f97316",
        secondary: "#fb923c",
        glow: "rgba(249, 115, 22, 0.5)",
      },
    },
  ],
  labels: {
    stepPrefix: "שלב",
    stepSuffix: "מתוך 5",
    startLabel: "אבחון",
    endLabel: "צמיחה",
    scrollPrompt: "גלול להמשך",
  },
};

// ============================================
// SOCIAL MEDIA PROCESS STEPS
// ============================================

export const socialMediaProcess: ServiceProcessConfig = {
  serviceId: "social-media",
  steps: [
    {
      number: "1",
      icon: Compass,
      title: "אסטרטגיה חברתית",
      subtitle: "מגדירים את הקול והכיוון שלכם",
      description: {
        summary: "בונים אסטרטגיית תוכן ונוכחות שמתאימה למותג ולקהל היעד שלכם.",
        items: [
          "בחירת פלטפורמות מתאימות למותג",
          "הגדרת טון דיבור וזהות ויזואלית",
          "ניתוח מתחרים ובנצ'מרקינג",
          "הגדרת יעדים ומדדי הצלחה"
        ]
      },
      color: {
        gradient: "from-pink-500 via-rose-500 to-red-500",
        primary: "#ec4899",
        secondary: "#f472b6",
        glow: "rgba(236, 72, 153, 0.5)",
      },
    },
    {
      number: "2",
      icon: Calendar,
      title: "לוח זמנים תוכן",
      subtitle: "תכנון שיטתי, לא אקראי",
      description: {
        summary: "בניית לוח תוכן חודשי עם נושאים, פורמטים ותזמונים מדויקים.",
        items: [
          "תכנון תוכן חודשי מראש",
          "שילוב אירועים ותאריכים מיוחדים",
          "מיקס פורמטים: סטורי, רילס, פוסטים",
          "אוטומציה של פרסום תוכן"
        ]
      },
      color: {
        gradient: "from-red-500 via-orange-500 to-amber-500",
        primary: "#f97316",
        secondary: "#fb923c",
        glow: "rgba(249, 115, 22, 0.5)",
      },
    },
    {
      number: "3",
      icon: Palette,
      title: "יצירת תוכן",
      subtitle: "תוכן שמעורר עניין ומניע לפעולה",
      description: {
        summary: "יצירת תוכן ויזואלי, טקסטואלי ווידאו שמושך תשומת לב ומייצר מעורבות.",
        items: [
          "עיצוב גרפי מותאם לכל פלטפורמה",
          "צילום ועריכת וידאו מקצועיים",
          "יצירת סרטונים קצרים (Reels/TikTok)",
          "כתיבת Stories וקריאות לפעולה"
        ]
      },
      color: {
        gradient: "from-amber-500 via-yellow-500 to-lime-500",
        primary: "#eab308",
        secondary: "#facc15",
        glow: "rgba(234, 179, 8, 0.5)",
      },
    },
    {
      number: "4",
      icon: MessageCircle,
      title: "ניהול קהילה",
      subtitle: "בונים מערכות יחסים אמיתיות",
      description: {
        summary: "מנהלים את הקהילה באופן אקטיבי – עונים, מגיבים, יוצרים שיחות ומחזקים.",
        items: [
          "מענה מהיר להודעות ותגובות",
          "ניהול משברים ותלונות בחוכמה",
          "יצירת אינטראקציות משמעותיות",
          "שיתופי פעולה עם משפיענים ושגרירי מותג"
        ]
      },
      color: {
        gradient: "from-lime-500 via-green-500 to-emerald-500",
        primary: "#22c55e",
        secondary: "#4ade80",
        glow: "rgba(34, 197, 94, 0.5)",
      },
    },
    {
      number: "5",
      icon: BarChart3,
      title: "מדידה ושיפור",
      subtitle: "החלטות מבוססות נתונים",
      description: {
        summary: "ניתוח ביצועים עם דוחות מפורטים ואופטימיזציה מתמדת.",
        items: [
          "דוחות ביצועים שבועיים וחודשיים",
          "ניתוח מעורבות וצמיחת עוקבים",
          "בדיקת תוכן מצליח ופחות מצליח",
          "התאמות A/B לשיפור מתמיד"
        ]
      },
      color: {
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        primary: "#14b8a6",
        secondary: "#2dd4bf",
        glow: "rgba(20, 184, 166, 0.5)",
      },
    },
  ],
  labels: {
    stepPrefix: "שלב",
    stepSuffix: "מתוך 5",
    startLabel: "אסטרטגיה",
    endLabel: "צמיחה",
    scrollPrompt: "גלול להמשך",
  },
};

// ============================================
// BRANDING PROCESS STEPS
// ============================================

export const brandingProcess: ServiceProcessConfig = {
  serviceId: "branding",
  steps: [
    {
      number: "1",
      icon: Lightbulb,
      title: "גילוי ומחקר",
      subtitle: "מבינים את הסיפור שמאחורי העסק",
      description: {
        summary: "מעמיקים בהבנת הערכים, החזון, המטרות והייחודיות של העסק.",
        items: [
          "ריאיון מעמיק עם בעלי העסק",
          "ניתוח מתחרים ומגמות בתעשייה",
          "זיהוי נקודות חוזקה והזדמנויות",
          "הגדרת קהל יעד ופרסונות"
        ]
      },
      color: {
        gradient: "from-pink-500 via-rose-500 to-red-500",
        primary: "#ec4899",
        secondary: "#f472b6",
        glow: "rgba(236, 72, 153, 0.5)",
      },
    },
    {
      number: "2",
      icon: Target,
      title: "פוזיציונינג",
      subtitle: "מגדירים את המיקום בשוק",
      description: {
        summary: "בונים אסטרטגיית מיצוב שמבדילה אתכם מהמתחרים ומדברת ללקוחות.",
        items: [
          "הגדרת הצעת ערך ייחודית",
          "בניית סיפור מותג משכנע (UVP)",
          "יצירת מסרים מפתח לכל קהל",
          "בידול ברור מהמתחרים"
        ]
      },
      color: {
        gradient: "from-red-500 via-orange-500 to-amber-500",
        primary: "#f97316",
        secondary: "#fb923c",
        glow: "rgba(249, 115, 22, 0.5)",
      },
    },
    {
      number: "3",
      icon: Palette,
      title: "זהות ויזואלית",
      subtitle: "מעצבים את המראה שלכם",
      description: {
        summary: "יצירת שפה ויזואלית שמשקפת את האישיות והערכים של המותג.",
        items: [
          "עיצוב לוגו מקורי ובלתי נשכח",
          "בחירת פלטת צבעים וטיפוגרפיה",
          "יצירת אלמנטים גרפיים ייחודיים",
          "עיצוב תבניות לשימוש שוטף"
        ]
      },
      color: {
        gradient: "from-amber-500 via-yellow-500 to-lime-500",
        primary: "#eab308",
        secondary: "#facc15",
        glow: "rgba(234, 179, 8, 0.5)",
      },
    },
    {
      number: "4",
      icon: BookOpen,
      title: "ספר מותג",
      subtitle: "מתעדים את הכללים והסטנדרטים",
      description: {
        summary: "יצירת מסמך מקיף שמנחה את השימוש בזהות המותג לאורך זמן.",
        items: [
          "הנחיות שימוש בלוגו וצבעים",
          "כללי כתיבה וטון דיבור",
          "דוגמאות יישום נכונות",
          "הנחיות Do & Don't ברורות"
        ]
      },
      color: {
        gradient: "from-lime-500 via-green-500 to-emerald-500",
        primary: "#22c55e",
        secondary: "#4ade80",
        glow: "rgba(34, 197, 94, 0.5)",
      },
    },
    {
      number: "5",
      icon: Rocket,
      title: "השקה והטמעה",
      subtitle: "מביאים את המותג לחיים",
      description: {
        summary: "משיקים את הזהות החדשה בכל נקודות המגע עם הלקוחות.",
        items: [
          "עדכון חומרים שיווקיים",
          "הטמעה בפלטפורמות דיגיטליות (אתר, רשתות)",
          "הדרכת צוות לשימוש נכון במותג",
          "ליווי בתקופת ההטמעה הראשונית"
        ]
      },
      color: {
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        primary: "#14b8a6",
        secondary: "#2dd4bf",
        glow: "rgba(20, 184, 166, 0.5)",
      },
    },
  ],
  labels: {
    stepPrefix: "שלב",
    stepSuffix: "מתוך 5",
    startLabel: "גילוי",
    endLabel: "השקה",
    scrollPrompt: "גלול להמשך",
  },
};

// ============================================
// STRATEGY PROCESS STEPS
// ============================================

export const strategyProcess: ServiceProcessConfig = {
  serviceId: "strategy",
  steps: [
    {
      number: "1",
      icon: FileSearch,
      title: "ניתוח מצב קיים",
      subtitle: "מבינים איפה אתם עומדים היום",
      description: {
        summary: "מנתחים לעומק את המצב הנוכחי – חוזקות, חולשות, הזדמנויות ואיומים.",
        items: [
          "ניתוח SWOT מקיף של העסק",
          "מיפוי תחרות ופערים בשוק",
          "סקירת ביצועים דיגיטליים נוכחיים",
          "ראיונות עם בעלי עניין"
        ]
      },
      color: {
        gradient: "from-emerald-500 via-green-500 to-teal-500",
        primary: "#10b981",
        secondary: "#34d399",
        glow: "rgba(16, 185, 129, 0.5)",
      },
    },
    {
      number: "2",
      icon: Users,
      title: "הבנת לקוח",
      subtitle: "מכירים את הלקוחות לעומק",
      description: {
        summary: "חוקרים ומבינים את הצרכים, הכאבים והמוטיבציות של הלקוחות.",
        items: [
          "בניית פרסונות לקוח מפורטות",
          "מיפוי מסע לקוח מלא",
          "ניתוח נקודות מגע והזדמנויות",
          "סקרים וראיונות עם לקוחות קיימים"
        ]
      },
      color: {
        gradient: "from-teal-500 via-cyan-500 to-blue-500",
        primary: "#06b6d4",
        secondary: "#22d3ee",
        glow: "rgba(6, 182, 212, 0.5)",
      },
    },
    {
      number: "3",
      icon: Target,
      title: "הגדרת יעדים",
      subtitle: "קובעים מטרות מדידות",
      description: {
        summary: "מגדירים יעדים אסטרטגיים SMART שניתן למדוד ולעקוב אחריהם.",
        items: [
          "הגדרת יעדים לטווח קצר, בינוני וארוך",
          "בחירת KPIs מתאימים",
          "הגדרת אבני דרך ולוחות זמנים",
          "יצירת מערכת מעקב ובקרה"
        ]
      },
      color: {
        gradient: "from-blue-500 via-indigo-500 to-violet-500",
        primary: "#3b82f6",
        secondary: "#6366f1",
        glow: "rgba(59, 130, 246, 0.5)",
      },
    },
    {
      number: "4",
      icon: Map,
      title: "מפת דרכים",
      subtitle: "מתכננים את הצעדים הבאים",
      description: {
        summary: "בונים תוכנית פעולה מפורטת עם פריוריטיזציה, משאבים ותקציבים.",
        items: [
          "תעדוף פעולות לפי השפעה ומאמץ",
          "הקצאת משאבים ותקציב",
          "יצירת לוחות זמנים ריאליים",
          "הגדרת אחריות ובעלות"
        ]
      },
      color: {
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        primary: "#8b5cf6",
        secondary: "#a78bfa",
        glow: "rgba(139, 92, 246, 0.5)",
      },
    },
    {
      number: "5",
      icon: PieChart,
      title: "ביצוע ומעקב",
      subtitle: "מוודאים שהכל מתבצע כמתוכנן",
      description: {
        summary: "מלווים את הביצוע עם מעקב צמוד ומבצעים התאמות בזמן אמת.",
        items: [
          "ישיבות סטטוס קבועות",
          "דוחות התקדמות חודשיים",
          "זיהוי סטיות ותיקון מסלול",
          "עדכון אסטרטגיה לפי צורך"
        ]
      },
      color: {
        gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
        primary: "#d946ef",
        secondary: "#e879f9",
        glow: "rgba(217, 70, 239, 0.5)",
      },
    },
  ],
  labels: {
    stepPrefix: "שלב",
    stepSuffix: "מתוך 5",
    startLabel: "ניתוח",
    endLabel: "ביצוע",
    scrollPrompt: "גלול להמשך",
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Map of all service process configurations
 */
export const serviceProcessMap: Record<string, ServiceProcessConfig> = {
  "digital-marketing": digitalMarketingProcess,
  "seo": seoProcess,
  "social-media": socialMediaProcess,
  "branding": brandingProcess,
  "strategy": strategyProcess,
};

/**
 * Get process steps for a specific service
 */
export const getServiceProcess = (serviceId: string): ServiceProcessConfig | null => {
  return serviceProcessMap[serviceId] || null;
};

/**
 * Get all available service process IDs
 */
export const getAvailableServiceProcessIds = (): string[] => {
  return Object.keys(serviceProcessMap);
};

/**
 * Check if a service has custom process steps
 */
export const hasCustomProcess = (serviceId: string): boolean => {
  return serviceId in serviceProcessMap;
};

/**
 * Get the number of steps for a service
 */
export const getStepCount = (serviceId: string): number => {
  const config = serviceProcessMap[serviceId];
  return config ? config.steps.length : 0;
};

// Default export for convenience
export default serviceProcessMap;
