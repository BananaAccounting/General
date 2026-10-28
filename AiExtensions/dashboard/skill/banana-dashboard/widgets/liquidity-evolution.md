# Widget: Liquidity evolution

- **Id:** `liquidity` · **File:** `LiquidityWidget.qml` · **Data function:** `liquidity(context, settings)`
- **Width:** 4 columns
- **Purpose:** the balance of the cash and bank accounts through the period: actual up to a cutoff
  date, then forecast from the budget, compared with the budget line. The most useful widget for
  planning.

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `accounts` | account filter (ids separated by `\|`, or `Gr=` with a group) | "" (none) | `AccountPicker` with the real accounts of BClass 1 and the groups |
| `cutoff` | "today", "lastTransaction", or a date `yyyy-mm-dd` | "today" | three options: Today, Date of the last transaction, A date (date field as in section 5a) |
| `showBudget` | true, false | true | check box "Show the budget line" |
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |

## Data

All dates within the selected period, from `start` to `end`.

- **Cutoff C:** today, the date of the last transaction (highest `Date` of the Transactions table), or
  the given date. If C is before `start`, use the day before `start` (all forecast); if after `end`,
  use `end` (no forecast). **Forecast start P** = the day after C, only if C is before `end`.
- **x positions in months:** 0 = `start`; month m (0, 1, 2...) ends at m + 1; a date inside a month
  is the month index plus the fraction of its days.
- **Points:**
  - the opening balance at 0: `opening` of `currentBalance(accounts, start, start)`;
  - the balance at each month end: `projectionBalance(accounts, P, monthStart, monthEnd).balance`, or
    `currentBalance` when there is no P;
  - one more point at C when C falls inside a month: `currentBalance(accounts, start, C).balance`.
  Points up to C are actual, later ones forecast.
- **Budget line** (if `showBudget`): `budgetBalance(accounts, start, date).balance` at the same dates;
  at 0 its `opening`.
- **Summary:** balance at C; lowest balance (actual or forecast) and its date; balance at `end`.

## Display

- Recreated from scratch whenever the period, the palette or its settings change (rules 21 and 22):
  no bar, point or slice of the previous data may remain.
- Title "Liquidity"; subtitle: the period in words · "Actual up to <date> (today)".
- Line chart (rule 10), x axis from 0 to the number of months, one tick per month, each tick labelled
  with the short name of the month that starts there (the last tick has no label); y axis per rule 11.
- Actual: solid line in the **liquidity** color, width 2.5, small points at each value, and a light
  area underneath (liquidity color at 12% opacity) down to 0 (`AreaSeries`, tested list).
- Forecast: dashed line in the same color, width 2, starting from the last actual point.
- Budget: dotted line in the **budget** color, width 2, drawn first so the others stay on top.
- A thin vertical line at C over the plot area, labelled "Today" (or the date) at the top (rule 7).
- A thicker grid line at 0 when the axis goes below 0.
- Under the chart a row of three figures: "Balance today" (or "Balance at <date>"), "Lowest forecast
  (<date>)", "Balance at end of period"; the last two in **bad** color when negative.
- Legend: Actual (solid), Forecast (dashed), Budget (dotted).

## Missing data

- No accounts chosen: instead of the chart, "Choose the cash and bank accounts with the gear of this
  widget".
- No budget movements on these accounts after C (`budgetBalance` from P to `end`: debit and credit
  zero): under the chart "No budget movements after <date>: the forecast stays flat. Enter the planned
  movements in the Budget table".
- Budget line requested but no budget movements in the whole period: hide it and write "Budget line
  not available: no budget movements on these accounts".
- `projectionBalance` not available (older Banana): show it in the widget's error line.
