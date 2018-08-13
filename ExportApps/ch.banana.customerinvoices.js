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
// @id = ch.banana.customerinvoices.js
// @api = 1.0
// @pubdate = 2018-08-13
// @publisher = Banana.ch SA
// @description = Customer Invoices Report Example
// @task = app.command
// @doctype = *
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1



function exec(inData, options) {

	//Create the report
	var report = Banana.Report.newReport('Report title');

	//Create a journal table
	//var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);
   var journal = Banana.document.invoicesCustomers();

	//Print the table header
	var table = report.addTable("table");
	tableRow = table.addRow();
	tableRow.addCell("CounterpartyId", "bold", 1);
	tableRow.addCell("Invoice", "bold", 1);
	tableRow.addCell("ObjectType", "bold", 1);
	tableRow.addCell("ObjectIndex", "bold", 1);
	tableRow.addCell("ObjectJSonData", "bold", 1);
	/*tableRow.addCell("Date", "bold", 1);
	tableRow.addCell("Description", "bold", 1);
	tableRow.addCell("Debit", "bold", 1);
	tableRow.addCell("Credit", "bold", 1);
	tableRow.addCell("Balance", "bold", 1);
	tableRow.addCell("Currency", "bold", 1);
	tableRow.addCell("InvoiceExpectedDate", "bold", 1);
	tableRow.addCell("InvoiceDueDate", "bold", 1);
	tableRow.addCell("InvoiceDuePeriod", "bold", 1);
	tableRow.addCell("InvoiceDaysPastDue", "bold", 1);
	tableRow.addCell("InvoicePaymentDate", "bold", 1);
	tableRow.addCell("InvoiceLastReminder", "bold", 1);
	tableRow.addCell("InvoiceLastReminderDate", "bold", 1);
	tableRow.addCell("Status", "bold", 1);
	tableRow.addCell("JTableOrigin", "bold", 1);
	tableRow.addCell("JRowOrigin", "bold", 1);*/

	//Read the table row by row and save some values
   Banana.console.debug("rowcount " + journal.rowCount);
	for (var i = 0; i < journal.rowCount; i++) {
		
		var tRow = journal.row(i);

	   var valueCounterpartyId = tRow.value('CounterpartyId');
      var valueInvoice = tRow.value('Invoice');
		var valueObjectType = tRow.value('ObjectType');
		var valueObjectIndex = tRow.value('ObjectIndex');
	
		tableRow = table.addRow();
		tableRow.addCell(valueCounterpartyId, "", 1);
		tableRow.addCell(valueInvoice, "", 1);
		tableRow.addCell(valueObjectType, "", 1);
		tableRow.addCell(valueObjectIndex, "", 1);
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
