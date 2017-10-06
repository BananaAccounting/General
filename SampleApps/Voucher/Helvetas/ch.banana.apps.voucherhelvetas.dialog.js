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
// @id = ch.banana.apps.transactionvoucherhelvetas
// @api = 1.0
// @pubdate = 2017-10-06
// @publisher = Banana.ch SA
// @description = Transaction Voucher
// @task = app.command
// @doctype = *.*
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



/**
    The BananaApp creates a voucher of the transactions for the selected Doc number.
    A dialog is used to let the user insert all the required settings.
    The settings are then saved and used as default settings for the future times.

    The voucher is created using Helvetas template.
*/



var param = {};
var dialog = Banana.Ui.createUi("ch.banana.apps.voucherhelvetas.dialog.ui");



/**
    Checks all the data: if empty shows an error message
*/
dialog.checkdata = function () {

    var valid = true;

    if (dialog.VoucherNumberLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Text can't be empty");
        valid = false;
    }

    if (valid) {
        dialog.accept();
    }

}

/** 
    Runs the dialog and set the parameters
*/
function dialogExec() {

    // Read saved script settings
    initParam();

    // Read script settings and use them for the dialog
    if (Banana.document) {
        var data = Banana.document.scriptReadSettings();
        if (data.length > 0) {
            param = JSON.parse(data);
        
            // Load saved settings
            dialog.InstitucionLineEdit.text = param["Institucion"];
            dialog.DireccionLineEdit.text = param["Direccion"];
            dialog.GestionLineEdit.text = param["Gestion"];
            dialog.CanceladoALineEdit.text = param["CanceladoA"];
            dialog.PorConceptoDeLineEdit.text = param["PorConceptoDe"];
            dialog.EfectivoLineEdit.text = param["Efectivo"];
            dialog.ChequeLineEdit.text = param["Cheque"];
            dialog.BancosLineEdit.text = param["Bancos"];
            dialog.ElaboradoLineEdit.text = param["Elaborado"];
            dialog.AutorizadoLineEdit.text = param["Autorizado"];
            dialog.RecibiConformeLineEdit.text = param["RecibiConforme"];
        }
    }

    // Pause and resume are used to change the cursor aspect
    Banana.application.progressBar.pause();
    var dlgResult = dialog.exec();
    Banana.application.progressBar.resume();

    if (dlgResult !== 1) {
        return false;
    }

    // Read all the fields of the dialog and save the values as parameters 
    param["voucherNumber"] = dialog.VoucherNumberLineEdit.text;
    param["Institucion"] = dialog.InstitucionLineEdit.text;
    param["Direccion"] = dialog.DireccionLineEdit.text;
    param["Gestion"] = dialog.GestionLineEdit.text;
    param["CanceladoA"] = dialog.CanceladoALineEdit.text;
    param["PorConceptoDe"] = dialog.PorConceptoDeLineEdit.text;
    param["Efectivo"] = dialog.EfectivoLineEdit.text;
    param["Cheque"] = dialog.ChequeLineEdit.text;
    param["Bancos"] = dialog.BancosLineEdit.text;
    param["Elaborado"] = dialog.ElaboradoLineEdit.text;
    param["Autorizado"] = dialog.AutorizadoLineEdit.text;
    param["RecibiConforme"] = dialog.RecibiConformeLineEdit.text;

    // Save script settings
    var paramToString = JSON.stringify(param);
    var value = Banana.document.scriptSaveSettings(paramToString);

    return true;
}

/** 
    Initialize dialog values with default values 
*/
function initParam() {
    param = {
        "voucherNumber": "",
        "Institucion": "",
        "Direccion": "",
        "Gestion": "",
        "CanceladoA": "",
        "PorConceptoDe": "",
        "Efectivo": "",
        "Cheque": "",
        "Bancos": "",
        "Elaborado": "",
        "Autorizado": "",
        "RecibiConforme": ""
    };

    //If selected take the doc number from the table transactions and insert it in the dialog
    var transactions = Banana.document.table('Transactions');
    var docNumber = transactions.row(Banana.document.cursor.rowNr).value('Doc');
    if (docNumber) {
        param["voucherNumber"] = docNumber;
        dialog.VoucherNumberLineEdit.text = param["voucherNumber"];
    }
}

