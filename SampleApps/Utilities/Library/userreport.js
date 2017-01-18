// Test script using Banana.Report
//
// @id = ch.banana.app.utilties.userreport
// @api = 1.0
// @pubdate = 2016-09-21
// @publisher = Banana.ch SA
// @description = User Report
// @task = app.command
// @doctype = 400.140.*
// @docproperties = library
// @outputformat = none
// @inputdatasource = none
// @timeout = -1





var param = {
    "orientamentoPagina" : ""
};


function exec(string) {
    
    //Check if we are on an opened document
    if (!Banana.document) { return; }

    var contactsTable = Banana.document.table("Contacts");
    var loansTable = Banana.document.table("Loans");

    //Check if the "Contact" and "Loans" tables exist
    if (!contactsTable) { return; }
    if (!loansTable) { return; }

    //Opens a dialog window asking the user what to print
    var cardsToPrint = Banana.Ui.getItem("Schede prestiti", "Selezionare...", ["Tutti gli utenti","Scelta utenti", "Utenti con libri scaduti"], 0, false);
    
    //By default we do not print the expired books. Expired books are printed only if the user wants it
    var printExpired = false;
    var printReturned = false;

    //If the user makes a choice, so he didn't click 'Cancel'...
    if (cardsToPrint) {

        if (cardsToPrint === "Tutti gli utenti") { //All the users
            var users = getIDs(contactsTable);
        } 
        else if (cardsToPrint === "Scelta utenti") { //Selected users only
            var users = Banana.Ui.getText("Stampa schede", "Inserire id utente/i (es. U-0001,U-0002)", "U-0001,U-0002,U-0003");
            
            if (users) {
                users = users.split(",");
            }
        } 
        else if (cardsToPrint === "Utenti con libri scaduti") { //Users with expired books
            var users = getExpiredIDs(loansTable);
            printExpired = true;
        }

        
        //Check if there are users, then print the cards
        if (users) {

            var printOptions = Banana.Ui.getItem("Stampa schede utenti", "Selezionare...", ["Scheda con fine pagina", "Scheda senza fine pagina", "Lista prestiti"], 0, false);

            if (printOptions === "Lista prestiti") { //Print the full list
                printLoansList(users, contactsTable, loansTable, printExpired, printOptions);
            }
            else { //Print the user cards (all users or only the selected)
                printUserCard(users, contactsTable, loansTable, printExpired, printOptions);
            }
        } 
        else {
            return; //Stop script execution
        }
    
    }
}







