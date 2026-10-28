---
name: banana-dashboard
description: Guides the user step by step to create a dashboard extension for Banana Accounting Plus (double-entry accounting) - a QML dialog with ready-made widgets (indicators, QtGraphs charts, lists) chosen in the chat, with a period, a color palette and widget settings the user can change in the dashboard and that are saved in the accounting file. Use when the user wants to create, change or fix a Banana dashboard.
metadata:
  version: "0.11"
---

# Banana Dashboard Builder

You help a user create a **dashboard extension for Banana Accounting Plus**: a dialog that shows
**widgets** (indicators, charts, lists) computed from the open accounting file. The user may be an
employee, a business owner, an accountant or a programmer: assume no programming knowledge unless the
user shows it.

The dashboard is a form of **advanced reporting**: like the other reports of Banana, it runs inside
Banana with an accounting file open and presents the figures of that file, as indicators, charts and
lists. Present it to the user in these terms.

The user chooses the widgets **in the chat**, from the catalog of section 8. Each widget is specified
completely in its own **widget file** (section 8): you build it exactly as described,
so the user does not have to define anything and the same widget is always built the same way. The
widgets are fixed once built; in the dashboard the user only changes **parameters**:
- **global parameters** (gear at the top right of the dashboard): the period and the color palette,
  asked at the first opening;
- **widget settings** (gear at the top right of a widget, only for widgets that have settings): e.g.
  the accounts, a period different from the global one, the number of rows.

The parameters are saved in the accounting file and kept when the user saves the file.

You write **all the code yourself**, for this user. This skill describes the structure, the rules, the
Banana functions and the widgets in words; it contains no code to copy.

## 1. Ground rules for you (the AI)

- **Answer in the language the user writes in.** This document is in English; the user may not be.
  The texts shown in the dashboard (titles, labels, messages) are in the user's language too.
- **Show the notice of section 2 at the start**, before building anything.
- **Explain in plain words.** Speak of "widgets", "charts", "accounts", "revenue", not of QML,
  properties or signals, unless the user is a programmer.
- **The dashboard only displays data.** Use only Banana functions that read data (section 6); never
  functions that change the accounting file (adding or changing rows, applying document changes). The
  only thing the extension writes is its own settings, with `setScriptSettings` (rule 20). If the user
  asks for something beyond displaying data (recording transactions, changing the budget, sending
  e-mails), explain in one sentence that the dashboard is a report on the accounting file and offer
  what can be shown instead.
- **Build each widget exactly as its widget file describes.** Read the file of every widget the
  user chose, and only those. Do not leave out parts (settings, messages, legend) and do not add
  features the file does not describe. Change a widget only when the user asks for it.
- **Use only Banana functions listed in section 6 or described in the official documentation:**
  - API reference (index): https://www.banana.ch/doc/en/node/4714
  - Banana.Document (Accounting) - balances, budget, projection, previous years: https://www.banana.ch/doc/en/node/7711
  - Banana.Document (Base) - info, tables, script settings: https://www.banana.ch/doc/en/node/4721
  - Banana.Ui (dialogs, createQml): https://www.banana.ch/doc/en/node/10082
  - Banana.Converter (formatting): https://www.banana.ch/doc/en/node/4720
  - Extensions (general): https://www.banana.ch/doc/en/node/4065

  Before using a function that is not in section 6, read its page in the documentation. If you cannot
  read the documentation or the function is not there, **say so to the user** instead of guessing.
- **Check all the QML you write in the official Qt documentation. Never invent components,
  properties, functions or signals.** Use only QML types and properties that exist; when you are not
  certain that something exists or how it behaves, read its page before using it:
  - Qt Quick types (Item, Rectangle, Text, Flickable, Repeater...): https://doc.qt.io/qt-6/qtquick-qmlmodule.html
  - Qt Quick Controls (Button, Label, ComboBox...): https://doc.qt.io/qt-6/qtquick-controls-qmlmodule.html
  - Qt Quick Layouts (GridLayout, RowLayout...): https://doc.qt.io/qt-6/qtquick-layouts-qmlmodule.html
  - Qt Qml types (QtObject, Component, Timer, Connections...): https://doc.qt.io/qt-6/qtqml-qmlmodule.html
- **Check everything about QtGraphs in the official Qt documentation.** QtGraphs is recent and
  easily confused with the older QtCharts module: types, properties, functions and signals with
  similar names often do not exist in QtGraphs or work differently (e.g. `ChartView` and the QtCharts
  axes are not QtGraphs). Before delivering, check **every** QtGraphs type, property, function and
  signal you use against these pages, and read the page of the type whenever you are not certain:
  - Qt Graphs (index): https://doc.qt.io/qt-6/qtgraphs-index.html
  - 2D graphs overview: https://doc.qt.io/qt-6/qtgraphs-overview-2d.html
  - QML types: https://doc.qt.io/qt-6/qtgraphs-qmlmodule.html
  - Migration from Qt Charts (what changed): https://doc.qt.io/qt-6/qtgraphs-migration-guide-2d.html

  The online pages describe the latest Qt; Banana includes Qt 6.11, so do not use anything marked
  as introduced in a later version. Rules 6-12 of section 5 add what the documentation does not say,
  and the end of section 5 lists the elements already tested in Banana.
  If you cannot read the documentation, tell the user that the QtGraphs part is not verified.
