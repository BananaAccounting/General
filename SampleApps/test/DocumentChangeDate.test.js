// @id = ch.banana.app.DocumentChangeDate.test
// @api = 1.0
// @pubdate = 2020.08.14
// @publisher = Banana.ch SA
// @description = [Test] DocumentChangeDate
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ../ch.banana.apps.documentchange.dates.js

// Register this test case to be executed
Test.registerTestCase(new TestDocumentChangeDate());

// Define the test class, the name of the class is not important
function TestDocumentChangeDate() {
}

// This method will be called at the beginning of the test case
TestDocumentChangeDate.prototype.initTestCase = function() {
    this.progressBar = Banana.application.progressBar;
}

// This method will be called at the end of the test case
TestDocumentChangeDate.prototype.cleanupTestCase = function() {}

// This method will be called before every test method is executed
TestDocumentChangeDate.prototype.init = function() {}

// This method will be called after every test method is executed
TestDocumentChangeDate.prototype.cleanup = function() {}

// Every method with the prefix 'test' are executed automatically as test method
// You can defiend as many test methods as you need

TestDocumentChangeDate.prototype.test1 = function() {
 
    // Test.logger.addKeyValue("count", 4);
    // Test.logger.addText("The object Test defines methods to verify conditions.");

    // This method verify that the condition is true
    // Test.assert(true);
    // Test.assert(false, "test failed"); // You can specify a message to be logged in case of failure

    // This method verify that the two parameters are equals
    // Test.assertIsEqual("Same text", "Same text");

    this.fileNameList = [];
    this.fileNameList.push("file:script/testcases/documentchangedate/contabilita budget entrate-uscite 2020-2023.ac2");
    this.fileNameList.push("file:script/testcases/documentchangedate/contabilita in partita doppia con IVA 2020.ac2");
    this.fileNameList.push("file:script/testcases/documentchangedate/contabilita_parrocchia 2019.ac2");
    this.fileNameList.push("file:script/testcases/documentchangedate/cs_parrocchia 2018.ac2");
    this.fileNameList.push("file:script/testcases/documentchangedate/lc_parrocchia 2018-2020.ac2");
    
    for (var i = 0; i < this.fileNameList.length; i++) {
        var document = Banana.application.openDocument(this.fileNameList[i]);
        if (document){
            var isTest = true;
            var param = initParam(document, isTest);
            Test.logger.addKeyValue("fileName_"+i.toString(), this.fileNameList[i]);
            Test.logger.addKeyValue("differenceyear_"+i.toString(), param.differenceyear.toString());
            Test.logger.addKeyValue("accountingyear_"+i.toString(), param.accountingyear.toString());
            Test.logger.addKeyValue("newaccountingyear_"+i.toString(), param.newaccountingyear.toString());
            Test.logger.addKeyValue("newaccountingopeningdate_"+i.toString(), param.newaccountingopeningdate.toString());
            Test.logger.addKeyValue("newaccountingclosuredate_"+i.toString(), param.newaccountingclosuredate.toString());
            Test.logger.addKeyValue("newaccountingheaderleft_"+i.toString(), param.newaccountingheaderleft.toString());
            Test.logger.addKeyValue("newaccountingheaderright_"+i.toString(), param.newaccountingheaderright.toString());
        }
        else{
            Test.logger.addText("Failed opening document " + this.fileNameList[i]);
        }
    }
}