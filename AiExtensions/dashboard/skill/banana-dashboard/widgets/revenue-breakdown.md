# Widget: Revenue breakdown

- **Id:** `revenueBreakdown` · **File:** `RevenueBreakdownWidget.qml` · **Data function:** `revenueBreakdown(context, settings)`
- **Width:** 2 columns
- **Purpose:** the share of each revenue account of the total revenue.

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |
| `slices` | 3 to 10 | 6 | number field or list "Number of slices" |

## Data

- Each real account of BClass 4 (section 6) with its `.total` over the period, **inverted**; only
  positive values; sorted from the largest.
- The first `slices` accounts; the rest summed as "Other accounts (n)" (if only one account is left,
  show it instead of "others").
- Total and percent of each slice (1 decimal).

## Display

- Recreated from scratch whenever the period, the palette or its settings change (rules 21 and 22):
  no bar, point or slice of the previous data may remain.
- Title "Revenue breakdown"; subtitle: the period in words.
- Left: a pie with a hole (`holeSize` about 0.65, `pieSize` about 0.95); slice colors from the palette
  "pie slices" in order, "others" with its own color; thin borders in the card color between slices; no
  labels on the slices. In the middle, as a sibling of the `GraphsView` (rule 7): "Total revenue" small
  and muted, and the total below it.
- Right: the legend, one row per slice: color swatch, account description (shortened with "...",
  never overlapping the numbers), amount, percent.

## Missing data

- No revenue in the period: instead of the chart, "No revenue recorded in this period".
