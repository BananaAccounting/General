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
//
// @id = ch.banana.addon.segments
// @api = 1.0
// @pubdate = 2015-10-28
// @publisher = Banana.ch SA
// @description = Segments report
// @task = app.command
// @doctype = 100.*
// @outputformat = none
// @inputdatasource = none
// @timeout = -1




//Editable variable to choose the BClass used in the currentBalance() function
var BCLASS = "BClass=1|2|3|4";





var scriptVersion = "script v. 2015-10-28";

//Main function
function exec(string) {

	if (!Banana.document) {
		return;
	}

	//Function call to create the report
	var report = createReport(Banana.document);

}




//The purpose of this function is create the report containing the table with the required data
//The table will contain only the rows with an existant and non-zero end balance amount
function createReport(banDoc) {

	var report = Banana.Report.newReport("Segments");

	var segment1 = []; //Object that will contain segment 1 data
	var segment2 = []; //Object that will contain segment 2 data
	var segment3 = []; //Object that will contain segment 3 data

	//Function call to get and save all segments data
	var columnTitles = getSegmentsData(banDoc, segment1, segment2, segment3);
	

	/** TITLE SECTION */

	var year = Banana.Converter.toDate(banDoc.info("AccountingDataBase","OpeningDate")).getFullYear();
	//Add a title to the report
	report.addParagraph("Segments", "heading1");
	report.addParagraph(year, "heading3");
	report.addParagraph(" ");
	

	/** TABLE COLUMN TITLE SECTION */

	//Create the table report and column titles
	var table = report.addTable("table");
	var tableHeader = table.getHeader();
	tableRow = tableHeader.addRow();	
	
	//Add the column titles to the table
	//First column title
	var segment1TitleCell = tableRow.addCell("", "valueTitle", 1);
	segment1TitleCell.addParagraph(columnTitles[0]);
	segment1TitleCell.addParagraph("Segment level 1");

	//Second column title
	var segment2TitleCell = tableRow.addCell("", "valueTitle", 1);
	segment2TitleCell.addParagraph(columnTitles[1]);
	segment2TitleCell.addParagraph("Segment level 2");

	//Third column title
	var segment3TitleCell = tableRow.addCell("", "valueTitle", 1);
	segment3TitleCell.addParagraph(columnTitles[2]);
	segment3TitleCell.addParagraph("Segment level 3");

	//Fourth column title
	tableRow.addCell(banDoc.info("AccountingDataBase","BasicCurrency"), "valueTitle basciCurrency", 1);



	/** TABLE SEGMENTS DATA SECTION */

	var segLv1 = segment1.length;
	var segLv2 = segment2.length;
	var segLv3 = segment3.length;

	//Extract and calculate data
	//For each element of segment 1...
	for (var i = 0; i < segLv1; i++) {

		//We calculate the balance
     	var currentBalSegment1 = banDoc.currentBalance(BCLASS + segment1[i]["Account"] + ":?*:?*");
		var endBalSegment1 = currentBalSegment1.balance;

		if (endBalSegment1) {

			//If the balance exists we add segment 1 data to the table
			tableRow = table.addRow();
			tableRow.addCell(segment1[i]["Description"], "valueText", 1);
			tableRow.addCell("", "", 1);
			tableRow.addCell("", "", 1);
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(endBalSegment1), "valueAmount", 1);

			//For each element of segment 2...
			for (var j = 0; j < segLv2; j++) {

				//We calculate the balance
            	var currentBalSegment2 = banDoc.currentBalance(BCLASS + segment1[i]["Account"] + segment2[j]["Account"] + ":?*");
				var endBalSegment2 = currentBalSegment2.balance;

				if (endBalSegment2) {

					//If the balance exists we add segment 2 data to the table
					tableRow = table.addRow();
					tableRow.addCell("", "", 1);
					tableRow.addCell(segment2[j]["Description"], "valueText", 1);
					tableRow.addCell("", "", 1);
					tableRow.addCell(Banana.Converter.toLocaleNumberFormat(endBalSegment2), "valueAmount", 1);

					//For each element of segment 3
					for (var k = 0; k < segLv3; k++) {

						//We calculate the balance
                  		var currentBalSegment3 = banDoc.currentBalance(BCLASS + segment1[i]["Account"] + segment2[j]["Account"] + segment3[k]["Account"]);
						var endBalSegment3 = currentBalSegment3.balance;

						if (endBalSegment3) {

							//If the balance exists we add segment3 data to the table
							tableRow = table.addRow();
							tableRow.addCell("", "", 1);
							tableRow.addCell("", "", 1);
							tableRow.addCell(segment3[k]["Description"], "valueText", 1);
							tableRow.addCell(Banana.Converter.toLocaleNumberFormat(endBalSegment3), "valueAmount", 1);
						}
					}
				}
			}
		}
	}

	//Add a footer to the report
	addFooter(banDoc, report);

	//Create the report print
	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);

	return report;
}




