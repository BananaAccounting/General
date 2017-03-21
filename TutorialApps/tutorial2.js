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






/** 
    File:        tutorial2.ac2
    Id:          001
    Description: Account statement - account and period choice
*/
//@description="Return a table with all transactions for the given account and period"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Function call to add the footer to the report
    addFooter(report);

    //Function call to take a list of all the account numbers
    var accountList = getAccountsList();

    //Open a dialog window asking to select an item from the list. The selected item is then saved into a variable
    var accountNumber = Banana.Ui.getItem('Account selection', 'Select an account', accountList, 0, false);

    //Open a dialog windows taskint the user to choose a period
    //Return an object with the attributes 'startDate', 'endDate' and 'hasSelection' or undefined if the user clicked cancel
    var date = Banana.Ui.getPeriod('Period selection', '2015-01-01', '2015-12-31');

    //Check if user has clicked cancel, then use the default startDate/endDate (whole year)
    if (date) {
        var openingDate = date.startDate;
        var closureDate = date.endDate;
    }


    //--------------//
    //	1. TITLE	//
    //--------------//
    //Take the description of the given account and add it to the paragraph
    var accountDescription = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('Description');
    report.addParagraph("Account statement" + " - " + accountNumber + " " + accountDescription, "styleTitle styleBottomBorder");
    report.addParagraph(" ");


    //--------------//
    //	2. TABLE 	//
    //--------------//
    //Create a table object with all transactions for the given account and period
    var transTab = Banana.document.currentCard(accountNumber, openingDate, closureDate);

    //Create the table that will be printed on the report
    var table = report.addTable("myTable");

    //Add column titles to the table report
    var tableHeader = table.getHeader();
    tableRow = tableHeader.addRow();
    tableRow.addCell("Date", "styleTableHeader");
    tableRow.addCell("Description", "styleTableHeader");
    tableRow.addCell("Contra Account", "styleTableHeader");
    tableRow.addCell("Debit amount", "styleTableHeader");
    tableRow.addCell("Credit amount", "styleTableHeader");
    tableRow.addCell("Balance", "styleTableHeader");

    //Add the values taken from each row of the table (except the last one) to the respective cells of the table
    for (var i = 0; i < transTab.rowCount - 1; i++) {
        var tRow = transTab.row(i);
        tableRow = table.addRow();
        tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('JDate')));
        tableRow.addCell(tRow.value("JDescription"));
        tableRow.addCell(tRow.value("JContraAccount"), "styleAccount");
        tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JDebitAmountAccountCurrency')), "styleAmount");
        tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JCreditAmountAccountCurrency')), "styleAmount");
        if (Banana.SDecimal.sign(tRow.value('JBalanceAccountCurrency')) >= 0) {
            tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "styleAmount");
        } else {
            tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "styleBalance styleAmount");
        }
    }

    //We add last row (totals) separately because we want to apply a special style only to this row
    for (var i = transTab.rowCount - 1; i < transTab.rowCount; i++) {
        var tRow = transTab.row(i);
        tableRow = table.addRow();
        tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('JDate')), "styleTotal");
        tableRow.addCell(tRow.value("JDescription"), "styleTotal");
        tableRow.addCell(tRow.value("JContraAccount"), "styleAccount styleTotal");
        tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JDebitAmountAccountCurrency')), "styleAmount styleTotal");
        tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JCreditAmountAccountCurrency')), "styleAmount styleTotal");
        if (Banana.SDecimal.sign(tRow.value('JBalanceAccountCurrency')) >= 0) {
            tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "styleAmount styleTotal");
        } else {
            tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "styleBalance styleAmount styleTotal");
        }
    }

    //Functin call to create all the styles
    var stylesheet = createStyleSheet();

    //Print the report
    Banana.Report.preview(report, stylesheet);
}



//This function adds a Footer to the report
function addFooter(report) {
    report.getFooter().addClass(".img");
    report.getFooter().addImage("banana.jpg", "img");
}


//This function take from Banana table 'Accounts' all the account numbers and create a list
function getAccountsList() {
    var arrList = [];
    for (var i = 0; i < Banana.document.table('Accounts').rowCount; i++) {
        var tRow = Banana.document.table('Accounts').row(i);
        if (tRow.value("Account")) {
            arrList.push(tRow.value("Account"));
        }
    }
    return arrList;
}


