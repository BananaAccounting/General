// Copyright [2026] [Banana.ch SA - Lugano Switzerland]
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @id = ch.banana.uni.trialbalance.closing.transactions
// @api = 1.0
// @pubdate = 2026-09-28
// @publisher = Banana.ch SA
// @description = Trial balance with closing transactions analysis
// @description.it = Bilancio di verifica con analisi registrazioni di chiusura
// @description.de = Probebilanz mit Analyse der Abschlussbuchungen
// @description.fr = Balance de vérification avec analyse des écritures de clôture
// @description.en = Trial balance with closing transactions analysis
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @docproperties =
// @timeout = -1



// Main entry point called by Banana when the extension runs.
// Opens the settings dialog, builds the context object, then
// generates and previews the report.
function exec() {

    if (!Banana.document) {
        return;
    }

    var param = settingsDialog();
    if (!param) {
        return "@Cancel";
    }

    // The context object bundles the things most functions need,
    // so we don't have to pass them individually everywhere.
    var ctx = {
        banDoc:        Banana.document,
        param:         param,
        texts:         getTexts(Banana.document),
        closingFilter: getClosingFilter(Banana.document, param)
    };

    var report     = Banana.Report.newReport(ctx.texts.reportTitle);
    var stylesheet = Banana.Report.newStyleSheet();

    buildReport(ctx, report);
    defineStyles(stylesheet, param);
    Banana.Report.preview(report, stylesheet);
}


// ============================================================
// REPORT
// ============================================================

// Assembles the full report: header, main table, cost centre and
// segment sections, optional closing-detail section, and footer.
function buildReport(ctx, report) {

    printHeader(ctx, report);

    // Accounts that have closing entries, collected while printing the tables.
    // Used afterwards for the optional closing-detail section.
    var accountsWithClosings = [];

    printMainTable(ctx, report, accountsWithClosings);

    if (ctx.param.showCostCentersSegments) {
        printPrefixSection(ctx, report, [".", ",", ";"], ctx.texts.costCenters, accountsWithClosings);
        printPrefixSection(ctx, report, [":"],           ctx.texts.segments,    accountsWithClosings);
    }

    if (ctx.param.showClosingDetails && accountsWithClosings.length > 0) {
        printClosingDetails(ctx, report, accountsWithClosings);
    }

    printFooter(report);
}

// Prints the report title, company name, and accounting period at the top of the report.
function printHeader(ctx, report) {

    report.addParagraph(ctx.texts.reportTitle, "heading1");

    var headerLeft  = ctx.banDoc.info("Base", "HeaderLeft");
    var headerRight = ctx.banDoc.info("Base", "HeaderRight");

    if (headerLeft)  report.addParagraph(headerLeft,  "companyHeader");
    if (headerRight) report.addParagraph(headerRight, "companyHeader");

    var openingDate = ctx.banDoc.info("AccountingDataBase", "OpeningDate");
    var closureDate = ctx.banDoc.info("AccountingDataBase", "ClosureDate");

    if (openingDate && closureDate) {
        var period = Banana.Converter.toLocaleDateFormat(openingDate)
                   + " - "
                   + Banana.Converter.toLocaleDateFormat(closureDate);
        report.addParagraph(period, "periodHeader");
    }
}

// Prints the page footer with the current date and page number.
function printFooter(report) {

    var date = Banana.Converter.toLocaleDateFormat(new Date());
    report.getFooter().addClass("footer");
    var field = report.getFooter().addText(date + " - ", "");
    if (field.excludeFromTest) {
        field.excludeFromTest();
    }
    report.getFooter().addFieldPageNr();
}


// ============================================================
// MAIN TABLE  (Balance Sheet + Income Statement)
// ============================================================

// Prints the main trial balance table containing all four sections:
// Assets, Liabilities, Revenues, and Costs, followed by a grand total row.
function printMainTable(ctx, report, accountsWithClosings) {

    var texts = ctx.texts;

    report.addParagraph(" ");
    report.addParagraph(texts.balanceSheet + " / " + texts.incomeStatement, "heading1");

    var columns     = buildColumns(ctx, true);
    var table       = createTable(report, columns, texts);
    var grandTotals = zeroTotals();

    var bClassOrder = ["1", "2", "4", "3"];
    for (var i = 0; i < bClassOrder.length; i++) {
        printBlock(ctx, table, columns, bClassOrder[i], accountsWithClosings, grandTotals);
    }

    addGrandTotalRow(ctx, table, columns, grandTotals);
}

// Returns the section title for a given BClass (1=Assets, 2=Liabilities, 3=Costs, 4=Revenues).
function getBClassTitle(ctx, bClass) {
    switch (bClass) {
        case "1": return ctx.texts.assets.toUpperCase();
        case "2": return ctx.texts.liabilities.toUpperCase();
        case "3": return ctx.texts.costs.toUpperCase();
        case "4": return ctx.texts.revenues.toUpperCase();
    }
    return "";
}

// Prints one section of the main table (e.g. Assets or Costs).
// Iterates over all accounts with the given BClass, computes their data,
// renders each row and accumulates section and grand totals.
// When splitByBClass is enabled, adds a section header row and a section total row.
function printBlock(ctx, table, columns, bClass, accountsWithClosings, grandTotals) {

    // Section title row (only when splitting by BClass)
    if (ctx.param.splitByBClass) {
        var title = getBClassTitle(ctx, bClass);
        var sectionRow = table.addRow();
        for (var c = 0; c < columns.length; c++) {
            sectionRow.addCell(c === 0 ? title : "", "sectionRow");
        }
    }

    var sectionTotals = zeroTotals();
    var accountsTable = ctx.banDoc.table("Accounts");
    var rowIndex      = 0;

    for (var i = 0; i < accountsTable.rowCount; i++) {

        var rowAccount = accountsTable.row(i);
        if (rowAccount.value("BClass") !== bClass) {
            continue;
        }

        var account = rowAccount.value("Account");
        var data    = computeAccountData(ctx, account);

        if (ctx.param.showClosingDetails && hasClosingMovements(data)) {
            accountsWithClosings.push({ account: account, description: rowAccount.value("Description") });
        }

        accumulateTotals(sectionTotals, data);
        accumulateTotals(grandTotals,   data);

        var row = table.addRow(rowIndex % 2 === 0 ? "" : "alternateRow");
        renderDataRow(ctx, row, columns, account, rowAccount.value("Description"), data);
        rowIndex++;
    }

    if (ctx.param.splitByBClass) {
        addSectionTotalRow(ctx, table, columns, sectionTotals);
    }
}


// ============================================================
// PREFIX SECTIONS  (Cost centres, Segments)
// ============================================================

// Prints a separate page for accounts whose number starts with one of the
// given prefixes (e.g. "." for cost centres, ":" for segments).
// Does nothing if no matching accounts exist in the chart of accounts.
function printPrefixSection(ctx, report, prefixes, title, accountsWithClosings) {

    var accountsTable = ctx.banDoc.table("Accounts");

    if (!hasPrefixAccounts(accountsTable, prefixes)) {
        return;
    }

    report.addPageBreak();
    report.addParagraph(" ");
    report.addParagraph(title, "heading1");

    var columns  = buildColumns(ctx, false);
    var table    = createTable(report, columns, ctx.texts);
    var rowIndex = 0;

    for (var i = 0; i < accountsTable.rowCount; i++) {

        var rowAccount = accountsTable.row(i);
        var account    = rowAccount.value("Account");

        if (!account || !matchesPrefix(account, prefixes)) {
            continue;
        }

        var data = computeAccountData(ctx, account);

        if (ctx.param.showClosingDetails && hasClosingMovements(data)) {
            accountsWithClosings.push({ account: account, description: rowAccount.value("Description") });
        }

        var row = table.addRow(rowIndex % 2 === 0 ? "" : "alternateRow");
        renderDataRow(ctx, row, columns, account, rowAccount.value("Description"), data);
        rowIndex++;
    }
}

