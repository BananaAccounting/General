// Test script per generare html a mano o tramite la libreria jaml
//
// @id = ch.banana.report.monthlyaccountbalance.report.jaml
// @version = 1.0
// @pubdate = 2013-12-10
// @publisher = Banana.ch SA
// @description = Compare Balance mt940 or ISO20022 file day by day
// @task = app.command
// @outputformat = none
// @inputdatasource = none
// @includejs = jaml-all.js
// @timeout = -1
//

function exec(string) {
    // This script compare the transaction included in the file compare
    // with the transactions of the current file for the account specified
    //var fileCompare = Banana.application.openDocument("c:/temp/mt940.sta");
    var account = "1001";

    var fileCompare = Banana.application.openDocument("*.*", "", "Choose bank statement file (mt940 or ISO20022).");
    if (typeof fileCompare === "undefined")
        return;
    // account in created cashbook file il named "AAAA"
    var accountCompare = "AAAA";
    //var account = Banana.Ui.getText("Input", "Account number");
    if (typeof account === "undefined")
        return;
    // check if the account exists row >= 0
    var rowAccount = Banana.document.table('Accounts').findRowByValue("Account", account);
    if (typeof rowAccount === -1)
        return;

    // we want to check only date within the transactions of the 
    // find first date and last date
    var transactionsCompare = fileCompare.table('Transactions');
    // keep a list of date used in transactions
    var datesUsed = {};
	// Pass every transaction and find the min and max date 
    var startDateB = "";
    var endDateB = "";
    for (rowNr = 0; rowNr < transactionsCompare.rowCount; rowNr++) 
    {
        var trDocDate = transactionsCompare.value(rowNr, 'Date');
        // save dates used
        datesUsed[trDocDate] = true;
        // find min and max date
        if (startDateB.length == 0 && trDocDate.length > 0)
            startDateB = trDocDate;
        if ( trDocDate.length > 0)
            endDateB = trDocDate;
    }
    // save date used in current file
    var tableTransactions = Banana.document.table('Transactions');
    for (rowNr = 0; rowNr < tableTransactions.rowCount; rowNr++) {
        // save dates used
        var trDocDate = tableTransactions.value(rowNr, 'Date');
        datesUsed[trDocDate] = true;
    }
    // start writing the output
    var text = "<style>\ntd.r {color:red;text-align:right;}\n</style>\n";
    text += '<table border="1">\n';
    text += "<tr><th>" + account + "</th><th colspan = '4'>" + rowAccount.value("Description") + "</th></tr>\n";
    text += "<tr><th>Date</th><th>Account Balance</th><th>Statement Balance</th><th>Difference</th><th>New Difference</th></tr>\n";
    // convert BananaDate to javasript Date class
    var startDate = Banana.Converter.toDate(startDateB);
    var endDate = Banana.Converter.toDate(endDateB);
    var currentDate = startDate;
    var differencePrevious = 0;
    // go true all dates day by day 
    while (currentDate <= endDate) {
        // retrive the balance for the currentDate
        var currentBalance = Banana.document.currentBalance(account, currentDate, currentDate);
        // the same for the fileCompare 
        var currentBalanceCompare = fileCompare.currentBalance(accountCompare, currentDate, currentDate);
        // calculate the difference
        var differenceDay = Number(currentBalance.balance) - Number(currentBalanceCompare.balance);
        // calculate the incremental difference to see if something has changed in the current day
        var differenceNew = differenceDay - differencePrevious;
        // write the ifno if it is a used date
	    if (datesUsed[Banana.Converter.toInternalDateFormat(currentDate)] == true) {
            text += "<tr>\n"
            text += "<td>" + Banana.Converter.toLocaleDateFormat(currentDate) + "</td>";
	        text += '<td class="r">' + Banana.Converter.toLocaleNumberFormat(currentBalance.balance) + "</td>";
	        text += '<td class="r">' + Banana.Converter.toLocaleNumberFormat(currentBalanceCompare.balance) + "</td>";
	        text += '<td class="r">' + Banana.Converter.toLocaleNumberFormat(differenceDay.toFixed(2)) + "</td>";
	        if (differenceNew != 0) {
	            text += '<td class="r">' + Banana.Converter.toLocaleNumberFormat(differenceNew.toFixed(2)) + "</td>";
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
