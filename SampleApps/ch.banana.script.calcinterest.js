// This script calculate an interest rate for the defined period
// @id = ch.banana.script.calcinterest.js
// @version = 1.0
// @pubdate = 2014-01-20
// @publisher = Banana.ch SA
// @description = Calculate interest on account (exact days)
// @task = app.command
// @outputformat = none
// @inputdatasource = none
// @doctype = 100.*;110.*;130.*
// @timeout = -1
//

function exec(string) {
    if (!Banana.document)
        return;
    Banana.document.clearMessages();
    //var parameters = new userParameters();
    var parameters = {};

    parameters.accountId = "1001";
    // Rate in % for interest on debit 
    parameters.interestRateDebit = 0;
    // Rate in % for interest on credit 
    parameters.interestRateCredit = 0;
    parameters.startDate = Banana.document.startPeriod();
    parameters.endDate = Banana.document.endPeriod();
    // Base vor interest calculation, valid number are 360 and 365
    parameters.daysYear = 365;
    // round the interest amount to nr. of decimal  
    parameters.roundDecimals = 2;
    // if true use budget data
    parameters.useBudgetData = false;
    // display account card
    parameters.addTextAccountCard = false;

    var dialogHeader = 'Calculate interest rate';
    parameters.accountId = Banana.Ui.getText(dialogHeader, "Account number");
    if (!parameters.accountId)
        return;
	debugger;
    // check if the account exists 
	if (!Banana.document.table('Accounts').findRowByValue('Account', parameters.accountId)) {
		var accountId = parameters.accountId.toUpperCase();
		rowAccount = Banana.document.table("Accounts").findRowByValue("Account", accountId);
		if (!rowAccount)
			return;
		parameters.accountId = parameters.accountId.toUpperCase();
	}

    var datePeriod = Banana.Ui.getPeriod('Choose period', Banana.document.startPeriod(), Banana.document.endPeriod())
    if (typeof datePeriod.startDate === "undefined")
        return;
    parameters.startDate = datePeriod.startDate;
    parameters.endDate = datePeriod.endDate;

    parameters.interestRateDebit = Banana.Ui.getDouble(dialogHeader, 'Interest rate on debit balance in %', 0, 0)

    parameters.interestRateCredit = Banana.Ui.getDouble(dialogHeader, 'Interest rate on credit balance in %', 0, 0)

    parameters.addTextAccountCard = Banana.Ui.showQuestion(dialogHeader, "Dispaly account card data?");

    //
    // internal variable definition 
    //
    if (!VerifyParameters(parameters)) {
        return false;
    }
    var returnValue = CalcInterest(parameters);
    Banana.Ui.showText(returnValue.displayText);

}
function VerifyParameters(param) {
    var returnValue = true;
    if (param.startDate === "undefined" || param.startDate.length == 0) {
        returnValue = false;
    }
    if (param.endDate === "undefined" || param.endDate.length == 0) {
        returnValue = false;
    }
    return returnValue;
}

