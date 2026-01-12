# Looker Studio GA4 Implementation Guide

## Quick Start: Building Your First Dashboard

### Phase 1: Setup (15 minutes)

#### 1. Verify GA4 Property Access
```
Requirements:
- Admin or Editor access to GA4 property
- Email address associated with Google account
- No IP restrictions blocking GA4 property
```

#### 2. Access Looker Studio
- Navigate to: https://looker.studio
- Sign in with your Google account
- Click "Create" → "Report"

#### 3. Add GA4 Data Source
```
Steps:
1. Click "Create New Data Source"
2. Select "Google Analytics" connector
3. Authorize Looker Studio to access GA4
4. Select your Google Analytics account
5. Select your GA4 property
6. Click "CONNECT"
```

### Phase 2: Create Your First Chart (10 minutes)

#### Add a Scorecard KPI
```
1. In your blank report, click "Add a chart"
2. Select "Scorecard" from widget options
3. Choose metric: "Users"
4. Set date range: "Last 30 days"
5. Click "Insert"
6. Double-click to customize appearance
7. Add comparison: "Previous period"
8. Enable "Show sparkline"
```

#### Add a Time Series Chart
```
1. Click "Add a chart"
2. Select "Line Chart"
3. Set X-axis: "Date"
4. Set Y-axis: "Users"
5. Click "Insert"
6. Customize colors in the setup panel
```

#### Add a Category Comparison
```
1. Click "Add a chart"
2. Select "Bar Chart"
3. Set X-axis: "Source/Medium"
4. Set Y-axis: "Sessions"
5. Set sort order: "Descending"
6. Limit to top 10
7. Click "Insert"
```

### Phase 3: Add Filters (5 minutes)

#### Add Date Range Filter
```
1. Click "Add a filter"
2. Select filter type: "Date Range"
3. Set default: "Last 30 Days"
4. Choose placement: "Top of report"
5. Name: "Date Range"
6. Click "Apply"
```

#### Add Dimension Filter
```
1. Click "Add a filter"
2. Select dimension: "Source/Medium"
3. Set filter type: "Dropdown"
4. Include all values or select specific
5. Click "Apply"
```

---

## Data Source Configuration

### Setting Up GA4 Connector

#### Fields Available
```
Dimensions (Breakdown):
- Date
- Month
- Year
- Day of Week
- Hour
- Source
- Medium
- Source / Medium
- Campaign
- Content
- Keyword
- Device Category
- Operating System
- Browser
- Country
- Region
- City
- Continent

Metrics (Numbers):
- Users
- New Users
- Sessions
- Bounce Rate
- Engagement Rate
- Average Session Duration
- Conversions
- Revenue
- Transaction Count
- Average Order Value
- Events
- Pageviews
```

#### Credentials Setup
```
Owner's Credentials:
- Most permissive (recommended for team dashboards)
- Others can view without GA4 access
- All viewers see same data
- Use for client reports

Viewer's Credentials:
- More restrictive (for sensitive data)
- Each viewer needs GA4 access
- Not recommended for client dashboards
- Use for internal team only
```

### Testing Your Connection

```
1. Create a simple test chart
2. Add Users metric, Date dimension
3. Set date range: Last 7 days
4. Check data displays
5. Compare with GA4 admin interface
6. Verify numbers match
```

---

## Chart-by-Chart Implementation

### Executive KPI Section

#### Revenue Scorecard
```
Configuration:
- Metric: Revenue
- Default Date Range: Last Month
- Comparison: Month over Month
- Format: Currency ($)
- Show Change: Percentage and Arrow
- Sparkline: 30-day trend

Styling:
- Card Title: "Total Revenue"
- Font Size: Large
- Color: Green for positive trend
```

#### Users Scorecard
```
Configuration:
- Metric: Users
- Default Date Range: Last Month
- Comparison: Month over Month
- Format: Number
- Show Change: Percentage and Arrow
- Sparkline: 30-day trend

Styling:
- Card Title: "Total Users"
- Font Size: Large
```