/* Function that prints a list of all the users with the books list */
function printLoansList(users, contactsTable, loansTable, printExpired, printOptions) {

    param.orientamentoPagina = "orizzontale";
    
    var report = Banana.Report.newReport("Schede utenti");
    var today = new Date();

    //Print the header
    addHeader(report);

    report.addParagraph(Banana.document.info("Loans","TableHeader") + ":", "");
    report.addParagraph(" ", "");

    //Create a table
    var internalTable = report.addTable("internalTable");
    
    for (var j = 0; j < users.length; j++) {
        var booksCnt = 0;
        var currentUser = users[j].trim();

        /*
            DATI UTENTE
        */
        for (var i = 0; i < contactsTable.rowCount; i++) {
            var tRow = contactsTable.row(i);

            if (!tRow.isEmpty) {

                if (currentUser === tRow.value("RowId")) {
                    var id = tRow.value("RowId");
                    var firstName = tRow.value("FirstName");
                    var familyName = tRow.value("FamilyName");
                    var phone = tRow.value("PhoneHome");
                    var email = tRow.value("EmailHome");

                    tableRow = internalTable.addRow();
                    //tableRow.addCell("Utente: ", "border-left border-top border-bottom headerTable italic", 1);
                    tableRow.addCell("Id", "border-left border-top border-bottom headerTable bold", 1);
                    tableRow.addCell("Nome", "border-top headerTable bold", 1);
                    tableRow.addCell("Cognome", "border-top headerTable bold", 1);
                    tableRow.addCell("Telefono", "border-top headerTable bold", 1);
                    tableRow.addCell("Email", "border-top headerTable bold", 1);
                    tableRow.addCell("Libri: ", "border-left border-top border-bottom headerTable italic", 1);
                    tableRow.addCell("Data", " border-top border-bottom headerTable bold", 1);
                    tableRow.addCell("Id", "border-left border-top border-bottom headerTable bold", 1);
                    tableRow.addCell("Descrizione", "border-left border-top border-bottom headerTable bold", 1);
                    tableRow.addCell("Data scadenza", "border-left border-top border-bottom headerTable bold", 1);
                    tableRow.addCell("Note", "border-left border-top border-bottom headerTable bold", 1);
                    tableRow.addCell("Data restituzione", "border-left border-top border-bottom headerTable bold", 1);

                    tableRow = internalTable.addRow();
                    //tableRow.addCell("", "border-left", 1);
                    tableRow.addCell(id, "border-left border-top", 1);
                    tableRow.addCell(firstName, "border-top", 1);
                    tableRow.addCell(familyName, "border-top", 1);
                    tableRow.addCell(phone, "border-top", 1);
                    tableRow.addCell(email, "border-top", 1);
                }
            }
        }

        /*
            LISTA LIBRI
        */
        var frow = true;
        for (var i = 0; i < loansTable.rowCount; i++) {
            var tRow = loansTable.row(i);
            
            if (currentUser === tRow.value("ContactsId")) {

                var date = tRow.value("Date");
                var itemsId = tRow.value("ItemsId");
                var itemsDescription = tRow.value("ItemsDescription");
                var dateExpiration = tRow.value("DateExpiration");
                var notes = tRow.value("Notes");
                var expirationDate = Banana.Converter.toDate(dateExpiration);
                var dateReturn = tRow.value("DateReturn");


                itemsDescription = itemsDescription.split(";");
                itemsDescription = itemsDescription[0];

                //Not yet expired
                if (today < expirationDate) { //!printExpired && today < expirationDate

                    if (!frow) {
                        tableRow = internalTable.addRow();
                        tableRow.addCell("", "border-left", 1);
                        tableRow.addCell("", "", 1);
                        tableRow.addCell("", "", 1);
                        tableRow.addCell("", "", 1);
                        tableRow.addCell("", "", 1);
                    }
                    tableRow.addCell(booksCnt+1 + ".", "border-left center", 1);
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(date), "border-top border-bottom center", 1);
                    tableRow.addCell(itemsId, "border-top border-bottom", 1);
                    tableRow.addCell(itemsDescription, "border-top border-bottom", 1);
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateExpiration), "border-top border-bottom center", 1);
                    tableRow.addCell(notes, "border-top border-bottom", 1);
                    tableRow.addCell(dateReturn, "border-top border-bottom center", 1);

                    frow = false;

                    booksCnt++;

                }

                //Expired
                if (printExpired && today > expirationDate && !dateReturn) {

                    if (!frow) {
                        tableRow = internalTable.addRow();
                        tableRow.addCell("", "border-left", 1);
                        tableRow.addCell("", "", 1);
                        tableRow.addCell("", "", 1);
                        tableRow.addCell("", "", 1);
                        tableRow.addCell("", "", 1);

                    }
                    tableRow.addCell(booksCnt+1 + ".", "border-left center", 1);
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(date), "border-top border-bottom center", 1);
                    tableRow.addCell(itemsId, "border-top border-bottom", 1);
                    tableRow.addCell(itemsDescription, "border-top border-bottom", 1);
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateExpiration), "warning bold border-top border-bottom center", 1);
                    tableRow.addCell(notes, "warning bold border-top border-bottom", 1);
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateReturn), "border-top border-bottom center", 1);
                    
                    frow = false;
                    
                    booksCnt++;
                }

                //Already returned
                if (dateReturn && today > expirationDate) {

                    if (!frow) {
                        tableRow = internalTable.addRow();
                        tableRow.addCell("", "border-left", 1);
                        tableRow.addCell("", "", 1);
                        tableRow.addCell("", "", 1);
                        tableRow.addCell("", "", 1);
                        tableRow.addCell("", "", 1);
                    }
                    tableRow.addCell(booksCnt+1 + ".", "border-left center", 1);
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(date), "border-top border-bottom center", 1);
                    tableRow.addCell(itemsId, "border-top border-bottom", 1);
                    tableRow.addCell(itemsDescription, "border-top border-bottom", 1);
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateExpiration), "border-top border-bottom center", 1);
                    tableRow.addCell(notes, "border-top border-bottom", 1);
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateReturn), "warningOK bold border-top border-bottom center", 1);

                    frow = false;
                    
                    booksCnt++;
                }
            }
        }

        //If the table is empty (the user has not books on the list) we print an empty line
        if (booksCnt == 0) {

            //tableRow = internalTable.addRow();
            tableRow.addCell("", "", 1);
            tableRow.addCell("-", "border-top border-bottom center", 1);
            tableRow.addCell("-", "border-top border-bottom center", 1);
            tableRow.addCell("-", "border-top border-bottom center", 1);
            tableRow.addCell("-", "border-top border-bottom center", 1);
            tableRow.addCell("-", "border-top border-bottom center", 1);
            tableRow.addCell("-", "border-top border-bottom center", 1);
        }

        tableRow = internalTable.addRow();
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
        tableRow.addCell("", "border-top", 1);
    }

    //Print the footer
    addFooter(report);

    //Add a style and print the report
    var stylesheet = createStyleSheet();
    Banana.Report.preview(report, stylesheet);
}




