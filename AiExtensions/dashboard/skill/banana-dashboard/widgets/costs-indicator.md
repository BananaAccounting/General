# Widget: Costs

- **Id:** `costs` · **File:** `CostsWidget.qml` · **Data function:** `costs(context, settings)`
- **Width:** 1 column
- **Purpose:** the total costs of the period as one big number.

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |
| `compare` | "none", "budget", "previousYear" | "none" | three options: No comparison, Budget, Previous year |

## Data

- Costs = `currentBalance("BClass=3", start, end).total` (positive as it is).
- Budget: `budgetBalance` over the same dates. Previous year: `previousYear(1)` over the same dates one
  year earlier.
- Difference in percent of the compared value.

## Display

- Title "Costs"; subtitle: the period in words.
- The value large, in the **costs** color.
- Note underneath (only with a comparison): "Budget 80'000.00 +3.1%"; **lower is better**: good color
  when the costs are lower than the compared value, bad color when higher.

## Missing data

- Comparison zero: note "No budget" or "No data for the previous year".
- No costs: the value 0.00 and the note "No costs recorded in this period".
