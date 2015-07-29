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
// @id = ch.banana.report.balance_byday_inperiod.report
// @api = 1.0
// @pubdate = 2015-07-29
// @doctype = 100.*;110.*;130.*
// @publisher = Banana.ch SA
// @description = Display account balance by day within a period
// @task = app.command
// @outputformat = none
// @inputdatasource = none
// @includejs = 
// @timeout = -1
//

function exec(string) {
    var parameters = {};
    parameters.accountId = Banana.Ui.getText("Input", "Account number");
    if (typeof parameters.accountId === "undefined")
        return;
    // check if the account exists row >= 0
    var rowAccount = Banana.document.table('Accounts').findRowByValue('Account', parameters.accountId);
    if (typeof rowAccount === -1)
        return;

    var datePeriod = Banana.Ui.getPeriod('Choose period', Banana.document.startPeriod(), Banana.document.endPeriod())
    if (typeof datePeriod.startDate === "undefined")
        return;
    parameters.startDate = datePeriod.startDate;
    parameters.endDate = datePeriod.endDate;
    parameters.byMonth = true;

    // start writing the output
    var text = "<style>\ntd.r {text-align:right;}\n</style>\n";
    text += '<table border="1">\n';
    text += "<tr><th>" + parameters.accountId + "</th><th>" + rowAccount.value("Description") + "</th></tr>\n";
    text += "<tr><th>Date</th><th>Account Balance</th></tr>\n";
    // find min and max date in compare file to start compare 
    var startDate = Banana.Converter.toDate(datePeriod.startDate);
    var endDate = Banana.Converter.toDate(datePeriod.endDate);
    var currentDate = startDate;
    var differencePrevious = 0;
    // go true all dates day by day 
    while (currentDate <= endDate) {
        // retrive the balance for the currentDate
        var currentBalance = Banana.document.currentBalance(parameters.accountId, currentDate, currentDate);
        text += "<tr>\n"
        text += "<td>" + Banana.Converter.toLocaleDateFormat(currentDate) + "</td>";
        text += '<td class="r" align="right">' + Banana.Converter.toLocaleNumberFormat(currentBalance.balance) + "</td>";
        text += "</tr>\n";
        currentDate.setDate(currentDate.getDate() + 1);
    }
    text += "</table>\n";
    // display the info 
    Banana.Ui.showText("", text);
}