// Returns true if the accounts table contains at least one account
// whose number starts with one of the given prefixes.
function hasPrefixAccounts(accountsTable, prefixes) {

    for (var i = 0; i < accountsTable.rowCount; i++) {
        var account = accountsTable.row(i).value("Account");
        if (account && matchesPrefix(account, prefixes)) {
            return true;
        }
    }
    return false;
}

// Returns true if the account number starts with any of the given prefixes.
function matchesPrefix(account, prefixes) {

    for (var p = 0; p < prefixes.length; p++) {
        if (account.startsWith(prefixes[p])) {
            return true;
        }
    }
    return false;
}


// ============================================================
// CLOSING DETAILS SECTION
// ============================================================

// Prints a dedicated page listing the closing entries for every account
// that has at least one closing movement.
function printClosingDetails(ctx, report, accountsWithClosings) {

    report.addPageBreak();
    report.addParagraph(" ");
    report.addParagraph(ctx.texts.closingDetailsSection, "heading1");

    for (var i = 0; i < accountsWithClosings.length; i++) {
        var item = accountsWithClosings[i];
        report.addParagraph(" ");
        report.addParagraph(item.account + " - " + item.description, "heading2");
        printAccountClosingTable(ctx, report, item.account);
    }
}

// Prints a detail table of all closing entries for a single account.
// Each row shows date, doc, description, contra account, debit and credit.
// If the account has no closing entries the table is not printed.
function printAccountClosingTable(ctx, report, account) {

    var card = ctx.banDoc.currentCard(account, "", "");
    if (!card) {
        return;
    }

    var texts = ctx.texts;
    var table = report.addTable("detailTable");

    table.addColumn("detailColDate");
    table.addColumn("detailColDoc");
    table.addColumn("detailColDesc");
    table.addColumn("detailColContra");
    table.addColumn("detailColAmount");
    table.addColumn("detailColAmount");

    var headerRow = table.addRow();
    headerRow.addCell(texts.date,          "detailHeader");
    headerRow.addCell("Doc",               "detailHeader");
    headerRow.addCell(texts.description,   "detailHeader");
    headerRow.addCell(texts.contraAccount, "detailHeader");
    headerRow.addCell(texts.debit,  "detailNumberHeader");
    headerRow.addCell(texts.credit, "detailNumberHeader");

    var totalDebit  = "0";
    var totalCredit = "0";
    var hasRows     = false;

    for (var r = 0; r < card.rowCount; r++) {

        var cardRow = card.row(r);
        if (!ctx.closingFilter(cardRow)) {
            continue;
        }

        hasRows = true;

        var debit  = cardRow.value("JDebitAmountAccountCurrency")  || "0";
        var credit = cardRow.value("JCreditAmountAccountCurrency") || "0";

        totalDebit  = Banana.SDecimal.add(totalDebit,  debit);
        totalCredit = Banana.SDecimal.add(totalCredit, credit);

        var row = table.addRow();
        row.addCell(formatDate(cardRow.value("Date")),               "detailCell");
        row.addCell(cardRow.value("Doc"),                            "detailCell");
        row.addCell(cardRow.value("Description"),                    "detailCell");
        row.addCell(cardRow.value("JContraAccount"),                 "detailCell");
        row.addCell(formatAmount(debit, ctx.param.showZeroAmounts),  amountStyle(ctx, debit,  "detailAmount"));
        row.addCell(formatAmount(credit, ctx.param.showZeroAmounts), amountStyle(ctx, credit,  "detailAmount"));
    }

    if (!hasRows) {
        return;
    }

    var totalRow = table.addRow();
    totalRow.addCell("",                                                   "detailTotalRow");
    totalRow.addCell("",                                                   "detailTotalRow");
    totalRow.addCell(texts.total.toUpperCase(),                            "detailTotalRow");
    totalRow.addCell("",                                                   "detailTotalRow");
    totalRow.addCell(formatAmount(totalDebit, ctx.param.showZeroAmounts),  amountStyle(ctx, totalDebit,  "detailTotalAmount"));
    totalRow.addCell(formatAmount(totalCredit, ctx.param.showZeroAmounts), amountStyle(ctx, totalCredit, "detailTotalAmount"));
}


// ============================================================
// TABLE HELPERS
// ============================================================

// Creates a report table with the given columns and prints two header rows:
// - Row 1: group labels (Prima delle chiusure / Chiusure / Finale) with dynamic colspan
// - Row 2: individual column labels (Dare / Avere / Saldo)
// Returns the table object so the caller can add data rows to it.
function createTable(report, columns, texts) {

    var table = report.addTable("table");

    for (var c = 0; c < columns.length; c++) {
        table.addColumn("");
    }

    // ---- Row 1: group labels ----
    // Count how many active columns belong to each group.
    var groupCount = { before: 0, closing: 0, final: 0 };
    for (var c = 0; c < columns.length; c++) {
        var g = columns[c].group;
        if (g) groupCount[g]++;
    }

    var groupRow = table.getHeader().addRow();
    var c = 0;
    while (c < columns.length) {
        var col   = columns[c];
        var group = col.group;

        if (!group) {
            // Column with no group: empty cell, colspan 1
            groupRow.addCell("", "groupHeaderEmpty");
            c++;
        } else {
            // First column of a group: emit the group label spanning all columns of that group
            var span  = groupCount[group];
            var label = group === "before"  ? texts.groupBefore
                      : group === "closing" ? texts.groupClosing
                      :                      texts.groupFinal;
            groupRow.addCell(label, "groupHeader", span);
            c += span;
        }
    }

    // ---- Row 2: individual column labels ----
    var headerRow = table.getHeader().addRow();
    for (var c = 0; c < columns.length; c++) {
        var col = columns[c];
        if (col.id === "account" || col.id === "description") {
            headerRow.addCell(col.header, "textHeader");
        }
        else if (col.id === "lastDate") {
            headerRow.addCell(col.header, "dateHeader");
        }
        else {
            headerRow.addCell(col.header, "numberHeader");
        }
    }

    return table;
}

