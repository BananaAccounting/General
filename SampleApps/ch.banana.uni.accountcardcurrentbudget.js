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
// @id = ch.banana.uni.accountcard.current.budget
// @api = 1.0
// @pubdate = 2026-03-30
// @publisher = Banana.ch SA
// @description = Account card (current vs budget)
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @docproperties =
// @timeout = -1



function exec() {

    if (!Banana.document)
        return;

	var isCurrentBananaVersionSupported = bananaRequiredVersion("10.0.12");
	if (!isCurrentBananaVersionSupported) {
		return "@Cancel";
	}

    var param = settingsDialog();
    if (!param)
        return "@Cancel";

    if (!param.account)
        return "@Cancel";

    var report = stampaReport(param);

    var stylesheet = Banana.Report.newStyleSheet();
    defineStyles(stylesheet, param);

    Banana.Report.preview(report, stylesheet);
}

//---------------------------------------------------
// ACCOUNT LIST
//---------------------------------------------------
function getAccountsList() {

    var list = [];

    var table = Banana.document.table('Accounts');
    if (!table)
        return list;

    for (var i = 0; i < table.rowCount; i++) {
        var row = table.row(i);

        var account = row.value("Account");
        var description = row.value("Description");

        if (account) {
            list.push(account + " - " + description);
        }
    }

    return list;
}

//---------------------------------------------------
// SETTINGS
//---------------------------------------------------
function settingsDialog() {

    var param = initParam();

    var savedParam = Banana.document.getScriptSettings();
    if (savedParam.length > 0) {
        param = JSON.parse(savedParam);
    }

    verifyParam(param);

    if (typeof (Banana.Ui.openPropertyEditor) !== 'undefined') {

        var dialogTitle = 'Settings';
        var convertedParam = convertParam(param);
        var pageAnchor = 'dlgSettings';

        if (!Banana.Ui.openPropertyEditor(dialogTitle, convertedParam, pageAnchor)) {
            return;
        }

        for (var i = 0; i < convertedParam.data.length; i++) {
            if (!convertedParam.data[i].language) {
                convertedParam.data[i].readValue();
            }
        }
    }

    Banana.document.setScriptSettings(JSON.stringify(param));
    return param;
}

function convertParam(param) {

    var convertedParam = {};
    convertedParam.version = '1.0';
    convertedParam.data = [];

    //---------------------------------------------------
    // ACCOUNT (COMBOBOX)
    //---------------------------------------------------
    var accountList = getAccountsList();

    var currentParam = {};
    currentParam.name = 'account';
    currentParam.title = 'Account';
    currentParam.type = 'combobox';
    currentParam.value = param.account ? param.account : '';
    currentParam.defaultvalue = accountList.length > 0 ? accountList[0] : '';
    currentParam.items = accountList;
    currentParam.readValue = function() {
        if (this.value) {
            var parts = this.value.split(" - ");
            param.account = parts[0];
        }
    };
    convertedParam.data.push(currentParam);

    //---------------------------------------------------
    // MODE
    //---------------------------------------------------
    currentParam = {};
    currentParam.name = 'mode';
    currentParam.title = 'Subdivision by period';
    currentParam.type = 'combobox';
    currentParam.value = param.mode ? param.mode : 'none';
    currentParam.defaultvalue = 'none';
    currentParam.items = ['none', 'by month', 'by quarter'];
    currentParam.readValue = function() {
        param.mode = this.value;
    };
    convertedParam.data.push(currentParam);


    //---------------------------------------------------
    // PAGE LAYOUT
    //---------------------------------------------------
    var currentParam = {};
    currentParam.name = 'printLandscape';
    currentParam.title = 'Print in landscape';
    currentParam.type = 'bool';
    currentParam.value = param.printLandscape ? true : false;
    currentParam.defaultvalue = false;
    currentParam.readValue = function() {
        param.printLandscape = this.value;
    };
    convertedParam.data.push(currentParam);

    return convertedParam;
}

function initParam() {
    var param = {};
    param.account = "";
    param.mode = "none";
    param.printLandscape = false;
    return param;
}

function verifyParam(param) {

    if (!param.account)
        param.account = "";

    if (!param.mode)
        param.mode = "none";

    if (!param.printLandscape)
        param.printLandscape = false;
}

