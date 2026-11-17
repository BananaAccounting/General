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
// @pubdate = 2017-10-24
// @publisher = Banana.ch SA
// @description = Transaction Voucher
// @task = app.command
// @doctype = *.*
// @outputformat = none
// @inputdatasource = none
// @timeout = -1
// @includejs = written-number.min.js


/**
    The BananaApp creates a voucher of the transactions for the selected Doc number.
    A dialog is used to let the user insert all the required settings.
    The settings are then saved and used as default settings for the future times.

    To Convert numbers to words we use the "written-number.min.js" distributed under The MIT License (MIT)
    Source of the repository on github: https://github.com/yamadapc/js-written-number
    Source of the .js on github: https://raw.githubusercontent.com/yamadapc/js-written-number/master/dist/written-number.min.js

    We use the function writtenNumber(1234, { lang: 'es' }); // => 'mil doscientos treinta y cuatro'
*/


/***********************************************************************************************************
    TRANSLATIONS
    To add a language:
      1. add an entry to TEXTS (same keys as "es")
      2. add its code to LANGUAGES
      3. add an item to LanguageComboBox in the .ui file, at the same position as in LANGUAGES
    "numberLang" must be a language supported by written-number.min.js (en, es, pt, fr, it, ...)
***********************************************************************************************************/

// Order must match the items of LanguageComboBox in the .ui file
var LANGUAGES = ["es", "en"];

var TEXTS = {
    "es": {
        "numberLang": "es",
        "currency": "bolivianos",

        // Dialog
        "dialogTitle": "Comprobante de transacción",
        "lblLanguage": "Idioma",
        "lblVoucherNumber": "Nº de Comprobante",
        "lblInstitucion": "Institución",
        "lblDireccion": "Dirección",
        "lblGestion": "Gestion",
        "lblCanceladoA": "Cancelado a",
        "lblPorConceptoDe": "Por concepto de",
        "lblEfectivo": "Efectivo",
        "lblCheque": "Cheque",
        "lblBancos": "Bancos",
        "lblElaborado": "Elaborado",
        "lblAutorizado": "Autorizado",
        "lblRecibiConforme": "Recibi conforme",
        "errorTitle": "Error",
        "errorEmptyVoucher": "El Nº de comprobante no puede estar vacío",

        // Report
        "reportTitle": "Comprobante de transacción",
        "hdrInstitucion": "INSTITUCIÓN:",
        "hdrDireccion": "DIRECCIÓN:",
        "hdrGestion": "GESTION:",
        "hdrFecha": "FECHA:",
        "hdrTipoCambio": "T. de C.:",
        "hdrNit": "NIT:",
        "hdrPagina": "N° DE PAG",
        "voucherTitle": "COMPROBANTE",
        "voucherNumber": "Nº DE COMPROBANTE: ",
        "infoCanceladoA": "CANCELADO A:",
        "infoPorConceptoDe": "POR CONCEPTO DE: ",
        "infoEfectivo": "EFECTIVO:",
        "infoCheque": "CHEQUE:",
        "infoBancos": "BANCOS:",
        "colCostCenter": "CENTRO DE COSTOS",
        "colAccount": "CUENTA",
        "colDescription": "DESCRIPCION",
        "colDebit": "DEBE BS",
        "colCredit": "HABER BS",
        "totals": "TOTALES",
        "amountInWords": "SON: ",
        "signElaborado": "ELABORADO",
        "signAutorizado": "AUTORIZADO",
        "signRecibiConforme": "RECIBI CONFORME"
    },
    "en": {
        "numberLang": "en",
        "currency": "bolivianos",

        // Dialog
        "dialogTitle": "Transaction Voucher",
        "lblLanguage": "Language",
        "lblVoucherNumber": "Voucher No.",
        "lblInstitucion": "Institution",
        "lblDireccion": "Address",
        "lblGestion": "Fiscal year",
        "lblCanceladoA": "Paid to",
        "lblPorConceptoDe": "Concept",
        "lblEfectivo": "Cash",
        "lblCheque": "Cheque",
        "lblBancos": "Bank",
        "lblElaborado": "Prepared by",
        "lblAutorizado": "Authorized by",
        "lblRecibiConforme": "Received by",
        "errorTitle": "Error",
        "errorEmptyVoucher": "Voucher number can't be empty",

        // Report
        "reportTitle": "Transaction Voucher",
        "hdrInstitucion": "INSTITUTION:",
        "hdrDireccion": "ADDRESS:",
        "hdrGestion": "FISCAL YEAR:",
        "hdrFecha": "DATE:",
        "hdrTipoCambio": "EXCHANGE RATE:",
        "hdrNit": "TAX ID:",
        "hdrPagina": "PAGE NO.",
        "voucherTitle": "VOUCHER",
        "voucherNumber": "VOUCHER NO.: ",
        "infoCanceladoA": "PAID TO:",
        "infoPorConceptoDe": "CONCEPT: ",
        "infoEfectivo": "CASH:",
        "infoCheque": "CHEQUE:",
        "infoBancos": "BANK:",
        "colCostCenter": "COST CENTER",
        "colAccount": "ACCOUNT",
        "colDescription": "DESCRIPTION",
        "colDebit": "DEBIT BS",
        "colCredit": "CREDIT BS",
        "totals": "TOTALS",
        "amountInWords": "THE SUM OF: ",
        "signElaborado": "PREPARED BY",
        "signAutorizado": "AUTHORIZED BY",
        "signRecibiConforme": "RECEIVED BY"
    }
};

