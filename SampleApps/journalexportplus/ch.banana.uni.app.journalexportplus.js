// Copyright [2024] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.uni.app.journalexportplus.js
// @api = 1.0
// @pubdate = 2024-03-01
// @publisher = Banana.ch SA
// @description = Journal Export (Banana+)
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1


/*
* Resume
*
* The extension generates a report with the journal of current and budget transactions.
* It is possible to choose which journal columns to include in the report.
* All the report data can be copied from the Print Preview with the command "Copy to Clipboard",
* then pasted in Excel to use the data with the Pivot tables to build your own reports.
*/


function exec() {
	if (!Banana.document) {
		return;
	}

	// Banana Accounting Plus is required
	var isCurrentBananaVersionSupported = bananaRequiredVersion("10.0.12");
	if (!isCurrentBananaVersionSupported) {
		return "@Cancel";
	}
	
	// Init and retrieve parameters
    var userParam = initUserParam();
    var savedParam = Banana.document.getScriptSettings();
    if (savedParam && savedParam.length > 0) {
        userParam = JSON.parse(savedParam);
    }
    // If needed show the settings dialog to the user
    if (!options || !options.useLastSettings) {
        userParam = settingsDialog(); // From properties
    }
    if (!userParam) {
        return "@Cancel";
    }

	var report = Banana.Report.newReport('Journal Report (Current / Budget)');

	printReportJournal(Banana.document, report, userParam);

	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);
}

function printReportJournal(banDoc, report, userParam) {
	/**
	 * Prints the Journal of CURRENT and BUDGET transactions.
	 */
	
	// Get Journal columns to use
	var columnsReport = getColumnsToPrint(userParam);

	// Header of table
	var table = report.addTable("table");
	var tableRow;
	tableRow = table.addRow();
	for (var i = 0; i < columnsReport.length; i++) {
		tableRow.addCell(columnsReport[i], "header", 1);
	}
	
	// Journal of current transactions
	var journalCurrent = banDoc.journal(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL);
	for (var i = 0; i < journalCurrent.rowCount; i++) {
		var tRow = journalCurrent.row(i);
		if (tRow.value('JOperationType') == banDoc.OPERATIONTYPE_TRANSACTION) { // only transactions rows
			tableRow = table.addRow();
			for (var j = 0; j < columnsReport.length; j++) {
				tableRow.addCell(tRow.value(columnsReport[j]),"",1);
			}
		}
	}

	// Journal of budget transactions
	var journalBudget = banDoc.journal(banDoc.ORIGINTYPE_BUDGET, banDoc.ACCOUNTTYPE_NORMAL);
	for (var i = 0; i < journalBudget.rowCount; i++) {
		var tRow = journalBudget.row(i);
		if (tRow.value('JOperationType') == banDoc.OPERATIONTYPE_TRANSACTION) { // only transactions rows
			tableRow = table.addRow();
			for (var j = 0; j < columnsReport.length; j++) {
				tableRow.addCell(tRow.value(columnsReport[j]),"",1);
			}
		}
	}
}

function getColumnsToPrint(userParam) {
	/*
		Journal column for CURRENT and BUDGET transactions.
	*/

	// Create an array with all the available journal columns
	var columnsJournalAll = ["JDate","JDescription","JTableOrigin","JRowOrigin","JRepeatNumber","JGroup","JGr","JAccount","JAccountComplete",
	"JAccountDescription","JAccountClass","JAccountSection","JAccountType","JOriginType","JOriginFile","JOperationType",
	"JAccountGr","JAccountGrPath","JAccountGrDescription","JAccountCurrency","JAmountAccountCurrency","JAmount",
	"JTransactionCurrency","JAmountTransactionCurrency","JTransactionCurrencyConversionRate","JAmountSection",
	"JVatIsVatOperation","JVatCodeWithoutSign","JVatCodeDescription","JVatCodeWithMinus","JVatNegative","JVatTaxable",
	"JContraAccount","JCContraAccountDes","JContraAccountType","JContraAccountGroup","JCC1","JCC2","JCC3","JSegment1",
	"JSegment2","JSegment3","JSegment4","JSegment5","JSegment6","JSegment7","JSegment8","JSegment9","JSegment10",
	"JDebitAmountAccountCurrency","JCreditAmountAccountCurrency","JBalanceAccountCurrency","JDebitAmount","JCreditAmount",
	"JBalance"];

	// Only use the columns selected from the settings parameters
	// Each column parameter has the same name of the journal column
	var columnsJournalToPrint = [];
	for (var i = 0; i < columnsJournalAll.length; i++) {
		if (userParam[columnsJournalAll[i]]) {
			columnsJournalToPrint.push(columnsJournalAll[i]);
		}
	}
	return columnsJournalToPrint;
}