//The main purpose of this function is to create styles for the report print
function createStyleSheet() {

    var stylesheet = Banana.Report.newStyleSheet();

    //Page style
    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "20m 15mm 15mm 25mm");

    //Footer style
    style = stylesheet.addStyle(".img");
    style.setAttribute("width", "50%");
    style.setAttribute("height", "auto");
    style.setAttribute("text-align", "center");

    //Title style
    style = stylesheet.addStyle(".styleTitle");
    style.setAttribute("font-size", "14pt");
    style.setAttribute("font-weight", "bold");

    //Bottom border
    style = stylesheet.addStyle(".styleBottomBorder");
    style.setAttribute("border-bottom", "1px solid black");

    //Create a table style adding the border
    style = stylesheet.addStyle("table");
    style.setAttribute("width", "100%");
    stylesheet.addStyle("table.myTable td", "border: thin solid black");

    //Style for the table titles
    style = stylesheet.addStyle(".styleTableHeader");
    style.setAttribute("font-weight", "bold");
    style.setAttribute("padding-bottom", "5px");
    style.setAttribute("background-color", "#ffd100");
    style.setAttribute("color", "#1b365d");

    //Style for account numbers
    style = stylesheet.addStyle(".styleAccount");
    style.setAttribute("padding-bottom", "5px");
    style.setAttribute("text-align", "center");

    //Style for amounts
    style = stylesheet.addStyle(".styleAmount");
    style.setAttribute("padding-bottom", "5px");
    style.setAttribute("text-align", "right");

    //Style for balances
    style = stylesheet.addStyle(".styleBalance");
    style.setAttribute("color", "red");

    //Style for the total of the table
    style = stylesheet.addStyle(".styleTotal");
    style.setAttribute("font-weight", "bold");
    style.setAttribute("padding-bottom", "5px");
    style.setAttribute("background-color", "#b7c3e0");
    style.setAttribute("border-bottom", "1px double black");

    return stylesheet;
}






/** 
    File:        tutorial2.ac2
    Id:          002
    Description: Account statement - more accounts print (without accounts/period choice)
*/
//@description = "Account statement - two accounts report"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Function call to add the footer to the report
    addFooter(report);

    //First function call to create the page of the report
    createReport(report, '1010', '2015-01-01', '2015-12-31');

    //Add a page break after the first page
    report.addPageBreak();

    //Second function call to create the second page of the report
    createReport(report, '1011', '2015-01-01', '2015-12-31');

    //Functin call to create all the styles
    var stylesheet = createStyleSheet();

    //Print the report
    Banana.Report.preview(report, stylesheet);
}