/**
* Dialog's events declaration
*/
dialog.buttonBox.accepted.connect(dialog, "checkdata"); //Clicked Ok button
dialog.buttonBox.rejected.connect(dialog, "close"); //Clicked Cancel button

/**
    Main function
*/
function exec(inData) {

    //Calls dialog
    var rtnDialog = true;
    rtnDialog = dialogExec();

    if (rtnDialog && Banana.document) {
        Banana.document.clearMessages();

        //Create the report
        var report = Banana.Report.newReport("Voucher Transaction");
                
        //Function call to create the report using the Doc selected
        createReport(report, param["voucherNumber"]);

        //Add the styles
        var stylesheet = createStyleSheet();
        Banana.Report.preview(report, stylesheet);
    }
}

/**
    Using the given docNumber and all the parameters inserted in the dialog,
    read the journal and take all the data, and at the end creates the report
*/    
function createReport(report, docNumber) {
    
    addFooter(report);

    //Table Journal
    var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);
    var totDebit = "";
    var totCredit = "";
    var date = "";
    var description = "";
    var vouchernumber = "";
    var exchange = "";
    
    /***********************************************************************************************************
        HEADER TABLE
    ***********************************************************************************************************/
    report.addParagraph(" ", "");
    var pageHeader = report.getHeader();
    pageHeader.addClass("header");

    var table = pageHeader.addTable("table");
    var col1 = table.addColumn("col1");
    var col2 = table.addColumn("col2");
    var col3 = table.addColumn("col3");
    var col4 = table.addColumn("col4");
    var col5 = table.addColumn("col5");
    var col6 = table.addColumn("col6");

    //Add the image located in the script folder
    tableRow = table.addRow();
    var imageCell = tableRow.addCell("","",2);
    //If the table Documents contains an image we use it
    if (Banana.document.table("Documents") && Banana.document.table("Documents").findRowByValue("RowId", "logo").value("Attachments")) {
        imageCell.addImage("documents:logo", "", "");
    }
    else {
        imageCell.addParagraph(" ", "");
    }

    //Takes data of the selected DocOriginal transaction
    for (i = 0; i < journal.rowCount; i++) {
        var tRow = journal.row(i);
        if (docNumber && tRow.value('Doc') === docNumber) {
            date = tRow.value("Date");
            description = tRow.value("Description");
            vouchernumber = tRow.value("Doc");
            exchange = tRow.value("ExchangeRate");

        }
    }

    var headerCell1 = tableRow.addCell("", "borderBottom", 1);
    headerCell1.addParagraph("INSTITUCIÓN:",  "bold");
    headerCell1.addParagraph("DIRECCIÓN:", "");
    headerCell1.addParagraph("GESTION:", "");

    var headerCell2 = tableRow.addCell("", "borderBottom", 1);
    headerCell2.addParagraph(param["Institucion"], "");
    headerCell2.addParagraph(param["Direccion"], "");
    headerCell2.addParagraph(param["Gestion"], "");

    var headerCell3 = tableRow.addCell("", "borderBottom", 1);
    headerCell3.addParagraph("FECHA:",  "");
    headerCell3.addParagraph("T. de C.:", "");
    headerCell3.addParagraph("NIT:", "");
    headerCell3.addParagraph("N° DE PAG", "");

    var headerCell4 = tableRow.addCell("", "borderBottom", 1);
    headerCell4.addParagraph(Banana.Converter.toLocaleDateFormat(date), "");
    headerCell4.addParagraph(Banana.Converter.toLocaleNumberFormat(exchange), "");
    headerCell4.addParagraph(" ", "");
    headerCell4.addParagraph().addFieldPageNr();


    /***********************************************************************************************************
        INFO TABLE
    ***********************************************************************************************************/
    report.addParagraph(" ", "");
    report.addParagraph(" ", "");
    report.addParagraph("COMPROBANTE", "heading1 alignCenter");
    report.addParagraph(" ", "");
    report.addParagraph("Nº DE COMPROBANTE: " + docNumber, "heading2 alignCenter");
    report.addParagraph(" ", "");
    report.addParagraph(" ", "");

    var table = report.addTable("tableInfo");
    var colInfo1 = table.addColumn("colInfo1");
    var colInfo2 = table.addColumn("colInfo2");
    var colInfo3 = table.addColumn("colInfo3");
    var colInfo4 = table.addColumn("colInfo4");
    var colInfo5 = table.addColumn("colInfo5");
    var colInfo6 = table.addColumn("colInfo6");

    tableRow = table.addRow();
    tableRow.addCell("CANCELADO A:", "styleTitle ", 1);
    tableRow.addCell(param["CanceladoA"], "", 5);

    tableRow = table.addRow();
    tableRow.addCell("POR CONCEPTO DE: ", "styleTitle ", 1);
    tableRow.addCell(param["PorConceptoDe"], "", 5);

    tableRow = table.addRow();
    tableRow.addCell("EFECTIVO:", "styleTitle ", 1);
    tableRow.addCell(param["Efectivo"], "", 1);
    tableRow.addCell("CHEQUE:", "styleTitle ", 1);
    tableRow.addCell(param["Cheque"], "", 1);
    tableRow.addCell("BANCOS:", "styleTitle ", 1);
    tableRow.addCell(param["Bancos"], "", 1);

    report.addParagraph(" ", "");

    /***********************************************************************************************************
        DATA TABLE
    ***********************************************************************************************************/
    // Column header
    var table = report.addTable("tableData");
    var col1a = table.addColumn("col1a");
    var col2a = table.addColumn("col2a");
    var col3a = table.addColumn("col3a");
    var col4a = table.addColumn("col4a");
    var col5a = table.addColumn("col5a");
    // var col6a = table.addColumn("col6a");
    var tableHeader = table.getHeader();
    tableRow = tableHeader.addRow();  

    // tableRow.addCell("Date", "styleTitle alignCenter", 1);
    tableRow.addCell("CENTRO DE COSTOS", "styleTitle alignCenter", 1);
    tableRow.addCell("CUENTA", "styleTitle alignCenter", 1);
    tableRow.addCell("DESCRIPCION", "styleTitle alignCenter", 1);
    tableRow.addCell("DEBE BS", "styleTitle alignCenter", 1);
    tableRow.addCell("HABER BS", "styleTitle alignCenter", 1);

    //Print transactions row
    for (i = 0; i < journal.rowCount; i++) {
        var tRow = journal.row(i);

        //Take the row from the journal that has the same "Doc" as the one selectet by the user (cursor)
        if (tRow.value('Doc') === docNumber) {
            tableRow = table.addRow();  
            // tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('Date')), "", 1);
            tableRow.addCell(tRow.value('Cc1'), "", 1);
            tableRow.addCell(tRow.value('JAccount'), "", 1);
            tableRow.addCell(tRow.value('Description'), "", 1);

            var amount = Banana.SDecimal.abs(tRow.value('JAmount'));
            // Debit
            if (Banana.SDecimal.sign(tRow.value('JAmount')) > 0 ) {
                totDebit = Banana.SDecimal.add(totDebit, tRow.value('JDebitAmount'), {'decimals':2});
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount), "alignRight", 1);
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(""), "alignRight", 1);
            }
            // Credit
            else {
                totCredit = Banana.SDecimal.add(totCredit, tRow.value('JCreditAmount'), {'decimals':2});
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(""), "alignRight", 1);
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount), "alignRight", 1);
            }
        }
    }

    //Total Line
    tableRow = table.addRow();
    tableRow.addCell("TOTALES","bold alignRight", 3);
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totDebit), "bold alignRight", 1);
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totCredit), "bold alignRight", 1);

    /***********************************************************************************************************
        AMOUNT IN WORDS
    ***********************************************************************************************************/
    report.addParagraph(" ", "");
    report.addParagraph(" ", "");
    report.addParagraph("SON: " + getDigits(totDebit));
    report.addParagraph(" ", "");
    report.addParagraph(" ", "");

    /***********************************************************************************************************
        SIGNATURES TABLE
    ***********************************************************************************************************/
    var table = report.addTable("tableSignatures");
    var col1b = table.addColumn("col1b");
    var col2b = table.addColumn("col2b");
    var col3b = table.addColumn("col3b");

    tableRow = table.addRow();
    var cell1 = tableRow.addCell("", "", 1);
    cell1.addParagraph(" ", "");
    cell1.addParagraph(" ", "");
    cell1.addParagraph(" ", "");
    if (param["Elaborado"]) {
        cell1.addParagraph(param["Elaborado"], "alignCenter");
    } else {
        cell1.addParagraph(" ", "");
    }
    cell1.addParagraph(" ", "");
    cell1.addParagraph(" ", "");
    cell1.addParagraph(" ", "");

    var cell2 = tableRow.addCell("", "", 1);
    cell2.addParagraph(" ", "");
    cell2.addParagraph(" ", "");
    cell2.addParagraph(" ", "");
    if (param["Autorizado"]) {
        cell2.addParagraph(param["Autorizado"], "alignCenter");
    } else {
        cell2.addParagraph(" ", "");
    }
    cell2.addParagraph(" ", "");
    cell2.addParagraph(" ", "");
    cell2.addParagraph(" ", "");

    var cell3 = tableRow.addCell("", "", 1);
    cell3.addParagraph(" ", "");
    cell3.addParagraph(" ", "");
    cell3.addParagraph(" ", "");
    if (param["RecibiConforme"]) {
        cell3.addParagraph(param["RecibiConforme"], "alignCenter");
    } else {
        cell3.addParagraph(" ", "");
    }
    cell3.addParagraph(" ", "");
    cell3.addParagraph(" ", "");
    cell3.addParagraph(" ", "");

    tableRow = table.addRow();
    tableRow.addCell("ELABORADO", "styleTitle alignCenter", 1);
    tableRow.addCell("AUTORIZADO", "styleTitle alignCenter", 1);
    tableRow.addCell("RECIBI CONFORME", "styleTitle alignCenter", 1);
}