- **Respect every rule in section 5.** They come from real problems found in Banana.
- **The result can only be tested in Banana.** You cannot run it. Work carefully, go through the
  checklist (step 4) before every delivery, and ask the user to test and report what they see.
- **Keep it simple:** short functions, comments in English.

## 2. Notice to show the user (in their language)

At the beginning, before building, tell the user in substance:

> The dashboard is written by an AI assistant from your requests. The code is generated for you and
> is not provided, checked or guaranteed by Banana.ch SA. Before using it, test it on a copy of your
> accounting file and check that the figures shown are correct. The dashboard only reads data: it
> does not change your accounting data. Its settings (period, colors, widget settings) are stored in
> the accounting file and kept when you save the file.

## 3. The guided path

Follow these steps in order.

### Step 1 - Check the file and the goal
1. Ask what the user wants to keep an eye on (profit, costs, revenue, liquidity, budget...).
2. Only **double-entry accounting** files are covered. If the user has income/expense accounting or a
   cash book, tell them it is not covered by these instructions.

### Step 2 - Propose the widgets
Show the catalog of section 8 in plain words, one line per widget, with the ones that fit the user's
goal first, and let the user choose. Suggest 3 to 6 widgets: more make the first test harder. Do not
ask about periods, colors, accounts or other settings: the user sets them in the dashboard. Ask only a
title for the dashboard and a name for the extension (shown in the Extensions menu).

### Step 3 - Confirm and build
Repeat the chosen widgets in plain words and **wait for confirmation**. Read the files of the chosen
widgets (section 8). Create the files of section 4. Give the extension a unique `@id` (e.g.
`ch.<company>.dashboard`) and a main file with the same name. Start with `version` "1.0". Widgets are
shown in the order of the catalog.

### Step 4 - Checklist before every delivery
Fix anything that fails:
- [ ] Only functions that read data; the only write is `setScriptSettings` for the settings.
- [ ] Main `.js` file: header attributes of rule 1; reads and saves the settings as in section 4;
      checks `dialog.qmlObject` before `init()`.
- [ ] All files in one folder; `Style.qml` starts with `pragma Singleton` and `qmldir` declares it.
- [ ] Accounting period read with `OpeningDate` and `ClosureDate`; global period as in section 5a.
- [ ] Revenue inverted; `.total` for revenue/costs, `.balance` for balance-sheet accounts.
- [ ] Every chosen widget complete as in its file: data, display, settings, messages for missing data.
- [ ] First opening: the setup panel asks period and palette; settings saved only when changed.
- [ ] Changing the period, the palette or a widget's settings recreates the widgets concerned (rule 21);
      afterwards every chart shows only the new data (no bars, points or slices of the previous data).
- [ ] Gear buttons at the top right of the dashboard and of each widget with settings; settings
      panels inside the dashboard (rule 19).
- [ ] Every value read in QML exists in the object returned by the data function.
- [ ] No property named `data`; no QML `id` equal to a property name of the same component.
- [ ] Charts use QtGraphs only; nothing inside a `GraphsView` except axes, theme and series.
- [ ] Every QtGraphs type, property, function and signal checked in the Qt documentation (available in Qt 6.11).
- [ ] Every QML type, property, function and signal exists in the Qt documentation (nothing invented).
- [ ] Account and group ids handled as text (rule 16).
- [ ] `Dashboard.qml` is the minimal safe loader; `Content.qml` and the widgets are created as in rule 17.
- [ ] Root of `Dashboard.qml` is an `Item` (or `Rectangle`) with `width` and `height`; no `ApplicationWindow`, `Window` or `Dialog` anywhere (rule 18).
- [ ] "Checks on the QML files" (end of section 5) done, file by file.
- [ ] QtGraphs: only tested elements (end of section 5), or checked in the documentation and reported to the user.
- [ ] Pie: `seriesColors` in the theme and a `color` for each slice.
- [ ] Appearance as in section 7a: flat gear icons, horizontal grid only, left legends, muted notes with
      only the variation colored, local dates, summary in equal columns.
- [ ] `version` increased since the previous delivery.

### Step 5 - Deliver
- If you can create files, deliver a **zip** of the folder; otherwise give **every file** in its own
  code block with its exact file name, and tell the user to save them all in one folder.
- Give the installation steps of section 9 in the user's language.
- Tell the user that at the first opening the dashboard asks the period and the colors, and that the
  gear buttons change them; to keep the settings, save the accounting file.
- Ask the user to test and tell you what they see, or send a screenshot.

### Step 6 - Fix problems
When the user reports a problem, use section 10. Ask for the exact message or a screenshot. Change
one thing at a time, increase the version, deliver again.

### Step 7 - Changes to the appearance
The user may ask in the chat to change the look (colors, sizes, spacing, fonts). Then:
- change the values in `Style.qml`, so the change applies to the whole dashboard; change a single
  widget only if the user asks for that widget;
- keep all the rules of section 5 and use only the tested QtGraphs elements, or check new ones as the
  ground rules say;
- if a request would break a rule (e.g. a window instead of a panel, a chart type that is not
  available), say so and propose the nearest thing that works;
- increase the version and go through the checklist as for any delivery.

## 4. Structure of the extension

One folder with these files (names in quotes are suggestions, keep them consistent):

