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
// @id = ch.banana.app.trialbalanceandblockchain
// @api = 1.0
// @pubdate = 2017-02-20
// @publisher = Banana.ch SA
// @description = Trial Balance and blockchain (default period)
// @task = app.command
// @doctype = *;*
// @docproperties =
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



/*
	SUMMARY
	=======
	The app prints the table Accounts and at the end the blockchain
*/


var param = {
	"fontSize" : "7",
	"fontSizeTitles": "7",
	"fontFamily" : "Arial",
};


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

	var report = Banana.Report.newReport("Trial Balance and blockchain");

	printAccountsTable(startDate, endDate, report);
	addHeader(startDate, endDate, report);
	addFooter(report);

	//Print the report
	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);
}



function printAccountsTable(startDate, endDate, report) {

	var accountsTab = Banana.document.table("Accounts");
	var tColumnNames = accountsTab.columnNames;
	var flag = false;
	if (tColumnNames.indexOf("Kostenstelle") > -1 && tColumnNames.indexOf("Zuordnung") >-1) {
		flag = true;
	}
	
	//Create the table that will be printed on the report
	var table = report.addTable("table");

	// var col1 = table.addColumn("col1");
	// var col2 = table.addColumn("col2");
	// var col3 = table.addColumn("col3");
	// var col4 = table.addColumn("col4");
	// var col5 = table.addColumn("col5");
	// var col6 = table.addColumn("col6");
	// var col7 = table.addColumn("col7");
	// var col8 = table.addColumn("col8");
	// var col9 = table.addColumn("col9");
	// var col10 = table.addColumn("col10");

	//Add column titles to the table report
	var tableHeader = table.getHeader();
    tableRow = tableHeader.addRow();
	tableRow.addCell("Konto", " bold borderBottom"); //account
	tableRow.addCell("Kontobezeichnung", " bold borderBottom"); //description
	if (flag) {
		tableRow.addCell("KST", " bold borderBottom");
		tableRow.addCell("ZUO", " bold borderBottom");
	}
	tableRow.addCell("MwStCode", " bold borderBottom"); //vatnumber
	tableRow.addCell("Bewegungen", "alignCenter bold borderBottom"); //movements
	tableRow.addCell("Soll", "alignCenter bold borderBottom"); //debit
	tableRow.addCell("Haben", "alignCenter bold borderBottom"); //credit
	tableRow.addCell("Eröffnung", "alignCenter bold borderBottom"); //opening
	tableRow.addCell("Saldo", "alignCenter bold borderBottom"); //balance


	//Get the Accounts table
	for (var i = 0; i < accountsTab.rowCount; i++) {	
		var tRow = accountsTab.row(i);

		tableRow = table.addRow();
		var diff = Banana.SDecimal.subtract(tRow.value("Debit"), tRow.value("Credit"));

		if ((tRow.value("Description") && !tRow.value("Group") && !tRow.value("Account")) 
			|| tRow.value("Group") 
			|| tRow.value("Kostenstelle") && tRow.value("Zuordnung")) 
		{
			var currentBal = Banana.document.currentBalance("Gr="+tRow.value("Group"), startDate, endDate);
			var debit = currentBal.debit;
			var credit = currentBal.credit;
			var opening = currentBal.opening;
			var balance = currentBal.balance;
			var diff = Banana.SDecimal.subtract(debit, credit);

			tableRow.addCell(tRow.value("Account"), " bold", 1);
			tableRow.addCell(tRow.value("Description"), " bold", 1);
			if (flag) {
				tableRow.addCell(tRow.value("Kostenstelle"), " bold", 1);
				tableRow.addCell(tRow.value("Zuordnung"), " bold", 1);
			}			
			tableRow.addCell(tRow.value("VatNumber"), " bold", 1);
			if (diff != 0) {
				tableRow.addCell(diff, "alignRight bold", 1);
			} else {
				tableRow.addCell("", "alignRight bold", 1);
			}
			tableRow.addCell(debit, "alignRight bold", 1);
			tableRow.addCell(credit, "alignRight bold", 1);
			tableRow.addCell(opening, "alignRight bold", 1);
			tableRow.addCell(balance, "alignRight bold", 1);
		}
		else 
		{
			var currentBal = Banana.document.currentBalance(tRow.value("Account"), startDate, endDate);
			var debit = currentBal.debit;
			var credit = currentBal.credit;
			var opening = currentBal.opening;
			var balance = currentBal.balance;
			var diff = Banana.SDecimal.subtract(debit, credit);

			tableRow.addCell(tRow.value("Account"), "", 1);
			tableRow.addCell(tRow.value("Description"), "", 1);
			if (flag) {
				tableRow.addCell(tRow.value("Kostenstelle"), "", 1);
				tableRow.addCell(tRow.value("Zuordnung"), "", 1);
			}
			tableRow.addCell(tRow.value("VatNumber"), "", 1);
			if (diff != 0) {
				tableRow.addCell(diff, "alignRight", 1);
			} else {
				tableRow.addCell("", "alignRight", 1);
			}
			tableRow.addCell(debit, "alignRight", 1);
			tableRow.addCell(credit, "alignRight", 1);
			tableRow.addCell(opening, "alignRight", 1);
			tableRow.addCell(balance, "alignRight", 1);
		}
	}

	report.addParagraph(" ", "");
	report.addParagraph(" ", "");
	report.addParagraph(" ", "");


	//Blockchain for startDate - 1 day
	var dstart = Banana.Converter.toDate(startDate);
	dstart.setDate(dstart.getDate() - 1);
	report.addParagraph(getBlockChain(Banana.Converter.toInternalDateFormat(dstart), report));

	//Blockchain for endDate
	report.addParagraph(getBlockChain(endDate, report));
}