function getTexts(lang) {
    return TEXTS[lang] || TEXTS[LANGUAGES[0]];
}

/**
    Default language when nothing is saved: document locale, then application locale, then first language
*/
function getDefaultLanguage() {
    var locale = "";
    if (Banana.document && Banana.document.locale) {
        locale = Banana.document.locale;
    } else if (Banana.application && Banana.application.locale) {
        locale = Banana.application.locale;
    }
    var lang = String(locale).substr(0, 2).toLowerCase();
    return LANGUAGES.indexOf(lang) >= 0 ? lang : LANGUAGES[0];
}


var param = {};
var dialog = Banana.Ui.createUi("ch.banana.apps.voucherhelvetas.dialog.ui");


function getSelectedLanguage() {
    return LANGUAGES[dialog.LanguageComboBox.currentIndex] || LANGUAGES[0];
}

/**
    Sets all dialog labels in the given language
*/
function updateDialogTexts(lang) {
    var t = getTexts(lang);
    dialog.windowTitle = t.dialogTitle;
    dialog.LanguageLabel.text = t.lblLanguage;
    dialog.VoucherNumberLabel.text = t.lblVoucherNumber;
    dialog.InstitucionLabel.text = t.lblInstitucion;
    dialog.DireccionLabel.text = t.lblDireccion;
    dialog.GestionLabel.text = t.lblGestion;
    dialog.CanceladoALabel.text = t.lblCanceladoA;
    dialog.PorConceptoDeLabel.text = t.lblPorConceptoDe;
    dialog.EfectivoLabel.text = t.lblEfectivo;
    dialog.CequeLabel.text = t.lblCheque;
    dialog.BancosLabel.text = t.lblBancos;
    dialog.ElaboradoLabel.text = t.lblElaborado;
    dialog.AutorizadoLabel.text = t.lblAutorizado;
    dialog.RecibiConformeLabel.text = t.lblRecibiConforme;
}

dialog.onLanguageChanged = function () {
    updateDialogTexts(getSelectedLanguage());
}