// Fills a single data row with account values.
function renderDataRow(ctx, row, columns, account, description, data) {

    //var hasClosing = hasClosingMovements(data);

    for (var c = 0; c < columns.length; c++) {

        var col = columns[c];

        if (col.id === "account") {
            //row.addCell(account, "tableCell" + (hasClosing ? " accountWithClosing" : ""));
            row.addCell(account, "tableCell");
        }

        else if (col.id === "description") {
            row.addCell(description, "tableCell");
        }

        else if (col.id === "opening") {
            row.addCell(formatAmount(data.opening, ctx.param.showZeroAmounts), amountStyle(ctx, data.opening, "tableCell amountCell"));
        }

        else if (col.id === "debitBefore") {
            row.addCell(formatAmount(data.debitBefore, ctx.param.showZeroAmounts), amountStyle(ctx, data.debitBefore, "tableCell amountCell"));
        }

        else if (col.id === "creditBefore") {
            row.addCell(formatAmount(data.creditBefore, ctx.param.showZeroAmounts), amountStyle(ctx, data.creditBefore, "tableCell amountCell"));
        }

        else if (col.id === "balanceBefore") {
            row.addCell(formatAmount(data.balanceBefore, ctx.param.showZeroAmounts), amountStyle(ctx, data.balanceBefore, "tableCell amountCell"));
        }

        else if (col.id === "debitClosing") {
            row.addCell(formatAmount(data.debitClosing, ctx.param.showZeroAmounts), amountStyle(ctx, data.debitClosing, "tableCell amountCell"));
        }

        else if (col.id === "creditClosing") {
            row.addCell(formatAmount(data.creditClosing, ctx.param.showZeroAmounts), amountStyle(ctx, data.creditClosing, "tableCell amountCell"));
        }

        else if (col.id === "balanceClosing") {
            row.addCell(formatAmount(data.balanceClosing, ctx.param.showZeroAmounts), amountStyle(ctx, data.balanceClosing, "tableCell amountCell"));
        }

        else if (col.id === "debitFinal") {
            row.addCell(formatAmount(data.debitFinal, ctx.param.showZeroAmounts), amountStyle(ctx, data.debitFinal, "tableCell amountCell"));
        }

        else if (col.id === "creditFinal") {
            row.addCell(formatAmount(data.creditFinal, ctx.param.showZeroAmounts), amountStyle(ctx, data.creditFinal, "tableCell amountCell"));
        }

        else if (col.id === "balanceFinal") {
            row.addCell(formatAmount(data.balanceFinal, ctx.param.showZeroAmounts), amountStyle(ctx, data.balanceFinal, "tableCell amountCell"));
        }

        else if (col.id === "balanceVariancePercent") {
            row.addCell(formatVariancePercent(ctx, data), styleVariancePercent(data));
        }

        else if (col.id === "lastDate") {
            row.addCell(formatDate(data.lastDate), "tableCell dateCell");
        }

        else {
            row.addCell("", "tableCell");
        }
    }
}

// Appends a section subtotal row to the table.
function addSectionTotalRow(ctx, table, columns, totals) {

    var row = table.addRow();

    for (var c = 0; c < columns.length; c++) {
        var col = columns[c];
        if (col.id === "description") {
            row.addCell(ctx.texts.total.toUpperCase(), "totalRow");
        }
        else if (totals[col.id] !== undefined) {
            row.addCell(formatAmount(totals[col.id], ctx.param.showZeroAmounts), amountStyle(ctx, totals[col.id], "totalAmount"));
        }
        else {
            row.addCell("", "totalRow");
        }
    }
}

// Appends the grand total row at the bottom of the main table.
// Zero amounts are always shown here: a zero balance confirms that the accounting is balanced.
function addGrandTotalRow(ctx, table, columns, totals) {

    var row = table.addRow();

    for (var c = 0; c < columns.length; c++) {
        var col = columns[c];
        if (col.id === "description") {
            row.addCell(ctx.texts.generalTotal, "grandTotalRow");
        }
        else if (totals[col.id] !== undefined) {
            row.addCell(formatAmount(totals[col.id], true), amountStyle(ctx, totals[col.id], "grandTotalAmount"));
        }
        else {
            row.addCell("", "grandTotalRow");
        }
    }
}


// ============================================================
// COLUMNS
// ============================================================

// Builds the list of visible columns based on the user's settings.
// Each column is an object with an id, a localised header label, and
// an optional group ("before", "closing", "final") used to render
// the group header row with the correct colspan.
// Pass includeOpening=true for the main table, false for prefix sections.
function buildColumns(ctx, includeOpening) {

    var param = ctx.param;
    var texts = ctx.texts;
    var cols  = [];

    if (param.showAccount) {
        cols.push({ id: "account", header: texts.account });
    }
    
    if (param.showDescription) {
        cols.push({ id: "description", header: texts.description });
    }

    if (includeOpening && param.showOpening) {
        cols.push({ id: "opening", header: texts.opening });
    }

    if (param.showDebitBefore) {
        cols.push({ id: "debitBefore", header: texts.debit,   group: "before" });
    }

    if (param.showCreditBefore) {
        cols.push({ id: "creditBefore", header: texts.credit,  group: "before" });
    }

    if (param.showBalanceBefore) {
        cols.push({ id: "balanceBefore", header: texts.balance, group: "before" });
    }

    if (param.showDebitClosing) {
        cols.push({ id: "debitClosing", header: texts.debit,   group: "closing" });
    }

    if (param.showCreditClosing) {
        cols.push({ id: "creditClosing", header: texts.credit,  group: "closing" });
    }

    if (param.showBalanceClosing) {
        cols.push({ id: "balanceClosing", header: texts.movement, group: "closing" });
    }

    if (param.showDebitFinal) {
        cols.push({ id: "debitFinal", header: texts.debit,   group: "final" });
    }

    if (param.showCreditFinal) {
        cols.push({ id: "creditFinal", header: texts.credit,  group: "final" });
    }

    if (param.showBalanceFinal) {
        cols.push({ id: "balanceFinal", header: texts.balance, group: "final" });
    }

    if (param.showBalanceVariancePercent) {
        cols.push({ id: "balanceVariancePercent", header: texts.balanceVariancePercent });
    }

    if (param.showLastDate) {
        cols.push({ id: "lastDate", header: texts.lastDate });
    }

    return cols;
}


// ============================================================
// ACCOUNT DATA COMPUTATION
// ============================================================

// Returns a function that decides whether a given journal row is a closing entry.
// The filter is built once at startup and reused for every row and every account,
// avoiding repeated eval() calls.
// Only the method selected in closingFilterMode is used ("doc", "description" or "function").
function getClosingFilter(banDoc, param) {

    // Custom JavaScript function
    // Example:  function(row) { var d = row.value("Notes"); return d ? d.indexOf("YEEEE") >= 0 : false; }
    if (param.closingFilterMode === "function") {
        if (param.customClosureFunction && param.customClosureFunction.trim() !== "") {
            try {
                var fn = eval("(" + param.customClosureFunction + ")");
                if (typeof fn === "function") {
                    return fn;
                }
            }
            catch (e) { /* invalid function: no closing entries */ }
        }
        // Empty or invalid function: warn the user, no closing entries
        banDoc.addMessage(getTexts(banDoc).errorCustomFunction);
        return function() { return false; };
    }

    // Keyword contained in the Description column
    if (param.closingFilterMode === "description") {
        var descKeyword = param.descriptionChiusuraKeyword ? param.descriptionChiusuraKeyword.trim() : "";

        // No text entered: warn the user, no closing entries
        if (descKeyword === "") {
            banDoc.addMessage(getTexts(banDoc).errorDescriptionKeywordEmpty);
            return function() { return false; };
        }

        return function(rowObj) {
            var desc = rowObj.value("Description");
            return desc ? desc.indexOf(descKeyword) >= 0 : false;
        };
    }

    // Default: exact codes in the Doc column, separated by ";" (e.g. "CHIU;XXX;YYY")
    var docKeywords = splitKeywords(param.docChiusuraKeyword);

    // No codes entered: warn the user, no closing entries
    if (docKeywords.length === 0) {
        banDoc.addMessage(getTexts(banDoc).errorDocKeywordEmpty);
        return function() { return false; };
    }

    return function(rowObj) {
        var doc = rowObj.value("Doc");
        if (!doc) {
            return false;
        }
        for (var i = 0; i < docKeywords.length; i++) {
            if (doc === docKeywords[i]) {
                return true;
            }
        }
        return false;
    };
}

