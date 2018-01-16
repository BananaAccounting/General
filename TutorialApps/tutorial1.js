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
    File:        tutorial1.ac2
    Id:          001
    Description: Hello World
*/
//@description="Hello World"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add a paragraph with some text
    report.addParagraph('Hello World!!!');

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          002
    Description: Add several paragraphs
*/
//@description="Stylesheet - Add several paragraphs"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add several paragraphs with some text
    report.addParagraph('This');
    report.addParagraph('is');
    report.addParagraph('a');
    report.addParagraph('text');
    report.addParagraph(' '); //Empty paragraph
    report.addParagraph('printed');
    report.addParagraph('on');
    report.addParagraph('several');
    report.addParagraph('paragraphs.');

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          003
    Description: Add the header
*/
//@description="Report - Add the header with some styles"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add the header
    report.getHeader().addClass('header');
    report.getHeader().addText('This is the header text aligned to the right with a bottom border', 'header');

    //Add some style
    var stylesheet = Banana.Report.newStyleSheet();

    //Header style
    style = stylesheet.addStyle(".header");
    style.setAttribute("text-align", "right");
    style.setAttribute("border-bottom", "thin solid black");

    //Print the report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          004
    Description: Add the footer
*/
//@description="Report - Add the footer with some styles"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add the footer with page numbers
    report.getFooter().addClass('footer');
    report.getFooter().addText('Banana Accounting, v. ' + Banana.document.info('Base', 'ProgramVersion'));
    report.getFooter().addText(' - Page' + ' ');
    report.getFooter().addFieldPageNr();

    //Add some style
    var stylesheet = Banana.Report.newStyleSheet();

    //Footer style
    style = stylesheet.addStyle(".footer");
    style.setAttribute("text-align", "right");
    style.setAttribute("font-size", "8px");
    style.setAttribute("font-family", "Courier New");

    //Print the report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          005
    Description: Add an image
*/
//@description="Report - Add an image"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add the image: it's important to specify the full path where the image is saved.
    report.addImage("documents:logo");

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          006
    Description: Add page break
*/
//@description="Page break"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add a paragraph with some text
    report.addParagraph('Hello');

    //Add a page break
    report.addPageBreak();

    //Add an other paragraph 
    report.addParagraph('World!!!');

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          007
    Description: Create a table with one row
*/
//@description="Create a table with one row"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Create a table
    var table = report.addTable('myTable');

    //Add a row
    tableRow = table.addRow();
    tableRow.addCell('Cash');
    tableRow.addCell('1200');

    //Create style
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          008
    Description: Create a table with multiple rows
*/
//@description="Create a table with multiple rows"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Create a table
    var table = report.addTable('myTable');

    //Add row 1
    tableRow = table.addRow();
    tableRow.addCell('Cash');
    tableRow.addCell('1200');

    //Add row 2
    tableRow = table.addRow();
    tableRow.addCell('Bank 1');
    tableRow.addCell('500');

    //Add row 3
    tableRow = table.addRow();
    tableRow.addCell('Bank 2');
    tableRow.addCell('2600');

    //Print report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          009
    Description: Create a table with multiple rows and a header
*/
//@description="How to create a table in the report"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Create a table
    var table = report.addTable('myTable');

    //Create table header
    var tableHeader = table.getHeader();

    //Add the header of the table
    tableRow = tableHeader.addRow();
    tableRow.addCell('Description');
    tableRow.addCell('Amount');

    //Add row 1
    tableRow = table.addRow();
    tableRow.addCell('Cash');
    tableRow.addCell('1200');

    //Add row 2
    tableRow = table.addRow();
    tableRow.addCell('Bank 1');
    tableRow.addCell('500');

    //Add row 3
    tableRow = table.addRow();
    tableRow.addCell('Bank 2');
    tableRow.addCell('2600');

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          010
    Description: Create a table with multiple rows, header and borders