/**
    Checks all the data: if empty shows an error message
*/
dialog.checkdata = function () {

    var valid = true;

    if (dialog.VoucherNumberLineEdit.text.length <= 0) {
        var t = getTexts(getSelectedLanguage());
        Banana.Ui.showInformation(t.errorTitle, t.errorEmptyVoucher);
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
            // Merge over defaults so settings saved by older versions (without "language") still work.
            // voucherNumber is kept from the cursor, not from the saved settings.
            var saved = JSON.parse(data);
            for (var key in saved) {
                if (key !== "voucherNumber") {
                    param[key] = saved[key];
                }
            }

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

    // Language
    if (LANGUAGES.indexOf(param["language"]) < 0) {
        param["language"] = getDefaultLanguage();
    }
    dialog.LanguageComboBox.currentIndex = LANGUAGES.indexOf(param["language"]);
    updateDialogTexts(param["language"]);

    // Pause and resume are used to change the cursor aspect
    Banana.application.progressBar.pause();
    var dlgResult = dialog.exec();
    Banana.application.progressBar.resume();

    if (dlgResult !== 1) {
        return false;
    }

    // Read all the fields of the dialog and save the values as parameters
    param["language"] = getSelectedLanguage();
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
        "language": "",
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
    Dialog's events declaration
*/
var requiredVersion = "8.0.7.171016";
if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) >= 0) {
    dialog.buttonBox.accepted.connect(dialog.checkdata); //Clicked Ok button
    dialog.buttonBox.rejected.connect(dialog.close);  //Clicked Cancel button
    dialog.LanguageComboBox.currentIndexChanged.connect(dialog.onLanguageChanged);
} else {
    dialog.buttonBox.accepted.connect(dialog, "checkdata"); //Clicked Ok button
    dialog.buttonBox.rejected.connect(dialog, "close"); //Clicked Cancel button
    dialog.LanguageComboBox.currentIndexChanged.connect(dialog, "onLanguageChanged");
}

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
        var report = Banana.Report.newReport(getTexts(param["language"]).reportTitle);

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

    var t = getTexts(param["language"]);

    addFooter(report);

    //Table Journal
    var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);
    // Start from "0" so totals and amount in words are valid even if no row matches
    var totDebit = "0";
    var totCredit = "0";
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
    imageCell.addImage("file:script/logo.png", "4cm", "1.5cm");

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
    headerCell1.addParagraph(t.hdrInstitucion,  "bold");
    headerCell1.addParagraph(t.hdrDireccion, "");
    headerCell1.addParagraph(t.hdrGestion, "");

    var headerCell2 = tableRow.addCell("", "borderBottom", 1);
    headerCell2.addParagraph(param["Institucion"], "");
    headerCell2.addParagraph(param["Direccion"], "");
    headerCell2.addParagraph(param["Gestion"], "");

    var headerCell3 = tableRow.addCell("", "borderBottom", 1);
    headerCell3.addParagraph(t.hdrFecha,  "");
    headerCell3.addParagraph(t.hdrTipoCambio, "");
    headerCell3.addParagraph(t.hdrNit, "");
    headerCell3.addParagraph(t.hdrPagina, "");

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
    report.addParagraph(t.voucherTitle, "heading1 alignCenter");
    report.addParagraph(" ", "");
    report.addParagraph(t.voucherNumber + docNumber, "heading2 alignCenter");
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
    tableRow.addCell(t.infoCanceladoA, "styleTitle ", 1);
    tableRow.addCell(param["CanceladoA"], "", 5);

    tableRow = table.addRow();
    tableRow.addCell(t.infoPorConceptoDe, "styleTitle ", 1);
    tableRow.addCell(param["PorConceptoDe"], "", 5);

    tableRow = table.addRow();
    tableRow.addCell(t.infoEfectivo, "styleTitle ", 1);
    tableRow.addCell(param["Efectivo"], "", 1);
    tableRow.addCell(t.infoCheque, "styleTitle ", 1);
    tableRow.addCell(param["Cheque"], "", 1);
    tableRow.addCell(t.infoBancos, "styleTitle ", 1);
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
    var tableHeader = table.getHeader();
    tableRow = tableHeader.addRow();

    tableRow.addCell(t.colCostCenter, "styleTitle alignCenter borderLeft borderRight borderTop borderBottom", 1);
    tableRow.addCell(t.colAccount, "styleTitle alignCenter borderLeft borderRight borderTop borderBottom", 1);
    tableRow.addCell(t.colDescription, "styleTitle alignCenter borderLeft borderRight borderTop borderBottom", 1);
    tableRow.addCell(t.colDebit, "styleTitle alignCenter borderLeft borderRight borderTop borderBottom", 1);
    tableRow.addCell(t.colCredit, "styleTitle alignCenter borderLeft borderRight borderTop borderBottom", 1);

    // Journal column -> prefix used in the Accounts table
    var costCenters = [
        { column: 'JCC1', prefix: '.' },
        { column: 'JCC2', prefix: ',' },
        { column: 'JCC3', prefix: ';' }
    ];

    //Print transactions row
    for (i = 0; i < journal.rowCount; i++) {
        var tRow = journal.row(i);

        //Take the row from the journal that has the same "Doc" as the one selectet by the user (cursor)
        if (tRow.value('Doc') === docNumber) {
            tableRow = table.addRow();

            // 1. CC1/CC2/CC3
            tableRow.addCell("", "borderLeft", 1);

            // 2. ACCOUNT
            tableRow.addCell(tRow.value('JAccount'), "borderLeft", 1);

            // 3. ACCOUNT DESCRIPTION
            tableRow.addCell(tRow.value('JAccountDescription'), "bold borderLeft", 1);

            // 4. ACCOUNT AMOUNT
            var amount = Banana.SDecimal.abs(tRow.value('JAmount'));
            // Debit
            if (Banana.SDecimal.sign(tRow.value('JAmount')) > 0 ) {
                totDebit = Banana.SDecimal.add(totDebit, tRow.value('JDebitAmount'), {'decimals':2});
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount), "alignRight borderLeft borderRight", 1);
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(""), "alignRight borderLeft borderRight", 1);
            }
            // Credit
            else {
                totCredit = Banana.SDecimal.add(totCredit, tRow.value('JCreditAmount'), {'decimals':2});
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(""), "alignRight borderLeft borderRight", 1);
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount), "alignRight borderLeft borderRight", 1);
            }

            //5. TRANSACTION DESCRIPTION
            tableRow = table.addRow();
            tableRow.addCell("", "borderLeft", 1);
            tableRow.addCell("", "borderLeft", 1);
            tableRow.addCell(tRow.value('Description'), "borderLeft", 1);
            tableRow.addCell("", "borderLeft", 1);
            tableRow.addCell("", "borderLeft borderRight", 1);

            //6. CC1, CC2, CC3
            for (var c = 0; c < costCenters.length; c++) {
                var cc = tRow.value(costCenters[c].column);
                if (cc) {
                    tableRow = table.addRow();
                    tableRow.addCell(cc, "borderLeft", 1);
                    tableRow.addCell("", "borderLeft", 1);
                    tableRow.addCell(getDescription(cc, costCenters[c].prefix), "borderLeft", 1);
                    tableRow.addCell("", "borderLeft", 1);
                    tableRow.addCell("", "borderLeft borderRight", 1);
                }
            }

            tableRow = table.addRow();
            tableRow.addCell("", "borderLeft borderRight borderBottom", 1);
            tableRow.addCell("", "borderLeft borderRight borderBottom", 1);
            tableRow.addCell("", "borderLeft borderRight borderBottom", 1);
            tableRow.addCell("", "borderLeft borderRight borderBottom", 1);
            tableRow.addCell("", "borderLeft borderRight borderBottom", 1);
        }
    }

    //Total Line
    tableRow = table.addRow();
    tableRow.addCell(t.totals,"bold alignRight borderLeft borderRight borderTop borderBottom", 3);
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totDebit), "bold alignRight borderLeft borderRight borderTop borderBottom", 1);
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totCredit), "bold alignRight borderLeft borderRight borderTop borderBottom", 1);

    /***********************************************************************************************************
        AMOUNT IN WORDS
    ***********************************************************************************************************/
    report.addParagraph(" ", "");
    report.addParagraph(" ", "");
    report.addParagraph(t.amountInWords + getAmountInWords(totDebit, t));

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
    tableRow.addCell(t.signElaborado, "styleTitle alignCenter", 1);
    tableRow.addCell(t.signAutorizado, "styleTitle alignCenter", 1);
    tableRow.addCell(t.signRecibiConforme, "styleTitle alignCenter", 1);
}