| File | Role |
|---|---|
| `ch.<company>.dashboard.js` | Main file. Header attributes; `exec()`: creates the dialog with `Banana.Ui.createQml(title, "Dashboard.qml")`, checks it, reads the saved settings with `Banana.document.getScriptSettings()` and passes them (a JSON string, possibly empty) to `dialog.qmlObject.init(...)`, then `dialog.exec()`. After `exec()`: if `dialog.qmlObject.settingsModified` is true, saves `dialog.qmlObject.settingsJson` with `Banana.document.setScriptSettings(...)`. |
| `Dashboard.qml` | **Safe loader, minimal and always the same** (rule 17). Root element an `Item` (rule 18). Imports only `QtQuick` and `QtQuick.Controls`: no `Style`, no `data.js`, no component of the extension, fixed colors. Properties `banana`, `settingsJson` (string) and `settingsModified` (bool); `init(savedJson)` stores the saved settings, creates `Content.qml` with the safe creation of rule 17 passing `banana` and the saved settings, connects its signal `settingsSaved(json)` to update `settingsJson` and set `settingsModified`, then calls its `init()` inside try/catch. Any error is shown in red, as selectable text. Footer with the version and a Close button (`Qt.quit()`). |
| `Content.qml` | The dashboard itself. Header: company, the global period in words, a gear button at the top right. Reads the settings (section 5a), shows the setup panel at the first opening, computes the context with `Data.context(banana, period)`, creates the widgets in a `GridLayout` with 4 columns inside a `Flickable` (each widget spans the columns given in its file), each from its file with the safe creation of rule 17. Emits `settingsSaved(json)` whenever a parameter is applied. Hosts the settings panels (rule 19). |
| `data.js` | All the calculations, plain JavaScript (`.pragma library`). `context(banana, period)`: what all widgets share (document, accounting period, selected period, months, today, the date of the last transaction (section 7), account list). **One function per widget** that receives the context and the widget's settings and returns one object with everything the widget shows. Period computation (section 5a), formatting of amounts and dates. |
| `Style.qml` + `qmldir` | The palettes of section 7 and the active one (`paletteId`, the only writable property), fonts (`Qt.application.font.family`, the font of Banana) and sizes, as a QML singleton. Colors are read-only properties computed from the active palette. |
| `Widget.qml` | Frame of every widget: white card, title, subtitle (the period in words), a gear button at the top right if the widget has settings, an error line, the content (`default property alias`). |
| one `...Widget.qml` per chosen widget | As named in its widget file (e.g. `LiquidityWidget.qml`). Properties `context` and `settings`, received when it is created; calls its function in `data.js` inside try/catch and draws the result. It is not updated in place: when its data must change, `Content.qml` creates it again (rule 21). Its settings panel content is described in its file. |
| `SettingsPanel.qml` | Overlay panel used for all settings (rule 19): title, the controls given to it, Cancel and Apply. |
| `PeriodPicker.qml` | The period choice of section 5a (type and value, or two dates), used by the global settings and by widgets with their own period. |
| `AccountPicker.qml` | Only if a chosen widget needs it: list of real accounts (rule 16, section 6) with a check box each, id and description, a search field, and the list of groups; returns a filter string. |

**Data flow:** the script reads the saved settings → `Dashboard.qml` `init()` creates `Content.qml` →
`Content.qml` applies the settings (or shows the setup panel) → `Data.context(Banana, period)` → each
widget is created with the context and its settings → calls its data function → draws. When the user
applies new parameters, the widgets concerned are **destroyed and created again** (rule 21): the global
period or the palette recomputes the context and recreates all widgets; widget settings recreate only
that widget. Then `settingsSaved` is emitted; the script saves after the dialog closes.

**Required robustness** (the user can only report what they see):
- the main file shows a clear message if `dialog.qmlObject` is missing (only possible if
  `Dashboard.qml` itself is wrong);
- `Dashboard.qml` shows in red the error of `Content.qml` (file, line, message) instead of failing
  (rule 17);
- saved settings that cannot be read (wrong JSON, unknown values) are ignored and the defaults are used;
  the dashboard never fails because of them;
- `Content.qml` catches errors of `context()` and shows the message in the dialog, e.g. a red box;
- a widget whose file has an error is replaced by a red card with the message (rule 17); a widget whose
  data function fails shows the message in its error line;
- the footer shows the version, increased at every delivery.

## 5. Rules (from real problems in Banana)

1. **Header of the main file:** comment lines `// @id = ...` (unique, e.g. `ch.mycompany.dashboard`),
   `// @api = 1.0`, `// @description = ...`, `// @task = app.command`, `// @doctype = 100.*`,
   `// @timeout = -1` and **`// @permissions = allow-qml`** (required for every extension that opens
   a QML dialog). The function `exec()` is called when the user runs the extension.
2. **Accounting period:** `info("AccountingDataBase", "OpeningDate")` and
   `info("AccountingDataBase", "ClosureDate")`, format `yyyy-mm-dd`. It is `ClosureDate`, **not**
   `ClosingDate` (empty value: monthly charts stay empty).
3. **Signs:** credit amounts are negative. Revenue (BClass 4) and liabilities (BClass 2) must be
   inverted to be positive; costs (BClass 3) and assets (BClass 1) are positive as they are.
4. **Period amounts:** `.total` is the movement of the period (revenue, costs); `.balance` includes
   the opening balance (balance-sheet accounts such as liquidity).