*/
//@description="Create a table with multiple rows, header and borders"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Create a table
    var table = report.addTable('myTable');

    //Create table header
    var tableHeader = table.getHeader();

    //Add the header of the table
    tableRow = tableHeader.addRow();
    tableRow.addCell('Description');
    tableRow.addCell('Amount');

    //Add row 1
    tableRow = table.addRow();
    tableRow.addCell('Cash');
    tableRow.addCell('1200');

    //Add row 2
    tableRow = table.addRow();
    tableRow.addCell('Bank 1');
    tableRow.addCell('500');

    //Add row 3
    tableRow = table.addRow();
    tableRow.addCell('Bank 2');
    tableRow.addCell('2600');

    //Stylesheet
    var stylesheet = Banana.Report.newStyleSheet();

    //Create style for the table adding borders
    var style = stylesheet.addStyle("table");
    stylesheet.addStyle("table.myTable td", "border: thin solid black");

    //Print report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          011
    Description: Set page margins
*/
//@description="Stylesheet - set margins"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add a paragraph with some text using a style
    report.addParagraph('Hello world!');

    //Add some styles
    var stylesheet = Banana.Report.newStyleSheet();

    //Create the margin for the page: [top, right, bottom, left]
    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 20mm 10mm 20mm");

    //Print the report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          012
    Description: Set landscape page
*/
//@description="Stylesheet - set landscape"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add a paragraph with some text using a style
    report.addParagraph('Hello world!');

    //Add some styles
    var stylesheet = Banana.Report.newStyleSheet();

    //Create the margin for the page
    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("size", "landscape");

    //Print the report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          013
    Description: Add bold style to a text
*/
//@description="Stylesheet - add bold style to a text"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add a paragraph with some text using a style
    report.addParagraph('Hello world!', 'boldStyle');

    //Add some styles
    var stylesheet = Banana.Report.newStyleSheet();

    //Create the "boldStyle"
    style = stylesheet.addStyle(".boldStyle");
    style.setAttribute("font-weight", "bold");

    //Print the report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          014
    Description: Add a font size to a text
*/
//@description="Stylesheet - add a specific font size to a text"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add a paragraph with some text using a style
    report.addParagraph('Hello world!', 'titleStyle');

    //Add some styles
    var stylesheet = Banana.Report.newStyleSheet();

    //Create the style for the text
    style = stylesheet.addStyle(".titleStyle");
    style.setAttribute("font-size", "20px");

    //Print the report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          015
    Description: Add a color to a text
*/
//@description="Stylesheet - add a color to a text"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add a paragraph with some text using a style
    report.addParagraph('Hello world!', 'colorStyle');

    //Add some styles
    var stylesheet = Banana.Report.newStyleSheet();

    //Create the style for the text
    style = stylesheet.addStyle(".colorStyle");
    style.setAttribute("color", "red");

    //Print the report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          016
    Description: First page/cover example
*/
//@description="First page/cover example"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport("Cover example");

    var title = " 'This is the title' ";
    var companyName = "Banana.ch SA";
    var openingDate = "01.01.2015";
    var closufeDate = "31.12.2015";
    var year = "2015";

    report.addParagraph(title, "heading1 alignCenter");
    report.addParagraph(" ");
    report.addParagraph(companyName, "heading2 alignCenter");
    report.addParagraph(" ");
    report.addParagraph(year, "heading3 alignCenter");
    report.addParagraph(" ");
    report.addParagraph("(" + openingDate + " - " + closufeDate + ")", "heading4 alignCenter");

    //Add some styles
    var stylesheet = Banana.Report.newStyleSheet();
    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 10mm 10mm 20mm");

    stylesheet.addStyle("body", "font-family : Helvetica");

    style = stylesheet.addStyle(".heading1");
    style.setAttribute("font-size", "22px");
    style.setAttribute("font-weight", "bold");
    style.setAttribute("border-top", "100mm");

    style = stylesheet.addStyle(".heading2");
    style.setAttribute("font-size", "18px");
    style.setAttribute("font-weight", "bold");

    style = stylesheet.addStyle(".heading3");
    style.setAttribute("font-size", "14px");
    style.setAttribute("font-weight", "bold");

    style = stylesheet.addStyle(".heading4");
    style.setAttribute("font-size", "10px");
    style.setAttribute("font-weight", "bold");

    style = stylesheet.addStyle(".alignCenter");
    style.setAttribute("text-align", "center");

    //Print the report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          017
    Description: Format numbers