#### Conversion Rate Scorecard
```
Configuration:
- Metric: Conversions / Sessions
- Default Date Range: Last Month
- Comparison: Month over Month
- Format: Percentage
- Decimal Places: 2
- Show Change: Percentage and Arrow

Styling:
- Card Title: "Conversion Rate"
- Color: Blue
```

### Trend Analysis Charts

#### Daily Users Trend
```
Chart Type: Line Chart
X-Axis: Date (Daily)
Y-Axis: Users
Date Range: Last 90 Days
Features:
- Show trend line
- Forecast: Optional 30-day forecast
- Reference line: Average value
- Multiple series: Compare previous period

Styling:
- Title: "User Acquisition Trend"
- Grid lines: Enabled
- Data labels: None
- Color: Primary brand color
```

#### Revenue & Conversions Dual Axis
```
Chart Type: Combo Chart
X-Axis: Date (Daily)
Left Y-Axis: Revenue
Right Y-Axis: Conversions
Date Range: Last 90 Days

Styling:
- Revenue: Line chart, primary color
- Conversions: Column chart, secondary color
- Title: "Revenue and Conversions"
- Legend: Visible
```

### Comparison Charts

#### Traffic by Source (Bar Chart)
```
Chart Type: Bar Chart
X-Axis: Source/Medium
Y-Axis: Users
Sort: Descending
Limit: Top 10
Date Range: Last 30 Days

Styling:
- Title: "Traffic by Source"
- Colors: Use color palette for each source
- Data labels: Show values on bars
- Legend: Show source names
```

#### Device Category Distribution (Pie Chart)
```
Chart Type: Pie Chart
Metric: Sessions
Dimension: Device Category
Date Range: Last 30 Days

Styling:
- Title: "Sessions by Device"
- Show percentages: Yes
- Show legend: Yes
- Colors: Distinct colors per device
```

### Detailed Tables

#### Landing Page Performance Table
```
Columns:
1. Page Title
2. Users
3. Sessions
4. Bounce Rate
5. Avg Session Duration
6. Conversions (if tracked)

Sort: By Users, Descending
Limit: Top 20
Date Range: Last 30 Days

Features:
- Sortable by any column
- Search/filter capability
- Number formatting: Decimals as needed
```

#### Campaign Performance Matrix
```
Columns:
1. Campaign Name
2. Users
3. Sessions
4. Conversions
5. Cost (if available from Google Ads)
6. ROAS (if cost available)
7. Conversion Rate

Sort: By ROAS, Descending
Limit: All campaigns
Date Range: Last 30 Days

Features:
- Heatmap coloring: Green for high ROAS
- Sortable columns
- Alternating row colors
```

---

## Multi-Page Report Structure

### Report Organization Template

```
Page 1: Executive Summary
├── Title & Date Range Selector
├── 4x Core KPI Scorecards
├── Trend Chart (Users/Revenue)
├── Traffic Source Bar Chart
└── Key Insights Text Box

Page 2: Traffic Analysis
├── Filter: Date, Source, Device
├── Traffic Trend (Line Chart)
├── Users by Source (Bar Chart)
├── Device Breakdown (Pie Chart)
└── Top Pages (Table)

Page 3: Conversions
├── Filter: Date, Campaign
├── Conversion Rate Trend
├── Revenue by Source (Bar Chart)
├── Conversion by Campaign (Table)
└── ROAS Comparison (Scorecard)

Page 4: Deep Dive
├── Campaign Selector Filter
├── Campaign-specific metrics
├── Detailed performance table
└── Recommendations text box
```

### Creating Report Sections

#### Page Breaks
```
1. Click "Insert" → "Page break"
2. Add title for new page
3. Configure page-specific filters
4. Add charts and visualizations
5. Use consistent styling across pages
```

#### Organizing Charts
```
Layout Principles:
- Primary metrics: Top of page
- Supporting charts: Middle section
- Detailed tables: Bottom section
- Filters: Top of every page
- Text boxes: Between sections

Spacing:
- Consistent margins
- Aligned chart edges
- Whitespace for readability
- Max 3 charts per row (at 1280px)
```

