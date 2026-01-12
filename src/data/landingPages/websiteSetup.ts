// ============================================
// WEBSITE SETUP LANDING PAGE DATA
// הקמת אתר אינטרנט - Website Setup/Establishment
// ============================================
// SEO-optimized landing page for first-time website owners in Israel
// All content in Hebrew with English translations in comments
// Target keyword: הקמת אתר אינטרנט (320 monthly searches)

import type { LandingPageData } from "@/types/landingPage";

export const websiteSetupLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "website-setup",
  slug: "website-setup",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "הקמת אתר אינטרנט" (main keyword)
    title: "הקמת אתר אינטרנט | מהרעיון להשקה בזמן שיא | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "הקמת אתר אינטרנט מקצועי לעסק שלכם. מדומיין ואחסון ועד עיצוב והשקה - אנחנו מלווים אתכם בכל שלב. שיחת ייעוץ ראשונית ללא עלות.",
    keywords: [
      // Primary keywords (high volume)
      "הקמת אתר אינטרנט",                    // Website setup/establishment
      "הקמת אתר",                            // Website setup
      "פתיחת אתר אינטרנט",                   // Opening a website
      // Secondary keywords (medium volume, less competition)
      "איך מקימים אתר",                      // How to set up a website
      "הקמת אתר לעסק",                       // Website setup for business
      "הקמת אתר מאפס",                       // Setting up website from scratch
      // Long-tail keywords (high conversion intent)
      "כמה עולה להקים אתר",                  // How much to set up a website
      "הקמת אתר אינטרנט מחיר",               // Website setup price
      "הקמת אתר לעסק קטן",                   // Website setup for small business
      "שירותי הקמת אתר",                     // Website setup services
      // Related intent keywords
      "בניית אתר ראשון",                     // Building first website
      "פתיחת אתר לעסק חדש",                  // Opening website for new business
      "הקמת נוכחות דיגיטלית",                // Establishing digital presence
      "דומיין ואחסון לאתר",                  // Domain and hosting for website
    ],
    canonicalUrl: "https://nexo.co.il/lp/website-setup",
    ogImage: "/images/landing/website-setup-og.webp",
    schema: {
      type: "Service",
      serviceType: "Website Setup and Development",
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
    // Cyan - representing fresh start, innovation, digital
    accentColor: "#06b6d4",
    gradient: "from-slate-900 via-cyan-900 to-slate-800",
    // Tech/startup themed background image
    heroImage: "/images/landing/website-setup-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // Badge - builds credibility
    badge: "ליווי מלא מהרעיון להשקה",
    // H1 - main keyword + value proposition
    title: "הקמת אתר אינטרנט שעובד בשבילכם",
    // Subtitle - clear benefits
    subtitle: "האתר הראשון שלכם? אנחנו מלווים אתכם בכל שלב",
    // Description - addresses first-time website owner concerns
    description: "מבינים שזה עולם חדש. דומיין, אחסון, עיצוב, תוכן - הרבה החלטות. אנחנו פה כדי לפשט את התהליך ולהקים לכם אתר מקצועי שמייצג את העסק בדיוק כמו שצריך.",
    primaryCTA: {
      text: "לשיחת ייעוץ חינם",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "ראו איך התהליך עובד",
      href: "#process",
    },
    trustBadge: "למעלה מ-100 אתרים הוקמו בהצלחה",
    stats: [
      {
        value: "100+",
        label: "אתרים הוקמו",
      },
      {
        value: "2-3",
        label: "שבועות להשקה",
      },
      {
        value: "100%",
        label: "בעלות מלאה שלכם",
      },
    ],
  },

  // ============================================
  // PAIN POINTS SECTION
  // ============================================
  painPoints: {
    title: "מרגישים אבודים בעולם הדיגיטלי?",
    subtitle: "האתגרים שמלווים בעלי עסקים בהקמת אתר ראשון",
    items: [
      {
        icon: "HelpCircle",
        title: "לא יודעים מאיפה להתחיל",
        description: "דומיין? אחסון? וורדפרס? וויקס? כל כך הרבה אפשרויות ומונחים לא מוכרים. בלי רקע טכני, קשה לדעת מה באמת צריך ומה מיותר.",
      },
      {
        icon: "DollarSign",
        title: "חוששים מעלויות נסתרות",
        description: "שמעתם סיפורי אימה על פרויקטים שהתייקרו פי כמה. רוצים לדעת מראש כמה זה עולה, בלי הפתעות באמצע הדרך.",
      },
      {
        icon: "Clock",
        title: "אין זמן ללמוד טכנולוגיה",
        description: "יש לכם עסק לנהל. ללמוד לבנות אתר לבד יקח חודשים. אתם צריכים מישהו שיעשה את העבודה - ויעשה אותה נכון.",
      },
      {
        icon: "Lock",
        title: "פחד להיות תלויים בספק",
        description: "לא רוצים להיות כבולים לחברה מסוימת. רוצים אתר שהוא באמת שלכם, שתוכלו לשנות או להעביר בעתיד ללא בעיות.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה כולל שירות הקמת אתר?",
    subtitle: "חבילה מלאה שמכסה את כל מה שצריך - מהדומיין ועד להשקה",
    items: [
      {
        icon: "Globe",
        title: "רישום דומיין וייעוץ",
        description: "נעזור לכם לבחור שם דומיין מתאים ונטפל ברישום שלו. הדומיין נרשם על שמכם - הוא שייך לכם לחלוטין.",
        highlight: true,
      },
      {
        icon: "Server",
        title: "אחסון מהיר ואמין",
        description: "אחסון על שרתים מהירים עם גיבויים אוטומטיים ותעודת אבטחה SSL. האתר שלכם יהיה זמין 24/7.",
        highlight: true,
      },
      {
        icon: "Palette",
        title: "עיצוב מותאם אישית",
        description: "עיצוב ייחודי שמתאים לאופי העסק שלכם. לא תבניות גנריות - אתר שנראה מקצועי ומייצג אתכם נכון.",
        highlight: true,
      },
      {
        icon: "Smartphone",
        title: "התאמה לנייד מושלמת",
        description: "האתר יעבוד מצוין בכל מכשיר - מחשב, טאבלט, וסמארטפון. כי רוב הגולשים מגיעים מהנייד.",
      },
      {
        icon: "Search",
        title: "תשתית SEO בסיסית",
        description: "האתר ייבנה עם מבנה נכון לקידום בגוגל. תגיות, מהירות, ומבנה כתובות - הכל מוכן לקידום עתידי.",
      },
      {
        icon: "BookOpen",
        title: "הדרכה על מערכת הניהול",
        description: "תקבלו הדרכה מלאה על איך לעדכן תכנים, להוסיף תמונות, ולנהל את האתר בעצמכם בלי לדעת קוד.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "התהליך שלנו - פשוט ושקוף",
    subtitle: "ארבעה שלבים ברורים מהפגישה הראשונה ועד לאתר עובד",
    steps: [
      {
        number: "01",
        title: "שיחת היכרות ואפיון",
        description: "נכיר את העסק, נבין מה המטרות שלכם, ונגדיר יחד מה האתר צריך לכלול. נסביר את האפשרויות ונתאים חבילה לתקציב.",
        icon: "MessageCircle",
      },
      {
        number: "02",
        title: "תכנון ועיצוב",
        description: "ניצור עיצוב ראשוני ונציג לכם. תראו איך האתר ייראה לפני שמתחילים לבנות - ותוכלו לבקש שינויים עד שתהיו מרוצים.",
        icon: "Layers",
      },
      {
        number: "03",
        title: "פיתוח והקמה",
        description: "נבנה את האתר עם כל התכנים והפיצ׳רים שסיכמנו. תקבלו עדכונים שוטפים וגישה לצפות בהתקדמות.",
        icon: "Wrench",
      },
      {
        number: "04",
        title: "השקה והדרכה",
        description: "אחרי בדיקות מקיפות, האתר עולה לאוויר. תקבלו הדרכה על איך לנהל את האתר ותמיכה ראשונית להתחלה חלקה.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "אתרים שהקמנו",
    subtitle: "הצצה לפרויקטים שהשלמנו עבור לקוחות מרוצים",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות",
    subtitle: "תשובות לשאלות שבעלי עסקים שואלים לפני הקמת אתר ראשון",
    categories: [
      {
        name: "לפני ההתחלה",
        questions: [
          {
            question: "אני לא מבין בטכנולוגיה - זה בעיה?",
            answer: "בכלל לא! זו בדיוק הסיבה שאנחנו פה. אנחנו מטפלים בכל הצד הטכני ומסבירים הכל בשפה פשוטה. בסוף התהליך תדעו לנהל את האתר בעצמכם בלי לדעת שורת קוד אחת.",
          },
          {
            question: "כמה זמן לוקח להקים אתר?",
            answer: "אתר תדמית סטנדרטי לוקח בדרך כלל 2-3 שבועות. אתרים מורכבים יותר עם יכולות מיוחדות יכולים לקחת 4-6 שבועות. בפגישה הראשונה נספק הערכת זמנים מדויקת.",
          },
          {
            question: "מה אני צריך להכין מראש?",
            answer: "בעיקר תכנים: טקסטים על העסק והשירותים, תמונות איכותיות, ולוגו אם יש. אם אין לכם תכנים מוכנים - אפשר להזמין גם שירותי כתיבה וצילום בתוספת.",
          },
        ],
      },
      {
        name: "דומיין ואחסון",
        questions: [
          {
            question: "מה זה דומיין ולמה צריך אחד?",
            answer: "דומיין הוא הכתובת של האתר שלכם באינטרנט (למשל yoursite.co.il). זה מה שאנשים מקלידים בדפדפן כדי להגיע לאתר. דומיין מקצועי מחזק את המותג ועוזר ללקוחות למצוא ולזכור אתכם.",
          },
          {
            question: "מה ההבדל בין אחסון משותף לאחסון ייעודי?",
            answer: "אחסון משותף מתאים לרוב האתרים העסקיים - מספק ביצועים טובים במחיר נגיש. אחסון ייעודי מיועד לאתרים עם תנועה גבוהה מאוד או דרישות מיוחדות. נמליץ על האפשרות המתאימה לצרכים שלכם.",
          },
          {
            question: "האם אתם מטפלים בחידוש הדומיין והאחסון?",
            answer: "כן, אם תרצו - אנחנו יכולים לנהל את החידושים השנתיים בשבילכם. תקבלו תזכורת לפני מועד החידוש ונדאג שהאתר ימשיך לפעול ברציפות ללא הפסקות.",
          },
        ],
      },
      {
        name: "בעלות ותחזוקה",
        questions: [
          {
            question: "האתר יהיה שלי לחלוטין?",
            answer: "כן, 100%. הדומיין, האתר, הקוד, התכנים - הכל רשום על שמכם ושייך לכם. אתם לא תלויים בנו ויכולים להעביר את האתר לכל מקום אחר אם תרצו.",
          },
          {
            question: "אני יכול לעדכן את האתר בעצמי?",
            answer: "בהחלט! האתר מגיע עם מערכת ניהול נוחה שמאפשרת לכם לעדכן תכנים, להוסיף תמונות, ולערוך עמודים בלי ידע טכני. ניתן הדרכה מלאה על איך להשתמש בה.",
          },
          {
            question: "מה קורה אם משהו נשבר באתר?",
            answer: "בחודש הראשון לאחר ההשקה יש תמיכה מלאה ללא תוספת. לאחר מכן ניתן לרכוש חבילת תחזוקה חודשית, או לפנות אלינו לתיקונים נקודתיים בהתאם לצורך.",
          },
        ],
      },
    ],
  },

  // ============================================
  // TESTIMONIALS - REMOVED (per user request on lawyers page)
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
    title: "מוכנים להקים את האתר הראשון שלכם?",
    description: "בואו נדבר על מה שאתם צריכים. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות - נבין יחד מה האתר האידיאלי בשבילכם.",
    primaryCTA: {
      text: "לתיאום שיחת ייעוץ",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    features: [
      "ליווי מלא מא' עד ת'",
      "בעלות מלאה שלכם",
      "מחיר שקוף ללא הפתעות",
      "הדרכה על ניהול האתר",
    ],
  },

  // ============================================
  // RELATED SERVICES - Bento Grid Format
  // ============================================
  relatedServices: {
    title: "שירותים משלימים",
    subtitle: "הצעד הבא אחרי הקמת האתר",
    items: [
      {
        name: "קידום אורגני SEO",
        description: "הבאת תנועה אורגנית מגוגל לאתר החדש",
        href: "/services/seo",
      },
      {
        name: "מיתוג ולוגו",
        description: "זהות מותגית מקצועית שמשלימה את האתר",
        href: "/services/branding",
      },
      {
        name: "חנות וירטואלית",
        description: "למי שרוצה גם למכור מוצרים אונליין",
        href: "/services/ecommerce",
      },
      {
        name: "תחזוקה ותמיכה",
        description: "שקט נפשי עם ליווי טכני שוטף",
        href: "/services/web-development",
      },
    ],
  },
};

export default websiteSetupLandingPage;