//The purpose of this function is to create a report using the given accounts number and period
function createReport(report, accountNumber, openingDate, closureDate) {


    //--------------//
    //	1. ADDRESS	//
    //--------------//

    //Read from the table 'Address' some informations and save them
    var namePrefix = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('NamePrefix');
    var firstName = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('FirstName');
    var familyName = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('FamilyName');
    var organisationName = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('OrganisationName');
    var address = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('Street');
    var countryCode = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('CountryCode');
    var postalCode = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('PostalCode');
    var locality = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('Locality');
    var telephone = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('PhoneMain');
    var email = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('EmailWork');




    //Add a section to the paragraph for the address
    var sectionAddress = report.addSection("styleAddress");

    //Check if there are the desired address informations, then add them to the paragraph
    if (organisationName) {
        sectionAddress.addParagraph(organisationName);
    }

    if (namePrefix) {
        sectionAddress.addParagraph(namePrefix);
    }
    if (firstName && familyName) {
        sectionAddress.addParagraph(firstName + ' ' + familyName);
    }
    if (address) {
        sectionAddress.addParagraph(address);
    }
    if (countryCode && postalCode && locality) {
        sectionAddress.addParagraph(countryCode + ' - ' + postalCode + ' ' + locality);
    }
    if (telephone) {
        sectionAddress.addParagraph('Tel: ' + telephone);
    }
    if (email) {
        sectionAddress.addParagraph('Email: ' + email);
    }


    //--------------//
    //	2. TITLE	//
    //--------------//
    //Take the description of the given account and add it to the paragraph
    var accountDescription = Banana.document.table('Accounts').findRowByValue('Account', accountNumber).value('Description');
    report.addParagraph(" ", "styleParagraph");
    report.addParagraph("Account statement" + " - " + accountNumber + " " + accountDescription, "styleTitle styleBottomBorder");
    report.addParagraph(" ");


    //--------------//
    //	3. TABLE 	//
    //--------------//
    //Create a table object with all transactions for the given account and period
    var transTab = Banana.document.currentCard(accountNumber, openingDate, closureDate);

    //Create the table that will be printed on the report
    var table = report.addTable("myTable");

    //Add column titles to the table report
    var tableHeader = table.getHeader();
    tableRow = tableHeader.addRow();
    tableRow.addCell("Date", "styleTableHeader");
    tableRow.addCell("Description", "styleTableHeader");
    tableRow.addCell("Contra Account", "styleTableHeader");
    tableRow.addCell("Debit amount", "styleTableHeader");
    tableRow.addCell("Credit amount", "styleTableHeader");
    tableRow.addCell("Balance", "styleTableHeader");

    //Add the values taken from each row of the table (except the last one) to the respective cells of the table
    for (var i = 0; i < transTab.rowCount - 1; i++) {
        var tRow = transTab.row(i);
        tableRow = table.addRow();
        tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('JDate')));
        tableRow.addCell(tRow.value("JDescription"));
        tableRow.addCell(tRow.value("JContraAccount"), "styleAccount");
        tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JDebitAmountAccountCurrency')), "styleAmount");
        tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JCreditAmountAccountCurrency')), "styleAmount");
        if (Banana.SDecimal.sign(tRow.value('JBalanceAccountCurrency')) >= 0) {
            tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "styleAmount");
        } else {
            tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "styleBalance styleAmount");
        }
    }

    //We add last row (totals) separately because we want to apply a special style only to this row
    for (var i = transTab.rowCount - 1; i < transTab.rowCount; i++) {
        var tRow = transTab.row(i);
        tableRow = table.addRow();
        tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('JDate')), "styleTotal");
        tableRow.addCell(tRow.value("JDescription"), "styleTotal");
        tableRow.addCell(tRow.value("JContraAccount"), "styleAccount styleTotal");
        tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JDebitAmountAccountCurrency')), "styleAmount styleTotal");
        tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JCreditAmountAccountCurrency')), "styleAmount styleTotal");
        if (Banana.SDecimal.sign(tRow.value('JBalanceAccountCurrency')) >= 0) {
            tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "styleAmount styleTotal");
        } else {
            tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "styleBalance styleAmount styleTotal");
        }
    }
}



//This function adds a Footer to the report
function addFooter(report) {
    report.getFooter().addClass(".img");
    report.getFooter().addImage("banana.jpg", "img");
}


//The main purpose of this function is to create styles for the report print
function createStyleSheet() {

    var stylesheet = Banana.Report.newStyleSheet();

    //Page style
    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "20m 15mm 15mm 25mm");

    //Footer style
    style = stylesheet.addStyle(".img");
    style.setAttribute("width", "50%");
    style.setAttribute("height", "auto");
    style.setAttribute("text-align", "center");

    //Title style
    style = stylesheet.addStyle(".styleTitle");
    style.setAttribute("font-size", "14pt");
    style.setAttribute("font-weight", "bold");

    //Bottom border
    style = stylesheet.addStyle(".styleBottomBorder");
    style.setAttribute("border-bottom", "1px solid black");

    //Create a table style adding the border
    style = stylesheet.addStyle("table");
    style.setAttribute("width", "100%");
    stylesheet.addStyle("table.myTable td", "border: thin solid black");

    //Style for the table titles
    style = stylesheet.addStyle(".styleTableHeader");
    style.setAttribute("font-weight", "bold");
    style.setAttribute("padding-bottom", "5px");
    style.setAttribute("background-color", "#ffd100");
    style.setAttribute("color", "#1b365d");

    //Style for account numbers
    style = stylesheet.addStyle(".styleAccount");
    style.setAttribute("padding-bottom", "5px");
    style.setAttribute("text-align", "center");

    //Style for amounts
    style = stylesheet.addStyle(".styleAmount");
    style.setAttribute("padding-bottom", "5px");
    style.setAttribute("text-align", "right");

    //Style for balances
    style = stylesheet.addStyle(".styleBalance");
    style.setAttribute("color", "red");

    //Style for the total of the table
    style = stylesheet.addStyle(".styleTotal");
    style.setAttribute("font-weight", "bold");
    style.setAttribute("padding-bottom", "5px");
    style.setAttribute("background-color", "#b7c3e0");
    style.setAttribute("border-bottom", "1px double black");

    style = stylesheet.addStyle(".styleAddress");
    style.setAttribute("position", "absolute");
    style.setAttribute("left", "0mm");
    style.setAttribute("top", "0mm");
    style.setAttribute("width", "80mm");
    style.setAttribute("height", "30mm");
    style.setAttribute("overflow-shrink-max", "0.6");
    style.setAttribute("overflow", "shrink");

    //Add a space between the date and the title
    style = stylesheet.addStyle(".styleParagraph");
    style.setAttribute("margin", "112px");

    return stylesheet;
}






