import {
  Monitor,
  ShoppingCart,
  Palette,
  Brain,
  Megaphone,
  Search,
  Share2,
  BarChart3,
  Smartphone,
  Code,
  PenTool,
  Layers,
  Zap,
  Globe,
  Mail,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface SubService {
  id: string;
  name: string;
  description: string;
  icon?: LucideIcon;
}

export interface Service {
  id: string;
  slug: string;

  // Display info
  name: string;
  subtitle: string;
  headline: string;
  description: string;
  fullDescription: string;

  // Taxonomy
  tier: "main" | "secondary";
  parentService?: string;

  // Visual
  icon: LucideIcon;
  image: string;
  gradient: string;
  accentColor: string;
  bgColor: string;

  // Bento Grid positioning
  gridSize: "large" | "medium" | "small";

  // Content
  subServices: SubService[];
  features: string[];
  benefits: string[];
  stat: { value: string; label: string };

  // Process steps for this service
  process: { step: string; title: string; description: string }[];

  // FAQ
  faqs: { question: string; answer: string }[];
}

// ============================================
// MAIN SERVICES (Large Cards)
// ============================================

const mainServices: Service[] = [
  {
    id: "web-development",
    slug: "web-development",
    name: "בניית אתרים ופיתוח",
    subtitle: "אתרים ואפליקציות ווב",
    headline: "הנוכחות הדיגיטלית המושלמת",
    description: "אתרים מותאמים אישית שממירים מבקרים ללקוחות. טכנולוגיה מתקדמת, עיצוב מרהיב, וביצועים יוצאי דופן.",
    fullDescription: "אנחנו בונים יותר מאתרים - אנחנו יוצרים חוויות דיגיטליות שמניעות עסקים. כל אתר מתוכנן בקפידה עם דגש על המרות, חווית משתמש, ומהירות. משתמשים בטכנולוגיות המתקדמות ביותר כדי להבטיח שהאתר שלכם יהיה מהיר, מאובטח, ונגיש בכל מכשיר.",
    tier: "main",
    icon: Monitor,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&fm=webp&fit=crop",
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    accentColor: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.15)",
    gridSize: "large",
    stat: { value: "340%", label: "ROI ממוצע" },
    features: [
      "מהירות טעינה אולטרא-מהירה",
      "אבטחה ברמה הגבוהה ביותר",
      "קוד נקי וסקיילבילי",
      "פאנל ניהול נוח ואינטואיטיבי",
      "SEO מובנה מהיום הראשון",
      "תמיכה וליווי לאחר השקה",
    ],
    benefits: [
      "הגדלת אמינות העסק",
      "יותר לידים איכותיים",
      "חווית משתמש מעולה",
      "דירוג גבוה בגוגל",
    ],
    subServices: [
      { id: "corporate-sites", name: "אתרי תדמית", description: "אתרים שמציגים את העסק בצורה המקצועית ביותר", icon: Globe },
      { id: "landing-pages", name: "דפי נחיתה", description: "דפים ממוקדים להמרות ולקמפיינים", icon: TrendingUp },
      { id: "catalog-sites", name: "אתרי קטלוג", description: "הצגת מוצרים ושירותים בצורה מסודרת ואטרקטיבית", icon: Globe },
      { id: "wordpress", name: "אתרי וורדפרס", description: "אתרים על מערכת הניהול הפופולרית בעולם", icon: Code },
      { id: "web-apps", name: "אפליקציות ווב", description: "מערכות מורכבות עם פונקציונליות מתקדמת", icon: Code },
    ],
    process: [
      { step: "01", title: "גילוי", description: "הבנת הצרכים, הקהל והמטרות העסקיות" },
      { step: "02", title: "אפיון", description: "תכנון מבנה האתר וחווית המשתמש" },
      { step: "03", title: "עיצוב", description: "יצירת עיצוב ויזואלי מותאם למותג" },
      { step: "04", title: "פיתוח", description: "בנייה עם טכנולוגיות מתקדמות" },
      { step: "05", title: "בדיקות", description: "QA מקיף בכל המכשירים" },
      { step: "06", title: "השקה", description: "עלייה לאוויר וליווי מתמשך" },
    ],
    faqs: [
      { question: "כמה זמן לוקח לבנות אתר?", answer: "תלוי במורכבות - אתר תדמית בסיסי לוקח 4-6 שבועות, פרויקטים מורכבים יותר 8-12 שבועות." },
      { question: "האם האתר יהיה מותאם לנייד?", answer: "בהחלט! כל האתרים שלנו מעוצבים בגישת Mobile-First ומותאמים לכל מכשיר." },
      { question: "האם אני יכול לעדכן את האתר בעצמי?", answer: "כן, אנחנו בונים אתרים עם מערכות ניהול תוכן ידידותיות שמאפשרות עדכון עצמאי." },
    ],
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    name: "חנויות אונליין",
    subtitle: "מסחר אלקטרוני מתקדם",
    headline: "חנות שמוכרת 24/7",
    description: "חנויות אונליין שמייצרות מכירות. מ-Shopify ועד פתרונות מותאמים - הכל עם דגש על המרות ונוחות.",
    fullDescription: "בניית חנות אונליין זה הרבה יותר מלהעלות מוצרים. אנחנו בונים מכונות מכירה דיגיטליות שמייעלות את כל התהליך - מהרגע שהלקוח נכנס ועד שהמוצר מגיע אליו. אינטגרציות חכמות, ניהול מלאי אוטומטי, ופתרונות תשלום מאובטחים.",
    tier: "main",
    icon: ShoppingCart,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&fm=webp&fit=crop",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    accentColor: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.15)",
    gridSize: "large",
    stat: { value: "2.8x", label: "גידול במכירות" },
    features: [
      "חנויות Shopify מקצועיות",
      "פתרונות WooCommerce",
      "מערכות תשלום מאובטחות",
      "ניהול מלאי אוטומטי",
      "אינטגרציות משלוחים",
      "אופטימיזציית המרות",
    ],
    benefits: [
      "מכירות 24 שעות ביממה",
      "הרחבת קהל הלקוחות",
      "ניהול יעיל יותר",
      "נתונים ותובנות עסקיות",
    ],
    subServices: [
      { id: "shopify", name: "חנויות Shopify", description: "הפלטפורמה המובילה לחנויות אונליין", icon: ShoppingCart },
      { id: "woocommerce", name: "WooCommerce", description: "פתרון גמיש על בסיס WordPress", icon: Code },
      { id: "payments", name: "מערכות תשלום", description: "אינטגרציות עם כל ספקי התשלום", icon: Zap },
      { id: "inventory", name: "ניהול מלאי", description: "אוטומציה וסנכרון מלאי", icon: BarChart3 },
    ],
    process: [
      { step: "01", title: "אפיון חנות", description: "הבנת המוצרים, הקהל ותהליך המכירה" },
      { step: "02", title: "בחירת פלטפורמה", description: "התאמת הפתרון הטכנולוגי המתאים" },
      { step: "03", title: "עיצוב", description: "יצירת חווית קנייה מעולה" },
      { step: "04", title: "בנייה", description: "פיתוח והעלאת מוצרים" },
      { step: "05", title: "אינטגרציות", description: "חיבור תשלומים ומשלוחים" },
      { step: "06", title: "השקה", description: "עלייה לאוויר ואופטימיזציה" },
    ],
    faqs: [
      { question: "איזו פלטפורמה מתאימה לי?", answer: "זה תלוי בגודל העסק והצרכים. Shopify מעולה להתחלה מהירה, WooCommerce לגמישות מקסימלית." },
      { question: "כמה עולה לבנות חנות אונליין?", answer: "מחירים נעים בין 15,000-80,000 ש\"ח תלוי במורכבות, כמות המוצרים והאינטגרציות הנדרשות." },
    ],
  },
  {
    id: "branding",
    slug: "branding",
    name: "מיתוג וזהות חזותית",
    subtitle: "מיתוג ועיצוב",
    headline: "המותג שנשאר בזיכרון",
    description: "מותג חזק זה הנכס היקר ביותר שלכם. אנחנו יוצרים זהויות שמספרות סיפור ובונות אמון מהרגע הראשון.",
    fullDescription: "מיתוג זה הרבה יותר מלוגו יפה. זו שפה שלמה שמגדירה איך העולם תופס אתכם. אנחנו בונים מותגים שעומדים במבחן הזמן - מאסטרטגיה ועד לעיצוב של כל נקודת מגע עם הלקוח. התוצאה? מותג שאי אפשר להתעלם ממנו.",
    tier: "main",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80&fm=webp&fit=crop",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    accentColor: "#ec4899",
    bgColor: "rgba(236, 72, 153, 0.15)",
    gridSize: "large",
    stat: { value: "500+", label: "מותגים שעיצבנו" },
    features: [
      "אסטרטגיית מותג מנצחת",
      "עיצוב לוגו ייחודי",
      "זהות ויזואלית מלאה",
      "ספר מותג מקצועי",
      "חומרי שיווק מעוצבים",
      "קופירייטינג ומסרים",
    ],
    benefits: [
      "בידול מהמתחרים",
      "בניית אמון מיידי",
      "עקביות בכל המדיומים",
      "ערך מותג גבוה יותר",
    ],
    subServices: [
      { id: "logo-design", name: "עיצוב לוגו", description: "לוגו ייחודי שמייצג את המותג", icon: Palette },
      { id: "visual-identity", name: "זהות ויזואלית", description: "שפה עיצובית מלאה ועקבית", icon: Layers },
      { id: "brand-book", name: "ספר מותג", description: "מדריך מקיף לשימוש במותג", icon: PenTool },
      { id: "copywriting", name: "קופירייטינג", description: "מסרים ותוכן שמוכרים", icon: PenTool },
    ],
    process: [
      { step: "01", title: "מחקר", description: "הכרת העסק, השוק והמתחרים" },
      { step: "02", title: "אסטרטגיה", description: "הגדרת מיצוב ומסרי מפתח" },
      { step: "03", title: "קונספט", description: "פיתוח כיווני עיצוב" },
      { step: "04", title: "עיצוב", description: "יצירת הזהות הויזואלית" },
      { step: "05", title: "יישום", description: "עיצוב כל נקודות המגע" },
      { step: "06", title: "מסירה", description: "ספר מותג וקבצי עבודה" },
    ],
    faqs: [
      { question: "כמה זמן לוקח תהליך מיתוג?", answer: "תהליך מיתוג מלא לוקח בדרך כלל 6-10 שבועות, כולל מחקר, אסטרטגיה ועיצוב." },
      { question: "מה כולל ספר מותג?", answer: "לוגו בכל הפורמטים, פלטת צבעים, טיפוגרפיה, הנחיות שימוש, ודוגמאות יישום." },
    ],
  },
  {
    id: "ai-automation",
    slug: "ai-automation",
    name: "בינה מלאכותית ואוטומציה",
    subtitle: "AI וטכנולוגיה חכמה",
    headline: "AI שעובד בשבילכם",
    description: "פתרונות AI חכמים שחוסכים זמן וכסף. מצ'אטבוטים ועד אוטומציות מורכבות - הטכנולוגיה של המחר, היום.",
    fullDescription: "הבינה המלאכותית משנה את הדרך שבה עסקים פועלים. אנחנו עוזרים לכם להטמיע פתרונות AI שעובדים 24/7 - צ'אטבוטים שמשיבים ללקוחות, אוטומציות שחוסכות שעות עבודה, וכלי ניתוח שמספקים תובנות שאי אפשר להשיג אחרת.",
    tier: "main",
    icon: Brain,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&fm=webp&fit=crop",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    accentColor: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.15)",
    gridSize: "large",
    stat: { value: "20h", label: "חיסכון שבועי" },
    features: [
      "צ'אטבוטים חכמים",
      "אוטומציות עסקיות",
      "יצירת תוכן AI",
      "יצירת תמונות AI",
      "אינטגרציות GPT",
      "ניתוח נתונים",
    ],
    benefits: [
      "חיסכון משמעותי בזמן",
      "שירות לקוחות 24/7",
      "תובנות עסקיות חכמות",
      "יתרון תחרותי",
    ],
    subServices: [
      { id: "chatbots", name: "צ'אטבוטים", description: "בוטים חכמים לשירות ומכירות", icon: Brain },
      { id: "automation", name: "אוטומציות", description: "Make, Zapier ופתרונות מותאמים", icon: Zap },
      { id: "ai-content", name: "תוכן AI", description: "כתיבה ויצירת תוכן אוטומטי", icon: PenTool },
    ],
    process: [
      { step: "01", title: "אבחון", description: "זיהוי הזדמנויות לאוטומציה" },
      { step: "02", title: "תכנון", description: "בחירת הכלים והפתרונות" },
      { step: "03", title: "בנייה", description: "פיתוח והטמעת הפתרונות" },
      { step: "04", title: "אינטגרציה", description: "חיבור למערכות קיימות" },
      { step: "05", title: "בדיקות", description: "וידוא שהכל עובד מושלם" },
      { step: "06", title: "אופטימיזציה", description: "שיפור מתמיד" },
    ],
    faqs: [
      { question: "האם AI יכול להחליף עובדים?", answer: "AI לא מחליף - הוא משפר. הוא מבצע משימות חוזרות כדי שהצוות שלכם יוכל להתמקד במה שחשוב." },
      { question: "כמה מורכב להטמיע AI בעסק?", answer: "תלוי בפתרון. חלק מהכלים ניתנים להטמעה תוך ימים, אחרים דורשים תכנון מעמיק יותר." },
    ],
  },
  {
    id: "digital-marketing",
    slug: "digital-marketing",
    name: "שיווק דיגיטלי",
    subtitle: "קמפיינים ופרסום",
    headline: "שיווק שמביא תוצאות",
    description: "קמפיינים חכמים שמביאים לקוחות אמיתיים. לא סתם קליקים - המרות, מכירות, וROI שאפשר למדוד.",
    fullDescription: "שיווק דיגיטלי אפקטיבי זה מדע ואומנות. אנחנו משלבים נתונים עם קריאטיב כדי ליצור קמפיינים שבאמת עובדים. מ-Google Ads דרך רשתות חברתיות ועד שיווק במייל - הכל עם דגש על ROI ותוצאות מדידות.",
    tier: "main",
    icon: Megaphone,
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80&fm=webp&fit=crop",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    accentColor: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.15)",
    gridSize: "large",
    stat: { value: "2.5x", label: "שיפור בהמרות" },
    features: [
      "קמפיינים ב-Google",
      "פרסום ברשתות חברתיות",
      "ניהול Meta Ads",
      "שיווק תוכן",
      "Email Marketing",
      "שיווק משפיענים",
    ],
    benefits: [
      "הגעה לקהל היעד",
      "תקציב יעיל יותר",
      "מדידה מדויקת",
      "צמיחה מתמדת",
    ],
    subServices: [
      { id: "google-ads", name: "Google Ads", description: "קמפיינים בחיפוש, תצוגה ויוטיוב", icon: Search },
      { id: "meta-ads", name: "Meta Ads", description: "פרסום בפייסבוק ואינסטגרם", icon: Share2 },
      { id: "email-marketing", name: "Email Marketing", description: "קמפיינים ואוטומציות מייל", icon: Mail },
      { id: "influencer", name: "שיווק משפיענים", description: "שיתופי פעולה אסטרטגיים", icon: TrendingUp },
    ],
    process: [
      { step: "01", title: "אסטרטגיה", description: "הגדרת מטרות וקהלי יעד" },
      { step: "02", title: "תכנון", description: "בניית תוכנית קמפיינים" },
      { step: "03", title: "קריאטיב", description: "יצירת מודעות ותוכן" },
      { step: "04", title: "הפעלה", description: "השקת הקמפיינים" },
      { step: "05", title: "מעקב", description: "ניטור וניתוח ביצועים" },
      { step: "06", title: "אופטימיזציה", description: "שיפור מתמיד" },
    ],
    faqs: [
      { question: "כמה צריך להשקיע בפרסום?", answer: "תלוי בתחום ובמטרות. ניתן להתחיל מ-3,000 ש\"ח לחודש ולגדול בהתאם לתוצאות." },
      { question: "כמה זמן עד שרואים תוצאות?", answer: "בדרך כלל רואים תוצאות ראשוניות תוך 2-4 שבועות, ושיפור משמעותי אחרי 2-3 חודשים." },
    ],
  },
];

