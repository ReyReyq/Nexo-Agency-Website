# Real-Time Analytics & Monitoring Dashboards Setup Guide

## Table of Contents
1. [GA4 Real-Time Reports](#ga4-real-time-reports)
2. [Setting Up Alerts & Notifications](#setting-up-alerts--notifications)
3. [Anomaly Detection Configuration](#anomaly-detection-configuration)
4. [Live Dashboard Tools](#live-dashboard-tools)
5. [Key Metrics to Monitor](#key-metrics-to-monitor)
6. [Implementation Roadmap](#implementation-roadmap)

---

## GA4 Real-Time Reports

### Overview
GA4's Real-Time Report displays user activity on your website or app as it happens, monitoring the last 30 minutes of data with per-minute granularity. This is essential for campaign validation, content monitoring, and quality assurance.

### Accessing Real-Time Reports

**Step 1: Navigate to GA4**
- Open your Google Analytics 4 property
- Select your property from the property list

**Step 2: Access Real-Time Report**
- Click **Reports** in the left navigation menu
- Select **Real-time** from the Reports menu

### Key Data Displayed

The Real-Time Report provides visibility into:

1. **Active Users Metrics**
   - Total active users in the last 30 minutes
   - Active users per minute (5-minute and 30-minute graphs)
   - Active users by device type (mobile, desktop, tablet)

2. **Traffic Source Data**
   - Users by source (organic, direct, referral, etc.)
   - Users by medium (cpc, organic, referral, direct, etc.)
   - Users by campaign
   - Users by source/medium combination

3. **Geographic Data**
   - User location on interactive map
   - Top countries and regions by user count

4. **Content Engagement**
   - Page views by page title or URL
   - Screen names (for app tracking)
   - Event tracking by event name

5. **Conversion Data**
   - Key events in real-time
   - Event count by event type

6. **Audience Insights**
   - View data by configured audiences
   - User properties filtering

### Use Cases for Real-Time Monitoring

**Campaign Launch Verification**
- Verify tracking is working before full campaign deployment
- Monitor immediate response to paid advertising campaigns
- Check email marketing campaign performance within minutes of send

**Content Performance**
- Monitor traffic spikes from social media posts
- Track engagement with newly published blog articles
- Identify trending content in real-time

**Quality Assurance**
- Validate that measurement code is functioning correctly
- Troubleshoot tracking issues as they occur
- Verify conversion tracking implementation

**Event Monitoring**
- Monitor shopping events during promotions
- Track form submissions in real-time
- Monitor file downloads and video plays

### Key Features

**User Snapshot**
Access a chronological timeline of events for individual anonymous users to understand single user journeys through your site:
- View all events in sequence
- Understand user path through your site
- Identify drop-off points in user flow

**Real-Time API Access**
For advanced use cases, use the Google Analytics Realtime Reporting API to:
- Create custom real-time reports programmatically
- Integrate with external systems
- Build custom dashboards with specific logic

### Important Limitations

1. **Data Sampling**: High traffic volumes may trigger data sampling, reducing granularity
2. **No Formal SLO**: Real-time operates without guaranteed service level objectives
3. **Processing Delays**: Slight delays can occur, especially during heavy traffic
4. **30-Minute Window**: Only shows the last 30 minutes of activity
5. **Best Effort**: Prioritizes speed over guaranteed accuracy

---

## Setting Up Alerts & Notifications

### GA4 Custom Insights (Custom Alerts)

GA4 uses machine learning to detect important changes in your data through Custom Insights. These replace the old "Custom Alerts" terminology from Universal Analytics.

### Prerequisites

- **Required Role**: Analyst, Editor, or Administrator access to the GA4 property
- **Historical Data**: At least some baseline data needed for machine learning model training
- **Email Recipients**: Notification recipients must have access to the GA4 property

### Creating Custom Insights

#### Step 1: Access Insights Dashboard
1. Go to your GA4 property home page
2. Scroll to the "Insights and recommendations" section
3. Click **"View all Insights"** in the top right corner
4. Click the **"+"** button or **"Create insight"** to start a new custom insight

#### Step 2: Configure Basic Settings
1. **Insight Type**: Select "Insight" to set up custom conditions
2. **Name**: Give your insight a descriptive name (e.g., "Daily User Anomaly - Mobile")
3. **Description**: Add notes about why you're monitoring this metric

#### Step 3: Select Metric
Choose what to monitor from available metrics:
- Total users
- Sessions
- Page views
- Conversions
- Revenue
- Event count
- Or any custom metric defined in your property

#### Step 4: Set Evaluation Frequency
Choose how often the insight should be evaluated:
- **Hourly** (web only) - Most frequent, best for time-sensitive campaigns
- **Daily** - Standard frequency for most monitoring
- **Weekly** - For broader trend detection
- **Monthly** - For long-term pattern changes

#### Step 5: Add Conditions (Optional - Up to 5)
Segment the data to focus on specific user groups:

Examples:
- `First user medium = organic search`
- `Device category = mobile`
- `Country = United States`
- `User acquisition source = google`
- `Campaign = summer_sale`

#### Step 6: Set Trigger Conditions

**Option A: Anomaly Detection**
- Choose "Anomaly detected" to use ML-based anomaly detection
- System will alert when values fall outside normal ranges

**Option B: Percentage Change**
- Compare to a previous period
- Set threshold percentage (e.g., ±20%)
- Choose comparison period:
  - Yesterday
  - Same day last week
  - Same day last year
  - Custom date range

**Option C: Count Change**
- Alert when metric changes by a specific number
- Example: Alert if users drop by 100 or more

#### Step 7: Configure Notifications
1. **Email Recipients**: Enter email addresses separated by commas
2. **Notification Frequency**: Choose when to notify
   - Immediately when triggered
   - Daily digest
   - Weekly summary

#### Step 8: Save the Insight
Click **Save** to activate the alert

### Recommended Alerts to Set Up

**Priority 1: Traffic Anomalies**
- Metric: Daily active users
- Condition: Anomaly detection
- Frequency: Daily
- Why: Detects major traffic drops or unexplained spikes

**Priority 2: Conversion Changes**
- Metric: Purchase conversions
- Condition: Percentage change (>20%)
- Frequency: Daily
- Comparison: Same day last week
- Why: Catches significant conversion rate changes

**Priority 3: Mobile Traffic**
- Metric: Sessions
- Condition: Mobile device anomaly
- Frequency: Hourly
- Why: Mobile traffic can be volatile and critical for many sites

**Priority 4: Specific Campaign Monitoring**
- Metric: Sessions
- Condition: Specific campaign parameter
- Frequency: Hourly
- Comparison: Percentage change against baseline
- Why: Monitor campaign effectiveness immediately after launch

**Priority 5: Bounce Rate Changes**
- Metric: Bounce rate
- Condition: Percentage increase (>10%)
- Frequency: Daily
- Why: Indicates potential content or technical issues

### Best Practices for Alerts

1. **Start Broad, Narrow Down**: Begin with wider thresholds and refine over time to avoid alert fatigue
2. **Establish Baseline First**: Let data accumulate for 2-4 weeks before setting anomaly alerts
3. **Focus on What Matters**: Only monitor metrics critical to your business
4. **Team Communication**: Ensure recipients know how to act on alerts
5. **Regular Review**: Review alert performance monthly and adjust thresholds
6. **Avoid False Alarms**: Set thresholds that catch real issues, not normal fluctuation

### Advanced: BigQuery Integration for Alerts

For enterprise-scale monitoring, integrate GA4 with BigQuery:

1. **Enable BigQuery Export**:
   - Go to GA4 property settings
   - Enable BigQuery export (available with GA4 360)
   - Set up streaming export for near real-time data

2. **Create Alert Queries**:
```sql
SELECT
  PARSE_DATE('%Y%m%d', event_date) as event_date,
  COUNT(*) as total_events,
  COUNT(DISTINCT user_id) as unique_users,
  SUM(CASE WHEN event_name = 'purchase' THEN 1 ELSE 0 END) as purchases
FROM `project.dataset.events_*`
WHERE _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', CURRENT_DATE()-1)
GROUP BY event_date
HAVING total_events < 1000
```

3. **Connect to Monitoring Tools**:
   - Use Zapier to route BigQuery results to Slack
   - Use Cloud Functions for custom alert logic
   - Integrate with PagerDuty for critical alerts

---

## Anomaly Detection Configuration

### How GA4 Anomaly Detection Works

GA4 uses a Bayesian state-space time series model to identify anomalies:
1. Model analyzes historical data for 2-90 weeks depending on frequency
2. Generates prediction and credible interval for latest datapoint
3. Flags datapoint as anomaly if actual value falls outside credible interval
4. Uses machine learning to distinguish between normal variation and true anomalies

### Training Data Requirements

| Frequency | Training Period | Minimum Historical Data |
|-----------|-----------------|------------------------|
| Hourly    | 2 weeks         | 2 weeks daily activity |
| Daily     | 90 days         | 3 months of data       |
| Weekly    | 32 weeks        | 8 months of data       |
| Monthly   | Various         | 12+ months preferred   |

### Sensitivity Levels

GA4 allows three sensitivity configurations:

1. **High Sensitivity** (Default)
   - Catches more anomalies
   - More false positives
   - Best for: Critical metrics that should stay stable

2. **Medium Sensitivity**
   - Balanced approach
   - Filters out routine fluctuations
   - Best for: Most business metrics

3. **Low Sensitivity**
   - Only catches major anomalies
   - Fewer false positives
   - Best for: Highly volatile metrics

### Best Practices for Anomaly Detection

1. **Wait for Training Period**: Don't create anomaly alerts immediately after GA4 setup
2. **Use Medium Sensitivity First**: Start here and adjust based on noise level
3. **Combine with Segmentation**: Apply to specific audiences for better accuracy
4. **Monitor Seasonal Changes**: Review alerts during seasonal peaks/valleys
5. **Cross-Reference**: Always verify anomalies against:
   - Traffic sources
   - Device types
   - Geographic data
   - Campaign activity

### Common Anomalies to Watch

1. **Traffic Drops**
   - Indicator: 50%+ decrease in sessions
   - Common Causes: Site outage, tracking code issue, algorithm change
   - Action: Check server status, verify GA4 implementation

2. **Conversion Rate Spikes**
   - Indicator: 100%+ increase in conversion rate
   - Common Causes: Data error, site issue, test running
   - Action: Verify data integrity, check for active experiments

3. **Bounce Rate Changes**
   - Indicator: Significant increase in bounce rate
   - Common Causes: Technical issues, content change, layout problems
   - Action: Check page load times, verify content changes

4. **Device Category Anomalies**
   - Indicator: Unusual shift in mobile/desktop ratios
   - Common Causes: Mobile site issue, campaign targeting change
   - Action: Test mobile site, check ad targeting

5. **Geographic Anomalies**
   - Indicator: Sudden traffic from new regions
   - Common Causes: New campaign, viral content, DDoS
   - Action: Review traffic source, check content distribution

---

## Live Dashboard Tools

### Looker Studio (Google Data Studio)

#### Setup Overview
Looker Studio is Google's free dashboard and visualization platform that connects directly to GA4.

#### Initial Setup

**Step 1: Create New Report**
1. Go to [looker.studio](https://lookerstudio.google.com/)
2. Click **+ Blank Report**
3. Name your report (e.g., "Real-Time Performance Dashboard")

**Step 2: Connect GA4 Data Source**
1. Click **Add Data** in toolbar
2. Select **Google Analytics** connector
3. Search for your GA4 property by name
4. Click **Create** to authorize connection
5. Select your property and confirm connection

**Step 3: Build Dashboard Layout**
Organize into sections:

**Top Section - Key Metrics (Real-Time Overview)**
```
┌─────────────────────────────────────────────┐
│ Active Users    Sessions Today    Conversions│
│      1,247          3,891              42    │
└─────────────────────────────────────────────┘
```

**Middle Section - Traffic Trends**
```
┌────────────────────────────────────────────┐
│ Active Users (Last 30 minutes) - Line Chart│
│                                             │
│  Peak: 124 | Current: 87 | Low: 12        │
└────────────────────────────────────────────┘
```

**Bottom Section - Detailed Breakdown**
```
┌──────────────────────┬──────────────────────┐
│ Traffic by Source    │  Top Pages           │
│ (Pie/Bar Chart)      │  (Table)             │
└──────────────────────┴──────────────────────┘
```

#### Adding Key Components

**Scorecards (for headline metrics)**
1. Click **Insert** → **Scorecard**
2. Drag to place on dashboard
3. Click scorecard to configure
4. Select metric: Active Users / Sessions / Conversions / etc.
5. Choose time period: Last 30 minutes / Last 1 hour / Today
6. Add comparison: Period-over-period or custom

**Charts (for trends)**
1. Click **Insert** → **Chart** → Select type
   - Line Chart: Best for trends over time
   - Bar Chart: Best for comparisons
   - Pie Chart: Best for proportions
2. Configure dimensions and metrics
3. Customize colors and formatting

**Tables (for detailed data)**
1. Click **Insert** → **Table**
2. Add dimensions: Page Title, Traffic Source, Device Type
3. Add metrics: Sessions, Users, Bounce Rate, Conversion Rate
4. Set sorting and filtering

**Filters (for user control)**
1. Click **Insert** → **Filter**
2. Choose filter type:
   - Date Range: Allow users to select custom dates
   - Dropdown: Pre-defined options (e.g., Traffic Sources)
   - Search: Free-form text search
3. Apply filter to multiple charts

#### Real-Time Dashboard Configuration

**Essential Real-Time Metrics to Display:**

1. **Active Users Metrics**
   - Metric: Active Users (GA4 dimension)
   - Time Period: Last 30 minutes
   - Display: Scorecard + Line chart

2. **Current Traffic Source**
   - Dimension: Source/Medium
   - Metric: Active Users
   - Time Period: Real-time
   - Display: Table or Pie chart

3. **Top Pages (Real-Time)**
   - Dimension: Page Title
   - Metric: Engaged Sessions
   - Time Period: Last hour
   - Display: Table

4. **Key Events**
   - Dimension: Event Name
   - Metric: Event Count
   - Time Period: Last 30 minutes
   - Display: Bar chart or Table

5. **Device Breakdown**
   - Dimension: Device Category
   - Metric: Active Users
   - Time Period: Real-time
   - Display: Pie chart

#### Important Looker Studio Limitations with GA4

1. **Data Refresh Frequency**
   - Looker Studio updates every 24-36 hours for GA4 data
   - Not true real-time like GA4's native Real-Time Report
   - For actual real-time, use the GA4 Real-Time Report directly

2. **Historical Data Only**
   - Cannot access events older than GA4 retention period
   - Default retention: 2 months

3. **API Quotas**
   - Reports are subject to GA4 API quotas
   - Hitting quota limit causes "Quota exceeded" error
   - Estimated quota: 50,000 queries per property per day

4. **Aggregated Data**
   - Data is pre-aggregated by GA4 API
   - Cannot access raw event-level data
   - For raw data, use BigQuery integration

#### Advanced: Real-Time Using BigQuery Integration

For true real-time dashboards:

1. **Enable BigQuery Export**
   - Available with GA4 360 or free tier with streaming
   - Go to GA4 Admin → Data Streams → Link BigQuery

2. **Connect BigQuery to Looker Studio**
   - In Looker Studio, choose BigQuery connector
   - Query GA4 events table directly
   - Benefits: Raw data, custom logic, faster queries

3. **Create Real-Time Query**
```sql
SELECT
  CURRENT_TIMESTAMP() as timestamp,
  COUNT(DISTINCT user_pseudo_id) as active_users,
  SUM(1) as events,
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') as page
FROM `project.analytics_XXXXXXX.events_intraday_*`
WHERE _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND TIMESTAMP_MICROS(event_timestamp) > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 MINUTE)
GROUP BY event_name, page
ORDER BY events DESC
```

### Other Live Dashboard Tools

#### Grafana
- **Best For**: Infrastructure and system monitoring
- **Real-Time Capability**: True real-time with 1-second intervals
- **Pricing**: Free (open source) or $19+/month (Cloud)
- **Setup Time**: 1-2 hours
- **Integration**: GA4 via BigQuery connector

**Ideal For**: Technical teams monitoring system health alongside analytics

#### Tableau
- **Best For**: Enterprise analytics and business intelligence
- **Real-Time Capability**: Incremental refresh every 15 minutes minimum
- **Pricing**: $70+/user/month
- **Setup Time**: 2-4 hours
- **Integration**: Native GA4 connector

**Ideal For**: Large organizations needing powerful visualization and sharing

#### Metabase
- **Best For**: Open-source analytics on a budget
- **Real-Time Capability**: 1-hour refresh minimum
- **Pricing**: Free (open source) or $999+/month (Cloud)
- **Setup Time**: 30 minutes
- **Integration**: GA4 via BigQuery

**Ideal For**: Budget-conscious teams wanting open-source flexibility

#### Microsoft Power BI
- **Best For**: Organizations already using Microsoft ecosystem
- **Real-Time Capability**: DirectQuery for real-time (requires Premium)
- **Pricing**: $10-$20/user/month
- **Setup Time**: 1-3 hours
- **Integration**: GA4 via custom connector or BigQuery

**Ideal For**: Microsoft-heavy organizations with Power BI expertise

#### AWS QuickSight
- **Best For**: AWS-native analytics
- **Real-Time Capability**: SPICE (in-memory) with 1-hour refresh
- **Pricing**: $18-$90/month
- **Setup Time**: 1-2 hours
- **Integration**: Native GA4 connector (via BigQuery or API)

**Ideal For**: AWS organizations wanting native analytics

---

## Key Metrics to Monitor

### 1. Traffic Metrics (Essential)

#### Active Users
- **Definition**: Number of concurrent users on site in last 30 minutes
- **Why Monitor**: Indicator of site health and interest
- **Alert Threshold**: Alert on >50% drop from baseline
- **Action When Alert Triggers**:
  - Check GA4 implementation status
  - Verify traffic sources
  - Review any recent site changes

#### Sessions
- **Definition**: Number of user sessions in real-time
- **Why Monitor**: Shows engagement volume
- **Alert Threshold**: >25% increase (possible DDoS) or >20% decrease
- **Action**: Verify traffic sources and content performance

#### Bounce Rate
- **Definition**: Percentage of sessions with single page view
- **Why Monitor**: Indicates content relevance and user experience
- **Alert Threshold**: >10% increase from 7-day average
- **Action**: Check page load times, review page content, test on mobile

#### Page Views
- **Definition**: Number of page views per second/minute
- **Why Monitor**: Content consumption indicator
- **Alert Threshold**: Anomaly detection on daily view
- **Action**: Check for viral content, technical issues, or broken links

### 2. Engagement Metrics

#### Avg. Session Duration
- **Definition**: Average time users spend per session
- **Why Monitor**: Content engagement quality
- **Target**: 2-5 minutes depending on content type
- **Alert**: Drop >30% from baseline
- **Action**: Review content quality, check navigation issues

#### Scroll Depth
- **Definition**: How far users scroll on pages (custom event)
- **Why Monitor**: Content relevance and page layout
- **Target**: 50%+ of users viewing 50% of page
- **Action**: Move important content higher if low

#### Click-Through Rate (CTR)
- **Definition**: Percentage of impressions resulting in clicks
- **Why Monitor**: Call-to-action effectiveness
- **Target**: 2-5% depending on industry
- **Action**: Test CTA placement, color, and copy

#### Video Engagement
- **Definition**: Play rate, completion rate, average watch time
- **Why Monitor**: Video content performance
- **Target**: 50%+ play rate, 70%+ completion rate
- **Action**: Check video thumbnail, title, placement

### 3. Conversion Metrics (Critical)

#### Conversion Rate
- **Definition**: Percentage of sessions resulting in conversion
- **Why Monitor**: Core business metric
- **Alert Threshold**: >10% drop from 7-day average
- **Action**: Check checkout process, payment gateway, error logs

#### Cost Per Conversion
- **Definition**: Ad spend divided by conversions
- **Why Monitor**: Campaign efficiency
- **Alert Threshold**: >20% increase in cost
- **Action**: Review targeting, landing page, creative quality

#### Revenue Per User
- **Definition**: Total revenue divided by active users
- **Why Monitor**: Direct business impact
- **Alert Threshold**: >15% drop from baseline
- **Action**: Check product pricing, promotional activity, market conditions

#### Cart Abandonment Rate
- **Definition**: Percentage of users abandoning shopping carts
- **Why Monitor**: Revenue leakage indicator
- **Target**: <70% (varies by industry)
- **Action**: Implement cart abandonment email, improve checkout UX

#### Key Events Completion
- **Definition**: Completion rate for defined key events
- **Why Monitor**: Goal progress tracking
- **Target**: Depends on event (sign-ups, downloads, form submissions)
- **Action**: Debug funnel drops, improve user experience

### 4. Traffic Source Metrics

#### Organic Search Performance
- **Metric**: Sessions, average position, CTR from search
- **Why Monitor**: SEO health and search visibility
- **Alert**: >20% drop in organic sessions
- **Action**: Check search console, run site audit, check core web vitals

#### Paid Traffic Performance
- **Metric**: Cost per click, conversion rate, return on ad spend (ROAS)
- **Why Monitor**: Campaign ROI
- **Alert**: ROAS <1.5x or cost per conversion spike
- **Action**: Review targeting, pause underperforming ads, adjust bids

#### Direct Traffic
- **Metric**: Direct sessions, percentage of total traffic
- **Why Monitor**: Brand awareness and bookmarks
- **Baseline**: 10-20% of total traffic typical
- **Alert**: Sudden increase (might indicate attribution issues)

#### Referral Traffic
- **Metric**: Top referral sources, conversion rate from referrals
- **Why Monitor**: Partnership value and link building
- **Action**: Reach out to high-converting referrers for partnerships

#### Social Traffic
- **Metric**: Sessions by social platform, engagement rate
- **Why Monitor**: Social presence effectiveness
- **Alert**: Sudden spike (possible viral content)
- **Action**: Amplify top-performing content

### 5. Device & Browser Metrics

#### Mobile vs. Desktop Traffic
- **Definition**: User distribution by device type
- **Why Monitor**: Responsive design effectiveness
- **Target**: 50-70% mobile (varies by industry)
- **Alert**: Mobile conversion rate drops >20%
- **Action**: Test mobile site, check page speed, review mobile UX

#### Browser Usage
- **Definition**: Sessions by browser type
- **Why Monitor**: Compatibility issues detection
- **Alert**: Sudden drop for specific browser
- **Action**: Test on that browser, check for compatibility issues

#### Operating System Performance
- **Definition**: Sessions and conversion by OS
- **Why Monitor**: OS-specific issues
- **Alert**: Conversion rate difference >30% between OS
- **Action**: Debug iOS/Android specific issues

#### Device Performance
- **Definition**: Page speed by device type
- **Why Monitor**: Mobile and tablet user experience
- **Target**: <3 second load time (mobile)
- **Alert**: Load time increase >1 second
- **Action**: Optimize images, reduce JavaScript, implement CDN

### 6. Geographic Metrics

#### Traffic by Country/Region
- **Definition**: User distribution globally
- **Why Monitor**: Expansion opportunities and localization needs
- **Action**: Identify key markets, plan localization efforts

#### Conversion Rate by Region
- **Definition**: Purchase/signup rate by geography
- **Why Monitor**: Regional product-market fit
- **Alert**: Region-specific conversion drop >15%
- **Action**: Review regional compliance, currency, pricing

#### Cost of Acquisition by Region
- **Definition**: Ad spend vs. conversions by region
- **Why Monitor**: Budget allocation efficiency
- **Action**: Shift budget to high-ROI regions

### 7. User Behavior Metrics

#### New vs. Returning Users
- **Definition**: Ratio of new to returning user sessions
- **Why Monitor**: Audience composition and retention
- **Target**: 30-40% new, 60-70% returning (varies by type)
- **Alert**: New user rate drops <20%
- **Action**: Review marketing campaigns, increase awareness

#### User Retention
- **Definition**: Percentage of users returning in period
- **Why Monitor**: Product stickiness and engagement
- **Target**: 40-60% monthly retention (varies by product)
- **Action**: Implement retention campaigns, improve onboarding

#### Cohort Analysis
- **Definition**: How user cohorts progress over time
- **Why Monitor**: Lifetime value and engagement trends
- **Action**: Identify best-performing cohorts, understand drops

### 8. Technical Metrics

#### Page Load Speed
- **Metric**: Largest Contentful Paint (LCP), First Input Delay (FID), Cumulative Layout Shift (CLS)
- **Why Monitor**: User experience and SEO ranking factor
- **Target**: LCP <2.5s, FID <100ms, CLS <0.1
- **Alert**: Speed increase >500ms
- **Action**: Check server performance, optimize assets, review code changes

#### Error Rate
- **Metric**: Pages with 404/500 errors, JavaScript errors
- **Why Monitor**: Technical issues affecting users
- **Alert**: Error rate >1% of traffic
- **Action**: Identify error source, fix broken links, debug code

#### Implementation Health
- **Metric**: GA4 tag status, pixel tracking verification
- **Why Monitor**: Data collection reliability
- **Alert**: Missing page views >20%
- **Action**: Verify GA4 implementation, check tag manager

---

## Implementation Roadmap

### Week 1: Foundation Setup

**Day 1-2: GA4 Real-Time Reports**
- [ ] Access GA4 Real-Time Report section
- [ ] Familiarize with 5 key dashboard cards
- [ ] Create bookmark for daily monitoring
- [ ] Define what metrics matter to your business
- [ ] Time: 1-2 hours

**Day 3-4: GA4 Custom Insights**
- [ ] Create account with Analyst+ role
- [ ] Set up 5 Priority alerts (from page 3)
- [ ] Test alert notifications with team
- [ ] Configure email recipients
- [ ] Establish baseline thresholds
- [ ] Time: 2-3 hours

**Day 5: Documentation**
- [ ] Document alert ownership (who responds)
- [ ] Create runbook for each alert type
- [ ] Share with team
- [ ] Time: 1-2 hours

### Week 2: Dashboard Setup

**Day 1-2: Looker Studio Initial Dashboard**
- [ ] Create blank Looker Studio report
- [ ] Connect to GA4 property
- [ ] Add 5 scorecards (Active Users, Sessions, Conversions, Bounce Rate, Avg. Session Duration)
- [ ] Add real-time trend chart for active users
- [ ] Time: 2-3 hours

**Day 3-4: Dashboard Enhancement**
- [ ] Add traffic source breakdown (table)
- [ ] Add top pages table
- [ ] Add device category pie chart
- [ ] Add geographic data visualization
- [ ] Add date range filter
- [ ] Time: 2-3 hours

**Day 5: Share & Document**
- [ ] Share dashboard with stakeholders
- [ ] Create viewing guide
- [ ] Establish daily review ritual
- [ ] Time: 1 hour

### Week 3: Advanced Monitoring

**Day 1-2: Anomaly Detection Setup**
- [ ] Enable anomaly detection on critical metrics
- [ ] Create anomaly-based insights
- [ ] Review 90-day historical data
- [ ] Set up segmented anomalies (mobile, organic, etc.)
- [ ] Time: 2 hours

**Day 3-4: Integration & Automation**
- [ ] Connect dashboard to team Slack (if using Looker integration)
- [ ] Set up daily metric email snapshots
- [ ] Create alert escalation policy
- [ ] Document critical metric thresholds
- [ ] Time: 2-3 hours

**Day 5: Team Training**
- [ ] Train team on dashboard use
- [ ] Review alert response procedures
- [ ] Conduct sample incident response drill
- [ ] Time: 1-2 hours

### Week 4: Optimization & Scale

**Day 1-2: Advanced Dashboards**
- [ ] Create campaign-specific dashboard
- [ ] Create conversion funnel dashboard
- [ ] Create geographic performance dashboard
- [ ] Create device/browser performance dashboard
- [ ] Time: 3-4 hours

**Day 3: BigQuery Integration (Optional)**
- [ ] Enable BigQuery export (GA4 360 or free tier)
- [ ] Create real-time queries in BigQuery
- [ ] Connect BigQuery to Looker Studio for raw data
- [ ] Time: 2-3 hours

**Day 4-5: Review & Refinement**
- [ ] Review alert effectiveness (false positives/negatives)
- [ ] Adjust thresholds based on 2-week baseline
- [ ] Remove non-actionable metrics
- [ ] Document metric definitions for team
- [ ] Plan ongoing maintenance
- [ ] Time: 2 hours

### Ongoing Maintenance

**Monthly Review (1 hour)**
- Review alert performance and adjust thresholds
- Check dashboard usefulness and update if needed
- Review team feedback on alerts
- Update documentation

**Quarterly Review (2 hours)**
- Deep dive on anomalies detected
- Evaluate new GA4 features for incorporation
- Plan dashboard improvements
- Train new team members

---

## Quick Reference: Alert Setup Checklist

### Before Creating Alerts
- [ ] Team agrees on what metrics matter
- [ ] At least 2-4 weeks of historical data available
- [ ] Identify who responds to each alert type
- [ ] Create incident response runbooks

### When Creating Each Alert
- [ ] Name clearly describes the metric
- [ ] Set frequency appropriate to business need
- [ ] Configure recipients with GA4 access
- [ ] Start with broader thresholds, refine over time
- [ ] Document the business impact of this metric
- [ ] Set up logging/tracking of alert triggers

### After Alerts Go Live
- [ ] Monitor false positive rate in first week
- [ ] Adjust thresholds if too many alerts
- [ ] Track team response time to alerts
- [ ] Update thresholds based on actual data patterns
- [ ] Review effectiveness monthly

---

## Troubleshooting Common Issues

### Issue: No Data Appearing in Real-Time Report
**Causes**:
- GA4 tracking code not properly implemented
- Traffic is minimal
- Sampling due to high volume

**Solution**:
1. Check Admin → Data Streams → View tag status
2. Verify implementation on site
3. Generate test traffic to confirm tracking
4. Check for UTM parameter issues

### Issue: Alerts Constantly Triggering
**Causes**:
- Thresholds too aggressive
- Metrics naturally volatile
- Anomaly detection model not trained

**Solution**:
1. Wait 90 days minimum for anomaly detection training
2. Increase threshold percentages
3. Segment to less volatile audiences
4. Reduce alert frequency

### Issue: Looker Studio Dashboard Not Updating
**Causes**:
- API quota exceeded
- GA4 data delay (24-36 hours typical)
- Filter misconfiguration

**Solution**:
1. Check Query Overview for quota errors
2. Wait for data processing (normal delay)
3. Remove unnecessary filters
4. Rebuild chart with direct connection

### Issue: Anomaly Detection Not Working
**Causes**:
- Insufficient historical data
- Metric too volatile
- Sensitivity set too low

**Solution**:
1. Wait for training period (90 days for daily)
2. Add segmentation to reduce variance
3. Increase sensitivity setting
4. Use percentage-based triggers instead

---

## Resources

### Official Google Documentation
- [GA4 Real-Time Report Guide](https://support.google.com/analytics/answer/9271392?hl=en)
- [GA4 Custom Insights (Alerts)](https://support.google.com/analytics/answer/9517187?hl=en)
- [Google Analytics Realtime Reporting API](https://developers.google.com/analytics/devguides/reporting/data/v1/realtime-basics)
- [Looker Studio - Google Analytics Connector](https://docs.cloud.google.com/looker/docs/studio/connect-to-google-analytics)

### Key Learning Resources
- [The Ultimate Guide to GA4 Real-time Report (2025)](https://measureschool.com/ga4-realtime-report/)
- [Complete Guide to Custom Alerts in GA4](https://measureu.com/custom-alerts-google-analytics-4/)
- [Anomaly Detection in GA4: Comprehensive Guide](https://digitalanalystteam.com/anomaly-detection-in-google-analytics-4/)
- [Building Interactive Dashboards in Looker Studio](https://www.lovesdata.com/blog/interactive-dashboards-using-looker-studio/)
- [Real-Time Reporting with BigQuery and Looker Studio](https://dumbdata.co/post/real-time-reporting-in-ga4-using-big-query-and-looker-studio-part-1/)

### Tools Comparison Matrix

| Tool | Real-Time | Cost | Setup Time | Best For |
|------|-----------|------|------------|----------|
| GA4 Real-Time | Yes (30 min) | Free | 5 min | Basic monitoring, QA |
| GA4 Alerts | Custom freq. | Free | 15 min | Baseline alerts |
| Looker Studio | No (24-36h) | Free | 2-4 hours | Free dashboarding |
| BigQuery + Looker | Yes* | $$$$ | 4-6 hours | Enterprise real-time |
| Grafana | Yes (1s) | Free/$19+ | 2-4 hours | Infrastructure focus |
| Tableau | ~15 min | $70+/user | 2-4 hours | Enterprise BI |
| Metabase | 1 hour | Free/$999+ | 1-2 hours | Open-source budget |

*With streaming export

---

## Implementation Notes

**Key Success Factors:**
1. Start simple - implement Real-Time + 3 basic alerts first
2. Wait for baseline period before tuning thresholds
3. Focus on actionable metrics only
4. Make alerts the responsibility of specific people
5. Review and refine monthly
6. Document everything for team knowledge sharing

**Common Pitfalls to Avoid:**
1. Too many alerts causing alert fatigue
2. Alerts without defined response procedures
3. Monitoring metrics that don't drive decisions
4. Setting thresholds before establishing baseline
5. Forgetting to verify GA4 implementation before monitoring
6. Using looker for "real-time" when 24+ hour lag exists

---

Last Updated: January 2026
Document Version: 1.0
