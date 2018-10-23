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
    File:        tutorial1.ac2
    Id:          100
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
    Id:          200
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
    Id:          201
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
    Id:          202
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
    Id:          203
    Description: Add an image
*/
//@description="Report - Add an image"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add an image stored in the document tabel
    report.addImage("documents:logo");

    //Add a png image passing the content of the image
    report.addImage("data:image/png;base64,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");

    //Add a svg image passing the content of image
    report.addImage('data:image/svg;utf8,<svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="337px" height="82px" viewBox="0 0 337 82" xml:space="preserve"><defs></defs><path fill="#234571" d="M16.737,0c5.755,0,9.592,3.309,9.592,8.151c0,3.453-2.973,6.38-5.803,6.906c3.405,0.191,8.105,3.405,8.105,8.632c0,5.947-4.172,9.881-10.839,9.881H4.651V0H16.737z M16.209,14.1c4.412,0,7.337-2.35,7.337-5.851s-2.925-5.755-7.337-5.755H7.48v11.604L16.209,14.1L16.209,14.1z M17.648,31.078c4.556,0,8.104-2.734,8.104-7.242c0-4.221-3.836-7.29-8.393-7.29H7.48v14.532H17.648z"/><path fill="#234571" d="M59.56,24.076H39.514l-4.844,9.495h-3.069L48.77,0.001h1.535l17.169,33.57h-3.069L59.56,24.076z M58.218,21.438L49.873,4.989l-0.336-0.863l-0.335,0.863l-8.345,16.448L58.218,21.438L58.218,21.438z"/><path fill="#234571" d="M100.178,0v33.568H97.54L76.678,5.801l-0.671-1.007l0.096,1.391v27.387h-2.83V0.001h2.638l20.91,27.672l0.624,1.055l-0.096-1.438V0H100.178z"/><path fill="#234571" d="M132.833,24.076h-20.047l-4.844,9.495h-3.069l17.169-33.57h1.535l17.168,33.57h-3.068L132.833,24.076z M131.492,21.438L123.145,4.99l-0.336-0.863l-0.334,0.863l-8.346,16.448H131.492z"/><path fill="#234571" d="M173.452,0v33.568h-2.638L149.954,5.8l-0.672-1.007l0.096,1.391v27.387h-2.83V0.001h2.64l20.91,27.672l0.623,1.055l-0.097-1.438V0H173.452z"/><path fill="#234571" d="M206.105,24.076h-20.047l-4.844,9.495h-3.068l17.168-33.57h1.535l17.17,33.57h-3.067L206.105,24.076z M204.762,21.438L196.416,4.99l-0.336-0.863l-0.336,0.863L187.4,21.438H204.762z"/><path fill="#234571" d="M26.376,75.723H10.934l-1.966,4.316H0l15.826-33.57h5.659l15.826,33.57h-8.968L26.376,75.723z M22.972,68.193l-3.837-8.486l-0.479-1.344l-0.479,1.344l-3.837,8.486H22.972z"/><path fill="#234571" d="M61.334,56.875c-1.535-1.918-4.412-3.117-7.05-3.117c-5.563,0-9.016,3.98-9.016,9.496c0,5.803,3.789,9.398,9.016,9.398c3.213,0,6.283-1.633,7.673-3.934l8.153,2.109c-2.781,5.945-8.776,9.88-15.826,9.88c-9.64,0-17.409-7.338-17.409-17.457s7.769-17.457,17.409-17.457c6.618,0,12.277,3.55,15.251,8.92L61.334,56.875z"/><path fill="#234571" d="M97.012,56.875c-1.535-1.918-4.412-3.117-7.05-3.117c-5.563,0-9.016,3.98-9.016,9.496c0,5.803,3.789,9.398,9.016,9.398c3.213,0,6.283-1.633,7.673-3.934l8.153,2.109c-2.781,5.945-8.776,9.88-15.826,9.88c-9.64,0-17.409-7.338-17.409-17.457s7.769-17.457,17.409-17.457c6.618,0,12.277,3.55,15.251,8.92L97.012,56.875z"/><path fill="#234571" d="M125.64,45.797c9.642,0,17.457,7.338,17.457,17.457s-7.815,17.457-17.457,17.457c-9.64,0-17.409-7.338-17.409-17.457S116,45.797,125.64,45.797z M125.64,72.749c5.467,0,9.064-3.884,9.064-9.495c0-5.658-3.598-9.496-9.064-9.496c-5.418,0-9.016,3.838-9.016,9.496C116.623,68.865,120.22,72.749,125.64,72.749z"/><path fill="#234571" d="M178.102,46.469v18.655c0,10.069-6.232,15.587-15.104,15.587c-8.922,0-15.106-5.518-15.106-15.587V46.469h8.057v18.943c0,4.796,2.637,7.77,7.051,7.77c4.412,0,7.049-2.974,7.049-7.77V46.469H178.102z"/><path fill="#234571" d="M214.645,46.469v33.57h-7.58l-13.905-17.938l-0.671-1.248l0.097,1.248v17.938h-8.06v-33.57h7.576l13.908,17.696l0.672,1.247l-0.098-1.247V46.469H214.645z"/><path fill="#234571" d="M247.204,46.469v7.529h-10.218v26.041h-8.059v-26.04h-10.068v-7.53H247.204L247.204,46.469z"/><path fill="#234571" d="M251.418,80.04V46.469h8.061v33.57L251.418,80.04L251.418,80.04z"/><path fill="#234571" d="M297.077,46.469v33.57h-7.578L275.59,62.102l-0.67-1.248l0.096,1.248v17.938h-8.057v-33.57h7.576l13.908,17.696l0.672,1.247l-0.098-1.247V46.469H297.077z"/><path fill="#234571" d="M329.008,77.307c-1.965,2.109-5.317,3.404-9.106,3.404c-9.644,0-17.408-7.338-17.408-17.457s7.77-17.457,17.408-17.457c6.52,0,12.229,3.453,15.25,8.92l-8.199,2.158c-1.584-1.918-4.412-3.117-7.051-3.117c-5.562,0-9.021,3.98-9.021,9.496c0,5.896,3.98,9.592,9.496,9.592c5.371,0,7.725-2.781,8.684-5.273v-0.051h-8.823v-6.474h15.682v18.991h-6.906v-2.732H329.008L329.008,77.307z"/></svg>');

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    stylesheet.addStyle("img", "margin-bottom:4em");
    Banana.Report.preview(report, stylesheet);

}