//---------------------------------------------------
// REPORT
//---------------------------------------------------
function stampaReport(param) {

    var account = param.account;

    var report = Banana.Report.newReport("Account card " + account);

    var accountDescription = Banana.document.accountDescription(account);
    var transTab = Banana.document.currentCard(account, "", "");
    var budgetTransTab = Banana.document.budgetCard(account, "", "");

    report.addParagraph("Account Card: Current vs Budget", "title");
    report.addParagraph("Account: " + account);
    report.addParagraph("Description: " + accountDescription);

    var table = report.addTable("schedaTable");

    // CURRENT
    table.addColumn("colDate");
    table.addColumn("colDoc");
    table.addColumn("colDesc");
    table.addColumn("colAmount");
    table.addColumn("colAmount");
    table.addColumn("colAmount");

    // SEPARATOR
    table.addColumn("colSeparator");

    // BUDGET (stesse identiche classi)
    table.addColumn("colDate");
    table.addColumn("colDoc");
    table.addColumn("colDesc");
    table.addColumn("colAmount");
    table.addColumn("colAmount");
    table.addColumn("colAmount");

    // SEPARATOR
    table.addColumn("colSeparator");

    // DIFF.
    table.addColumn("colAmount");

    // Header principale (sezioni)
    var headerRow = table.getHeader().addRow("headerMain");
    headerRow.addCell("CURRENT", "headerSection aligncenter", 6);
    headerRow.addCell("", "");
    headerRow.addCell("BUDGET", "headerSection aligncenter", 6);
    headerRow.addCell("", "");
    headerRow.addCell("DIFF.", "headerSection aligncenter");

    // Header colonne
    headerRow = table.getHeader().addRow("headerSub");
    headerRow.addCell("Date");
    headerRow.addCell("Doc");
    headerRow.addCell("Description");
    headerRow.addCell("Debit", "amount");
    headerRow.addCell("Credit", "amount");
    headerRow.addCell("Balance", "amount");

    headerRow.addCell("", "");

    headerRow.addCell("Date");
    headerRow.addCell("Doc");
    headerRow.addCell("Description");
    headerRow.addCell("Debit", "amount");
    headerRow.addCell("Credit", "amount");
    headerRow.addCell("Balance", "amount");

    headerRow.addCell("", "");

    headerRow.addCell("Bud. - Curr.", "amount");

    //---------------------------------------------------
    // NORMAL MODE
    //---------------------------------------------------
    if (param.mode === "none") {

        var maxCount = Math.max(transTab.rowCount - 1, budgetTransTab.rowCount - 1);
        var lastCurrentBalance = "";
        var lastBudgetBalance = "";

        for (var i = 0; i < maxCount; i++) {

            var row = table.addRow();

            if (i < transTab.rowCount - 1) {
                var t = transTab.row(i);

                row.addCell(Banana.Converter.toLocaleDateFormat(t.value("JDate")));
                row.addCell(t.value("JDoc"));
                row.addCell(t.value("JDescription"));
                row.addCell(Banana.Converter.toLocaleNumberFormat(t.value("JDebitAmount")), "amount");
                row.addCell(Banana.Converter.toLocaleNumberFormat(t.value("JCreditAmount")), "amount");
                var currBalance = t.value("JBalance");
                lastCurrentBalance = currBalance;
                row.addCell(Banana.Converter.toLocaleNumberFormat(currBalance), "amount");
            } else {
                row.addCell("");
                row.addCell("");
                row.addCell("");
                row.addCell("");
                row.addCell("");
                row.addCell(Banana.Converter.toLocaleNumberFormat(lastCurrentBalance), "amount");
            }

            row.addCell("", "");

            if (i < budgetTransTab.rowCount - 1) {
                var b = budgetTransTab.row(i);

                row.addCell(Banana.Converter.toLocaleDateFormat(b.value("JDate")));
                row.addCell(b.value("JDoc"));
                row.addCell(b.value("JDescription"));
                row.addCell(Banana.Converter.toLocaleNumberFormat(b.value("JDebitAmount")), "amount");
                row.addCell(Banana.Converter.toLocaleNumberFormat(b.value("JCreditAmount")), "amount");
                var budBalance = b.value("JBalance");
                lastBudgetBalance = budBalance;
                row.addCell(Banana.Converter.toLocaleNumberFormat(budBalance), "amount");
            } else {
                row.addCell("");
                row.addCell("");
                row.addCell("");
                row.addCell("");
                row.addCell("");
                row.addCell(Banana.Converter.toLocaleNumberFormat(lastBudgetBalance), "amount");
            }

            row.addCell("", "");

            var diffValue = "";

            diffValue = Banana.SDecimal.subtract(lastBudgetBalance, lastCurrentBalance);
            
            row.addCell(diffValue !== "" ? Banana.Converter.toLocaleNumberFormat(diffValue) : "", "amount");
        }
    }

    //---------------------------------------------------
    // BY MONTH / QUARTER MODE
    //---------------------------------------------------
    else if (param.mode === "by month" || param.mode === "by quarter") {

        var currentByMonth = {};
        var budgetByMonth = {};

        for (var i = 0; i < transTab.rowCount - 1; i++) {
            var r = transTab.row(i);
            var date = r.value("JDate");
            if (!date) continue;

            var year = date.substr(0,4);
            var month = parseInt(date.substr(5,2), 10);

            var key;
            var label;

            if (param.mode === "by month") {
                key = date.substr(0,7);
                label = month.toString().padStart(2, '0') + "-" + year;
            } else {
                var quarter = Math.floor((month - 1) / 3) + 1;
                key = year + "-Q" + quarter;
                label = "Q" + quarter + " " + year;
            }

            if (!currentByMonth[key])
                currentByMonth[key] = {label: label, rows: []};

            currentByMonth[key].rows.push(r);
        }

        for (var i = 0; i < budgetTransTab.rowCount - 1; i++) {
            var r = budgetTransTab.row(i);
            var date = r.value("JDate");
            if (!date) continue;

            var year = date.substr(0,4);
            var month = parseInt(date.substr(5,2), 10);

            var key;
            var label;

            if (param.mode === "by month") {
                key = date.substr(0,7);
                label = month.toString().padStart(2, '0') + "-" + year;
            } else {
                var quarter = Math.floor((month - 1) / 3) + 1;
                key = year + "-Q" + quarter;
                label = "Q" + quarter + " " + year;
            }

            if (!budgetByMonth[key])
                budgetByMonth[key] = {label: label, rows: []};

            budgetByMonth[key].rows.push(r);
        }

        var months = {};
        for (var m in currentByMonth) months[m] = true;
        for (var m in budgetByMonth) months[m] = true;

        var monthList = Object.keys(months);
        monthList.sort();

        var lastCurrentBalance = "";
        var lastBudgetBalance = "";

        for (var m = 0; m < monthList.length; m++) {

            var lastCurrentBalance = "";
            var lastBudgetBalance = "";
            var currentPeriodBalance = 0;
            var budgetPeriodBalance = 0;

            var key = monthList[m];

            var currentRows = currentByMonth[key] ? currentByMonth[key].rows : [];
            var budgetRows = budgetByMonth[key] ? budgetByMonth[key].rows : [];

            var label = currentByMonth[key] ? currentByMonth[key].label :
                        budgetByMonth[key] ? budgetByMonth[key].label : key;

            var maxRows = Math.max(currentRows.length, budgetRows.length);

            var titleRow = table.addRow("month");
            titleRow.addCell(label, "aligncenter", 6);
            titleRow.addCell("", "");
            titleRow.addCell(label, "aligncenter", 6);
            titleRow.addCell("");
            titleRow.addCell("");

            for (var i = 0; i < maxRows; i++) {

                var row = table.addRow();

                if (i < currentRows.length) {
                    var t = currentRows[i];

                    row.addCell(Banana.Converter.toLocaleDateFormat(t.value("JDate")));
                    row.addCell(t.value("JDoc"));
                    row.addCell(t.value("JDescription"));
                    row.addCell(Banana.Converter.toLocaleNumberFormat(t.value("JDebitAmount")), "amount");
                    row.addCell(Banana.Converter.toLocaleNumberFormat(t.value("JCreditAmount")), "amount");
                    var currBalance = t.value("JBalance");
                    lastCurrentBalance = currBalance;
                    currentPeriodBalance = Banana.Converter.toInternalNumberFormat(currBalance);
                    row.addCell(Banana.Converter.toLocaleNumberFormat(currBalance), "amount");
                } else {
                    row.addCell("");
                    row.addCell("");
                    row.addCell("");
                    row.addCell("");
                    row.addCell("");
                    row.addCell(Banana.Converter.toLocaleNumberFormat(lastCurrentBalance), "amount");
                }

                row.addCell("", "");

                if (i < budgetRows.length) {
                    var b = budgetRows[i];

                    row.addCell(Banana.Converter.toLocaleDateFormat(b.value("JDate")));
                    row.addCell(b.value("JDoc"));
                    row.addCell(b.value("JDescription"));
                    row.addCell(Banana.Converter.toLocaleNumberFormat(b.value("JDebitAmount")), "amount");
                    row.addCell(Banana.Converter.toLocaleNumberFormat(b.value("JCreditAmount")), "amount");
                    var budBalance = b.value("JBalance");
                    lastBudgetBalance = budBalance;
                    budgetPeriodBalance = Banana.Converter.toInternalNumberFormat(budBalance);
                    row.addCell(Banana.Converter.toLocaleNumberFormat(budBalance), "amount");
                } else {
                    row.addCell("");
                    row.addCell("");
                    row.addCell("");
                    row.addCell("");
                    row.addCell("");
                    row.addCell(Banana.Converter.toLocaleNumberFormat(lastBudgetBalance), "amount");
                }

                row.addCell("", "");

                var diffValue = "";

                var currBalForDiff = lastCurrentBalance;
                var budBalForDiff = lastBudgetBalance;

                // se nella riga corrente esiste un saldo, usa quello
                if (i < currentRows.length) {
                    currBalForDiff = currentRows[i].value("JBalance");
                }

                if (i < budgetRows.length) {
                    budBalForDiff = budgetRows[i].value("JBalance");
                }

                diffValue = Banana.SDecimal.subtract(
                    Banana.Converter.toInternalNumberFormat(budBalForDiff),
                    Banana.Converter.toInternalNumberFormat(currBalForDiff)
                );

                row.addCell(diffValue !== "" ? Banana.Converter.toLocaleNumberFormat(diffValue) : "", "amount");
            }
        }
    }

    //---------------------------------------------------
    // TOTALS
    //---------------------------------------------------
    var lastRow = table.addRow("total");

    if (transTab.rowCount > 0) {
        var tLast = transTab.row(transTab.rowCount - 1);

        lastRow.addCell(Banana.Converter.toLocaleDateFormat(tLast.value("JDate")));
        lastRow.addCell(tLast.value("JDoc"));
        lastRow.addCell("Total transactions");
        lastRow.addCell(Banana.Converter.toLocaleNumberFormat(tLast.value("JDebitAmount")), "amount");
        lastRow.addCell(Banana.Converter.toLocaleNumberFormat(tLast.value("JCreditAmount")), "amount");
        lastRow.addCell(Banana.Converter.toLocaleNumberFormat(tLast.value("JBalance")), "amount");
    } else {
        for (var i = 0; i < 6; i++) lastRow.addCell("");
    }

    lastRow.addCell("", "");

    if (budgetTransTab.rowCount > 0) {
        var bLast = budgetTransTab.row(budgetTransTab.rowCount - 1);

        lastRow.addCell(Banana.Converter.toLocaleDateFormat(bLast.value("JDate")));
        lastRow.addCell(bLast.value("JDoc"));
        lastRow.addCell("Total");
        lastRow.addCell(Banana.Converter.toLocaleNumberFormat(bLast.value("JDebitAmount")), "amount");
        lastRow.addCell(Banana.Converter.toLocaleNumberFormat(bLast.value("JCreditAmount")), "amount");
        lastRow.addCell(Banana.Converter.toLocaleNumberFormat(bLast.value("JBalance")), "amount");
    } else {
        for (var i = 0; i < 6; i++) lastRow.addCell("");
    }

    lastRow.addCell("", "");

    var totalDiff = "";

    if (transTab.rowCount > 0 && budgetTransTab.rowCount > 0) {
        var tLast = transTab.row(transTab.rowCount - 1);
        var bLast = budgetTransTab.row(budgetTransTab.rowCount - 1);

        totalDiff = Banana.SDecimal.subtract(
            Banana.Converter.toInternalNumberFormat(bLast.value("JBalance")),
            Banana.Converter.toInternalNumberFormat(tLast.value("JBalance"))
        );
    }

    lastRow.addCell(totalDiff !== "" ? Banana.Converter.toLocaleNumberFormat(totalDiff) : "","amount");


    //---------------------------------------------------
    // FOOTER
    //---------------------------------------------------
    stampaFooter(report);

    return report;
}

