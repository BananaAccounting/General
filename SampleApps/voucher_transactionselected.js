// @id = ch.banana.script.helvetas.voucher
// @version = 1.0
// @pubdate = 2013-12-10
// @publisher = Banana.ch SA
// @description = Voucher print (selected transaction) 
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @timeout = -1
//

function exec(string) {
    
	
	var transactions = Banana.document.table('Transactions');
	var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);
	var tDoc = transactions.row(Banana.document.cursor.rowNr).value('Doc');
	var tRow = Banana.document.table('Transactions').row(Banana.document.cursor.rowNr);
	if (!tDoc)	 
		return;

	// Report
	var report = Banana.Report.newReport("Report title");
	
	
	
	var pageHeader = report.getHeader()
    pageHeader.addClass("header");
    pageHeader.addText(Banana.document.info("Base","HeaderLeft"));
    //report.getFooter().addFieldPageNr();
	report.getFooter().addText(Banana.Converter.toLocaleDateFormat(new Date()));
	 
	report.addParagraph('Voucher doc: ' + tDoc);
	var table = report.addTable("StyleTable");
    var colDescription = table.addColumn("StyleDescription");   
	var tableHeader = table.getHeader();
	//"flexible-width"

	var totDebit = "";
	var totCredit = "";
	
	// Column header
	tableRow = tableHeader.addRow();	
	tableRow.addCell("Date", "ColumnHeader");
	tableRow.addCell("Doc", "ColumnHeader");
	tableRow.addCell("Description", "ColumnHeader");
	tableRow.addCell("Account", "ColumnHeader");
	tableRow.addCell("Account Description", "ColumnHeader");
	tableRow.addCell("Debit", "ColumnHeader");
	tableRow.addCell("Credit", "ColumnHeader");
	tableRow.addCell("Currency", "ColumnHeader");
	tableRow.addCell("Amount", "ColumnHeader");
	tableRow.addCell("Budget Line", "ColumnHeader");
	// Print transactions row
	for ( i=0; i< journal.rowCount; i++)
	{
		var tRow = journal.row(i);
		if (tRow.value('Doc') == tDoc)
		{
			tableRow = table.addRow();	
			tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('Date')));
			tableRow.addCell(tRow.value('Doc'));
			tableRow.addCell(tRow.value('Description'));
			tableRow.addCell(tRow.value('JAccount'));
			tableRow.addCell(tRow.value('JAccountDescription'));
			var amount = Banana.SDecimal.abs(tRow.value('JAmount'));
			// Debit
			if (Banana.SDecimal.sign(tRow.value('JAmount')) > 0 ){
				totDebit = Banana.SDecimal.add( totDebit, amount);
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount),"Right");
				tableRow.addCell();
			}
			// Credit
			else {
				totCredit = Banana.SDecimal.add( totCredit, amount);
				tableRow.addCell();
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount),"Right");
			}
			tableRow.addCell(tRow.value('JAccountCurrency'));
			tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JAmountCurrency')),"Right");
		tableRow.addCell(tRow.value('Cc1'));
		}
	}
	//TotalLine
	
	tableRow = table.addRow();
	tableRow.addCell();
	tableRow.addCell();
	tableRow.addCell();
	tableRow.addCell("Total","ColumnHeader");
	tableRow.addCell();
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totDebit), "ColumnHeader Right");
	tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totCredit), "ColumnHeader Right");

	//	Signatures
	table = report.addTable("Signature");	
	tableRow = table.addRow();
	tableRow.addCell('Added by');
	tableRow.addCell('Authorized by');
	
	// Style sheet
	var stylesheet = CreaStyleSheet1();

	// Print preview
	Banana.Report.preview(report, stylesheet);	
	
}

function CreaStyleSheet1() {

	
	var stylesheet = Banana.Report.newStyleSheet();
	
	var style2 = stylesheet.addStyle("@page");
	style2.setAttribute("size", "landscape");
	
	style = stylesheet.addStyle(".ColumnHeader");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("font-weight", "bold");
	
	
	style = stylesheet.addStyle(".header");
	style.setAttribute("font-size", "12pt");
	style.setAttribute("text-align", "center");
	style.setAttribute("font-weight", "arial");
	style.setAttribute("border-bottom-style", "solid");
    
	style = stylesheet.addStyle(".Right");
	style.setAttribute("text-align", "right");
	
	
	style = stylesheet.addStyle(".Signature");
	style.setAttribute("padding-top", "10mm");
	style.setAttribute("padding-bottom", "10mm");
	style.setAttribute("font-size", "12pt");
	
	return stylesheet;
}