/** 
    File:        tutorial1.ac2
    Id:          204
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
    Id:          205
    Description: Add attachments
*/
//@description="Attachments"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    //Create the report
    var report = Banana.Report.newReport('Report attachments');

    //Add a paragraph with some text
    report.addParagraph('Report with attachments');

    //Attach text files created on the fly
    //We use the prefix 'data:...' to tell that the string is not an url but is itself the content of the file
    report.addAttachment('text file 1.txt', 'data:text/plain;utf8,This is the content of the text file 1.');
    report.addAttachment('text file 2.txt', 'data:text/plain;utf8,This is the content of the text file 2.');
    report.addAttachment('text file 3.txt', 'data:text/plain;utf8,This is the content of the text file 3.');

    //Attach an image stored in the document table
    //We use the prefix 'document:...'
    report.addAttachment('logo.jpg', 'documents:logo');

    //Add an xml element
    //We just add the new created Banana.Xml.newDocument
    var xmlDocument = Banana.Xml.newDocument("eCH-0217:VATDeclaration");
    var rootNode = xmlDocument.addElement("eCH-0217:VATDeclaration");
    rootNode.addElement("title").addTextNode("Vat Declaration 2018");
    report.addAttachment('vat_declaration.xml', xmlDocument);

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);
}







/** 
    File:        tutorial1.ac2
    Id:          206
    Description: Print multiple reports
*/
//@description="Multiple reports"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
	var docs = [];
	var styles = [];
	
	// Report
	for (var i = 0; i < 10; i++) {
		var report = Banana.Report.newReport("Report title");
		report.addParagraph("Hello World #" + i + " !!!", "styleHelloWorld");
		report.setTitle("Document " + i);
		report.getFooter().addFieldPageNr();
		docs.push(report);

		// Styles
		var stylesheet = Banana.Report.newStyleSheet();
		var style = stylesheet.addStyle(".styleHelloWorld");
		style.setAttribute("font-size", "24pt");
		style.setAttribute("text-align", "center");
		style.setAttribute("margin-top", "10mm");
		var style2 = stylesheet.addStyle("@page");
		style2.setAttribute("size", "landscape");
		styles.push(stylesheet);
	}

	// Print preview of 10 documents together
	Banana.Report.preview("Multi documents printing example", docs, styles);
}







