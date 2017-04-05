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
// @id = ch.banana.addon.details
// @api = 1.0
// @pubdate = 2017-04-05
// @publisher = Banana.ch SA
// @description = Details
// @task = app.command
// @doctype = *;*
// @docproperties =
// @outputformat = none
// @inputdatasource = none
// @timeout = -1


/*
	This app creates a report with details of groups, accounts and transactions
*/


var scriptVersion = "script v. 2017-04-05";



//Main function
function exec(string) {

	//Check if we are on an opened document
	if (!Banana.document) { return; }

	//Check if the three tables exist: if not, the script's execution will stop
	if (!Banana.document.table('Accounts')) { return; }
	if (!Banana.document.table('Transactions')) { return; }
	
	//We take the dates from Banana document
	var startDate = Banana.Converter.toDate(Banana.document.info("AccountingDataBase","OpeningDate"));
	var endDate = Banana.Converter.toDate(Banana.document.info("AccountingDataBase","ClosureDate"));

	var report = createDetailsReport(Banana.document, startDate, endDate);
	
	//Print the report
	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);
}


//The purpose of this function is create the report containing the table with the required data
//The table will contain only the rows with an existant and non-zero end balance amount
function createDetailsReport(banDoc, startDate, endDate) {

	var report = Banana.Report.newReport("Details");


	//-----------------------------------------------------------------------------//
	// INCOME    																   //
	//-----------------------------------------------------------------------------//

	//Title
	report.addParagraph("Financial Report " + startDate.getFullYear(), "heading2");
	report.addParagraph("PROFIT/LOSS STATEMENT", "heading1");
	report.addParagraph("INCOME from " + Banana.Converter.toLocaleDateFormat(startDate) + " to " + Banana.Converter.toLocaleDateFormat(endDate), "heading3");
	report.addParagraph(" ");
	report.addParagraph(" ");

	//Create the table
	var incomeTable = report.addTable("incomeTable");

	//Accounts Income data
	var incomeAccountForm = [];
	incomeAccountForm = getAccountsIncome(banDoc, incomeAccountForm);

	//Transactions Income data
	var incomeTransactionForm = [];
	for (var i = 0; i < incomeAccountForm.length; i++) {
		if (incomeAccountForm[i]["Account"]) {
			getTransactions(banDoc, incomeAccountForm[i]["Account"], startDate, endDate, incomeTransactionForm);
		}
	}

	//ACCOUNTS INCOME DETAILS
	for (var i = 0; i < incomeAccountForm.length; i++) {

		//We take only accounts with a balance value
		if (incomeAccountForm[i]["Balance"]) {
	
			//Account
			if (incomeAccountForm[i]["Account"]) {
			 	tableRow = incomeTable.addRow();
			 	tableRow.addCell(incomeAccountForm[i]["Account"], "", 1),
			 	tableRow.addCell(incomeAccountForm[i]["Description"], "", 3);
			 	tableRow.addCell("", "", 1);
			 	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(incomeAccountForm[i]["Balance"]), "valueAmount1", 1);
			}

			//Group
		 	if (incomeAccountForm[i]["Group"]) {
		 		tableRow = incomeTable.addRow();
		 		tableRow.addCell(incomeAccountForm[i]["Group"], "valueAmountText", 1);
		 		tableRow.addCell(incomeAccountForm[i]["Description"], "valueAmountText", 3);
		 		tableRow.addCell("", "valueAmountText", 1);
		 		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(incomeAccountForm[i]["Balance"]), "valueTotal", 1);
		 	}

			//TRANSACTIONS INCOME DETAILS
			for (var j = 0; j < incomeTransactionForm.length; j++) {
				
				//We want only transactions of the current account 
				if (incomeAccountForm[i]["Account"] && incomeTransactionForm[j]["JAccount"] === incomeAccountForm[i]["Account"]) {
				
					tableRow = incomeTable.addRow();
					tableRow.addCell("", "", 1);
					tableRow.addCell(" ", "", 1);
					tableRow.addCell(Banana.Converter.toLocaleDateFormat(incomeTransactionForm[j]["JDate"]), "horizontalLine italic", 1); 
					tableRow.addCell(incomeTransactionForm[j]["JDescription"], "horizontalLine italic", 1);
					tableRow.addCell(Banana.Converter.toLocaleNumberFormat(incomeTransactionForm[j]["JCreditAmount"]), "horizontalLine italic", 1);
					tableRow.addCell("", "", 1);
				}
			}
		}
	}

	report.addPageBreak();


	//-----------------------------------------------------------------------------//
	// EXPENSES  																   //
	//-----------------------------------------------------------------------------//

	//Title
	report.addParagraph("Financial Report " + startDate.getFullYear(), "heading2");
	report.addParagraph("PROFIT/LOSS STATEMENT", "heading1");
	report.addParagraph("EXPENSES from " + Banana.Converter.toLocaleDateFormat(startDate) + " to " + Banana.Converter.toLocaleDateFormat(endDate), "heading3");
	report.addParagraph(" ");
	report.addParagraph(" ");

	//Create table
	var expensesTable = report.addTable("expensesTable");

	//Accounts Expenses data
	var expensesAccountForm = [];
	expensesAccountForm = getAccountsExpenses(banDoc, expensesAccountForm);

	//Transactions Expenses data
	var expensesTransactionForm = [];
	for (var i = 0; i < expensesAccountForm.length; i++) {
		if (expensesAccountForm[i]["Account"]) {
			getTransactions(banDoc, expensesAccountForm[i]["Account"], startDate, endDate, expensesTransactionForm);
		}
	}

	//ACCOUNTS EXPENSES DETAILS
	for (var i = 0; i < expensesAccountForm.length; i++) {

		//We take only accounts with a balance value
		if (expensesAccountForm[i]["Balance"]) {

			//Account
			if (expensesAccountForm[i]["Account"]) {
			 	tableRow = expensesTable.addRow();
			 	tableRow.addCell(expensesAccountForm[i]["Account"], "", 1),
			 	tableRow.addCell(expensesAccountForm[i]["Description"], "", 3);
			 	tableRow.addCell(" ", "", 1);
			 	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(expensesAccountForm[i]["Balance"]), "valueAmount1", 1);
			}

			//Group
		 	if (expensesAccountForm[i]["Group"]) {
		 		tableRow = expensesTable.addRow();
		 		tableRow.addCell(expensesAccountForm[i]["Group"], "valueAmountText", 1);
		 		tableRow.addCell(expensesAccountForm[i]["Description"], "valueAmountText", 3);
		 		tableRow.addCell(" ", "valueAmountText", 1);
		 		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(expensesAccountForm[i]["Balance"]), "valueTotal", 1);
		 	}

			//TRANSACTIONS EXPENSES DETAILS
			for (var j = 0; j < expensesTransactionForm.length; j++) {
				
				//We want only transactions of the current account 
				if (expensesAccountForm[i]["Account"] && expensesTransactionForm[j]["JAccount"] === expensesAccountForm[i]["Account"]) {
					tableRow = expensesTable.addRow();
					tableRow.addCell(" ", "", 1);
					tableRow.addCell(" ", "", 1);
					tableRow.addCell(Banana.Converter.toLocaleDateFormat(expensesTransactionForm[j]["JDate"]), "horizontalLine italic", 1); 
					tableRow.addCell(expensesTransactionForm[j]["JDescription"], "horizontalLine italic", 1);
					tableRow.addCell(Banana.Converter.toLocaleNumberFormat(expensesTransactionForm[j]["JDebitAmount"]), "horizontalLine italic right", 1);
					tableRow.addCell(" ", "", 1);
				}
			}
		}
	}
	
	//Add a footer to the report
	addFooter(banDoc, report);

	return report;
}


