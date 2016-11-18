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
// @pubdate = 2016-11-04
// @publisher = Banana.ch SA
// @description = Trial Balance
// @task = app.command
// @doctype = *;*
// @docproperties =
// @outputformat = none
// @inputdatasource = none
// @timeout = -1




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

	var report = Banana.Report.newReport("Swiss Red Cross - Trial Balance");

	report.addParagraph("Trial Balance", "heading1");

	//Create the table that will be printed on the report
	var table = report.addTable("table");

	tableRow = table.addRow();
	tableRow.addCell("Trial Balance at " + Banana.Converter.toLocaleDateFormat(endDate), "alignRight bold", 4);

	//Add column titles to the table report
	tableRow = table.addRow();
	tableRow.addCell("", " bold borderBottom");
	tableRow.addCell("", " bold borderBottom");
	tableRow.addCell("Debit", "alignCenter bold borderBottom");
	tableRow.addCell("Credit", "alignCenter bold borderBottom");

	//Get the Accounts table
	var accountsTab = Banana.document.table("Accounts");

	//Assets - Bclass 1
	var sumTotAssets = 0;
	for (var i = 0; i < accountsTab.rowCount; i++) {	
		var tRow = accountsTab.row(i);

		if (tRow.value("Account") && tRow.value("BClass") == "1") {
			tableRow = table.addRow();
			tableRow.addCell(tRow.value("Account"), "alignCenter", 1);
			tableRow.addCell(tRow.value("Description"), "", 1);
			var bal = calcBalance(tRow.value("Account"), tRow.value("BClass"), startDate, endDate);
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(bal), "alignRight", 1);
			tableRow.addCell("", "", 1);
			sumTotAssets = Banana.SDecimal.add(sumTotAssets, bal);
		}
	}	

	tableRow = table.addRow();
	tableRow.addCell("", "", 4);
	tableRow = table.addRow();
	tableRow.addCell("", "", 4);

	//Liabilities - Bclass 2
	var sumTotLiabilities = 0;
	for (var i = 0; i < accountsTab.rowCount; i++) {	
		var tRow = accountsTab.row(i);

		if (tRow.value("Account") && tRow.value("BClass") == "2") {
			tableRow = table.addRow();
			tableRow.addCell(tRow.value("Account"), "alignCenter", 1);
			tableRow.addCell(tRow.value("Description"), "", 1);
			tableRow.addCell("", "", 1);
			var bal = calcBalance(tRow.value("Account"), tRow.value("BClass"), startDate, endDate);
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(bal), "alignRight", 1);
			sumTotLiabilities = Banana.SDecimal.add(sumTotLiabilities, bal);
		}
	}

	//Income or Expense of the current year
	var res;
	var resDesc;
	for (var i = 0; i < accountsTab.rowCount; i++) {
		var tRow = accountsTab.row(i);
		if (!tRow.value("BClass") && tRow.value("Gr") === "2") {
			resDesc = tRow.value("Description");
		}
		res = calcBalance("BClass=1|2", "", startDate, endDate);
	}
	sumTotLiabilities = Banana.SDecimal.add(sumTotLiabilities, res);

	tableRow = table.addRow();
	tableRow.addCell("", "", 1);
	tableRow.addCell(resDesc, "", 1);
	tableRow.addCell("", "", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(res), "alignRight", 1);

	//Totals
	tableRow = table.addRow();
	tableRow.addCell("", "", 4);

	tableRow = table.addRow();
	tableRow.addCell("", "", 2);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(sumTotAssets), "alignRight bold underline", 1);
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(sumTotLiabilities), "alignRight bold underline", 1);

	//Add a footer to the report
	addFooter(report);

	//Print the report
	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);
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
	else if (!bClass) {
		return currentBal.balance;
	}
}




//Function that adds a Footer to the report
function addFooter(report) {
   report.getFooter().addClass("footer");
   var versionLine = report.getFooter().addText("Page ", "description");
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
    pageStyle.setAttribute("margin", "15mm 15mm 10mm 25mm");

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
	//style.setAttribute("border-bottom", "1px double black");

	return stylesheet;
}