function getBlockChain(endDate, report) {

	var transactionsTab = Banana.document.table("Transactions");
	var blockchain = "";

	for (var i = 0; i < transactionsTab.rowCount; i++) {	
		var tRow = transactionsTab.row(i);
		var date = tRow.value("Date");
		var locknumber = tRow.value("LockNumber");
		var lockprogressive = tRow.value("LockProgressive");

		//if (date <= endDate && locknumber && lockprogressive) {
		if (date && date <= endDate) {
			blockchain = "Blockchain for " + endDate + ": " + date + ", " + locknumber + ", "+lockprogressive;
		}
	}

	return blockchain;
}




//Function that adds an Header to the report
function addHeader(startDate, endDate, report) {
    var headerLeft = Banana.document.info("Base","HeaderLeft");
    var headerRight = Banana.document.info("Base","HeaderRight");
    var pageHeader = report.getHeader();
    var tab = pageHeader.addTable("header");
    tableRow = tab.addRow();
    if (headerLeft && headerRight) {
	    tableRow.addCell(headerLeft, "", 1);
	    tableRow.addCell(headerRight, "alignRight", 1);
	} else {
		tableRow.addCell("", "", 1);
	    tableRow.addCell("", "alignRight", 1);
	}

    tableRow = tab.addRow();
    tableRow.addCell("Tertialbericht", "", 1);
    tableRow.addCell("SAP-Buchungen in Fettschrift", "alignRight", 1);

    tableRow = tab.addRow();
    tableRow.addCell(" ", "", 2);

    tableRow = tab.addRow();
    tableRow.addCell("Konten-Bericht", "heading2", 2);

    tableRow = tab.addRow();
    tableRow.addCell("Periode: " + Banana.Converter.toLocaleDateFormat(startDate) + " - " + Banana.Converter.toLocaleDateFormat(endDate), "", 2);

    tableRow = tab.addRow();
    tableRow.addCell(" ", "", 2);
}




//Function that adds a Footer to the report
function addFooter(report) {
	var date = new Date();
	var d = Banana.Converter.toLocaleDateFormat(date);
	report.getFooter().addClass("footer");
	var versionLine = report.getFooter().addText(d + " - Seite ", "description");
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
    pageStyle.setAttribute("margin", "10mm 10mm 10mm 10mm");

    stylesheet.addStyle("body", "font-family : " + param.fontFamily +"; font-size:" + param.fontSize + "px");

	style = stylesheet.addStyle(".footer");
	style.setAttribute("text-align", "center");
	style.setAttribute("font-size", param.fontSize + "px");
	style.setAttribute("font-family", "Courier New");
	//style.setAttribute("border-top", "thin solid black");

	style = stylesheet.addStyle(".heading1");
	style.setAttribute("font-size", param.fontSizeTitles+"px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".heading2");
	style.setAttribute("font-size", param.fontSizeTitles+"px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle("table");
	style.setAttribute("width", "100%");
	style.setAttribute("font-size", param.fontSize+"px");
	stylesheet.addStyle("table.table td", "padding-left:3px; padding-right:3px; padding-top:2px; padding-bottom:2px");
	//stylesheet.addStyle("table.table td", "border: thin solid black;");

	// stylesheet.addStyle(".col1", "width:10%");
	// stylesheet.addStyle(".col2", "width:%");
	// stylesheet.addStyle(".col3", "width:%");
	// stylesheet.addStyle(".col4", "width:%");
	// stylesheet.addStyle(".col5", "width:%");
	// stylesheet.addStyle(".col6", "width:%");
	// stylesheet.addStyle(".col7", "width:%");
	// stylesheet.addStyle(".col8", "width:%");
	// stylesheet.addStyle(".col9", "width:%");
	// stylesheet.addStyle(".col10", "width:%");


	var headerStyle = stylesheet.addStyle("header");
    headerStyle.setAttribute("width", "100%");

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


