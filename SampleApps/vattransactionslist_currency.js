// @id = ch.banana.apps.vattransactionslist_currency.js
// @version = 1.0
// @publisher = Banana.ch SA
// @description = Vat transactions converted to transaction currency
// @task = app.command
// @doctype = *.110
// @inputdatasource = none
// @timeout = -1

function exec(inData) {

    if (!Banana.document)
        return;

    var vatCode = Banana.Ui.getText("Specify Vat code", "* = all, use ',' to separate multiple codes", "*");
    if (!vatCode)
        return;
    var currency = Banana.Ui.getText("Specify currency", "* = all, use ',' to separate multiple codes", "*");
    if (!vatCode)
        return;
    // Ask period
    var accStartDate = Banana.document.startPeriod();
    var accEndDate = Banana.document.endPeriod();
    var selPeriod = Banana.Ui.getPeriod("Vat report period", accStartDate, accEndDate);
    if (!selPeriod)
        return;

    var report = Banana.Report.newReport("Report title");
	var vatCodeList = [];
	/* * for all */
	if (vatCode != "*") {
		vatCodeList = vatCode.split(",");
	}
	// trim spaces and make case insensitive
	for ( i = 0; i < vatCodeList.length; i++) {
		vatCodeList[i] = vatCodeList[i].trim().toUpperCase();
		
	}
	var currencyList = [];
	/* * for all */
	if (currency != "*") {
		currencyList = currency.split(",");
	}
	// trim spaces
	for ( i = 0; i < currencyList.length; i++) {
		currencyList[i] = currencyList[i].trim().toUpperCase();
	}

	vatTransactionsReport(report, vatCodeList, currencyList, selPeriod.startDate, selPeriod.endDate);
	// create stylesheet
    var stylesheet = Banana.Report.newStyleSheet();
	stylesheet.addStyle(".bold", "font-weight: bold");
	stylesheet.addStyle(".right", "text-align: right");
    Banana.Report.preview(report, stylesheet);
}

function vatTransactionsReport(report, vatCodeList, currencyList, startDate, endDate) {

	report.addParagraph( Banana.document.info("Base","HeaderLeft"));
	report.addParagraph( "Vat Transactions from : " + formatDate(startDate) + " to: " + formatDate(endDate));
    var table = report.addTable("table");
    var tableRow = table.addRow();
    tableRow.addCell("Date");
    tableRow.addCell("Doc");
    tableRow.addCell("Description");
    tableRow.addCell("Vat code");
    tableRow.addCell("Vat Taxable");
    tableRow.addCell("Vat Amount");
    tableRow.addCell("Vat Posted");
    tableRow.addCell("Currency");
    tableRow.addCell("Currency Vat Taxable");
    tableRow.addCell("Currency Vat Amount");
    tableRow.addCell("Currency Vat Posted");

    //Table Journal
    var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);

    var date = "";
    var doc = "";
    var desc = "";
    var totDebit = "";
    var totCredit = "";
    var vatOperation = false;
	var vatTaxableTotal = "";
	var vatAmountTotal = "";
	var vatPostedTotal = "";
		debugger;
    for (i = 0; i < journal.rowCount; i++) {
        var tRow = journal.row(i);
        var date = tRow.value("Date");
		/* check date is within selected period */
		if (date < startDate || date > endDate) 
			continue;
		/* check date is vat operation so there is a VatCode */
        var vatOperation = tRow.value("JVatIsVatOperation");
		if (vatOperation.length == 0) 
			continue;
		/* check vat code is within selection  */
		var vatCode = tRow.value("JVatCodeWithoutSign");
		if (vatCodeList.length > 0 
		   && vatCodeList.indexOf(vatCode.toUpperCase()) < 0)
			continue;
		/* check currency is within selection  */
		var transactionCurrency = tRow.value('JTransactionCurrency');
		if (currencyList.length > 0 
		   && currencyList.indexOf(transactionCurrency.toUpperCase()) < 0)
			continue;
        var doc = tRow.value("Doc");
        var desc = tRow.value("Description");
        var vatTaxable = tRow.value('JVatTaxable');
		var vatAmount = tRow.value('VatAmount');
		var vatPosted = tRow.value('VatPosted');
		/* account amount */
		var amount = tRow.value('JAmount');
		var amountCurrency = tRow.value('JAmountTransactionCurrency');
		/* Vat amounts calculated in transcactions currency */
		var exchange = tRow.value('JTransactionExchangeRate');
		var vatTaxableCurrency = Banana.SDecimal.multiply( vatTaxable, exchange, Banana.document.rounding);
		var vatAmountCurrency = Banana.SDecimal.multiply( vatAmount, exchange, Banana.document.rounding);
		var vatPostedCurrency = Banana.SDecimal.multiply( vatPosted, exchange, Banana.document.rounding);
		
        tableRow = table.addRow();
        tableRow.addCell(formatDate(date));
        tableRow.addCell(doc);
		// limit long descriptions
		desc = desc.substring(0, 30);
        tableRow.addCell(desc);
        tableRow.addCell(vatCode);
        tableRow.addCell(formatNumber(vatTaxable), "right");
        tableRow.addCell(formatNumber(vatAmount), "right");
        tableRow.addCell(formatNumber(vatPosted), "right");
        tableRow.addCell(transactionCurrency);
        tableRow.addCell(formatNumber(vatTaxableCurrency), "right");
        tableRow.addCell(formatNumber(vatAmountCurrency), "right");
        tableRow.addCell(formatNumber(vatPostedCurrency), "right");
		vatTaxableTotal = Banana.SDecimal.add(vatTaxableTotal, vatTaxable);
		vatAmountTotal = Banana.SDecimal.add(vatAmountTotal, vatAmount);
		vatPostedTotal = Banana.SDecimal.add(vatPostedTotal, vatPosted);
    }
    tableRow = table.addRow();
    tableRow.addCell("");
    tableRow.addCell("");
    tableRow.addCell("Total", "bold");
    tableRow.addCell("");
    tableRow.addCell(formatNumber(vatTaxableTotal), "right bold");
    tableRow.addCell(formatNumber(vatAmountTotal), "right bold");
    tableRow.addCell(formatNumber(vatPostedTotal), "right bold");

}

function formatNumber( amount) {
	return Banana.Converter.toLocaleNumberFormat(amount);
}

function formatDate( date) {
	return Banana.Converter.toLocaleDateFormat(date);
}
