// Copyright [2019] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.uni.app.timesheetexport.js
// @api = 1.0
// @pubdate = 2019-11-05
// @publisher = Banana.ch SA
// @description = Timesheet Export
// @task = app.command
// @doctype = 400.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1



/* 
	Export the timesheet Journal table to use it in excel with the pivot tables.
	- Create the report with the Journal table of the Timesheet.
	- Copy to clipboard and paste in excel.
	- Remove the columns not needed.
	- Use the pivot function.
*/

function exec() {
	if (!Banana.document) {
		return;
	}
	var report = printTimeSheetJournal();
	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);
}

function printTimeSheetJournal() {
	var report = Banana.Report.newReport('Timesheet Journal Table');
	var table = report.addTable("table01");
	tableRow = table.addRow();
	
	/* Columns titles */
	//tableRow.addCell('Section','header',1);
	tableRow.addCell('Date','header',1);
	tableRow.addCell('Day','header',1);
	tableRow.addCell('Month-Year','header',1);
	tableRow.addCell('Quarter','header',1);
	tableRow.addCell('TimeDayType','header',1);
	tableRow.addCell('TimeDayDescription','header',1);
	tableRow.addCell('Description','header',1);
	tableRow.addCell('Code1','header',1);
	tableRow.addCell('Notes','header',1);
	tableRow.addCell('TimeWork1','header',1);
	tableRow.addCell('TimeWork2','header',1);
	tableRow.addCell('TimeStart1','header',1);
	tableRow.addCell('TimeStop1','header',1);
	tableRow.addCell('TimeStart2','header',1);
	tableRow.addCell('TimeStop2','header',1);
	tableRow.addCell('TimeStart3','header',1);
	tableRow.addCell('TimeStop3','header',1);
	tableRow.addCell('TimeStart4','header',1);
	tableRow.addCell('TimeStop4','header',1);
	tableRow.addCell('TimeStart5','header',1);
	tableRow.addCell('TimeStop5','header',1);
	tableRow.addCell('TimeWorkedTotal','header',1);
	tableRow.addCell('TimeAbsenceSick','header',1);
	tableRow.addCell('TimeAbsenceHoliday','header',1);
	tableRow.addCell('TimeAbsenceService','header',1);
	tableRow.addCell('TimeAbsenceOther','header',1);
	tableRow.addCell('TimeAbsenceTotal','header',1);
	tableRow.addCell('TimeAdjustment','header',1);
	tableRow.addCell('TimeDayTotal','header',1);
	tableRow.addCell('TimeDueCode','header',1);
	tableRow.addCell('TimeDueDay','header',1);
	tableRow.addCell('TimeDifference','header',1);
	tableRow.addCell('TimeProgressive','header',1);
	tableRow.addCell('TimeSplit1','header',1);
	tableRow.addCell('TimeSplit2','header',1);
	tableRow.addCell('Km','header',1);

	/* Get the rows values */
	var journalTable = Banana.document.table("Journal");
	for (var j = 0; j < journalTable.rowCount; j++) {
		var tRow = journalTable.row(j);
		if (!tRow.value('Section')) { // do not take system rows (carry forward, start, total, balance)
			tableRow = table.addRow();
			//tableRow.addCell(tRow.value('Section'), '', 1);
			tableRow.addCell(tRow.value('Date'), '', 1);
			if (tRow.value('Date')) {
				var date = Banana.Converter.toDate(tRow.value('Date'));
				var day = date.getDate();
				var month = date.getMonth()+1;
				var monthText = getMonthText(month);
				var quarter = getQuarter(month);
				var year = date.getFullYear();
				//Banana.console.log(day + "; " + month + "; " + monthText + "; " + year + "; " + quarter);
				tableRow.addCell(day,'',1);
				tableRow.addCell(monthText+'_'+year,'',1);
				tableRow.addCell(quarter+'_'+year,'',1);
			} else {
				tableRow.addCell('','',1);
				tableRow.addCell('','',1);
				tableRow.addCell('','',1);
			}

			tableRow.addCell(tRow.value('TimeDayType'), '', 1);
			tableRow.addCell(tRow.value('TimeDayDescription'), '', 1);
			tableRow.addCell(tRow.value('Description'), '', 1);
			tableRow.addCell(tRow.value('Code1'), '', 1);
			tableRow.addCell(tRow.value('Notes'), '', 1);
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeWork1')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeWork2')), '', 1); //time counter
			tableRow.addCell(tRow.value('TimeStart1'), '', 1);
			tableRow.addCell(tRow.value('TimeStop1'), '', 1);
			tableRow.addCell(tRow.value('TimeStart2'), '', 1);
			tableRow.addCell(tRow.value('TimeStop2'), '', 1);
			tableRow.addCell(tRow.value('TimeStart3'), '', 1);
			tableRow.addCell(tRow.value('TimeStop3'), '', 1);
			tableRow.addCell(tRow.value('TimeStart4'), '', 1);
			tableRow.addCell(tRow.value('TimeStop4'), '', 1);
			tableRow.addCell(tRow.value('TimeStart5'), '', 1);
			tableRow.addCell(tRow.value('TimeStop5'), '', 1);
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeWorkedTotal')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeAbsenceSick')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeAbsenceHoliday')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeAbsenceService')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeAbsenceOther')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeAbsenceTotal')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeAdjustment')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeDayTotal')), '', 1); //time counter
			tableRow.addCell(tRow.value('TimeDueCode'), '', 1);
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeDueDay')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeDifference')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeProgressive')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeSplit1')), '', 1); //time counter
			tableRow.addCell(convertToHourDecimals(tRow.value('TimeSplit2')), '', 1); //time counter
			tableRow.addCell(tRow.value('Km'), '', 1);
		}
	}
	return report;
}

function convertToHourDecimals(seconds) {
	if (seconds) {
		return Banana.SDecimal.divide(seconds,3600);
	}
}

function getMonthText(month) {
    var monthText = "";
    switch (month) {
        case 1:
            monthText = "jan";
            break;
        case 2:
            monthText = "feb";
            break;
        case 3:
            monthText = "mar";
            break;
        case 4:
            monthText = "apr";
            break;
        case 5:
            monthText = "may";
            break;
        case 6:
            monthText = "jun";
            break;
        case 7:
            monthText = "jul";
            break;
        case 8:
            monthText = "aug";
            break;
        case 9:
            monthText = "sep";
            break;
        case 10:
            monthText = "oct";
            break;
        case 11:
            monthText = "nov";
            break;
        case 12:
            monthText = "dec";
    }
    return monthText;
}

function getQuarter(month) {
    var quarter = "";
    switch (month) {
        case 1:
        case 2:
        case 3:
            quarter = "q1";
            break;
        case 4:
        case 5:
        case 6:
            quarter = "q2";
            break;
        case 7:
        case 8:
        case 9:
            quarter = "q3";
            break;
        case 10:
        case 11:
        case 12:
            quarter = "q4";
    }
    return quarter;
}

function createStyleSheet(userParam) {
    var stylesheet = Banana.Report.newStyleSheet();
    
    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 10mm 10mm 10mm");
    pageStyle.setAttribute("size", "landscape");

    stylesheet.addStyle("body", "font-size: 7pt; font-family: Helvetica");
    stylesheet.addStyle(".bold", "font-weight:bold");
    stylesheet.addStyle(".right", "text-align:right");
    stylesheet.addStyle(".center", "text-align:center");
    stylesheet.addStyle(".header", "background-color:#F0F8FF");

    var tableStyle = stylesheet.addStyle(".table01");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle("table.table01 td", "border:thin solid black;");

    return stylesheet;
}

