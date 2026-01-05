import { motion } from "framer-motion";
import { useMemo, memo } from "react";
import { Helmet } from "react-helmet-async";
import { Lightbulb, Eye, Heart, Sparkles, Ear, Users, RefreshCw, TrendingUp, Rocket, Target, Building2, BarChart3, ArrowLeft, Zap, Gauge, Fingerprint, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import GlassNavbar from "@/components/GlassNavbar";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import ShuffleHero from "@/components/ShuffleHero";
import StaggerValues from "@/components/ui/StaggerValues";

// Memoized animation configs
const VIEWPORT_ONCE = { once: true } as const;
const FADE_UP_INITIAL = { opacity: 0, y: 40 } as const;
const FADE_UP_ANIMATE = { opacity: 1, y: 0 } as const;

// BreadcrumbList JSON-LD Schema
const aboutBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": "https://nexo.agency/" },
    { "@type": "ListItem", "position": 2, "name": "אודות", "item": "https://nexo.agency/about" }
  ]
};

// Values data
const values = [
  {
    title: "תמיד צעד קדימה",
    desc: "אנחנו לא מחכים שהעתיד יגיע - אנחנו בונים אותו. בכל פרויקט, אנחנו שואלים את עצמנו: מה יהיה רלוונטי גם בעוד שנתיים?"
  },
  {
    title: "קלפים פתוחים",
    desc: "אין אצלנו הפתעות בחשבונית ואין שפה שרק מפתחים מבינים. אנחנו משתפים אתכם בכל החלטה ומסבירים כל בחירה."
  },
  {
    title: "הפרויקט שלכם, הלב שלנו",
    desc: "אנחנו לא ספקים - אנחנו שותפים. ההצלחה שלכם היא ההצלחה שלנו, ולכן אנחנו משקיעים בפרויקט כאילו הוא שלנו."
  },
  {
    title: "פשוט עובד",
    desc: "אפשר לדבר על חדשנות, אבל בסוף מה שחשוב זה תוצאות. אנחנו אובססיביים לפרטים הקטנים שעושים את ההבדל."
  },
  {
    title: "בזמן, לא במילים",
    desc: "דדליינים הם לא המלצה - הם הבטחה. כשאנחנו אומרים תאריך, אנחנו מתכוונים לזה. הזמן שלכם שווה כסף."
  },
  {
    title: "מספרים, לא סיפורים",
    desc: "אנחנו לא מאמינים ב\"הרגשה\" - אנחנו מאמינים בדאטה. כל החלטה נבחנת, כל שינוי נמדד, כל תוצאה מוכחת."
  },
  {
    title: "אין העתק הדבק",
    desc: "תבניות זה לעצלנים. כל פרויקט מתחיל מדף חלק, כי העסק שלכם הוא לא כמו כולם."
  },
  {
    title: "רעב להוכיח",
    desc: "אנחנו לא מסתמכים על הפרויקט הקודם - אנחנו רעבים להוכיח את עצמנו בכל פרויקט מחדש."
  },
];

// Process principles data
const principles = [
  {
    icon: Ear,
    title: "הקשבה לפני הכל",
    desc: "לפני שאנחנו מתחילים לעצב או לפתח, אנחנו מקשיבים. מבינים את העסק שלכם מבפנים, את האתגרים, את החלומות. רק מתוך הבנה עמוקה נולדים פתרונות אמיתיים."
  },
  {
    icon: Users,
    title: "שותפות אמיתית",
    desc: "אתם לא לקוחות, אתם שותפים. בכל שלב של הדרך אנחנו חושבים יחד, מקבלים החלטות יחד, וחוגגים הצלחות יחד. השקיפות המלאה שלנו היא לא סיסמה - היא הדרך שבה אנחנו עובדים."
  },
  {
    icon: RefreshCw,
    title: "גמישות יצירתית",
    desc: "התוכניות הכי טובות יודעות להשתנות. אנחנו מתאימים את עצמנו לכל פנייה בדרך, לכל תובנה חדשה, לכל הזדמנות שצצה. הגמישות שלנו היא הכוח שלכם."
  },
  {
    icon: TrendingUp,
    title: "תוצאות שמדברות",
    desc: "בסוף היום, מה שחשוב זה מה שקורה אצלכם בעסק. אנחנו מודדים הצלחה לא בשעות עבודה, אלא בצמיחה שלכם, בלידים שמגיעים, בלקוחות שחוזרים."
  },
];

