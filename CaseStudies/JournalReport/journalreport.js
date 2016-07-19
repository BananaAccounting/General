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
// @id = ch.banana.addon.journalreport.js
// @api = 1.0
// @pubdate = 2016-06-01
// @publisher = Banana.ch SA
// @description = Journal Report Example
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1



function exec() {

	//Create the report
	var report = Banana.Report.newReport('Report title');

	//Create a journal table
	var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);

	//Print the table header
	var table = report.addTable("table");
	tableRow = table.addRow();
	tableRow.addCell("JContraAccountGroup", "bold", 1);
	tableRow.addCell("JRowOrigin", "bold", 1);
	tableRow.addCell("JDate", "bold", 1);
	tableRow.addCell("JAccount", "bold", 1);
	tableRow.addCell("JContraAccount", "bold", 1);
	tableRow.addCell("JDescription", "bold", 1);
	tableRow.addCell("JAccountDescription", "bold", 1);
	tableRow.addCell("JAmount", "bold", 1);

	//Read the table row by row and save some values
	for (var i = 0; i < journal.rowCount; i++) {
		
		var tRow = journal.row(i);

		//From the journal table we want only the transactions rows
		if (tRow.value('JOperationType') == Banana.document.OPERATIONTYPE_TRANSACTION) {

			var jContraAccountGroup = tRow.value('JContraAccountGroup');
			var jRowOrigin = tRow.value('JRowOrigin');
			var jDate = tRow.value('JDate');
			var jAccount = tRow.value('JAccount');
			var jContraAccount = tRow.value('JContraAccount');
			var jDescription = tRow.value('JDescription');
			var jAccountDescription = tRow.value('JAccountDescription');
			var jAmount = tRow.value('JAmount');
	
			tableRow = table.addRow();
			tableRow.addCell(jContraAccountGroup, "", 1);
			tableRow.addCell(jRowOrigin, "", 1);
			tableRow.addCell(jDate, "", 1);
			tableRow.addCell(jAccount, "", 1);
			tableRow.addCell(jContraAccount, "", 1);
			tableRow.addCell(jDescription, "", 1);
			tableRow.addCell(jAccountDescription, "", 1);
			tableRow.addCell(jAmount, "right", 1);
		}
	}

	//We apply some style and print the report
	var stylesheet = Banana.Report.newStyleSheet();
	
	var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "15mm 5mm 10mm 5mm");

    stylesheet.addStyle("body", "font-size: 7pt; font-family: Helvetica");
    stylesheet.addStyle(".bold", "font-weight:bold");
    stylesheet.addStyle(".right", "text-align:right");
    stylesheet.addStyle(".backgroundColor", "background-color:#464e7e");

    style = stylesheet.addStyle(".table");
	style.setAttribute("width", "100%");
	stylesheet.addStyle("table.table td", "border: thin solid black");

	Banana.Report.preview(report, stylesheet);
}