/* Functin that prints the user card */
function printUserCard(users, contactsTable, loansTable, printExpired, printOptions) {

    param.orientamentoPagina = "verticale";
    var report = Banana.Report.newReport("Scheda utente");

    if (printOptions === "Scheda con fine pagina") {
        for (var i = 0; i < users.length; i++) {

            //Print the header
            addHeader(report);

            //Print the user informations
            printAddress(users[i].trim(), contactsTable, report);

            //Print the books list
            printBooksList(users[i].trim(), contactsTable, loansTable, printExpired, report);
            
            if (i < users.length-1) {
                report.addPageBreak();
            }
        }
    }
    else if (printOptions === "Scheda senza fine pagina") {

        //Print the header
        addHeader(report);

        for (var i = 0; i < users.length; i++) {

            //Print the user informations
            printAddress(users[i].trim(), contactsTable, report);

            //Print the books list
            printBooksList(users[i].trim(), contactsTable, loansTable, printExpired, report);
        }
    }

    // for (var i = 0; i < users.length; i++) {
        
    //     //Print the header
    //     addHeader(report);

    //     //Print the user informations
    //     printAddress(users[i].trim(), contactsTable, report);

    //     //Print the books list
    //     printBooksList(users[i].trim(), contactsTable, loansTable, printExpired, report);
        
    //     if (printOptions === "Scheda con fine pagina") {
    //         if (i < users.length-1) {
    //             report.addPageBreak();
    //         }
    //     }
    // }





    //Print the footer
    addFooter(report);

    //Add a style and print the report
    var stylesheet = createStyleSheet();
    Banana.Report.preview(report, stylesheet);
}




