# Widget: Result

- **Id:** `result` · **File:** `ResultWidget.qml` · **Data function:** `result(context, settings)`
- **Width:** 1 column
- **Purpose:** the profit or loss of the period as one big number, with a comparison underneath.

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |
| `compare` | "none", "budget", "previousYear" | "budget" | three options: No comparison, Budget, Previous year |

## Data

- Result = revenue minus costs of the period (section 7): `currentBalance("BClass=4", start, end).total`
  inverted, minus `currentBalance("BClass=3", start, end).total`.
- Budget: the same with `budgetBalance` over the same dates.
- Previous year: the same with `previousYear(1)`, over the same dates one year earlier (29 February
  becomes 28 February).
- Difference in percent of the compared value (absolute value of the compared value as divisor).

## Display

- Title "Result"; subtitle: the period in words.
- The value large (largest font of the dashboard), in **good** color for a profit and **bad** color for a
  loss, followed by the word "profit" or "loss" in the same color, smaller.
- Note underneath, in muted text: "Budget 120'000.00" or "Previous year 98'000.00", then the difference
  with its sign in percent, e.g. "+4.2%", in good color if the result is higher than the compared value,
  bad color if lower.

## Missing data

- Comparison zero: note "No budget" or "No data for the previous year" (no percent).
- No movements in the period: the value 0.00, word "profit" not shown, note "No revenue or costs
  recorded in this period".