// Ideal client profiles
const clientProfiles = [
  {
    icon: Rocket,
    title: "אתם מרגישים שהעסק שלכם שווה יותר",
    desc: "יש לכם תחושת בטן שאתם יכולים להגיע רחוק יותר. שהפוטנציאל שלכם גדול מהמציאות הנוכחית. אנחנו פה כדי לעזור לכם לממש את מה שאתם כבר יודעים בפנים."
  },
  {
    icon: Target,
    title: "אתם רוצים שותף, לא רק ספק",
    desc: "נמאס לכם מלהרגיש לבד במסע הזה. אתם מחפשים מישהו שבאמת יבין את החזון שלכם, יתלהב איתכם, וילווה אתכם צעד אחרי צעד."
  },
  {
    icon: Building2,
    title: "אתם מוכנים לשינוי",
    desc: "משהו בפנים אומר לכם שהגיע הזמן. אולי זה תחושה שאפשר יותר, אולי זו הרגשה שאתם יכולים להציג את עצמכם טוב יותר. אנחנו פה לעזור לכם לעשות את הצעד."
  },
  {
    icon: BarChart3,
    title: "אתם מאמינים שאפשר אחרת",
    desc: "יש בכם דחף לחדש, לשפר, להתקדם. אתם לא מקבלים את המציאות כמובנת מאליה. אנחנו מתחברים לאנרגיה הזו ויודעים איך להפוך אותה לתוצאות."
  },
];


// Memoized principle card
const PrincipleCard = memo(({ principle, index }: { principle: typeof principles[0]; index: number }) => {
  const transition = useMemo(() => ({ delay: index * 0.1 }), [index]);
  const IconComponent = principle.icon;

  return (
    <motion.div
      initial={FADE_UP_INITIAL}
      whileInView={FADE_UP_ANIMATE}
      viewport={VIEWPORT_ONCE}
      transition={transition}
      className="glass rounded-2xl p-6 sm:p-8"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{principle.title}</h3>
      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{principle.desc}</p>
    </motion.div>
  );
});
PrincipleCard.displayName = 'PrincipleCard';

// Memoized client profile card
const ClientProfileCard = memo(({ profile, index }: { profile: typeof clientProfiles[0]; index: number }) => {
  const transition = useMemo(() => ({ delay: index * 0.1 }), [index]);
  const IconComponent = profile.icon;

  return (
    <motion.div
      initial={FADE_UP_INITIAL}
      whileInView={FADE_UP_ANIMATE}
      viewport={VIEWPORT_ONCE}
      transition={transition}
      className="glass-dark rounded-2xl p-6 sm:p-8"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 sm:mb-6">
        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-hero-fg mb-2 sm:mb-3">{profile.title}</h3>
      <p className="text-sm sm:text-base text-hero-fg/70 leading-relaxed">{profile.desc}</p>
    </motion.div>
  );
});
ClientProfileCard.displayName = 'ClientProfileCard';


