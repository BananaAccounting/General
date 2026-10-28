# Widget: Largest costs

- **Id:** `costsList` · **File:** `CostsListWidget.qml` · **Data function:** `costsList(context, settings)`
- **Width:** 2 columns
- **Purpose:** the cost accounts with the highest amounts of the period.

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |
| `rows` | 3 to 15 | 6 | number field or list "Number of accounts" |

## Data

- Each real account of BClass 3 (section 6) with its `.total` over the period; accounts with 0 left
  out; sorted from the largest; the first `rows`.
- Share of each amount relative to the largest (for the bars).

## Display

- Title "Largest costs"; subtitle: the period in words.
- One row per account: account id and description on the left (shortened with "...", never overlapping
  the amount), the amount right-aligned; under it a thin bar (4 px, rounded) on the track color, in the
  **costs** color, its length relative to the largest amount.

## Missing data

- No costs in the period: "No costs recorded in this period".