/**
    Converts an amount string (ex. "952.90") into words without rounding:
    "952.90" => "novecientos cincuenta y dos 90/100 bolivianos".
    writtenNumber() rounds, so integer part and cents are handled separately.
*/
function getAmountInWords(amount, t) {
    var parts = String(amount || "0").replace("-", "").split(".");
    var integerPart = parts[0] || "0";
    var cents = ((parts[1] || "") + "00").substr(0, 2);
    return writtenNumber(integerPart, { lang: t.numberLang }) + " " + cents + "/100 " + t.currency;
}

/**
    Returns the description of the given cost center.
    prefix: "." for CC1, "," for CC2, ";" for CC3
*/
function getDescription(account, prefix) {
    var table = Banana.document.table("Accounts");
    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i);
        if (prefix + account === tRow.value("Account")) {
            return tRow.value("Description");
        }
    }
    return "";
}

/**
    This function adds a Footer to the report
*/
function addFooter(report) {
   report.getFooter().addClass("footer");
   var versionLine = report.getFooter().addText("Banana Accounting", "description");
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
    stylesheet.addStyle(".underline", "text-decoration:underline;");
    stylesheet.addStyle(".borderLeft", "border-left:thin solid black");
    stylesheet.addStyle(".borderTop", "border-top:thin solid black");
    stylesheet.addStyle(".borderRight", "border-right:thin solid black");
    stylesheet.addStyle(".borderBottom", "border-bottom:thin solid black");

    //Table header
    style = stylesheet.addStyle("table");
    style.setAttribute("width", "100%");
    style.setAttribute("font-size", "8px");
    stylesheet.addStyle("table.table td", "padding-bottom: 2px; padding-top: 5px");
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
    stylesheet.addStyle("table.tableData td", "");
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