---

## Calculated Fields & Formulas

### Creating Calculated Metrics

#### ROAS Calculation
```
If Google Ads is connected:
Formula: Revenue / AdSpend
Type: Metric
Formatting: Number (2 decimals)
```

#### Cost Per Acquisition
```
Formula: AdSpend / Conversions
Type: Metric
Formatting: Currency
```

#### Engagement Quality Score
```
Formula: (Engaged Sessions / Sessions) * 100
Type: Metric
Formatting: Percentage
```

### Using BigQuery for Advanced Calculations

If exporting GA4 to BigQuery:

```sql
-- Customer Lifetime Value Calculation
SELECT
  user_pseudo_id,
  SUM(event_value) as lifetime_value,
  COUNT(DISTINCT session_id) as total_sessions
FROM `project.analytics_XXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20240101' AND '20240131'
GROUP BY user_pseudo_id
```

---

## Filtering & Interactivity

### Report-Level Filters

#### Global Date Filter
```
Implementation:
1. Add filter to report (not page)
2. Type: Date Range
3. Default: Last Month
4. Applies to all visualizations
5. Users can change date range
```

#### Traffic Source Filter
```
Implementation:
1. Add filter: Source/Medium
2. Type: Dropdown
3. Include: All sources
4. Allow multiple selections
5. Apply to all relevant charts
```

### Chart-Level Filters

#### Single Chart Exclusion
```
Use Case: Show non-branded traffic only
1. Select specific chart
2. Add filter to chart only
3. Filter: Contains "Brand"
4. Condition: Does not contain
5. Only affects that chart
```

### Filter Best Practices

```
Optimal Filter Count: 3-4 maximum
Placement: Top of report
Types:
- Date Range (always at top)
- Primary Dimension (Source/Campaign)
- Secondary Dimension (Device/Region)
- Geographic (if relevant)

User Experience:
- Label clearly
- Provide sensible defaults
- Show count of matching values
- Allow easy reset
```

---

## Styling & Branding

### Report Branding

#### Logo & Header
```
1. Add image element
2. Upload company logo
3. Position in top-left corner
4. Size: 40-60px height
5. Add report title next to logo
6. Add date range indicator

Header Layout:
[Logo] [Report Title] [Date Range - Filter]
```

#### Color Scheme
```
Recommended Colors:
Primary: #1F2937 (Dark Gray)
Accent: #3B82F6 (Blue)
Positive: #10B981 (Green)
Negative: #EF4444 (Red)
Neutral: #6B7280 (Medium Gray)

Consistency:
- Use same colors across all pages
- Match company branding
- High contrast for readability
- Colorblind-friendly palettes
```

### Chart Styling

#### Font & Typography
```
Report Title: 24px, Bold, Dark Gray
Page Title: 18px, Bold, Dark Gray
Chart Title: 14px, Bold, Dark Gray
Chart Labels: 11px, Medium, Dark Gray
Table Header: 11px, Bold, Dark Gray
Body Text: 12px, Regular, Medium Gray
```

#### Spacing & Layout
```
Report Margins: 20px on all sides
Section Spacing: 30px between sections
Chart Margins: 15px internal padding
Row Height (table): 32px
```

---

## Automated Reporting Setup

### Email Schedule Configuration

#### Setting Up Weekly Schedule
```
Steps:
1. Open your report
2. Click Share → Schedule delivery
3. Enter recipient emails
4. Select pages to include
5. Set start date
6. Select "Weekly"
7. Choose day: Monday
8. Set time: 7:00 AM
9. Click "Create schedule"
```

#### Schedule Template for Agency Reports
```
Monday Morning Report:
- Time: 7:00 AM
- Recipients: Client + Account Manager
- Pages: 1-3 (Summary + Traffic + Conversions)
- Frequency: Every Monday

Monthly Report:
- Time: 7:00 AM
- Recipients: Client + CMO
- Pages: All pages
- Frequency: First Monday of month
- Date Range: Previous month
```

### Email PDF Customization

#### What's Included in Email
```
Included:
- Report PDF
- Link to live interactive report
- Report metadata (date range, etc.)