const About = () => {
  return (
    <>
      <Helmet>
        <title>אודות נקסו - הסיפור שלנו | NEXO AGENCY</title>
        <meta name="description" content="הכירו את הצוות שמאחורי נקסו. סוכנות דיגיטל עם חזון להוביל עסקים להצלחה דיגיטלית." />
        <link rel="canonical" href="https://nexo.agency/about" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="אודות נקסו - הסיפור שלנו" />
        <meta property="og:description" content="הכירו את הצוות שמאחורי נקסו. סוכנות דיגיטל עם חזון להוביל עסקים להצלחה דיגיטלית." />
        <meta property="og:url" content="https://nexo.agency/about" />
        <meta property="og:locale" content="he_IL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="אודות נקסו - הסיפור שלנו" />
        <meta name="twitter:description" content="הכירו את הצוות שמאחורי נקסו. סוכנות דיגיטל עם חזון להוביל עסקים להצלחה דיגיטלית." />
        <meta property="og:image" content="https://nexo.agency/og-image.jpg" />
        <meta name="twitter:image" content="https://nexo.agency/og-image.jpg" />
        <link rel="alternate" hreflang="he" href="https://nexo.agency/about" />
        <link rel="alternate" hreflang="x-default" href="https://nexo.agency/about" />
        <script type="application/ld+json">
          {JSON.stringify(aboutBreadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <CustomCursor />
        <GlassNavbar />

      <main id="main-content">
      {/* Screen-reader accessible H1 for SEO */}
      <h1 className="sr-only">אודות נקסו - סוכנות דיגיטל מובילה בישראל</h1>

      {/* Hero with Shuffle Grid */}
      <ShuffleHero />

      {/* Origin Story - למה הקמנו את NEXO */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={FADE_UP_INITIAL}
              whileInView={FADE_UP_ANIMATE}
              viewport={VIEWPORT_ONCE}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 sm:mb-10 md:mb-12"
            >
              למה הקמנו את NEXO
            </motion.h2>

            <motion.div
              initial={FADE_UP_INITIAL}
              whileInView={FADE_UP_ANIMATE}
              viewport={VIEWPORT_ONCE}
              transition={{ delay: 0.1 }}
              className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              <p className="text-foreground font-medium text-lg sm:text-xl md:text-2xl">
                כי ראינו יותר מדי עסקים מצליחים שנתקעו עם נוכחות דיגיטלית מהעשור הקודם.
              </p>

              <p>
                אתרים שנראים כמו 2010. מערכות שמצריכות עבודה ידנית על כל פעולה.
                תקציבי שיווק שנשרפים בלי לדעת מה עובד ומה לא.
              </p>

              <p>
                ראינו שוב ושוב אותו סיפור: בעל עסק משקיע את כל הלב במוצר או בשירות שלו,
                אבל הנוכחות הדיגיטלית שלו פשוט לא משקפת את האיכות האמיתית.
                הוא מגיע לפגישה עם סוכנות, מקבל אתר "סטנדרטי", ואחרי חצי שנה תוהה למה הטלפון לא מצלצל.
              </p>

              <p className="text-foreground font-bold text-lg sm:text-xl">
                זה לא יכול להמשיך ככה.
              </p>

              <p>
                הקמנו את NEXO כי האמנו שמגיע לכל עסק ישראלי נוכחות דיגיטלית שעובדת בשבילו - לא נגדו.
                לא עוד אתרים שנבנים ונשכחים. לא עוד "זה מה יש" ו"ככה כולם עושים".
              </p>

              <p className="text-foreground font-medium text-lg sm:text-xl md:text-2xl">
                אנחנו כאן כדי לבנות את הדור הבא של הדיגיטל הישראלי.
                <span className="text-primary"> אתרים שממירים, מותגים שזוכרים, ואסטרטגיה שמייצרת תוצאות אמיתיות.</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values - הערכים שלנו */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-hero-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={FADE_UP_INITIAL}
            whileInView={FADE_UP_ANIMATE}
            viewport={VIEWPORT_ONCE}
            className="max-w-3xl mb-6 sm:mb-8 text-center mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-hero-fg mb-4 sm:mb-6">
              הערכים שלנו
            </h2>
            <p className="text-hero-fg/70 text-base sm:text-lg md:text-xl leading-relaxed">
              אלה העקרונות שמנחים אותנו בכל פרויקט - המצפן שמוביל את הדרך שלנו.
              <br />
              <span className="text-hero-fg font-medium">לא סיסמאות על הקיר, אלא הדרך שבה אנחנו באמת עובדים.</span>
            </p>
          </motion.div>

          <StaggerValues values={values} />
        </div>
      </section>

      {/* How We Work - איך אנחנו עובדים */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={FADE_UP_INITIAL}
            whileInView={FADE_UP_ANIMATE}
            viewport={VIEWPORT_ONCE}
            className="max-w-3xl mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 sm:mb-6">
              איך אנחנו עובדים
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed">
              כל פרויקט הוא מסע משותף. אנחנו לא מאמינים בתבניות קבועות או בתהליכים נוקשים - אנחנו מאמינים בכם.
              בגישה שמתאימה את עצמה לצרכים שלכם, לקצב שלכם, ולחזון שלכם. זו לא עבודה מולכם, זו עבודה איתכם.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {principles.map((principle, index) => (
              <PrincipleCard key={principle.title} principle={principle} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Founders Message - דבר המייסדים */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={FADE_UP_INITIAL}
              whileInView={FADE_UP_ANIMATE}
              viewport={VIEWPORT_ONCE}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-8 sm:mb-10 md:mb-12"
            >
              דבר המייסדים
            </motion.h2>

            <motion.div
              initial={FADE_UP_INITIAL}
              whileInView={FADE_UP_ANIMATE}
              viewport={VIEWPORT_ONCE}
              transition={{ delay: 0.1 }}
              className="bg-hero-bg rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12"
            >
              <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-hero-fg/80 leading-relaxed">
                <p className="text-hero-fg font-bold text-xl sm:text-2xl md:text-3xl">
                  אנחנו לא פה כדי לבנות לכם אתר נוסף.
                </p>

                <p>
                  אנחנו פה כדי לשנות את הדרך שבה העסק שלכם מתקשר עם העולם הדיגיטלי.
                  כי בואו נודה באמת - רוב האתרים שנבנים היום? הם עדיין מתפקדים כאילו אנחנו ב-2010.
                  סליידרים מיושנים, חוויות משתמש שגורמות לאנשים לברוח, וקוד שמכביד על כל דבר.
                  זה לא מה שהעסק שלכם צריך, וזה בטח לא מה שהלקוחות שלכם מצפים לו.
                </p>

                <p className="text-hero-fg font-medium text-lg sm:text-xl md:text-2xl">
                  שאלו את עצמכם: האם הנוכחות הדיגיטלית שלכם באמת משקפת את הרמה שבה אתם פועלים?
                  או שהיא פשוט "מספיק טובה"?
                </p>

                <p>
                  אנחנו מאמינים ששקיפות מלאה היא לא סיסמה - היא הבסיס לכל שיתוף פעולה אמיתי.
                  בכל פרויקט אנחנו שותפים מלאים, לא ספקים שמעלימים פרטים.
                  כשאתם עובדים איתנו, אתם יודעים בדיוק מה קורה, למה, ומה התוצאות שאפשר לצפות להן.
                  בלי הפתעות, בלי שפה מקצועית שנועדה לבלבל.
                </p>

                <p>
                  אם אתם עסק שמסתפק ב"מספיק טוב" - כנראה שאנחנו לא המקום בשבילכם.
                  אבל אם אתם מחפשים שותף שיעזור לכם להוביל, לחדש, ולהפוך את הנוכחות הדיגיטלית שלכם
                  ליתרון תחרותי אמיתי - <span className="text-primary">בואו נדבר.</span> אנחנו פה בשבילכם.
                </p>

                <div className="pt-6 sm:pt-8 border-t border-hero-fg/10">
                  <p className="text-hero-fg font-bold text-lg sm:text-xl">בהצלחה,</p>
                  <p className="text-primary font-bold text-lg sm:text-xl">צוות NEXO</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ideal Clients - מרגישים שזה הזמן? */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={FADE_UP_INITIAL}
            whileInView={FADE_UP_ANIMATE}
            viewport={VIEWPORT_ONCE}
            className="max-w-3xl mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4 sm:mb-6">
              מרגישים שזה הזמן?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed">
              אנחנו מאמינים שכל עסק יכול לצמוח.
              <br />
              <span className="text-foreground font-medium">
                השאלה היא רק אם אתם מוכנים לעשות את הצעד - ואנחנו פה ללוות אתכם.
              </span>
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            {clientProfiles.map((profile, index) => (
              <ClientProfileCard key={profile.title} profile={profile} index={index} />
            ))}
          </div>

          <motion.div
            initial={FADE_UP_INITIAL}
            whileInView={FADE_UP_ANIMATE}
            viewport={VIEWPORT_ONCE}
            className="bg-hero-bg rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center"
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-hero-fg mb-3 sm:mb-4">
              אם קראתם את זה והרגשתם שמדברים עליכם - כנראה שאנחנו צריכים לדבר.
            </p>
            <p className="text-hero-fg/70 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
              לא שיחת מכירות, לא פגישת הדגמה - פשוט שיחה כנה על העסק שלכם ואיך אפשר לקחת אותו קדימה.
            </p>
            <Link
              to="/contact#contact-form"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-primary/90 transition-colors"
            >
              בואו נדבר
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
      </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
