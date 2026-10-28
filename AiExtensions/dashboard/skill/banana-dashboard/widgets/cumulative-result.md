# Widget: Cumulative result

- **Id:** `cumulativeResult` · **File:** `CumulativeResultWidget.qml` · **Data function:** `cumulativeResult(context, settings)`
- **Width:** 2 columns
- **Purpose:** how the result (profit or loss) builds up month after month, compared with the budget or
  the previous year: is the year on track, and where is it heading?

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |
| `compare` | "none", "budget", "previousYear" | "budget" | three options: No comparison, Budget, Previous year |

## Data

- For each month of the period (section 7): the result of the month = revenue (`.total` of `BClass=4`,
  inverted) minus costs (`.total` of `BClass=3`); the **cumulative result** = the sum of the results
  from the first month of the period to that month.
- Actual values only up to the month of the last transaction; later months have no value
  (section 7, "Last transaction").
- Budget: the same, month by month, with `budgetBalance`, for **all** the months of the period.
- Previous year: the same with `previousYear(1)`, on the same months one year earlier (29 February
  becomes 28 February), for all the months of the period.
- Result up to the month of the last transaction: the last actual cumulative value. Compared value: the budget or
  previous year cumulative value of the same month, and the difference.

## Display

- Recreated from scratch whenever the period, the palette or its settings change (rules 21 and 22):
  no bar, point or slice of the previous data may remain.
- Title "Cumulative result"; subtitle: the period in words · "Result up to <month of the last transaction>: 12'345.00" (e.g.
  "Result up to October 2026") followed by
  the word "profit" or "loss" in good or bad color.
- Line chart (rule 10): x axis = month index (0, 1, 2... from -0.5 to the number of months - 0.5, one
  tick per month) with the short month names as labels; y axis per rule 11, always including 0.
- Actual: solid line in the **result** color, width 2.5, a small point (8 px, white border) at each
  month.
- Comparison: dotted line in the **budget** color, width 2, drawn first so the actual line stays on top.
- The grid line at 0 is drawn 1.5 px in the text muted color, so the border between profit and loss is
  clearly visible; the other grid lines as in section 7a.
- Under the chart, in muted text: "Budget up to <same month> 30'000.00" (or "Previous year up to <same month> ...") and the
  difference with its sign, in good color if the result is higher, bad color if lower.
- Legend: Actual (solid), Budget or Previous year (dotted).

## Missing data

- No revenue and no costs in the period: instead of the chart, "No revenue or costs recorded in this
  period".
- Comparison chosen but no data (budget zero, or no previous year file): hide the comparison line and
  write under the chart "No budget: the comparison line is not shown" (or "No previous year file linked
  in the file properties").