//The purpose of this function is return an object containing the accounts data
function getAccountsIncome(banDoc, accountForm) {

	var accountsTable = banDoc.table("Accounts");

	var accountsTableRows = accountsTable.rowCount;
	for (var i = 0; i < accountsTableRows; i++) {
		
		var tRow = accountsTable.row(i);
		var section = tRow.value("Section");
		var group = tRow.value("Group");
		var account = tRow.value("Account");
		var description = tRow.value("Description");
		var bclass = tRow.value("BClass");
		var gr = tRow.value("Gr");
		var balance = tRow.value("Balance");

		
		if ( gr.substring(0,1) === "4" || group === "4") {

			accountForm.push({
				"Section" : section,
				"Group" : group,
				"Account" : account,
				"Description" : description,
				"BClass" : bclass,
				"Gr" : gr,
				"Balance" : balance
			});
		}
	}
	return accountForm;
}


//The purpose of this function is return an object containing the accounts data
function getAccountsExpenses(banDoc, accountForm) {

	var accountsTable = banDoc.table("Accounts");

	var accountsTableRows = accountsTable.rowCount;
	for (var i = 0; i < accountsTableRows; i++) {
		
		var tRow = accountsTable.row(i);
		var section = tRow.value("Section");
		var group = tRow.value("Group");
		var account = tRow.value("Account");
		var description = tRow.value("Description");
		var bclass = tRow.value("BClass");
		var gr = tRow.value("Gr");
		var balance = tRow.value("Balance");

		
		if ( gr.substring(0,1) === "3" || group === "3") {

			accountForm.push({
				"Section" : section,
				"Group" : group,
				"Account" : account,
				"Description" : description,
				"BClass" : bclass,
				"Gr" : gr,
				"Balance" : balance
			});
		}
	}
	return accountForm;
}