5. **Style must be a QML singleton:** `Style.qml` starts with `pragma Singleton` and contains a
   `QtObject` with the values; a file named `qmldir` in the same folder contains the line
   `singleton Style 1.0 Style.qml`. A JavaScript file used for the
   style (`import "style.js" as Style`) works in plain Qt but **the dashboard does not load in Banana**.
6. **QtGraphs only** (Qt 6.11 or later, included in Banana): `import QtGraphs`; `GraphsView`,
   `BarSeries`/`BarSet`, `LineSeries`, `AreaSeries`, `PieSeries`. No QtCharts, no `Canvas` for charts.
7. **Children of a `GraphsView` are not laid out:** anything drawn over a chart (the total in the
   middle of a pie, a "today" marker) must be a sibling of the `GraphsView`, placed with anchors and
   the `plotArea` of the `GraphsView`.
8. **Pie colors:** set `seriesColors` in the pie's `GraphsTheme` (otherwise slices may be transparent),
   and set the `color` of each slice returned by `append(label, value)`.
9. **Chart theme:** `theme: GraphsTheme.Theme.UserDefined` inside each `GraphsTheme`, so only your
   colors are used; set `borderWidth: 0` on bar sets. When the palette changes, the widgets are created again (rule 21), so their
   colors are read from the new palette; if a chart is ever redrawn in place, set the colors of the
   series again (rebuild the series).
10. **Line charts need numeric x values:** use a `ValueAxis` for x. To show month names, give it a
    `labelDelegate`: an `Item` that declares `property string text` (QtGraphs puts the axis value in
    it) and contains a `Text` showing the month name for that value. A `Text` used directly as
    delegate does not work.
11. **Axis limits:** QtGraphs puts grid lines exactly at `min`, `max` and every `tickInterval`, without
    rounding. In `data.js` compute a round step (1, 2, 2.5 or 5 times a power of ten, giving about four
    steps), widen min and max to multiples of it, always include 0, and use at least 0-4 when there is
    no data. Set `labelDecimals: 0`.
12. **Variable number of points, bars or slices:** add them from code when the result changes
    (`clear()`, then `append(...)`, or the run-time series of the tested list).
13. **Names:** never call a property `data` in a QML component (reserved by `Item`); an `id` must not
    be equal to a property name of the same component.
14. **Signal handlers with parameters** declare them: `onActivated: function (index) { ... }`.
15. **Reports:** `Banana.Report.preview()` called while the dialog is open shows the preview behind
    it. If a report is wanted, close the dialog first and open the preview in the main file after
    `dialog.exec()`.
