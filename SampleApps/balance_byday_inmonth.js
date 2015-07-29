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
// @id = ch.banana.report.balancedailyinmonth.js
// @version = 1.0
// @pubdate = 2015-07-29
// @doctype = 100.*;110.*;130.*
// @publisher = Banana.ch SA
// @description = Account balance for all days in a month
// @task = app.command
// @outputformat = none
// @inputdatasource = none
// @timeout = -1
//

function exec( string) {

    var month = Banana.Ui.getInt("Input", "Choose month number", 1, 1, 12);
    if (typeof month === "undefined")
        return;
    var account = Banana.Ui.getText("Input", "Account number" );
    if (typeof account === "undefined")
        return;
    var openingDate = Banana.document.info("AccountingDataBase", "OpeningDate");
    var rowAccount = Banana.document.table('Accounts').findRowByValue("Account", account);
    var text = account + rowAccount.value("Description") + "\n";
	for (var dayNumber = 1; dayNumber <= 31; dayNumber++) {
        // javascript January = 0 (month number start by 0 )
	    var nuovaData = new Date(openingDate.substring(0, 4), month -1 , dayNumber);
	    var enddate = nuovaData.toISOString().slice(0, 10).replace(/-/g, "");
	    var currentBalance = Banana.document.currentBalance(account, "", enddate);
	    text = text + Banana.Converter.toLocaleDateFormat(enddate) + "\t" + Banana.Converter.toLocaleNumberFormat(currentBalance.balance) + "\n";
	}
	Banana.Ui.showText("", text);
}
