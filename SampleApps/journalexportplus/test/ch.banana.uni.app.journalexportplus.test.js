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


// @id = ch.banana.uni.app.journalexportplus.test
// @api = 1.0
// @pubdate = 2024-03-01
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.uni.app.journalexportplus.js>
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../ch.banana.uni.app.journalexportplus.js
// @timeout = -1


var texts;

// Register test case to be executed
Test.registerTestCase(new ReportJournalTest());

// Here we define the class, the name of the class is not important
function ReportJournalTest() {

}

// This method will be called at the beginning of the test case
ReportJournalTest.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
ReportJournalTest.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
ReportJournalTest.prototype.init = function() {

}

// This method will be called after every test method is executed
ReportJournalTest.prototype.cleanup = function() {

}

// Generate the expected (correct) file
ReportJournalTest.prototype.testBananaApp = function() {
	
	// Set parameters
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

	//Test file 1
	var file = "file:script/../test/testcases/simple_accounting.ac2";
	var banDoc = Banana.application.openDocument(file);
	Test.assert(banDoc);
	Test.logger.addComment("****************************************************************************** TEST #1 ******************************************************************************");
	this.report_test(banDoc, userParam, "Test#1 - simple accounting");

	//Test file 2
	var file = "file:script/../test/testcases/double_entry_accounting.ac2";
	var banDoc = Banana.application.openDocument(file);
	Test.assert(banDoc);
	Test.logger.addComment("****************************************************************************** TEST #2 ******************************************************************************");
	this.report_test(banDoc, userParam, "Test#2 - double-entry accounting");
}

//Function that create the report for the test
ReportJournalTest.prototype.report_test = function(banDoc, userParam, reportName) {
	var report = Banana.Report.newReport("testreport");
	printReportJournal(banDoc, report, userParam);
	Test.logger.addReport(reportName, report);
}