// Splits a ";"-separated list of keywords into an array,
// trimming spaces and ignoring empty entries (e.g. "CHIU; XXX;;" -> ["CHIU", "XXX"]).
function splitKeywords(text) {
    var result = [];
    if (!text) {
        return result;
    }
    var parts = text.split(";");
    for (var i = 0; i < parts.length; i++) {
        var k = parts[i].trim();
        if (k !== "") {
            result.push(k);
        }
    }
    return result;
}

// Computes all balance figures for a single account by making three
// passes over the journal: one excluding closing entries (before),
// one including only closing entries, and one with all entries (final).
// Also finds the last posting date and computes the variance percentage.
function computeAccountData(ctx, account) {

    var banDoc        = ctx.banDoc;
    var closingFilter = ctx.closingFilter;

    var opening = "0";
    var debitBefore = "0", creditBefore = "0", balanceBefore = "0";
    var debitClosing = "0", creditClosing = "0", balanceClosing = "0";
    var debitFinal = "0", creditFinal = "0", balanceFinal = "0";
    var lastDate = "";

    // Opening balance and final balance (all entries) from a single call
    var finalObj = banDoc.currentBalance(account, "", "");
    if (finalObj) {
        opening      = finalObj.opening;
        debitFinal   = finalObj.debit;
        creditFinal  = finalObj.credit;
        balanceFinal = finalObj.balance;
    }

    // Balance excluding closing entries
    var beforeObj = banDoc.currentBalance(account, "", "", function(r) { return !closingFilter(r); });
    if (beforeObj) {
        debitBefore   = beforeObj.debit;
        creditBefore  = beforeObj.credit;
        balanceBefore = beforeObj.balance;
    }

    // Balance of closing entries only
    var closingObj = banDoc.currentBalance(account, "", "", function(r) { return closingFilter(r); });
    if (closingObj) {
        debitClosing   = closingObj.debit;
        creditClosing  = closingObj.credit;
        balanceClosing = closingObj.balance;
    }

    // Last posting date
    var card = banDoc.currentCard(account, "", "");
    if (card) {
        for (var i = 0; i < card.rowCount; i++) {
            var d = card.row(i).value("Date");
            if (d && d > lastDate) {
                lastDate = d;
            }
        }
    }

    // Variance %: how much did closing entries move the balance?
    // formula: (balanceFinal - balanceBefore) / |balanceBefore| * 100
    // The absolute value in the denominator makes the sign always show the direction
    // (+ towards debit, - towards credit), whatever the account type.
    // The result is marked as not significant when the base balance is too small
    // or the percentage is too large to be meaningful.
    var varianceMinBase    = "1";     // minimum |balanceBefore| for a meaningful percentage
    var varianceMaxPercent = "1000";  // above this |percentage| the value is not significant "n.s"

    var variancePercent        = "";
    var varianceNotSignificant = false;
    var diff = Banana.SDecimal.subtract(balanceFinal, balanceBefore);

    if (Banana.SDecimal.compare(diff, "0") !== 0) {
        var base = Banana.SDecimal.abs(balanceBefore);
        if (Banana.SDecimal.compare(base, varianceMinBase) < 0) {
            varianceNotSignificant = true;
        }
        else {
            var ratio = Banana.SDecimal.divide(diff, base);
            variancePercent = Banana.SDecimal.multiply(ratio, "100");
            if (Banana.SDecimal.compare(Banana.SDecimal.abs(variancePercent), varianceMaxPercent) > 0) {
                variancePercent        = "";
                varianceNotSignificant = true;
            }
        }
    }

    return {
        opening:         opening,
        debitBefore:     debitBefore,
        creditBefore:    creditBefore,
        balanceBefore:   balanceBefore,
        debitClosing:    debitClosing,
        creditClosing:   creditClosing,
        balanceClosing:  balanceClosing,
        debitFinal:      debitFinal,
        creditFinal:     creditFinal,
        balanceFinal:    balanceFinal,
        variancePercent: variancePercent,
        varianceNotSignificant: varianceNotSignificant,
        lastDate:        lastDate
    };
}

// Returns true if the account has at least one closing debit or credit movement.
function hasClosingMovements(data) {
    return Banana.SDecimal.compare(data.debitClosing,  "0") !== 0
        || Banana.SDecimal.compare(data.creditClosing, "0") !== 0;
}


// ============================================================
// TOTALS
// ============================================================

// Returns a totals object with all fields initialised to zero.
function zeroTotals() {
    return {
        opening: "0",
        debitBefore: "0", creditBefore: "0", balanceBefore: "0",
        debitClosing: "0", creditClosing: "0", balanceClosing: "0",
        debitFinal: "0", creditFinal: "0", balanceFinal: "0"
    };
}

// Adds the values from a single account's data object into a running totals object.
function accumulateTotals(totals, data) {

    totals.opening        = Banana.SDecimal.add(totals.opening,        data.opening        || "0");
    totals.debitBefore    = Banana.SDecimal.add(totals.debitBefore,    data.debitBefore);
    totals.creditBefore   = Banana.SDecimal.add(totals.creditBefore,   data.creditBefore);
    totals.balanceBefore  = Banana.SDecimal.add(totals.balanceBefore,  data.balanceBefore);
    totals.debitClosing   = Banana.SDecimal.add(totals.debitClosing,   data.debitClosing);
    totals.creditClosing  = Banana.SDecimal.add(totals.creditClosing,  data.creditClosing);
    totals.balanceClosing = Banana.SDecimal.add(totals.balanceClosing, data.balanceClosing);
    totals.debitFinal     = Banana.SDecimal.add(totals.debitFinal,     data.debitFinal);
    totals.creditFinal    = Banana.SDecimal.add(totals.creditFinal,    data.creditFinal);
    totals.balanceFinal   = Banana.SDecimal.add(totals.balanceFinal,   data.balanceFinal);
}


// ============================================================
// FORMATTING HELPERS
// ============================================================

// Formats a decimal string as a localised number with two decimal places.
// When showZero is false, zero amounts are returned as an empty string.
function formatAmount(amount, showZero) {
    return Banana.Converter.toLocaleNumberFormat(amount || "0", 2, showZero);
}

// Returns the given style classes, adding "negativeAmount" (red text)
// when the amount is negative and the showNegativeInRed setting is enabled.
function amountStyle(ctx, amount, style) {
    if (ctx.param.showNegativeInRed && amount && Banana.SDecimal.compare(amount, "0") < 0) {
        return style + " negativeAmount";
    }
    return style;
}

// Formats a date string as a localised date, or returns an empty string if the date is missing.
function formatDate(date) {
    return date ? Banana.Converter.toLocaleDateFormat(date) : "";
}

// Returns the variance percentage formatted as "x.xx %", the "not significant" label,
// or an empty string when there is no variance.
function formatVariancePercent(ctx, data) {
    if (data.varianceNotSignificant) {
        return ctx.texts.notSignificant;
    }
    var v = data.variancePercent;
    if (v === "" || Banana.SDecimal.compare(v, "0") === 0) {
        return "";
    }
    return formatAmount(v, true) + " %";
}

// Returns the CSS class for a variance percentage cell.
// Values are shown in a neutral colour; "not significant" values in grey italic.
function styleVariancePercent(data) {
    if (data.varianceNotSignificant) {
        return "tableCell amountCell notSignificant";
    }
    return "tableCell amountCell";
}


// ============================================================
// STYLES
// ============================================================

