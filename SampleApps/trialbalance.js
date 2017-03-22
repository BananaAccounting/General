// Copyright [2015] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.app.trialbalance
// @api = 1.0
// @pubdate = 2017-03-22
// @publisher = Banana.ch SA
// @description = Trial Balance
// @task = app.command
// @doctype = *;*
// @docproperties =
// @outputformat = none
// @inputdatasource = none
// @timeout = -1




var sumDebit = 0;
var sumCredit = 0;


//Main function
function exec(string) {
	
	//Check if we are on an opened document
	if (!Banana.document) {
		return;
	}
	
	var dateform = getPeriodSettings();
	if (dateform) {
		printReport(dateform.selectionStartDate, dateform.selectionEndDate);
	}
}


//Function that creates and prints the report
function printReport(startDate, endDate) {

	//Add a name to the report
	var report = Banana.Report.newReport("Trial Balance");

	//Add a title
	report.addParagraph("Trial Balance", "heading1");
	report.addParagraph(" ", "");

	//Create a table for the report
	var table = report.addTable("table");
	
	//Add column titles to the table
	tableRow = table.addRow();
	tableRow.addCell("", "", 1);
	tableRow.addCell("Trial Balance at " + Banana.Converter.toLocaleDateFormat(endDate), "alignRight bold", 3);

	tableRow = table.addRow();
	tableRow.addCell("", " bold borderBottom");
	tableRow.addCell("", " bold borderBottom");
	tableRow.addCell("Debit", "alignCenter bold borderBottom");
	tableRow.addCell("Credit", "alignCenter bold borderBottom");

	/* 1. Print the balance sheet */
	printBalanceSheet(startDate, endDate, report, table);

	/* 2. Print the profit & loss statement */
	printProfitLossStatement(startDate, endDate, report, table);

	/* 3. Print totals */
	printTotals(report, table);

	//Add a footer to the report
	addFooter(report);

	//Print the report
	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);
}




//Function that prints the balance sheet
function printBalanceSheet(startDate, endDate, report, table) {
	
	//Get the Accounts table
	var accountsTab = Banana.document.table("Accounts");

	//Assets - BClass 1
	for (var i = 0; i < accountsTab.rowCount; i++) {	
		var tRow = accountsTab.row(i);

		if (tRow.value("Account") && tRow.value("BClass") == "1") {
			tableRow = table.addRow();
			tableRow.addCell(tRow.value("Account"), "alignRight", 1);
			tableRow.addCell(tRow.value("Description"), "", 1);
			var bal = calcBalance(tRow.value("Account"), tRow.value("BClass"), startDate, endDate);
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(bal), "alignRight", 1);
			tableRow.addCell("", "", 1);
			sumDebit = Banana.SDecimal.add(sumDebit, bal);
		}
	}	

	//Liabilities - BClass 2
	for (var i = 0; i < accountsTab.rowCount; i++) {	
		var tRow = accountsTab.row(i);

		if (tRow.value("Account") && tRow.value("BClass") == "2") {
			tableRow = table.addRow();
			tableRow.addCell(tRow.value("Account"), "alignRight", 1);
			tableRow.addCell(tRow.value("Description"), "", 1);
			tableRow.addCell("", "", 1);
			var bal = calcBalance(tRow.value("Account"), tRow.value("BClass"), startDate, endDate);
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(bal), "alignRight", 1);
			sumCredit = Banana.SDecimal.add(sumCredit, bal);
		}
	}
}




//Function that prints the balance sheet
function printProfitLossStatement(startDate, endDate, report, table) {
	
	//Get the Accounts table
	var accountsTab = Banana.document.table("Accounts");

	//Income - BClass 4
	for (var i = 0; i < accountsTab.rowCount; i++) {	
		var tRow = accountsTab.row(i);

		if (tRow.value("Account") && tRow.value("BClass") == "4") {
			tableRow = table.addRow();
			tableRow.addCell(tRow.value("Account"), "alignRight", 1);
			tableRow.addCell(tRow.value("Description"), "", 1);
			tableRow.addCell("", "", 1);
			var bal = calcBalance(tRow.value("Account"), tRow.value("BClass"), startDate, endDate);
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(bal), "alignRight", 1);
			sumCredit = Banana.SDecimal.add(sumCredit, bal);
		}
	}
	
	//Expenses - BClass 3
	for (var i = 0; i < accountsTab.rowCount; i++) {	
		var tRow = accountsTab.row(i);

		if (tRow.value("Account") && tRow.value("BClass") == "3") {
			tableRow = table.addRow();
			tableRow.addCell(tRow.value("Account"), "alignRight", 1);
			tableRow.addCell(tRow.value("Description"), "", 1);
			var bal = calcBalance(tRow.value("Account"), tRow.value("BClass"), startDate, endDate);
			if (Banana.SDecimal.sign(bal) > 0 || Banana.SDecimal.sign(bal) == 0) {
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(bal), "alignRight", 1);
				tableRow.addCell("", "", 1);
				sumDebit = Banana.SDecimal.add(sumDebit, bal);
			} else {
				tableRow.addCell("", "", 1);
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(Banana.SDecimal.invert(bal)), "alignRight", 1);
				sumCredit = Banana.SDecimal.add(sumCredit, Banana.SDecimal.invert(bal));
			}
		}
	}
}