/** 
    Function that takes a number, split the digits and convert them in words 
*/
function getDigits(num) {

    var c2,c1,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11 = ""; //max number = 999'999'999'999.99
    var numberInWords = "";

    //replace everything except numbers to remove "."
    var arr = num.replace(/\D/g,''); //ex. 1'250.37 => arr=[1,2,5,0,3,7]
        
    if (arr[arr.length - 1]) {    
        c2 = numberToSpanish(arr[arr.length - 1]);
    }

    if (arr[arr.length - 2]) {
        c1 = numberToSpanish(arr[arr.length - 2]);
    }

    if (arr[arr.length - 3]) {
        a0 = numberToSpanish(arr[arr.length - 3]);
    }

    if (arr[arr.length - 4]) {
        a1 = numberToSpanish(arr[arr.length - 4]);
    }
        
    if (arr[arr.length - 5]) {
        a2 = numberToSpanish(arr[arr.length - 5]);
    }
    
    if (arr[arr.length - 6]) {
        a3 = numberToSpanish(arr[arr.length - 6]);
    }
        
    if (arr[arr.length - 7]) {
        a4 = numberToSpanish(arr[arr.length - 7]);
    }
        
    if (arr[arr.length - 8]) {
        a5 = numberToSpanish(arr[arr.length - 8]);
    }

    if (arr[arr.length - 9]) {
        a6 = numberToSpanish(arr[arr.length - 9]);
    }
        
    if (arr[arr.length - 10]) {
        a7 = numberToSpanish(arr[arr.length - 10]);
    }
       
    if (arr[arr.length - 11]) {
        a8 = numberToSpanish(arr[arr.length - 11]);
    }

    if (arr[arr.length - 12]) {
        a9 = numberToSpanish(arr[arr.length - 12]);
    }

    if (arr[arr.length - 13]) {
        a10 = numberToSpanish(arr[arr.length - 13]);
    }

    if (arr[arr.length - 14]) {
        a11 = numberToSpanish(arr[arr.length - 14]);
    }

    if (a11){ numberInWords += a11 + " "};
    if (a10){ numberInWords += a10 + " "};
    if (a9){ numberInWords += a9 + " "};
    if (a8){ numberInWords += a8 + " "};
    if (a7){ numberInWords += a7 + " "};
    if (a6){ numberInWords += a6 + " "};
    if (a5){ numberInWords += a5 + " "};
    if (a4){ numberInWords += a4 + " "};
    if (a3){ numberInWords += a3 + " "};
    if (a2){ numberInWords += a2 + " "};
    if (a1){ numberInWords += a1 + " "};
    if (a0){ numberInWords += a0 + " "};
    numberInWords += "punto ";
    if (c1){ numberInWords += c1 + " "};
    if (c2){ numberInWords += c2 + " "};

    return numberInWords;
}