/** 
    File:        tutorial1.ac2
    Id:          210
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
    Id:          211
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
    Id:          212
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
    Id:          213
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
    Id:          220
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
    Id:          221
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
    Id:          222
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
    Id:          223
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
    Id:          224
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
    Id:          225
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
    Id:          300
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
    Id:          301
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
    Id:          302
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
    Id:          310
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
    Id:          311
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
    Id:          312
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
    Id:          313
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
    Id:          314
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
    Id:          315
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
    Id:          320
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
    Id:          321
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
    Id:          322
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
    Id:          323
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
    Id:          324
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
    Id:          325
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
    Id:          330
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
    Id:          331
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
    Id:          332
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
    Id:          400
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
    Id:          500
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
    Id:          501
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
    Id:          510
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
    Id:          511
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
    Id:          512
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
    Id:          513
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
    Id:          514
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
    Id:          515
    Description: Find all rows that match a condition using findRows
*/
//@description="Find all rows that match a condition using findRows"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    var tableAccounts = Banana.document.table('Accounts');
    var rows = tableAccounts.findRows(accountStartsWith25XX);
    var accounts = [];
    for(var i = 0; i < rows.length; i++) {
       accounts.push(rows[i].value('Account'));
    }
    Banana.Ui.showInformation('Info', 'Accounts that start with 25XX: ' + accounts.join(';')); 
}

function accountStartsWith25XX(rowObj,rowNr,table) {
   // Return true if account start with '25XX'
   return rowObj.value('Account').startsWith('25');
}






/** 
    File:        tutorial1.ac2
    Id:          516
    Description: Show all rows that match a condition using extractRows
*/
//@description="Show all rows that match a condition using extractRows"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {
    var tableAccounts = Banana.document.table('Accounts');
    tableAccounts.extractRows(accountStartsWith25XX, 'Accounts that start with 25XX');
}

function accountStartsWith25XX(rowObj,rowNr,table) {
   // Return true if account start with '25XX'
   return rowObj.value('Account').startsWith('25');
}






/** 
    File:        tutorial1.ac2
    Id:          600
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
    Id:          601
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
    Id:          602
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
    Id:          603
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
    Id:          604
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
    Id:          605
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
    Id:          610
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
    Id:          611
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
    Id:          620
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
    Id:          621
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
    Id:          630
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






/** 
    File:        tutorial1.ac2
    Id:          700
    Description: Reading an xml file
*/
//@description="Read an xml file"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {

   // The xml file
   var xml = '<Library updated="2018-09-03"> \
		<Book> \
			<Title>Paths of colours</Title> \
			<Author>Rosa Indaco</Author> \
		</Book> \
		<Book> \
			<Title>Accounting exercises</Title> \
			<Author>Su Zhang</Author> \
		</Book> \
   </Library>';

    // Parse the xml and extract the books in the library
	var bookList = "";
	var xmlFile = Banana.Xml.parse(xml); 
	var xmlRoot = xmlFile.firstChildElement('Library'); 
	var updateDate = xmlRoot.attribute('updated');
   bookList += "Books in the library on " + updateDate + "\n\n";
	var bookNode = xmlRoot.firstChildElement('Book');  // First book
	while (bookNode) { 
		// For each book in the library
		var title = bookNode.firstChildElement('Title').text;
		var authorNode = bookNode.firstChildElement('Author'); 
		var author = authorNode ? authorNode.text : 'unknow';
       bookList += title + " - " + author + "\n";
		bookNode = bookNode.nextSiblingElement('Book');  // Next book
	} 

	// Show the list of books
   Banana.Ui.showText("List of books present in the xml file", bookList);
}