// Defines all CSS styles used in the report.
function defineStyles(stylesheet, param) {

    if (param.printLandscape) {
        stylesheet.addStyle("@page", "size: landscape; margin:15mm 10mm 10mm 10mm;");
    }
    else {
        stylesheet.addStyle("@page", "margin:15mm 10mm 10mm 10mm;");
    }

    stylesheet.addStyle("body",           "font-family:Helvetica; font-size:8pt");
    stylesheet.addStyle(".heading1",      "font-size:14pt; font-weight:bold; margin-top:10pt; margin-bottom:10pt;");
    stylesheet.addStyle(".heading2",      "font-size:10pt; font-weight:bold; margin-top:6pt; margin-bottom:4pt;");
    stylesheet.addStyle(".table",         "width:100%;");
    stylesheet.addStyle(".companyHeader", "font-size:10pt; margin-bottom:2pt;");
    stylesheet.addStyle(".periodHeader",  "font-size:9pt; font-style:italic; margin-bottom:6pt;");
    stylesheet.addStyle(".footer",        "text-align:center; font-size:8px; font-family:Courier New; margin-top:20pt;");

    // Main table
    stylesheet.addStyle(".alternateRow",       "background-color:#fafafa;");
    stylesheet.addStyle(".groupHeader",        "font-weight:bold; background-color:#f0f0f0; padding-top:3px; text-align:center; border-left:1pt solid #aaaaaa; border-right:1pt solid #aaaaaa;");
    stylesheet.addStyle(".groupHeaderEmpty",   "background-color:#f0f0f0;");
    stylesheet.addStyle(".textHeader",         "font-weight:bold; background-color:#f0f0f0; padding-top:3px; border-bottom:thin solid #888888; border-right:0.1pt solid #d0d0d0; text-align:left;");
    stylesheet.addStyle(".numberHeader",       "font-weight:bold; background-color:#f0f0f0; padding-top:3px; border-bottom:thin solid #888888; border-right:0.1pt solid #d0d0d0; text-align:right;");
    stylesheet.addStyle(".dateHeader",         "font-weight:bold; background-color:#f0f0f0; padding-top:3px; border-bottom:thin solid #888888; border-right:0.1pt solid #d0d0d0; text-align:center;");
    stylesheet.addStyle(".tableCell",          "padding:1px; padding-top:2px; border-bottom:0.1pt solid #888888; border-right:0.1pt solid #d0d0d0;");
    stylesheet.addStyle(".amountCell",         "padding:1px; text-align:right;");
    stylesheet.addStyle(".dateCell",           "padding:1px; text-align:center;");
    stylesheet.addStyle(".totalRow",           "font-weight:bold; background-color:#f8f8f8; border-top:thin solid #000000; padding-top:3px;");
    stylesheet.addStyle(".totalAmount",        "font-weight:bold; border-top:thin solid #000000; padding-top:3px; text-align:right;");
    stylesheet.addStyle(".sectionRow",         "font-weight:bold; background-color:#e6eef7; border-top:1pt solid #1f4e79; padding-top:4px; padding-bottom:3px;");
    stylesheet.addStyle(".grandTotalRow",      "font-weight:bold; font-size:9pt; background-color:#e6e6e6; border-top:2pt solid #000000; padding-top:4px;");
    stylesheet.addStyle(".grandTotalAmount",   "font-weight:bold; font-size:9pt; background-color:#e6e6e6; border-top:2pt solid #000000; text-align:right; padding-top:4px;");
    //stylesheet.addStyle(".accountWithClosing", "color:#1f4e79; font-weight:bold; text-decoration:underline;");
    stylesheet.addStyle(".notSignificant",     "color:#888888; font-style:italic;");
    stylesheet.addStyle(".negativeAmount",     "color:red;");

    // Closing detail table
    stylesheet.addStyle(".detailTable",        "width:100%; font-size:7.5pt; margin-bottom:10px; border:0.5pt solid #cccccc; background-color:#fcfcfc;");
    stylesheet.addStyle(".detailHeader",       "font-weight:bold; background-color:#e8e8e8; border-bottom:1px solid #bbbbbb; border-right:0.1pt solid #cccccc;");
    stylesheet.addStyle(".detailNumberHeader", "font-weight:bold; background-color:#e8e8e8; border-bottom:1px solid #bbbbbb; text-align:right;");
    stylesheet.addStyle(".detailCell",         "padding:1px; border-right:0.1pt solid #e0e0e0;");
    stylesheet.addStyle(".detailAmount",       "text-align:right;");
    stylesheet.addStyle(".detailTotalRow",     "font-weight:bold; border-top:1px solid #999999;");
    stylesheet.addStyle(".detailTotalAmount",  "font-weight:bold; border-top:1px solid #999999; text-align:right;");
    stylesheet.addStyle(".detailColDate",      "width:10%;");
    stylesheet.addStyle(".detailColDoc",       "width:10%;");
    stylesheet.addStyle(".detailColDesc",      "width:50%;");
    stylesheet.addStyle(".detailColContra",    "width:10%;");
    stylesheet.addStyle(".detailColAmount",    "width:10%;");
}


// ============================================================
// SETTINGS DIALOG
// ============================================================

// Opens the settings dialog, loads previously saved parameters,
// lets the user edit them, saves them, and returns the param object.
function settingsDialog() {

    var param = initParam();
    var saved = Banana.document.getScriptSettings();
    if (saved.length > 0) {
        param = JSON.parse(saved);
    }
    verifyParam(param);

    if (typeof Banana.Ui.openPropertyEditor !== "undefined") {
        var descriptors = buildParamDescriptors(param);
        if (!Banana.Ui.openPropertyEditor("Settings", descriptors, "dlgSettings")) {
            return;
        }
        for (var i = 0; i < descriptors.data.length; i++) {
            descriptors.data[i].readValue();
        }
    }

    Banana.document.setScriptSettings(JSON.stringify(param));
    return param;
}