function stampaFooter(report) {
    report.getFooter().addClass("footer");
    var textfield = report.getFooter().addText("Banana Accounting - Account Card Report (Beta version) - Page ", "");
    if (textfield.excludeFromTest) {
        textfield.excludeFromTest();
    }
    report.getFooter().addFieldPageNr();
}

//---------------------------------------------------
// STYLES
//---------------------------------------------------
function defineStyles(stylesheet, param) {

    if (param.printLandscape)
        stylesheet.addStyle("@page", "size: landscape; margin:15mm 10mm 10mm 10mm;");
    else
        stylesheet.addStyle("@page", "margin:15mm 10mm 10mm 10mm;");

    stylesheet.addStyle("body", "font-family:Helvetica; font-size:8pt");
    stylesheet.addStyle("table.schedaTable", "width:100%;");
    stylesheet.addStyle("table.schedaTable td", "border: thin solid black; padding: 2px;");
    stylesheet.addStyle("tr.header td", "font-weight: bold;");
    stylesheet.addStyle("tr.total td", "font-weight: bold;");
    stylesheet.addStyle("tr.month td","font-weight:bold; background-color:#f7f7f7; border-top:2px solid #999999; border-bottom:1px solid #dddddd; padding:6px 0;");
    stylesheet.addStyle(".amount", "text-align:right;");
    stylesheet.addStyle(".aligncenter", "text-align:center;");
    stylesheet.addStyle(".separator", "background-color:#e0e0e0; width:8px;");
    stylesheet.addStyle("table.summaryTable", "margin-top:10px; width:40%;");
    stylesheet.addStyle("table.summaryTable td", "border: thin solid black; padding: 4px;");
    stylesheet.addStyle(".colDate", "width:9%");
    stylesheet.addStyle(".colDoc", "width:5%");
    stylesheet.addStyle(".colDesc", "width:24%");
    stylesheet.addStyle(".colAmount", "width:12%");
    stylesheet.addStyle(".colSeparator", "width:1%");
    stylesheet.addStyle(".colDiff", "width:8%;");
    stylesheet.addStyle(".title", "font-size:18px; font-weight:bold; margin-bottom:10px;");
    stylesheet.addStyle(".summaryTitle", "font-size:14px; font-weight:bold; margin-top:15px; margin-bottom:5px;");
    stylesheet.addStyle("table.summaryTable", "margin-top:5px; width:60%;");
    stylesheet.addStyle("table.summaryTable td", "border: thin solid black; padding: 4px;");
    stylesheet.addStyle(".summaryHeader", "font-weight:bold; background-color:#eeeeee;");
    stylesheet.addStyle(".summaryLabel", "width:65%; font-weight:bold;");
    stylesheet.addStyle(".summaryAmount", "width:35%; text-align:right; font-size:11pt;");
    stylesheet.addStyle("table.summaryTable", "font-size:10pt;");
    stylesheet.addStyle(".headerSection","font-weight:bold; font-size:12px; background-color: #e6e6e6;");
    stylesheet.addStyle("tr.headerMain td","border: thin solid black; padding:4px; background-color: #e6e6e6;");
    stylesheet.addStyle("tr.headerSub td", "font-weight:bold; background-color: #e6e6e6; border-bottom:2px solid black;");
    stylesheet.addStyle(".footer", "text-align:center; font-size:6px; font-family:Courier New;");
}

function bananaRequiredVersion(requiredVersion) {
	if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) < 0) {
		return false;
	}
	return true;
}