/* Function that prints all the books list for the given user */
function printBooksList(user, contactsTable, loansTable, printExpired, report) {

    report.addParagraph(Banana.document.info("Loans","TableHeader") + ":", "");
    report.addParagraph(" ", "");

    var booksCnt = 0;
    var today = new Date();

    //Create a table
    var booksTable = report.addTable("booksTable");
    
    //Add the header to the table
    var tableHeader = booksTable.getHeader();
    tableRow = tableHeader.addRow();
    tableRow.addCell("Data", "border-left border-top bold headerTable", 1);
    tableRow.addCell("Descrizione libro", "border-left border-top bold headerTable", 1);
    tableRow.addCell("Scadenza", "border-left border-top bold headerTable", 1);
    tableRow.addCell("Note", "border-left border-top border-right bold headerTable", 1);    

    //We print all the books list
    if (!printExpired) {
        for (var i = 0; i < loansTable.rowCount; i++) {
            var tRow = loansTable.row(i);
            
            if (user === tRow.value("ContactsId")) {

                var dateReturn = tRow.value("DateReturn");

                if (!dateReturn) {
                    var date             = tRow.value("Date");
                    var itemsDescription = tRow.value("ItemsDescription");
                    var dateExpiration   = tRow.value("DateExpiration");
                    var notes            = tRow.value("Notes");
                    var expirationDate = Banana.Converter.toDate(dateExpiration);
                         
                    tableRow = booksTable.addRow();
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(date), "border-top border-left border-bottom padding-top padding-bottom", 1);
                    tableRow.addCell(itemsDescription, "border-top border-left border-bottom padding-top padding-bottom", 1);
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateExpiration), "border-top border-left border-bottom padding-top padding-bottom", 1);
                    
                    var notesCell = tableRow.addCell("", "border-top border-left border-bottom border-right padding-top padding-bottom", 1);
                    notesCell.addParagraph(notes, "");

                    if (today > expirationDate) {
                        notesCell.addParagraph("SCADUTO", "warning bold", 1);
                    }

                    booksCnt++;
                }
            }
        }
        //If the table is empty (the user has not books on the list) we print an empty line
        if (booksCnt == 0) {
            tableRow = booksTable.addRow();
            tableRow.addCell("-", "border-top border-left border-bottom center", 1);
            tableRow.addCell("-", "border-top border-left border-bottom center", 1);
            tableRow.addCell("-", "border-top border-left border-bottom center", 1);
            tableRow.addCell("-", "border-top border-left border-bottom border-right center", 1);
        }

        report.addParagraph(" ", "");
    }

    //We print only expired books list
    else if (printExpired) {
        for (var i = 0; i < loansTable.rowCount; i++) {
            var tRow = loansTable.row(i);
            
            if (user === tRow.value("ContactsId")) {

                var dateReturn = tRow.value("DateReturn");
                var dateExpiration   = tRow.value("DateExpiration");
                var expirationDate = Banana.Converter.toDate(dateExpiration);

                if (today > expirationDate && !dateReturn) {

                    var date             = tRow.value("Date");
                    var itemsDescription = tRow.value("ItemsDescription");
                    var notes            = tRow.value("Notes");
                
                    tableRow = booksTable.addRow();
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(date), "border-top border-left border-bottom padding-top padding-bottom", 1);
                    tableRow.addCell(itemsDescription, "border-top border-left border-bottom padding-top padding-bottom", 1);
                    tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateExpiration), "border-top border-left border-bottom padding-top padding-bottom", 1);
                    //tableRow.addCell(notes, "border-top border-left border-bottom border-right padding-top padding-bottom", 1);

                    var notesCell = tableRow.addCell("", "border-top border-left border-bottom border-right padding-top padding-bottom", 1);
                    notesCell.addParagraph(notes, "");

                    if (today > expirationDate) {
                        notesCell.addParagraph("SCADUTO", "warning bold", 1);
                    }

                }
            }
        }
    }
    report.addParagraph(" ", "");
    report.addParagraph(" ", "");
}




/* Function that prints the user information */
function printAddress(user, contactsTable, report) {

    report.addParagraph(Banana.document.info("Contacts","TableHeader") + ":", "");
    report.addParagraph(" ", "");

    //Create a table
    var infoTable = report.addTable("infoTable");

    for (var i = 0; i < contactsTable.rowCount; i++) {
        var tRow = contactsTable.row(i);

        if (!tRow.isEmpty) {

            if (user === tRow.value("RowId")) {

                tableRow = infoTable.addRow();
                tableRow.addCell("Id", "italic", 1);
                tableRow.addCell(tRow.value("RowId"), "", 1);

                tableRow = infoTable.addRow();
                tableRow.addCell("Nome e Cognome", "italic", 1);
                tableRow.addCell(tRow.value("FirstName") + " " + tRow.value("FamilyName"), "", 1);
                
                tableRow = infoTable.addRow();
                var addressCell1 = tableRow.addCell();
                addressCell1.addParagraph("Indirizzo", "italic", 1);
                addressCell1.addParagraph(" ", "", 1);

                var addressCell2 = tableRow.addCell();
                addressCell2.addParagraph(tRow.value("Street"), "italic", 1);
                addressCell2.addParagraph(tRow.value("PostalCode") + " " + tRow.value("Locality"), "", 1);
                
                tableRow = infoTable.addRow();
                tableRow.addCell("Telefono", "italic", 1);
                tableRow.addCell(tRow.value("PhoneHome"), "", 1);
                
                tableRow = infoTable.addRow();
                tableRow.addCell("Cellulare", "italic", 1);
                tableRow.addCell(tRow.value("PhoneMobile"), "", 1);
                
                tableRow = infoTable.addRow();
                tableRow.addCell("Email", "italic", 1);
                tableRow.addCell(tRow.value("EmailHome"), "", 1);
                
                tableRow = infoTable.addRow();
                tableRow.addCell("Membro dal", "italic", 1);
                tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value("MemberDateBegin")), "", 1);
                
                tableRow = infoTable.addRow();
                tableRow.addCell("Fine membro", "italic", 1);
                tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value("MemberDate")), "", 1);
            }
        }
    }
    report.addParagraph(" ", "");
    report.addParagraph(" ", "");
}




