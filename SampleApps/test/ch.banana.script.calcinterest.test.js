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
// @id = ch.banana.script.calcinterest.test
// @api = 1.0
// @pubdate = 2024-10-08
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.script.calcinterest.js>
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../ch.banana.script.calcinterest.js
// @timeout = -1



// Register test case to be executed
Test.registerTestCase(new CalcInterestTest());

// Here we define the class, the name of the class is not important
function CalcInterestTest() {

}

// This method will be called at the beginning of the test case
CalcInterestTest.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
CalcInterestTest.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
CalcInterestTest.prototype.init = function() {

}

// This method will be called after every test method is executed
CalcInterestTest.prototype.cleanup = function() {

}

// Generate the expected (correct) file
CalcInterestTest.prototype.test1 = function() {

  var file1 = "file:script/../test/testcases/calcinterest.ac2";
  var banDoc = Banana.application.openDocument(file1);
  Test.assert(banDoc);
  
  var params = InitParameters(banDoc);
  VerifyParameters(params);
  params.accountId = "1001";
  params.interestRateDebit = 5.00;
  params.interestRateCredit = 1.00;
  params.addTextAccountCard = false;

  var returnValue = CalcInterest(banDoc, params);
  //Banana.console.debug(returnValue.displayText);
  //Test.logger.addKeyValue("param1", returnValue.displayText);

}