/** 
    File:        tutorial1.ac2
    Id:          701
    Description: Writing an xml file
*/
//@description="Write an xml file"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {

   // Create document
   var xmlDocument = Banana.Xml.newDocument("Library");
   xmlDocument.addComment("This is the generated xml file");
   var rootNode = xmlDocument.addElement("Library");
   rootNode.setAttribute("updated", "2018-09-03");
  
   var bookNode = rootNode.addElement("Book");
   bookNode.addElement("Title").addTextNode("Paths of colours");
   bookNode.addElement("Author").addTextNode("Rosa Indaco");

   var bookNode = rootNode.addElement("Book");
   bookNode.addElement("Title").addTextNode("Accounting exercises");
   bookNode.addElement("Author").addTextNode("Su Zhang");
   
   var xmlString = Banana.Xml.save(xmlDocument);

	// Show the xml file
   Banana.Ui.showText("Xml file", xmlString);
}






/** 
    File:        tutorial1.ac2
    Id:          702
    Description: Validating an xml file via xsd
*/
//@description="Validatind an xml file"
//@inputdatasource = none
//@task=app.command
//@timeout = -1
function exec() {

   // The xml file
   var xml = '<Library updated="2018-09-03"> \
		<Book> \
			<Title>Paths of colours</Title> \
			<Author>Rosa Indaco</Author> \
		</Book> \
		<Book> \
			<Title>Accounting exercises</Title> \
			<Author>Su Zhang</Author> \
		</Book> \
   </Library>';

    // Parse the xml
	var xmlFile = Banana.Xml.parse(xml); 

   // Validate the xml
   var valid = Banana.Xml.validate(xmlFile, 'documents:xsd');
   if (valid) {
      Banana.Ui.showInformation('Validation result', 'The xml is valid');
   } else  {
      Banana.Ui.showInformation('Validation result', 'The xml is not valid: ' + Banana.Xml.errorString);
   }
}






/** 
    File:        tutorial1.ac2
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







/** 
    File:        tutorial1.ac2
    Id:          xml
    Description: xml file
*/
<Library updated="2016-10-31">
   <Book>
      <Title>Paths of colours</Title>
      <Author>Rosa Indaco</Author>
   </Book>
   <Book>
      <Title>Accounting exercises</Title>
      <Author>Su Zhang</Author>
   </Book>
</Library>






/** 
    File:        tutorial1.ac2
    Id:          xsd
    Description: xsd file
*/
<?xml version="1.0" encoding="UTF-8" ?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"> 
  <!-- definition of simple elements -->
     <xs:element name="Title" type="xs:string"/>
     <xs:element name="Author" type="xs:string"/>

   <!-- definition of attributes -->
   <xs:attribute name="updated" type="xs:string"/>

   <!-- definition of complex elements -->
   <xs:element name="Book">
       <xs:complexType>
          <xs:sequence>
             <xs:element ref="Title"/>
             <xs:element ref="Author"/>
          </xs:sequence>
       </xs:complexType>
    </xs:element>

    <xs:element name="Library">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="Book" maxOccurs="unbounded"/>
            </xs:sequence>
           <xs:attribute ref="updated" use="required"/>
       </xs:complexType>
    </xs:element>

</xs:schema>






/** 
    File:        tutorial1.ac2
    Id:          800
    Description: Export tutorial1 javascript codes
*/
// @id = ch.banana.apps.exportjavascriptcodestutorial1.js
// @api = 1.0
// @publisher = Banana.ch SA
// @description = Export javascript codes of the Tutorial 1 examples
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






