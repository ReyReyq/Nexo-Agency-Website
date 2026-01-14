// ============================================
// WORDPRESS WEBSITE LANDING PAGE DATA
// בניית אתר וורדפרס - WordPress Website Building
// ============================================
// SEO-optimized landing page for WordPress website development in Israel
// Target keyword: "בניית אתר וורדפרס" (880 monthly searches)
// All content in Hebrew with English translations in comments

import type { LandingPageData } from "@/types/landingPage";

export const wordpressWebsiteLandingPage: LandingPageData = {
  // ============================================
  // IDENTIFICATION
  // ============================================
  id: "wordpress-website",
  slug: "wordpress-website",

  // ============================================
  // SEO METADATA - Optimized for Hebrew search
  // ============================================
  seo: {
    // Title optimized for "בניית אתר וורדפרס" (main keyword)
    title: "בניית אתר וורדפרס | אתר מקצועי שאתם שולטים בו | נקסו",
    // Description targeting long-tail keywords and conversion intent
    description: "בניית אתר וורדפרס מותאם אישית לעסק שלכם. עיצוב מקצועי, מהירות גבוהה, SEO מובנה, וניהול עצמאי פשוט. קבלו הצעת מחיר ללא התחייבות.",
    keywords: [
      // Primary keywords (high volume)
      "בניית אתר וורדפרס",                // WordPress website building
      "אתר וורדפרס",                      // WordPress website
      "אתר WordPress",                    // WordPress site (English)
      // Secondary keywords (medium volume)
      "בניית אתר וורדפרס מחיר",            // WordPress website price
      "בניית אתר וורדפרס לעסק",            // WordPress website for business
      "עיצוב אתר וורדפרס",                 // WordPress website design
      "פיתוח אתר וורדפרס",                 // WordPress website development
      // Long-tail keywords (high conversion intent)
      "כמה עולה לבנות אתר וורדפרס",         // How much does WordPress website cost
      "בניית אתר וורדפרס מותאם אישית",      // Custom WordPress website building
      "אתר וורדפרס לעסקים קטנים",          // WordPress website for small businesses
      "בניית חנות וורדפרס",                // WordPress store building (WooCommerce)
      "אתר תדמית וורדפרס",                 // WordPress portfolio website
      // Location-based keywords
      "בניית אתר וורדפרס ישראל",            // WordPress website Israel
      "בניית אתר וורדפרס תל אביב",          // Tel Aviv
      "מפתח וורדפרס ישראל",                // WordPress developer Israel
    ],
    canonicalUrl: "https://nexo.agency/lp/wordpress-website",
    ogImage: "/images/landing/wordpress-website-hero.jpg",
    schema: {
      type: "ProfessionalService",
      serviceType: "WordPress Website Development",
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
    // WordPress blue - official brand color
    accentColor: "#21759b",
    gradient: "from-slate-900 via-sky-900 to-slate-800",
    // Hero image - professional web development scene
    heroImage: "/images/landing/wordpress-website-hero.jpg",
  },

  // ============================================
  // HERO SECTION - Clear, direct copy
  // ============================================
  hero: {
    // H1 - main keyword + value proposition
    title: "בניית אתר וורדפרס שעובד בשבילכם",
    // Subtitle - clear benefits
    subtitle: "אתר מקצועי שתוכלו לנהל בקלות, בלי תלות במפתחים",
    // Description - creates urgency and addresses key concern
    description: "מעל 40% מהאתרים בעולם בנויים על וורדפרס. הסיבה פשוטה - מערכת חזקה, גמישה וקלה לניהול. קבלו אתר שנראה מעולה ותוכלו לעדכן אותו בעצמכם.",
    primaryCTA: {
      text: "לקבלת הצעת מחיר",
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
    title: "מכירים את האתגרים האלה?",
    subtitle: "הבעיות שבעלי עסקים נתקלים בהן בבניית אתרים",
    items: [
      {
        icon: "Lock",
        title: "תלות במפתח לכל שינוי קטן",
        description: "רוצים לשנות טקסט או להוסיף תמונה? צריכים לחכות למפתח ולשלם על כל עדכון. עם וורדפרס, אתם עושים את זה לבד תוך דקות.",
      },
      {
        icon: "DollarSign",
        title: "תשלומים חודשיים שלא נגמרים",
        description: "פלטפורמות סגורות גובות מאות שקלים בחודש. וורדפרס הוא קוד פתוח - משלמים פעם אחת על הפיתוח והאתר שלכם לתמיד.",
      },
      {
        icon: "Gauge",
        title: "אתר איטי שמפסיד לקוחות",
        description: "גוגל מעדיף אתרים מהירים. אתר איטי מוריד את הדירוג, מגדיל את אחוז הנטישה ומפסיד לכם לקוחות כל יום.",
      },
      {
        icon: "Puzzle",
        title: "מוגבלים ביכולת להתרחב",
        description: "צריכים חנות אונליין? טופס מורכב? מערכת הזמנות? פלטפורמות מוגבלות לא מאפשרות להוסיף. וורדפרס גדל יחד עם העסק שלכם.",
      },
    ],
  },

  // ============================================
  // FEATURES SECTION
  // ============================================
  features: {
    title: "מה כולל אתר וורדפרס מקצועי?",
    subtitle: "פתרון מלא שנבנה במיוחד לצרכים של העסק שלכם",
    items: [
      {
        icon: "Palette",
        title: "עיצוב מותאם אישית",
        description: "לא תבנית גנרית. אתר שמשקף את המותג שלכם עם עיצוב ייחודי שיבלוט מול המתחרים.",
        highlight: true,
      },
      {
        icon: "Zap",
        title: "מהירות טעינה גבוהה",
        description: "אופטימיזציה מקצועית שמבטיחה טעינה מהירה. גוגל יאהב את האתר שלכם והמבקרים ישארו.",
        highlight: true,
      },
      {
        icon: "Smartphone",
        title: "מותאם לכל מכשיר",
        description: "רספונסיבי מושלם - נראה ועובד מעולה בנייד, טאבלט ומחשב. כי יותר מ-60% מהגולשים מגיעים מהנייד.",
      },
      {
        icon: "Search",
        title: "תשתית SEO מובנית",
        description: "מבנה טכני נכון, כתובות נקיות ותגיות מותאמות - הבסיס שגוגל צריך כדי לדרג אתכם גבוה.",
        highlight: true,
      },
      {
        icon: "Settings",
        title: "ניהול עצמאי קל",
        description: "ממשק ניהול בעברית שאתם שולטים בו. תוכלו להוסיף תכנים, לשנות תמונות ולעדכן את האתר בלי עזרה.",
      },
      {
        icon: "Shield",
        title: "אבטחה ברמה גבוהה",
        description: "תעודת SSL, הגנה מפני פריצות, גיבויים אוטומטיים. האתר שלכם מוגן ובטוח ללקוחות.",
      },
      {
        icon: "ShoppingCart",
        title: "אפשרות לחנות אונליין",
        description: "רוצים למכור באינטרנט? WooCommerce הופך את האתר שלכם לחנות מלאה עם תשלומים, משלוחים ומלאי.",
      },
      {
        icon: "BarChart3",
        title: "אנליטיקס ומעקב",
        description: "חיבור ל-Google Analytics כדי שתדעו מאיפה הגולשים מגיעים ומה הם עושים באתר.",
      },
    ],
  },

  // ============================================
  // PROCESS SECTION
  // ============================================
  process: {
    title: "איך בונים אתר וורדפרס?",
    subtitle: "תהליך מסודר ושקוף מהפגישה הראשונה ועד ההשקה",
    steps: [
      {
        number: "01",
        title: "אפיון וייעוץ",
        description: "נכיר את העסק, המטרות וקהל היעד שלכם. יחד נגדיר את המבנה, התכנים והפונקציות שהאתר צריך.",
        icon: "MessageCircle",
      },
      {
        number: "02",
        title: "עיצוב ויזואלי",
        description: "ניצור עיצוב ייחודי שמשקף את המותג שלכם. תאשרו את העיצוב לפני שמתחילים לפתח.",
        icon: "Palette",
      },
      {
        number: "03",
        title: "פיתוח ובנייה",
        description: "נבנה את האתר על וורדפרס עם קוד נקי וטכנולוגיות מתקדמות. תקבלו עדכונים שוטפים.",
        icon: "Code",
      },
      {
        number: "04",
        title: "בדיקות ואופטימיזציה",
        description: "נבדוק כל פרט - כל קישור, כל טופס, כל תמונה. נוודא מהירות טעינה וחוויית משתמש מושלמת.",
        icon: "CheckCircle2",
      },
      {
        number: "05",
        title: "השקה והדרכה",
        description: "האתר עולה לאוויר. תקבלו הדרכה מלאה על ניהול המערכת ותמיכה שוטפת.",
        icon: "Rocket",
      },
    ],
  },

  // ============================================
  // PORTFOLIO SECTION DATA
  // ============================================
  portfolio: {
    title: "אתרי וורדפרס שבנינו",
    subtitle: "הצצה לפרויקטים של לקוחות מרוצים",
    ctaText: "לצפייה בכל הפרויקטים",
    ctaLink: "/portfolio",
  },

  // ============================================
  // FAQ SECTION - Categorized with Tabs
  // ============================================
  faq: {
    title: "שאלות נפוצות על בניית אתר וורדפרס",
    subtitle: "כל מה שרציתם לדעת - במקום אחד",
    categories: [
      {
        name: "כללי",
        questions: [
          {
            question: "למה לבחור בוורדפרס?",
            answer: "וורדפרס היא מערכת ניהול התוכן הפופולרית בעולם - מעל 40% מהאתרים בנויים עליה. היא קוד פתוח, גמישה מאוד, קלה לניהול ויש לה אלפי תוספים להרחבה. בניגוד לפלטפורמות סגורות, אתם הבעלים המלאים של האתר.",
          },
          {
            question: "האם אוכל לנהל את האתר בעצמי?",
            answer: "בהחלט. זה אחד היתרונות הגדולים של וורדפרס. הממשק אינטואיטיבי ובעברית מלאה. תוכלו להוסיף עמודים, לערוך תכנים, להעלות תמונות ולפרסם מאמרים - בלי ידע טכני ובלי תלות במפתח.",
          },
          {
            question: "האם האתר יהיה שלי לחלוטין?",
            answer: "כן, 100%. אנחנו מעבירים לכם בעלות מלאה על הקוד, העיצוב והתכנים. אתם לא תלויים בנו ויכולים להעביר את האתר לכל שרת או ספק אחר בכל עת.",
          },
          {
            question: "מה ההבדל בין וורדפרס לבונים אוטומטיים כמו Wix?",
            answer: "וורדפרס מציע שליטה מלאה, גמישות בלתי מוגבלת, ובעלות מלאה על האתר. בונים אוטומטיים מוגבלים בהתאמה אישית, גובים מנוי חודשי, והאתר לא באמת שלכם. לעסק שרוצה לגדול - וורדפרס הוא הבחירה הנכונה.",
          },
        ],
      },
      {
        name: "תהליך ושירות",
        questions: [
          {
            question: "כמה זמן לוקח לבנות אתר וורדפרס?",
            answer: "אתר תדמית סטנדרטי - 2-3 שבועות. אתר עסקי מורכב יותר - 3-5 שבועות. חנות אונליין - 4-6 שבועות. לוחות הזמנים תלויים גם בזמינות שלכם לספק תכנים ולתת משוב.",
          },
          {
            question: "מה כולל תהליך בניית האתר?",
            answer: "התהליך כולל אפיון מלא של הצרכים שלכם, עיצוב מותאם אישית למותג, פיתוח מקצועי על וורדפרס, התאמה מלאה למובייל, תשתית SEO מובנית, העלאה לשרת, והדרכה מקיפה על מערכת הניהול.",
          },
          {
            question: "האם אתם מספקים תמיכה אחרי ההשקה?",
            answer: "כן. אנחנו מלווים אתכם גם אחרי שהאתר עולה לאוויר. תקבלו הדרכה מלאה על ניהול המערכת, ואנחנו זמינים לשאלות ותמיכה טכנית. אפשר גם לבחור בחבילת תחזוקה שוטפת לשקט נפשי מלא.",
          },
          {
            question: "איך מתחילים?",
            answer: "פשוט יוצרים איתנו קשר לשיחת היכרות קצרה. נבין את העסק והמטרות שלכם, נציג את הגישה שלנו, ונתאים פתרון שמתאים בדיוק לצרכים שלכם. השיחה ללא עלות וללא התחייבות.",
          },
        ],
      },
      {
        name: "טכני",
        questions: [
          {
            question: "האם וורדפרס בטוח?",
            answer: "כן, כשהוא מתוחזק נכון. אנחנו מתקינים תוספי אבטחה, מגדירים הרשאות נכונות ודואגים לגיבויים אוטומטיים. עדכונים שוטפים של המערכת והתוספים שומרים על האתר מוגן.",
          },
          {
            question: "האם האתר יהיה מהיר?",
            answer: "בהחלט. אנחנו משתמשים בתבניות קלות, מייעלים תמונות, מגדירים caching ובוחרים אחסון איכותי. התוצאה - אתר שנטען במהירות ומדורג טוב בגוגל.",
          },
          {
            question: "האם אפשר להוסיף חנות אונליין בעתיד?",
            answer: "כמובן. WooCommerce, התוסף המוביל לחנויות בוורדפרס, משתלב בצורה מושלמת. אפשר להוסיף חנות גם לאתר קיים, כולל סליקה ישראלית, משלוחים וניהול מלאי.",
          },
          {
            question: "מה קורה אם משהו נשבר?",
            answer: "אנחנו מציעים תמיכה טכנית שוטפת. אפשר לבחור בחבילת תחזוקה חודשית לשקט נפשי מלא, או לפנות אלינו לפי צורך. גיבויים אוטומטיים מבטיחים שאף מידע לא יאבד.",
          },
        ],
      },
    ],
  },

  // ============================================
  // TESTIMONIALS - Empty (not using)
  // ============================================
  testimonials: {
    title: "",
    subtitle: "",
    items: [],
  },

  // ============================================
  // CTA SECTION
  // ============================================
  cta: {
    title: "מוכנים לאתר וורדפרס מקצועי?",
    description: "ספרו לנו על העסק שלכם ונחזור עם הצעה מותאמת. שיחת ייעוץ ראשונית ללא עלות וללא התחייבות.",
    primaryCTA: {
      text: "לקבלת הצעת מחיר",
      href: "/contact#contact-form",
    },
    secondaryCTA: {
      text: "או התקשרו עכשיו",
      href: "tel:+972543456789",
    },
    features: [
      "עיצוב מותאם אישית",
      "ניהול עצמאי קל",
      "מהירות ו-SEO",
      "בעלות מלאה שלכם",
    ],
  },

  // ============================================
  // RELATED SERVICES (Bento Grid)
  // ============================================
  relatedServices: {
    title: "הרחיבו את האתר שלכם",
    subtitle: "שירותים משלימים לאתר הוורדפרס",
    items: [
      {
        name: "קידום אתרים",
        description: "SEO מותאם לוורדפרס",
        href: "/services/seo",
      },
      {
        name: "חנות WooCommerce",
        description: "מכירות אונליין בקלות",
        href: "/services/ecommerce",
      },
      {
        name: "אבטחת אתרים",
        description: "הגנה מפני פריצות ווירוסים",
        href: "/services/web-development/security",
      },
      {
        name: "תחזוקה שוטפת",
        description: "עדכונים, גיבויים ושקט נפשי",
        href: "/services/web-development/maintenance",
      },
      {
        name: "כתיבת תוכן",
        description: "תוכן שיווקי שמקדם ומוכר",
        href: "/services/content-marketing",
      },
      {
        name: "פרסום ממומן",
        description: "קמפיינים שמביאים תוצאות",
        href: "/services/digital-marketing/ppc",
      },
    ],
  },
};

export default wordpressWebsiteLandingPage;
