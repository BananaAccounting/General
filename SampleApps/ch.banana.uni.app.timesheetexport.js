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
// @pubdate = 2019-11-06
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
	- Choose the columns to include in the report (only for 9.0.4 and higher versions).
	- Copy to clipboard.
	- Paste in excel.
*/


function exec() {
	if (!Banana.document) {
		return;
	}
	var userParam = initUserParam();
	// Columns choice only for 9.0.4 and higher
	// For previous versions we take all columns
	var isCurrentBananaVersionSupported = bananaRequiredVersion("9.0.4");
	if (isCurrentBananaVersionSupported) {
		// Retrieve saved param
		var savedParam = Banana.document.getScriptSettings();
		if (savedParam && savedParam.length > 0) {
		 userParam = JSON.parse(savedParam);
		}
		// If needed show the settings dialog to the user
		if (!options || !options.useLastSettings) {
		 userParam = settingsDialog(); // From properties
		}
		if (!userParam) {
		 return "@Cancel";
		}
	}
	var report = printTimeSheetJournal(userParam);
	var stylesheet = createStyleSheet();
	Banana.Report.preview(report, stylesheet);
}

function printTimeSheetJournal(userParam) {
	var report = Banana.Report.newReport('Timesheet Journal Table');
	var table = report.addTable("table01");
	tableRow = table.addRow();
	
	/* Columns titles */
	if (userParam.print_date) {
		tableRow.addCell('Date','header',1);
		tableRow.addCell('Day','header',1);
		tableRow.addCell('Month-Year','header',1);
		tableRow.addCell('Quarter','header',1);
	}
	if (userParam.print_timeDayType) {
	   tableRow.addCell('TimeDayType', 'header', 1);
	}
	if (userParam.print_timeDayDescription) {
	   tableRow.addCell('TimeDayDescription', 'header', 1);
	}
	if (userParam.print_description) {
	   tableRow.addCell('Description', 'header', 1);
	}
	if (userParam.print_code1) {
	   tableRow.addCell('Code1', 'header', 1);
	}
	if (userParam.print_notes) {
	   tableRow.addCell('Notes', 'header', 1);
	}
	if (userParam.print_timeWork1) {
	   tableRow.addCell('TimeWork1', 'header', 1);
	}
	if (userParam.print_timeWork2) {
	   tableRow.addCell('TimeWork2', 'header', 1);
	}
	if (userParam.print_timeStart1) {
	   tableRow.addCell('TimeStart1', 'header', 1);
	}
	if (userParam.print_timeStop1) {
	   tableRow.addCell('TimeStop1', 'header', 1);
	}
	if (userParam.print_timeStart2) {
	   tableRow.addCell('TimeStart2', 'header', 1);
	}
	if (userParam.print_timeStop2) {
	   tableRow.addCell('TimeStop2', 'header', 1);
	}
	if (userParam.print_timeStart3) {
	   tableRow.addCell('TimeStart3', 'header', 1);
	}
	if (userParam.print_timeStop3) {
	   tableRow.addCell('TimeStop3', 'header', 1);
	}
	if (userParam.print_timeStart4) {
	   tableRow.addCell('TimeStart4', 'header', 1);
	}
	if (userParam.print_timeStop4) {
	   tableRow.addCell('TimeStop4', 'header', 1);
	}
	if (userParam.print_timeStart5) {
	   tableRow.addCell('TimeStart5', 'header', 1);
	}
	if (userParam.print_timeStop5) {
	   tableRow.addCell('TimeStop5', 'header', 1);
	}
	if (userParam.print_timeWorkedTotal) {
	   tableRow.addCell('TimeWorkedTotal', 'header', 1);
	}
	if (userParam.print_timeAbsenceSick) {
	   tableRow.addCell('TimeAbsenceSick', 'header', 1);
	}
	if (userParam.print_timeAbsenceHoliday) {
	   tableRow.addCell('TimeAbsenceHoliday', 'header', 1);
	}
	if (userParam.print_timeAbsenceService) {
	   tableRow.addCell('TimeAbsenceService', 'header', 1);
	}
	if (userParam.print_timeAbsenceOther) {
	   tableRow.addCell('TimeAbsenceOther', 'header', 1);
	}
	if (userParam.print_timeAbsenceTotal) {
	   tableRow.addCell('TimeAbsenceTotal', 'header', 1);
	}
	if (userParam.print_timeAdjustment) {
	   tableRow.addCell('TimeAdjustment', 'header', 1);
	}
	if (userParam.print_timeDayTotal) {
	   tableRow.addCell('TimeDayTotal', 'header', 1);
	}
	if (userParam.print_timeDueCode) {
	   tableRow.addCell('TimeDueCode', 'header', 1);
	}
	if (userParam.print_timeDueDay) {
	   tableRow.addCell('TimeDueDay', 'header', 1);
	}
	if (userParam.print_timeDifference) {
	   tableRow.addCell('TimeDifference', 'header', 1);
	}
	if (userParam.print_timeProgressive) {
	   tableRow.addCell('TimeProgressive', 'header', 1);
	}
	if (userParam.print_timeSplit1) {
	   tableRow.addCell('TimeSplit1', 'header', 1);
	}
	if (userParam.print_timeSplit2) {
	   tableRow.addCell('TimeSplit2', 'header', 1);
	}
	if (userParam.print_km) {
	   tableRow.addCell('Km', 'header', 1);
	}

	/* Get the rows values */
	var journalTable = Banana.document.table("Journal");
	for (var j = 0; j < journalTable.rowCount; j++) {
		var tRow = journalTable.row(j);
		if (!tRow.value('Section') && tRow.value('Date')) { // do not take system rows (carry forward, start, total, balance)
			tableRow = table.addRow();
			if (userParam.print_date) {
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
			}
			if (userParam.print_timeDayType) {
				tableRow.addCell(tRow.value('TimeDayType'), '', 1);
			}
			if (userParam.print_timeDayDescription) {
				tableRow.addCell(tRow.value('TimeDayDescription'), '', 1);
			}
			if (userParam.print_description) {
				tableRow.addCell(tRow.value('Description'), '', 1);
			}
			if (userParam.print_code1) {
				tableRow.addCell(tRow.value('Code1'), '', 1);
			}
			if (userParam.print_notes) {
				tableRow.addCell(tRow.value('Notes'), '', 1);
			}
			if (userParam.print_timeWork1) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeWork1')), '', 1); //time counter
			}
			if (userParam.print_timeWork2) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeWork2')), '', 1); //time counter
			}
			if (userParam.print_timeStart1) {
				tableRow.addCell(tRow.value('TimeStart1'), '', 1);
			}
			if (userParam.print_timeStop1) {
				tableRow.addCell(tRow.value('TimeStop1'), '', 1);
			}
			if (userParam.print_timeStart2) {
				tableRow.addCell(tRow.value('TimeStart2'), '', 1);
			}
			if (userParam.print_timeStop2) {
				tableRow.addCell(tRow.value('TimeStop2'), '', 1);
			}
			if (userParam.print_timeStart3) {
				tableRow.addCell(tRow.value('TimeStart3'), '', 1);
			}
			if (userParam.print_timeStop3) {
				tableRow.addCell(tRow.value('TimeStop3'), '', 1);
			}
			if (userParam.print_timeStart4) {
				tableRow.addCell(tRow.value('TimeStart4'), '', 1);
			}
			if (userParam.print_timeStop4) {
				tableRow.addCell(tRow.value('TimeStop4'), '', 1);
			}
			if (userParam.print_timeStart5) {
				tableRow.addCell(tRow.value('TimeStart5'), '', 1);
			}
			if (userParam.print_timeStop5) {
				tableRow.addCell(tRow.value('TimeStop5'), '', 1);
			}
			if (userParam.print_timeWorkedTotal) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeWorkedTotal')), '', 1); //time counter
			}
			if (userParam.print_timeAbsenceSick) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeAbsenceSick')), '', 1); //time counter
			}
			if (userParam.print_timeAbsenceHoliday) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeAbsenceHoliday')), '', 1); //time counter
			}
			if (userParam.print_timeAbsenceService) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeAbsenceService')), '', 1); //time counter
			}
			if (userParam.print_timeAbsenceOther) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeAbsenceOther')), '', 1); //time counter
			}
			if (userParam.print_timeAbsenceTotal) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeAbsenceTotal')), '', 1); //time counter
			}
			if (userParam.print_timeAdjustment) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeAdjustment')), '', 1); //time counter
			}
			if (userParam.print_timeDayTotal) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeDayTotal')), '', 1); //time counter
			}
			if (userParam.print_timeDueCode) {
				tableRow.addCell(tRow.value('TimeDueCode'), '', 1);
			}
			if (userParam.print_timeDueDay) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeDueDay')), '', 1); //time counter
			}
			if (userParam.print_timeDifference) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeDifference')), '', 1); //time counter
			}
			if (userParam.print_timeProgressive) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeProgressive')), '', 1); //time counter
			}
			if (userParam.print_timeSplit1) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeSplit1')), '', 1); //time counter
			}
			if (userParam.print_timeSplit2) {
				tableRow.addCell(convertToHourDecimals(tRow.value('TimeSplit2')), '', 1); //time counter
			}
			if (userParam.print_km) {
				tableRow.addCell(tRow.value('Km'), '', 1);
			}
		}
	}
	return report;
}


