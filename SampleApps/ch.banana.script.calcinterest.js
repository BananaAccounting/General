// This script calculate an interest rate for the defined period
// @id = ch.banana.script.calcinterest.js
// @version = 1.0
// @pubdate = 2024-10-10
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
    var parameters = InitParameters(Banana.document);

    var dialogHeader = 'Calculate interest rate';
    parameters.accountId = Banana.Ui.getText(dialogHeader, "Account number");
    if (!parameters.accountId)
        return;

    // check if the account exists 
    if (!Banana.document.table('Accounts').findRowByValue('Account', parameters.accountId)) {
        var accountId = parameters.accountId.toUpperCase();
        rowAccount = Banana.document.table("Accounts").findRowByValue("Account", accountId);
        if (!rowAccount)
            return;
        parameters.accountId = parameters.accountId.toUpperCase();
    }

    var datePeriod = Banana.Ui.getPeriod('Choose period', Banana.document.startPeriod(), Banana.document.endPeriod())
    if (!datePeriod || typeof datePeriod.startDate === "undefined")
        return;
    parameters.startDate = datePeriod.startDate;
    parameters.endDate = datePeriod.endDate;

    parameters.interestRateDebit = Banana.Ui.getDouble(dialogHeader, 'Interest rate on debit balance in %', 0, 0, 100, 3);

    parameters.interestRateCredit = Banana.Ui.getDouble(dialogHeader, 'Interest rate on credit balance in %', 0, 0, 100, 3);

    // parameters.addTextAccountCard = Banana.Ui.showQuestion(dialogHeader, "Display account card data?");

    //
    // internal variable definition 
    //
    if (!VerifyParameters(parameters)) {
        return false;
    }
    var calcInterestObj = CalcInterest(Banana.document, parameters);
    Banana.Ui.showText(calcInterestObj.displayText);
}

