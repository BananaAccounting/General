// Test script using Banana.Report
//
// @id = ch.banana.app.utilties.librarybooksreport
// @api = 1.0
// @pubdate = 2016-09-21
// @publisher = Banana.ch SA
// @description = Library Books Report
// @task = app.command
// @doctype = 400.140.*
// @docproperties = 
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



/*
    SUMMARY
    =======
    This app creates a list of all the books that are in the banana file.
    The list is sorted by the genres and then by the title of the book.

*/


function exec(string) {

    //Parameters
    var parametri = {};
    parametri.reportHeader = Banana.document.info("Base", "HeaderLeft");
    //parametri.colore;
    
    //Check if the table Items exists
    var itemsTable = Banana.document.table("Items");
    if (!itemsTable) { return; }
    
    //Create the report 
    var report = Banana.Report.newReport(parametri.reportHeader);
    
    //Get all the rows of the Items table and sort them
    itemsRows = itemsTable.findRows(function (row) { return (!row.isEmpty) });
    itemsRows = itemsRows.sort(function (a, b) { return sortByGenres(a, b) });


    //************ BEGIN REPORT ************//
    report.addParagraph(" ", "");
    report.addParagraph(" ", "");
    report.addParagraph(parametri.reportHeader, "title");

    var text;
    var cellReport;
    var tableReport = report.addTable("tableReport");
    
    /* 
        Dati tabella 
    */
    var genres = "";
    for (var i = 0; i < itemsRows.length; i++) {
        var currentRow = itemsRows[i];
        var rowReport;

        //Check if the given columns of the current row are not empty
        if (!columnsEmpty(currentRow, ["Title", "Author", "Publisher", "Category"])) {

            if (!currentRow.value("Genres")) {
                rowReport = tableReport.addRow();
                var genresCell = rowReport.addCell("", "bold italic borderBottom", 2);
                genresCell.addParagraph(" ", "");    
                genresCell.addParagraph("-", "");  
            }

            if (currentRow.value("Genres") !== genres) {
                genres = currentRow.value("Genres");
                rowReport = tableReport.addRow();
                var genresCell = rowReport.addCell("", "bold italic borderBottom", 2);
                genresCell.addParagraph(" ", "");    
                genresCell.addParagraph(genres.toUpperCase() + ":", "");
            }

            rowReport = tableReport.addRow();
            var cell = rowReport.addCell("", "");            

    		AddText(currentRow, "Title", cell, "bold", true);
    		AddText(currentRow, "Author", cell, "");
    		AddText(currentRow, "Publisher", cell, "italic");
    		AddText(currentRow, "Cast", cell, "italic");
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
        }
    }

    //Add header and footer
    addHeader(report);
    addFooter(report);
    
    //Aggiunge stile e stampa il report
    var stylesheet = createStyleSheet();
    Banana.Report.preview(report, stylesheet);
}









//Function that checks if the columns of the row are empty
function columnsEmpty(row, arrColumns) {
    for (var i = 0; i < arrColumns.length; i++) {
        if (!row.value(arrColumns[i])) {
            return true;
        }
    }
}




