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
// @id = ch.banana.report.comparedailybalance
// @version = 1.0
// @pubdate = 2015-07-29
// @publisher = Banana.ch SA
// @description = Compare Balance with mt940/ISO20022 file
// @task = app.command
// @outputformat = none
// @inputdatasource = none
// @doctype = 100.*;110.*;130.*
// @timeout = -1
//
// TODO Add table budget

function exec(string) {
    // This script compare the transaction included in the file compare
    // with the transactions of the current file for the account specified

    var fileBank = Banana.application.openDocument("*.*", "", "Choose bank statement file (mt940 or ISO20022).");
    if (typeof fileBank === "undefined")
        return;
    var account = Banana.Ui.getText("Input", "Account number");
    if (typeof account === "undefined")
        return;

    // account in created cashbook file il named "AAAA"
    var accountCompare = "AAAA";
    // check if the account exists row >= 0
    var rowAccount = Banana.document.table('Accounts').findRowByValue("Account", account);
    if (typeof rowAccount === -1)
        return;

    // we want to check only date within the transactions of the 
    // find first date and last date
    var transactionsCompare = fileBank.table('Transactions');
    // keep a list of date used in transactions
    var datesUsed = {};
	// Pass every transaction and find the min and max date 
    // save date used in current file
    var tableTransactions = Banana.document.table('Transactions');
    for (rowNr = 0; rowNr < tableTransactions.rowCount; rowNr++) {
        // save dates used
        var trDocDate = tableTransactions.value(rowNr, 'Date');
        datesUsed[trDocDate] = true;
    }
    // start writing the output
    var text = "<style>\ntd.r {text-align:right;}\n</style>\n";
    text += '<table border="1">\n';
    text += "<tr><th>" + account + "</th><th colspan = '4'>" + rowAccount.value("Description") + "</th></tr>\n";
    text += "<tr><th>Date</th><th>Balance Accounting</th><th>Bank Balance</th><th>Difference</th><th>New Difference</th></tr>\n";
    // find min and max date in compare file to start compare 
    var startDate = Banana.Converter.toDate(findMinValue(transactionsCompare.rows, 'Date', false));
    var endDate = Banana.Converter.toDate(findMaxValue(transactionsCompare.rows, 'Date'));
    var currentDate = startDate;
    var differencePrevious = 0;
    // go true all dates day by day 
    while (currentDate <= endDate) {
        // retrieve the balance for the currentDate
        var currentBalance = Banana.document.currentBalance(account, currentDate, currentDate);
        // the same for the fileBank 
        var currentBalanceBank = fileBank.currentBalance(accountCompare, currentDate, currentDate);
        // calculate the difference
        var differenceDay = Banana.SDecimal.subtract(currentBalance.balance, currentBalanceBank.balance);
        // calculate the incremental difference to see if something has changed in the current day
        var differenceNew = Banana.SDecimal.subtract(differenceDay, differencePrevious);
        // write the data only if is a used date
	    if (datesUsed[Banana.Converter.toInternalDateFormat(currentDate)] == true) {
            text += "<tr>\n"
            text += "<td>" + Banana.Converter.toLocaleDateFormat(currentDate) + "</td>";
	        text += '<td class="r" align="right">' + Banana.Converter.toLocaleNumberFormat(currentBalance.balance) + "</td>";
	        text += '<td class="r" align="right">' + Banana.Converter.toLocaleNumberFormat(currentBalanceBank.balance) + "</td>";
	        text += '<td class="r" align="right">' + Banana.Converter.toLocaleNumberFormat(differenceDay) + "</td>";
	        if (differenceNew != 0) {
	            text += '<td class="r" align="right">' + Banana.Converter.toLocaleNumberFormat(differenceNew, 2, false) + "</td>";
	        }
	        text += "</tr>\n";
	        differencePrevious = differenceDay;
	    }
        // increment the currentDate by one day
	    currentDate.setDate(currentDate.getDate() + 1);
	}
	text += "</table>\n";
    // display the info 
	Banana.Ui.showText("", text);
}

function findMinValue(rowArray, colunmName, includeEmpty) {
    var minValue = ""; 
    var currentValue = "";
    for (var i = 0; i < rowArray.length; i++) {
        currentValue = rowArray[i].value(colunmName);
        if (includeEmpty )
        {
            if (Banana.Converter.naturalCompare(minValue, currentValue) < 0) {
                minValue = currentValue;
            }
        }
        else {
            if (minValue.length == 0 && currentValue.length > 0) {
                minValue = currentValue;
            }
            else if (minValue.length > 0 && Banana.Converter.naturalCompare(currentValue, minValue) < 0) {
                minValue = currentValue;
            }
        }
    }
    return minValue;
}

function findMaxValue(rowArray, colunmName) {
    var maxValue = "";
    var currentValue = "";
    for (var i = 0; i < rowArray.length; i++) {
        currentValue = rowArray[i].value(colunmName);
        if (Banana.Converter.naturalCompare(currentValue, maxValue) > 0) {
            maxValue = currentValue;
        }
    }
    return maxValue;
}