/* Get all the ID of the users that have expired books on their list */
function getExpiredIDs(table) {
    var IDsList = [];
    var today = new Date();

    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i);

        if (!tRow.isEmpty) {
            var id = tRow.value("ContactsId");
            var dateExpiration   = tRow.value("DateExpiration");
            var expirationDate = Banana.Converter.toDate(dateExpiration);
    
            if (today > expirationDate) {
                IDsList.push(id);
            }
        }
    }

    //Remove duplicates
    for (var i = 0; i < IDsList.length; i++) {
        for (var x = i+1; x < IDsList.length; x++) {
            if (IDsList[x] === IDsList[i]) {
                IDsList.splice(x,1);
                --x;
            }
        }
    }

    return IDsList.sort();
}




/* Get all the ID of the users */
function getIDs(table) {
    var IDsList = [];

    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i);

        if (!tRow.isEmpty) {
            var id = tRow.value("RowId");
            IDsList.push(id);
        }
    }
    return IDsList.sort();
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

    var tab = report.addTable("header");
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

    report.addParagraph(" ", "");
    report.addParagraph(" ", "");
}




/* Function that prints the footer */
function addFooter(report) {
    if (param.orientamentoPagina === "verticale") {
        var footer = report.getFooter();
        footer.addText(Banana.Converter.toLocaleDateFormat(new Date()) + "                                                               ");
        footer.addText("Banana Library" + "                                                               ").setUrlLink("http://www.banana.ch");
        footer.addFieldPageNr();
    }
    else if (param.orientamentoPagina === "orizzontale") {
        var footer = report.getFooter();
        footer.addText(Banana.Converter.toLocaleDateFormat(new Date()) + "                                                                                                                                       ");
        footer.addText("Banana Library" + "                                                                                                                                       ").setUrlLink("http://www.banana.ch");
        footer.addFieldPageNr();
    }
} 




