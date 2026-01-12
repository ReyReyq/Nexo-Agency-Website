import { memo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import GlassNavbar from "@/components/GlassNavbar";
import Footer from "@/components/Footer";

const Privacy = memo(() => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "ינואר 2025";

  return (
    <>
      <Helmet>
        <html lang="he" dir="rtl" />
        <title>מדיניות פרטיות | NEXO Agency</title>
        <meta name="description" content="מדיניות הפרטיות של נקסו - איסוף מידע, שימוש בנתונים, עוגיות ואבטחת מידע. הגנה על הפרטיות שלך." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nexoagency.org/privacy" />
      </Helmet>

      <GlassNavbar />

      <main dir="rtl" lang="he" className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              מדיניות פרטיות
            </h1>
            <p className="text-muted-foreground mb-8">
              עודכן לאחרונה: {lastUpdated}
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">מבוא</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ברוכים הבאים למדיניות הפרטיות של NEXO Agency (להלן: "החברה", "אנחנו" או "נקסו").
                  אנו מכבדים את פרטיותך ומחויבים להגן על המידע האישי שלך. מדיניות זו מסבירה כיצד
                  אנו אוספים, משתמשים ומגנים על המידע שלך בעת השימוש באתר שלנו.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">מידע שאנו אוספים</h2>

                <h3 className="text-xl font-medium text-foreground mt-6 mb-3">מידע שאתה מספק לנו</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>פרטי קשר: שם, כתובת דוא"ל, מספר טלפון</li>
                  <li>פרטי עסק: שם החברה, תפקיד, תחום פעילות</li>
                  <li>תוכן הפניות: הודעות שנשלחות דרך טפסי יצירת קשר</li>
                  <li>העדפות תקשורת: הסכמה לקבלת עדכונים ודיוור</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mt-6 mb-3">מידע שנאסף באופן אוטומטי</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>נתוני גלישה: כתובת IP, סוג דפדפן, מערכת הפעלה</li>
                  <li>התנהגות באתר: דפים שנצפו, זמן שהייה, מקור ההגעה</li>
                  <li>נתוני מכשיר: סוג מכשיר, רזולוציית מסך</li>
                  <li>עוגיות ומזהים דומים (ראה פרק עוגיות למטה)</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">כיצד אנו משתמשים במידע</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>מתן שירותים: יצירת קשר, מענה לפניות, הצעות מחיר</li>
                  <li>שיפור האתר: ניתוח התנהגות משתמשים לשיפור חוויית המשתמש</li>
                  <li>שיווק: שליחת עדכונים ותוכן רלוונטי (בהסכמתך בלבד)</li>
                  <li>אבטחה: הגנה מפני הונאות ופעילות זדונית</li>
                  <li>עמידה בחוק: מילוי חובות חוקיות ורגולטוריות</li>
                </ul>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">עוגיות (Cookies)</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  האתר שלנו משתמש בעוגיות לשיפור חוויית הגלישה. עוגיות הן קבצי טקסט קטנים
                  שנשמרים במכשיר שלך.
                </p>

                <h3 className="text-xl font-medium text-foreground mt-6 mb-3">סוגי העוגיות שאנו משתמשים:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>עוגיות הכרחיות:</strong> נדרשות לתפקוד בסיסי של האתר</li>
                  <li><strong>עוגיות אנליטיקה:</strong> Google Analytics לניתוח תנועה באתר</li>
                  <li><strong>עוגיות שיווקיות:</strong> Microsoft Clarity להבנת התנהגות משתמשים</li>
                </ul>

                <p className="text-muted-foreground leading-relaxed mt-4">
                  ניתן לנהל את העדפות העוגיות דרך הגדרות הדפדפן שלך. חסימת עוגיות עשויה
                  להשפיע על תפקוד האתר.
                </p>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">שיתוף מידע עם צדדים שלישיים</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  איננו מוכרים את המידע האישי שלך. אנו עשויים לשתף מידע עם:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>ספקי שירות:</strong> חברות אחסון, ניתוח נתונים, דיוור</li>
                  <li><strong>שירותי אנליטיקה:</strong> Google Analytics, Microsoft Clarity</li>
                  <li><strong>רשויות חוק:</strong> כנדרש על פי חוק או צו בית משפט</li>
                </ul>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">אבטחת מידע</h2>
                <p className="text-muted-foreground leading-relaxed">
                  אנו נוקטים באמצעי אבטחה מקובלים להגנה על המידע שלך, כולל:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>הצפנת SSL/TLS לכל התקשורת באתר</li>
                  <li>אחסון מאובטח בשרתים מוגנים</li>
                  <li>הגבלת גישה למידע לעובדים מורשים בלבד</li>
                  <li>עדכוני אבטחה שוטפים</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">זכויותיך</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  בהתאם לחוק הגנת הפרטיות, עומדות לך הזכויות הבאות:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong>זכות עיון:</strong> לעיין במידע שנאסף עליך</li>
                  <li><strong>זכות תיקון:</strong> לבקש תיקון מידע שגוי</li>
                  <li><strong>זכות מחיקה:</strong> לבקש מחיקת המידע שלך</li>
                  <li><strong>זכות התנגדות:</strong> להתנגד לעיבוד מידע לשיווק ישיר</li>
                  <li><strong>זכות ניוד:</strong> לקבל את המידע שלך בפורמט נגיש</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  למימוש זכויותיך, ניתן לפנות אלינו בכתובת: sales@nexoagency.org
                </p>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">שמירת מידע</h2>
                <p className="text-muted-foreground leading-relaxed">
                  אנו שומרים את המידע שלך כל עוד הדבר נדרש למטרות שלשמן נאסף, או כנדרש
                  על פי חוק. לאחר מכן, המידע נמחק או מופך לאנונימי.
                </p>
              </section>

              {/* Children */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">קטינים</h2>
                <p className="text-muted-foreground leading-relaxed">
                  האתר שלנו אינו מיועד לאנשים מתחת לגיל 18. איננו אוספים ביודעין מידע
                  מקטינים. אם נודע לנו שאספנו מידע מקטין, נמחק אותו לאלתר.
                </p>
              </section>

              {/* Changes to Policy */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">שינויים במדיניות</h2>
                <p className="text-muted-foreground leading-relaxed">
                  אנו עשויים לעדכן מדיניות זו מעת לעת. שינויים מהותיים יפורסמו באתר
                  ויצוין תאריך העדכון האחרון בראש העמוד.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">יצירת קשר</h2>
                <p className="text-muted-foreground leading-relaxed">
                  לשאלות או בקשות בנוגע למדיניות הפרטיות, ניתן לפנות אלינו:
                </p>
                <ul className="list-none text-muted-foreground space-y-2 mt-4">
                  <li><strong>דוא"ל:</strong> sales@nexoagency.org</li>
                  <li><strong>טלפון:</strong> 053-362-2423</li>
                  <li><strong>כתובת:</strong> תל אביב, ישראל</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
});

Privacy.displayName = 'Privacy';

export default Privacy;
