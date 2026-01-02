# NEXO Blog Article Rulebook

> A comprehensive guide for creating optimized, engaging, and consistent blog articles for the NEXO website in Hebrew.

---

## Table of Contents

1. [SEO & Technical Optimization](#part-1-seo--technical-optimization)
2. [AEO / LLM Optimization](#part-2-aeo--llm-optimization)
3. [Content Presentation & Display](#part-3-content-presentation--display)
4. [Article Structure & Templates](#part-4-article-structure--templates)
5. [Engaging & Human-Readable Writing](#part-5-engaging--human-readable-writing)
6. [Hebrew-Specific Guidelines](#part-6-hebrew-specific-guidelines)
7. [Credibility & Trust](#part-7-credibility--trust)
8. [Quick Reference Checklists](#part-8-quick-reference-checklists)

---

# Part 1: SEO & Technical Optimization

## 1.1 On-Page SEO Fundamentals

### Title Tags

| Rule | Requirement |
|------|-------------|
| Length | Under 60 characters |
| Keyword | Include primary keyword |
| Year | Add year for time-sensitive content (e.g., "2025") |
| Brand | End with " | NEXO AGENCY" |
| Format | `{Article Title} | NEXO AGENCY` |

**Example:**
```html
<title>למה עסקים שמשקיעים באוטומציה חכמה משיגים תשואה של 340% | NEXO AGENCY</title>
```

### Meta Descriptions

| Rule | Requirement |
|------|-------------|
| Length | Under 155 characters |
| Keyword | Include primary keyword naturally |
| Value | Clear value proposition |
| Action | Include call-to-action when appropriate |

**Example:**
```html
<meta name="description" content="עסקים עם אוטומציה חכמה משיגים 340% תשואה ב-18 חודשים. גלה למה 50% מהניסיונות העצמאיים נכשלים." />
```

### Heading Hierarchy

```
H1 (One per page - Main topic)
├── H2 (Major sections - 5-10 per 1,000 words)
│   ├── H3 (Subsections when adding clarity)
│   │   └── H4 (Further subdivision if needed)
│   └── H3
└── H2
```

**Rules:**
- One H1 per page (the article title)
- Never skip heading levels (no H1 → H3)
- Use keywords in headings naturally
- H2s for major sections
- H3s only when adding clarity to H2

### Keyword Optimization

| Placement | Requirement |
|-----------|-------------|
| First 100-150 words | Include primary keyword |
| Density | 0.5-2% (natural placement) |
| Headings | Include in 2-3 H2s |
| Alt text | Include in relevant images |
| URL slug | Include primary keyword |

**Do NOT:**
- Keyword stuff
- Force unnatural keyword placement
- Use exact-match keywords everywhere

---

## 1.2 Technical SEO for Articles

### Schema Markup (BlogPosting)

Every article must include BlogPosting JSON-LD schema:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title",
  "description": "Article excerpt/description",
  "image": "https://nexo.agency/images/article-image.jpg",
  "datePublished": "2025-01-01",
  "dateModified": "2025-01-01",
  "author": {
    "@type": "Organization",
    "name": "NEXO",
    "url": "https://nexo.agency"
  },
  "publisher": {
    "@type": "Organization",
    "name": "NEXO AGENCY",
    "logo": {
      "@type": "ImageObject",
      "url": "https://nexo.agency/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://nexo.agency/blog/article-slug"
  },
  "inLanguage": "he",
  "keywords": "keyword1, keyword2, keyword3"
}
```

### FAQ Schema (When Applicable)

For articles with FAQ sections:

```html
<section itemscope itemtype="https://schema.org/FAQPage">
  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">שאלה נפוצה?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">תשובה לשאלה...</p>
    </div>
  </div>
</section>
```

### Canonical URLs

```html
<link rel="canonical" href="https://nexo.agency/blog/article-slug" />
```

**Rules:**
- Always use absolute paths
- One canonical per page
- Self-referencing for original content

### URL Structure

| Rule | Example |
|------|---------|
| Length | Under 60 characters |
| Format | `/blog/article-slug` |
| Separators | Hyphens only (no underscores) |
| Case | Lowercase only |
| Keywords | Include primary keyword |

**Good:** `/blog/ai-automation-business-roi-2025`
**Bad:** `/blog/Article_About_AI_Automation_And_Business_ROI_Guide_2025`

---

## 1.3 Internal & External Linking

### Internal Links

| Rule | Requirement |
|------|-------------|
| Quantity | 3-5 internal links per 1,000 words |
| Anchor text | Descriptive (not "click here") |
| Relevance | Link to related content only |
| Distribution | Spread throughout article |

**Topic Clusters:**
- Link related articles together
- Create pillar content with supporting articles
- Eliminate orphan pages (pages with no internal links)

### External Links

| Rule | Requirement |
|------|-------------|
| Quantity | 2+ authoritative sources per article |
| Quality | Link to trusted, authoritative domains |
| Freshness | Prefer recent sources (within 2 years) |
| Attributes | `target="_blank" rel="noopener noreferrer"` |

**Example:**
```html
<a href="https://www.mckinsey.com/report" target="_blank" rel="noopener noreferrer">
  מקינזי דיווחו
</a>
```

---

## 1.4 Image SEO

### Alt Text

| Rule | Requirement |
|------|-------------|
| Length | Under 140 characters |
| Content | Concise, descriptive |
| Keywords | Include naturally when relevant |
| Purpose | Describe what the image shows |

**Good:** `alt="תרשים המציג ROI של אוטומציה עסקית לאורך 18 חודשים"`
**Bad:** `alt="image1.jpg"` or `alt=""`

### Image Attributes

```html
<img
  src="image.webp"
  alt="תיאור התמונה"
  width="800"
  height="500"
  loading="lazy"
  decoding="async"
/>
```

**Required attributes:**
- `src` - Image source
- `alt` - Alternative text
- `width` and `height` - Prevent CLS (Cumulative Layout Shift)
- `loading="lazy"` - For below-fold images

### Image Formats

| Priority | Format | Use Case |
|----------|--------|----------|
| 1 | AVIF | Best compression, modern browsers |
| 2 | WebP | Good compression, wide support |
| 3 | JPEG | Fallback for older browsers |

**Size target:** Under 200KB per image

---

## 1.5 Featured Snippet Optimization

### Question-Based Headers

Format H2s as questions to target featured snippets:

```html
<h2>מה זו אוטומציה עסקית חכמה?</h2>
```

### Direct Answer Pattern

After each question H2, provide a direct answer:

```html
<h2>מה זו אוטומציה עסקית חכמה?</h2>
<p class="direct-answer">
  <strong>אוטומציה עסקית חכמה היא שילוב של טכנולוגיית AI עם תהליכים עסקיים
  לביצוע משימות אוטומטיות ללא התערבות אנושית.</strong>
  המערכות לומדות ומשתפרות עם הזמן...
</p>
```

**Format:**
- Answer in 40-50 words immediately after H2
- Start with bold summary sentence
- Expand with details below

### Lists for Snippets

Use lists with 4-8 items for list-type featured snippets:

```html
<h2>מהם היתרונות של אוטומציה עסקית?</h2>
<ul>
  <li><strong>חיסכון בזמן:</strong> 8-20 שעות שבועיות</li>
  <li><strong>הפחתת טעויות:</strong> עד 90% פחות שגיאות</li>
  <li><strong>עלות-תועלת:</strong> ROI של 340% ב-18 חודשים</li>
  <li><strong>מדרגיות:</strong> גדילה ללא הגדלת כוח אדם</li>
</ul>
```

### Tables for Comparisons

Use tables for comparison queries:

```html
<h2>השוואה: אוטומציה פשוטה מול אוטומציה חכמה</h2>
<table>
  <thead>
    <tr>
      <th>קריטריון</th>
      <th>אוטומציה פשוטה</th>
      <th>אוטומציה חכמה</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>למידה</td>
      <td>לא לומדת</td>
      <td>לומדת ומשתפרת</td>
    </tr>
  </tbody>
</table>
```

---

## 1.6 E-E-A-T Signals

### Experience, Expertise, Authoritativeness, Trust

| Signal | Implementation |
|--------|----------------|
| Author bio | Include name, role, credentials |
| Publication date | Show clearly with proper format |
| Update date | Show `lastUpdated` when modified |
| Sources | Cite authoritative sources |
| HTTPS | Always use secure connection |
| Contact | Provide contact information |

### Author Information

```typescript
author: {
  name: "צוות NEXO",
  avatar: "/images/team/nexo-team.jpg",
  role: "אסטרטגיה דיגיטלית"
}
```

Display author section in article with:
- Author name
- Role/credentials
- Avatar (optional)

---

# Part 2: AEO / LLM Optimization

## 2.1 Understanding Answer Engine Optimization

### The Shift in Search

| Statistic | Impact |
|-----------|--------|
| 1 in 10 US users | Use AI for search first |
| 16% of Google searches | Include AI Overviews |
| 10%+ conversion rate | Highest of any channel |
| 65% of searches | Zero-click (projected 70% in 2025) |

### Why AEO Matters

Answer engines (ChatGPT, Perplexity, Google AI Overviews) don't just rank content - they **cite** and **quote** content. Optimizing for AEO ensures your content appears in AI-generated answers.

---

## 2.2 How LLMs Select Content

### Source Selection Patterns

| Platform | Preference |
|----------|------------|
| Perplexity | 3-8 sources, favors Reddit/YouTube |
| ChatGPT | Authoritative domains, recent content |
| Google AI | Established authority, structured content |

### Content Patterns LLMs Favor

| Pattern | Effectiveness |
|---------|---------------|
| Listicles | 50% of AI citations |
| Tables | 2.5x more likely to be cited |
| Question-Answer | Directly answerable queries |
| Long-form (2,000+ words) | 3x more citations |
| Recent content | 76% of ChatGPT citations within 30 days |

---

## 2.3 Content Patterns for AI

### Question-Answer Format

```html
<h2>שאלה שהקורא שואל?</h2>
<p>
  <strong>תשובה ישירה ב-40-75 מילים.</strong>
  פירוט נוסף והרחבה על התשובה...
</p>
```

### Structured Data Points

Include specific, citable statistics:

**Good:** "עסקים עם אוטומציה חכמה משיגים 340% תשואה ב-18 חודשים"
**Bad:** "עסקים רבים רואים שיפור משמעותי"

### Clear Hierarchical Structure

```
H1: Main Topic
├── H2: Question/Subtopic
│   ├── Direct answer paragraph
│   ├── Supporting details
│   └── H3: Sub-question (if needed)
└── H2: Next Question/Subtopic
```

---

## 2.4 Entity-Based Optimization

### Knowledge Graph Connection

- Use consistent brand terminology
- Include Person/Organization schema
- Link to authoritative profiles (LinkedIn, Google Business)
- Maintain consistent NAP (Name, Address, Phone) across platforms

### Schema Implementation

```json
{
  "@type": "Organization",
  "name": "NEXO AGENCY",
  "url": "https://nexo.agency",
  "logo": "https://nexo.agency/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/nexo-agency",
    "https://www.facebook.com/nexoagency"
  ]
}
```

---

## 2.5 Zero-Click Search Strategy

### Visibility Over Clicks

Since 65%+ of searches don't result in clicks:

1. **Brand mentions** - Be cited even without clicks
2. **Featured snippets** - Own the answer box
3. **Knowledge panels** - Build entity authority
4. **Multi-platform presence** - Reddit, YouTube, social

### Content That Gets Cited

| Content Type | Citation Rate |
|--------------|---------------|
| Definitive answers | High |
| Original statistics | Very High |
| Expert quotes | High |
| Unique frameworks | High |
| Comparison tables | Very High |

---

# Part 3: Content Presentation & Display

## 3.1 Paragraph & Text Structure

### Paragraph Rules

| Rule | Requirement |
|------|-------------|
| Sentences | 2-4 per paragraph |
| Words | 40-70 per paragraph max |
| Ideas | One idea per paragraph |
| Line length | 45-90 characters (50-75 optimal) |

### One Idea Per Paragraph

**Good:**
```
אוטומציה עסקית חכמה משנה את הדרך שבה עסקים פועלים.
היא מאפשרת ביצוע משימות חוזרות ללא התערבות אנושית.

היתרון המרכזי הוא חיסכון בזמן.
עובדים יכולים להתמקד במשימות אסטרטגיות במקום בעבודה שגרתית.
```

**Bad:**
```
אוטומציה עסקית חכמה משנה את הדרך שבה עסקים פועלים והיא מאפשרת
ביצוע משימות חוזרות ללא התערבות אנושית והיתרון המרכזי הוא חיסכון
בזמן ועובדים יכולים להתמקד במשימות אסטרטגיות במקום בעבודה שגרתית.
```

---

## 3.2 Lists & Formatting

### When to Use Bullets vs Numbers

| Use Bullets | Use Numbers |
|-------------|-------------|
| Equal items, no order | Sequences, steps |
| Features, benefits | Rankings |
| Examples | Processes |

### List Rules

- Maximum 6-8 items per list
- Parallel structure (all start same way)
- Consistent punctuation
- Bold key terms

**Example:**
```html
<ul>
  <li><strong>חיסכון בזמן:</strong> 8-20 שעות שבועיות</li>
  <li><strong>הפחתת טעויות:</strong> עד 90% פחות שגיאות</li>
  <li><strong>עלות-תועלת:</strong> ROI של 340%</li>
</ul>
```

---

## 3.3 Visual Elements

### White Space

White space reduces cognitive load and improves comprehension:

- Generous margins around sections
- Spacing between paragraphs
- Visual separation between elements

### Pull Quotes

Use for impactful statements:

```html
<blockquote class="pull-quote">
  "עסקים עם אוטומציה חכמה משיגים 340% תשואה ב-18 חודשים"
</blockquote>
```

### Callout Boxes

Use for important information:

```html
<div class="callout-box">
  <strong>נקודה חשובה:</strong>
  50% מהניסיונות העצמאיים להטמעת אוטומציה נכשלים בשנה הראשונה.
</div>
```

### Key Takeaways Box

Include at the start of long articles:

```html
<div class="key-takeaways">
  <h3>נקודות מפתח</h3>
  <ul>
    <li>ROI של 340% ב-18 חודשים</li>
    <li>50% מהניסיונות העצמאיים נכשלים</li>
    <li>8-20 שעות חיסכון שבועי לעובד</li>
  </ul>
</div>
```

---

## 3.4 Typography & Readability

### Font Sizes

| Element | Size |
|---------|------|
| Body text | 16px minimum |
| H1 | 32-48px |
| H2 | 24-32px |
| H3 | 20-24px |

### Line Height

- Body text: 1.5x font size
- Headlines: 1.2x font size

### Mobile Optimization

- 35-45 characters per line on mobile
- Touch-friendly buttons (min 44x44px)
- Readable without zooming

---

## 3.5 Scannable Content Patterns

### F-Pattern Reading

Users scan in an F-pattern:
- Top-left focus
- Horizontal scan at top
- Vertical scan down left side

**Optimize by:**
- Front-loading important words
- Using descriptive headings
- Bold key terms at start of paragraphs

### Inverted Pyramid

Most important information first:

1. Key message/answer
2. Supporting details
3. Background/context

### Core Sentence Technique

First sentence of each paragraph should standalone:

**Good:** "אוטומציה עסקית חכמה מפחיתה עלויות תפעוליות ב-30%."
**Bad:** "בנוסף לכל מה שציינו קודם, חשוב לזכור ש..."

---

# Part 4: Article Structure & Templates

## 4.1 Hook Writing (First 100 Words)

### The 10 Hook Techniques

| Technique | Example |
|-----------|---------|
| Question | "מה אם הייתם יכולים לחסוך 20 שעות בשבוע?" |
| Statistic | "340% תשואה. זה לא טעות דפוס." |
| In Medias Res | "השעה הייתה 3 בלילה כשהמנכ"ל קיבל את הטלפון..." |
| BAB Formula | "לפני: 60 שעות עבודה. אחרי: 20 שעות." |
| Bold Statement | "רוב העסקים מבזבזים 40% מזמן העובדים על משימות שמחשב יכול לעשות." |
| Story | "כשדני פתח את העסק שלו לפני 5 שנים..." |
| Quote | "'העתיד כבר כאן' - הסטטיסטיקות מוכיחות את זה." |
| Scene | "דמיינו משרד שבו אף עובד לא עושה עבודה שחוזרת על עצמה." |
| Promise | "בסוף המאמר הזה, תדעו בדיוק איך להכפיל את היעילות שלכם." |
| Conversational | "בואו נדבר על מה שכולם מפחדים להודות..." |

### Hook Rules

- Under 10 words for first sentence
- Create anticipation without revealing all
- Connect to reader's pain/desire
- Lead naturally into article content

---

## 4.2 Introduction Patterns

### PAS (Problem-Agitate-Solve)

```
Problem: "עסקים רבים מבזבזים שעות על משימות שחוזרות על עצמן."
Agitate: "כל שעה שמבוזבזת היא שעה שלא מושקעת בצמיחה."
Solve: "אוטומציה עסקית חכמה פותרת את הבעיה הזו."
```

### AIDA (Attention-Interest-Desire-Action)

```
Attention: "340% תשואה על השקעה."
Interest: "עסקים שהטמיעו אוטומציה חכמה רואים תוצאות מדהימות."
Desire: "תארו לעצמכם לחסוך 20 שעות בשבוע."
Action: "בואו נבין איך גם אתם יכולים להשיג את זה."
```

### Introduction Length

- 50-150 words
- Sets expectation for article
- Includes primary keyword

---

## 4.3 Body Structure Models

### Problem-Solution Structure

```
H2: הבעיה
  - תיאור הבעיה
  - השפעות

H2: הפתרון
  - תיאור הפתרון
  - יתרונות

H2: איך ליישם
  - שלבים
  - טיפים
```

### How-To Guide Structure

```
H2: מה נלמד
  - תוכן עניינים

H2: דרישות מוקדמות
  - מה צריך לפני שמתחילים

H2: שלב 1: [פעולה]
  - הסבר
  - דוגמה

H2: שלב 2: [פעולה]
  ...

H2: פתרון בעיות נפוצות
  - בעיה → פתרון
```

### Comparison Structure

```
H2: סקירה מהירה (טבלת השוואה)

H2: אופציה א' - סקירה מפורטת
  - יתרונות
  - חסרונות

H2: אופציה ב' - סקירה מפורטת
  - יתרונות
  - חסרונות

H2: השוואה ישירה

H2: המלצה סופית
```

---

## 4.4 Conclusion & CTA

### Conclusion Structure

1. Summarize key points (2-3 sentences)
2. Reinforce main message
3. One primary CTA

### CTA Rules

| Rule | Example |
|------|---------|
| One CTA per article | "צרו קשר לייעוץ חינם" |
| Action verbs | התחילו, הורידו, הצטרפו, קבלו |
| First-person | "התחל את המסע שלי" (not "התחל את המסע שלך") |
| Clear value | What reader gets |

### CTA Examples

```html
<div class="article-cta">
  <h3>מוכנים להתחיל?</h3>
  <p>צרו קשר לייעוץ חינם ונבנה יחד את האסטרטגיה שלכם.</p>
  <a href="/contact" class="cta-button">קבעו שיחת ייעוץ</a>
</div>
```

---

## 4.5 Table of Contents

For articles over 1,500 words, include a table of contents:

```html
<nav class="table-of-contents" aria-label="תוכן עניינים">
  <h2>תוכן עניינים</h2>
  <ul>
    <li><a href="#section-1">מה זו אוטומציה עסקית?</a></li>
    <li><a href="#section-2">למה להשקיע באוטומציה?</a></li>
    <li><a href="#section-3">איך מתחילים?</a></li>
  </ul>
</nav>
```

---

# Part 5: Engaging & Human-Readable Writing

## 5.1 Storytelling Techniques

### Micro-Stories

Include brief stories to illustrate points:

```
כשחברת הלוגיסטיקה "משלוחים מהירים" הטמיעה אוטומציה,
הם חסכו 15 שעות עבודה ביום. "לא האמנו לתוצאות,"
אמר המנכ"ל.
```

### The Five Hooks

| Hook | What It Triggers |
|------|------------------|
| Hope | "אפשר לשפר" |
| Help | "אני אלמד משהו" |
| Heart | "אני מזדהה" |
| Humor | "זה מבדר" |
| Healing | "זה יפתור את הבעיה שלי" |

---

## 5.2 Active Voice

### The 90% Rule

At least 90% of sentences should be in active voice.

| Passive (Bad) | Active (Good) |
|---------------|---------------|
| התהליך מבוצע על ידי המערכת | המערכת מבצעת את התהליך |
| הדוח נשלח לצוות | שלחנו את הדוח לצוות |
| הבעיה נפתרה | פתרנו את הבעיה |

### When Passive is OK

- Scientific contexts
- When agent is unknown/unimportant
- Legal/formal requirements

---

## 5.3 Emotional Engagement

### Power Words

| Category | Hebrew Examples |
|----------|-----------------|
| Urgency | עכשיו, מיידי, היום, מוגבל |
| Exclusivity | בלעדי, נדיר, מיוחד, רק לכם |
| Curiosity | סוד, נסתר, מפתיע, חדש |
| Value | חינם, חיסכון, ערך, משתלם |
| Action | גלו, התחילו, הצטרפו, קבלו |

### Curiosity Gap

Create information gaps that compel reading:

**Good:** "הטעות האחת שגורמת ל-50% מפרויקטי האוטומציה להיכשל"
**Bad:** "טיפים לאוטומציה מוצלחת"

---

## 5.4 Conversational Tone

### Techniques

| Technique | Example |
|-----------|---------|
| First/second person | אנחנו, אתם, שלכם |
| Rhetorical questions | "מכירים את ההרגשה?" |
| And/But starters | "אבל זה לא הכל." |
| Direct address | "בואו נדבר על..." |

### Avoid

- Jargon without explanation
- Overly formal language
- Corporate-speak
- Passive voice

---

## 5.5 Rhythm & Flow

### Vary Sentence Length

```
משפט קצר. משפט ארוך יותר שמרחיב את הרעיון ומוסיף פרטים חשובים.
עוד משפט קצר. ואז משפט בינוני שמקשר הכל יחד.
```

### Rule of Three

Use three items for emphasis:

"מהיר, יעיל, וחסכוני."
"חסכו זמן. חסכו כסף. חסכו כאב ראש."

### Read Aloud Test

Read your writing aloud. If you stumble, simplify.

---

# Part 6: Hebrew-Specific Guidelines

## 6.1 RTL Formatting

### HTML Attributes

```html
<html dir="rtl" lang="he">
```

### BiDi (Bidirectional) Handling

For mixed Hebrew/English:

```html
<p>המערכת תומכת ב-<span dir="ltr">API</span> מתקדם.</p>
```

### Mirror Layouts

| LTR Element | RTL Equivalent |
|-------------|----------------|
| Left arrow (←) for back | Right arrow (→) for back |
| `text-align: left` | `text-align: right` |
| `margin-left` | `margin-right` |
| `padding-left` | `padding-right` |

### Progress Bar Direction

```css
/* RTL progress bar */
.progress-bar {
  transform-origin: right;
}
```

---

## 6.2 Hebrew Writing Conventions

### Digital Text Rules

| Rule | Requirement |
|------|-------------|
| Script | Block print (not cursive) |
| Nikud | None (except children's content) |
| Emphasis | **Bold** (no italic/uppercase) |
| Quotation marks | " " (not « ») |

### Abbreviations

Use gershayim (״) for Hebrew abbreviations:

```
צה״ל
בע״מ
```

### Numbers

- Use Arabic numerals (7, not ז')
- Write numbers as numerals, not words
- Date format: day-month-year (1 בינואר 2025)

---

## 6.3 Hebrew SEO

### Market Statistics

| Statistic | Value |
|-----------|-------|
| Hebrew searches | 98% of Israeli searches |
| Google market share | 95%+ in Israel |
| Mobile searches | 85%+ |

### Keyword Research

- Hebrew is synonym-rich - research variations
- Consider keyboard layout errors
- Include English transliterations for tech terms

### Hebrew Headlines

| Rule | Example |
|------|---------|
| Numbers drive 15% more clicks | "7 דרכים לשפר את האתר" |
| Front-load keywords | "אוטומציה עסקית: המדריך המלא" |
| Power words | עכשיו, בלעדי, חדש, מוכח |

---

## 6.4 Cultural Nuances

### Communication Style

| Israeli Preference | Implementation |
|--------------------|----------------|
| Direct | Get to the point quickly |
| Authentic | Avoid over-the-top claims |
| Understated | Subtle > flashy |
| Witty | Tongue-in-cheek humor works |

### Calendar Awareness

- Avoid publishing on Shabbat (Friday evening - Saturday evening)
- Consider Jewish holidays
- Be sensitive to religious audiences

### Audience Diversity

| Segment | Consideration |
|---------|---------------|
| Secular | Modern, casual tone |
| Traditional | Respectful, balanced |
| Orthodox | More formal, modest |

---

## 6.5 Hebrew Readability

### Sentence Length

- Maximum 15-20 words per sentence
- Simple vocabulary over literary Hebrew
- Short paragraphs (2-4 sentences)

### Mobile-First

- 70%+ of Israeli internet access is mobile
- Generous white space
- Large touch targets

---

## 6.6 Formal vs Casual Register

### Blog/Marketing Content

Semi-casual register is appropriate:

**Too formal:** "הננו להודיע כי השירות החדש זמין כעת"
**Too casual:** "יאללה, הנה השירות החדש"
**Right:** "השירות החדש שלנו זמין עכשיו"

### When in Doubt

Start more formal and adjust based on audience response.

---

# Part 7: Credibility & Trust

## 7.1 Source Citation

### Citation Rules

| Rule | Requirement |
|------|-------------|
| Primary sources | Link to original research, not secondary |
| Freshness | Prefer sources within 2 years |
| Authority | Academic, government, industry leaders |
| Attribution | Name the source clearly |

### CRAAP Test

Evaluate sources by:
- **C**urrency: Is it recent?
- **R**elevance: Does it apply?
- **A**uthority: Is the source credible?
- **A**ccuracy: Is it factual?
- **P**urpose: What's the source's intent?

### Citation Format

```html
<p>
  לפי <a href="https://www.mckinsey.com/report" target="_blank" rel="noopener noreferrer">
  דוח מקינזי 2024</a>, עסקים שהטמיעו אוטומציה...
</p>
```

---

## 7.2 Expert Quotes

### Quote Rules

| Rule | Requirement |
|------|-------------|
| Quantity | 2-3 quotes per 1,000 words |
| Attribution | Include name and credentials |
| Formatting | Use pull quote styling |
| Relevance | Must support the point |

### Quote Format

```html
<blockquote class="expert-quote">
  <p>"ציטוט מומחה כאן..."</p>
  <cite>— שם המומחה, תפקיד, חברה</cite>
</blockquote>
```

---

## 7.3 Statistics & Data

### Rules for Statistics

| Rule | Requirement |
|------|-------------|
| Source | Always cite original research |
| Currency | Check date of study |
| Context | Provide comparison/meaning |
| Visualization | Use charts for complex data |

### Good vs Bad Statistics

**Good:** "340% תשואה על השקעה, לפי מחקר של מקינזי (2024)"
**Bad:** "תשואה גבוהה על השקעה"

---

## 7.4 Fact-Checking Process

### Before Publishing

1. Identify all claims in article
2. Find primary sources for each
3. Verify independently
4. Document methodology
5. Double-check AI-generated content

### Red Flags

- Statistics without sources
- Claims that seem too good
- Outdated information
- Secondary source citations

---

## 7.5 Author Bio

### Bio Requirements

| Element | Requirement |
|---------|-------------|
| Length | 100-200 words |
| Photo | Professional headshot |
| Name | Full name |
| Title | Current role |
| Credentials | Relevant expertise |
| Experience | Brief summary |
| Links | Professional profiles |

### Schema for Author

```json
{
  "@type": "Person",
  "name": "שם המחבר",
  "jobTitle": "תפקיד",
  "worksFor": {
    "@type": "Organization",
    "name": "NEXO AGENCY"
  },
  "sameAs": [
    "https://linkedin.com/in/author"
  ]
}
```

---

# Part 8: Quick Reference Checklists

## Pre-Writing Checklist

- [ ] Define target persona
- [ ] Research Hebrew keywords (primary + secondary)
- [ ] Plan article structure (outline)
- [ ] Identify 2+ authoritative sources
- [ ] Determine tone (semi-casual for blog)
- [ ] Check for existing related content (avoid cannibalization)

---

## Writing Checklist

### Content Quality
- [ ] Hook in first 10 words
- [ ] Active voice 90%+
- [ ] Varied sentence length
- [ ] Power words included
- [ ] Questions to engage
- [ ] Curiosity gaps created
- [ ] Stories/examples included

### Credibility
- [ ] Expert quotes (2-3 per 1,000 words)
- [ ] Statistics with sources
- [ ] All claims verified
- [ ] Primary sources linked

### Structure
- [ ] One H1 (article title)
- [ ] Logical H2/H3 hierarchy
- [ ] Question-based H2s where appropriate
- [ ] Direct answers after question H2s
- [ ] Table of contents (if 1,500+ words)
- [ ] Key takeaways box
- [ ] Clear conclusion with CTA

---

## Pre-Publishing Checklist

### Content
- [ ] Fact-check all claims
- [ ] Verify source credibility
- [ ] Read aloud test passed
- [ ] Headline effectiveness checked
- [ ] Author bio added

### Hebrew/RTL
- [ ] `dir="rtl" lang="he"` set
- [ ] RTL formatting correct
- [ ] Hebrew punctuation correct
- [ ] Navigation arrows mirrored

### Accessibility
- [ ] All images have alt text
- [ ] ARIA labels on interactive elements
- [ ] Color contrast 4.5:1 minimum
- [ ] Mobile responsive

---

## SEO Checklist

### On-Page SEO
- [ ] Title under 60 chars with keyword
- [ ] Meta description under 155 chars with keyword
- [ ] H1 with main keyword
- [ ] H2/H3 hierarchy correct
- [ ] Keyword in first 100-150 words
- [ ] Keyword density 0.5-2%

### Technical SEO
- [ ] BlogPosting JSON-LD schema added
- [ ] FAQ schema (if applicable)
- [ ] Canonical URL set
- [ ] Open Graph meta tags
- [ ] Twitter Card meta tags

### Links
- [ ] 3-5 internal links per 1,000 words
- [ ] 2+ external authoritative links
- [ ] No broken links
- [ ] All external links have `rel="noopener noreferrer"`

### Images
- [ ] Alt text on all images
- [ ] Width/height attributes set
- [ ] WebP format with fallbacks
- [ ] Under 200KB each
- [ ] Lazy loading on below-fold images

---

## AEO Checklist

- [ ] Question-based H2s for key queries
- [ ] Direct answers in 40-75 words
- [ ] Specific statistics (not vague claims)
- [ ] Comparison tables where relevant
- [ ] Lists with 4-8 items
- [ ] Long-form content (2,000+ words)
- [ ] Entity/brand consistency

---

## BlogPost Data Model

Every blog post must include:

```typescript
interface BlogPost {
  // Required
  id: string;                  // Unique identifier
  title: string;               // Article title (under 60 chars ideal)
  excerpt: string;             // Meta description (under 155 chars)
  content: string;             // Full HTML content
  category: string;            // Primary category
  readTime: number;            // Estimated read time in minutes
  image: string;               // Featured image URL
  slug: string;                // URL slug
  date: string;                // Publication date (Hebrew format)

  // Recommended
  featured?: boolean;          // Featured article flag
  lastUpdated?: string;        // Last modification date
  author?: {
    name: string;              // Author name
    avatar?: string;           // Author image URL
    role?: string;             // Author role/title
  };
  tags?: string[];             // Keywords/tags
}
```

---

## Article Scoring Rubric

### SEO Score (25 points)
| Criterion | Points |
|-----------|--------|
| Title optimization | 5 |
| Meta description | 5 |
| Heading structure | 5 |
| Schema markup | 5 |
| Internal/external links | 5 |

### AEO Score (25 points)
| Criterion | Points |
|-----------|--------|
| Question-answer format | 5 |
| Direct answers | 5 |
| Structured data | 5 |
| Citable statistics | 5 |
| Length/depth | 5 |

### Technical Score (25 points)
| Criterion | Points |
|-----------|--------|
| Accessibility | 5 |
| RTL formatting | 5 |
| Image optimization | 5 |
| Mobile responsive | 5 |
| Performance | 5 |

### Content Quality Score (25 points)
| Criterion | Points |
|-----------|--------|
| Writing quality | 5 |
| Engagement (hooks, stories) | 5 |
| Credibility (sources, quotes) | 5 |
| Structure/flow | 5 |
| Hebrew conventions | 5 |

**Target Score: 90+ / 100**

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2025 | Initial rulebook |

---

*This rulebook is a living document. Update as best practices evolve.*