/* Function that adds styles for the report print */
function createStyleSheet() {
    
    var stylesheet = Banana.Report.newStyleSheet();
    var pageStyle = stylesheet.addStyle("@page");
    //pageStyle.setAttribute("margin", "15mm 20mm 10mm 20mm");
    //pageStyle.setAttribute("size", "landscape");

    if (param.orientamentoPagina === "orizzontale") {
        var pageStyle = stylesheet.addStyle("@page");
        pageStyle.setAttribute("margin", "15mm 5mm 10mm 5mm");
        pageStyle.setAttribute("size", "landscape");

        var headerStyle = stylesheet.addStyle(".header");
        headerStyle.setAttribute("width", "60%");
        //stylesheet.addStyle("table.header td", "border: thin solid black;");
    }
    else if (param.orientamentoPagina === "verticale") {
        var pageStyle = stylesheet.addStyle("@page");
        pageStyle.setAttribute("margin", "15mm 20mm 10mm 20mm");
    
        var headerStyle = stylesheet.addStyle(".header");
        headerStyle.setAttribute("width", "100%");
        //stylesheet.addStyle("table.header td", "border: thin solid black");

    }

    stylesheet.addStyle("body", "font-family:Helvetica; font-size:9pt");
    stylesheet.addStyle(".italic", "font-style:italic;");
    stylesheet.addStyle(".bold", "font-weight:bold");
    stylesheet.addStyle(".left", "text-align:left");
    stylesheet.addStyle(".center", "text-align:center");
    stylesheet.addStyle(".right", "text-align:right");
    stylesheet.addStyle(".warning", "color:red");
    stylesheet.addStyle(".warningOK", "color:green");
    stylesheet.addStyle(".border-top", "border-top:thin solid black");
    stylesheet.addStyle(".border-right", "border-right:thin solid black");
    stylesheet.addStyle(".border-bottom", "border-bottom:thin solid black");
    stylesheet.addStyle(".border-left", "border-left:thin solid black");
    stylesheet.addStyle(".headerCol1", "width:20pt");
    stylesheet.addStyle(".headerCol2", "width:65pt");
    stylesheet.addStyle(".bigLogo", "font-size: 35");
    stylesheet.addStyle(".img", "heigth:50%;width:50%;padding-bottom:20pt");
    stylesheet.addStyle(".padding-top", "padding-top:6pt");
    stylesheet.addStyle(".padding-bottom", "padding-bottom:3pt");

    var titleStyle = stylesheet.addStyle(".title");
    titleStyle.setAttribute("font-size", "20");
    titleStyle.setAttribute("text-align", "center");
    titleStyle.setAttribute("font-weight", "bold");
    titleStyle.setAttribute("margin-bottom", "0.5em");

    var headerTableStyle = stylesheet.addStyle(".headerTable");
    headerTableStyle.setAttribute("background-color", "#E0E0E0");
    headerTableStyle.setAttribute("color", "black");

    var tableStyle = stylesheet.addStyle(".booksTable");
    tableStyle.setAttribute("width", "100%");
    //stylesheet.addStyle("table.booksTable td", "border: thin solid black;");

    var tableStyle = stylesheet.addStyle(".infoTable");
    tableStyle.setAttribute("width", "50%");
    stylesheet.addStyle("table.infoTable td", "border: thin solid black;");

    var tableStyle = stylesheet.addStyle(".internalTable");
    tableStyle.setAttribute("width", "100%");
    //stylesheet.addStyle("table.internalTable td", "border: thin solid black;");
    //stylesheet.addStyle("table.internalTable td", "padding-top:6pt;padding-bottom:3pt");

    return stylesheet;
}









////////////////////////////////////////////////////////////////////////////////////////////////

// /* Function that prints a list of all the users with the books list */
// function printLoansList(users, contactsTable, loansTable, printExpired, printOptions) {

//     param.orientamentoPagina = "orizzontale";
    
//     var report = Banana.Report.newReport("Schede utenti");
//     var today = new Date();

//     //Print the header
//     addHeader(report);

//     report.addParagraph(Banana.document.info("Loans","TableHeader") + ":", "");
//     report.addParagraph(" ", "");

//     //Create a table
//     var internalTable = report.addTable("internalTable");
    
//     for (var j = 0; j < users.length; j++) {
//         var booksCnt = 0;
//         var currentUser = users[j].trim();

//         //tableRow = internalTable.addRow();
//         //var intListCell = tableRow.addCell("", "border-top border-left border-right", 1);

//         /*
//             DATI UTENTE
//         */
//         for (var i = 0; i < contactsTable.rowCount; i++) {
//             var tRow = contactsTable.row(i);

//             if (!tRow.isEmpty) {

//                 if (currentUser === tRow.value("RowId")) {
//                     var id = tRow.value("RowId");
//                     var firstName = tRow.value("FirstName");
//                     var familyName = tRow.value("FamilyName");
//                     var phone = tRow.value("PhoneHome");
//                     var email = tRow.value("EmailHome");

//                     // intListCell.addText(id + "; " ,"");
//                     // intListCell.addText(firstName + " " + familyName + "; ","");
//                     // intListCell.addText(phone  + "; ", "");
//                     // intListCell.addText(email + ";", "");