*/
//@description="Format number"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Convert the value
    var convertedAmount = Banana.Converter.toLocaleNumberFormat("1200.65");

    //Add the converted amount to the report's paragraph
    report.addParagraph(convertedAmount);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          018
    Description: Format dates
*/
//@description="Format number"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Convert the value
    var date = Banana.Converter.toLocaleDateFormat('2015-12-31');

    //Add the converted amount to the report's paragraph
    report.addParagraph(date);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          019
    Description: Format transactions journal data
*/
//@description="Format transactions journal data"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Create the table that will be printed on the report
    var table = report.addTable("myTable");

    //Add column titles to the table report
    var tableHeader = table.getHeader();
    tableRow = tableHeader.addRow();
    tableRow.addCell('Data', 'boldStyle');
    tableRow.addCell('Account', 'boldStyle');
    tableRow.addCell('Description', 'boldStyle');
    tableRow.addCell('Amount', 'boldStyle');

    //Create a table with all transactions
    var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);

    //Read some values of the journal table
    for (var i = 0; i < journal.rowCount; i++) {
        var tRow = journal.row(i);

        //Add the values taken from the rows to the respective cells of the table
        //For the dates and the amounts we apply the format functions
        tableRow = table.addRow();
        tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('JDate')));
        tableRow.addCell(tRow.value('JAccount'));
        tableRow.addCell(tRow.value('JAccountDescription'));
        tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JAmount')), 'alignRight');
    }

    //Create the styleSheet
    var stylesheet = Banana.Report.newStyleSheet();

    //Add borders to the table
    var style = stylesheet.addStyle("table");
    stylesheet.addStyle("table.myTable td", "border: thin solid black");

    //Add the right alignment for the amount
    style = stylesheet.addStyle(".alignRight");
    style.setAttribute("text-align", "right");

    //Add the bold style for the header
    style = stylesheet.addStyle(".boldStyle");
    style.setAttribute("font-weight", "bold");

    //Print the report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          020
    Description: Basic mathematical operations (sum, subtract, multiply, divide)
*/
//@description="SDecimal() functions - sum, subtract, multiply, divide"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');


    //Do some mathematical operations and add the results to the report

    //Sum
    var sum = Banana.SDecimal.add('6.50', '3.50'); // return '10.00'
    report.addParagraph(sum);

    //Subtract
    var sub = Banana.SDecimal.subtract('10', '3'); // return '7'
    report.addParagraph(sub);

    //Multiply
    var mul = Banana.SDecimal.multiply('6', '3'); // return '18'
    report.addParagraph(mul);

    //Divide
    var div = Banana.SDecimal.divide('6', '3'); // return '2'
    report.addParagraph(div);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          021
    Description: ABS utility
*/
//@description="SDecimal() functions - abs utility"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Return the value without the sign
    var absValue = Banana.SDecimal.abs('-10');

    //Add a paragraph to the report
    report.addParagraph(absValue);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          022
    Description: Compare two values
*/
//@description="SDecimal() functions - compare utility"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    // Compare the values:
    // return 1 if value1 > value2
    // return 0 if value1 = value2
    // return -1 if value1 < value2

    var compareValue = Banana.SDecimal.compare('5', '2');

    //Add a paragraph to the report
    report.addParagraph(compareValue);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          023
    Description: Invert sign of a value
*/
//@description="SDecimal() functions - invert sign utility"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Invert the sign:
    //if positive return a negative value
    //if negative return a positive value

    var invertValue = Banana.SDecimal.invert('4');

    //Add a paragraph to the report
    report.addParagraph(invertValue);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          024
    Description: Check the sign of a value
*/
//@description="SDecimal() functions - check sign utility"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Check the sign of the value:
    //return 1 if value > 0
    //return 0 if  value = 0
    //return -1 if value <0

    var signValue = Banana.SDecimal.sign('-6');

    //Add a paragraph to the report
    report.addParagraph(signValue);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          025
    Description: Number of decimals and rounding properties 