//The purpose of this function is return and save, for the given account and period, the transactions data for this account
function getTransactions(banDoc, account, startDate, endDate, transactionForm) {

	var transTab = banDoc.currentCard(account, startDate, endDate);

	for (var i = 0; i < transTab.rowCount; i++) {	
		var tRow = transTab.row(i);
		var jdate = tRow.value("JDate");
		var jaccount = tRow.value("JAccount");
		var jdescription = tRow.value("JDescription");
		var jdebitamount = tRow.value("JDebitAmount");
		var jcreditamount = tRow.value("JCreditAmount");
		var jbalance = tRow.value("JBalance");

		if (jbalance) {

			transactionForm.push({
				"JDate" : jdate,
				"JAccount" : jaccount,
				"JDescription" : jdescription,
				"JDebitAmount" : jdebitamount,
				"JCreditAmount" : jcreditamount,
				"JBalance" : jbalance
			});
		}
	}
}


//The purpose of this function is add a footer to the report
function addFooter(banDoc, report) {
	report.getFooter().addClass("footer");
	report.getFooter().addText("Banana Accounting, v. " + banDoc.info("Base", "ProgramVersion") + ", " + scriptVersion, "footer");
}


//The main purpose of this function is create styles for the report print
function createStyleSheet() {
	var stylesheet = Banana.Report.newStyleSheet();

    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 20mm 10mm 20mm");

	var style = "";

	style = stylesheet.addStyle(".footer");
	style.setAttribute("text-align", "right");
	style.setAttribute("font-size", "8px");
	style.setAttribute("font", "Times New Roman");

	style = stylesheet.addStyle(".heading1");
	style.setAttribute("font-size", "16px");
	style.setAttribute("font-weight", "bold");
	
	style = stylesheet.addStyle(".heading2");
	style.setAttribute("font-size", "14px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".heading3");
	style.setAttribute("font-size", "11px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".heading4");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".valueAmount1");
	style.setAttribute("font-size", "9px");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("text-align", "right");

	style = stylesheet.addStyle(".valueAmountText");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 

	style = stylesheet.addStyle(".bold");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".right");
	style.setAttribute("text-align", "right");

	style = stylesheet.addStyle(".italic");
	//style.setAttribute("font-style", "italic");
	style.setAttribute("font-family", "Courier New");

	style = stylesheet.addStyle(".horizontalLine");
	style.setAttribute("border-top", "1px solid black");
	
	style = stylesheet.addStyle(".valueTotal");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 
	style.setAttribute("text-align", "right");
	style.setAttribute("border-bottom", "1px double black");

	var tableStyle = stylesheet.addStyle(".incomeTable");
	tableStyle.setAttribute("width", "100%");
	tableStyle.setAttribute("font-size", "8px");	
	//stylesheet.addStyle("table.incomeTable td", "border: thin solid black");

	var tableStyle = stylesheet.addStyle(".expensesTable");
	tableStyle.setAttribute("width", "100%");
	tableStyle.setAttribute("font-size", "8px");
	//stylesheet.addStyle("table.expensesTable td", "border: thin solid black");	

	return stylesheet;
}