//                     tableRow = internalTable.addRow();
//                     tableRow.addCell("Utente: ", "border-left border-top border-right border-bottom headerTable italic", 1);
//                     tableRow.addCell("Id", "border-left border-right border-top headerTable bold", 1);
//                     tableRow.addCell("Nome", "border-left border-right border-top headerTable bold", 1);
//                     tableRow.addCell("Cognome", "border-left border-right border-top headerTable bold", 1);
//                     tableRow.addCell("Telefono", "border-left border-right border-top headerTable bold", 1);
//                     tableRow.addCell("Email", "border-left border-right border-top headerTable bold", 1);

//                     tableRow = internalTable.addRow();
//                     tableRow.addCell("", "", 1);
//                     tableRow.addCell(id, " border-right border-top", 1);
//                     tableRow.addCell(firstName, "border-left border-right border-top", 1);
//                     tableRow.addCell(familyName, "border-left border-right border-top", 1);
//                     tableRow.addCell(phone, "border-left border-right border-top", 1);
//                     tableRow.addCell(email, "border-left border-right border-top", 1);
//                 }
//             }
//         }

//         tableRow = internalTable.addRow();
//         tableRow.addCell("Libri: ", "border-left border-top border-right border-bottom headerTable italic", 1);
//         tableRow.addCell("Data", " border-top border-right border-bottom headerTable bold", 1);
//         tableRow.addCell("Id", "border-left border-top border-right border-bottom headerTable bold", 1);
//         tableRow.addCell("Descrizione", "border-left border-top border-right border-bottom headerTable bold", 1);
//         tableRow.addCell("Data scadenza", "border-left border-top border-right border-bottom headerTable bold", 1);
//         tableRow.addCell("Note", "border-left border-top border-right border-bottom headerTable bold", 1);
//         tableRow.addCell("Data ritorno", "border-left border-top border-right border-bottom headerTable bold", 1);

//         /*
//             LISTA LIBRI
//         */
//         for (var i = 0; i < loansTable.rowCount; i++) {
//             var tRow = loansTable.row(i);
            
//             if (currentUser === tRow.value("ContactsId")) {

//                 var date             = tRow.value("Date");
//                 var itemsId          = tRow.value("ItemsId");
//                 var itemsDescription = tRow.value("ItemsDescription");
//                 var dateExpiration   = tRow.value("DateExpiration");
//                 var notes            = tRow.value("Notes");
//                 var expirationDate = Banana.Converter.toDate(dateExpiration);
//                 var dateReturn = tRow.value("DateReturn");


//                 //Not yet expired
//                 if (today < expirationDate) { //!printExpired && today < expirationDate
                    
//                     // tableRow = internalTable.addRow();
//                     // var intListCell = tableRow.addCell("", "border-left border-right", 1);

//                     // intListCell.addText(" - ", "");
//                     // intListCell.addText(Banana.Converter.toLocaleDateFormat(date) + "; ", "");
//                     // intListCell.addText(itemsDescription  + "; ", "");
//                     // intListCell.addText(notes, "");

//                     tableRow = internalTable.addRow();
//                     tableRow.addCell("", "", 1);
//                     tableRow.addCell(Banana.Converter.toLocaleDateFormat(date), " border-right border-top border-bottom", 1);
//                     tableRow.addCell(itemsId, "border-left border-right border-top border-bottom", 1);
//                     tableRow.addCell(itemsDescription, "border-left border-right border-top border-bottom", 1);
//                     tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateExpiration), "border-left border-right border-top border-bottom", 1);
//                     tableRow.addCell(notes, "border-left border-right border-top border-bottom", 1);
//                     tableRow.addCell(dateReturn, "border-left border-right border-top border-bottom", 1);

//                     booksCnt++;

//                 }

//                 //Expired
//                 if (printExpired && today > expirationDate && !dateReturn) {

//                     // tableRow = internalTable.addRow();
//                     // var intListCell = tableRow.addCell("", "border-left border-right", 1);

//                     // intListCell.addText(" - ", "");
//                     // intListCell.addText(Banana.Converter.toLocaleDateFormat(date) + "; ", "");
//                     // intListCell.addText(itemsDescription  + "; ", "");
//                     // intListCell.addText(notes  + "; ", "");
//                     // intListCell.addText("SCADUTO (" + Banana.Converter.toLocaleDateFormat(dateExpiration) + ")", "warning bold");

