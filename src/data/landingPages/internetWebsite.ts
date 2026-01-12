// ============================================
// INTERNET WEBSITE LANDING PAGE DATA
// בניית אתר אינטרנט - Internet Website Building
// ============================================
// SEO-optimized landing page for generic website building services in Israel
// All content in Hebrew with English translations in comments
// Target keyword: בניית אתר אינטרנט (720 monthly searches)

import type { LandingPageData } from "@/types/landingPage";

export const internetWebsiteLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "internet-website",
  slug: "internet-website",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "בניית אתר אינטרנט" (main keyword)
    title: "בניית אתר אינטרנט | אתר מקצועי שמביא תוצאות | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "בניית אתר אינטרנט מקצועי לעסק שלכם. עיצוב מותאם אישית, מותאם לנייד וממוטב לגוגל. תשלום חד פעמי ובעלות מלאה. שיחת ייעוץ ראשונית חינם.",
    keywords: [
      // Primary keywords (high volume)
      "בניית אתר אינטרנט",                    // Internet website building
      "בניית אתרים",                          // Website building
      "אתר אינטרנט לעסק",                     // Internet website for business
      // Secondary keywords (medium volume)
      "עיצוב אתר אינטרנט",                    // Internet website design
      "הקמת אתר אינטרנט",                     // Setting up internet website
      "פיתוח אתר אינטרנט",                    // Internet website development
      "אתר תדמית",                            // Portfolio/image website
      // Long-tail keywords (high conversion intent)
      "כמה עולה לבנות אתר אינטרנט",           // How much does it cost to build an internet website
      "בניית אתר אינטרנט מחיר",               // Internet website building price
      "חברה לבניית אתרי אינטרנט",             // Internet website building company
      "בניית אתר אינטרנט מותאם לנייד",        // Mobile-friendly internet website building
      // Technology keywords
      "בניית אתר רספונסיבי",                  // Responsive website building
      "אתר מותאם לגוגל",                      // Google-optimized website
      "אתר עם מערכת ניהול",                   // Website with CMS
    ],
    canonicalUrl: "https://nexo.co.il/lp/internet-website",
    ogImage: "/images/landing/internet-website-hero.jpg",
    schema: {
      type: "Service",
      serviceType: "Internet Website Development",
      areaServed: "Israel",
      provider: {
        name: "Nexo Digital",
        url: "https://nexo.co.il",
      },
    },
  },

  // ============================================
  // VISUAL THEMING
  // ============================================
  theme: {
    // Blue - representing internet/digital/technology
    accentColor: "#3b82f6",
    gradient: "from-slate-900 via-blue-900 to-indigo-900",
    // Digital network/internet visualization (Unsplash)
    heroImage: "/images/landing/internet-website-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // H1 - main keyword + value proposition
    title: "בניית אתר אינטרנט שעובד בשבילכם",
    // Subtitle - clear benefits
    subtitle: "אתר מקצועי שמייצג את העסק שלכם ברשת ומביא לקוחות חדשים",
    // Description - creates urgency
    description: "בעידן הדיגיטלי, אתר אינטרנט הוא כרטיס הביקור שלכם. לקוחות מחפשים אתכם בגוגל עכשיו - האם הם ימצאו אתר שמשכנע אותם לפנות אליכם?",
    primaryCTA: {
      text: "לשיחת ייעוץ חינם",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "צפו בעבודות שלנו",
      href: "#portfolio",
    },
  },

  // ============================================
  // PAIN POINTS SECTION
  // ============================================
  painPoints: {
    title: "האתגרים שאתם מכירים",
    subtitle: "הבעיות שעסקים מתמודדים איתן בעולם הדיגיטלי",
    items: [
      {
        icon: "TrendingDown",
        title: "הלקוחות לא מוצאים אתכם",
        description: "בלי אתר אינטרנט מקצועי, אתם פשוט לא קיימים עבור רוב הלקוחות הפוטנציאליים. הם מחפשים בגוגל - ומגיעים למתחרים.",
      },
      {
        icon: "AlertCircle",
        title: "האתר הקיים לא מייצג אתכם נכון",
        description: "אתר ישן, לא מעודכן או לא מקצועי פוגע באמינות שלכם. לקוחות שופטים את העסק לפי האתר - והראשון רושם קובע.",
      },
      {
        icon: "Smartphone",
        title: "האתר לא עובד טוב בנייד",
        description: "יותר מ-60% מהגלישה היום היא מהנייד. אתר שלא מותאם לנייד מפסיד את רוב הלקוחות הפוטנציאליים.",
      },
      {
        icon: "Clock",
        title: "אין זמן ומומחיות לבנות אתר",
        description: "לבנות אתר לבד לוקח שבועות, דורש ידע טכני ותוצאה לא מובטחת. אתם צריכים להתמקד בעסק - לא בלימוד בניית אתרים.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה כולל אתר האינטרנט שלכם?",
    subtitle: "פתרון מלא שעונה על כל הצרכים הדיגיטליים של העסק",
    items: [
      {
        icon: "Palette",
        title: "עיצוב מותאם אישית",
        description: "עיצוב ייחודי שמשקף את המותג והערכים שלכם. לא תבניות גנריות - אלא אתר שבאמת מייצג אתכם.",
        highlight: true,
      },
      {
        icon: "Smartphone",
        title: "מותאם לכל המכשירים",
        description: "האתר נראה ועובד מעולה בכל מכשיר - מחשב, טאבלט וסמארטפון. עיצוב רספונסיבי מובנה.",
        highlight: true,
      },
      {
        icon: "Search",
        title: "תשתית SEO מובנית",
        description: "מבנה טכני נכון, מהירות טעינה גבוהה ותגיות מותאמות - כדי שגוגל יוכל למצוא ולדרג את האתר שלכם.",
        highlight: true,
      },
      {
        icon: "Zap",
        title: "מהירות טעינה גבוהה",
        description: "אתר איטי = לקוחות שעוזבים. אנחנו בונים אתרים מהירים שנטענים תוך שניות.",
      },
      {
        icon: "Shield",
        title: "אבטחה ותעודת SSL",
        description: "אתר מאובטח עם תעודת SSL, הגנה מפני פריצות ועמידה בתקני אבטחה עדכניים.",
      },
      {
        icon: "Settings",
        title: "מערכת ניהול תוכן פשוטה",
        description: "ממשק ניהול קל לשימוש שמאפשר לכם לעדכן תכנים, להוסיף עמודים ולערוך תמונות בעצמכם.",
      },
      {
        icon: "Mail",
        title: "טפסי יצירת קשר חכמים",
        description: "טפסים שאוספים את המידע הנכון ושולחים התראות ישירות למייל או לנייד שלכם.",
      },
      {
        icon: "BarChart",
        title: "חיבור לגוגל אנליטיקס",
        description: "מעקב אחרי תנועה באתר, מקורות הגעה והתנהגות מבקרים - כדי שתדעו מה עובד.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "איך זה עובד?",
    subtitle: "תהליך פשוט ושקוף מהפגישה הראשונה ועד להשקה",
    steps: [
      {
        number: "01",
        title: "שיחת היכרות ואפיון",
        description: "נכיר את העסק שלכם, נבין את המטרות ונגדיר יחד מה האתר צריך לכלול. ללא עלות וללא התחייבות.",
        icon: "Users",
      },
      {
        number: "02",
        title: "עיצוב והצגת מוקאפים",
        description: "ניצור עיצוב ייחודי שמתאים למותג שלכם. תראו את העמודים המרכזיים ותוכלו לבקש שינויים לפני הפיתוח.",
        icon: "Palette",
      },
      {
        number: "03",
        title: "פיתוח ובנייה",
        description: "נבנה את האתר עם טכנולוגיות מתקדמות. תקבלו עדכונים שוטפים ונקודות ביקורת לאישור.",
        icon: "Code",
      },
      {
        number: "04",
        title: "השקה והדרכה",
        description: "אחרי בדיקות מקיפות, האתר עולה לאוויר. תקבלו הדרכה מלאה על מערכת הניהול ותמיכה שוטפת.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "אתרים שבנינו",
    subtitle: "הצצה לפרויקטים שעשינו ללקוחות שלנו",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "כל מה שרציתם לדעת על בניית אתר אינטרנט",
    categories: [
      {
        name: "כללי",
        questions: [
          {
            question: "למה בכלל צריך אתר אינטרנט?",
            answer: "אתר אינטרנט הוא הנוכחות הדיגיטלית שלכם ברשת. הוא עובד 24/7, מאפשר ללקוחות למצוא אתכם בגוגל, מציג את השירותים והמוצרים שלכם, ובונה אמינות. בעידן הדיגיטלי, עסק בלי אתר פשוט לא קיים עבור רוב הלקוחות הפוטנציאליים.",
          },
          {
            question: "מה מבדיל אתר מקצועי מאתר בסיסי?",
            answer: "אתר מקצועי נבנה עם תשומת לב לפרטים: עיצוב ייחודי שמשקף את המותג, קוד נקי ומהיר, תשתית SEO מובנית, וחווית משתמש מעולה בכל מכשיר. אתר בסיסי משתמש בתבניות גנריות ולרוב לא ממוטב לביצועים או לקידום בגוגל.",
          },
          {
            question: "כמה זמן לוקח לבנות אתר?",
            answer: "אתר תדמית רגיל לוקח בין 2-4 שבועות. אתר עסקי מתקדם בין 4-8 שבועות. הזמן תלוי גם במהירות שבה מתקבלים התכנים והמשוב מכם.",
          },
          {
            question: "האם האתר יהיה שלי לחלוטין?",
            answer: "כן, 100%. בניגוד לפלטפורמות השכרה כמו Wix או Weebly, אנחנו מעבירים את האתר לבעלותכם המלאה. הקוד, העיצוב, התכנים - הכל שלכם. אתם לא תלויים בנו לעד.",
          },
        ],
      },
      {
        name: "טכני",
        questions: [
          {
            question: "האם האתר יהיה מותאם לנייד?",
            answer: "בהחלט. כל אתר שאנחנו בונים הוא רספונסיבי - מותאם באופן מושלם לכל גודל מסך: מחשב, טאבלט וסמארטפון. יותר מ-60% מהגלישה היום מנייד, אז זה קריטי.",
          },
          {
            question: "מה לגבי קידום בגוגל (SEO)?",
            answer: "האתר נבנה עם תשתית SEO איכותית: מבנה טכני נכון, מהירות טעינה גבוהה, תגיות מותאמות ומובייל-פרסט. זה נותן לכם יתרון משמעותי. לקידום אקטיבי מתמשך (בניית קישורים, כתיבת תוכן) אנחנו מציעים שירות נפרד.",
          },
          {
            question: "האם אני יכול לעדכן את האתר בעצמי?",
            answer: "כן. אנחנו בונים אתרים עם מערכת ניהול תוכן ידידותית. תוכלו לעדכן טקסטים, להחליף תמונות, להוסיף עמודים ופוסטים - בלי ידע טכני. אנחנו גם מספקים הדרכה מלאה.",
          },
          {
            question: "מה כולל התחזוקה והתמיכה?",
            answer: "אחרי ההשקה אנחנו כאן בשבילכם. השנה הראשונה כוללת תמיכה טכנית, עדכוני אבטחה ותיקון באגים. אפשר גם לבחור בחבילת תחזוקה חודשית שכוללת גיבויים, עדכונים ושינויים קטנים.",
          },
        ],
      },
      {
        name: "תהליך העבודה",
        questions: [
          {
            question: "מה אני צריך להביא לתהליך?",
            answer: "בעיקר - את המידע על העסק שלכם: לוגו (אם יש), תמונות, טקסטים על השירותים, ופרטי התקשרות. אם אין לכם, אנחנו יכולים לעזור עם צילום, כתיבת תוכן ועיצוב לוגו.",
          },
          {
            question: "כמה סבבי תיקונים יש?",
            answer: "בכל שלב יש לכם אפשרות לבקש שינויים. בעיצוב - עד 2 סבבי תיקונים כלולים. בפיתוח - תיקונים קטנים ללא הגבלה. אנחנו רוצים שתהיו מרוצים מהתוצאה.",
          },
          {
            question: "מה קורה אחרי שהאתר עולה לאוויר?",
            answer: "אתם מקבלים הדרכה מלאה על מערכת הניהול. תמיכה טכנית לשנה הראשונה. והכי חשוב - אתר שעובד בשבילכם ומביא לקוחות. אם תרצו קידום אקטיבי או תחזוקה שוטפת - יש לנו שירותים נוספים.",
          },
        ],
      },
    ],
  },

  // ============================================
  // TESTIMONIALS - REMOVED (per user request)
  // ============================================
  testimonials: {
    title: "",
    subtitle: "",
    items: [], // Empty - not using testimonials
  },

  // ============================================
  // CTA SECTION
  // ============================================
  cta: {
    title: "מוכנים לאתר שעובד בשבילכם?",
    description: "בואו נדבר על איך אתר אינטרנט מקצועי יכול לקדם את העסק שלכם. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.",
    primaryCTA: {
      text: "לתיאום שיחת ייעוץ",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    features: [
      "עיצוב מותאם אישית",
      "מותאם לנייד ולגוגל",
      "תשלום חד פעמי",
      "בעלות מלאה שלכם",
    ],
  },

  // ============================================
  // RELATED SERVICES - Bento Grid Format
  // ============================================
  relatedServices: {
    title: "שירותים נוספים",
    subtitle: "פתרונות משלימים לאתר שלכם",
    items: [
      {
        name: "קידום אתרים",
        description: "קידום אורגני בגוגל להגדלת החשיפה והתנועה לאתר",
        href: "/services/seo",
      },
      {
        name: "מיתוג ועיצוב",
        description: "בניית זהות מותג חזקה שמבדלת אתכם מהמתחרים",
        href: "/services/branding",
      },
      {
        name: "חנות אונליין",
        description: "פתרון מסחר אלקטרוני מלא למכירה ברשת",
        href: "/services/ecommerce",
      },
      {
        name: "תחזוקת אתרים",
        description: "שמירה על האתר מעודכן, מאובטח ופועל בצורה מיטבית",
        href: "/services/web-development",
      },
      {
        name: "שיווק דיגיטלי",
        description: "קמפיינים ממומנים ואסטרטגיה דיגיטלית מקיפה",
        href: "/services/digital-marketing",
      },
      {
        name: "כתיבת תוכן",
        description: "תוכן שיווקי ומקצועי שמושך לקוחות ומקדם בגוגל",
        href: "/services/content",
      },
    ],
  },
};

export default internetWebsiteLandingPage;