*/
//@description="SDecimal() functions - Number of decimals and rounding properties"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Divide without properties
    var result1 = Banana.SDecimal.divide('10', '3.25'); //return '3.3333333333333333333333333'
    report.addParagraph(result1);

    //Divide with number of decimals property
    var result2 = Banana.SDecimal.divide('10', '3.25', {
        'decimals': 4
    });
    report.addParagraph(result2);

    //Divide with number of decimals and rounding properties
    var result3 = Banana.SDecimal.divide('10', '3.25', {
        'decimals': 2,
        'mode': Banana.SDecimal.HALF_UP
    });
    report.addParagraph(result3);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          026
    Description: Dialog information
*/
//@description="Dialog window - information"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Open a dialog window with an information
    Banana.Ui.showInformation('Title', 'This is the information message!');
}






/** 
    File:        tutorial1.ac2
    Id:          027
    Description: Dialog question
*/
//@description="Dialog window - question"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create a report
    var report = Banana.Report.newReport("Report title");

    //Open a dialog window with a question
    var question = Banana.Ui.showQuestion('Question title', 'Print the report?');

    //If 'true' do something... 
    if (question) {
        //...for example add some text to the paragraph
        report.addParagraph('The answer was YES!');

        //...then print the report
        var stylesheet = Banana.Report.newStyleSheet();
        Banana.Report.preview(report, stylesheet);
    }

}






/** 
    File:        tutorial1.ac2
    Id:          028
    Description: Dialog show text
*/
//@description="Dialog window - show text"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Open a dialog window showing the text.
    //In this case we want to show the table Accounts as html file
    Banana.Ui.showText(Banana.document.table('Accounts').toHtml(['Account', 'Group', 'Description', 'Balance'], true));

}






/** 
    File:        tutorial1.ac2
    Id:          029
    Description: Dialog input text
*/
//@description="Dialog window - input text"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create a report
    var report = Banana.Report.newReport("Report title");

    //Open a dialog window asking the user to insert some text
    //The text inserted is saved into a variable
    var textInsertedByUser = Banana.Ui.getText('This is a dialog window', 'Insert some text', '');

    //Add to the paragraph the text inserted by the user
    report.addParagraph(textInsertedByUser);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);
}






/** 
    File:        tutorial1.ac2
    Id:          030
    Description: Dialog item selection
*/
//@description="Dialog window - item selection"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Open a dialog window asking to select an item from the list
    //The selected item is then saved into a variable
    var itemSelected = Banana.Ui.getItem('Input', 'Choose a value', ['Item ONE', 'Item TWO', 'Item THREE', 'Item FOUR', 'Item FIVE'], 2, false);

    //Add the selected item to the paragraph
    report.addParagraph(itemSelected);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);
}






/** 
    File:        tutorial1.ac2
    Id:          031
    Description: Dialog period selection
*/
//@description="Dialog window - period selection"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create a report
    var report = Banana.Report.newReport("Report title");

    //Open a dialog windows to choose a period
    var date = Banana.Ui.getPeriod('Period selection', '2015-01-01', '2015-12-31');

    //Add the date information to the report
    report.addParagraph(date.startDate);
    report.addParagraph(date.endDate);
    report.addParagraph(date.hasSelection);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);
}






/** 
    File:        tutorial1.ac2
    Id:          032
    Description: Message 
*/
//@description="Check length of Transactions Description"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    Banana.document.clearMessages();

    //Step 1 - table access
    var transactionTable = Banana.document.table('Transactions');

    //Step 2 - loop on each row of the table
    for (var i = 0; i < transactionTable.rowCount; i++) {

        var tRow = transactionTable.row(i);

        //Check the length of the description
        if (tRow.value('Description').length > 20 && tRow.value('Description').length < 30) {
            Banana.document.addMessage("Warning: row " + tRow.rowNr + ", description's length is " + tRow.value('Description').length + "!");
        } else if (tRow.value('Description').length >= 30) {
            Banana.document.addMessage("Error: row " + tRow.rowNr + ", description's length is " + tRow.value('Description').length + "!");
        }
    }

}






