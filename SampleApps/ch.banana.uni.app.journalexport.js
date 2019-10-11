// Copyright [2019] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.uni.app.journalexport.js
// @api = 1.0
// @pubdate = 2019-10-11
// @publisher = Banana.ch SA
// @description = Journal Export
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
*	Resume
*
*	This app export the journal (current and budget) of transactions from Banana Accounting.
*/


function exec() {
	if (!Banana.document) {
		return;
	}
	var report = Banana.Report.newReport('Journal Report (Current / Budget)');
	
	// Journal for current data
	var journalCurrent = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);
	
	// Journal for budget data
	var journalBudget = Banana.document.journal(Banana.document.ORIGINTYPE_BUDGET, Banana.document.ACCOUNTTYPE_NORMAL);
	
	printJournalReport(Banana.document, report, journalCurrent, journalBudget);
	
	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);
}

function printJournalReport(banDoc, report, journalCurrent, journalBudget) {

	// Check if multy currency accounting
	var isMultiCurrency = false;
	var tableExchangeRates = banDoc.table("ExchangeRates");
	if (tableExchangeRates) {
		isMultiCurrency = true;
	}

	//Print the table header
	var table = report.addTable("table");
	tableRow = table.addRow();
	tableRow.addCell("Date", "bold", 1);
	tableRow.addCell("Transaction description", "bold", 1);
	tableRow.addCell("Account/Description", "bold", 1);
	tableRow.addCell("Gr/Description", "bold", 1);
	tableRow.addCell("Current", "bold", 1);
	tableRow.addCell("Budget", "bold", 1);
	tableRow.addCell("VAT Code", "bold", 1);
	tableRow.addCell("CC1","bold", 1);
	tableRow.addCell("CC2","bold", 1);
	tableRow.addCell("CC3","bold", 1);
	tableRow.addCell("Segment1","bold", 1);
	tableRow.addCell("Segment2","bold", 1);
	tableRow.addCell("Segment3","bold", 1);
	if (isMultiCurrency) {
		tableRow.addCell("JTransactionCurrency","bold", 1);
		tableRow.addCell("JAmountTransactionCurrency","bold", 1);
	}
	tableRow.addCell("JOriginType", "bold", 1);

	/*
	* CURRENT
	*
	* Read the table row by row and save some values
	*/
	for (var i = 0; i < journalCurrent.rowCount; i++) {
		var tRow = journalCurrent.row(i);
		if (tRow.value('JOperationType') == banDoc.OPERATIONTYPE_TRANSACTION) { // only transactions rows
			var jDate = tRow.value('JDate');
			var jDescription = tRow.value('JDescription');
			var jAccount = tRow.value('JAccount');
			var jAccountDescription = tRow.value('JAccountDescription');
			var accountDescription = jAccount + " " + jAccountDescription;
			var jAccountGr = tRow.value("JAccountGr");
			var jAccountGrDescription = tRow.value("JAccountGrDescription");
			var grDescription = jAccountGr + " " + jAccountGrDescription;
			var jAmount = tRow.value('JAmount');
			var jVatCode = tRow.value("JVatCodeWithoutSign");
			var cc1 = tRow.value("JCC1");
			var cc2 = tRow.value("JCC2");
			var cc3 = tRow.value("JCC3");
			var jSegment1 = tRow.value("JSegment1");
			var jSegment2 = tRow.value("JSegment2");
			var jSegment3 = tRow.value("JSegment3");
			if (isMultiCurrency) {
				var jTransactionCurrency = tRow.value("JTransactionCurrency");
				var jAmountTransactionCurrency = tRow.value("JAmountTransactionCurrency");
			}
			var jOriginType = tRow.value("JOriginType");
	
			tableRow = table.addRow();
			tableRow.addCell(jDate, "", 1);
			tableRow.addCell(jDescription, "", 1);
			tableRow.addCell(accountDescription, "", 1);
			tableRow.addCell(grDescription, "", 1);
			tableRow.addCell(jAmount, "right", 1);
			tableRow.addCell("","", 1);
			tableRow.addCell(jVatCode, "", 1);
			tableRow.addCell(cc1, "", 1);
			tableRow.addCell(cc2, "", 1);
			tableRow.addCell(cc3, "", 1);
			tableRow.addCell(jSegment1, "", 1);
			tableRow.addCell(jSegment2, "", 1);
			tableRow.addCell(jSegment3, "", 1);
			if (isMultiCurrency) {
				tableRow.addCell(jTransactionCurrency, "", 1);
				tableRow.addCell(jAmountTransactionCurrency, "", 1);
			}
			tableRow.addCell(jOriginType, "", 1);
		}
	}

	/*
	* BUDGET
	*
	* Read the table row by row and save some values
	*/
	for (var i = 0; i < journalBudget.rowCount; i++) {
		var tRow = journalBudget.row(i);
		if (tRow.value('JOperationType') == banDoc.OPERATIONTYPE_TRANSACTION) { // only transactions rows
			var jDate = tRow.value('JDate');
			var jDescription = tRow.value('JDescription');
			var jAccount = tRow.value('JAccount');
			var jAccountDescription = tRow.value('JAccountDescription');
			var accountDescription = jAccount + " " + jAccountDescription;
			var jAccountGr = tRow.value("JAccountGr");
			var jAccountGrDescription = tRow.value("JAccountGrDescription");
			var grDescription = jAccountGr + " " + jAccountGrDescription;
			var jAmount = tRow.value('JAmount');
			var jVatCode = tRow.value("JVatCodeWithoutSign");
			var cc1 = tRow.value("JCC1");
			var cc2 = tRow.value("JCC2");
			var cc3 = tRow.value("JCC3");
			var jSegment1 = tRow.value("JSegment1");
			var jSegment2 = tRow.value("JSegment2");
			var jSegment3 = tRow.value("JSegment3");
			if (isMultiCurrency) {
				var jTransactionCurrency = tRow.value("JTransactionCurrency");
				var jAmountTransactionCurrency = tRow.value("JAmountTransactionCurrency");
			}
			var jOriginType = tRow.value("JOriginType");
	
			tableRow = table.addRow();
			tableRow.addCell(jDate, "", 1);
			tableRow.addCell(jDescription, "", 1);
			tableRow.addCell(accountDescription, "", 1);
			tableRow.addCell(grDescription, "", 1);
			tableRow.addCell("", "", 1);
			tableRow.addCell(jAmount, "right", 1);
			tableRow.addCell(jVatCode, "", 1);
			tableRow.addCell(cc1, "", 1);
			tableRow.addCell(cc2, "", 1);
			tableRow.addCell(cc3, "", 1);
			tableRow.addCell(jSegment1, "", 1);
			tableRow.addCell(jSegment2, "", 1);
			tableRow.addCell(jSegment3, "", 1);
			if (isMultiCurrency) {
				tableRow.addCell(jTransactionCurrency, "", 1);
				tableRow.addCell(jAmountTransactionCurrency, "", 1);
			}
			tableRow.addCell(jOriginType, "", 1);
		}
	}
}

function createStyleSheet() {
	var stylesheet = Banana.Report.newStyleSheet();
	var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "15mm 5mm 10mm 5mm");
    pageStyle.setAttribute("size", "landscape");
    stylesheet.addStyle("body", "font-size: 7pt; font-family: Helvetica");
    stylesheet.addStyle(".bold", "font-weight:bold");
    stylesheet.addStyle(".right", "text-align:right");
    style = stylesheet.addStyle(".table");
	style.setAttribute("width", "100%");
	stylesheet.addStyle("table.table td", "border: thin solid black");
	return stylesheet;
}
