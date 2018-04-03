// Copyright [2018] [Banana.ch SA - Lugano Switzerland]
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

// @id = ch.banana.script.testframework.test
// @api = 1.0
// @pubdate = 2018-04-03
// @publisher = Banana.ch SA
// @description = Simple test case
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1

// Include the BananaApp to test
// @includejs = ../ch.banana.script.testframework.js

// Register this test case to be executed
Test.registerTestCase(new TestFrameworkExample());

// Define the test class, the name of the class is not important
function TestFrameworkExample() {

}

// This method will be called at the beginning of the test case
TestFrameworkExample.prototype.initTestCase = function() {
   this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestFrameworkExample.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
TestFrameworkExample.prototype.init = function() {

}

// This method will be called after every test method is executed
TestFrameworkExample.prototype.cleanup = function() {

}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

// This is test method
TestFrameworkExample.prototype.testOk = function() {

   Test.logger.addText("This test will pass :-)");

   Test.assert(true);
}

// This is an other test method
TestFrameworkExample.prototype.testFailure = function() {

   Test.logger.addText("This test will fail :-(");

   Test.assert(false);
}

TestFrameworkExample.prototype.testVerifyMethods = function() {

   Test.logger.addText("The object Test defines methods to verify conditions.");

   // This method verify that the condition is true
   Test.assert(true);
   Test.assert(true, "message"); // You can specify a message to be logged in case of failure

   // This method verify that the text ends with the given string
   Test.assertEndsWith("Text ends with", "with");

   // This method verify that the two parameters are equals
   Test.assertIsEqual("Same text", "Same text");

   // This method verify that the first paramter is greater than the second parameter
   Test.assertGreaterThan(10, 8);

   // This method verify that the first paramter is greater or equal than the second parameter
   Test.assertGreaterThanOrEqual(10, 10);

   // This method verify that the first paramter is less than the second parameter
   Test.assertLessThan(8, 10);

   // This method verify that the first paramter is less or equal than the second parameter
   Test.assertLessThanOrEqual(10, 10);

   // This method verify that the text starts with the given string
   Test.assertStartsWith("Text ends with", "Text");

   // This method verify that the text match the given regular expression
   Test.assertMatchRegExp("Text ends with", /ends/);
}

TestFrameworkExample.prototype.testOutputMethods = function() {

   Test.logger.addText("The object Test.logger defines methods to output values, so that they can be compared with the results of previous tests.");

   // This add a comment to the test log file
   // Comment will be ignored while comparing test results
   Test.logger.addComment("This is a comment");

   // This add an information to the test log file
   // Informations will be ignored while comparing test results, but will be printed in the output
   var currentDate = new Date();
   Test.logger.addInfo("This is an info", currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString());

   // This add a text to the test log file
   Test.logger.addText("This is a text");

   // This add a json value
   var obj = {
      'count': 100,
      'color': "yellow"
   };
   Test.logger.addJsonValue("This is a json value", JSON.stringify(obj));

   // This add an xml value
   var xml =
         "<note>" +
         "<to>Pinco</to>" +
         "<from>Pallino</from>" +
         "<heading>Reminder</heading>" +
         "<body>Don't forget me this weekend!</body>" +
         "</note>";
   Test.logger.addXmlValue("This is a xml value", xml);

   // This add a report
   var report = Banana.Report.newReport("Report title");
   report.addParagraph("Hello World !!!", "styleHelloWorld");
   Test.logger.addReport("This is a report", report);

   // This add a table
   var document = Banana.application.openDocument("file:script/../test/testcases/ch.banana.script.bananaapp.testcase.ac2");
   Test.assert(document);
   Test.logger.addTable("This is a table", document.table("Transactions"), ["Date", "Description", "Amount"]);

   // This add a fatal error to the test log file
   // A fatal error will be reported while comparing the current results with the expeceted results
   Test.logger.addFatalError("This is a fatal error message");

}

TestFrameworkExample.prototype.testBananaApps = function() {

   Test.logger.addText("This test will tests the BananaApp ch.banana.script.bananaapp.js");

   var document = Banana.application.openDocument("file:script/../test/testcases/ch.banana.script.bananaapp.testcase.ac2");
   Test.assert(document);

   Test.logger.addKeyValue("Result of methos 'findBiggestTransactionAmount()'", findBiggestTransactionAmount(document));
}

TestFrameworkExample.prototype.testResultsSplitting = function() {

   Test.logger.addText("This test split the results over more files");

   // Write results in a new file called testresults
   var testLogger = Test.logger.newLogger("testresults");
   testLogger.addText("This text will be written in file testresults.txt");
   testLogger.close();

   // Write results in a new new folder called testgroup
   var groupLogger = Test.logger.newGroupLogger("testgroup");

   // Write results in a new file called testgroup/testresults1
   var test1Logger = groupLogger.newLogger("testresults1");
   test1Logger.addText("This text will be written in file testgroup/testresults1.txt");
   test1Logger.close();

   // Write results in a new file called testgroup/testresults2
   var test2Logger = groupLogger.newLogger("testresults2");
   test1Logger.addText("This text will be written in file testgroup/testresults2.txt")
   test2Logger.close();

   groupLogger.close();
}

TestFrameworkExample.prototype.testLocalMethod = function() {

   Test.logger.addText(this.localMethod());
}

// This method doesn't start with 'test', it will not be runned by the test case, but can be used by any method
TestFrameworkExample.prototype.localMethod = function() {
   return "I'm just a local function";
}