/** 
    File:        tutorial1.ac2
    Id:          033
    Description: Check Length of Transactions Description 
*/
//@description="Check length of Transactions Description"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    Banana.document.clearMessages();

    //Step 1 - table access
    var transactionTable = Banana.document.table('Transactions');

    //Step 2 - loop on each row of the table
    for (var i = 0; i < transactionTable.rowCount; i++) {

        var tRow = transactionTable.row(i);

        //Check the length of the description
        if (tRow.value('Description').length > 20 && tRow.value('Description').length < 30) {
            tRow.addMessage("Warning: description's length is " + tRow.value('Description').length + "!");
        } else if (tRow.value('Description').length >= 30) {
            tRow.addMessage("Error: description's length is " + tRow.value('Description').length + "!");
        }
    }

}






/** 
    File:        tutorial1.ac2
    Id:          034
    Description: Clear all messages
*/
//@description="Clear all messages"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    Banana.document.clearMessages();
}






/** 
    File:        tutorial1.ac2
    Id:          035
    Description: Save period settings
*/
// @id = ch.banana.addons.savesettings
// @description = Save settings
// @inputdatasource = none
// @task=app.command
// @timeout = -1
function exec() {

    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Readscript settings
    var readText = Banana.document.scriptReadSettings();

    //If there is a saved setting we can use it
    if (readText) {

        //Use the JSON.parse() to convert a JSON text into a JavaScript object
        var object = JSON.parse(readText);

        //Add a paragraph with the saved and parsed text
        report.addParagraph('Previously saved value: ' + object);

        //Print the report
        var stylesheet = Banana.Report.newStyleSheet();
        Banana.Report.preview(report, stylesheet);
    }

    // If it doesn't exists a saved setting yet (which it happens the very first time the script is executed),
    //	it is necessary to create and save it

    //For example using an dialog window to insert some text
    var text = Banana.Ui.getText('Save settings example', 'Insert some text', '');

    //Convert a JavaScript value into a JSON string using the JSON.stringify() function
    var textToSave = JSON.stringify(text);

    //Save script settings
    var savedText = Banana.document.scriptSaveSettings(textToSave);

}






/** 
    File:        tutorial1.ac2
    Id:          036
    Description: Take basic accounting informations
*/
//@description="Take basic accounting informations"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create report
    var report = Banana.Report.newReport('Report title');

    //Get some value of the accounting file 
    var fileName = Banana.document.info("Base", "FileName");
    var decimalsAmounts = Banana.document.info("Base", "DecimalsAmounts");
    var headerLeft = Banana.document.info("Base", "HeaderLeft");
    var headerRight = Banana.document.info("Base", "HeaderRight");
    var basicCurrency = Banana.document.info("AccountingDataBase", "BasicCurrency");

    //For openingDate and closureDate
    var startDate = Banana.document.info('AccountingDataBase', 'OpeningDate');
    var endDate = Banana.document.info('AccountingDataBase', 'ClosureDate');

    //For file accounting type
    var fileType = Banana.document.info("Base", "FileType");
    var fileGroup = Banana.document.info("Base", "FileTypeGroup");
    var fileNumber = Banana.document.info("Base", "FileTypeNumber");

    //Add the informations to the report
    report.addParagraph(fileName);
    report.addParagraph(decimalsAmounts);
    report.addParagraph(headerLeft);
    report.addParagraph(headerRight);
    report.addParagraph(basicCurrency);
    report.addParagraph(startDate);
    report.addParagraph(endDate);
    report.addParagraph(fileType);
    report.addParagraph(fileGroup);
    report.addParagraph(fileNumber);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          037
    Description: Take address informations
