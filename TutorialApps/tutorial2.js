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






/** 
    File:        tutorial2.ac2
    Id:          100
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
    report.getFooter().addImage("documents:logo");
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
    Id:          101
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
    report.getFooter().addImage("documents:logo");
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
    Id:          300
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
    Id:          301
    Description: Export Tutorial2 javascript codes
*/
// @id = ch.banana.apps.exportjavascriptcodestutorial2.js
// @api = 1.0
// @publisher = Banana.ch SA
// @description = Export javascript codes of the tutorial 2 examples
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

        jsCode += '// Copyright [2018] [Banana.ch SA - Lugano Switzerland]' + '\n';
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






/** 
    File:        tutorial2.ac2
    Id:          logo
    Description: banana.jpg image
*/
{
    "_attachements": {
        "_0": {
            "contentType": "image/jpg",
            "data": "0000095978da9dd57938d46b1b07f0df2c8c3dc3d865981924868c6590b1240aa79721913524d9c3c1d80f2a92f7286b542447284cd6c91a92e92884b18d7d575a66aca3339957e77a977fde3fcefb7eefebf9ebbeaffb7a3ed7f3c7c399e0cc03c25616961600080402ce1e16c09902cc001e6e6e1837170f0c06e3e5e5e11340080af0f30b4889881e411c9546ca1d95969595c7a82bcba3d4d0b2b2c7f02a6a2734b5b5b591cafa043d9ca1ba9636eec712102f2faf00bf80a4a0a0244e415601f73f87d309c079000c500e01a100301c048183383d001200405ca03f03fc33203004cac50de3e1e5e33f1c681406c02008040c85707141a187ddf8c33e0085738928689a728b123d61a850042ee96e090ffa546d9798dd1003a3e51596cccb272e212925ada8a47c4ce5b8b68e2e5e4fdfc0ecb4b9c599b39656f6e71d2e383a5d74f6beec73c5f7aa9f7ff8cf119151a4e89894eb376ea6a6dd4acfcacec9cdcbbf5750f8b8f4b7b227e515954febea1b1a9b282f9a5bba5ff5bceea5bef9bd6f7884363a363e31495f585c5a5e595d5bfff091b9b9b5bdb3bbc7dafff6c3050220a07fe5bfbae0872e30140a81c27eb840e0a81f037028978226b7882911e6192a8ac225f1204edd2da9ede2456bd931c4bcc286f8c431da0b8acc1fb43f657f0d96fc7fc9fe0dfb8f8b0e084040878f078103c6c0de471c21e06d07c1460d291465a6da3b1798166c21cf0124ca48f949713255acd529dbc2390f71afc12ba7b7f0832ff02f91513b95b7dbd9491f42b436be4c133d14d92798baeda571e6cf47501d798bb38b5f3fedc1a36f0cf55e738ad7bc13ff6cbd18c13ecd984b59768a0818a6a8b5f6c0d5d7a636d2cb0394d49b0c5a54fb038d0c58a883154fbce38549bdb950ee517697ce282bbb3746e3865a1039c2252b6f0f5ba76c3e2db94468af40de7d4f748f4a6492bb9ce3abdb56bff9b177a6d1c9d877a5189f9b16068ec41212c59c297e9d3e504caabefccb7e0d0750b90dc1e8c65c0a3791c9712c986593188407ab8acdadcd10d67ccaf1449c6a19839cc93eb9a4944590db8b63aaefdd34a72fc4874edbc26c2c5d716c5746c86ec62ecedf422ae85db2194a18f1244c6baeccf431db8791d05a452d9b9ab191dd6c7a53486a2a6dba06e87f9dd2c646c29eac3d1a72dd4b37f42b2119cdea47dc1fe2cd3772f5c79f5caae10ad3e500726c78a85e5a7f2c8f3115db814838fdbe1132b2fe740c3f46cfcdc1378563c6b6e449cb6677fa6269f5d647db34b4076a7bd32fce0c809368d913c4e758cb63641d9a910109d5bdf248c2d1516f29be4d267f0be3e8b0502cb5eeae4189fe3960e501351387d36df1a5d91e314b448fa5efabbe2a5270535e326da3ed48793e4fb56dc6d5b78a11b792a8e3625f5a347a6d601b2d7d7e91e3f654c3cc3aa522ec2db42f00293ad8c6da5dda0e924b3147d8c2720ede2337cfbdfcbca9b1e18e65ac753e5b9289b79ceb817ff0f03d76e273a656e4d7d0116475bc0253a2ab8eb5f40a39293cab58baff41e3deba535cf392945ce3f2db3ff0fe7e0f8b9429ae3baf5b13990e9a17da3940f5cddd33452c970bf73b8de1a3d5eeb3df2fbdd025a3d45772f19772b63142825148c48e0d3725537dfea0fbf0f20fd7b38de905deea6226e6c4f10ca193ab2d837c71a091ed73eee344da0ebe23d65744edf87de1e7cbbe95bdb176aca9f98c0e05a62bfd20b78a5fdf3754ed164a9c3e2f743e597344c7edc62c3523ee54d368094dedf2a821c1a764ff4ec22a7dd464dfb4d7252b7ca7666b31bce125344e60c05211b5cc01c6455d0cca3b056d1c9dbe90db9cf60cee8b28e5916eabb87786178fb5d8c0d92aede307c87523198336787fd9dd0276d60573a0a27350d62bb33e44736ed6e6cd668007787d338ebb85e952957a5e149cd9b670fe27f454668952c381a8fb87c86221c3abf40d2bbaed26b4b6a7472b78fa85e4ba6527d9366521b7c798c78761b3fbc0c23768ce7ff3d7a13f86946706620422aae604d8e2e754bb6376932a3fde0e17af5c8163347334257f97dffc5b34ea7ea2c4ce84b5cfc7e890547741f7d809b6ccbc9e2f976ebf7a89e63d93723d7d3d08da38d794813b93b95896ce2d6f68af9a341d1d18ba9fe43696cd90701b718f25b15d833e055fa3a884c8a85aa518ca854e8f51528c786748277b9be8cbced3f6539dc3207e13b33a5cdd2f2e7a83e846bd86e23776746ae655ba2239ed00a79b1ddbfa89229db368920aad509f180c5c421419beff6ca8cab45ab3194e791d047ddf66d264e5436cf943d4fdeda3388996a10e54793af2e24da7bc8f17d94920c15401cd07bb33964bc6c9e309c799ed8369e8314fcaaf57d2f6b1202fddc764570e506f25ad37b7c612c3466784fcbda53ce5111301f72f74982d795a5d973933dd40ecb95e2b2bf4dbf241eeea01be69d4f1d4b06f33a3ba28f55258deac534f5d06240f934788dd2307b17219b107a2f15e04e7413bf1fc533ae9e65984be4e5fa877c9da764dc2debc3af9d944e5a8a19b62ff27173b518c4fe9596aa0e8035ad9230ffbf0058f5bda2f85d8b2c3649dd6ed468a563f9f6101dac8fb4e1b64ddaf582ccec5b3260e4d0b66132ab0fdf5aed420ed5ab0e61bc5686a057bfd058b101fc1e81ee916ac9a4a6deac05b872ecb8a2974b8fad6386d39cf0ab32e72a7ce9fb3eea6bf7e1773a37dfbb3aaf655fb600780aa7cc75ebf1c1bf23d121158154ded3ac2c5f2ee291427475475898df659af4487e1bf55eca6b4c58858ae7d2fdce8906645751a28a79dee403255e7fcd5c81279c3dea4e5bb14885e6f22dfda95ef0f7754030a12ebd83fa129092798cfbd0892955d35530bd46e552478a6a38c30d94e9b1408509aa9942e6a3d53b9c301a49f3df9a2dc98c93dd460ed01675f0e52da8b9a0cd651e94912e2b575ab2d9aec55318c2ea1931c1773078acb60e974de125252604e5f69c4ae527bbe094b23e2f0bfb04118d50bd46269f5fb60b08c90a4b7fee796ecde44ae1ab6c3526cb1f099aa5721b2fdf04d67704f90b97b3307b892a31dfa729071dc794baedb80686daec085209afcd583e44cfe036b535188"
        }
    }
}