/***********************
* UTILITIES 
***********************/
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

function bananaRequiredVersion(requiredVersion) {
	if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) < 0) {
		return false;
	}
	return true;
}

/***********************
* MANAGE USER PARAMETERS 
***********************/
function convertParam(userParam) {

    var convertedParam = {};
    convertedParam.version = '1.0';
    convertedParam.data = [];

    var currentParam = {};
    currentParam.name = 'include_column';
    currentParam.title = 'Columns to include:';
    currentParam.type = 'string';
    currentParam.value = '';
    currentParam.editable = false;
    currentParam.readValue = function() {
        userParam.header = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.name = 'print_date';
    currentParam.parentObject = 'include_column';
    currentParam.title = 'Date';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_date ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_date = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeDayType';
    currentParam.title = 'TimeDayType';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeDayType ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeDayType = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeDayDescription';
    currentParam.title = 'TimeDayDescription';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeDayDescription ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeDayDescription = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_description';
    currentParam.title = 'Description';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_description ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_description = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_code1';
    currentParam.title = 'Code1';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_code1 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_code1 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_notes';
    currentParam.title = 'Notes';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_notes ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_notes = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeWork1';
    currentParam.title = 'TimeWork1';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeWork1 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeWork1 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeWork2';
    currentParam.title = 'TimeWork2';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeWork2 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeWork2 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeStart1';
    currentParam.title = 'TimeStart1';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeStart1 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeStart1 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeStop1';
    currentParam.title = 'TimeStop1';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeStop1 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeStop1 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeStart2';
    currentParam.title = 'TimeStart2';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeStart2 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeStart2 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeStop2';
    currentParam.title = 'TimeStop2';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeStop2 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeStop2 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeStart3';
    currentParam.title = 'TimeStart3';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeStart3 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeStart3 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeStop3';
    currentParam.title = 'TimeStop3';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeStop3 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeStop3 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeStart4';
    currentParam.title = 'TimeStart4';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeStart4 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeStart4 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeStop4';
    currentParam.title = 'TimeStop4';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeStop4 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeStop4 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeStart5';
    currentParam.title = 'TimeStart5';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeStart5 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeStart5 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeStop5';
    currentParam.title = 'TimeStop5';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeStop5 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeStop5 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeWorkedTotal';
    currentParam.title = 'TimeWorkedTotal';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeWorkedTotal ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeWorkedTotal = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeAbsenceSick';
    currentParam.title = 'TimeAbsenceSick';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeAbsenceSick ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeAbsenceSick = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeAbsenceHoliday';
    currentParam.title = 'TimeAbsenceHoliday';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeAbsenceHoliday ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeAbsenceHoliday = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeAbsenceService';
    currentParam.title = 'TimeAbsenceService';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeAbsenceService ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeAbsenceService = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeAbsenceOther';
    currentParam.title = 'TimeAbsenceOther';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeAbsenceOther ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeAbsenceOther = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeAbsenceTotal';
    currentParam.title = 'TimeAbsenceTotal';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeAbsenceTotal ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeAbsenceTotal = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeAdjustment';
    currentParam.title = 'TimeAdjustment';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeAdjustment ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeAdjustment = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeDayTotal';
    currentParam.title = 'TimeDayTotal';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeDayTotal ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeDayTotal = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeDueCode';
    currentParam.title = 'TimeDueCode';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeDueCode ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeDueCode = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeDueDay';
    currentParam.title = 'TimeDueDay';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeDueDay ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeDueDay = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeDifference';
    currentParam.title = 'TimeDifference';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeDifference ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeDifference = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeProgressive';
    currentParam.title = 'TimeProgressive';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeProgressive ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeProgressive = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeSplit1';
    currentParam.title = 'TimeSplit1';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeSplit1 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeSplit1 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_timeSplit2';
    currentParam.title = 'TimeSplit2';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_timeSplit2 ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_timeSplit2 = this.value;
    }
    convertedParam.data.push(currentParam);

    var currentParam = {};
    currentParam.parentObject = 'include_column';
    currentParam.name = 'print_km';
    currentParam.title = 'Km';
    currentParam.type = 'bool';
    currentParam.value = userParam.print_km ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
        userParam.print_km = this.value;
    }
    convertedParam.data.push(currentParam);

    return convertedParam;
}

