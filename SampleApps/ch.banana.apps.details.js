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
// @doctype = 100.*;110.*;130.*
// @docproperties =
// @outputformat = none
// @inputdatasource = none
// @timeout = -1


/*
	Balance Sheet and Profit & Loss report with transactions details for each account.
	This report provide both the overview and the detailed of the financial situation. 
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


	var cardToPrint = Banana.Ui.getItem("Financial Report", "Select an option", ["Assets / Liabilities", "Income / Expenses", "All"], 0, false);
	var report = createDetailsReport(Banana.document, startDate, endDate, cardToPrint);
	
	//Print the report
	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);
}


//The purpose of this function is create the report containing the table with the required data
//The table will contain only the rows with an existant and non-zero end balance amount
function createDetailsReport(banDoc, startDate, endDate, cardToPrint) {

	var report = Banana.Report.newReport("Details");
	var headerLeft = Banana.document.info("Base","HeaderLeft");
    var headerRight = Banana.document.info("Base","HeaderRight");

	var printAssetsLiabilities = false;
	var printIncomeExpenses = false;
	var printAll = false; 

	if (cardToPrint === "Assets / Liabilities") {
		printAssetsLiabilities = true;
	}
	else if (cardToPrint === "Income / Expenses") {
		printIncomeExpenses = true;
	}
	else if (cardToPrint === "All") {
		printAll = true;
	}


	if (printAssetsLiabilities || printAll) {

		//-----------------------------------------------------------------------------//
		// ASSETS    																   //
		//-----------------------------------------------------------------------------//

		//Title
		report.addParagraph(headerLeft, "heading2");
		report.addParagraph("Assets with transactions details", "heading1");
		report.addParagraph(Banana.Converter.toLocaleDateFormat(startDate) + " - " + Banana.Converter.toLocaleDateFormat(endDate), "heading3");
		report.addParagraph(" ");
		report.addParagraph(" ");

		//Create the table
		var assetsTable = report.addTable("assetsTable");

		//Accounts assets data
		var assetsAccountForm = [];
		assetsAccountForm = getAccountsAssets(banDoc, assetsAccountForm);

		//Transactions assets data
		var assetsTransactionForm = [];
		for (var i = 0; i < assetsAccountForm.length; i++) {
			if (assetsAccountForm[i]["Account"]) {
				getTransactions(banDoc, assetsAccountForm[i]["Account"], startDate, endDate, assetsTransactionForm);
			}
		}

		//ACCOUNTS ASSETS DETAILS
		for (var i = 0; i < assetsAccountForm.length; i++) {

			//We take only accounts with a balance value
			if (assetsAccountForm[i]["Balance"]) {
		
				//Account
				if (assetsAccountForm[i]["Account"]) {
				 	tableRow = assetsTable.addRow();
				 	tableRow.addCell(assetsAccountForm[i]["Account"], "", 1),
				 	tableRow.addCell(assetsAccountForm[i]["Description"], "", 3);
				 	tableRow.addCell("", "", 1);
				 	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(assetsAccountForm[i]["Balance"]), "valueAmount1", 1);
				}

				//Group
			 	if (assetsAccountForm[i]["Group"]) {
			 		tableRow = assetsTable.addRow();
			 		tableRow.addCell(assetsAccountForm[i]["Group"], "valueAmountText", 1);
			 		tableRow.addCell(assetsAccountForm[i]["Description"], "valueAmountText", 3);
			 		tableRow.addCell("", "valueAmountText", 1);
			 		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(assetsAccountForm[i]["Balance"]), "valueTotal", 1);
			 	}

				//TRANSACTIONS ASSETS DETAILS
				for (var j = 0; j < assetsTransactionForm.length; j++) {
					
					//We want only transactions of the current account 
					if (assetsAccountForm[i]["Account"] && assetsTransactionForm[j]["JAccount"] === assetsAccountForm[i]["Account"]) {
					
						tableRow = assetsTable.addRow();
						tableRow.addCell("", "", 1);
						tableRow.addCell(" ", "", 1);
						tableRow.addCell(Banana.Converter.toLocaleDateFormat(assetsTransactionForm[j]["JDate"]), "horizontalLine italic", 1); 
						tableRow.addCell(assetsTransactionForm[j]["JDescription"], "horizontalLine italic", 1);
						if (assetsTransactionForm[j]["JDebitAmount"]) {
							tableRow.addCell(Banana.Converter.toLocaleNumberFormat(assetsTransactionForm[j]["JDebitAmount"]), "horizontalLine italic", 1);
						} else {
							tableRow.addCell("","horizontalLine italic",1);
						}
						if (assetsTransactionForm[j]["JCreditAmount"]) {
							tableRow.addCell(Banana.Converter.toLocaleNumberFormat(assetsTransactionForm[j]["JCreditAmount"]), "horizontalLine italic", 1);
						} else {
							tableRow.addCell("","horizontalLine italic",1);
						}
					}
				}
			}
		}

		report.addPageBreak();


		//-----------------------------------------------------------------------------//
		// LIABILITIES    															   //
		//-----------------------------------------------------------------------------//

		//Title
		report.addParagraph(headerLeft, "heading2");
		report.addParagraph("Liabilities with transactions details", "heading1");
		report.addParagraph(Banana.Converter.toLocaleDateFormat(startDate) + " - " + Banana.Converter.toLocaleDateFormat(endDate), "heading3");
		report.addParagraph(" ");
		report.addParagraph(" ");

		//Create the table
		var liabilitiesTable = report.addTable("liabilitiesTable");

		//Liabilities assets data
		var liabilitiesAccountForm = [];
		liabilitiesAccountForm = getAccountsLiabilites(banDoc, liabilitiesAccountForm);

		//Transactions liabilities data
		var liabilitiesTransactionForm = [];
		for (var i = 0; i < liabilitiesAccountForm.length; i++) {
			if (liabilitiesAccountForm[i]["Account"]) {
				getTransactions(banDoc, liabilitiesAccountForm[i]["Account"], startDate, endDate, liabilitiesTransactionForm);
			}
		}

		//ACCOUNTS LIABILITIES DETAILS
		for (var i = 0; i < liabilitiesAccountForm.length; i++) {

			//We take only accounts with a balance value
			if (liabilitiesAccountForm[i]["Balance"]) {
		
				//Account
				if (liabilitiesAccountForm[i]["Account"]) {
				 	tableRow = liabilitiesTable.addRow();
				 	tableRow.addCell(liabilitiesAccountForm[i]["Account"], "", 1),
				 	tableRow.addCell(liabilitiesAccountForm[i]["Description"], "", 3);
				 	tableRow.addCell("", "", 1);
				 	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(liabilitiesAccountForm[i]["Balance"]), "valueAmount1", 1);
				}

				//Group
			 	if (liabilitiesAccountForm[i]["Group"]) {
			 		tableRow = liabilitiesTable.addRow();
			 		tableRow.addCell(liabilitiesAccountForm[i]["Group"], "valueAmountText", 1);
			 		tableRow.addCell(liabilitiesAccountForm[i]["Description"], "valueAmountText", 3);
			 		tableRow.addCell("", "valueAmountText", 1);
			 		tableRow.addCell(Banana.Converter.toLocaleNumberFormat(liabilitiesAccountForm[i]["Balance"]), "valueTotal", 1);
			 	}

				//TRANSACTIONS LIABILITIES DETAILS
				for (var j = 0; j < liabilitiesTransactionForm.length; j++) {
					
					//We want only transactions of the current account 
					if (liabilitiesAccountForm[i]["Account"] && liabilitiesTransactionForm[j]["JAccount"] === liabilitiesAccountForm[i]["Account"]) {
					
						tableRow = liabilitiesTable.addRow();
						tableRow.addCell("", "", 1);
						tableRow.addCell(" ", "", 1);
						tableRow.addCell(Banana.Converter.toLocaleDateFormat(liabilitiesTransactionForm[j]["JDate"]), "horizontalLine italic", 1); 
						tableRow.addCell(liabilitiesTransactionForm[j]["JDescription"], "horizontalLine italic", 1);
						if (liabilitiesTransactionForm[j]["JDebitAmount"]) {
							tableRow.addCell(Banana.Converter.toLocaleNumberFormat(liabilitiesTransactionForm[j]["JDebitAmount"]), "horizontalLine italic", 1);
						} else {
							tableRow.addCell("","horizontalLine italic",1);
						}
						if (liabilitiesTransactionForm[j]["JCreditAmount"]) {
							tableRow.addCell(Banana.Converter.toLocaleNumberFormat(liabilitiesTransactionForm[j]["JCreditAmount"]), "horizontalLine italic", 1);
						} else {
							tableRow.addCell("","horizontalLine italic",1);
						}
					}
				}
			}
		}
	}


	if (printIncomeExpenses  || printAll) {

		if (printAll) {
			report.addPageBreak();
		}

		//-----------------------------------------------------------------------------//
		// INCOME    																   //
		//-----------------------------------------------------------------------------//

		//Title
		report.addParagraph(headerLeft, "heading2");
		report.addParagraph("Income with transactions details", "heading1");
		report.addParagraph(Banana.Converter.toLocaleDateFormat(startDate) + " - " + Banana.Converter.toLocaleDateFormat(endDate), "heading3");
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
						if (incomeTransactionForm[j]["JDebitAmount"]) {
							tableRow.addCell(Banana.Converter.toLocaleNumberFormat(incomeTransactionForm[j]["JDebitAmount"]), "horizontalLine italic", 1);
						} else {
							tableRow.addCell("","horizontalLine italic",1);
						}
						if (incomeTransactionForm[j]["JCreditAmount"]) {
							tableRow.addCell(Banana.Converter.toLocaleNumberFormat(incomeTransactionForm[j]["JCreditAmount"]), "horizontalLine italic", 1);
						} else {
							tableRow.addCell("","horizontalLine italic",1);
						}
					}
				}
			}
		}

		report.addPageBreak();


		//-----------------------------------------------------------------------------//
		// EXPENSES  																   //
		//-----------------------------------------------------------------------------//

		//Title
		report.addParagraph(headerLeft, "heading2");
		report.addParagraph("Expenses with transactions details", "heading1");
		report.addParagraph(Banana.Converter.toLocaleDateFormat(startDate) + " - " + Banana.Converter.toLocaleDateFormat(endDate), "heading3");
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
						
						if (expensesTransactionForm[j]["JDebitAmount"]) {
							tableRow.addCell(Banana.Converter.toLocaleNumberFormat(expensesTransactionForm[j]["JDebitAmount"]), "horizontalLine italic right", 1);
						} else {
							tableRow.addCell("","horizontalLine italic",1);
						}
						if (expensesTransactionForm[j]["JCreditAmount"]) {
							tableRow.addCell(Banana.Converter.toLocaleNumberFormat(expensesTransactionForm[j]["JCreditAmount"]), "horizontalLine italic right", 1);
						} else {
							tableRow.addCell("","horizontalLine italic",1);
						}
					}
				}
			}
		}
	}
	
	//Add a footer to the report
	addFooter(banDoc, report);

	return report;
}





//The purpose of this function is return an object containing the accounts data
function getAccountsAssets(banDoc, accountForm) {

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

		
		if ( gr.substring(0,1) === "1" || group === "1") {

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
function getAccountsLiabilites(banDoc, accountForm) {

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

		
		if ( group.substring(0,1) !== "0" && (gr.substring(0,1) === "2" || group === "2") ) {

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
	report.getFooter().addText("[Banana Accounting, v. " + banDoc.info("Base", "ProgramVersion") + ", " + scriptVersion + "] - Page ", "footer");
	report.getFooter().addFieldPageNr();
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

	var tableStyle = stylesheet.addStyle(".assetsTable");
	tableStyle.setAttribute("width", "100%");
	tableStyle.setAttribute("font-size", "8px");	

	var tableStyle = stylesheet.addStyle(".liabilitiesTable");
	tableStyle.setAttribute("width", "100%");
	tableStyle.setAttribute("font-size", "8px");	

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