Not Included:
- Animations or interactivity
- Real-time data updates
- Filters or drill-down capability
```

---

## Performance Optimization

### Large Dataset Handling

#### Dealing with Sampling
```
GA4 Sampling Occurs When:
- Using 90+ day date range
- Including many dimensions
- Large traffic volume (>1M+ events)

Solutions:
1. Use shorter date ranges for detail
2. Limit dimensions in queries
3. Use BigQuery export for unsampled data
4. Create separate dashboards per channel
```

#### Query Optimization
```
Best Practices:
- Limit dimension combinations
- Pre-filter large datasets
- Use specific date ranges
- Avoid excessive chart count
- Minimize calculated fields
```

### Dashboard Loading Speed

#### Page Optimization
```
Checklist:
☐ Limit charts per page: Max 10
☐ Use summary tables only (top 20 rows)
☐ Pre-filter high-volume dimensions
☐ Compress images under 100KB
☐ Use simple chart types
☐ Test load time in dev mode
```

---

## Troubleshooting Common Issues

### Data Not Displaying

#### Checklist
```
1. Verify GA4 property is tracking data
   → Check GA4 admin interface

2. Confirm data source connection
   → Test data source separately

3. Check date range includes data
   → Expand date range if testing recent setup

4. Verify metric/dimension compatibility
   → Some combinations unavailable

5. Check data credentials
   → Ensure "Owner's Credentials" is set
```

### Discrepancies Between GA4 and Looker Studio

#### Common Causes
```
Sampling:
- GA4 and Looker Studio may sample differently
- Longer date ranges increase sampling
- Solution: Use unsampled BigQuery data

Time Zone Differences:
- Verify GA4 and report use same timezone
- Check browser timezone settings
- Solution: Explicitly set timezone

Filter Differences:
- Internal traffic filters may differ
- Segment definitions may vary
- Solution: Match filters exactly
```

### Missing Metrics or Dimensions

#### Troubleshooting
```
If metric doesn't appear:
1. Check if it's a GA4-native metric
2. Verify it's being tracked via events
3. Wait 24-48 hours for data processing
4. Check custom metric definition

If dimension doesn't appear:
1. Verify it's captured in event tracking
2. Wait for data processing
3. Check for PII/privacy restrictions
4. Consider custom dimension option
```

---

## Integration with Other Tools

### Connecting Google Ads Data

#### Step-by-Step
```
1. Open data source management
2. Click "Create New Data Source"
3. Select "Google Ads"
4. Authorize Looker Studio
5. Select Google Ads account
6. Select Campaign(s)
7. Click "Connect"
8. Use in reports alongside GA4 data
```

### Blending GA4 with Google Ads

```
Use Case: Combine GA4 revenue with Google Ads cost
Steps:
1. Create first chart with GA4 revenue
2. Create second chart with Google Ads cost
3. Blend: Use same dimensions (Date, Campaign)
4. Create calculated field: Revenue / Cost = ROAS
5. Visualize ROAS in combined chart
```

### Connecting Google Search Console

```
1. Add new data source: Google Search Console
2. Select property matching GA4 property
3. Pull: Impressions, Clicks, Average Position
4. Blend with GA4 traffic data
5. Create chart: Traffic by Search Performance
```

---

## Advanced Techniques

### Creating Segmented Dashboards

#### Multi-Client Setup (Agency Use)
```
Approach 1: Separate Reports
- One report per client
- Filtered GA4 property per client
- Easy to customize per client

Approach 2: Single Report with Filters
- One GA4 property with "client" parameter
- Add dropdown filter for client selection
- One report, multiple views
- More complex setup, less maintenance

Recommendation: Approach 1 for easier management
```

### Real-Time Dashboards

#### Real-Time Data Configuration
```
1. Add Real-Time metric to GA4 tracker
2. Use "Real-Time" metric in Looker Studio
3. Set refresh rate: 30 seconds (default)
4. Create simple visualizations only
5. Use for monitoring, not analysis