/***********************
* MANAGE USER PARAMETERS 
***********************/
function convertParam(userParam) {

    var convertedParam = {};
    convertedParam.version = '1.0';
    convertedParam.data = [];

    var currentParam = {};
    currentParam.name = 'include_column';
    currentParam.title = 'Journal columns to print:';
    currentParam.type = 'string';
    currentParam.value = '';
    currentParam.editable = false;
    currentParam.readValue = function() {
        userParam.header = this.value;
    }
    convertedParam.data.push(currentParam);

	// Journal columns
	var currentParam = {};
	currentParam.name = 'JDate';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JDate';
	currentParam.type = 'bool';
	currentParam.value = userParam['JDate'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JDate'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JDescription';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JDescription';
	currentParam.type = 'bool';
	currentParam.value = userParam['JDescription'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JDescription'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JTableOrigin';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JTableOrigin';
	currentParam.type = 'bool';
	currentParam.value = userParam['JTableOrigin'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JTableOrigin'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JRowOrigin';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JRowOrigin';
	currentParam.type = 'bool';
	currentParam.value = userParam['JRowOrigin'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JRowOrigin'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JRepeatNumber';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JRepeatNumber';
	currentParam.type = 'bool';
	currentParam.value = userParam['JRepeatNumber'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JRepeatNumber'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JGroup';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JGroup';
	currentParam.type = 'bool';
	currentParam.value = userParam['JGroup'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JGroup'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JGr';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JGr';
	currentParam.type = 'bool';
	currentParam.value = userParam['JGr'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JGr'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAccount';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAccount';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAccount'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JAccount'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAccountComplete';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAccountComplete';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAccountComplete'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JAccountComplete'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAccountDescription';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAccountDescription';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAccountDescription'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JAccountDescription'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAccountClass';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAccountClass';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAccountClass'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JAccountClass'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAccountSection';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAccountSection';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAccountSection'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JAccountSection'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAccountType';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAccountType';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAccountType'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JAccountType'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JOriginType';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JOriginType';
	currentParam.type = 'bool';
	currentParam.value = userParam['JOriginType'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JOriginType'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JOriginFile';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JOriginFile';
	currentParam.type = 'bool';
	currentParam.value = userParam['JOriginFile'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JOriginFile'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JOperationType';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JOperationType';
	currentParam.type = 'bool';
	currentParam.value = userParam['JOperationType'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JOperationType'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAccountGr';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAccountGr';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAccountGr'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JAccountGr'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAccountGrPath';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAccountGrPath';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAccountGrPath'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JAccountGrPath'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAccountGrDescription';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAccountGrDescription';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAccountGrDescription'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JAccountGrDescription'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAccountCurrency';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAccountCurrency';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAccountCurrency'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JAccountCurrency'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAmountAccountCurrency';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAmountAccountCurrency';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAmountAccountCurrency'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JAmountAccountCurrency'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAmount';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAmount';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAmount'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JAmount'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JTransactionCurrency';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JTransactionCurrency';
	currentParam.type = 'bool';
	currentParam.value = userParam['JTransactionCurrency'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JTransactionCurrency'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAmountTransactionCurrency';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAmountTransactionCurrency';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAmountTransactionCurrency'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JAmountTransactionCurrency'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JTransactionCurrencyConversionRate';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JTransactionCurrencyConversionRate';
	currentParam.type = 'bool';
	currentParam.value = userParam['JTransactionCurrencyConversionRate'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JTransactionCurrencyConversionRate'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JAmountSection';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JAmountSection';
	currentParam.type = 'bool';
	currentParam.value = userParam['JAmountSection'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JAmountSection'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JVatIsVatOperation';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JVatIsVatOperation';
	currentParam.type = 'bool';
	currentParam.value = userParam['JVatIsVatOperation'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JVatIsVatOperation'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JVatCodeWithoutSign';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JVatCodeWithoutSign';
	currentParam.type = 'bool';
	currentParam.value = userParam['JVatCodeWithoutSign'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JVatCodeWithoutSign'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JVatCodeDescription';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JVatCodeDescription';
	currentParam.type = 'bool';
	currentParam.value = userParam['JVatCodeDescription'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JVatCodeDescription'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JVatCodeWithMinus';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JVatCodeWithMinus';
	currentParam.type = 'bool';
	currentParam.value = userParam['JVatCodeWithMinus'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JVatCodeWithMinus'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JVatNegative';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JVatNegative';
	currentParam.type = 'bool';
	currentParam.value = userParam['JVatNegative'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JVatNegative'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JVatTaxable';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JVatTaxable';
	currentParam.type = 'bool';
	currentParam.value = userParam['JVatTaxable'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JVatTaxable'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JContraAccount';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JContraAccount';
	currentParam.type = 'bool';
	currentParam.value = userParam['JContraAccount'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JContraAccount'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JCContraAccountDes';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JCContraAccountDes';
	currentParam.type = 'bool';
	currentParam.value = userParam['JCContraAccountDes'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JCContraAccountDes'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JContraAccountType';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JContraAccountType';
	currentParam.type = 'bool';
	currentParam.value = userParam['JContraAccountType'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JContraAccountType'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JContraAccountGroup';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JContraAccountGroup';
	currentParam.type = 'bool';
	currentParam.value = userParam['JContraAccountGroup'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JContraAccountGroup'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JCC1';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JCC1';
	currentParam.type = 'bool';
	currentParam.value = userParam['JCC1'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JCC1'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JCC2';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JCC2';
	currentParam.type = 'bool';
	currentParam.value = userParam['JCC2'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JCC2'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JCC3';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JCC3';
	currentParam.type = 'bool';
	currentParam.value = userParam['JCC3'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JCC3'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JSegment1';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JSegment1';
	currentParam.type = 'bool';
	currentParam.value = userParam['JSegment1'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JSegment1'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JSegment2';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JSegment2';
	currentParam.type = 'bool';
	currentParam.value = userParam['JSegment2'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JSegment2'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JSegment3';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JSegment3';
	currentParam.type = 'bool';
	currentParam.value = userParam['JSegment3'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JSegment3'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JSegment4';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JSegment4';
	currentParam.type = 'bool';
	currentParam.value = userParam['JSegment4'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JSegment4'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JSegment5';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JSegment5';
	currentParam.type = 'bool';
	currentParam.value = userParam['JSegment5'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JSegment5'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JSegment6';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JSegment6';
	currentParam.type = 'bool';
	currentParam.value = userParam['JSegment6'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JSegment6'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JSegment7';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JSegment7';
	currentParam.type = 'bool';
	currentParam.value = userParam['JSegment7'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JSegment7'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JSegment8';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JSegment8';
	currentParam.type = 'bool';
	currentParam.value = userParam['JSegment8'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JSegment8'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JSegment9';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JSegment9';
	currentParam.type = 'bool';
	currentParam.value = userParam['JSegment9'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JSegment9'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JSegment10';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JSegment10';
	currentParam.type = 'bool';
	currentParam.value = userParam['JSegment10'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JSegment10'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JDebitAmountAccountCurrency';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JDebitAmountAccountCurrency';
	currentParam.type = 'bool';
	currentParam.value = userParam['JDebitAmountAccountCurrency'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JDebitAmountAccountCurrency'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JCreditAmountAccountCurrency';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JCreditAmountAccountCurrency';
	currentParam.type = 'bool';
	currentParam.value = userParam['JCreditAmountAccountCurrency'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JCreditAmountAccountCurrency'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JBalanceAccountCurrency';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JBalanceAccountCurrency';
	currentParam.type = 'bool';
	currentParam.value = userParam['JBalanceAccountCurrency'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JBalanceAccountCurrency'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JDebitAmount';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JDebitAmount';
	currentParam.type = 'bool';
	currentParam.value = userParam['JDebitAmount'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JDebitAmount'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JCreditAmount';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JCreditAmount';
	currentParam.type = 'bool';
	currentParam.value = userParam['JCreditAmount'] ? true : false;
	currentParam.defaultvalue = true;
	currentParam.readValue = function() {
		userParam['JCreditAmount'] = this.value;
	}
	convertedParam.data.push(currentParam);
	
	currentParam = {};
	currentParam.name = 'JBalance';
	currentParam.parentObject = 'include_column';
	currentParam.title = 'JBalance';
	currentParam.type = 'bool';
	currentParam.value = userParam['JBalance'] ? true : false;
	currentParam.defaultvalue = false;
	currentParam.readValue = function() {
		userParam['JBalance'] = this.value;
	}
	convertedParam.data.push(currentParam);

    return convertedParam;
}

function initUserParam() {
	var userParam = {};
	userParam.JDate = true;
	userParam.JDescription = true;
	userParam.JTableOrigin = true;
	userParam.JRowOrigin = true;
	userParam.JRepeatNumber = false;
	userParam.JGroup = false;
	userParam.JGr = false;
	userParam.JAccount = true;
	userParam.JAccountComplete = false;
	userParam.JAccountDescription = true;
	userParam.JAccountClass = true;
	userParam.JAccountSection = false;
	userParam.JAccountType = false;
	userParam.JOriginType = false;
	userParam.JOriginFile = false;
	userParam.JOperationType = false;
	userParam.JAccountGr = true;
	userParam.JAccountGrPath = false;
	userParam.JAccountGrDescription = true;
	userParam.JAccountCurrency = false;
	userParam.JAmountAccountCurrency = false;
	userParam.JAmount = true;
	userParam.JTransactionCurrency = false;
	userParam.JAmountTransactionCurrency = false;
	userParam.JTransactionCurrencyConversionRate = false;
	userParam.JAmountSection = false;
	userParam.JVatIsVatOperation = true;
	userParam.JVatCodeWithoutSign = true;
	userParam.JVatCodeDescription = true;
	userParam.JVatCodeWithMinus = false;
	userParam.JVatNegative = false;
	userParam.JVatTaxable = true;
	userParam.JContraAccount = true;
	userParam.JCContraAccountDes = true;
	userParam.JContraAccountType = false;
	userParam.JContraAccountGroup = false;
	userParam.JCC1 = true;
	userParam.JCC2 = true;
	userParam.JCC3 = true;
	userParam.JSegment1 = true;
	userParam.JSegment2 = true;
	userParam.JSegment3 = true;
	userParam.JSegment4 = false;
	userParam.JSegment5 = false;
	userParam.JSegment6 = false;
	userParam.JSegment7 = false;
	userParam.JSegment8 = false;
	userParam.JSegment9 = false;
	userParam.JSegment10 = false;
	userParam.JDebitAmountAccountCurrency = false;
	userParam.JCreditAmountAccountCurrency = false;
	userParam.JBalanceAccountCurrency = false;
	userParam.JDebitAmount = true;
	userParam.JCreditAmount = true;
	userParam.JBalance = false;
    return userParam;
}

function parametersDialog(userParam) {
    if (typeof(Banana.Ui.openPropertyEditor) !== 'undefined') {
        var dialogTitle = "Settings";
        var convertedParam = convertParam(userParam);
        var pageAnchor = 'dlgSettings';
        if (!Banana.Ui.openPropertyEditor(dialogTitle, convertedParam, pageAnchor)) {
            return null;
        }
        for (var i = 0; i < convertedParam.data.length; i++) {
            // Read values to userParam (through the readValue function)
            convertedParam.data[i].readValue();
        }
    }
    return userParam;
}

function settingsDialog() {
	var userParam = initUserParam();
	var savedParam = Banana.document.getScriptSettings();
	if (savedParam && savedParam.length > 0) {
	   userParam = JSON.parse(savedParam);
	}
	userParam = parametersDialog(userParam); // From propertiess
	if (userParam) {
	   var paramToString = JSON.stringify(userParam);
	   Banana.document.setScriptSettings(paramToString);
	}
	return userParam;
}

/***********************
* MANAGE STYLES 
***********************/
function createStyleSheet() {
	var stylesheet = Banana.Report.newStyleSheet();
	var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 10mm 10mm 10mm");
    pageStyle.setAttribute("size", "landscape");
    stylesheet.addStyle("body", "font-size: 7pt; font-family: Helvetica");
    stylesheet.addStyle(".bold", "font-weight:bold");
    stylesheet.addStyle(".right", "text-align:right");
	stylesheet.addStyle(".header", "background-color:#F0F8FF");
    style = stylesheet.addStyle(".table");
	style.setAttribute("width", "100%");
	stylesheet.addStyle("table.table td", "border: thin solid black");
	return stylesheet;
}


function bananaRequiredVersion(requiredVersion) {
	if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) < 0) {
		return false;
	}
	return true;
}