function initUserParam() {
    var userParam = {};
	userParam.print_date = true;
	userParam.print_timeDayType = true;
	userParam.print_timeDayDescription = true;
	userParam.print_description = true;
	userParam.print_code1 = true;
	userParam.print_notes = true;
	userParam.print_timeWork1 = true;
	userParam.print_timeWork2 = true;
	userParam.print_timeStart1 = true;
	userParam.print_timeStop1 = true;
	userParam.print_timeStart2 = true;
	userParam.print_timeStop2 = true;
	userParam.print_timeStart3 = true;
	userParam.print_timeStop3 = true;
	userParam.print_timeStart4 = true;
	userParam.print_timeStop4 = true;
	userParam.print_timeStart5 = true;
	userParam.print_timeStop5 = true;
	userParam.print_timeWorkedTotal = true;
	userParam.print_timeAbsenceSick = true;
	userParam.print_timeAbsenceHoliday = true;
	userParam.print_timeAbsenceService = true;
	userParam.print_timeAbsenceOther = true;
	userParam.print_timeAbsenceTotal = true;
	userParam.print_timeAdjustment = true;
	userParam.print_timeDayTotal = true;
	userParam.print_timeDueCode = true;
	userParam.print_timeDueDay = true;
	userParam.print_timeDifference = true;
	userParam.print_timeProgressive = true;
	userParam.print_timeSplit1 = true;
	userParam.print_timeSplit2 = true;
	userParam.print_km = true;
    return userParam;
}

function parametersDialog(userParam) {

    if (typeof(Banana.Ui.openPropertyEditor) !== 'undefined') {
        var dialogTitle = "Settings";
        var convertedParam = convertParam(userParam);
        var pageAnchor = 'dlgSettings';
        if (!Banana.Ui.openPropertyEditor(dialogTitle, convertedParam, pageAnchor)) {
            return null;
        }
        
        for (var i = 0; i < convertedParam.data.length; i++) {
            // Read values to userParam (through the readValue function)
            convertedParam.data[i].readValue();
        }
        
        //  Reset reset default values
        userParam.useDefaultTexts = false;
    }
    
    return userParam;
}

function settingsDialog() {
    
    var scriptform = initUserParam();

    // Retrieve saved param
    var savedParam = Banana.document.getScriptSettings();
    if (savedParam && savedParam.length > 0) {
        scriptform = JSON.parse(savedParam);
    }

    scriptform = parametersDialog(scriptform); // From propertiess
    if (scriptform) {
        var paramToString = JSON.stringify(scriptform);
        Banana.document.setScriptSettings(paramToString);
    }
    
    return scriptform;
}


/***********************
* STYLES
***********************/
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

