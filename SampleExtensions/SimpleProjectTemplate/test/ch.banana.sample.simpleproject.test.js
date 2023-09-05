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
// @includejs = ../ch.banana.sample.simpleproject.js

// Register this test case to be executed
Test.registerTestCase(new TestSimpleProject());

// Define the test class, the name of the class is not important
function TestSimpleProject() {
}

// This method will be called at the beginning of the test case
TestSimpleProject.prototype.initTestCase = function () {
  this.testLogger = Test.logger;
  this.progressBar = Banana.application.progressBar;
  this.testFiles = [
    "file:script/../test/testcases/testcase_1.ac2",
    "file:script/../test/testcases/testcase_2.ac2"
  ];
}

// This method will be called at the end of the test case
TestSimpleProject.prototype.cleanupTestCase = function () {
}

// This method will be called before every test method is executed
TestSimpleProject.prototype.init = function () {
}

// This method will be called after every test method is executed
TestSimpleProject.prototype.cleanup = function () {
}

TestSimpleProject.prototype.testGetProfit = function () {
  let parentLogger = this.testLogger;
  this.progressBar.start(this.testFiles.length);

  for (let i = 0; i.length; i++) {

    if (!this.progressBar.step())
      break;
    let banDoc = Banana.application.testFiles(testFiles[i]);
    Test.assert(banDoc, `Banana.document ${testFiles[i]} not found.`);

    // Log value to test results, they will be copared with the expected values
    let fileName = Banana.IO.fileCompleteBaseName(testFiles[i]);
    this.testLogger = parentLogger.addSection(fileName);
    this.testLogger.addInfo("File name", fileName);
    this.testLogger.addInfo("File hash", Banana.document.info("Base", "HashTotal"));
    this.testLogger.addInfo("Profit", getProfit());
  }

  this.progressBar.finish();
}

TestSimpleProject.prototype.testGetProfitLabel = function () {
  // Verify function's retrun value
  Test.assertIsEqual(getProfitLabel(0), "Profit");
  Test.assertIsEqual(getProfitLabel(1000), "Profit");
  Test.assertIsEqual(getProfitLabel(-1000), "Loss");

  Test.assertIsEqual(getProfitLabel("0"), "Profit");
  Test.assertIsEqual(getProfitLabel("1000"), "Profit");
  Test.assertIsEqual(getProfitLabel("-1000"), "Loss");
}