// ============================================
// SECONDARY SERVICES (Smaller Cards)
// ============================================

const secondaryServices: Service[] = [
  {
    id: "seo",
    slug: "seo",
    name: "קידום אורגני SEO",
    subtitle: "אופטימיזציה למנועי חיפוש",
    headline: "להיות ראשונים בגוגל",
    description: "קידום אורגני שמביא תנועה איכותית לאורך זמן. אסטרטגיית SEO מקיפה שעובדת.",
    fullDescription: "SEO זה מרתון, לא ספרינט. אנחנו בונים אסטרטגיות קידום אורגני שמביאות תוצאות לאורך זמן - מחקר מילות מפתח, אופטימיזציה טכנית, בניית קישורים, ותוכן שגוגל אוהב.",
    tier: "secondary",
    parentService: "digital-marketing",
    icon: Search,
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80&fm=webp&fit=crop",
    gradient: "from-blue-500 to-cyan-500",
    accentColor: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    gridSize: "small",
    stat: { value: "Top 3", label: "מיקום בגוגל" },
    features: [
      "מחקר מילות מפתח",
      "אופטימיזציה טכנית",
      "בניית קישורים",
      "תוכן SEO",
    ],
    benefits: ["תנועה חינמית", "אמינות גבוהה", "תוצאות לאורך זמן"],
    subServices: [],
    process: [
      { step: "01", title: "אודיט", description: "בדיקת המצב הקיים" },
      { step: "02", title: "מחקר", description: "מילות מפתח ומתחרים" },
      { step: "03", title: "אופטימיזציה", description: "שיפורים טכניים ותוכניים" },
      { step: "04", title: "קישורים", description: "בניית פרופיל קישורים" },
    ],
    faqs: [
      { question: "כמה זמן עד שרואים תוצאות?", answer: "SEO דורש סבלנות - תוצאות משמעותיות מגיעות בדרך כלל אחרי 3-6 חודשים." },
    ],
  },
  {
    id: "social-media",
    slug: "social-media",
    name: "ניהול רשתות חברתיות",
    subtitle: "סושיאל מדיה",
    headline: "נוכחות שמדברת",
    description: "ניהול מקצועי של הנוכחות ברשתות החברתיות. תוכן שמעורר עניין ובונה קהילה.",
    fullDescription: "הרשתות החברתיות הן המקום שבו הלקוחות שלכם נמצאים. אנחנו מנהלים את הנוכחות שלכם בצורה מקצועית - מתכנון תוכן ועד לניהול קהילה ותגובות.",
    tier: "secondary",
    parentService: "digital-marketing",
    icon: Share2,
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80&fm=webp&fit=crop",
    gradient: "from-pink-500 to-purple-500",
    accentColor: "#d946ef",
    bgColor: "rgba(217, 70, 239, 0.15)",
    gridSize: "small",
    stat: { value: "150%", label: "גידול במעורבות" },
    features: [
      "ניהול אינסטגרם",
      "ניהול פייסבוק",
      "ניהול לינקדאין",
      "יצירת תוכן",
    ],
    benefits: ["מודעות למותג", "קהילה פעילה", "לידים איכותיים"],
    subServices: [],
    process: [
      { step: "01", title: "אסטרטגיה", description: "הגדרת יעדים וקהלים" },
      { step: "02", title: "תכנון", description: "לוח שנה לתוכן" },
      { step: "03", title: "יצירה", description: "הפקת תוכן" },
      { step: "04", title: "ניהול", description: "פרסום ותגובות" },
    ],
    faqs: [
      { question: "כמה פוסטים בשבוע?", answer: "תלוי בפלטפורמה - בדרך כלל 3-5 פוסטים בשבוע לאינסטגרם, פחות ללינקדאין." },
    ],
  },
  {
    id: "strategy",
    slug: "strategy",
    name: "אסטרטגיה דיגיטלית",
    subtitle: "תכנון ויעוץ",
    headline: "התוכנית להצלחה",
    description: "אסטרטגיה דיגיטלית מקיפה שמנחה כל החלטה ומובילה לתוצאות מדידות.",
    fullDescription: "לפני שרצים - מתכננים. אנחנו בונים אסטרטגיות דיגיטליות מקיפות שמתאימות לעסק שלכם - מחקר שוק, הגדרת יעדים, תכנון ערוצים, ותוכנית פעולה מפורטת.",
    tier: "secondary",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&fm=webp&fit=crop",
    gradient: "from-emerald-500 to-teal-500",
    accentColor: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.15)",
    gridSize: "small",
    stat: { value: "85%", label: "שיפור בביצועים" },
    features: [
      "מחקר שוק",
      "ניתוח מתחרים",
      "הגדרת יעדים",
      "תוכנית פעולה",
    ],
    benefits: ["כיוון ברור", "החלטות מושכלות", "מדידת הצלחה"],
    subServices: [],
    process: [
      { step: "01", title: "מחקר", description: "ניתוח השוק והמתחרים" },
      { step: "02", title: "אבחון", description: "הבנת המצב הקיים" },
      { step: "03", title: "תכנון", description: "בניית האסטרטגיה" },
      { step: "04", title: "יישום", description: "תוכנית פעולה מפורטת" },
    ],
    faqs: [
      { question: "מה כולל שירות אסטרטגיה?", answer: "מחקר מקיף, ניתוח SWOT, הגדרת קהלי יעד, מיצוב, ותוכנית פעולה מפורטת." },
    ],
  },
  {
    id: "app-development",
    slug: "app-development",
    name: "פיתוח אפליקציות",
    subtitle: "אפליקציות מובייל",
    headline: "האפליקציה שלכם",
    description: "פיתוח אפליקציות לאנדרואיד ו-iOS. מאפליקציות פשוטות ועד פלטפורמות מורכבות.",
    fullDescription: "אפליקציה מובייל היא דרך ישירה להגיע ללקוחות שלכם. אנחנו מפתחים אפליקציות איכותיות בטכנולוגיות מתקדמות - React Native, Flutter, או native כשנדרש.",
    tier: "secondary",
    parentService: "web-development",
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&fm=webp&fit=crop",
    gradient: "from-blue-600 to-violet-600",
    accentColor: "#7c3aed",
    bgColor: "rgba(124, 58, 237, 0.15)",
    gridSize: "small",
    stat: { value: "4.8", label: "דירוג ממוצע" },
    features: [
      "iOS ו-Android",
      "React Native / Flutter",
      "חוויית משתמש מעולה",
      "אינטגרציות מתקדמות",
    ],
    benefits: ["נגישות ללקוחות", "נאמנות גבוהה", "ערוץ ישיר"],
    subServices: [],
    process: [
      { step: "01", title: "אפיון", description: "הגדרת פיצ'רים וUX" },
      { step: "02", title: "עיצוב", description: "UI מותאם מובייל" },
      { step: "03", title: "פיתוח", description: "בנייה ובדיקות" },
      { step: "04", title: "השקה", description: "העלאה לחנויות" },
    ],
    faqs: [
      { question: "כמה עולה לפתח אפליקציה?", answer: "מחירים נעים בין 50,000-300,000 ש\"ח תלוי במורכבות האפליקציה." },
    ],
  },
  {
    id: "custom-development",
    slug: "custom-development",
    name: "פיתוח מותאם אישית",
    subtitle: "פתרונות טכנולוגיים",
    headline: "בדיוק מה שצריך",
    description: "כשפתרונות מדף לא מספיקים - אנחנו בונים בדיוק מה שצריך. פיתוח מותאם לצרכים הייחודיים שלכם.",
    fullDescription: "לפעמים הפתרון הנכון לא קיים בשוק. במקרים כאלה, אנחנו בונים אותו. מערכות CRM מותאמות, APIs, אינטגרציות מורכבות, ופתרונות SaaS - הכל לפי הצורך הספציפי שלכם.",
    tier: "secondary",
    parentService: "web-development",
    icon: Code,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&fm=webp&fit=crop",
    gradient: "from-slate-600 to-zinc-600",
    accentColor: "#71717a",
    bgColor: "rgba(113, 113, 122, 0.15)",
    gridSize: "small",
    stat: { value: "100%", label: "התאמה לצרכים" },
    features: [
      "מערכות CRM",
      "APIs ואינטגרציות",
      "פלטפורמות SaaS",
      "כלי ניהול פנימיים",
    ],
    benefits: ["פתרון מדויק", "יתרון תחרותי", "סקלביליות"],
    subServices: [],
    process: [
      { step: "01", title: "דרישות", description: "הבנת הצרכים בדיוק" },
      { step: "02", title: "ארכיטקטורה", description: "תכנון המערכת" },
      { step: "03", title: "פיתוח", description: "בנייה אג'ילית" },
      { step: "04", title: "הטמעה", description: "השקה והדרכה" },
    ],
    faqs: [
      { question: "כמה זמן לוקח פיתוח מותאם?", answer: "תלוי במורכבות - מפרויקטים של כמה שבועות ועד כמה חודשים." },
    ],
  },
];