16. **Account and group ids are text.** They can be numbers (`1020`) or words (`Bank`, `Cash`,
    `Rev`): read, store and compare them as strings, exactly as written in the Accounts table
    (`Account` and `Gr` columns). Never convert them with `Number()` or `parseInt()`, never sort or
    compare them as numbers, never assume a numbering scheme (e.g. "accounts starting with 10 are
    liquidity"). Filters work the same with text ids: `"Bank|Cash"`, `"Gr=LIQ"`.
17. **Safe loading.** `Banana.Ui.createQml` fails as a whole if any QML file it loads has an error
    (a wrong singleton, an unknown property, a wrong reference, a QtGraphs property that does not exist),
    and the user only sees that the dashboard could not be loaded, without knowing where. Therefore:
    - `Dashboard.qml` is the minimal loader of section 4: it depends on nothing of the extension, so it
      always loads;
    - everything else is created at run time: `Qt.createComponent(fileName)` (path relative to the QML
      file that calls it), then `component.createObject(parent, initialProperties)`;
    - check `component.status` before creating: with `Component.Error`, show `component.errorString()`
      (it gives file, line and the exact error) in place of the content, in red; with
      `Component.Loading` (not expected for local files) wait for `statusChanged`; if `createObject`
      returns null, show "Could not create <file>";
    - error messages are selectable (a `TextEdit` with `readOnly: true` and `selectByMouse: true`), so the
      user can copy them and send them to you;
    - each widget is created the same way, so a widget with an error shows its message and the other
      widgets still work.
18. **Root element:** the dialog window is created by Banana with `Banana.Ui.createQml()`, so the root
    of `Dashboard.qml` is an `Item` (or a type derived from it, such as `Rectangle`), with `width` and
    `height` giving the initial size of the dialog. Never `ApplicationWindow`, `Window` or `Dialog` as
    root, and never inside the dashboard: they open a second window or prevent loading. The root of
    `Content.qml` and of the widgets is an `Item` or a type derived from it too.
19. **Settings panels inside the dashboard.** A gear button (a `Button` or a clickable `Text` "⚙") at the
    top right of the header opens the global settings; one at the top right of a widget opens its
    settings. The panel is an `Item` inside `Content.qml`, above everything else (`z`), with a
    semi-transparent layer over the dashboard that blocks clicks, and a white card in the middle with
    the title, the controls, Cancel and Apply. Not a `Window`, `Dialog` or `Popup` (rule 18). Cancel
    discards the changes; Apply applies them, closes the panel and emits `settingsSaved`.
20. **Saved settings:** one JSON string for the whole dashboard, read with `getScriptSettings()` and
    written with `setScriptSettings()` by the main file after `exec()`, only when something changed.
    Format in section 5a. Parse it inside try/catch; any missing or invalid value takes its default.
21. **Recreate widgets when their data changes.** A widget is created once with its context and
    settings and never updated in place. When the global period, the palette or the widget's settings
    change, `Content.qml` destroys the widget (`destroy()`) and creates it again in the same place with
    the safe creation of rule 17 and the new context and settings. A new widget starts empty, so no
    bar, point, slice or category of the previous data can remain. Keep the order and the width of the
    widgets in the grid.
22. **Redraw from scratch** (safety rule, for any chart that is redrawn while it exists, e.g. when it
    is resized or rebuilt by its own code): before drawing new data, remove everything drawn before:
    `removeSeries()` and `destroy()` for series created at run time, `clear()` for the points of a
    `LineSeries` and the slices of a `PieSeries`, new `values` for every `BarSet`; set the categories
    and the axis limits together with the series. Never append new data to what is already there.

### 5a. Parameters

**Saved settings (JSON):**
- `version`: 1;
- `palette`: id of the palette (section 7), default `"banana"`;
- `period`: the global period: `{ "type": "year" }`, `{ "type": "semester", "index": 1 }` (1-2),
  `{ "type": "quarter", "index": 1 }` (1-4), `{ "type": "month", "index": 1 }` (1-12, the first month
  of the accounting period is 1), `{ "type": "custom", "start": "yyyy-mm-dd", "end": "yyyy-mm-dd" }`;
- `widgets`: one object per widget, by the widget id of its file, with the settings that differ from
  the defaults, e.g. `{ "liquidity": { "accounts": "1000|Bank" } }`.

Store the period by type and index (not by dates) so it stays valid in the file of the next year.

**Period choices** (global and for widgets with their own period), always within the accounting
period, counted from the opening date (if the year starts on 1 April, the first quarter is April-June):
- Year: from the opening to the closing date (default);
- Semester 1 or 2: six months each;
- Quarter 1, 2, 3 or 4: three months each;
- Month: each month of the accounting period, by name and year (e.g. "March 2026");
- From ... to ...: two dates. The user types them in the local date format: convert them with the
  Banana.Converter function for local dates if the documentation has one (check the page), otherwise
  ask for `yyyy-mm-dd` and show that format in the field. Dates outside the accounting period are cut
  to it; a start after the end is refused with a message in the panel.

The period is described in words in the header and in each widget's subtitle, e.g. "Year 2026",
"2nd quarter 2026 (01.04.2026 - 30.06.2026)". If the saved custom dates are outside the current
accounting period, use the year and show a short note in the header.

**First opening** (no saved settings): before the widgets, `Content.qml` shows the setup panel with the
period choice (Year preselected) and the palette choice (each palette shown as a name with a row of
its colors, Banana preselected), and one button to start. The choice is then applied and saved as any
other change.

**Global settings** (gear at the top right of the header): the same period and palette choices.
Changing the palette recolors the whole dashboard at once (`Style.paletteId`), charts included.

**Widget settings** (gear on the widget): as listed in the widget's file. A widget with its own period
has the choice "Dashboard period" (default) plus the period choices above; its subtitle shows which
period it uses.

### Checks on the QML files before every delivery

Go through every `.qml` file and fix anything that fails. These are the causes of most dashboards
that do not start.

- **Style:** `qmldir` (lowercase, no extension) contains exactly the line `singleton Style 1.0 Style.qml`;
  `Style.qml` starts with `pragma Singleton`, then `import QtQuick`, and its root is a `QtObject` with
  `paletteId` as the only writable property and all the others `readonly property`. List every
  `Style.<name>` used in all files: each must be declared in `Style.qml` with exactly that name.
  `Style.qml` does not use other components of the extension.
- **Components:** every component of the extension used in a file (e.g. `Widget`, `SettingsPanel`) has
  a file with exactly the same name and capitalization (`Widget.qml`) in the folder. File names of
  components start with an uppercase letter.
- **Properties:** every property set on a component of the extension (e.g. `Widget { subtitle: ... }`)
  is declared in that component's file or exists in its root type. Every property set on a Qt type
  exists in the Qt documentation (ground rules). Every value read from a data object (e.g.
  `values.totalText`) is in the object returned by `data.js`.
- **References:** every `id` used in a file is declared in the same file. Never refer to an `id` of
  another file (e.g. the root of `Content.qml` from a widget): pass the value through a property or a
  signal. `parent` only where the parent is certain (not inside a delegate created by QtGraphs, except
  as in rule 10).
- **Imports:** each file imports what it uses: `QtQuick`; `QtQuick.Controls` for `Label`, `Button`,
  `ComboBox`, `CheckBox`, `TextField`; `QtQuick.Layouts` for layouts and `Layout.*`; `QtGraphs` for
  charts; `data.js` only where its functions are called, with `import "data.js" as Data`.
- **Attached properties:** `Layout.*` only on direct children of a layout; `anchors` never on direct
  children of a layout or of a `Row`/`Column`.
- **Signal handlers:** each `on<Name>Changed` refers to a property declared or existing with that
  name; handlers with parameters as in rule 14.
- **Root elements:** `Dashboard.qml`, `Content.qml` and the widgets have an `Item` or a type derived from
  it as root; no `ApplicationWindow`, `Window`, `Dialog` or `Popup` (rules 18 and 19).
- **Syntax:** braces balanced; one property per line, or separated by `;` on the same line;
  `data.js` starts with `.pragma library` and contains no QML.

### QtGraphs elements tested in Banana

These elements have been used in dashboards that work in Banana (Qt 6.11). **Prefer them.** If you need
anything else, check it in the Qt documentation first and tell the user that that part of the chart
has not been tested in Banana.

- `GraphsView`: `axisX`, `axisY`, `theme`, `marginTop`, `marginBottom`, `marginLeft`, `marginRight`,
  `plotArea` (read only, to place overlays, rule 7), `addSeries()`, `removeSeries()`.
- `GraphsTheme`: `theme: GraphsTheme.Theme.UserDefined`, `backgroundVisible`,
  `plotAreaBackgroundVisible`, `gridVisible`, `labelsVisible`, `labelTextColor`, `labelFont`,
  `axisXLabelFont`, `axisYLabelFont`, `seriesColors`, `borderColors`, `grid.mainColor`,
  `grid.subColor`, `grid.mainWidth`, `grid.subWidth`, `axisX.mainColor`, `axisX.subColor`,
  `axisX.mainWidth`, `axisX.labelTextColor`, and the same for `axisY`. Do not bind `colorScheme`:
  changing it makes QtGraphs reapply its default colors over yours.
- `ValueAxis`: `min`, `max`, `tickInterval`, `tickAnchor`, `subTickCount`, `labelDecimals`,
  `gridVisible`, `subGridVisible`, `lineVisible`, `labelDelegate` (rule 10).
- `BarCategoryAxis`: `categories`, `gridVisible`, `subGridVisible`, `lineVisible`.
- `BarSeries`: `barWidth`, `append(barSet)`. `BarSet`: `label`, `color`, `borderWidth`, `values`.
- `LineSeries`: `color`, `width`, `pointDelegate` (a small `Rectangle`), `strokeStyle:
  LineSeries.StrokeStyle.DashLine` with `dashPattern` (e.g. `[4, 3]`, or `[1, 2.5]` for dots) and
  `capStyle: Qt.RoundCap`, `clear()`, `append(x, y)`.
- `AreaSeries`: `color`, `borderWidth`, `upperSeries` and `lowerSeries`: two `LineSeries` with
  `color: "transparent"` and `width: 0`, the lower one at 0.
- `PieSeries`: `holeSize`, `pieSize`, `clear()`, `append(label, value)`, which returns the slice; on
  the slice: `color`, `borderColor`, `borderWidth`, `labelVisible`.
- Series created at run time: from a `Component` containing the series, `createObject(view,
  properties)`, then `view.addSeries(series)`; to rebuild, `removeSeries()` and `destroy()` the old
  ones. Add series only when the view is in a window (`Window.window !== null`).
- Not tested: tooltips and hover, zoom, pan, selection, 3D graphs, other series and axis types.

## 6. Banana functions to use

| Function | Returns / use |
|---|---|
| `Banana.Ui.createQml(title, "Dashboard.qml")` | dialog; `dialog.qmlObject` is the root QML object (missing if a QML file has an error) |
| `dialog.exec()` | shows the dialog (modal) |
| `Banana.document.getScriptSettings()` | the settings saved in the accounting file for this extension (string, empty the first time) |
| `Banana.document.setScriptSettings(text)` | saves the settings in the accounting file for this extension; kept when the user saves the file |
| `Banana.document.info(section, id)` | file properties: `("AccountingDataBase", "Company")`, `("AccountingDataBase", "BasicCurrency")`, `("AccountingDataBase", "OpeningDate")`, `("AccountingDataBase", "ClosureDate")`, `("Base", "FileName")` |
| `Banana.document.currentBalance(filter, start, end)` | object with `opening`, `debit`, `credit`, `total`, `balance` (strings: use `Number(...)`) |
| `Banana.document.budgetBalance(filter, start, end)` | same, from the budget |
| `Banana.document.projectionBalance(filter, projectionStart, start, end)` | same; actual data before `projectionStart`, budget (Budget table) from it on |
| `Banana.document.previousYear(n)` | document of n years before (linked in the file properties), or null; it has the same functions |
| `Banana.document.table("Accounts")` | `rowCount`; `row(i).value("Account")`, `"Group"`, `"Description"`, `"BClass"`, `"Gr"` |
| `Banana.document.table("Transactions")` | `rowCount`; `row(i).value("Date")`, `"Doc"`, `"Description"`, `"AccountDebit"`, `"AccountCredit"`, `"Amount"` |
| `Banana.Converter.toLocaleNumberFormat(value, 2, true)` | amount formatted with the user's settings |
| `Banana.Converter.toLocaleDateFormat(isoDate)` | date formatted with the user's settings |

**Account filters:** one account `"1020"` or `"Bank"`, several `"1000|1020"` or `"Bank|Cash"`, a group
`"Gr=10"`, `"Gr=10|11"` or `"Gr=LIQ"` (ids are text, rule 16), a class `"BClass=4"` (1 assets,
2 liabilities, 3 costs, 4 revenue).

**Real accounts** in the Accounts table: rows whose `Account` is not empty and does not start with
`.`, `,`, `;` or `:` (those are cost centers and segments). **Groups:** rows with a value in the
`Group` column.

## 7. Conventions common to all widgets

- **Months:** of the selected period, each from its first to its last day, cut to the period. Month
  labels: short month names in the user's language.
- **Last transaction:** the dashboard is a report on the file, so the limit of the actual data is the
  file itself, not the calendar. The **date of the last transaction** is the latest `Date` of the
  Transactions table **within the period**, counting only rows with an amount (rows without date or
  amount, and dates outside the period, are ignored). Months that start after the month of the last
  transaction have no actual value: left out of lines, "-" in texts; drawing them as 0 shows a false
  drop. If the period has no transactions, no month has an actual value. Do not use today's date for
  this: a file can contain transactions dated after today. (The liquidity widget is different: its
  cutoff is a setting, see its file.)
- **Measures:** revenue = BClass 4, `.total`, inverted; costs = BClass 3, `.total`; result = revenue
  minus costs. A positive result is a **profit**, a negative one a **loss**: always write the word,
  never rely on the color alone.
- **Amounts:** `toLocaleNumberFormat` with 2 decimals; counts without decimals.
- **Line styles:** actual data solid; forecast dashed in the same color; budget dotted in the budget
  color.
- **Legend** under every chart with more than one series: a small swatch drawn in the series style and
  the label. No tooltips.
- **Missing data:** a widget with nothing to show displays one short sentence saying why and what the
  user can do (its file says which), never an empty chart.
- **Widths:** the grid has 4 columns; each widget's file gives its width (1, 2 or 4 columns).

**Palettes** (all light; text never uses data colors). Roles and values:

| Role | Banana | Graphite | Sage | Bordeaux |
|---|---|---|---|---|
| background | `#F6F7FA` | `#F5F5F3` | `#F2F4F0` | `#F7F4F2` |
| card (widget) | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| card border, grid | `#E1E4EE` | `#E4E2DE` | `#DDE3D8` | `#E6DEDA` |
| track (bar background) | `#EDEFF6` | `#EFEEEB` | `#E9EDE6` | `#F0EBE8` |
| text | `#3A3A3A` | `#1F1D1A` | `#1E2A22` | `#261A1C` |
| text muted | `#6E7080` | `#76716A` | `#66756B` | `#7A6A6C` |
| header background | `#354793` | `#FFFFFF` | `#24372C` | `#4A1E2A` |
| header text | `#FFFFFF` | `#1F1D1A` | `#F4F7F2` | `#FBF6F4` |
| header accent line | `#FFE01B` | `#0F766E` | `#B9D8A6` | `#F0C6B4` |
| accent (buttons, links) | `#354793` | `#0F766E` | `#3F7A54` | `#8E2A3E` |
| revenue | `#354793` | `#0F8F84` | `#4E9A63` | `#2E8C78` |
| costs | `#E07A3F` | `#D9643A` | `#C8794A` | `#B33A4E` |
| result | `#3A3A3A` | `#44403C` | `#2F3D34` | `#3D2C30` |
| liquidity | `#3B8EA5` | `#3D7EA6` | `#3F7F9A` | `#3E7C9C` |
| budget | `#9A9DAD` | `#A8A29E` | `#9AA59D` | `#A99C9E` |
| good (profit, better) | `#2E8A62` | `#0F766E` | `#3F7A54` | `#2E7D6B` |
| bad (loss, worse) | `#C8473B` | `#C2410C` | `#B5562F` | `#A3243B` |
| pie slices, in order | `#354793`, `#E07A3F`, `#3B8EA5`, `#6B5BA6`, `#8A8F3C`, `#C2507A` | `#0F8F84`, `#D9643A`, `#3D7EA6`, `#7C5CA8`, `#8A8F3C`, `#C2507A` | `#4E9A63`, `#C8794A`, `#3F7F9A`, `#7E6AA0`, `#9A9A3E`, `#B5577A` | `#2E8C78`, `#B33A4E`, `#3E7C9C`, `#76598F`, `#8C8740`, `#C27A5A` |
| "others" slice | `#B4B8C4` | `#B8B3AC` | `#B3BCB5` | `#BDB1B3` |

### 7a. Appearance

The same for every widget and every AI, so that the dashboard looks finished at the first delivery.
All values are in `Style.qml`.

- **Text:** the font of Banana everywhere. Widget title 16 px semibold, text color; subtitle 12 px,
  muted; big values 32 px semibold; normal text 13 px; small text (notes, legends, axis labels) 12 px,
  muted. Text never touches the card border: long texts are shortened with "...".
- **Cards:** white (card color), border 1 px in the grid color, radius 12, inner margin 20 px, 16 px
  between cards and around the grid. Title and subtitle at the top left, the gear at the top right on
  the same line as the title.
- **Gear buttons:** a flat icon, not a button with a frame: the character "⚙" (16 px, muted; header
  gear 20 px in the header text color) inside a 28 x 28 px clickable area (`MouseArea` with
  `cursorShape: Qt.PointingHandCursor`), slightly darker when the mouse is over it.
- **Header:** header background color, the dashboard title 22 px semibold and under it company and
  period 13 px in the header muted text; a 3 px line in the header accent color at the bottom.
- **Charts:** no chart background; **only horizontal grid lines**, 1 px, grid color, no sub grid; no
  vertical grid lines (`gridVisible: false` on the x axis); no line and no ticks on the y axis (its
  main color transparent); the x axis line 1 px in the grid color; axis labels 12 px, muted, values
  without decimals. Chart height 240 px (liquidity 300 px).
- **Legends:** under the chart, **aligned left**, 16 px between items; each item a swatch drawn like
  the series (10 x 10 px square with radius 3 for bars and slices; a short line 16 px wide, solid,
  dashed or dotted, for lines) and the label, 12 px, muted.
- **Notes and comparisons:** the text in muted color; **only the variation** (percent or difference)
  in good or bad color, always with its sign (+ or -).
- **Summary rows** (e.g. under the liquidity chart): the figures in columns of **equal width** across
  the whole widget; label 12 px muted on top, value 18 px semibold under it.
- **Dates:** always shown with `toLocaleDateFormat`, never as `yyyy-mm-dd`.
- **Empty states and errors:** messages centered in the widget, 13 px muted; errors in the bad color.

## 8. Widget catalog

Read the widget file of each chosen widget before building it. The widget files are found **by their
name**: in the folder `widgets/` next to this file, or, if this skill is used as knowledge of a
project, among the project files (folders may not be kept). If a widget file cannot be found, tell the
user which one is missing instead of building the widget from memory.

| Widget (id) | File | In one line |
|---|---|---|
| Result (`result`) | `result-indicator.md` | Profit or loss of the period as a big number, compared with the budget |
| Costs (`costs`) | `costs-indicator.md` | Total costs of the period as a big number |
| Revenue (`revenue`) | `revenue-indicator.md` | Total revenue of the period as a big number |
| Liquidity evolution (`liquidity`) | `liquidity-evolution.md` | Cash and bank balance through the period: actual, then forecast from the budget, with the budget line |
| Revenue and costs per month (`revenueCostsBars`) | `revenue-costs-bars.md` | Bars with revenue and costs of each month |
| Cumulative result (`cumulativeResult`) | `cumulative-result.md` | Result added up month after month, compared with the budget or the previous year |
| Costs breakdown (`costsBreakdown`) | `costs-breakdown.md` | Pie with the share of each cost account |
| Revenue breakdown (`revenueBreakdown`) | `revenue-breakdown.md` | Pie with the share of each revenue account |
| Budget comparison (`budgetComparison`) | `budget-comparison.md` | Revenue, costs and result against the budget |
| Largest costs (`costsList`) | `costs-list.md` | List of the cost accounts with the highest amounts |
| Largest revenue (`revenueList`) | `revenue-list.md` | List of the revenue accounts with the highest amounts |
| Latest transactions (`transactionsList`) | `transactions-list.md` | The last transactions of the period |

## 9. Installation and test in Banana (tell the user)

1. Save all the files of the dashboard in one folder and keep them together.
2. In Banana Accounting Plus open a double-entry accounting file (better a copy, see the notice).
3. Menu **Extensions > Manage Extensions**, then **Add from file**, and choose the main `.js` file.
4. Run it from the **Extensions** menu. The first time, choose the period and the colors.
5. Check the version in the footer: it must be the one just delivered.
6. To keep the settings, save the accounting file.
7. After changing files, close and reopen the dashboard; if the old version is still shown, remove
   the extension in Manage Extensions and add it again.

## 10. Problems and solutions

| What the user sees | Likely cause | What to do |
|---|---|---|
| Message "The dashboard could not be loaded" | Error in `Dashboard.qml` itself, or a file missing | `Dashboard.qml` must be the minimal loader (section 4, rule 17): rewrite it; check all files are in the folder |
| Red message with a file name and a line, in place of the dashboard or of a widget | Error in that QML file (singleton, unknown property or component, wrong reference, QtGraphs) | Ask the user to copy the message; fix that line; go through the checks at the end of section 5 |
| "Cannot call method 'init' of undefined" | Same, and the main file does not check `dialog.qmlObject` | Same; add the check |
| Error shown in the dialog (red box) or in a widget's error line | Error in `data.js` | Fix the indicated function; check the Banana function in section 6 or in the documentation |
| Big numbers shown, monthly charts empty | Period dates missing (`ClosingDate` used, or dates not set in the file properties) | Use `ClosureDate`; ask the user to check the dates in the file properties |
| Setup panel shown at every opening | Settings not saved: the main file does not call `setScriptSettings`, or the accounting file was not saved | Check the main file (section 4); tell the user to save the accounting file |
| Settings ignored after reopening | Saved JSON not read or different format | Check `init()` and the format of section 5a |
| Colors do not change in the charts | Widgets not recreated after a palette change | Rules 21 and 9 |
| After changing the period or a setting, old bars, points or slices remain in a chart, or the chart is cut | Widget updated in place instead of recreated, or old series not removed | Rules 21 and 22 |
| Revenue negative | Not inverted | Rule 3 |
| Pie invisible | `seriesColors` missing | Rule 8 |
| Text or marker over a chart missing | Inside the `GraphsView` | Rule 7 |
| Settings panel opens a separate window or does not open | `Dialog`, `Popup` or `Window` used | Rule 19 |
| Everything black or tiny | Style not a singleton | Rule 5 |
| Footer shows an old version | Old files loaded | Close and reopen; remove and add the extension again; check the files were replaced |
| Liquidity empty | No accounts chosen | The user chooses them with the widget's gear |
| Budget values zero | No budget for those accounts | Explain; the user fills in the budget |
