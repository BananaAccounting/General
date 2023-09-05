// @id = ch.banana.app/rentsdetailed.test
// @api = 1.0
// @pubdate = 2023-08-23
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.app/rentsdetailed.test>
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.sample.fullproject.js

// Register this test case to be executed
Test.registerTestCase(new TestFullProject());

// Define the test class, the name of the class is not important
function TestFullProject() {
}

// This method will be called at the beginning of the test case
TestFullProject.prototype.initTestCase = function () {
  this.testLogger = Test.logger;
  this.progressBar = Banana.application.progressBar;
  this.testFiles = [
    "file:script/../test/testcases/testcase_1.ac2",
    "file:script/../test/testcases/testcase_2.ac2"
  ];
}

// This method will be called at the end of the test case
TestFullProject.prototype.cleanupTestCase = function () {
}

// This method will be called before every test method is executed
TestFullProject.prototype.init = function () {
}

// This method will be called after every test method is executed
TestFullProject.prototype.cleanup = function () {
}

TestFullProject.prototype.testGetProfit = function () {
  let parentLogger = this.testLogger;
  this.progressBar.start(this.testFiles.length);

  for (let i = 0; i < this.testFiles.length; i++) {

    if (!this.progressBar.step())
      break;
    let banDoc = Banana.application.openDocument(this.testFiles[i]);
    Test.assert(banDoc, `Banana.document ${this.testFiles[i]} not found.`);

    // Log value to test results, they will be copared with the expected values
    let fileName = Banana.IO.fileCompleteBaseName(this.testFiles[i]);
    this.testLogger = parentLogger.addSection(fileName);
    this.testLogger.addKeyValue("File name", fileName);
    this.testLogger.addKeyValue("File hash", banDoc.info("Base", "HashTotal"));
    this.testLogger.addKeyValue("Profit", getProfit());
  }

  this.progressBar.finish();
}

TestFullProject.prototype.testGetProfitLabel = function () {
  // Verify function's retrun value
  Test.assertIsEqual(getProfitLabel(0), "Profit");
  Test.assertIsEqual(getProfitLabel(1000), "Profit");
  Test.assertIsEqual(getProfitLabel(-1000), "Loss");

  Test.assertIsEqual(getProfitLabel("0"), "Profit");
  Test.assertIsEqual(getProfitLabel("1000"), "Profit");
  Test.assertIsEqual(getProfitLabel("-1000"), "Loss");
}