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
// @pubdate = 2017-03-22
// @publisher = Banana.ch SA
// @description = Trial Balance and blockchain
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
	
	var openingDate = Banana.document.info("AccountingDataBase","OpeningDate");
	var year = Banana.Converter.toDate(openingDate).getFullYear();

	var selectedperiod = Banana.Ui.getItem("Periode", "",
		["Tertial 1:   1.1."+year+"-30.4."+year,
		"Tertial 2:   1.5."+year+"-31.8."+year,
		"Tertial 3:   1.9."+year+"-31.12."+year], 0, false);
	if (selectedperiod) {
		if (selectedperiod == "Tertial 1:   1.1."+year+"-30.4."+year) {
			var selectionStartDate = year + "-01-01";
			var selectionEndDate = year + "-04-30";
		}
		else if (selectedperiod == "Tertial 2:   1.5."+year+"-31.8."+year) {
			var selectionStartDate = year + "-05-01";
			var selectionEndDate = year + "-08-31";
		}
		else if ("Tertial 3:   1.9."+year+"-31.12."+year) {
			var selectionStartDate = year + "-09-01";
			var selectionEndDate = year + "-12-31";
		}
		printReport(selectionStartDate, selectionEndDate);
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

	//Get the columns names and set all to lower case
	var accountsTab = Banana.document.table("Accounts");
	var tColumnNames = accountsTab.columnNames;
	for (var i = 0; i < tColumnNames.length; i++ ) {
		tColumnNames[i] = tColumnNames[i].toLowerCase();
	}

	//Check if "kostenstelle" and "zuordnung" columns exists
	var kostenstelleColumn = false;
	var zuordnungColumn = false;

	if (tColumnNames.indexOf("kostenstelle") > -1 || tColumnNames.indexOf("kostenstellen") > -1) {
		kostenstelleColumn = true;
	}

	if (tColumnNames.indexOf("zuordnung") > -1) {
		zuordnungColumn = true;
	}

	//Create the table that will be printed on the report
	var table = report.addTable("table");

	//Add column titles to the table report
	var tableHeader = table.getHeader();
    tableRow = tableHeader.addRow();
	tableRow.addCell("Konto", " bold tableHeader"); //account
	tableRow.addCell("Kontobezeichnung", " bold tableHeader"); //description
	
	if (kostenstelleColumn) {
		tableRow.addCell("KST", " bold tableHeader");
	}
	if (zuordnungColumn) {
		tableRow.addCell("ZUO", " bold tableHeader");
	}
	
	tableRow.addCell("MwStCode", " bold tableHeader"); //vatnumber
	tableRow.addCell("Bewegungen", "alignCenter bold tableHeader"); //movements
	tableRow.addCell("Soll", "alignCenter bold tableHeader"); //debit
	tableRow.addCell("Haben", "alignCenter bold tableHeader"); //credit
	tableRow.addCell("Eröffnung", "alignCenter bold tableHeader"); //opening
	tableRow.addCell("Saldo", "alignCenter bold tableHeader"); //balance


	//Get the Accounts table
	for (var i = 0; i < accountsTab.rowCount; i++) {	
		var tRow = accountsTab.row(i);

		//CurrentBalance values
		if (tRow.value("Group")) { //If group
			var currentBal = Banana.document.currentBalance("Gr="+tRow.value("Group"), startDate, endDate);
		}
		else { //If account
			var currentBal = Banana.document.currentBalance(tRow.value("Account"), startDate, endDate);
		}

		var debit = currentBal.debit;
		var credit = currentBal.credit;
		var opening = currentBal.opening;
		var balance = currentBal.balance;
		var diff = Banana.SDecimal.subtract(debit, credit);



		//Style
		var styleRow = "";
		var styleRowNumber = "alignRight";
		
		//Set bold style the rows that:
		// - have only a description (titles)
		// - have a group (totals)
		// - have a Kostenstelle/Zuordnung value
		if ((tRow.value("Description") && !tRow.value("Group") && !tRow.value("Account")) 
			|| tRow.value("Group") 
			|| tRow.value("Kostenstelle") 
			|| tRow.value("Zuordnung")
		){
			styleRow = "bold";
		 	styleRowNumber = "alignRight bold";
		}



		//Add a row to the table and write into it
		tableRow = table.addRow();
		tableRow.addCell(tRow.value("Account"), styleRow, 1);
		tableRow.addCell(tRow.value("Description"), styleRow, 1);
		
		if (kostenstelleColumn) {
			tableRow.addCell(tRow.value("Kostenstelle"), styleRow, 1);
		}
		if (zuordnungColumn) {
			tableRow.addCell(tRow.value("Zuordnung"), styleRow, 1);
		}

		tableRow.addCell(tRow.value("VatNumber"), styleRow, 1);
		
		if (diff != 0) {
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(diff), styleRowNumber, 1);
		} else {
			tableRow.addCell("", "", 1);
		}

		if (debit) {
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(debit), styleRowNumber, 1);
		} else {
			tableRow.addCell(" ", "", 1);
		}
		
		if (credit) {
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(credit), styleRowNumber, 1);
		} else {
			tableRow.addCell(" ", "", 1);
		}
		
		if (opening) {
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(opening), styleRowNumber, 1);
		} else {
			tableRow.addCell(" ", "", 1);
		}

		if (balance) {
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(balance), styleRowNumber, 1);
		} else {
			tableRow.addCell(" ", "", 1);
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
    tableRow.addCell("Konten-Bericht", "heading", 2);

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




//Function that creates styles for the report
function createStyleSheet() {
	var stylesheet = Banana.Report.newStyleSheet();

    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 10mm 10mm 10mm");

    stylesheet.addStyle("body", "font-family : " + param.fontFamily +"; font-size:" + param.fontSize + "px");
	stylesheet.addStyle("header", "width:100%");
	stylesheet.addStyle(".footer", "text-align:center; font-size:"+param.fontSize+"px; font-family:Courier New");
	stylesheet.addStyle(".bold", "font-weight:bold");
	stylesheet.addStyle(".alignRight", "text-align:right");
	stylesheet.addStyle(".alignCenter", "text-align:center");
	stylesheet.addStyle(".heading", "font-size:"+param.fontSizeTitles+"px; font-weight:bold");
	stylesheet.addStyle(".tableHeader", "background-color:#E0EFF6; text-align:center; font-weight:bold;");
	stylesheet.addStyle("table", "width:100%; font-size:"+param.fontSize+"px");
	stylesheet.addStyle("table.table td", "padding-left:3px; padding-right:3px; padding-top:2px; padding-bottom:2px");
	stylesheet.addStyle("table.table td", "border: thin solid black;");

	return stylesheet;
}