*/
//@description="Take address informations"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create report
    var report = Banana.Report.newReport('Report title');

    //Save informations
    var company = Banana.document.info('AccountingDataBase', 'Company');
    var courtesy = Banana.document.info('AccountingDataBase', 'Courtesy');
    var name = Banana.document.info('AccountingDataBase', 'Name');
    var familyName = Banana.document.info('AccountingDataBase', 'FamilyName');
    var address1 = Banana.document.info('AccountingDataBase', 'Address1');
    var address2 = Banana.document.info('AccountingDataBase', 'Address2');
    var zip = Banana.document.info('AccountingDataBase', 'Zip');
    var city = Banana.document.info('AccountingDataBase', 'City');
    var state = Banana.document.info('AccountingDataBase', 'State');
    var country = Banana.document.info('AccountingDataBase', 'Country');
    var web = Banana.document.info('AccountingDataBase', 'Web');
    var email = Banana.document.info('AccountingDataBase', 'Email');
    var phone = Banana.document.info('AccountingDataBase', 'Phone');
    var mobile = Banana.document.info('AccountingDataBase', 'Mobile');
    var fax = Banana.document.info('AccountingDataBase', 'Fax');
    var fiscalNumber = Banana.document.info('AccountingDataBase', 'FiscalNumber');
    var vatNumber = Banana.document.info('AccountingDataBase', 'VatNumber');

    //Add the informations to the report
    report.addParagraph(company);
    report.addParagraph(courtesy);
    report.addParagraph(name);
    report.addParagraph(familyName);
    report.addParagraph(address1);
    report.addParagraph(address2);
    report.addParagraph(zip);
    report.addParagraph(city);
    report.addParagraph(state);
    report.addParagraph(country);
    report.addParagraph(web);
    report.addParagraph(email);
    report.addParagraph(phone);
    report.addParagraph(mobile);
    report.addParagraph(fax);
    report.addParagraph(fiscalNumber);
    report.addParagraph(vatNumber);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          038
    Description: Take values from a table using findRowByValue() function
*/
//@description="How to take values from a specific row of the table - Version A"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create report
    var report = Banana.Report.newReport("Report title");

    //Save the row extracted from the table
    var rowToExtract = Banana.document.table('Accounts').findRowByValue('Account', '1000');

    //Add the Account, Description and Balance informations to the report
    report.addParagraph(rowToExtract.value('Account'));
    report.addParagraph(rowToExtract.value('Description'));
    report.addParagraph(rowToExtract.value('Balance'));

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          039
    Description: Take values from a table using row
*/
//@description="Take values from specific row and table - Version B"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create report
    var report = Banana.Report.newReport("Report title");

    // Step 1 - table access: specify the name of the table ("Accounts", "Transactions", "VatCodes", ...)
    var accountsTable = Banana.document.table("Accounts");

    //Step 2 - row selection: 	it is important to note that the rows of the Banana table start counting from 0,
    //so keep in mind to specify one number less than the desired one 
    //1st row = 0
    //2nd row = 1
    //3rd row = 2
    //4th row = 3
    //...

    var row3 = accountsTable.row(2); // We want the third row

    // Step 3 - select all the desired columns
    var account = row3.value("Account");
    var description = row3.value("Description");
    var balance = row3.value("Balance");

    //Add the informations to the report
    report.addParagraph(account);
    report.addParagraph(description);
    report.addParagraph(balance);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);
}






/** 
    File:        tutorial1.ac2
    Id:          040
    Description: Take values from a table using all the rows
*/
//@description="Read a whole table and take values"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create a report
    var report = Banana.Report.newReport('Report title');

    //Step 1 - table access
    var accountsTable = Banana.document.table('Accounts');

    //Step 2 - loop on each row of the table, instead of specifying a single row
    for (var rowNumber = 0; rowNumber < accountsTable.rowCount; rowNumber++) {

        var tRow = accountsTable.row(rowNumber);

        //Step 3 - select the desired columns
        var account = tRow.value('Account');
        var description = tRow.value('Description');
        var balance = tRow.value('Balance');

        //Add the informations to the report
        report.addParagraph(account + ', ' + description + ', ' + balance);
    }

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          041
    Description: Take values from a table using all the rows, and print only rows with an account number
*/
//@description="Read a whole table and take values only for rows that have an account number"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create a report
    var report = Banana.Report.newReport('Report title');

    //Step 1 - table access
    var accountsTable = Banana.document.table('Accounts');

    //Step 2 - loop on each row of the table, instead of specifying a single row
    for (var rowNumber = 0; rowNumber < accountsTable.rowCount; rowNumber++) {

        var tRow = accountsTable.row(rowNumber);

        //If the row has an account number we save the values and print them
        if (tRow.value('Account')) {

            //Step 3 - select the desired columns
            var account = tRow.value('Account');
            var description = tRow.value('Description');
            var balance = tRow.value('Balance');

            //Add the informations to the report
            report.addParagraph(account + ', ' + description + ', ' + balance);
        }
    }

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          042
    Description: Print all table rows in a table format
