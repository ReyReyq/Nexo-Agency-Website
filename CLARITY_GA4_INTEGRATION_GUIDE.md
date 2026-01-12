# Clarity and GA4 Integration Guide
## Comprehensive Strategy for Cross-Tool Analytics

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Connecting Clarity Sessions to GA4](#connecting-clarity-sessions-to-ga4)
3. [Custom Tags Implementation](#custom-tags-implementation)
4. [Quantitative-Qualitative Correlation](#quantitative-qualitative-correlation)
5. [Unified User Journey Analysis](#unified-user-journey-analysis)
6. [Best Practices for Cross-Tool Analysis](#best-practices-for-cross-tool-analysis)
7. [Common Issues & Solutions](#common-issues--solutions)

---

## Executive Summary

Microsoft Clarity and Google Analytics 4 are complementary tools that work best together:

- **GA4** answers "WHAT" - quantitative metrics, traffic sources, conversions, campaign performance
- **Clarity** answers "WHY" - qualitative insights, user behavior visualization, UX friction points

Together, they create a unified analytics system that identifies problems (GA4) and reveals root causes (Clarity).

### Key Metrics
- Native integration available with 24-48 hour data collection
- Clarity automatically creates custom GA4 dimension: "Clarity Playback URL"
- Expected data discrepancies: 60-75% difference between tools (due to different session definitions, time zones)
- Maximum 128 custom tags per page in Clarity

---

## Connecting Clarity Sessions to GA4

### Step 1: Enable Native Integration in Clarity

1. Log into [clarity.microsoft.com](https://clarity.microsoft.com)
2. Navigate to **Settings** → **GA Integration**
3. Click **Get Started** (under Google Analytics integration section)
4. Sign in with your Google account
5. Select your GA4 property from the list
6. Click **Save**

**Wait 24-48 hours** for data synchronization before analyzing.

### Step 2: Required GA4 Information

You'll need to provide four pieces of information:

| ID Type | Location | Format |
|---------|----------|--------|
| **Account ID** | GA4 Admin > Account Settings | Numeric (e.g., 123456789) |
| **Property ID** | GA4 Admin > Property Settings | Numeric (e.g., 987654321) |
| **Measurement ID** | GA4 Admin > Data Streams | G-XXXXXXXXXX format |
| **Friendly Name** | Your site name | Any label you choose |

#### How to Find Each ID

**Account ID:**
- Google Analytics → Admin (bottom-left) → Account Settings → Copy Account ID

**Property ID:**
- Google Analytics → Admin → Property column → Property Settings → Copy Property ID

**Measurement ID:**
- Google Analytics → Admin → Property column → Data Streams → Select Web data stream → Copy "G-" ID from upper right

### Step 3: Verify Integration Success

Once integrated:
- Go to **GA4 Admin** → Property → **Custom Definitions** → **Custom Dimensions**
- You should see a custom dimension named **"Clarity Playback URL"**
- This dimension links GA4 metrics directly to Clarity recordings

### Step 4: Access Clarity Data in GA4

In GA4, you can now:
- Click on Clarity Playback URL dimension values in reports
- Jump directly to corresponding session recordings in Clarity
- View audience data synced from Clarity
- Access: Audience overview, Acquisition report, Popular pages, Sessions by country, Sessions by device

---

## Custom Tags Implementation

### What Are Custom Tags?

Custom tags are key-value pairs that segment and filter recordings by custom data. They enable advanced segmentation impossible with native page dimensions.

### Basic Implementation

#### Syntax
```javascript
clarity("set", "key", "value");
```

#### Example
```javascript
clarity("set", "user_type", "premium_subscriber");
clarity("set", "page_section", "checkout");
clarity("set", "error_type", "form_validation_failed");
```

### Implementation Methods

#### Method 1: Hard-Coded (All Pages)
Add directly to your HTML before closing `</script>` tag:
```html
<script>
    (function(c,l,a,r,i,t,y){
        c[_cl_insightslib]=c[_cl_insightslib]||{queue:[],config:{token:"YOUR_TOKEN"}};
        var r=l.createElement('script');
        r.async=1;r.src='https://clip.clarity.ms/tag/v(i)';
        r.onload=function(){clarity('set', 'user_type', 'premium')};
        l.head.appendChild(r);
    })(window, document);
</script>
```

#### Method 2: Google Tag Manager
1. Create new **Custom HTML tag** in GTM
2. Add the clarity set command:
```javascript
<script>
  clarity("set", "purchase_status", "completed");
</script>
```
3. Set trigger: **All Pages** or **Custom Event** trigger
4. Deploy and wait 30 minutes to 2 hours for data appearance

#### Method 3: Dynamic via Page Events
```javascript
// Set tag on button click
document.querySelector('#subscribe-btn').addEventListener('click', function() {
    clarity("set", "subscription_status", "initiated");
});

// Set tag on form completion
document.querySelector('#form').addEventListener('submit', function() {
    clarity("set", "form_completed", "true");
});
```

### Recommended Custom Tags for Unified Analysis

**Tier 1 - Essential (Always Include):**
```javascript
clarity("set", "user_id", "USER_123456");           // Unique identifier
clarity("set", "session_id", "SESSION_ABC789");     // Match GA4 session
clarity("set", "conversion_status", "completed");   // Funnel tracking
clarity("set", "device_type", "desktop");           // Device segmentation
```

**Tier 2 - Business Critical:**
```javascript
clarity("set", "page_type", "product");             // Content category
clarity("set", "user_segment", "high_value");       // Customer segment
clarity("set", "error_occurred", "false");          // Error tracking
clarity("set", "form_type", "checkout");            // Form identification
```

**Tier 3 - Advanced Analysis:**
```javascript
clarity("set", "utm_campaign", "spring_sale_2026");  // Campaign tracking
clarity("set", "feature_flags", "new_ui_v2");        // A/B test variants
clarity("set", "page_section", "hero");              // Micro-section tracking
clarity("set", "interaction_type", "button_click");  // Behavior classification
```

### Custom Tag Constraints & Best Practices

| Constraint | Limit | Impact |
|-----------|-------|--------|
| **Key+Value Length** | 255 characters max | Keep tags concise |
| **Tags Per Page** | 128 maximum | Prioritize most important tags |
| **Update Latency** | 30 min - 2 hours | Don't expect real-time filtering |
| **Retroactivity** | Not retroactive | Data collected only after tag creation |
| **Character Types** | Alphanumeric + spaces | Use readable, descriptive values |

### Naming Conventions for Cross-Tool Consistency

Maintain naming consistency between Clarity tags and GA4 custom dimensions:

```javascript
// Clarity Custom Tag
clarity("set", "user_type", "premium");

// GA4 Custom Dimension (should match)
gtag('event', 'page_view', {
  'user_type': 'premium'  // Same naming convention
});
```

### Verification: Confirm Tags Are Working

1. Go to Clarity → Your Project → **Filters**
2. Set timeframe to **Today**
3. Click **Custom Filters**
4. Select your custom tag name from dropdown
5. You should see values within 30 min - 2 hours of implementation

---

## Quantitative-Qualitative Correlation

### The Analytical Framework

Use GA4 to identify problems, then Clarity to diagnose root causes:

```
GA4 Metric Analysis → Identify Anomaly → Clarity Deep Dive → Root Cause Found → Optimization
```

### Step 1: GA4 Quantitative Analysis

**Identify problem areas using GA4 metrics:**

| Metric | What to Look For | Tool |
|--------|-----------------|------|
| Bounce Rate | Pages >60% bounce | GA4 Engagement report |
| Conversion Rate | Drop in funnel steps | GA4 Conversion Funnel |
| Session Duration | Abnormal time patterns | GA4 Engagement report |
| Click-Through Rate | Low engagement elements | GA4 Events report |
| Form Completion | Abandoned forms | GA4 Conversion events |

**Example GA4 Analysis:**
- Checkout funnel shows 45% abandonment at payment step
- This is 20% above baseline
- Issue identified: specific conversion funnel step

### Step 2: Clarity Qualitative Diagnosis

**Use Clarity to understand WHY the metric changed:**

1. **Filter to Problem Segment**
   - In Clarity, filter recordings by: `page_type == "checkout"` AND `form_completed == "false"`
   - This isolates users who abandoned

2. **Watch Session Recordings**
   - Observe: What clicks do users attempt?
   - Watch: Where does scrolling stop?
   - Identify: Error messages or blocking issues?

3. **Review Heatmaps**
   - Click Heatmap: Where are users clicking? (vs. where CTAs are)
   - Scroll Heatmap: How far down do users scroll?
   - Deadclick Heatmap: Where are frustration clicks occurring?

4. **Analyze Behavioral Patterns**
   - Rage clicks: Repeated clicks on non-functional elements
   - Dead clicks: Clicks on non-clickable elements
   - Session replays: Full user behavior playback

**Example Clarity Finding:**
- Recordings show users repeatedly clicking "Payment Details" field
- Heatmap reveals 80% rage-click concentration on ZIP code field
- Root cause: ZIP field has validation error but error message is hidden

### Step 3: Correlation Analysis Process

**Create correlation matrix:**

| GA4 Finding | Clarity Insight | Correlation | Action |
|-------------|-----------------|-------------|--------|
| 45% checkout abandonment | ZIP field validation error | High correlation | Fix validation error messaging |
| High bounce on blog | Users scroll past hero without reading | High correlation | Improve hero section design |
| Low form completion | Form has 15+ fields | High correlation | Reduce form fields to 5-7 |
| High session duration | Users re-scroll pages repeatedly | High correlation | Improve page organization/search |

### Advanced Correlation Techniques

#### Technique 1: Funnel Analysis with Recordings
```
GA4 Funnel: View Product → Add to Cart → Checkout → Payment
        ↓
Clarity Playback URL dimension
        ↓
Click link in GA4 → Watch actual recordings at each funnel step
        ↓
Observe: Rage clicks, dead clicks, errors → Identify blockers
```

#### Technique 2: Segment-Based Analysis
1. Create GA4 segment: "High-value users"
2. Note their session IDs in GA4
3. Filter Clarity by same session IDs (via custom tags)
4. Compare behavior patterns: How do high-value users differ?

#### Technique 3: Time-Based Correlation
```
GA4: Bounce rate spike on Tuesday 2-3 PM
        ↓
Clarity: Filter recordings to Tuesday 2-3 PM
        ↓
Find: All users encountering same error → Identify root cause
```

---

## Unified User Journey Analysis

### Building End-to-End User Journeys

A unified journey combines GA4's quantitative pathway data with Clarity's qualitative session details.

### Journey Architecture

```
Traffic Source (GA4) → Pages Visited (GA4) → Actions Taken (GA4)
                              ↓
                      Behavior Details (Clarity)
                      - Mouse movements
                      - Click patterns
                      - Scroll depth
                      - Form interactions
                              ↓
                      Conversion/Abandonment (GA4)
```

### Implementation Steps

#### Step 1: Map Quantitative Journey in GA4

**Using GA4 Path Exploration:**
1. Go to **Explore** → **Path Exploration** report
2. Select **Starting Point**: landing page
3. Select **Ending Point**: conversion page
4. GA4 shows: common paths users take from start to end
5. Identify: bottleneck steps where users drop off

**Example Path:**
```
Homepage (100%)
  → Services Page (85%)
    → Service Detail (72%)
      → Contact Form (45%)
        → Form Submitted (18%)
```

This shows: major drop-off between Form View and Submission.

#### Step 2: Combine with Clarity Session Details

**For each major drop-off, create Clarity analysis:**

1. Filter Clarity: `page_type == "contact_form"` AND `form_completed == "false"`
2. Watch 5-10 session recordings
3. Document observed patterns:
   - Do users see all form fields?
   - Where do they stop scrolling?
   - What errors appear?
   - How long do they stay on the page?

#### Step 3: Build Unified Journey Segments

**Create cross-tool segments for repeatable analysis:**

**Segment: "High-Intent Users"**
```
GA4 Definition:
  - Source: Organic (not paid)
  - Engagement: >2 minutes
  - Pages visited: 3+
  - Conversion: Yes

Clarity Definition (matching):
  - Custom tag: user_intent = "high"
  - Session recordings: Watch to understand decision-making
  - Heatmaps: See where high-intent users click
```

**Segment: "Mobile Abandoners"**
```
GA4 Definition:
  - Device: Mobile
  - Conversion: No
  - Form engagement: Yes (clicked form)
  - Duration: <30 seconds

Clarity Definition:
  - Custom tag: device_type = "mobile"
  - Session recordings: Identify mobile-specific usability issues
  - Heatmap: See if mobile layout causes confusion
```

### Multi-Device Journey Tracking

GA4 can stitch journeys across devices using User-ID (for logged-in users):

```
Day 1: Research on Mobile
  - Homepage → Services → Product page
  - Session duration: 8 minutes
  - No conversion

Day 2: Purchase on Desktop (same user)
  - Homepage → Services → Checkout → Purchase
  - Session duration: 12 minutes
  - Conversion: Yes

GA4 User Journey: Connects both sessions via User-ID
Clarity Analysis: Can show recordings from both device sessions
```

**Implementation for Multi-Device:**
1. Implement GA4 User-ID for logged-in users
2. Pass same identifier to Clarity via custom tag:
   ```javascript
   clarity("set", "user_id", userLoginID);
   ```
3. GA4 and Clarity now share same user reference

### Customer Journey Template

| Journey Phase | GA4 Metrics | Clarity Insights | Action Trigger |
|---------------|-------------|------------------|----------------|
| **Awareness** | Traffic source, Sessions | User entry point behavior, first scroll depth | Low engagement = poor hero |
| **Consideration** | Page views, Time on page | Content interaction, scrolling patterns | Low consideration = unclear value prop |
| **Decision** | Form interactions, CTA clicks | Form field struggles, rage clicks | High abandonment = fix friction |
| **Conversion** | Conversion rate, purchase value | Post-purchase behavior, confirmation clarity | Low conversion = streamline flow |
| **Retention** | Return rate, repeat purchases | User behavior changes, feature adoption | Low retention = poor onboarding |

---

## Best Practices for Cross-Tool Analysis

### Practice 1: Reconcile Data Discrepancies

**Why discrepancies exist:**

| Factor | GA4 | Clarity |
|--------|-----|---------|
| **Time Zone** | User's local timezone | UTC |
| **Session Definition** | 30 min inactivity OR midnight | 30 min inactivity only |
| **Bot Filtering** | Advanced bot filtering | Limited bot filtering |
| **Data Processing** | 24-48 hour delay | Real-time (mostly) |
| **User Identification** | Client ID based | Site-specific |

**Expected discrepancies:** 60-75% difference in session counts, 75%+ difference in user counts

**Reconciliation approach:**
1. Accept that small differences are normal
2. Focus on trend correlation, not absolute numbers
3. When comparing, use same date ranges in both tools
4. Account for time zone offsets
5. Compare percentage changes rather than absolute values

### Practice 2: Establish Analysis Workflow

**Repeatable process for decision-making:**

```
Step 1: GA4 Investigation (5 minutes)
  - Review key metrics dashboard
  - Identify anomalies or trends
  - Segment by dimension (device, traffic source, etc.)

Step 2: Hypothesis Formation (3 minutes)
  - "Why did bounce rate increase?"
  - "Which page is problematic?"
  - "Which segment is affected?"

Step 3: Clarity Verification (15 minutes)
  - Apply filters matching GA4 segment
  - Watch 5-10 representative sessions
  - Look for common patterns

Step 4: Root Cause Identification (5 minutes)
  - Technical issue? (Error messages, broken elements)
  - UX issue? (Confusing layout, unclear CTAs)
  - Content issue? (Irrelevant to user intent)

Step 5: Recommendation (2 minutes)
  - Prioritize by impact (GA4 metrics)
  - Design fix based on Clarity insights
  - Test hypothesis with changes
```

### Practice 3: Custom Tag Strategy

**Implement in phases:**

**Phase 1 (Week 1): Foundation Tags**
- User identification
- Page type/section
- Conversion status
- Device type

**Phase 2 (Week 3): Business Logic Tags**
- User segment (new, returning, VIP)
- Form type and status
- Error tracking
- Feature flags

**Phase 3 (Week 5): Advanced Tags**
- UTM parameters (for GA4 correlation)
- Session ID (for cross-tool matching)
- A/B test variant
- Custom business events

**Review & refine monthly** - remove unused tags, add high-impact ones

### Practice 4: Create Shared Dashboards

**In Looker Studio, combine GA4 and Clarity data:**

```
Dashboard: "User Experience & Performance"

Row 1: GA4 KPIs
  - Sessions, bounce rate, conversion rate, revenue
  - Metric cards with trend indicators

Row 2: Clarity UX Insights
  - Rage click count, dead click %, session recordings
  - Link to Clarity interface

Row 3: Correlation Analysis
  - GA4 metric vs. Clarity issue (side by side)
  - Trend charts showing correlation
```

### Practice 5: Implement Feedback Loops

**Continuous improvement cycle:**

```
Week 1: Identify issue (GA4)
Week 2: Diagnose root cause (Clarity)
Week 3: Implement fix
Week 4: Monitor GA4 metric improvement
Week 5: Confirm with Clarity (reduced rage clicks, etc.)
Week 6: Document learnings, update processes
```

### Practice 6: Establish Naming Conventions

**Consistency across tools:**

```
GA4 Custom Dimensions:
  - user_type
  - page_section
  - error_type
  - conversion_status

Clarity Custom Tags (matching):
  - user_type
  - page_section
  - error_type
  - conversion_status

Code Implementation (both):
  - Always use snake_case
  - Use descriptive names (avoid abbreviations)
  - Document all custom dimensions in one shared doc
  - Update doc before implementing new tags
```

---

## Common Issues & Solutions

### Issue 1: Data Discrepancies (GA4 shows 40% more sessions)

**Causes:**
- Time zone differences (Clarity UTC, GA4 local)
- Session definition differences
- Bot filtering settings

**Solution:**
1. Use same time zone in GA4 (set to UTC to match Clarity)
2. Accept ±20% variance as normal
3. Compare percentage trends, not absolute numbers
4. If comparing by date, subtract 1 day from GA4 due to processing delay

---

### Issue 2: Clarity Playback URL Not Appearing in GA4

**Causes:**
- Integration not fully synced (needs 24-48 hours)
- Custom Dimensions not visible in default reports

**Solution:**
1. Wait full 48 hours after enabling integration
2. Go to GA4 Admin → Custom Definitions → Custom Dimensions
3. Confirm "Clarity Playback URL" dimension exists
4. In reports, manually add "Clarity Playback URL" dimension
5. Run custom report: Dimensions = page, Metrics = sessions

---

### Issue 3: Custom Tags Not Appearing in Clarity Filters

**Causes:**
- Tags not yet processed (30 min - 2 hours latency)
- Tag syntax error in code
- Tag limit reached (128 per page)

**Solution:**
1. Wait 2 hours after implementation
2. Check syntax: `clarity("set", "key", "value");` (exact format)
3. Verify in browser console: Open DevTools → Console
4. Enter: `clarity("set", "test_tag", "test_value");`
5. Refresh page, check Clarity Filters after 30 minutes
6. Count current tags; if >120, remove unused ones

---

### Issue 4: GA4 Segments Not Working with Clarity Integration

**Causes:**
- Clarity doesn't natively support GA4 segments
- Limitation of current integration

**Solution:**
1. Create custom GA4 dimensions instead of segments
2. Pass dimension values to Clarity via custom tags:
   ```javascript
   clarity("set", "is_high_value", "true");
   ```
3. Filter Clarity recordings by custom tag instead
4. Use custom event-based analysis in GA4

---

### Issue 5: Session ID Mismatch Between Tools

**Causes:**
- Different session definitions
- GA4 session ID not accessible via standard methods

**Solution:**
1. Extract GA4 session ID from BigQuery:
   ```sql
   SELECT event_timestamp, user_pseudo_id, (SELECT value.string_value
     FROM UNNEST(event_params) WHERE key = 'ga_session_id') as session_id
   FROM `project.dataset.events_*`
   ```
2. Pass to Clarity custom tag:
   ```javascript
   clarity("set", "ga_session_id", retrievedSessionId);
   ```
3. This allows manual session matching between tools

---

### Issue 6: High Cardinality Error (Playback URLs not syncing to GA4)

**Causes:**
- GA4 blocks high-cardinality data (too many unique values)
- Clarity Playback URLs create billions of unique values

**Solution:**
1. This is a known limitation - Clarity cannot send playback URLs as GA4 dimension
2. Workaround: Use Clarity's native integration link instead
   - View GA4 reports → Click Clarity Playback URL dimension
   - This redirects to Clarity with matching recordings
3. Alternative: Create curated list of important sessions in Clarity
   - Save favorite recordings
   - Tag with GA4 event type
   - Manual correlation instead of automated

---

### Issue 7: Tools Show Contradictory Insights

**Causes:**
- Different sampling rates
- Different user identification methods
- Measurement timing differences

**Solution:**
1. Verify data collection method:
   - GA4: Does it have UTM parameters?
   - Clarity: Are custom tags properly set?
2. Check time range:
   - GA4: Look at past 24 hours
   - Clarity: Check same hours in UTC
3. Segment both tools identically:
   - GA4: Apply user segment
   - Clarity: Apply matching custom tag filter
4. If still contradictory:
   - Trust Clarity for user behavior (it's visual)
   - Trust GA4 for trends (it's statistical)
   - Find complementary insights rather than exact match

---

## Integration Checklist

Use this checklist to ensure proper implementation:

### Pre-Integration Setup
- [ ] GA4 account created and properly configured
- [ ] Clarity project created and tracking code installed
- [ ] Both tools receiving data for at least 24 hours
- [ ] Identified key metrics to correlate
- [ ] Defined custom dimensions needed

### Integration Steps
- [ ] GA4 Property ID, Account ID, Measurement ID documented
- [ ] Clarity-GA4 integration enabled via clarity.microsoft.com
- [ ] Waited 24-48 hours for data sync
- [ ] Verified "Clarity Playback URL" dimension in GA4
- [ ] Tested: Click Clarity Playback URL in GA4 report
- [ ] Confirmed: Linked to correct Clarity session

### Custom Tag Implementation
- [ ] Defined tier 1 essential tags (5-7 tags)
- [ ] Implemented tags in code/GTM
- [ ] Tested tags in Clarity Filters (after 2 hours)
- [ ] Documented all tags in shared spreadsheet
- [ ] Created naming convention doc
- [ ] Scheduled monthly review of tag usage

### Analysis Setup
- [ ] Created GA4 custom dashboard for key metrics
- [ ] Set up Clarity filters for key segments
- [ ] Documented analysis workflow (5-step process)
- [ ] Created Looker Studio dashboard combining both tools
- [ ] Scheduled weekly correlation review meetings
- [ ] Identified first analysis project (priority issue)

### Ongoing Operations
- [ ] Weekly metric reviews (GA4 anomaly detection)
- [ ] Biweekly Clarity session deep dives
- [ ] Monthly root cause analysis reports
- [ ] Quarterly strategy review and optimization
- [ ] Continuous tag optimization (add/remove/modify)

---

## Recommended Tools & Templates

### Google Tag Manager Setup
For easier custom tag implementation, use GTM custom HTML tags:
```html
<script>
  // Set multiple tags at once
  var tagConfig = {
    'user_type': 'premium',
    'page_section': 'checkout',
    'conversion_status': 'in_progress'
  };

  for (var key in tagConfig) {
    clarity("set", key, tagConfig[key]);
  }
</script>
```

### Looker Studio Custom Report
Query structure for combined analysis:
```
Dimensions: Date, Page Path, Device Category, Clarity Playback URL
Metrics: Sessions, Bounce Rate, Conversion Rate
Filter: Date = Last 30 days
Order By: Sessions (descending)
```

### Session ID Tracking Script
For manual GA4-Clarity session matching:
```javascript
// Get GA4 session ID and pass to Clarity
gtag('get', 'session_id', function(sessionId) {
  clarity("set", "ga_session_id", sessionId);
});
```

---

## Key Takeaways

1. **Complement, Don't Replace**: Use both tools together - GA4 for quantitative, Clarity for qualitative

2. **Custom Tags Are Powerful**: Implement 15-20 well-chosen tags for segmentation capability

3. **Expect Data Discrepancies**: 60-75% differences are normal due to different session definitions

4. **Follow the Workflow**: GA4 identifies issues → Clarity diagnoses causes → Action taken

5. **Shared Identifiers Matter**: Use consistent session IDs, user IDs, and naming conventions across tools

6. **Start Simple**: Begin with basic integration, add complexity gradually as team capabilities grow

7. **Document Everything**: Maintain clear documentation of all custom dimensions and tags

8. **Review Regularly**: Weekly GA4 checks, biweekly Clarity deep dives, monthly correlation analysis

---

## Resources & Documentation

- [Microsoft Clarity GA4 Integration Guide](https://learn.microsoft.com/en-us/clarity/ga-integration/ga4-integration)
- [Microsoft Clarity Custom Tags](https://learn.microsoft.com/en-us/clarity/filters/custom-tags)
- [GA4 Custom Dimensions Setup](https://support.google.com/analytics/answer/10075209)
- [Clarity API Documentation](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api)
- [GA4 BigQuery Export Guide](https://support.google.com/analytics/answer/7029846)

---

**Version:** 1.0
**Last Updated:** January 2026
**Maintenance:** Review quarterly and update with new tool features