function InitParameters(doc) {
    var parameters = {};

    if (!doc)
        return parameters;

    parameters.accountId = "1001";
    // Rate in % for interest on debit 
    parameters.interestRateDebit = 0;
    // Rate in % for interest on credit 
    parameters.interestRateCredit = 0;
    parameters.startDate = doc.startPeriod();
    parameters.endDate = doc.endPeriod();
    // Base vor interest calculation, valid number are 360 and 365
    parameters.daysYear = 365;
    // round the interest amount to nr. of decimal  
    parameters.roundDecimals = 3;
    // if true use budget data
    parameters.useBudgetData = false;
    // display account card
    parameters.addTextAccountCard = true;
    return parameters;
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

function CalcInterest(doc, param) {

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

    if (!doc)
        return rv;

    rv.accountDescription = doc.table("Accounts").findRowByValue("Account", param.accountId).value("Description");
    // internal variable definition 
    var daysNumberDebit = 0;
    var daysNumberCredit = 0;
    var days = 0;
    var textAccount = "";
    var accountCard;
    var progressBar = Banana.application.progressBar;
    var accountingInfo = AccountingInfo(doc);

    if (!param.useBudgetData) {
        accountCard = doc.currentCard(param.accountId, param.startDate, param.endDate);
    }
    else {
        accountCard = doc.budgetCard(param.accountId, param.startDate, param.endDate);
    }
    progressBar.start(accountCard.rowCount);

    for (rowNr = 0; rowNr < accountCard.rowCount; rowNr++) {

        if (!progressBar.step(1))
            break;
        daysNumberDebit = 0;
        daysNumberCredit = 0;
        days = 0;
        balance = Number(accountCard.value(rowNr, 'JBalance'));
        if (accountingInfo.multiCurrency)
            balance = Number(accountCard.value(rowNr, 'JBalanceAccountCurrency'));

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
    rv.displayText += "Balance:\t" + Banana.Converter.toLocaleNumberFormat(doc.currentBalance(param.accountId, param.startDate, param.endDate).balance) + "\n";
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
        // rv.displayText += accountCard.toTsv(["JCTransactionDate", "JCBalance", "JCBalanceCurrency"]);
    }
    // add transactions to DocumentChange object
    var transactionsOutput = CreateTransactions(doc, param, rv);
    if (transactionsOutput.length > 0) {
        rv.displayText += "\n";
        rv.displayText += "--------------------- Transactions List ---------------------\n";
        rv.displayText += transactionsOutput;
    }

    progressBar.finish();

    return rv;
}

function CreateTransactions(doc, param, calcInterests) {
    var output = "";
    if (!doc)
        return output;
    var accountingInfo = AccountingInfo(doc);

    if (accountingInfo.isDoubleEntry) {
        output += CreateTransactionsDoubleEntry(doc, param, calcInterests, accountingInfo);
    }
    else if (accountingInfo.isIncomeExpenses) {
        output += CreateTransactionsIncomeExpenses(doc, param, calcInterests, accountingInfo);
    }
    return output;
}

function CreateTransactionsDoubleEntry(doc, param, calcInterests, accountingInfo) {
    var output = "";
    if (!calcInterests)
        return output;
    var tableName = "Transactions";
    var currentDate = Banana.Converter.toInternalDateFormat(new Date());
    var columns = GetVisibleColumns(tableName, doc);
    var texts = SetTexts(doc);

    if (!Banana.SDecimal.isZero(calcInterests.interestAmountDebit)) {
        output = CreateTransactionsDoubleEntryHeader(tableName, columns, doc);
        //Date
        output += currentDate + "\t";
        //Doc
        if (columns.indexOf("Doc") >= 0)
            output += "\t";
        //Description
        output += texts.debitinterests + " " + param.interestRateDebit + "% ";
        output += texts.from + " " + Banana.Converter.toLocaleDateFormat(param.startDate) + " ";
        output += texts.to + " " + Banana.Converter.toLocaleDateFormat(param.endDate) + "   \t";
        //AccountDebit
        output += param.accountId + "\t";
        //AccountCredit
        output += "[CA]\t";
        //Amount
        output += Banana.Converter.toLocaleNumberFormat(calcInterests.interestAmountDebit);
        output += "\n";
    }
    if (!Banana.SDecimal.isZero(calcInterests.interestAmountCredit)) {
        if (output.length <= 0)
            output = CreateTransactionsDoubleEntryHeader(tableName, columns, doc);
        //Date
        output += currentDate + "\t";
        //Doc
        if (columns.indexOf("Doc") >= 0)
            output += "\t";
        //Description
        output += texts.creditinterests + " " + param.interestRateCredit + "% ";
        output += texts.from + " " + Banana.Converter.toLocaleDateFormat(param.startDate) + " ";
        output += texts.to + " " + Banana.Converter.toLocaleDateFormat(param.endDate) + "   \t";
        //AccountDebit
        output += "[CA]\t";
        //AccountCredit
        output += param.accountId + "\t";
        //Amount
        output += Banana.Converter.toLocaleNumberFormat(calcInterests.interestAmountCredit);
        output += "\n";
    }
    return output;
}

function CreateTransactionsDoubleEntryHeader(tableName, columns, doc) {
    var output = "";
    output += "Date\t";
    if (columns.indexOf("Doc") >= 0)
        output += "Doc\t";
    output += "Description\t\t\t\t";
    output += "AccountDebit\t";
    output += "AccountCredit\t";
    output += "Amount\t";
    output += "\n";
    return output;
}

function CreateTransactionsIncomeExpenses(doc, param, calcInterests, accountingInfo) {
    var output = "";
    if (!calcInterests)
        return output;
    var tableName = "Transactions";
    var currentDate = Banana.Converter.toInternalDateFormat(new Date());
    var columns = GetVisibleColumns(tableName, doc);
    var texts = SetTexts(doc);

    if (!Banana.SDecimal.isZero(calcInterests.interestAmountDebit)) {
        output = CreateTransactionsIncomeExpensesHeader(tableName, columns, doc);
        //Date
        output += currentDate + "\t";
        //Doc
        if (columns.indexOf("Doc") >= 0)
            output += "\t";
        //Description
        output += texts.debitinterests + " " + param.interestRateDebit + "% ";
        output += texts.from + " " + Banana.Converter.toLocaleDateFormat(param.startDate) + " ";
        output += texts.to + " " + Banana.Converter.toLocaleDateFormat(param.endDate) + "   \t";
        //Income
        output += Banana.Converter.toLocaleNumberFormat(calcInterests.interestAmountDebit) + "\t";
        //Expenses
        output += "\t"
        //Account
        output += param.accountId + "\t";
        //Category
        output += "[CA]";
        output += "\n";
    }
    if (!Banana.SDecimal.isZero(calcInterests.interestAmountCredit)) {
        if (output.length <= 0)
            output = CreateTransactionsIncomeExpensesHeader(tableName, columns, doc);
        //Date
        output += currentDate + "\t";
        //Doc
        if (columns.indexOf("Doc") >= 0)
            output += "\t";
        //Description
        output += texts.creditinterests + " " + param.interestRateCredit + "% ";
        output += texts.from + " " + Banana.Converter.toLocaleDateFormat(param.startDate) + " ";
        output += texts.to + " " + Banana.Converter.toLocaleDateFormat(param.endDate) + "   \t";
        //Income
        output += "\t"
        //Expenses
        output += Banana.Converter.toLocaleNumberFormat(calcInterests.interestAmountCredit)+ "\t";
        //Account
        output += param.accountId + "\t";
        //Category
        output += "[CA]";
        output += "\n";
    }
    return output;
}

function CreateTransactionsIncomeExpensesHeader(tableName, columns, doc) {
    var output = "";
    output += "Date\t";
    if (columns.indexOf("Doc") >= 0)
        output += "Doc\t";
    output += "Description\t\t\t\t";
    output += "Income\t";
    output += "Expenses\t";
    output += "Account\t";
    output += "Category\t";
    output += "\n";
    return output;
}

function AccountingInfo(doc) {

    var accountingInfo = {};
    accountingInfo.isDoubleEntry = false;
    accountingInfo.isIncomeExpenses = false;
    accountingInfo.isCashBook = false;
    accountingInfo.multiCurrency = false;
    accountingInfo.withVat = false;
    accountingInfo.vatAccount = "";
    accountingInfo.customersGroup = "";
    accountingInfo.suppliersGroup = "";
    accountingInfo.vatNumber = "";
    accountingInfo.fiscalNumber = "";

    if (doc) {
        var fileGroup = doc.info("Base", "FileTypeGroup");
        var fileNumber = doc.info("Base", "FileTypeNumber");
        var fileVersion = doc.info("Base", "FileTypeVersion");

        if (fileGroup == "100")
            accountingInfo.isDoubleEntry = true;
        else if (fileGroup == "110")
            accountingInfo.isIncomeExpenses = true;
        else if (fileGroup == "130")
            accountingInfo.isCashBook = true;

        if (fileNumber == "110") {
            accountingInfo.withVat = true;
        }
        if (fileNumber == "120") {
            accountingInfo.multiCurrency = true;
        }
        if (fileNumber == "130") {
            accountingInfo.multiCurrency = true;
            accountingInfo.withVat = true;
        }

        if (doc.info("AccountingDataBase", "VatAccount"))
            accountingInfo.vatAccount = doc.info("AccountingDataBase", "VatAccount");

        if (doc.info("AccountingDataBase", "CustomersGroup"))
            accountingInfo.customersGroup = doc.info("AccountingDataBase", "CustomersGroup");
        if (doc.info("AccountingDataBase", "SuppliersGroup"))
            accountingInfo.suppliersGroup = doc.info("AccountingDataBase", "SuppliersGroup");

        if (doc.info("AccountingDataBase", "VatNumber"))
            accountingInfo.vatNumber = doc.info("AccountingDataBase", "VatNumber");
        if (doc.info("AccountingDataBase", "FiscalNumber"))
            accountingInfo.fiscalNumber = doc.info("AccountingDataBase", "FiscalNumber");
    }
    return accountingInfo;
}

function GetVisibleColumns(tableName, doc) {
    var columns = [];
    if (!doc)
        return columns;
    var table = doc.table(tableName);
    if (table) {
        var tRow = table.row(0);
        if (tRow) {
            var jsonString = tRow.toJSON();
            var jsonObj = JSON.parse(jsonString);
            for (var key in jsonObj) {
                if (IsColumnVisible(key, tableName, doc)) {
                    columns.push(key);
                }
            }
        }
    }
    return columns;
}

function IsColumnVisible(columnName, tableName, doc) {
    if (!doc)
        return false;
    var table = doc.table(tableName);
    if (!table)
        return false;
    var tColumn = doc.table(tableName).column(columnName, "Base");
    if (!tColumn)
        return false;
    return tColumn.visible;
}

function SetTexts(doc) {
    var language = 'en';
    if (doc)
        language = doc.locale;
    if (language.length > 2)
        language = language.substring(0, 2);

    var texts = {};
    if (language == 'fr') {
       texts.debitinterests = 'Intérêts débiteurs';
       texts.creditinterests = 'Intérêts créditeurs';
       texts.from = 'du';
       texts.to = 'au';
    } else if (language == 'de') {
       texts.debitinterests = 'Sollzinsen';
       texts.creditinterests = 'Habenzinsen';
       texts.from = 'vom';
       texts.to = 'bis';
    } else if (language == 'it') {
       texts.debitinterests = 'Interessi debitori';
       texts.creditinterests = 'Interessi creditori';
       texts.from = 'dal';
       texts.to = 'al';
    } else {
       texts.debitinterests = 'Debit interests';
       texts.creditinterests = 'Credit interests';
       texts.from = 'from';
       texts.to = 'to';
    }
    return texts;
 }
 