*/
//@description="Read a whole table and take values only for rows that have an account number and print into a table"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create a report
    var report = Banana.Report.newReport('Report title');

    //Create the table that will be printed on the report
    var table = report.addTable("myTable");

    //Add column titles to the table report
    var tableHeader = table.getHeader();
    tableRow = tableHeader.addRow();
    tableRow.addCell("Account");
    tableRow.addCell("Description");
    tableRow.addCell("Balance");


    //Step 1 - table access
    var accountsTable = Banana.document.table('Accounts');

    //Step 2 - loop on each row of the table, instead of specifying a single row
    for (var rowNumber = 0; rowNumber < accountsTable.rowCount; rowNumber++) {

        var tRow = accountsTable.row(rowNumber);

        //If the row has an account number we save the values and print them
        if (tRow.value('Account')) {

            //Step 3 - select the desired columns
            var account = tRow.value('Account');
            var description = tRow.value('Description');
            var balance = tRow.value('Balance');

            //Add the values taken from the rows to the respective cells of the table
            tableRow = table.addRow();
            tableRow.addCell(account);
            tableRow.addCell(description);
            tableRow.addCell(balance);
        }
    }

    //Create the styleSheet to 
    var stylesheet = Banana.Report.newStyleSheet();

    //Create a table style adding the border
    var style = stylesheet.addStyle("table");
    stylesheet.addStyle("table.myTable td", "border: thin solid black");

    //Print the report
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          043
    Description: Amount of opening for all transactions for an account
*/
//@description="Sum the amounts of opening for all transactions for an account"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Take opening sum for a non-specific period: period taken from Banana
    var amount1 = Banana.document.currentBalance('1000', '', '').opening;

    //Take opening sum for a specific period
    var amount2 = Banana.document.currentBalance('1000', '2015-01-05', '2015-02-07').opening;

    //Add a paragraph with the amounts just calculated
    report.addParagraph(Banana.document.accountDescription('1000'));
    report.addParagraph(amount1);
    report.addParagraph(amount2);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          044
    Description: Amount of opening for all transactions for multiple accounts
*/
//@description="Sum the amounts of opening for all transactions for multiple accounts"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Take opening sum for a non-specific period: period taken from Banana
    var amount1 = Banana.document.currentBalance('1000|1010|1011', '', '').opening;

    //Take opening sum for a specific period
    var amount2 = Banana.document.currentBalance('1000|1010|1011', '2015-01-05', '2015-02-07').opening;

    //Add a paragraph with the amounts just calculated
    report.addParagraph(amount1);
    report.addParagraph(amount2);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          045
    Description: Amount of opening for all transactions for a single group
*/
//@description="Sum the amounts of opening for all transactions for a single group"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Take opening sum for a non-specific period: period taken from Banana
    var amount1 = Banana.document.currentBalance('Gr=100', '', '').opening;

    //Take opening sum for a specific period
    var amount2 = Banana.document.currentBalance('Gr=100', '2015-01-05', '2015-02-07').opening;

    //Add a paragraph with the amounts just calculated
    report.addParagraph(Banana.document.accountDescription('Gr=100'));
    report.addParagraph(amount1);
    report.addParagraph(amount2);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          046
    Description: Amount of opening for all transactions for multiple groups
*/
//@description="Sum the amounts of opening for all transactions for multiple groups"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Take opening sum for a non-specific period: period taken from Banana
    var amount1 = Banana.document.currentBalance('Gr=100|110|120', '', '').opening;

    //Take opening sum for a specific period
    var amount2 = Banana.document.currentBalance('Gr=100|110|120', '2015-01-05', '2015-02-07').opening;

    //Add a paragraph with the amounts just calculated
    report.addParagraph(amount1);
    report.addParagraph(amount2);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          047
    Description: Amount of opening for all transactions for a BClass
*/
//@description="Sum the amounts of opening for all transactions for a BClass"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Take opening sum for a non-specific period: period taken from Banana
    var amount1 = Banana.document.currentBalance('BClass=1', '', '').opening;

    //Take opening sum for a specific period
    var amount2 = Banana.document.currentBalance('BClass=1', '2015-01-05', '2015-02-07').opening;

    //Add a paragraph with the amounts just calculated
    report.addParagraph(amount1);
    report.addParagraph(amount2);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          048
    Description: Amount of opening for all transactions for multiple BClass values