// Builds the list of property descriptors that drives the settings dialog UI.
// Each descriptor defines a field: its name, label, type, current value,
// default value, and a readValue() function that writes the edited value
// back into the param object.
function buildParamDescriptors(param) {

    var texts = getTexts(Banana.document);
    var out   = { version: "1.0", data: [] };

    // Closing entries
    out.data.push({ name: "groupClosing", title: texts.paramGroupChiusura, type: "string", value: "", editable: false, readValue: function() {} });

    // Closing filter mode: the combobox shows translated labels, the param stores a fixed code.
    var modeCodes = ["doc", "description", "function"];
    var modeItems = [texts.closingModeDoc, texts.closingModeDescription, texts.closingModeFunction];
    var modeIndex = modeCodes.indexOf(param.closingFilterMode);
    if (modeIndex < 0) {
        modeIndex = 0;
    }

    out.data.push({ name: "closingFilterMode", parentObject: "groupClosing",
        title: texts.paramClosingFilterMode, type: "combobox",
        items: modeItems, value: modeItems[modeIndex], defaultvalue: modeItems[0],
        readValue: function() {
            var idx = modeItems.indexOf(this.value);
            param.closingFilterMode = idx >= 0 ? modeCodes[idx] : "doc";
        } });

    out.data.push({ name: "docChiusuraKeyword", parentObject: "groupClosing",
        title: texts.paramDocChiusuraKeyword, type: "string",
        value: param.docChiusuraKeyword, defaultvalue: "",
        readValue: function() { param.docChiusuraKeyword = this.value; } });

    out.data.push({ name: "descriptionChiusuraKeyword", parentObject: "groupClosing",
        title: texts.paramDescriptionChiusuraKeyword, type: "string",
        value: param.descriptionChiusuraKeyword, defaultvalue: "",
        readValue: function() { param.descriptionChiusuraKeyword = this.value; } });

    out.data.push({ name: "customClosureFunction", parentObject: "groupClosing",
        title: texts.paramCustomClosureFunction, type: "string",
        value: param.customClosureFunction, defaultvalue: "",
        readValue: function() { param.customClosureFunction = this.value; } });

    // Report options
    out.data.push({ name: "groupReport", title: texts.paramGroupReport, type: "string", value: "", editable: false, readValue: function() {} });

    out.data.push({ name: "showClosingDetails", parentObject: "groupReport",
        title: texts.paramShowClosingDetails, type: "bool",
        value: param.showClosingDetails, defaultvalue: false,
        readValue: function() { param.showClosingDetails = this.value; } });

    out.data.push({ name: "splitByBClass", parentObject: "groupReport",
        title: texts.paramSplitByBClass, type: "bool",
        value: param.splitByBClass, defaultvalue: true,
        readValue: function() { param.splitByBClass = this.value; } });

    out.data.push({ name: "showZeroAmounts", parentObject: "groupReport",
        title: texts.paramShowZeroAmounts, type: "bool",
        value: param.showZeroAmounts, defaultvalue: false,
        readValue: function() { param.showZeroAmounts = this.value; } });

    out.data.push({ name: "showNegativeInRed", parentObject: "groupReport",
        title: texts.paramShowNegativeInRed, type: "bool",
        value: param.showNegativeInRed, defaultvalue: true,
        readValue: function() { param.showNegativeInRed = this.value; } });

    out.data.push({ name: "showCostCentersSegments", parentObject: "groupReport",
        title: texts.paramShowCostCentersSegments, type: "bool",
        value: param.showCostCentersSegments, defaultvalue: true,
        readValue: function() { param.showCostCentersSegments = this.value; } });

    // Columns
    out.data.push({ name: "groupColumns", parentObject: "groupReport", title: texts.paramGroupColumns, type: "string", value: "", editable: false, readValue: function() {} });

    out.data.push({ name: "showAccount", parentObject: "groupColumns",
        title: texts.account, type: "bool",
        value: param.showAccount, defaultvalue: true,
        readValue: function() { param.showAccount = this.value; } });

    out.data.push({ name: "showDescription", parentObject: "groupColumns",
        title: texts.description, type: "bool",
        value: param.showDescription, defaultvalue: true,
        readValue: function() { param.showDescription = this.value; } });

    out.data.push({ name: "showOpening", parentObject: "groupColumns",
        title: texts.opening, type: "bool",
        value: param.showOpening, defaultvalue: true,
        readValue: function() { param.showOpening = this.value; } });

    out.data.push({ name: "showDebitBefore", parentObject: "groupColumns",
        title: texts.paramDebitBefore, type: "bool",
        value: param.showDebitBefore, defaultvalue: false,
        readValue: function() { param.showDebitBefore = this.value; } });

    out.data.push({ name: "showCreditBefore", parentObject: "groupColumns",
        title: texts.paramCreditBefore, type: "bool",
        value: param.showCreditBefore, defaultvalue: false,
        readValue: function() { param.showCreditBefore = this.value; } });

    out.data.push({ name: "showBalanceBefore", parentObject: "groupColumns",
        title: texts.paramBalanceBefore, type: "bool",
        value: param.showBalanceBefore, defaultvalue: true,
        readValue: function() { param.showBalanceBefore = this.value; } });

    out.data.push({ name: "showDebitClosing", parentObject: "groupColumns",
        title: texts.paramDebitClosing, type: "bool",
        value: param.showDebitClosing, defaultvalue: false,
        readValue: function() { param.showDebitClosing = this.value; } });

    out.data.push({ name: "showCreditClosing", parentObject: "groupColumns",
        title: texts.paramCreditClosing, type: "bool",
        value: param.showCreditClosing, defaultvalue: false,
        readValue: function() { param.showCreditClosing = this.value; } });

    out.data.push({ name: "showBalanceClosing", parentObject: "groupColumns",
        title: texts.paramBalanceClosing, type: "bool",
        value: param.showBalanceClosing, defaultvalue: true,
        readValue: function() { param.showBalanceClosing = this.value; } });

    out.data.push({ name: "showDebitFinal", parentObject: "groupColumns",
        title: texts.paramDebitFinal, type: "bool",
        value: param.showDebitFinal, defaultvalue: false,
        readValue: function() { param.showDebitFinal = this.value; } });

    out.data.push({ name: "showCreditFinal", parentObject: "groupColumns",
        title: texts.paramCreditFinal, type: "bool",
        value: param.showCreditFinal, defaultvalue: false,
        readValue: function() { param.showCreditFinal = this.value; } });

    out.data.push({ name: "showBalanceFinal", parentObject: "groupColumns",
        title: texts.paramBalanceFinal, type: "bool",
        value: param.showBalanceFinal, defaultvalue: true,
        readValue: function() { param.showBalanceFinal = this.value; } });

    out.data.push({ name: "showBalanceVariancePercent", parentObject: "groupColumns",
        title: texts.balanceVariancePercent, type: "bool",
        value: param.showBalanceVariancePercent, defaultvalue: false,
        readValue: function() { param.showBalanceVariancePercent = this.value; } });

    out.data.push({ name: "showLastDate", parentObject: "groupColumns",
        title: texts.lastDate, type: "bool",
        value: param.showLastDate, defaultvalue: true,
        readValue: function() { param.showLastDate = this.value; } });

    // Layout
    out.data.push({ name: "groupLayout", title: texts.paramGroupLayout, type: "string", value: "", editable: false, readValue: function() {} });

    out.data.push({ name: "printLandscape", parentObject: "groupLayout",
        title: texts.paramPrintLandscape, type: "bool",
        value: param.printLandscape, defaultvalue: false,
        readValue: function() { param.printLandscape = this.value; } });

    return out;
}

// Returns the default parameter object with all settings at their initial values.
function initParam() {
    return {
        printLandscape:             false,
        showClosingDetails:         false,
        splitByBClass:              true,
        showZeroAmounts:            false,
        showNegativeInRed:          true,
        showCostCentersSegments:    true,
        closingFilterMode:          "doc",
        docChiusuraKeyword:         "",
        descriptionChiusuraKeyword: "",
        customClosureFunction:      "",
        showAccount:                true,
        showDescription:            true,
        showOpening:                true,
        showDebitBefore:            false,
        showCreditBefore:           false,
        showBalanceBefore:          true,
        showDebitClosing:           false,
        showCreditClosing:          false,
        showBalanceClosing:         true,
        showDebitFinal:             false,
        showCreditFinal:            false,
        showBalanceFinal:           true,
        showBalanceVariancePercent: false,
        showLastDate:               true
    };
}

// Ensures that all expected keys exist in the param object.
// Fills in default values for any key that is missing,
// which can happen when loading settings saved by an older version of the extension.
function verifyParam(param) {

    var defaults = initParam();
    for (var key in defaults) {
        if (param[key] === undefined || param[key] === null) {
            param[key] = defaults[key];
        }
    }
}


// ============================================================
// LOCALISATION
// ============================================================

