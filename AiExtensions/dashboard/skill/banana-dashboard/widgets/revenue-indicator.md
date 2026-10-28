# Widget: Revenue

- **Id:** `revenue` · **File:** `RevenueWidget.qml` · **Data function:** `revenue(context, settings)`
- **Width:** 1 column
- **Purpose:** the total revenue of the period as one big number.

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |
| `compare` | "none", "budget", "previousYear" | "none" | three options: No comparison, Budget, Previous year |

## Data

- Revenue = `currentBalance("BClass=4", start, end).total`, **inverted** to be positive.
- Budget: `budgetBalance` over the same dates, inverted. Previous year: `previousYear(1)` over the same
  dates one year earlier, inverted.
- Difference in percent of the compared value.

## Display

- Title "Revenue"; subtitle: the period in words.
- The value large, in the **revenue** color.
- Note underneath (only with a comparison): "Budget 150'000.00 -2.4%"; **higher is better**: good color
  when the revenue is higher than the compared value, bad color when lower.

## Missing data

- Comparison zero: note "No budget" or "No data for the previous year".
- No revenue: the value 0.00 and the note "No revenue recorded in this period".
