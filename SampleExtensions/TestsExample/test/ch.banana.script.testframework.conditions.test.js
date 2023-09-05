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
// @pubdate = 2018-04-04
// @publisher = Banana.ch SA
// @description = Simple test case
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @testappversionmin = 9.0.3.1
// @testappversionmax =

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

// This is a test method
TestFrameworkExample.prototype.testOk = function() {
   Test.assert(true);
}