Limitations:
- Very short data retention (30 minutes)
- Limited dimensions available
- Not suitable for historical analysis
- Manual refresh if needed
```

### Custom Events & Goals Tracking

#### Tracking Custom Events in GA4
```
Event Implementation (GA4 Tag):
gtag('event', 'form_submit', {
  'form_name': 'contact_form',
  'form_location': 'hero_section'
});

In Looker Studio:
1. Use as metric: Count of Events
2. Filter by event_name: form_submit
3. Add parameter breakdown: form_location
4. Visualize form submissions
```

---

## Maintenance & Updates

### Regular Dashboard Maintenance

#### Weekly Review Checklist
```
☐ Check for data anomalies
☐ Verify filters are working
☐ Test drill-down capabilities
☐ Review for new insights
☐ Confirm automated schedules sent
☐ Check for error messages
```

#### Monthly Optimization
```
☐ Review unused charts
☐ Remove outdated information
☐ Update KPI targets
☐ Refresh color scheme if needed
☐ Test with new team members
☐ Gather feedback
```

### Version Control & Templates

#### Saving Dashboard Templates
```
Best Practice:
1. Create baseline dashboard
2. Duplicate for client/project
3. Customize as needed
4. Keep master copy unchanged
5. Document customizations

Organization:
- Name by purpose: "Client-Executive-Summary"
- Use consistent naming convention
- Archive old versions with date
- Document column specifications
```

---

## Security & Access Control

### Data Access Management

#### Sharing Reports
```
Viewer Permissions:
- Can view data only
- Cannot edit dashboard
- Cannot edit data source
- Data depends on data source credentials

Editor Permissions:
- Can modify dashboard
- Can change visualizations
- Cannot modify data source
- Best for internal team

Owner:
- Full control
- Can manage sharing
- Can delete report
- Can modify data source
```

#### Sensitive Data Handling
```
For Client Reports:
- Use Owner's Credentials (data source)
- Restrict to specific date ranges
- Filter out internal traffic
- Hide sensitive dimensions
- Remove cost data if needed

For Internal Reports:
- Use Viewer's Credentials (requires GA4 access)
- Include all available data
- Document data sources
- Update access as needed
```

---

## Resources & Reference

### Official Documentation
- [Looker Studio Help](https://support.google.com/looker-studio)
- [Google Analytics 4 Setup](https://support.google.com/analytics/answer/9744165)
- [GA4 Connector Documentation](https://support.google.com/looker-studio/answer/9823652)

### Key Configuration Files
- Dashboard Templates: `dashboard-templates.json`
- Best Practices Guide: `LOOKER_STUDIO_GA4_GUIDE.md`
- Implementation Checklist: Below

---

## Implementation Checklist

### Pre-Launch
- [ ] GA4 property set up and tracking
- [ ] GA4 property admin access verified
- [ ] Looker Studio account created
- [ ] GA4 data source connected
- [ ] Test data displaying in dashboard

### Dashboard Creation
- [ ] KPIs defined and prioritized
- [ ] Chart types selected
- [ ] Color scheme finalized
- [ ] Branding elements added
- [ ] Responsive design tested on mobile
- [ ] Filters configured and tested
- [ ] Cross-page drill-down working

### Quality Assurance
- [ ] Data accuracy verified vs GA4
- [ ] All metrics calculating correctly
- [ ] Charts formatting properly
- [ ] Mobile view optimized
- [ ] Permission levels set correctly
- [ ] Documentation completed

### Automation & Delivery
- [ ] Email schedule configured
- [ ] Recipients list finalized
- [ ] PDF formatting verified
- [ ] Test email sent and received
- [ ] Schedule timing confirmed
- [ ] Escalation process documented

### Handoff & Training
- [ ] Dashboard access granted
- [ ] Usage documentation provided
- [ ] KPI definitions documented
- [ ] Filter options explained
- [ ] Refresh schedule communicated
- [ ] Support process established