*/
//@description="Sum the amounts of opening for all transactions for multiple BClass values"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Take opening sum for a non-specific period: period taken from Banana
    var amount1 = Banana.document.currentBalance('BClass=1|2', '', '').opening;

    //Take opening sum for a specific period
    var amount2 = Banana.document.currentBalance('BClass=1|2', '2015-01-05', '2015-02-07').opening;

    //Add a paragraph with the amounts just calculated
    report.addParagraph(amount1);
    report.addParagraph(amount2);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          049
    Description: Sum the Vat amounts for the specified vat code
*/
//@description="Sum the vat amounts for the specified vat code"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Take the vatAmount sum for a non-specific period: period taken from Banana
    var amount1 = Banana.document.vatCurrentBalance('S10', '', '').vatAmount;

    //Take the vatAmount sum for a specific period
    var amount2 = Banana.document.vatCurrentBalance('S10', '2015-01-01', '2015-01-06').vatAmount;

    //Add a paragraph with the amounts just calculated
    report.addParagraph(amount1);
    report.addParagraph(amount2);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          050
    Description: Sum the Vat amounts for multiple vat codes
*/
//@description="Sum the vat amounts for multiple vat codes"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Take the vatAmount sum for a non-specific period: period taken from Banana
    var amount1 = Banana.document.vatCurrentBalance('S10|P10', '', '').vatAmount;

    //Take the vatAmount sum for a specific period
    var amount2 = Banana.document.vatCurrentBalance('S10|P10', '2015-02-01', '2015-02-28').vatAmount;

    //Add a paragraph with the amounts just calculated
    report.addParagraph(amount1);
    report.addParagraph(amount2);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          051
    Description: For a given account without specifying the period
*/
//@description="Return a table with all transactions for the given account"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Create a table with all the transactions of the given account
    var transTab = Banana.document.currentCard('1010', '', '');

    //For each row of the table we save the values
    for (var i = 0; i < transTab.rowCount; i++) {
        var tRow = transTab.row(i);

        var date = tRow.value('JDate');
        var account = tRow.value('JAccount');
        var description = tRow.value("JDescription");
        var debit = tRow.value('JDebitAmount');
        var credit = tRow.value('JCreditAmount');
        var balance = tRow.value('JBalance');

        //Add a paragraph with the values just calculated
        report.addParagraph(date + ', ' + account + ', ' + description + ', ' + debit + ', ' + credit + ', ' + balance);
    }

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          052
    Description: For a given account and period
*/
//@description="Return a table with all transactions for the given account and period"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Create a table with all transactions for the given account and period
    var transTab = Banana.document.currentCard('1010', '2015-01-03', '2015-02-07');

    //For each row of the table we save the values
    for (var i = 0; i < transTab.rowCount; i++) {
        var tRow = transTab.row(i);

        var date = tRow.value('JDate');
        var account = tRow.value('JAccount');
        var description = tRow.value("JDescription");
        var debit = tRow.value('JDebitAmount');
        var credit = tRow.value('JCreditAmount');
        var balance = tRow.value('JBalance');

        //Add a paragraph with the values just calculated
        report.addParagraph(date + ', ' + account + ', ' + description + ', ' + debit + ', ' + credit + ', ' + balance);
    }

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          053
    Description: Get all transaction for normal accounts
*/
//@description="Get all transacton for normal accounts"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Create a table with all transactions
    var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);

    //Read the table and save some values
    for (var i = 0; i < journal.rowCount; i++) {
        var tRow = journal.row(i);

        var date = tRow.value('JDate');
        var account = tRow.value('JAccount');
        var accDescription = tRow.value('JAccountDescription');
        var description = tRow.value('JDescription');
        var vatCode = tRow.value('JVatCodeWithoutSign');
        var vatDescription = tRow.value('JVatCodeDescription');
        var amount = tRow.value('JAmount');

        //Add to the paragraph the values just saved
        report.addParagraph(date + ', ' + account + ', ' + accDescription + ', ' + description + ', ' + vatCode + ', ' + vatDescription + ', ' + amount);
    }

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}






