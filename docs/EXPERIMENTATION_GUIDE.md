# Comprehensive A/B Testing and Experimentation Analytics Guide

## Table of Contents

1. [GA4 Experiment Setup](#ga4-experiment-setup)
2. [Statistical Significance](#statistical-significance)
3. [Conversion Lift Measurement](#conversion-lift-measurement)
4. [Multi-Variant Testing](#multi-variant-testing)
5. [Test Result Analysis](#test-result-analysis)
6. [Best Practices](#best-practices)

---

## GA4 Experiment Setup

### Important Context: GA4 Native Testing

Google Analytics 4 **does not have a native A/B testing tool** built into the platform. Google Optimize was discontinued in September 2023. To run A/B tests, you must use third-party A/B testing platforms that integrate with GA4.

### How It Works

1. **Third-party tool** handles experiment delivery and traffic splitting
2. **GA4** serves as the analysis engine for interpreting results
3. Data flows from the testing tool to GA4 via custom events

### Setting Up GA4 Integration

#### Step 1: Create Custom Events in GA4

Custom events allow you to track experiment impressions and variant assignments:

```
Event Name: experiment_impression
Parameters:
  - experiment_name (string): Name of the experiment
  - variant_id (string): Which variant the user sees
  - experiment_group (string): Control or variant identifier
```

**Event Naming Rules:**
- Event name cannot exceed 40 characters
- Should describe what you intend to measure
- Maximum 500 custom events per GA4 property
- Custom events appear in reports after 24 hours

#### Step 2: Implement Using Google Tag Manager (GTM)

Create a trigger in GTM that fires when users enter an experiment:

```
Trigger Configuration:
- Type: Custom event
- Event name: experiment_impression
- Fire when: experiment conditions are met

Tag Configuration:
- Type: GA4 Event tag
- Event parameters:
  - experiment_name: {{ experiment_name }}
  - variant_id: {{ variant_id }}
  - variant_index: {{ variant_index }}
```

#### Step 3: Send Conversion Events with Variant Data

Pass experiment variant information with conversion events:

```
Conversion Event: purchase (or your conversion metric)
Include parameters:
  - experiment_name
  - variant_id
```

#### Step 4: Validate Implementation

Use **DebugView** in GA4 to verify events are being captured correctly:
- Navigate to Admin > DebugView
- Open your website with GTM debug mode enabled
- Check that experiment_impression and conversion events appear
- Verify all parameters are populated correctly

#### Step 5: Create GA4 Reporting Views

**Option A: Custom Dimension Method**
- Add custom dimension "experiment" to GA4
- Populate dimension value when configuration tag loads
- Use Exploration reports filtered by custom dimension

**Option B: Audience-based Segmentation**
- Create GA4 audiences for each variant
- Use audiences in conversion reports
- Segment analysis by audience/variant

### Third-Party Testing Platform Integration

Popular platforms with deep GA4 integration:
- **Optimizely**: Full API integration, sends impressions and conversions
- **VWO**: Native GA4 connector
- **AB Tasty**: Automatic event forwarding
- **Convert Experiences**: Custom event configuration
- **Kameleoon**: Built-in GA4 connection

**Benefits of integrated platforms:**
- Automatically push impressions, conversions, and revenue to GA4
- Variant identifiers included in all events
- Can pull GA4 audiences for experiment targeting
- No manual data stitching required

### Test Duration Recommendations

- **Minimum duration:** 2 weeks (accounts for weekly traffic patterns)
- **Ideal duration:** 3-4 weeks
- **Longer conversion cycles:** Extend to capture full customer journey

---

## Statistical Significance

### Core Concepts

**Statistical Significance** means results are unlikely to be caused by random chance or fluctuation. It quantifies whether an observed difference is real or due to sampling variability.

### Understanding P-Values

- **P-value:** Probability that observed results occurred by random chance, assuming no real difference exists
- **Alpha level (α):** Acceptable risk of incorrectly rejecting the null hypothesis
- **Standard alpha:** 0.05 (5%), meaning 1 in 20 chance of false positive
- **Decision rule:** If p-value < alpha, results are statistically significant

### Confidence Intervals

A confidence interval estimates the range where the true difference in performance likely falls.

**Example:**
- Result: 5% conversion lift
- 95% Confidence Interval: 2% to 8%
- Interpretation: We can be 95% confident the true effect lies between 2-8%

**Practical Decision Framework:**

| Effect Size | Interval Width | Action |
|------------|----------------|--------|
| Large effect | Narrow interval | Ship it |
| Large effect | Wide interval | Collect more data |
| Small effect | Narrow interval | Consider pausing |
| Small effect | Wide interval | Rethink test |

**Important:** If the confidence interval includes zero, there's insufficient evidence of a real difference.

### Calculating Statistical Significance

#### Manual Calculation Method

**Step 1: Calculate Conversion Rates**
```
Conversion Rate = Conversions / Visitors
Control: 500 conversions / 50,000 visitors = 1.00%
Variant: 570 conversions / 50,000 visitors = 1.14%
```

**Step 2: Calculate the Difference**
```
Lift = (Variant Rate - Control Rate) / Control Rate
Lift = (1.14% - 1.00%) / 1.00% = 14%
```

**Step 3: Calculate Standard Error**
```
Standard Error = √[(p1(1-p1)/n1) + (p2(1-p2)/n2)]

p1 = Control conversion rate
p2 = Variant conversion rate
n1 = Control visitors
n2 = Variant visitors
```

**Step 4: Calculate Z-Score**
```
Z-Score = (p2 - p1) / Standard Error
```

**Step 5: Determine P-Value**
- Use Z-score to find p-value from standard normal distribution
- Common z-scores:
  - Z = 1.96 → p = 0.05 (95% confidence)
  - Z = 2.576 → p = 0.01 (99% confidence)

#### Using Calculators

Free online calculators available:
- [SurveyMonkey A/B Testing Significance Calculator](https://www.surveymonkey.com/mp/ab-testing-significance-calculator/)
- [VWO A/B Test Significance Calculator](https://vwo.com/tools/ab-test-significance-calculator/)
- [Convert.com Calculator](https://www.convert.com/calculator/)
- [CXL AB Test Calculator](https://cxl.com/ab-test-calculator/)
- [ABTestGuide Calculator](https://abtestguide.com/calc/)

### Statistical Power

**Statistical Power** = Probability of detecting a real effect when it exists

- **Standard target:** 80% power
- Interpretation: 80% chance of finding the effect if it truly exists
- Trade-off: Higher power requires larger sample size

### Sample Size Planning

#### Key Inputs for Sample Size Calculation

1. **Baseline Conversion Rate:** Historical conversion rate for control
2. **Minimum Detectable Effect (MDE):** Smallest meaningful lift you want to detect
3. **Statistical Significance (Alpha):** Usually 0.05 (95% confidence)
4. **Statistical Power (Beta):** Usually 0.80 (80% power)

#### Minimum Detectable Effect (MDE)

- **Definition:** Smallest relative change in conversion rate worth detecting
- **Guideline:** 2-5% MDE is reasonable as a default
- **Relationship:** MDE inversely proportional to sample size
  - Smaller MDE → Larger sample needed
  - Larger MDE → Smaller sample needed

#### Example Calculations

**Scenario 1:** 5% baseline conversion rate, 10% MDE
- Required conversions: ~2,922 per variant
- With 2% conversion rate: ~146,100 visitors per variant

**Scenario 2:** 5% baseline conversion rate, 5% MDE
- Required conversions: ~11,141 per variant
- With 2% conversion rate: ~557,050 visitors per variant

### Type I and Type II Errors

| | Reject H0 (Declare Winner) | Fail to Reject H0 |
|---|---|---|
| **H0 is True** (No real difference) | Type I Error (False Positive) | Correct ✓ |
| **H0 is False** (Real difference) | Correct ✓ | Type II Error (False Negative) |

- **Type I Error Rate:** Alpha (α) - typically 5%
- **Type II Error Rate:** Beta (β) - typically 20%
- **Power:** 1 - β = 80%

---

## Conversion Lift Measurement

### What Is Conversion Lift?

Conversion lift measures the **incremental impact** of a marketing intervention on conversion rates. It answers: "How many additional conversions did this change generate?"

### Types of Lift Metrics

**Absolute Lift**
```
Absolute Lift = Exposed Group Conversions - Control Group Conversions
Example: 570 - 500 = 70 additional conversions
```

**Relative Lift**
```
Relative Lift % = ((Exposed - Control) / Control) × 100
Example: ((570 - 500) / 500) × 100 = 14%
```

**Conversion Rate Lift**
```
Conversion Rate Lift = Exposed Conversion Rate - Control Conversion Rate
Example: 1.14% - 1.00% = 0.14 percentage points
```

### Conversion Lift Study Methodology

#### Study Design: Randomized Controlled Trial

**Treatment Group:** Exposed to the variant (sees new experience)
**Control Group:** Not exposed, maintains original experience (holdout)

**Key Requirements:**
- Random assignment of users to groups
- Groups are equivalent in all aspects except the treatment
- Both groups tracked over same time period
- Sufficient sample size in each group

#### Implementation Steps

**Step 1: Define Conversion Metrics**
- Primary metric (e.g., purchase)
- Secondary metrics (add-to-cart, form submission)
- Test upper and mid-funnel metrics for better significance odds

**Step 2: Determine Study Duration**
- **Minimum:** 14 days (captures weekly traffic patterns)
- **Longer:** If conversion has long consideration cycle
- **Recommendation:** 3-4 weeks for most scenarios

**Step 3: Set Sample Size Requirements**
- Calculate required sample for each group
- Ensure adequate daily traffic to reach targets
- Account for traffic variability

**Step 4: Monitor Key Metrics**
- Conversion rate for each group
- Conversion count (absolute numbers)
- Revenue impact (if applicable)
- Segment analysis (devices, geography, cohorts)

**Step 5: Calculate Incremental Impact**
```
Incremental Conversions = (Exposed Rate - Control Rate) × Exposed Users
Example: (1.14% - 1.00%) × 500,000 = 7,000 additional conversions
```

### Segmentation Analysis

Measure lift across important segments:
- **Device type:** Mobile, tablet, desktop
- **Geography:** Region, country, language
- **Audience cohorts:** New users, returning users, high-value
- **Traffic source:** Organic, paid, direct, referral
- **Time period:** Daily, weekly trends

### Privacy-Compliant Measurement

Conversion lift studies work without individual user tracking:
- Apple's App Tracking Transparency compatible
- Works with Google's cookie deprecation plans
- Group-level analysis doesn't require 1st-party ID matching
- Increasingly important as privacy regulations tighten

---

## Multi-Variant Testing

### What Is Multivariate Testing?

Multivariate testing (MVT) tests multiple variations of multiple elements in a single experiment. Unlike A/B testing (2 variants of 1 element), MVT can test numerous element combinations simultaneously.

### Variables vs. Variations

- **Variables:** The elements you're changing (e.g., button color, headline, image)
- **Variations:** The different options for each variable

**Example:** Testing homepage redesign
- Variable 1: Hero image (3 options)
- Variable 2: Headline (2 options)
- Variable 3: CTA button color (2 options)
- **Total combinations:** 3 × 2 × 2 = 12 variants

### Test Design Approaches

#### Full Factorial Testing

Tests all possible combinations of all variables.

**Pros:**
- Captures all interaction effects
- Complete understanding of variable interactions
- Most statistically powerful

**Cons:**
- Requires largest sample size
- More traffic/time needed
- Most complex to manage

**Formula:** Combinations = V1 options × V2 options × V3 options...

#### Partial Factorial Testing

Tests subset of combinations, prioritizing likely winners.

**Pros:**
- Reduces required sample size
- Faster to reach conclusions
- More practical for limited traffic

**Cons:**
- Misses some interaction effects
- Requires assumptions about variables
- May not find optimal combination

### Planning a Multivariate Test

#### Step 1: Identify Problem Areas

Analyze current page performance:
- Which elements underperform?
- Where do users drop off?
- What elements have highest impact?

#### Step 2: Prioritize Variables

Order variables by impact:
1. **High impact, uncertain:** Primary candidates
2. **High impact, confident:** Monitor but may not test
3. **Low impact:** Skip testing

#### Step 3: Define Variations

Create meaningful variations:
- Test 2-3 variations per variable (not 10+)
- Ensure variations differ meaningfully
- Avoid radical changes that confound results

#### Step 4: Set Hypothesis

**Format:**
"We believe that [variable change] will increase [metric] because [reason]."

**Example:**
"We believe that changing the button color from blue to red will increase CTR by 15% because red creates more urgency and draws attention."

#### Step 5: Calculate Sample Size

**Challenge:** Multiple combinations need proportional traffic

```
Sample per variant = Total required sample / Number of combinations

Example:
Total conversions needed: 1,000
Combinations: 12
Sample per variant: ~83 conversions per variant
```

If insufficient traffic, consider:
- Reducing number of variables
- Increasing test duration
- Using partial factorial approach

### Statistical Considerations

**Interaction Effects:** How variables work together

**Example:** Red button drives clicks, but not with aggressive headline.
- One variable doesn't work standalone
- Combined effect is different from individual effects
- Full factorial captures these

**Multiple Testing Problem:** More combinations = higher false positive risk

**Solution:** Adjust significance threshold or use statistical corrections
- Bonferroni correction
- False Discovery Rate control
- Sequential testing methods

### Practical MVT Workflow

1. Create 2-5 variables max (balance complexity)
2. Create 2-3 variations per variable
3. Design full or partial factorial approach
4. Calculate minimum sample size
5. Run test for predetermined duration (don't peek)
6. Analyze main effects and interactions
7. Implement best combination
8. Validate with follow-up test

---

## Test Result Analysis

### Confidence Intervals and Effect Size

#### Understanding Confidence Intervals

A confidence interval defines the range where the true effect likely falls.

**95% Confidence Interval Interpretation:**
"If we repeated this test 100 times, the confidence interval would contain the true effect 95 times."

**Example Result:**
- Observed lift: 5%
- 95% CI: [2%, 8%]
- We can be confident true lift is between 2-8%

**Wide vs. Narrow Intervals:**
- **Narrow:** More data, precise estimate
- **Wide:** Less data, uncertain estimate
- Action: If too wide, collect more data

#### Relationship to Sample Size

As sample size increases:
- Confidence interval becomes narrower
- Estimate becomes more precise
- Statistical power increases

**Formula Impact:**
- Doubling sample size narrows CI by ~√2 (1.41x)
- To quarter CI width, need 16x sample size

### P-Values vs. Confidence Intervals

Both measure statistical evidence, inverse perspectives:

- **P-value:** Probability data would occur if no real effect
- **Confidence Interval:** Range of plausible effect sizes

**Equivalence:**
- If 95% CI doesn't contain zero → p < 0.05 (significant)
- If 95% CI contains zero → p > 0.05 (not significant)

**Why Both Matter:**
- P-value: Is there an effect? (yes/no)
- CI: How large is the effect? (magnitude)

### Interpreting Results

#### Clear Winners

**Scenario:** 8% lift, 95% CI [5%, 11%]
- Clear positive effect
- Confidence interval far from zero
- Decision: **Implement change**

#### Clear Losers

**Scenario:** -6% lift, 95% CI [-10%, -2%]
- Clear negative effect
- Confidence interval far from zero (negative)
- Decision: **Revert change, don't implement**

#### Inconclusive Results

**Scenario:** 2% lift, 95% CI [-1%, 5%]
- Confidence interval crosses zero
- Insufficient evidence of real difference
- Decision: **Inconclusive - collect more data or stop**

#### Statistically Significant but Practically Small

**Scenario:** 1% lift, 95% CI [0.5%, 1.5%], p < 0.05
- Statistically significant with large sample
- Effect is practically small
- Decision: **Evaluate business impact vs. effort**

### Segment Analysis

Break down results by important groups:

**By Device:**
- Desktop: 8% lift (significant)
- Mobile: 1% lift (not significant)
- Tablet: 5% lift (borderline)

**By User Type:**
- New users: 12% lift
- Returning users: 2% lift

**By Traffic Source:**
- Organic: 6% lift
- Paid: 3% lift

**Action:** Implement for high-performing segments, refine for others.

### Sequential Testing and Early Stopping

#### The Peeking Problem

Continuously monitoring results inflates false positive rate:
- With 10,000 samples, peeking can inflate false positives 5-10x
- Multiple looks = multiple tests
- Each look increases chance of Type I error

#### When Early Stopping Is Safe

**Group Sequential Testing:**
- Predetermined stopping points
- Statistical adjustments at each point
- Controls false positive rate

**Bayesian Approach:**
- Can stop early without penalty
- Uses prior information
- Anytime-valid inference

#### Safe Early Stopping Rules

1. **Predetermined Schedule:**
   - Commit to looking at data at specific times
   - Example: Every week for 4 weeks
   - Adjust significance thresholds accordingly

2. **Group Sequential Design:**
   - Statistical procedure with error spending
   - Maintains false positive rate at 5%
   - Up to 66% reduction in test duration vs. fixed-size tests

3. **Bayesian Sequential Testing:**
   - No penalty for continuous monitoring
   - Natural stopping when probability threshold reached
   - More intuitive interpretation

### Avoiding Common Analysis Mistakes

#### Mistake 1: P-Hacking

**Definition:** Testing multiple hypotheses until one is "significant"

**Solution:**
- Pre-register hypothesis before test
- Commit to analysis plan in advance
- Use conservative significance threshold for multiple tests

#### Mistake 2: Importance of Sample Size Matching

**Problem:** Comparing 1,000 control visitors to 5,000 variant visitors
- Makes variant appear stronger
- Skews statistical tests
- Unfair comparison

**Solution:**
- Equal sample sizes in control and variant
- Or use statistical tests that account for size differences
- Report traffic along with results

#### Mistake 3: Ignoring Practical Significance

**Problem:** 0.1% statistically significant lift from costly implementation

**Question:** Is it worth the engineering effort?

**Solution:**
- Consider effect size alongside statistical significance
- Evaluate business impact
- Factor in implementation costs

#### Mistake 4: Treating P-Value as Probability

**Wrong:** "There's a 5% chance the variant is better"

**Right:** "If no real difference existed, we'd see these results 5% of the time by random chance"

**Solution:** Use confidence intervals for probability of effect size

### False Positive and False Negative Control

#### Type I Error (False Positive)

"Declaring a winner when there's no real difference"

**Control methods:**
- Set alpha at 0.05 (5%)
- Sufficient sample size
- Pre-registered analysis
- Adjust for multiple comparisons

#### Type II Error (False Negative)

"Missing a real difference"

**Control methods:**
- Adequate statistical power (80%)
- Sufficient sample size
- Reasonable minimum detectable effect

#### Trade-off

More conservative (lower Type I) → Need larger samples
More aggressive (higher power) → Accept more false positives

---

## Best Practices

### Before Starting an Experiment

#### 1. Define Clear Hypotheses

**Strong hypothesis format:**
"Changing [element] from [current] to [proposed] will [direction] [metric] by [amount] because [reasoning]."

**Example:**
"Changing the signup CTA from 'Learn More' to 'Get Started Free' will increase signup rate by 10% because 'Get Started Free' is more direct and removes perceived friction."

#### 2. Choose Right Metrics

**Primary metric:** Directly tied to business goal
- Example for SaaS: Free trial signup rate

**Secondary metrics:** Supporting indicators
- Example: Time on page, scroll depth, return visits

**Guardrail metrics:** Avoid negative side effects
- Example: Bounce rate shouldn't increase

#### 3. Calculate Required Sample Size

**Inputs:**
- Baseline conversion rate
- Minimum detectable effect (2-5% typical)
- Statistical power (80% standard)
- Statistical significance (95% typical)

**Process:**
- Use online calculator
- Note daily traffic required
- Estimate duration needed
- Check if feasible

#### 4. Set Duration in Advance

- Commit to duration before starting
- Avoid peeking at results
- Run for at least 2 weeks
- Account for weekly variations

#### 5. Create Variant Responsibly

**Good variant:**
- Single clear change from control
- Based on user insights
- Tests specific hypothesis
- Not drastically different

**Poor variant:**
- Multiple simultaneous changes
- Extreme design change
- No clear hypothesis
- Hard to implement learning

### During the Experiment

#### 1. Monitor Health Metrics

Weekly checkpoints for:
- Traffic levels (compare to baseline)
- Conversion rate stability
- Event tracking accuracy
- Technical issues

**Do not:** Make decisions based on observed results

#### 2. Ensure Data Quality

- Verify event implementation with DebugView
- Check for duplicate tracking
- Monitor traffic split (should be ~50/50)
- Look for data anomalies

#### 3. Document Changes

Keep record of:
- Any code changes during test
- External events (marketing campaign, feature release)
- Traffic anomalies
- Variant implementation details

#### 4. Avoid Peeking

- Don't check results until test ends
- Use predetermined stopping points if necessary
- Don't terminate early based on perceived winner
- Stick to analysis plan

### After the Experiment

#### 1. Complete Statistical Analysis

- Calculate lift and confidence interval
- Determine statistical significance
- Review assumptions (sample size adequate, randomization successful)
- Check for interaction effects

#### 2. Segment Analysis

Break down results by:
- Device type (mobile, desktop)
- Traffic source
- Geography
- User cohort
- Time period

**Action:** Double-check unusual segments for data quality issues

#### 3. Qualitative Insights

Combine with:
- User testing feedback
- Session recordings
- Support tickets
- Qualitative research

**Question:** Does statistical result align with user behavior?

#### 4. Make Decision

**Decision Framework:**

| Statistically Significant | Effect Size | Action |
|---|---|---|
| ✓ | Large (>5%) | Implement |
| ✓ | Small (<2%) | Evaluate effort |
| ✓ | Negative | Revert |
| ✗ | Any | Inconclusive |

#### 5. Document Learnings

Record for future reference:
- Hypothesis and result
- Segments where it worked/didn't
- Qualitative insights
- Ideas for follow-up tests
- Implementation details for winning variant

### Ongoing Testing Culture

#### 1. Test Regularly

- Continuous experimentation program
- Balance "safe" tests with ambitious ones
- Portfolio approach to testing

#### 2. Build Testing Infrastructure

- Experiment platform integration with analytics
- Templates for common test types
- Documented processes
- Training for team members

#### 3. Share Results

- Regular experiment reports
- Highlight learnings (not just wins)
- Quantify cumulative impact
- Celebrate failures that saved resources

#### 4. Scale Winners

- Implement significant wins
- Continue monitoring post-launch
- Watch for novelty effects wearing off
- Run follow-up tests on related elements

#### 5. Iterate on Losers

- Learn why variant underperformed
- Test variations of losing variant
- Refine hypothesis
- Test with different audience segments

---

## Choosing Your Testing Approach

### Frequentist vs. Bayesian vs. Sequential

#### Frequentist (Classical)

**Best for:**
- Binary results (winner/loser)
- Large sample sizes
- Standard regulatory requirements
- Team unfamiliar with statistics

**Advantages:**
- Simple interpretation
- Fast computation
- Widely accepted
- Familiar to most statisticians

**Disadvantages:**
- Can't peek at data
- Requires larger samples
- Requires predetermined test duration
- P-values can be misinterpreted

**Process:**
1. Calculate sample size before test
2. Run test for predetermined duration
3. Calculate p-value and confidence interval
4. Make binary decision

#### Bayesian

**Best for:**
- Continuous monitoring acceptable
- Small sample sizes (you can't wait)
- Probability of each outcome needed
- Prior information available

**Advantages:**
- Can stop anytime
- Smaller sample sizes often possible
- Intuitive probability results
- Natural incorporation of prior knowledge
- Handles multiple comparisons better

**Disadvantages:**
- Choice of prior affects results
- Less familiar to non-statisticians
- Statistical guarantees less clear
- Computational complexity

**Process:**
1. Define prior distribution (based on history)
2. Start test whenever ready
3. Continuously update probability as data arrives
4. Stop when posterior probability threshold reached

#### Sequential Testing

**Best for:**
- Early stopping desired while maintaining validity
- Safety concerns (healthcare, safety-critical)
- Cost minimization important
- Regular monitoring needed

**Advantages:**
- Maintains statistical validity
- Can stop early in clear cases
- Reduces test duration up to 66%
- Controls false positive rate

**Disadvantages:**
- More complex setup
- Requires predetermined stopping rules
- Needs larger sample if no clear winner
- Implementation expertise required

**Methods:**
- Group Sequential Testing
- Mixture Sequential Probability Ratio Test (mSPRT)
- MaxSPRT

### Recommended Approach by Scenario

| Scenario | Approach | Reason |
|----------|----------|--------|
| Standard business A/B test | Frequentist | Simple, clear, familiar |
| Need results quickly | Bayesian | Smaller samples |
| High-risk decision | Sequential | Maintains statistical validity |
| No historical data | Frequentist | Prior less valuable |
| Rich historical data | Bayesian | Leverage prior information |
| Lots of comparisons | Bayesian/Sequential | Handle multiple testing better |

---

## Implementation Checklist

### Pre-Launch

- [ ] Hypothesis defined and documented
- [ ] Primary metric selected
- [ ] Secondary metrics identified
- [ ] Guardrail metrics defined
- [ ] Sample size calculated
- [ ] Test duration set (minimum 2 weeks)
- [ ] GA4 events configured
- [ ] GTM tags created and tested
- [ ] DebugView confirms event firing
- [ ] Traffic split verified (50/50 or as planned)
- [ ] Variant implementation QA'd
- [ ] Analysis plan documented
- [ ] Team notified of test

### During Test

- [ ] Weekly traffic monitoring
- [ ] No premature peeking at results
- [ ] Data quality checks
- [ ] Event implementation verified
- [ ] No major external changes
- [ ] Document any anomalies

### Post-Launch

- [ ] Statistical analysis complete
- [ ] Confidence intervals calculated
- [ ] Significance determined
- [ ] Segment analysis performed
- [ ] Results validated for data quality
- [ ] Learnings documented
- [ ] Decision made and communicated
- [ ] Implementation plan if winning
- [ ] Follow-up test ideas captured

---

## Key Metrics Reference

### Baseline Conversions Needed by Confidence & Power

| Baseline Conversion Rate | MDE 5% | MDE 10% | MDE 15% |
|---|---|---|---|
| 1% | 11,141 | 2,922 | 1,409 |
| 2% | 5,570 | 1,461 | 705 |
| 5% | 2,228 | 584 | 282 |
| 10% | 1,114 | 292 | 141 |

(Assumes 95% confidence, 80% power)

### Z-Score Reference

| Confidence Level | Z-Score | P-Value |
|---|---|---|
| 90% | 1.645 | 0.10 |
| 95% | 1.96 | 0.05 |
| 99% | 2.576 | 0.01 |
| 99.9% | 3.291 | 0.001 |

### Common Experiment Duration Guidelines

| Conversion Type | Recommended Duration | Reason |
|---|---|---|
| Immediate (purchase, signup) | 2 weeks | Captures weekly patterns |
| Short consideration (email signup) | 2 weeks | Quick decision |
| Medium consideration (free trial) | 3-4 weeks | Decision takes few days |
| Long consideration (SaaS annual) | 4+ weeks | Long evaluation period |

---

## Tools and Resources

### GA4 Documentation
- [Set up events](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [Custom Events in GA4](https://support.google.com/analytics/answer/12229021?hl=en/)
- [A/B Test - Analytics Help](https://support.google.com/analytics/answer/13468470?hl=en)

### Statistical Significance Calculators
- [CXL AB Test Calculator](https://cxl.com/ab-test-calculator/)
- [VWO Statistical Significance Calculator](https://vwo.com/tools/ab-test-significance-calculator/)
- [SurveyMonkey AB Testing Calculator](https://www.surveymonkey.com/mp/ab-testing-significance-calculator/)
- [Statsig Calculator](https://statsig.com/calculator)

### Sample Size Calculators
- [Optimizely Sample Size](https://www.optimizely.com/sample-size-calculator/)
- [CXL Sample Size](https://cxl.com/ab-test-calculator/)
- [Evan Miller's Calculator](https://www.evanmiller.org/ab-testing/sample-size.html)

### A/B Testing Platforms with GA4 Integration
- Optimizely
- VWO (Visual Website Optimizer)
- AB Tasty
- Convert Experiences
- Kameleoon
- Unbounce

### Learning Resources
- [CXL Confidence Intervals Guide](https://cxl.com/blog/confidence-intervals/)
- [Netflix TechBlog on A/B Testing](https://netflixtechblog.com/interpreting-a-b-test-results-false-positives-and-statistical-significance-c1522d0db27a)
- [Analytics Toolkit A/B Testing Guide](https://blog.analytics-toolkit.com/2017/statistical-significance-ab-testing-complete-guide/)
- [Conversion.com Multivariate Testing](https://www.convert.com/blog/a-b-testing/multivariate-testing-complete-guide/)

---

## Conclusion

Effective experimentation requires balancing statistical rigor with practical business considerations. Success comes from:

1. **Planning:** Clear hypotheses, adequate sample sizes, predetermined analysis
2. **Execution:** Proper implementation, data quality, avoiding peeking
3. **Analysis:** Statistical significance, effect size, segment insights
4. **Action:** Implementing winners, learning from losers, continuous iteration

By following this guide and maintaining a culture of experimentation, organizations can systematically improve key metrics and make data-driven decisions across their digital experiences.