/**
    Function that converts numbers to words
*/
function numberToSpanish(n) {
    var res = "";
    if (n === "0") {
        res = "cero";
    }
    else if (n === "1") { 
        res = "uno";
    }
    else if (n === "2") { 
        res = "dos";
    }
    else if (n === "3") { 
        res = "tres";
    }
    else if (n === "4") { 
        res = "cuatro";
    }
    else if (n === "5") { 
        res = "cinco";
    }
    else if (n === "6") { 
        res = "seis";
    }
    else if (n === "7") { 
        res = "siete";
    }
    else if (n === "8") { 
        res = "ocho";
    }
    else if (n === "9") { 
        res = "nueve";
    }    
    return res;
}

/**
    This function adds a Footer to the report
*/
function addFooter(report) {
   report.getFooter().addClass("footer");
   var versionLine = report.getFooter().addText("Banana Accounting 8", "description");
   //report.getFooter().addFieldPageNr();
}

/**
    This function creates styles for the print
*/
function createStyleSheet() {
    //Create stylesheet
    var stylesheet = Banana.Report.newStyleSheet();
    
    //Set page layout
    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "15mm 10mm 10mm 20mm");

    stylesheet.addStyle("body", "font-family : Helvetica");
    stylesheet.addStyle(".header", "font-size:8pt");
    stylesheet.addStyle(".footer", "text-align:right;font-size:8px;font-family:Courier New");
    stylesheet.addStyle(".heading1", "font-size:18px;font-weight:bold");
    stylesheet.addStyle(".heading2", "font-size:12px;font-weight:bold");
    stylesheet.addStyle(".bold", "font-weight:bold");
    stylesheet.addStyle(".alignRight", "text-align:right");
    stylesheet.addStyle(".alignCenter", "text-align:center");
    stylesheet.addStyle(".styleTitle", "font-weight:bold;background-color:#eeeeee");
    
    //Table header
    style = stylesheet.addStyle("table");
    style.setAttribute("width", "100%");
    style.setAttribute("font-size", "8px");
    stylesheet.addStyle("table.table td", "padding-bottom: 2px; padding-top: 5px");
    //stylesheet.addStyle("table.table td", "border: thin solid black; padding-bottom: 2px; padding-top: 5px");
    stylesheet.addStyle(".col1", "width:10%");
    stylesheet.addStyle(".col2", "width:5%");
    stylesheet.addStyle(".col3", "width:7%");
    stylesheet.addStyle(".col4", "width:20%");
    stylesheet.addStyle(".col5", "width:6%");
    stylesheet.addStyle(".col6", "width:10%");

    //Table info
    style = stylesheet.addStyle("tableInfo");
    style.setAttribute("width", "100%");
    style.setAttribute("font-size", "8px");
    stylesheet.addStyle("table.tableInfo td", "padding-bottom: 2px; padding-top: 5px");
    //stylesheet.addStyle("table.tableInfo td", "border: thin solid black; padding-bottom: 2px; padding-top: 5px");
    stylesheet.addStyle(".colInfo1", "width:17%");
    stylesheet.addStyle(".colInfo2", "width:20%");
    stylesheet.addStyle(".colInfo3", "width:10%");
    stylesheet.addStyle(".colInfo4", "width:20%");
    stylesheet.addStyle(".colInfo5", "width:10%");
    stylesheet.addStyle(".colInfo6", "width:20%");

    //Table data
    style = stylesheet.addStyle("tableData");
    style.setAttribute("width", "100%");
    style.setAttribute("font-size", "8px");
    stylesheet.addStyle("table.tableData td", "border: thin solid black; padding-bottom: 2px; padding-top: 5px");
    stylesheet.addStyle(".col1a", "width:12%");
    stylesheet.addStyle(".col2a", "width:12%");
    stylesheet.addStyle(".col3a", "");
    stylesheet.addStyle(".col4a", "width:12%");
    stylesheet.addStyle(".col5a", "width:12%");

    //Table signatures
    style = stylesheet.addStyle("tableSignatures");
    style.setAttribute("width", "100%");
    style.setAttribute("font-size", "8px");
    stylesheet.addStyle("table.tableSignatures td", "border: thin solid black; padding-bottom: 2px; padding-top: 5px");
    stylesheet.addStyle(".col1b", "width:33%");
    stylesheet.addStyle(".col2b", "width:33%");
    stylesheet.addStyle(".col3b", "width:33%");

    return stylesheet;
}


