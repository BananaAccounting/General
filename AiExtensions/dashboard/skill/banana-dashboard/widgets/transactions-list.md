# Widget: Latest transactions

- **Id:** `transactionsList` · **File:** `TransactionsListWidget.qml` · **Data function:** `transactionsList(context, settings)`
- **Width:** 4 columns
- **Purpose:** the last transactions recorded in the period.

## Settings (gear on the widget)

| Setting | Values | Default | Control |
|---|---|---|---|
| `period` | "dashboard" or a period of section 5a | "dashboard" | `PeriodPicker` with "Dashboard period" as first choice |
| `rows` | 5 to 20 | 8 | number field or list "Number of transactions" |

## Data

- Rows of the Transactions table read from the last one backwards, keeping those with a `Date` in the
  period, until `rows` are found. Rows without a date or without an amount are skipped.
- For each: date (`toLocaleDateFormat`), document (`Doc`), description, accounts as "debit / credit"
  (`AccountDebit` / `AccountCredit`, either may be empty), amount (`Amount`).

## Display

- Title "Latest transactions"; subtitle: the period in words.
- A table without borders: columns Date, Doc, Description (takes the remaining width, shortened with
  "..."), Accounts, Amount (right-aligned). Header row in small muted text; rows separated by a thin
  line in the grid color.

## Missing data

- No transactions in the period: "No transactions in this period".