//Function that prints the total of debit and total of credit
function printTotals(report, table) {
	tableRow = table.addRow();
	tableRow.addCell("", "", 2);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(sumDebit), "alignRight font12 bold", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(sumCredit), "alignRight font12 bold", 1);
}




//Function that calculates the balance for the given account, bclass and period
function calcBalance(account, bClass, startDate, endDate) {
	var currentBal = Banana.document.currentBalance(account, startDate, endDate);
	if (bClass === "1") {
		return currentBal.balance;
	}
	else if (bClass === "2") {
		return Banana.SDecimal.invert(currentBal.balance);
	}
	else if (bClass === "3") {
		return currentBal.total;
	}
	else if (bClass === "4") {
		return Banana.SDecimal.invert(currentBal.total);
	}
	else if (!bClass) {
		return currentBal.balance;
	}
}




//Function that adds a Footer to the report
function addFooter(report) {
	var date = new Date();
	var d = Banana.Converter.toLocaleDateFormat(date);
	report.getFooter().addClass("footer");
	var versionLine = report.getFooter().addText(d + " - Trial balance - Page ", "description");
	report.getFooter().addFieldPageNr();
}



//The main purpose of this function is to allow the user to enter the accounting period desired and saving it for the next time the script is run.
//Every time the user runs of the script he has the possibility to change the date of the accounting period.
function getPeriodSettings() {
	
	//The formeters of the period that we need
	var scriptform = {
	   "selectionStartDate": "",
	   "selectionEndDate": "",
	   "selectionChecked": "false"
	};

	//Read script settings
	var data = Banana.document.scriptReadSettings();
	
	//Check if there are previously saved settings and read them
	if (data.length > 0) {
		try {
			var readSettings = JSON.parse(data);
			
			//We check if "readSettings" is not null, then we fill the formeters with the values just read
			if (readSettings) {
				scriptform = readSettings;
			}
		} catch (e){}
	}
	
	//We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
	var docStartDate = Banana.document.startPeriod();
	var docEndDate = Banana.document.endPeriod();	
	
	//A dialog window is opened asking the user to insert the desired period. By default is the accounting period
	var selectedDates = Banana.Ui.getPeriod("Period", docStartDate, docEndDate, 
		scriptform.selectionStartDate, scriptform.selectionEndDate, scriptform.selectionChecked);
		
	//We take the values entered by the user and save them as "new default" values.
	//This because the next time the script will be executed, the dialog window will contains the new values.
	if (selectedDates) {
		scriptform["selectionStartDate"] = selectedDates.startDate;
		scriptform["selectionEndDate"] = selectedDates.endDate;
		scriptform["selectionChecked"] = selectedDates.hasSelection;

		//Save script settings
		var formToString = JSON.stringify(scriptform);
		var value = Banana.document.scriptSaveSettings(formToString);		
    } else {
		//User clicked cancel
		return;
	}
	return scriptform;
}



//Function that creates styles for the report
function createStyleSheet() {
	var stylesheet = Banana.Report.newStyleSheet();

    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "15mm 15mm 15mm 25mm");

    stylesheet.addStyle("body", "font-family : Arial");

	style = stylesheet.addStyle(".footer");
	style.setAttribute("text-align", "center");
	style.setAttribute("font-size", "8px");
	style.setAttribute("font-family", "Courier New");
	//style.setAttribute("border-top", "thin solid black");

	style = stylesheet.addStyle(".heading1");
	style.setAttribute("font-size", "16px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle("table");
	style.setAttribute("width", "100%");
	style.setAttribute("font-size", "10px");
	stylesheet.addStyle("table.table td", "padding-left:3px; padding-right:3px; padding-top:2px; padding-bottom:2px");
	//stylesheet.addStyle("table.table td", "border: thin solid black;");

	style = stylesheet.addStyle(".borderBottom");
	style.setAttribute("border-bottom","thin solid black");

	style = stylesheet.addStyle(".bold");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".alignRight");
	style.setAttribute("text-align", "right");

	style = stylesheet.addStyle(".alignCenter");
	style.setAttribute("text-align", "center");

	style = stylesheet.addStyle(".underline");
	style.setAttribute("text-decoration", "underline");

	style = stylesheet.addStyle(".font12");
	style.setAttribute("font-size", "12px");
	//style.setAttribute("border-bottom", "1px double black");

	return stylesheet;
}