//                     tableRow = internalTable.addRow();
//                     tableRow.addCell("", "", 1);
//                     tableRow.addCell(Banana.Converter.toLocaleDateFormat(date), " border-right border-top border-bottom", 1);
//                     tableRow.addCell(itemsId, "border-left border-right border-top border-bottom", 1);
//                     tableRow.addCell(itemsDescription, "border-left border-right border-top border-bottom", 1);
//                     tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateExpiration), "border-left border-right warning bold border-top border-bottom", 1);
//                     tableRow.addCell(notes, "border-left border-right warning bold border-top border-bottom", 1);
//                     tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateReturn), "border-left border-right border-top border-bottom", 1);

//                     booksCnt++;
//                 }

//                 //Already returned
//                 if (dateReturn && today > expirationDate) {

//                     // tableRow = internalTable.addRow();
//                     // var intListCell = tableRow.addCell("", "border-left border-right", 1);

//                     // intListCell.addText(" - ", "");
//                     // intListCell.addText(Banana.Converter.toLocaleDateFormat(date) + "; ", "");
//                     // intListCell.addText(itemsDescription  + "; ", "");
//                     // intListCell.addText(notes, "");
//                     // intListCell.addText("RITORNATO (" + Banana.Converter.toLocaleDateFormat(dateReturn) + ")", "warningOK bold");

//                     tableRow = internalTable.addRow();
//                     tableRow.addCell("", "", 1);
//                     tableRow.addCell(Banana.Converter.toLocaleDateFormat(date), " border-right border-top border-bottom", 1);
//                     tableRow.addCell(itemsId, "border-left border-right border-top border-bottom", 1);
//                     tableRow.addCell(itemsDescription, "border-left border-right border-top border-bottom", 1);
//                     tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateExpiration), "border-left border-right border-top border-bottom", 1);
//                     tableRow.addCell(notes, "border-left border-right border-top border-bottom", 1);
//                     tableRow.addCell(Banana.Converter.toLocaleDateFormat(dateReturn), "border-left border-right warningOK bold border-top border-bottom", 1);

//                     booksCnt++;
//                 }
//             }
//         }

//         //If the table is empty (the user has not books on the list) we print an empty line
//         if (booksCnt == 0) {
//             // tableRow = internalTable.addRow();
//             // var intListCell = tableRow.addCell("", "border-bottom border-left border-right ", 1);
//             // intListCell.addText("","");

//             tableRow = internalTable.addRow();
//             tableRow.addCell("", "", 1);
//             tableRow.addCell("-", " border-top border-right border-bottom center", 1);
//             tableRow.addCell("-", "border-left border-top border-right border-bottom center", 1);
//             tableRow.addCell("-", "border-left border-top border-right border-bottom center", 1);
//             tableRow.addCell("-", "border-left border-top border-right border-bottom center", 1);
//             tableRow.addCell("-", "border-left border-top border-right border-bottom center", 1);
//             tableRow.addCell("-", "border-left border-top border-right border-bottom center", 1);
//         }

//         tableRow = internalTable.addRow();
//         tableRow.addCell("", "", 1);
//         tableRow.addCell("", "border-top", 1);
//         tableRow.addCell("", "border-top", 1);
//         tableRow.addCell("", "border-top", 1);
//         tableRow.addCell("", "border-top", 1);
//         tableRow.addCell("", "border-top", 1);
//         tableRow.addCell("", "border-top", 1);
    
//         tableRow = internalTable.addRow();
//         tableRow.addCell(" ", "", 1);
//         tableRow.addCell(" ", "", 1);
//         tableRow.addCell(" ", "", 1);
//         tableRow.addCell(" ", "", 1);
//         tableRow.addCell(" ", "", 1);
//     }

//     //Print the footer
//     addFooter(report);

//     //Add a style and print the report
//     var stylesheet = createStyleSheet();
//     Banana.Report.preview(report, stylesheet);

// }



