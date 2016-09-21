// Test script using Banana.Report
//
// @id = ch.banana.app.utilties.booksreport
// @api = 1.0
// @pubdate = 2016-09-21
// @publisher = Banana.ch SA
// @description = Book Report
// @task = app.command
// @doctype = 400.140.*
// @docproperties = library
// @outputformat = none
// @inputdatasource = none
// @timeout = -1

function exec(string) {

    //Parametri
    var parametri = {};
    parametri.reportHeader = "Elenco completo: " + Banana.document.info("Base", "HeaderLeft");
    parametri.soloDirittoVoto = false;
    parametri.soloUnaRiga = false;
    
    //Controllo che esista la tabella contatti
    var itemsTable = Banana.document.table("Items");
    if (itemsTable === "undefined") {
        return;
    }
    
    //Selezione del tipo di ordinamento
    //var itemSelected = Banana.Ui.getItem('Stampa elenco', 'Tipo di ordinamento:', ['Ordina per nome','Ordina per scheda'], 0, false);


    //Creazione report   
    var report = Banana.Report.newReport(parametri.reportHeader);
    

    //Righe indirizzi
    itemsRows = itemsTable.findRows(function (row) { return (!row.isEmpty) });

	
    itemsRows = itemsRows.sort(function (a, b) { return sortByCategory(a, b) });
	/*
    if (itemSelected === "Ordina per nome") {
    }
    else if (itemSelected === "Ordina per scheda") {
        adressesRows = adressesRows.sort(sortByScheda);
    }
	*/

    //************ INIZIO CREAZIONE DEL REPORT ************//

    var text;
    var cellReport;
    var tableReport = report.addTable("tableReport");
    
    /* 
        Header tabella 
    */
    var tableHeader = tableReport.getHeader();
    var tableHeaderRow = tableHeader.addRow("");

    tableHeaderRow.addCell("Book", "headerTable bold center");
    tableHeaderRow.addCell("Location", "headerTable bold center");
   

    /* 
        Dati tabella 
    */
    for (var i = 0; i < itemsRows.length; i++) 
    {
        var rowReport = tableReport.addRow();
        var currentRow = itemsRows[i];
        
        /*********** 
            ID 
        ***********/
        var cell = rowReport.addCell("", "");

		AddText(currentRow, "Title", cell, "bold", true);
		AddText(currentRow, "Author", cell, "");
		AddText(currentRow, "Publisher", cell, "italic");
		AddText(currentRow, "Calst", cell, "italic");
		AddText(currentRow, "Producer", cell, "italic");
		AddText(currentRow, "Category", cell, "");
		AddText(currentRow, "SubCategory", cell, "");
		AddText(currentRow, "Subject", cell, "italic");
		AddText(currentRow, "Genres", cell, "");
		AddText(currentRow, "Classification", cell, "");
		AddText(currentRow, "Code", cell, "italic");
		AddText(currentRow, "ProductVolume", cell, "");
		AddText(currentRow, "SubCategory", cell, "");
		AddText(currentRow, "Section", cell, "");
		AddText(currentRow, "Location", cell, "");
		AddDate(currentRow, "DateEntry", cell, "");
		/* Eventually ask user if he wants to print other columns */
		
			
        text = currentRow.value("RowId");
        cellReport = rowReport.addCell(text, "");
		
        /*text = Banana.Converter.toLocaleDateFormat(currentRow.value("DateOfBirth"));
        cellReport = rowReport.addCell();
        cellReport.addParagraph(text);
        */
    }

    //Add header and footer
    AddHeaderAndFooter(report, parametri);
    
    //Aggiunge stile e stampa il report
    var stylesheet = createStyleSheet();
    Banana.Report.preview(report, stylesheet);
}

function AddText(currentRow, column, report, style, first)
{
	//Banana.console.log(column);
	var text = currentRow.value(column);
	if (text && text.length > 0) {
		// if first don't add separator
		if (first) {
			report.addText(text, style);
		}
		else {
			report.addText("; " + text, style);
		}
	}

}

function AddDate(currentRow, column, report, style, first)
{
	var text = currentRow.value(column);
	if (text && text.length > 0) {
		text = Banana.Converter.toLocaleDateFormat(currentRow.value(text));
		if (first) {
			report.addText(text, style);
		}
		else {
			report.addText("; " + text, style);
		}
	}

}



function AddHeaderAndFooter(report, parametri) {

    var pageHeader = report.getHeader();
    pageHeader.addClass("header");
    pageHeader.addText(parametri.reportHeader);
	var footer = report.getFooter();
    footer.addText("Banana Library").setUrlLink("http://www.banana.ch");
    footer.addText(Banana.Converter.toLocaleDateFormat(new Date()) + "    -    ");
    report.getFooter().addFieldPageNr();
} 






function sortByCategory(a, b) {
    var texta = a.value("Category") + "$" + a.value("Author") + "$" + a.value("Title");
    var textb = b.value("Category") + "$" + b.value("Author") + "$" + b.value("Title");
    if (texta > textb)
        return 1;
    else if (texta == textb)
        return 0;
    return -1;
}

function createStyleSheet() {
    
    var stylesheet = Banana.Report.newStyleSheet();
    var pageStyle = stylesheet.addStyle("@page");
    
    pageStyle.setAttribute("margin", "15mm 20mm 10mm 20mm");
    pageStyle.setAttribute("size", "landscape");

    stylesheet.addStyle("body", "font-family:Helvetica; font-size:10pt");
    stylesheet.addStyle(".avoid-pb-after", "page-break-after:avoid");
    stylesheet.addStyle(".avoid-pb-before", "page-break-before:avoid");
    stylesheet.addStyle(".italic", "font-style:italic;");
    stylesheet.addStyle(".center", "text-align:center");
    stylesheet.addStyle(".bold", "font-weight:bold");

    var titleStyle = stylesheet.addStyle(".header");
    titleStyle.setAttribute("font-size", "13");
    titleStyle.setAttribute("text-align", "center");
    titleStyle.setAttribute("margin-bottom", "0.5em");

    var headerTableStyle = stylesheet.addStyle(".headerTable");
    headerTableStyle.setAttribute("background-color", "#E0E0E0");
    headerTableStyle.setAttribute("color", "black");

    var tableStyle = stylesheet.addStyle(".tableReport");
    tableStyle.setAttribute("width", "100%");
    stylesheet.addStyle("table.tableReport td", "border: thin solid black;");

    return stylesheet;
}