// Returns a localised text object for all labels used in the report and dialog.
// Supported languages: it, de, fr, en (default).
function getTexts(banDoc) {

    var lang = (banDoc.locale || "en").substr(0, 2);
    var t    = {};

    if (lang === "it") {
        t.reportTitle              = "Bilancio di verifica - Analisi registrazioni di chiusura";
        t.balanceSheet             = "Stato patrimoniale";
        t.incomeStatement          = "Conto economico";
        t.assets                   = "Attivi";
        t.liabilities              = "Passivi";
        t.revenues                 = "Ricavi";
        t.costs                    = "Costi";
        t.account                  = "Conto";
        t.description              = "Descrizione";
        t.contraAccount            = "Contropartita";
        t.opening                  = "Apertura";
        t.debit                    = "Dare";
        t.credit                   = "Avere";
        t.balance                  = "Saldo";
        t.movement                 = "Movimento";
        t.groupBefore              = "Provvisorio";
        t.groupClosing             = "Rettifiche di chiusura";
        t.groupFinal               = "Definitivo";
        t.balanceVariancePercent   = "Var. % saldo";
        t.notSignificant           = "n.s.";
        t.lastDate                 = "Ultima data";
        t.total                    = "Totale";
        t.generalTotal             = "Totale generale";
        t.date                     = "Data";
        t.costCenters              = "Centri di costo";
        t.segments                 = "Segmenti";
        t.closingDetailsSection    = "Dettaglio registrazioni di chiusura";
        t.paramGroupLayout              = "Layout";
        t.paramGroupChiusura            = "Filtro registrazioni";
        t.paramGroupReport              = "Report";
        t.paramGroupColumns             = "Mostra colonne";
        t.paramPrintLandscape           = "Stampa in orizzontale";
        t.paramShowClosingDetails       = "Mostra dettaglio registrazioni di chiusura";
        t.paramSplitByBClass            = "Suddividi per BClass (Attivi, Passivi, Ricavi, Costi)";
        t.paramShowZeroAmounts          = "Mostra importi a zero (0.00)";
        t.paramShowNegativeInRed        = "Mostra importi negativi in rosso";
        t.paramShowCostCentersSegments  = "Stampa centri di costo e segmenti";
        t.paramClosingFilterMode        = "Metodo di identificazione delle registrazioni di chiusura";
        t.closingModeDoc                = "Codici nella colonna Doc";
        t.closingModeDescription        = "Testo nella colonna Descrizione";
        t.closingModeFunction           = "Funzione JavaScript personalizzata";
        t.paramDocChiusuraKeyword       = "Codici registrazioni di chiusura (colonna Doc, separati da ;)";
        t.paramDescriptionChiusuraKeyword = "Testo registrazioni di chiusura (colonna Descrizione)";
        t.paramCustomClosureFunction    = "Funzione personalizzata per identificare le registrazioni di chiusura";
        t.errorDocKeywordEmpty          = "Metodo \"Codici nella colonna Doc\" selezionato, ma nessun codice è stato inserito. Nessuna registrazione è stata considerata di chiusura.";
        t.errorDescriptionKeywordEmpty  = "Metodo \"Testo nella colonna Descrizione\" selezionato, ma nessun testo è stato inserito. Nessuna registrazione è stata considerata di chiusura.";
        t.errorCustomFunction           = "La funzione personalizzata per identificare le registrazioni di chiusura è vuota o non valida. Nessuna registrazione è stata considerata di chiusura.";
        t.paramDebitBefore             = "Provvisorio - Dare";
        t.paramCreditBefore            = "Provvisorio - Avere";
        t.paramBalanceBefore           = "Provvisorio - Saldo";
        t.paramDebitClosing            = "Rettifiche di chiusura - Dare";
        t.paramCreditClosing           = "Rettifiche di chiusura - Avere";
        t.paramBalanceClosing          = "Rettifiche di chiusura - Movimento";
        t.paramDebitFinal              = "Definitivo - Dare";
        t.paramCreditFinal             = "Definitivo - Avere";
        t.paramBalanceFinal            = "Definitivo - Saldo";
    }
    else if (lang === "de") {
        t.reportTitle              = "Probebilanz - Analyse der Abschlussbuchungen";
        t.balanceSheet             = "Bilanz";
        t.incomeStatement          = "Erfolgsrechnung";
        t.assets                   = "Aktiven";
        t.liabilities              = "Passiven";
        t.revenues                 = "Erträge";
        t.costs                    = "Aufwände";
        t.account                  = "Konto";
        t.description              = "Bezeichnung";
        t.contraAccount            = "Gegenkonto";
        t.opening                  = "Eröffnung";
        t.debit                    = "Soll";
        t.credit                   = "Haben";
        t.balance                  = "Saldo";
        t.movement                 = "Bewegung";
        t.groupBefore              = "Provisorisch";
        t.groupClosing             = "Abschlussbuchungen";
        t.groupFinal               = "Definitiv";
        t.balanceVariancePercent   = "Saldo-Var. %";
        t.notSignificant           = "n.s.";
        t.lastDate                 = "Letztes Buchungsdatum";
        t.total                    = "Total";
        t.generalTotal             = "Gesamttotal";
        t.date                     = "Datum";
        t.costCenters              = "Kostenstellen";
        t.segments                 = "Segmente";
        t.closingDetailsSection    = "Details der Abschlussbuchungen";
        t.paramGroupLayout              = "Layout";
        t.paramGroupChiusura            = "Buchungsfilter";
        t.paramGroupReport              = "Bericht";
        t.paramGroupColumns             = "Spalten anzeigen";
        t.paramPrintLandscape           = "Querformat drucken";
        t.paramShowClosingDetails       = "Details der Abschlussbuchungen anzeigen";
        t.paramSplitByBClass            = "Nach BClass gliedern (Aktiven, Passiven, Erträge, Aufwände)";
        t.paramShowZeroAmounts          = "Nullbeträge anzeigen (0.00)";
        t.paramShowNegativeInRed        = "Negative Beträge rot anzeigen";
        t.paramShowCostCentersSegments  = "Kostenstellen und Segmente drucken";
        t.paramClosingFilterMode        = "Methode zur Identifikation der Abschlussbuchungen";
        t.closingModeDoc                = "Codes in der Spalte Doc";
        t.closingModeDescription        = "Text in der Spalte Beschreibung";
        t.closingModeFunction           = "Benutzerdefinierte JavaScript-Funktion";        
        t.paramDocChiusuraKeyword       = "Codes für Abschlussbuchungen (Spalte Doc, getrennt durch ;)";
        t.paramDescriptionChiusuraKeyword = "Text für Abschlussbuchungen (Spalte Beschreibung)";
        t.paramCustomClosureFunction    = "Benutzerdefinierte Funktion zur Identifikation von Abschlussbuchungen";
        t.errorDocKeywordEmpty          = "Methode \"Codes in der Spalte Doc\" gewählt, aber es wurde kein Code eingegeben. Keine Buchung wurde als Abschlussbuchung erkannt.";
        t.errorDescriptionKeywordEmpty  = "Methode \"Text in der Spalte Beschreibung\" gewählt, aber es wurde kein Text eingegeben. Keine Buchung wurde als Abschlussbuchung erkannt.";
        t.errorCustomFunction           = "Die benutzerdefinierte Funktion zur Identifikation der Abschlussbuchungen ist leer oder ungültig. Keine Buchung wurde als Abschlussbuchung erkannt.";
        t.paramDebitBefore             = "Provisorisch - Soll";
        t.paramCreditBefore            = "Provisorisch - Haben";
        t.paramBalanceBefore           = "Provisorisch - Saldo";
        t.paramDebitClosing            = "Abschlussbuchungen - Soll";
        t.paramCreditClosing           = "Abschlussbuchungen - Haben";
        t.paramBalanceClosing          = "Abschlussbuchungen - Bewegung";
        t.paramDebitFinal              = "Definitiv - Soll";
        t.paramCreditFinal             = "Definitiv - Haben";
        t.paramBalanceFinal            = "Definitiv - Saldo";
    }
    else if (lang === "fr") {
        t.reportTitle              = "Balance de vérification - Analyse des écritures de clôture";
        t.balanceSheet             = "Bilan";
        t.incomeStatement          = "Compte de résultat";
        t.assets                   = "Actifs";
        t.liabilities              = "Passifs";
        t.revenues                 = "Produits";
        t.costs                    = "Charges";
        t.account                  = "Compte";
        t.description              = "Description";
        t.contraAccount            = "Contrepartie";
        t.opening                  = "Ouverture";
        t.debit                    = "Débit";
        t.credit                   = "Crédit";
        t.balance                  = "Solde";
        t.movement                 = "Mouvement";
        t.groupBefore              = "Provisoire";
        t.groupClosing             = "Écritures de clôture";
        t.groupFinal               = "Définitif";
        t.balanceVariancePercent   = "Var. % solde";
        t.notSignificant           = "n.s.";
        t.lastDate                 = "Dernière date";
        t.total                    = "Total";
        t.generalTotal             = "Total général";
        t.date                     = "Date";
        t.costCenters              = "Centres de coûts";
        t.segments                 = "Segments";
        t.closingDetailsSection    = "Détail des écritures de clôture";
        t.paramGroupLayout              = "Layout";
        t.paramGroupChiusura            = "Filtre des écritures";
        t.paramGroupReport              = "Rapport";
        t.paramGroupColumns             = "Afficher les colonnes";
        t.paramPrintLandscape           = "Imprimer en format paysage";
        t.paramShowClosingDetails       = "Afficher le détail des écritures de clôture";
        t.paramSplitByBClass            = "Subdiviser par BClass (Actifs, Passifs, Produits, Charges)";
        t.paramShowZeroAmounts          = "Afficher les montants nuls (0.00)";
        t.paramShowNegativeInRed        = "Afficher les montants négatifs en rouge";
        t.paramShowCostCentersSegments  = "Imprimer les centres de coûts et les segments";
        t.paramClosingFilterMode        = "Méthode d'identification des écritures de clôture";
        t.closingModeDoc                = "Codes dans la colonne Doc";
        t.closingModeDescription        = "Texte dans la colonne Libellé";
        t.closingModeFunction           = "Fonction JavaScript personnalisée";
        t.paramDocChiusuraKeyword       = "Codes des écritures de clôture (colonne Doc, séparés par ;)";
        t.paramDescriptionChiusuraKeyword = "Texte des écritures de clôture (colonne Libellé)";
        t.paramCustomClosureFunction    = "Fonction personnalisée pour identifier les écritures de clôture";
        t.errorDocKeywordEmpty          = "Méthode \"Codes dans la colonne Doc\" sélectionnée, mais aucun code n'a été saisi. Aucune écriture n'a été considérée comme écriture de clôture.";
        t.errorDescriptionKeywordEmpty  = "Méthode \"Texte dans la colonne Libellé\" sélectionnée, mais aucun texte n'a été saisi. Aucune écriture n'a été considérée comme écriture de clôture.";
        t.errorCustomFunction           = "La fonction personnalisée pour identifier les écritures de clôture est vide ou non valide. Aucune écriture n'a été considérée comme écriture de clôture.";
        t.paramDebitBefore             = "Provisoire - Débit";
        t.paramCreditBefore            = "Provisoire - Crédit";
        t.paramBalanceBefore           = "Provisoire - Solde";
        t.paramDebitClosing            = "Écritures de clôture - Débit";
        t.paramCreditClosing           = "Écritures de clôture - Crédit";
        t.paramBalanceClosing          = "Écritures de clôture - Mouvement";
        t.paramDebitFinal              = "Définitif - Débit";
        t.paramCreditFinal             = "Définitif - Crédit";
        t.paramBalanceFinal            = "Définitif - Solde";
    }
    else {
        t.reportTitle              = "Trial Balance - Closing Transactions Analysis";
        t.balanceSheet             = "Balance Sheet";
        t.incomeStatement          = "Income Statement";
        t.assets                   = "Assets";
        t.liabilities              = "Liabilities";
        t.revenues                 = "Revenues";
        t.costs                    = "Expenses";
        t.account                  = "Account";
        t.description              = "Description";
        t.contraAccount            = "Contra account";
        t.opening                  = "Opening";
        t.debit                    = "Debit";
        t.credit                   = "Credit";
        t.balance                  = "Balance";
        t.movement                 = "Movement";
        t.groupBefore              = "Unadjusted";
        t.groupClosing             = "Adjustments";
        t.groupFinal               = "Adjusted";
        t.balanceVariancePercent   = "Var. % balance";
        t.notSignificant           = "n.m.";
        t.lastDate                 = "Last posting date";
        t.total                    = "Total";
        t.generalTotal             = "Grand total";
        t.date                     = "Date";
        t.costCenters              = "Cost centers";
        t.segments                 = "Segments";
        t.closingDetailsSection    = "Closing transactions details";
        t.paramGroupLayout              = "Layout";
        t.paramGroupChiusura            = "Transactions filter";
        t.paramGroupReport              = "Report";
        t.paramGroupColumns             = "Show columns";
        t.paramPrintLandscape           = "Print in landscape orientation";
        t.paramShowClosingDetails       = "Show closing transactions details";
        t.paramSplitByBClass            = "Split by BClass (Assets, Liabilities, Revenues, Expenses)";
        t.paramShowZeroAmounts          = "Show zero amounts (0.00)";
        t.paramShowNegativeInRed        = "Show negative amounts in red";
        t.paramShowCostCentersSegments  = "Print cost centers and segments";
        t.paramClosingFilterMode        = "Closing entries identification method";
        t.closingModeDoc                = "Codes in the Doc column";
        t.closingModeDescription        = "Text in the Description column";
        t.closingModeFunction           = "Custom JavaScript function";
        t.paramDocChiusuraKeyword       = "Closing entry codes (Doc column, separated by ;)";
        t.paramDescriptionChiusuraKeyword = "Closing entry text (Description column)";
        t.paramCustomClosureFunction    = "Custom function to identify closing transactions";
        t.errorDocKeywordEmpty          = "\"Codes in the Doc column\" method selected, but no code was entered. No entry was considered a closing entry.";
        t.errorDescriptionKeywordEmpty  = "\"Text in the Description column\" method selected, but no text was entered. No entry was considered a closing entry.";
        t.errorCustomFunction           = "The custom function to identify closing entries is empty or invalid. No entry was considered a closing entry.";
        t.paramDebitBefore             = "Unadjusted - Debit";
        t.paramCreditBefore            = "Unadjusted - Credit";
        t.paramBalanceBefore           = "Unadjusted - Balance";
        t.paramDebitClosing            = "Adjustments - Debit";
        t.paramCreditClosing           = "Adjustments - Credit";
        t.paramBalanceClosing          = "Adjustments - Movement";
        t.paramDebitFinal              = "Adjusted - Debit";
        t.paramCreditFinal             = "Adjusted - Credit";
        t.paramBalanceFinal            = "Adjusted - Balance";
    }

    return t;
}
