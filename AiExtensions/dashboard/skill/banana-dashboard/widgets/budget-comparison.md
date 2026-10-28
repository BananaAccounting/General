# Widget: Budget comparison

- **Id:** `budgetComparison` · **File:** `BudgetComparisonWidget.qml` · **Data function:** `budgetComparison(context, settings)`
- **Width:** 2 columns
- **Purpose:** revenue, costs and result of the period against the budget of the same period.

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |

## Data

For revenue, costs and result (section 7): actual with `currentBalance`, budget with `budgetBalance`
over the same dates, difference (actual minus budget), actual in percent of budget (1 decimal; "-" if
the budget is 0).

## Display

- Title "Budget comparison"; subtitle: the period in words.
- Three rows, one per measure. Each row:
  - the label on the left, the percent on the right;
  - a track bar (track color, rounded): the actual as a bar in the measure's color (revenue, costs,
    result), its length relative to the larger of actual and budget; the budget as a short vertical
    marker in the text color at its position;
  - under it in small text: "Actual X · Budget Y" and the difference with its sign, in good color if
    better and bad color if worse (revenue and result: higher is better; costs: lower is better).
- Legend: Actual (bar), Budget (marker).

## Missing data

- Budget zero for all three measures: instead of the rows, "No budget found. Enter amounts in the
  Budget column of the Accounts table or in the Budget table".
