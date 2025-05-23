// Copyright [2025] [Banana.ch SA - Lugano Switzerland]
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


// @id = ch.banana.script.payment.receipt.test
// @api = 1.0
// @pubdate = 2025-05-06
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.script.payment.receipt.js>
// @task = app.command
// @doctype = 130.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../ch.banana.script.payment.receipt.js
// @timeout = -1



// Register test case to be executed
Test.registerTestCase(new ReportPaymentReceiptTest());

// Here we define the class, the name of the class is not important
function ReportPaymentReceiptTest() {

}

// This method will be called at the beginning of the test case
ReportPaymentReceiptTest.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
ReportPaymentReceiptTest.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
ReportPaymentReceiptTest.prototype.init = function() {

}

// This method will be called after every test method is executed
ReportPaymentReceiptTest.prototype.cleanup = function() {

}

// Generate the expected (correct) file
ReportPaymentReceiptTest.prototype.testBananaApp = function() {
	
	// Set parameters
	var param = {};
	param.print_header = true;
	param.print_date = true;
	param.font_family = '';

	//Test#1 - Doc 1
	var file = "file:script/../test/testcases/ch.banana.script.payment.receipt.sample.file.ac2";
	var banDoc = Banana.application.openDocument(file);
	Test.assert(banDoc);
	
	Test.logger.addComment("****************************************************************************** TEST #1 ******************************************************************************");
	this.report_test(banDoc, param, "1", "Test#1");
	
	Test.logger.addComment("****************************************************************************** TEST #2 ******************************************************************************");
	this.report_test(banDoc, param, "2", "Test#2");

	Test.logger.addComment("****************************************************************************** TEST #3 ******************************************************************************");
	this.report_test(banDoc, param, "3", "Test#3");

	Test.logger.addComment("****************************************************************************** TEST #4 ******************************************************************************");
	this.report_test(banDoc, param, "6", "Test#4");
}

//Function that create the report for the test
ReportPaymentReceiptTest.prototype.report_test = function(banDoc, param, DocNumber, reportName) {
	var report = Banana.Report.newReport("testreport");
	printPaymentReceipt(banDoc, report, param, DocNumber);
	Test.logger.addReport(reportName, report);
}
