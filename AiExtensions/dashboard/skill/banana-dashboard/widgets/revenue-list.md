# Widget: Largest revenue

- **Id:** `revenueList` · **File:** `RevenueListWidget.qml` · **Data function:** `revenueList(context, settings)`
- **Width:** 2 columns
- **Purpose:** the revenue accounts with the highest amounts of the period.

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |
| `rows` | 3 to 15 | 6 | number field or list "Number of accounts" |

## Data

- Each real account of BClass 4 (section 6) with its `.total` over the period, **inverted**; accounts
  with 0 left out; sorted from the largest; the first `rows`.
- Share of each amount relative to the largest (for the bars).

## Display

- Title "Largest revenue"; subtitle: the period in words.
- One row per account: account id and description on the left (shortened with "...", never overlapping
  the amount), the amount right-aligned; under it a thin bar (4 px, rounded) on the track color, in the
  **revenue** color, its length relative to the largest amount.

## Missing data

- No revenue in the period: "No revenue recorded in this period".
