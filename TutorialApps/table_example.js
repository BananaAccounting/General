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


// @id = ch.banana.app.tutorialtableexample
// @api = 1.0
// @pubdate = 2018-10-23
// @publisher = Banana.ch SA
// @description = Example Table
// @description.fr = Example Table
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1



/*
*
*   For more information on "How to work with Tables" please visit our website:
*   
*   https://www.banana.ch/doc9/en/node/9284
*
*/


function exec() {

    var report = Banana.Report.newReport("Report title");
    
    var table = report.addTable("myTable");
    table.setStyleAttributes("width:100%;"); //table width

    // add the table header (columns titles)
    var tableHeader = table.getHeader();
    var tableRow = tableHeader.addRow();
    tableRow.addCell("Description", "headerStyle", 1).setStyleAttributes("border:thin solid black;"); //cell border
    tableRow.addCell("Amount", "headerStyle", 1).setStyleAttributes("border:thin solid black;");

    // add rows and cells to the table
    var tableRow = table.addRow();
    tableRow.addCell("Cash", "", 1).setStyleAttributes("border:thin solid black");
    tableRow.addCell("500.00", "alignRight", 1).setStyleAttributes("border:thin solid black;");

    var tableRow = table.addRow();
    tableRow.addCell("Bank", "", 1).setStyleAttributes("border:thin solid black");
    tableRow.addCell("1200.50", "alignRight", 1).setStyleAttributes("border:thin solid black;");



    // At the end, print the report
    var stylesheet = createStyleSheet();
    Banana.Report.preview(report, stylesheet);
}


/* Function that creates all the styles used to print the report */
function createStyleSheet() {
    var stylesheet = Banana.Report.newStyleSheet();
    
    stylesheet.addStyle("@page", "margin:20mm 10mm 10mm 20mm;") 
    stylesheet.addStyle("body", "font-family:Helvetica; font-size:12pt");

    // style for table header
    stylesheet.addStyle(".headerStyle", "background-color:#E0EFF6; text-align:center; font-weight:bold;");
    
    // other styles
    stylesheet.addStyle(".alignRight", "text-align:right;");
    stylesheet.addStyle(".alignCenter", "text-align:center;");

    return stylesheet;
}