function AddText(currentRow, column, report, style, first) {

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




function AddDate(currentRow, column, report, style, first) {
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




function sortByGenres(a, b) {
    //var texta = a.value("Genres") + "$" + a.value("Author") + "$" + a.value("Title");
    //var textb = b.value("Genres") + "$" + b.value("Author") + "$" + b.value("Title");
    var texta = a.value("Genres") + "$" + a.value("Title");
    var textb = b.value("Genres") + "$" + b.value("Title");

    if (texta > textb)
        return 1;
    else if (texta == textb)
        return 0;
    return -1;
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





/* Function that prints the header */
function addHeader(report) {

    var headerLeft = Banana.document.info("Base","HeaderLeft");
    var headerRight = Banana.document.info("Base","HeaderRight");
    var startDate = Banana.document.info("AccountingDataBase","OpeningDate");
    var endDate = Banana.document.info("AccountingDataBase","ClosureDate");
    var company = Banana.document.info("AccountingDataBase","Company");
    var courtesy = Banana.document.info("AccountingDataBase","Courtesy");
    var name = Banana.document.info("AccountingDataBase","Name");
    var familyName = Banana.document.info("AccountingDataBase","FamilyName");
    var address1 = Banana.document.info("AccountingDataBase","Address1");
    var address2 = Banana.document.info("AccountingDataBase","Address2");
    var zip = Banana.document.info("AccountingDataBase","Zip");
    var city = Banana.document.info("AccountingDataBase","City");
    var state = Banana.document.info("AccountingDataBase","State");
    var country = Banana.document.info("AccountingDataBase","Country");
    var web = Banana.document.info("AccountingDataBase","Web");
    var email = Banana.document.info("AccountingDataBase","Email");
    var phone = Banana.document.info("AccountingDataBase","Phone");
    var mobile = Banana.document.info("AccountingDataBase","Mobile");
    var fax = Banana.document.info("AccountingDataBase","Fax");
    var fiscalNumber = Banana.document.info("AccountingDataBase","FiscalNumber");
    var vatNumber = Banana.document.info("AccountingDataBase","VatNumber");

    var pageHeader = report.getHeader();
    //pageHeader.addClass("header");
    //pageHeader.addText(parametri.reportHeader);

    var tab = pageHeader.addTable("header");
    var col1 = tab.addColumn("headerCol1");
    var col2 = tab.addColumn("headerCol2");

    // If there is an image we add it to the report, otherwise no image is added
    try {
        var image = Banana.document.table('Documents').findRowByValue('RowId', 'logo').value('Attachments');
    } catch(e) {}

    if (image) {
        tableRow = tab.addRow();
        tableRow.addCell("", "", 1).addImage("documents:logo", "img center");
        var businessCell = tableRow.addCell("", "", 1);
    } else {
        tableRow = tab.addRow();
        var businessCell = tableRow.addCell("", "", 2);
    }

    // address
    if (company) {
        businessCell.addParagraph(company, "bigLogo timeNewRoman center");
    }
    if (address1 && zip && city) {
        businessCell.addParagraph(address1 + ", " + zip + " - " + city, "center");
    }
    if (phone && email) {
        businessCell.addParagraph("Tel: " + phone + ", Email: " + email, "center");
    }

    tableRow = tab.addRow();
    tableRow.addCell("","", 2);
    tableRow = tab.addRow();
    tableRow.addCell("","", 2);
}




/* Function that prints the footer */
function addFooter(report) {
    var footer = report.getFooter();
    footer.addText(Banana.Converter.toLocaleDateFormat(new Date()) + "                                                              ");
    footer.addText("Banana Library" + "                                                              ").setUrlLink("http://www.banana.ch");
    footer.addFieldPageNr();
} 




function createStyleSheet() {
    
    var stylesheet = Banana.Report.newStyleSheet();
    var pageStyle = stylesheet.addStyle("@page");
    
    pageStyle.setAttribute("margin", "15mm 5mm 10mm 20mm");

    stylesheet.addStyle("body", "font-family:Helvetica; font-size:9pt");
    stylesheet.addStyle(".italic", "font-style:italic;");
    stylesheet.addStyle(".center", "text-align:center");
    stylesheet.addStyle(".bold", "font-weight:bold");

    stylesheet.addStyle(".headerCol1", "width:20pt");
    stylesheet.addStyle(".headerCol2", "width:65pt");
    stylesheet.addStyle(".bigLogo", "font-size: 35");
    stylesheet.addStyle(".img", "heigth:50%;width:50%;padding-bottom:20pt");
    stylesheet.addStyle(".padding-top", "padding-top:20pt");

    stylesheet.addStyle(".borderLeft", "border-left:thin solid black");
    stylesheet.addStyle(".borderRight", "border-right:thin solid black");
    stylesheet.addStyle(".borderTop", "border-top:thin solid black");
    stylesheet.addStyle(".borderBottom", "border-bottom:thin solid black");


    var titleStyle = stylesheet.addStyle(".title");
    titleStyle.setAttribute("font-size", "13");
    titleStyle.setAttribute("text-align", "center");
    titleStyle.setAttribute("margin-bottom", "0.5em");

    var headerStyle = stylesheet.addStyle(".header");
    headerStyle.setAttribute("width", "100%");

    var headerTableStyle = stylesheet.addStyle(".headerTable");
    headerTableStyle.setAttribute("background-color", "#E0E0E0");
    headerTableStyle.setAttribute("color", "black");

    var tableStyle = stylesheet.addStyle(".tableReport");
    tableStyle.setAttribute("width", "100%");
    //stylesheet.addStyle("table.tableReport td", "border: thin solid black;");

    return stylesheet;
}