// ============================================
// COMBINED SERVICES & HELPER FUNCTIONS
// ============================================

export const allServices: Service[] = [...mainServices, ...secondaryServices];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return allServices.find((service) => service.slug === slug);
};

export const getMainServices = (): Service[] => {
  return mainServices;
};

export const getSecondaryServices = (): Service[] => {
  return secondaryServices;
};

export const getRelatedServices = (serviceId: string, limit = 3): Service[] => {
  const service = allServices.find((s) => s.id === serviceId);
  if (!service) return [];

  // Get services from the same parent or same tier
  return allServices
    .filter((s) => {
      if (s.id === serviceId) return false;
      if (service.parentService && s.parentService === service.parentService) return true;
      if (service.tier === "main" && s.tier === "secondary" && s.parentService === serviceId) return true;
      if (s.tier === service.tier) return true;
      return false;
    })
    .slice(0, limit);
};

export const getServicesByParent = (parentId: string): Service[] => {
  return allServices.filter((service) => service.parentService === parentId);
};

// For bento grid layout - returns services ordered for the grid
export const getServicesForBentoGrid = (): Service[] => {
  // Main services first (large cards), then secondary (small cards)
  // Interleave them for a balanced layout
  const result: Service[] = [];
  const main = [...mainServices];
  const secondary = [...secondaryServices];

  // Pattern: 2 main, 2 secondary, repeat
  while (main.length > 0 || secondary.length > 0) {
    if (main.length > 0) result.push(main.shift()!);
    if (main.length > 0) result.push(main.shift()!);
    if (secondary.length > 0) result.push(secondary.shift()!);
    if (secondary.length > 0) result.push(secondary.shift()!);
  }

  return result;
};

export default allServices;