/** 
    File:        tutorial2.ac2
    Id:          003
    Description: Export a value from Banana into a text file (.txt)
*/
// @id = ch.banana.apps.export
// @api = 1.0
// @doctype = *.*
// @docproperties = Export
// @description = Export into a text file (.txt)
// @task = export.file
// @exportfiletype = txt
// @timeout = -1

// It is possible to export data only into external files.
// In this example we take an account balance and we export it into a txt file.
// A dialog window asks the user to insert the file name and choose where to save it.

function exec() {

    //Take the balance (opening + debit-credit) for the given account and period
    var exportResult = Banana.document.currentBalance('1000', '2015-01-05', '2015-02-07').balance;

    //Specifies a value to be returned that will be exported into the txt file
    return exportResult;

}






/** 
    File:        tutorial2.ac2
    Id:          004
    Description: Export tutorial javascript codes
*/
// @id = ch.banana.apps.exportjavascriptcodes.js
// @api = 1.0
// @publisher = Banana.ch SA
// @description = Export javascript codes of the tutorial examples
// @task = export.file
// @doctype = *.*
// @docproperties = 
// @timeout = -1
// @exportfiletype = js
//Main function
function exec() {

    //Check if we are on an opened document
    if (!Banana.document) {
        return;
    }

    //Take the table Documents
    var documents = Banana.document.table('Documents');

    //We check if the table Documents exists, then we can take all the codes 
    //If the table Documents doesn't exists, then we stop the script execution
    if (!documents) {
        return;
    } else {

        //We use this variable to save all the codes
        var jsCode = '';

        jsCode += '// Copyright [2015] [Banana.ch SA - Lugano Switzerland]' + '\n';
        jsCode += '// ' + '\n';
        jsCode += '// Licensed under the Apache License, Version 2.0 (the "License");' + '\n';
        jsCode += '// you may not use this file except in compliance with the License.' + '\n';
        jsCode += '// You may obtain a copy of the License at' + '\n';
        jsCode += '// ' + '\n';
        jsCode += '//     http://www.apache.org/licenses/LICENSE-2.0' + '\n';
        jsCode += '// ' + '\n';
        jsCode += '// Unless required by applicable law or agreed to in writing, software' + '\n';
        jsCode += '// distributed under the License is distributed on an "AS IS" BASIS,' + '\n';
        jsCode += '// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.' + '\n';
        jsCode += '// See the License for the specific language governing permissions and' + '\n';
        jsCode += '// limitations under the License.' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n';

        //Function call to get all the tutorial's codes
        jsCode = getJavascriptCode(jsCode, documents);
    }

    return jsCode;
}




//Function that, for each tutorial's example, gets the javascript code and save it into the jsCode variable.
function getJavascriptCode(jsCode, documents) {

    //Read row by row the table Documents
    var len = documents.rowCount;
    for (var i = 0; i < len; i++) {

        //Create a variable for the row
        var tRow = documents.row(i);

        //We get some values
        var fName = Banana.document.info("Base", "FileName").replace(/^.*[\\\/]/, ''); //the file name (without path)
        var id = tRow.value("RowId"); //the id of the example
        var description = tRow.value("Description"); //the description of the example
        var attachments = tRow.value("Attachments"); //the javascript code of the example

        //We consider only the rows that contain an id, a description and an attachment
        if (id && description && attachments) {

            //At the beginning of each code, we insert some information
            jsCode += "/** " + '\n';
            jsCode += "    File:        " + fName + '\n';
            jsCode += "    Id:          " + id + '\n';
            jsCode += "    Description: " + description + '\n';
            jsCode += "*/" + '\n';

            //we add the code of the attachments
            jsCode += attachments;

            //At the end of each code, we insert some new lines
            jsCode += '\n' + '\n' + '\n' + '\n' + '\n' + '\n' + '\n';
        }
    }

    //Finally we return the variable containing all the codes of all the examples
    return jsCode;
}