function CalcInterest(param) {

    //
    // 
    // return values
    var rv = {};
    rv.daysNumberTotalDebit = 0;
    rv.daysNumberTotalCredit = 0;
    rv.interestAmountDebit = 0;
    rv.interestAmountCredit = 0;
    rv.endBalance = 0;
    rv.displayText = "";
    rv.accountDescription = Banana.document.table("Accounts").findRowByValue("Account", param.accountId).value("Description");
    // internal variable definition 
    var daysNumberDebit = 0;
    var daysNumberCredit = 0;
    var days = 0;
    var textAccount = "";
    var accountCard;
    var progressBar = Banana.application.progressBar;

    if (!param.useBudgetData) {
        accountCard = Banana.document.currentCard(param.accountId, param.startDate, param.endDate);
    }
    else {
        accountCard = Banana.document.budgetCard(param.accountId, param.startDate, param.endDate);
    }
    progressBar.start(accountCard.rowCount);

    for (rowNr = 0; rowNr < accountCard.rowCount; rowNr++) {

        if (!progressBar.step(1))
            break;
        daysNumberDebit = 0;
        daysNumberCredit = 0;
        days = 0;
        balance = Number(accountCard.value(rowNr, 'JBalance'));
        var dateTransaction = accountCard.value(rowNr, 'JDate');
        var d1 = Banana.Converter.toDate(dateTransaction);
        if (rowNr < accountCard.rowCount - 1) {
            var d2 = Banana.Converter.toDate(accountCard.value(rowNr + 1, 'JDate'));
            var t1 = d1.getTime();
            var t2 = d2.getTime();
            days = parseInt((t2 - t1) / (24 * 3600 * 1000));
            if (balance > 0) {
                daysNumberDebit = Number(balance * days);
                daysNumberDebit = Number((daysNumberDebit).toFixed());
                rv.daysNumberTotalDebit += daysNumberDebit;
                rv.daysNumberTotalDebit = Number((rv.daysNumberTotalDebit).toFixed());
            }
            if (balance < 0) {
                daysNumberCredit = balance * (-1) * days;
                daysNumberCredit = Number((daysNumberCredit).toFixed());
                rv.daysNumberTotalCredit += daysNumberCredit;
                rv.daysNumberTotalCredit = Number((rv.daysNumberTotalCredit).toFixed());
            }
        }
        textAccount += Banana.Converter.toLocaleDateFormat(dateTransaction) + "\t" + Banana.Converter.toLocaleNumberFormat(balance) + "\t" + days;
        textAccount += "\t" + daysNumberDebit + "\t" + rv.daysNumberTotalDebit + "\t" + daysNumberCredit + "\t" + rv.daysNumberTotalCredit + "\n";
    }
    // calculate interest
    rv.interestAmountDebit = rv.daysNumberTotalDebit * param.interestRateDebit / param.daysYear / 100;
    rv.interestAmountDebit = rv.interestAmountDebit.toFixed(param.roundDecimals);
    rv.interestAmountCredit = rv.daysNumberTotalCredit * param.interestRateCredit / param.daysYear / 100;
    rv.interestAmountCredit = rv.interestAmountCredit.toFixed(param.roundDecimals);
    // write results
    if (!param.useBudgetData) {
        rv.displayText += "Current data account:\t" + param.accountId + " " + rv.accountDescription + "\n";
    }
    else {
        rv.displayText += "Budget data account :\t" + param.accountId + " " + rv.accountDescription + "\n";
    }

    rv.displayText += "Start Date:\t" + Banana.Converter.toLocaleDateFormat(param.startDate) + "\n";
    rv.displayText += "End Date:\t" + Banana.Converter.toLocaleDateFormat(param.endDate) + "\n";
    rv.displayText += "Balance:\t" + Banana.Converter.toLocaleNumberFormat(Banana.document.currentBalance(param.accountId, param.startDate, param.endDate).balance) + "\n";
    rv.displayText += "\n"
    rv.displayText += "Debit:\n"
    rv.displayText += "Numbers debit:\t" + rv.daysNumberTotalDebit + "\n";
    rv.displayText += "Interest rate % :\t" + param.interestRateDebit + "\n";
    rv.displayText += "Interest amount:\t" + Banana.Converter.toLocaleNumberFormat(rv.interestAmountDebit) + "\n";
    rv.displayText += "\n"
    rv.displayText += "Credit:\n"
    rv.displayText += "Numbers credit:\t" + rv.daysNumberTotalCredit + "\n";
    rv.displayText += "Interest rate % :\t" + param.interestRateCredit + "\n";
    rv.displayText += "Interest amount:\t" + Banana.Converter.toLocaleNumberFormat(rv.interestAmountCredit) + "\n";
    rv.displayText += "\n";
    rv.displayText += "Calculation days 365/" + param.daysYear + "\n";
    // add account card data
    if (param.addTextAccountCard === true) {
        rv.displayText += "Date" + "\t" + "Balance" + "\t" + "Days" + "\t" + "#Debit" + "\t" + "#TotalDebit" + "\t" + "#Credit" + "\t" + "#TotalCredit" + "\n";
        rv.displayText += textAccount;
        //rv.displayText += accountCard.toTsv(["JCTransactionDate", "JCBalance", "JCBalanceCurrency"]);
    }
    progressBar.finish();

    return rv;
}


 
