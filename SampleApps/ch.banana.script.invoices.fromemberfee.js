// @id = ch.banana.script.transactionsinvoice.formemberfee
// @version = 1.0
// @pubdate = 2016-11-29
// @publisher = Banana.ch SA
// @description = Create invoice transactions, from account
// @task = import.transactions
// @xtask = app.command
// @outputformat = tablewithheaders
// @inputdatasource = none
// @doctype = 100.*
// @timeout = -1

/**
 * This script create invoice transactions 
   for accounts that have ab amount in MemberFee if the table account.
 */
function exec(ac2doc) {
	outTransactions = [];
	outTransactions[0] = ['Date', 'DocInvoice', 'Description', 'AccountDebit', 'AccountCredit', 'Amount'];
	var tableAccounts = Banana.document.table('Accounts');
	var currentDate = Banana.Converter.toInternalDateFormat(new Date());
	var invoiceNumber = Banana.Ui.getInt("Input number", "Invoice start number", 1);
	if (!invoiceNumber)
		return String();
	var accountRevenue = Banana.Ui.getText("Input account", "Revenue account", "3000");
	if (!accountRevenue)
		return String();
	var description = Banana.Ui.getText("Input text", "Transactions description", "Invoice text");
	if (!description)
		return String();
	for (var i = 0; i < tableAccounts.rowCount; i++) {
		var row = tableAccounts.row(i);
		var memberFee = row.value('MemberFee');
		var account = row.value('Account');
		var gr = row.value('Gr');
		//Banana.console.log("i " + i);
		if (memberFee && account) {
			invoiceNumber = invoiceNumber + 1;
			var rowInvoice = [];
			rowInvoice[0] = currentDate;
			rowInvoice[1] = invoiceNumber;
			rowInvoice[2] = description;
			rowInvoice[3] = account;
			rowInvoice[4] = accountRevenue;
			rowInvoice[5] = memberFee;
			outTransactions.push(rowInvoice);
		}
	}
	return Banana.Converter.arrayToTsv(outTransactions);
}

