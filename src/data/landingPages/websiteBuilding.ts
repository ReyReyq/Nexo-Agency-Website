// ============================================
// WEBSITE BUILDING LANDING PAGE DATA
// בניית אתרים - Website Building (General)
// ============================================
// Main SEO landing page targeting "בניית אתרים" - highest volume keyword (5,400/month)
// This is the primary landing page for website building services in Israel
// All content in Hebrew with English translations in comments
// Keywords researched: בניית אתרים, בניית אתר לעסק, בניית אתרים מקצועית

import type { LandingPageData } from "@/types/landingPage";

export const websiteBuildingLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "website-building",
  slug: "website-building",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "בניית אתרים" (main keyword) - 67 chars
    title: "בניית אתרים מקצועית | אתר שמביא לקוחות ומגדיל מכירות | נקסו",
    // Description targeting long-tail keywords and conversion intent - 158 chars
    description: "בניית אתרים לעסקים בישראל. אתר מעוצב, מהיר וממוטב לגוגל שעובד 24/7. מותאם לנייד, קל לניהול, ובבעלותכם המלאה. שיחת ייעוץ ראשונית חינם.",
    keywords: [
      // Primary keywords (highest volume)
      "בניית אתרים",                       // Website building - 5,400/month
      "בניית אתר",                         // Website building (singular)
      "בניית אתרים לעסקים",                // Website building for businesses
      // Secondary keywords (medium volume)
      "בניית אתר לעסק",                    // Building a website for business
      "בניית אתרים מקצועית",               // Professional website building
      "חברת בניית אתרים",                  // Website building company
      "עיצוב אתרים",                       // Website design
      // Long-tail keywords (high conversion intent)
      "כמה עולה לבנות אתר",                // How much does it cost to build a website
      "בניית אתר תדמית לעסק",              // Portfolio website for business
      "בניית אתר וורדפרס",                 // WordPress website building
      "בניית אתר מותאם לנייד",             // Mobile-friendly website building
      "בניית אתר עם קידום בגוגל",          // Website building with SEO
      // Location-based keywords
      "בניית אתרים תל אביב",               // Tel Aviv
      "בניית אתרים ירושלים",               // Jerusalem
      "בניית אתרים חיפה",                  // Haifa
    ],
    canonicalUrl: "https://nexo.agency/lp/website-building",
    ogImage: "/images/landing/website-building-og.webp",
    schema: {
      type: "Service",
      serviceType: "Website Development and Design",
      areaServed: "Israel",
      provider: {
        name: "Nexo Digital",
        url: "https://nexo.agency",
      },
    },
  },

  // ============================================
  // VISUAL THEMING
  // ============================================
  theme: {
    // Modern blue/purple gradient - conveys innovation and professionalism
    accentColor: "#4F46E5",
    gradient: "from-slate-900 via-indigo-900 to-purple-900",
    // Modern analytics/website dashboard image (Unsplash)
    heroImage: "/images/landing/website-building-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // Badge - establishes authority
    badge: "מעל 150 אתרים הושקו בהצלחה",
    // H1 - main keyword + value proposition
    title: "בניית אתרים שמביאים תוצאות",
    // Subtitle - clear benefits
    subtitle: "אתר מקצועי שעובד בשבילכם 24/7 - ממיר מבקרים ללקוחות ומגדיל את העסק",
    // Description - creates urgency and addresses pain points
    description: "72% מהלקוחות מחפשים עסקים בגוגל לפני שהם מתקשרים. בלי אתר מקצועי, אתם פשוט לא קיימים עבורם.",
    primaryCTA: {
      text: "לשיחת ייעוץ חינם",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "צפו בעבודות שלנו",
      href: "#portfolio",
    },
    // Trust indicator
    trustBadge: "דירוג 4.9 מתוך 5 - מעל 50 ביקורות",
    // Stats for credibility
    stats: [
      { value: "150+", label: "אתרים שהושקו" },
      { value: "98%", label: "לקוחות מרוצים" },
      { value: "24/7", label: "תמיכה זמינה" },
    ],
  },

  // ============================================
  // PAIN POINTS SECTION
  // ============================================
  painPoints: {
    title: "מכירים את המצב הזה?",
    subtitle: "האתגרים שעסקים בישראל מתמודדים איתם בעולם הדיגיטלי",
    items: [
      {
        icon: "UserX",
        // Customers choose competitors
        title: "לקוחות בוחרים במתחרים",
        description: "כשמחפשים בגוגל את השירות שלכם, מי שמופיע עם אתר מקצועי מקבל את הפנייה. בלי נוכחות דיגיטלית - אתם מאבדים לקוחות כל יום.",
      },
      {
        icon: "Clock",
        // No time for marketing
        title: "אין זמן לעסוק באתר",
        description: "אתם עסוקים בניהול העסק, בלקוחות, בעובדים. למי יש זמן לעסוק באתר? אתם צריכים מישהו שייקח את זה מכם לחלוטין.",
      },
      {
        icon: "Smartphone",
        // Old website doesn't convert
        title: "האתר הישן לא עובד",
        description: "אתר איטי, לא מותאם לנייד, או עם עיצוב מיושן פוגע באמינות שלכם. לקוחות עוזבים תוך 5 שניות אם האתר לא משכנע.",
      },
      {
        icon: "HelpCircle",
        // Don't know where to start
        title: "לא יודעים מאיפה להתחיל",
        description: "וורדפרס? וויקס? מתכנת? סוכנות? כל כך הרבה אפשרויות ומחירים שונים. קשה להבין מה באמת צריך ומי אפשר לסמוך עליו.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה אתם מקבלים?",
    subtitle: "אתר מקצועי שבנוי נכון מהיסוד - לא רק יפה, אלא גם יעיל",
    items: [
      {
        icon: "Palette",
        // Custom professional design
        title: "עיצוב מקצועי ומותאם אישית",
        description: "לא תבנית גנרית. עיצוב ייחודי שמשדר את הערכים של העסק שלכם ומבדל אתכם מהמתחרים.",
        highlight: true,
      },
      {
        icon: "Smartphone",
        // Mobile responsive
        title: "מותאם לנייד בצורה מושלמת",
        description: "מעל 60% מהגולשים נכנסים מהנייד. האתר שלכם ייראה ויעבוד מעולה בכל מכשיר - מחשב, טאבלט וסמארטפון.",
        highlight: true,
      },
      {
        icon: "Search",
        // SEO optimized
        title: "ממוטב לגוגל מהיום הראשון",
        description: "מבנה טכני נכון, מהירות טעינה גבוהה, ותגיות SEO - כדי שגוגל יוכל למצוא את האתר שלכם ולדרג אותו גבוה.",
        highlight: true,
      },
      {
        icon: "Zap",
        // Fast loading
        title: "מהירות טעינה גבוהה",
        description: "אתר שנטען תוך 2-3 שניות. כל שנייה נוספת גורמת ל-7% מהמבקרים לעזוב עוד לפני שראו משהו.",
      },
      {
        icon: "Settings",
        // Easy management
        title: "קל לניהול ולעדכון",
        description: "מערכת ניהול פשוטה שמאפשרת לכם לעדכן תכנים, להוסיף תמונות ולערוך טקסטים - בלי לדעת קוד.",
      },
      {
        icon: "ShieldCheck",
        // Security and ownership
        title: "אבטחה ובעלות מלאה",
        description: "תעודת SSL, גיבויים אוטומטיים, והאתר שלכם לחלוטין. לא תלויים בנו - הקוד, העיצוב והתכנים שייכים לכם.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "איך זה עובד?",
    subtitle: "תהליך פשוט ושקוף - מהפגישה הראשונה ועד לאתר פעיל",
    steps: [
      {
        number: "01",
        // Discovery and planning
        title: "שיחת היכרות ואפיון",
        description: "נבין את העסק שלכם, את הקהל, ואת המטרות. יחד נגדיר מה האתר צריך לכלול ואילו עמודים נדרשים.",
        icon: "MessageSquare",
      },
      {
        number: "02",
        // Design
        title: "עיצוב והצגת מוקאפים",
        description: "ניצור עיצוב ייחודי שמתאים לעסק שלכם. תראו את העמודים המרכזיים ותאשרו לפני שמתחילים לבנות.",
        icon: "Figma",
      },
      {
        number: "03",
        // Development
        title: "פיתוח ובנייה",
        description: "נבנה את האתר עם טכנולוגיות מתקדמות. תקבלו עדכונים שוטפים וגישה לראות את ההתקדמות.",
        icon: "Code",
      },
      {
        number: "04",
        // Launch and training
        title: "השקה והדרכה",
        description: "אחרי בדיקות מקיפות, האתר עולה לאוויר. תקבלו הדרכה על מערכת הניהול ותמיכה שוטפת.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "אתרים שבנינו",
    subtitle: "הצצה לפרויקטים אחרונים שעשינו ללקוחות מגוונים",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "תשובות לשאלות הכי נפוצות על בניית אתרים",
    categories: [
      {
        // General questions
        name: "כללי",
        questions: [
          {
            question: "למה העסק שלי צריך אתר?",
            answer: "כיום 72% מהצרכנים מחפשים עסקים בגוגל לפני שהם יוצרים קשר. עסק בלי אתר או עם אתר לא מקצועי נתפס כפחות אמין. אתר מקצועי עובד בשבילכם 24/7 - מציג את השירותים, בונה אמינות, ומאפשר ללקוחות למצוא אתכם גם כשאתם ישנים.",
          },
          {
            question: "מה ההבדל ביניכם לבין בניית אתר בוויקס לבד?",
            answer: "וויקס מתאים לאתר פשוט שאתם בונים לבד. אנחנו מציעים עיצוב מותאם אישית, ביצועים מהירים יותר, אופטימיזציה לגוגל, והכי חשוב - את הזמן שלכם חזרה. במקום לבזבז שבועות על לימוד הכלי, אתם מקבלים אתר מוכן תוך שבועות ספורים.",
          },
          {
            question: "האם האתר יהיה שלי לחלוטין?",
            answer: "כן, 100%. בניגוד לפלטפורמות השכרה או חברות שמחזיקות באתר, אנחנו מעבירים את הכל לבעלותכם המלאה - הקוד, העיצוב, התכנים, והדומיין. אתם לא תלויים בנו ויכולים להעביר את האתר לכל מקום.",
          },
        ],
      },
      {
        // Technical questions
        name: "טכני",
        questions: [
          {
            question: "באיזו טכנולוגיה אתם בונים?",
            answer: "אנחנו בונים אתרים עם הטכנולוגיות המתקדמות ביותר - React, Next.js, ו-WordPress לפי הצורך. הבחירה נעשית לפי סוג האתר והצרכים שלכם. כל האתרים שלנו מהירים, מאובטחים, וקלים לניהול.",
          },
          {
            question: "האם האתר יהיה מותאם לנייד?",
            answer: "בהחלט. כל אתר שאנחנו בונים מותאם בצורה מושלמת לכל המכשירים - מחשב, טאבלט, וסמארטפון. זה לא רק 'נראה טוב' בנייד, אלא מתוכנן מראש לחוויה מעולה בכל מסך.",
          },
          {
            question: "מה לגבי אבטחה וגיבויים?",
            answer: "כל אתר מגיע עם תעודת SSL (הפס הירוק בדפדפן), הגנה מפני התקפות, וגיבויים אוטומטיים. אנחנו גם דואגים לעדכוני אבטחה שוטפים כדי שהאתר יישאר מוגן.",
          },
        ],
      },
      {
        // Process and quality questions
        name: "תהליך ואיכות",
        questions: [
          {
            question: "כמה זמן לוקח לבנות אתר?",
            answer: "אתר תדמית רגיל - 2-3 שבועות. אתר עסקי מורחב - 3-5 שבועות. חנות אינטרנטית - 4-8 שבועות. הזמנים תלויים גם במהירות שאתם מספקים תכנים ומשוב.",
          },
          {
            question: "מה מבדיל אתכם מחברות בניית אתרים אחרות?",
            answer: "אנחנו לא בונים אתרים מתבניות - כל אתר מעוצב ומפותח במיוחד לעסק שלכם. התמחות בטכנולוגיות מתקדמות, דגש על מהירות וביצועים, ותמיכה אמיתית גם אחרי ההשקה. והכי חשוב - האתר שלכם לחלוטין, לא שכירות חודשית.",
          },
          {
            question: "מה קורה אחרי שהאתר עולה לאוויר?",
            answer: "אתם מקבלים הדרכה מלאה על מערכת הניהול ותמיכה לאחר ההשקה. אנחנו זמינים לשאלות ולעזרה. מציעים גם חבילות תחזוקה שוטפת למי שמעדיף שנדאג לעדכונים, גיבויים ואבטחה באופן קבוע.",
          },
        ],
      },
    ],
  },

  // ============================================
  // TESTIMONIALS - REMOVED (per template pattern)
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
    description: "בואו נדבר על איך אתר מקצועי יכול לעזור לעסק שלכם לצמוח. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.",
    primaryCTA: {
      text: "לשיחת ייעוץ חינם",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    // Quick feature highlights
    features: [
      "עיצוב מותאם אישית",
      "מותאם לנייד ולגוגל",
      "תשלום חד פעמי",
      "בעלות מלאה שלכם",
    ],
  },

  // ============================================
  // RELATED SERVICES (Simple list for footer/sidebar)
  // ============================================
  relatedServices: [
    {
      name: "קידום אורגני SEO",
      slug: "seo",
      description: "הגיעו לראש תוצאות גוגל והביאו יותר לקוחות באופן אורגני",
    },
    {
      name: "חנות אינטרנטית",
      slug: "ecommerce",
      description: "התחילו למכור אונליין עם חנות מקצועית ומאובטחת",
    },
    {
      name: "מיתוג ועיצוב גרפי",
      slug: "branding",
      description: "מיתוג שלם שמבדל את העסק שלכם מהמתחרים",
    },
  ],

  // ============================================
  // RELATED SERVICES BENTO GRID
  // ============================================
  relatedServicesBento: {
    title: "שירותים נוספים שיכולים לעניין אתכם",
    subtitle: "פתרונות משלימים לבניית האתר",
    items: [
      {
        name: "אתרי וורדפרס",
        description: "אתרים מבוססי וורדפרס עם מערכת ניהול פשוטה ונוחה",
        href: "/services/web-development/wordpress",
      },
      {
        name: "דפי נחיתה",
        description: "דפים ממוקדי המרה לקמפיינים ולהשקות",
        href: "/services/web-development/landing-pages",
      },
      {
        name: "אתרי תדמית",
        description: "אתרים שמציגים את העסק בצורה המקצועית ביותר",
        href: "/services/web-development/corporate-sites",
      },
      {
        name: "אתרי קטלוג",
        description: "הצגת מוצרים ושירותים בצורה מסודרת ואטרקטיבית",
        href: "/services/web-development/catalog-sites",
      },
      {
        name: "קידום אורגני SEO",
        description: "שהאתר החדש יופיע גם בתוצאות החיפוש של גוגל",
        href: "/services/seo",
      },
      {
        name: "תחזוקת אתרים",
        description: "שהאתר ישאר מעודכן, מאובטח ומהיר לאורך זמן",
        href: "/services/web-development/website-maintenance",
      },
    ],
  },
};

export default websiteBuildingLandingPage;