//The purpose of this function is take the data (ACCOUNT-code and DESCRIPTION-text) of the three segments
//It will then be created an object for each segment in which will be stored the data
function getSegmentsData(banDoc, segment1, segment2, segment3) {

	//Access to the Banana document table "Accounts"
	var accountsTable = banDoc.table("Accounts");

	//Variable used to store the column titles
	var columnTitles = [];

	//We read row by row the table and we save only the data needed for each segment
	var accountsTableRow = accountsTable.rowCount;
	for (var i = 0; i < accountsTableRow; i++) {
		
		var tRow = accountsTable.row(i);
		var account = tRow.value("Account");
		var description = tRow.value("Description");

		//Segment 1, start with ":"
		if (account.indexOf(":") > -1) {
			if (account === ":") { //It is a title
				columnTitles.push(description);
			} else if (account.substring(1,2) !== ":" && account.substring(1,2) !== "") { //It is an account
				segment1.push({
					"Account" : account,
					"Description" : description
				});
			}
		}

		//Segment 2, start with "::"
		if (account.indexOf("::") > -1) {
			if (account === "::") { //It is a title
				columnTitles.push(description);
			} else if (account.substring(2,3) !== ":" && account.substring(2,3) !== "") { //It is an account
				segment2.push({
					"Account" : account.substring(1),
					"Description" : description
				});
			} 
		}

		//Segment 3, start with ":::"
		if (account.indexOf(":::") > -1) {
			if (account === ":::") { //It is a title
				columnTitles.push(description);
			} else if (account.substring(3,4) !== ":" && account.substring(3,4) !== "") { //It is an account
				segment3.push({
					"Account" : account.substring(2),
					"Description" : description
				});
			}
		}
	}
	return columnTitles;
}




//The purpose of this function is add a footer to the report
function addFooter(banDoc, report) {
	report.getFooter().addClass("footer");
	report.getFooter().addText("Banana Accounting, v. " + banDoc.info("Base", "ProgramVersion") + ", " + scriptVersion, "footer");
}




//The main purpose of this function is create styles for the report print
function createStyleSheet() {
	var stylesheet = Banana.Report.newStyleSheet();

    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 20mm 10mm 20mm");

	var style = "";

	style = stylesheet.addStyle(".footer");
	style.setAttribute("text-align", "right");
	style.setAttribute("font-size", "8px");
	style.setAttribute("font", "Times New Roman");

	style = stylesheet.addStyle(".heading1");
	style.setAttribute("font-size", "16px");
	style.setAttribute("font-weight", "bold");
	
	style = stylesheet.addStyle(".heading2");
	style.setAttribute("font-size", "14px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".heading3");
	style.setAttribute("font-size", "11px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".heading4");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".basciCurrency");
	style.setAttribute("text-align", "right");

	style = stylesheet.addStyle(".valueAmount");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#eeeeee"); 
	style.setAttribute("text-align", "right");

	style = stylesheet.addStyle(".valueText");
	style.setAttribute("font-size", "9px");
	style.setAttribute("padding-bottom", "5px");
	
	style = stylesheet.addStyle(".valueTitle");
	style.setAttribute("font-size", "9px");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#000000");
	style.setAttribute("color", "#fff");

	style = stylesheet.addStyle("table");
	style.setAttribute("width", "100%");
	style.setAttribute("font-size", "8px");	
	stylesheet.addStyle("table.table td", "border: thin solid black");

	return stylesheet;
}
