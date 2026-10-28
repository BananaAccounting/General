# Widget: Revenue and costs per month

- **Id:** `revenueCostsBars` · **File:** `RevenueCostsBarsWidget.qml` · **Data function:** `revenueCostsBars(context, settings)`
- **Width:** 2 columns
- **Purpose:** compare revenue and costs month by month.

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |

## Data

- For each month of the period (section 7): revenue (`.total` of `BClass=4`, inverted) and costs
  (`.total` of `BClass=3`). Months after the month of the last transaction (section 7): no bars (0).
- Totals of the period for the subtitle.

## Display

- Recreated from scratch whenever the period, the palette or its settings change (rules 21 and 22):
  no bar, point or slice of the previous data may remain.
- Title "Revenue and costs"; subtitle: the period in words.
- Bar chart: `BarCategoryAxis` with the short month names; one `BarSeries` with two `BarSet`: revenue
  (revenue color) and costs (costs color), `barWidth` about 0.6, `borderWidth: 0`; y axis per rule 11.
- Legend: Revenue, Costs.

## Missing data

- No revenue and no costs in the period: instead of the chart, "No revenue or costs recorded in this
  period".
