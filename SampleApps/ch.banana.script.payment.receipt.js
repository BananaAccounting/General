// Copyright [2025] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.script.payment.receipt.js
// @api = 1.0
// @pubdate = 2025-05-06
// @publisher = Banana.ch SA
// @description = Payment receipt for cashbook
// @description.it = Ricevuta di pagamento per libro cassa
// @description.de = Zahlungseingang für Kassenbuch
// @description.fr = Reçu de paiement pour le livre de caisse
// @description.nl = Betalingsbewijs voor kasboek
// @description.en = Payment receipt for cashbook
// @task = app.command
// @doctype = 130.*
// @timeout = -1 


/*
 * Main function that prints a payment receipt
 */
function exec(string) {
  if (!Banana.document)
    return;

  // Report params
  var param = initParam();
  var savedParam = Banana.document.getScriptSettings();
  if (savedParam.length > 0) {
    param = JSON.parse(savedParam);
  }
  // If needed show the settings dialog to the user
  if (!options || !options.useLastSettings) {
    param = settingsDialog(); // From properties
  }
  if (!param) {
    return "@Cancel";
  }

  // Get the Doc or the row where ther cursor is positioned in table Transactions
  var transactions = Banana.document.table('Transactions');
  if (!transactions.row(Banana.document.cursor.rowNr))
    return;
  var tDoc = transactions.row(Banana.document.cursor.rowNr).value('Doc');
  if (!tDoc)
    return;

  // Translated texts
  var lang = Banana.document.locale;
  if (lang.length>2)
    lang = lang.substr(0,2);
  var texts = getTexts(lang);

  // Report
  var report = Banana.Report.newReport(texts.report_title + ' ' + tDoc);

  printPaymentReceipt(Banana.document, report, param, tDoc);

  // Stylesheet
  var stylesheet = createStylesheet(param);
  // Print preview
  Banana.Report.preview(report, stylesheet);

}

function printPaymentReceipt(banDoc, report, param, tDoc) {
  
  // Load data
  var journal = banDoc.journal(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL);
  var tRow = banDoc.table('Transactions').row(banDoc.cursor.rowNr);

  // Transaction rows
  var rowList = [];
  var totalAmount = "";
  for ( var i=0; i< journal.rowCount; i++) {
    var tRow = journal.row(i);
    if (tRow.value('Doc') == tDoc)
    {
      if (!isAccount(banDoc, tRow.value('JAccount')))
        continue;

      var rowObject = {};
      var transactionDate = tRow.value('JDate');
      var amount = Banana.SDecimal.invert(tRow.value('JAmount'));
      if (!Banana.SDecimal.isZero(amount)) {
        rowObject.amount = amount;
        totalAmount = Banana.SDecimal.add( totalAmount, amount);
        rowObject.type = 'amount';
      }
      else {
        rowObject.type = 'description';
      }
      rowObject.description = tRow.value('Description');
      rowList.push(rowObject);
    }
  }
  // Total row
  var rowObject = {};
  rowObject.amount = totalAmount;
  rowObject.description = "Total";
  rowObject.type = 'total';
  rowList.push(rowObject);

  // Translated texts
  var lang = banDoc.locale;
  if (lang.length>2)
    lang = lang.substr(0,2);
  var texts = getTexts(lang);

  // Report Header
  var headerTable = report.addTable("header_table");
  var col1 = headerTable.addColumn("header_col1");
  var tableRow;
  
  if (param.print_header) {
    var isLogoPresent = isLogoAvailable(banDoc);
    if (isLogoPresent) {
      tableRow = headerTable.addRow();
      var cell1 = tableRow.addCell();
      var paragraph = cell1.addParagraph();
      paragraph.addImage("documents:logo", "logoStyle");
      tableRow = headerTable.addRow();
      var cell1 = tableRow.addCell("","");
    }
    
    tableRow = headerTable.addRow();
    var cell1 = tableRow.addCell("", "sender");
    var senderLines = getSenderAddress(banDoc).split('\n');
    for (var i=0; i < senderLines.length; i++) {
      var className = "";
      if (i==0)
        className = "senderFirstRow";
      cell1.addParagraph(senderLines[i], className);
    }
  }
  
  // Report
  var docTable = report.addTable("doc_table");
  var docCol1 = docTable.addColumn("doc_col1");
  var docCol2 = docTable.addColumn("doc_col2");
  tableRow = docTable.addRow();
  
  // Report Title
  tableRow.addCell(texts.report_title + ' ' + tDoc, "title docTitle", 2);

  // Report Amount
  for ( i=0; i< rowList.length; i++) {
    if (rowList[i].type == 'total') {
      var currency = banDoc.info("AccountingDataBase", "BasicCurrency");
      var amount = Banana.SDecimal.abs(rowList[i].amount);
      tableRow = docTable.addRow();
      tableRow.addCell(currency + ' ' + Banana.Converter.toLocaleNumberFormat(amount), "total", 2);
      break;
    }
  }
  
  //Report Paid From
  if (Banana.SDecimal.sign(totalAmount) > 0 ){
    tableRow = docTable.addRow();
    tableRow.addCell(texts.report_paid_from, "title", 2);
    tableRow = docTable.addRow();
    var cell1 = tableRow.addCell("", "", 2);
    var senderLines = getSenderName(banDoc).split('\n');
    for (var i=0; i < senderLines.length; i++) {
      cell1.addParagraph(senderLines[i]);
    }
    tableRow = docTable.addRow();
    tableRow.addCell("", "line", 2);
  }
  else {
    //tableRow = docTable.addRow();
    //tableRow.addCell(texts.report_paid_from, "title", 2);
  }
  
  //Report Paid To
  if (Banana.SDecimal.sign(totalAmount) < 0 ){
    tableRow = docTable.addRow();
    tableRow.addCell(texts.report_paid_to, "title", 2);
    tableRow = docTable.addRow();
    var cell1 = tableRow.addCell("", "", 2);
    var senderLines = getSenderName(banDoc).split('\n');
    for (var i=0; i < senderLines.length; i++) {
      cell1.addParagraph(senderLines[i]);
    }
    tableRow = docTable.addRow();
    tableRow.addCell("", "line", 2);
  }
  else {
    //tableRow = docTable.addRow();
    //tableRow.addCell(texts.report_paid_from, "title", 2);
  }

  //Report Description
  tableRow = docTable.addRow();  
  tableRow.addCell(texts.report_description, "title", 2);
  for ( i=0; i< rowList.length; i++) {
    if (rowList[i].type == 'total')
      continue;
    
    // when used "#paidto" in descripion, we replace it with the "Paid to:" texts.
    if (rowList[i].description === "#paidto") {
      tableRow = docTable.addRow();
      tableRow.addCell(" ","");
      tableRow = docTable.addRow();
      var strpadito = rowList[i].description;
      strpadito = strpadito.replace("#paidto", texts.report_paid_to);
      tableRow.addCell(strpadito, "senderFirstRow");
    }
    else {
      tableRow = docTable.addRow();
      var cell = tableRow.addCell("","cellparagraph");
      var p = cell.addParagraph();
      addMdBoldText(p,rowList[i].description);
    }

    if (Banana.SDecimal.isZero(rowList[i].amount) || rowList[i].amount == totalAmount) {
      tableRow.addCell("", rowList[i].type);
    }
    else {
      var amount = rowList[i].amount;
      if (Banana.SDecimal.sign(totalAmount) < 0 ){
        amount = Banana.SDecimal.invert(amount);
      }
      tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount), rowList[i].type);
    }
  }
  
  // Report Signatures
  tableRow = docTable.addRow();
  tableRow.addCell(texts.report_date, "title", 2);
  tableRow = docTable.addRow();
  if (param.print_date) {
    tableRow.addCell(Banana.Converter.toLocaleDateFormat(transactionDate));
  } else {
    tableRow.addCell("", "dots", 2);
  }
  tableRow = docTable.addRow();
  tableRow.addCell(texts.report_received_by, "title", 2);
  tableRow = docTable.addRow();
  tableRow.addCell("", "dots", 2);
}

function isLogoAvailable(banDoc) {
  var isLogoAvailable = false;
  var documentsTable = banDoc.table("Documents");
  if (documentsTable) {
    var imageLogo = banDoc.table('Documents').findRowByValue('RowId', "logo");
    if (imageLogo) {
      var attachment = imageLogo.value("Attachments");
      if (attachment) {
        isLogoAvailable = true;
      }
    }
  }
  return isLogoAvailable;
}

/*
 * Get document style
 */
function createStylesheet(param) {
  var stylesheet = Banana.Report.newStyleSheet();

  var style = stylesheet.addStyle("@page");
  style.setAttribute("size", "portrait");

  if (param.font_family) {
    style = stylesheet.addStyle("body");
    style.setAttribute("font-family", param.font_family);
  }
  
  style = stylesheet.addStyle(".amount");
  style.setAttribute("text-align", "right");

  style = stylesheet.addStyle(".doc_table");
  style.setAttribute("margin-top", "5mm");
  style.setAttribute("margin-right", "10mm");
  //style.setAttribute("position", "absolute");
  style.setAttribute("width", "100%");

  style = stylesheet.addStyle(".doc_table td");
  style.setAttribute("padding-right", "30px");

  style = stylesheet.addStyle(".docTitle");
  style.setAttribute("padding-bottom", "5mm");
  style.setAttribute("font-size", "12px");

  style = stylesheet.addStyle("td.dots");
  style.setAttribute("border-bottom", "thin dotted black");
  style.setAttribute("padding-top", "15px");

  style = stylesheet.addStyle(".header_table");
  style.setAttribute("margin-top", "0mm");
  style.setAttribute("margin-right", "10mm");
  //style.setAttribute("position", "absolute");
  style.setAttribute("width", "100%");

  style = stylesheet.addStyle(".logoStyle");
  style.setAttribute("margin-top", "0mm");
  style.setAttribute("margin-left", "0mm"); 
  //style.setAttribute("position", "absolute");
  style.setAttribute("width", "120px"); 

  style = stylesheet.addStyle(".pageReset");
  style.setAttribute("counter-reset", "page");

  style = stylesheet.addStyle(".sender");
  style.setAttribute("font-size", "9px");
  
  style = stylesheet.addStyle(".senderFirstRow");
  style.setAttribute("font-weight", "bold");

  style = stylesheet.addStyle(".line");
  style.setAttribute("border-bottom", "thin solid black");

  style = stylesheet.addStyle(".title");
  style.setAttribute("font-weight", "bold");
  style.setAttribute("padding-top", "5mm");

  style = stylesheet.addStyle(".total");
  style.setAttribute("font-size", "14px");
  style.setAttribute("font-weight", "bold");
  style.setAttribute("padding-bottom", "5mm");
  
  style = stylesheet.addStyle(".cellparagraph");
  style.setAttribute("padding-top", "-3px");
  style.setAttribute("padding-bottom", "-3px");

  return stylesheet;
}

function getSenderAddress(banDoc) {
  
  var address = "";

  var accountingDataBase_Company = banDoc.info("AccountingDataBase", "Company");
  var accountingDataBase_Name = banDoc.info("AccountingDataBase", "Name");
  var accountingDataBase_FamilyName = banDoc.info("AccountingDataBase", "FamilyName");
  var accountingDataBase_Address1 = banDoc.info("AccountingDataBase", "Address1");
  var accountingDataBase_Address2 = banDoc.info("AccountingDataBase", "Address2");
  var accountingDataBase_Zip = banDoc.info("AccountingDataBase", "Zip");
  var accountingDataBase_City = banDoc.info("AccountingDataBase", "City");
  var accountingDataBase_State = banDoc.info("AccountingDataBase", "State");
  var accountingDataBase_Country = banDoc.info("AccountingDataBase", "Country");
  var accountingDataBase_Web = banDoc.info("AccountingDataBase", "Web");
  var accountingDataBase_Email = banDoc.info("AccountingDataBase", "Email");
  var accountingDataBase_Phone = banDoc.info("AccountingDataBase", "Phone");
  var accountingDataBase_Mobile = banDoc.info("AccountingDataBase", "Mobile");
  var accountingDataBase_Fax = banDoc.info("AccountingDataBase", "Fax");
  var accountingDataBase_FiscalNumber = banDoc.info("AccountingDataBase", "FiscalNumber");
  var accountingDataBase_VatNumber = banDoc.info("AccountingDataBase", "VatNumber");

  if (accountingDataBase_Company) {
    address = accountingDataBase_Company + " ";
  }
  
  if (accountingDataBase_Name) {
    address = address + accountingDataBase_Name + " ";
  }
 
  if (accountingDataBase_FamilyName) {
    address = address + accountingDataBase_FamilyName;
  }

  if (accountingDataBase_Company || accountingDataBase_Name || accountingDataBase_FamilyName) {
    address = address + "\n";
  }
  
  if (accountingDataBase_Address1) {
    address = address + accountingDataBase_Address1 + " ";
  }
  
  if (accountingDataBase_Address2) {
    address = address + accountingDataBase_Address2 + " ";
  }

  if (accountingDataBase_Zip) {
    address = address + accountingDataBase_Zip + "-";
  }
  
  if (accountingDataBase_City) {
    address = address + accountingDataBase_City + " ";
  }
  
  if (accountingDataBase_Country) {
    address = address + accountingDataBase_Country;
  }

  if (accountingDataBase_Address1 || accountingDataBase_Address2 || accountingDataBase_Zip || accountingDataBase_City || accountingDataBase_Country) {
    address = address + "\n";
  }
  
  if (accountingDataBase_Phone) {
    address = address + accountingDataBase_Phone + " ";
  }
  
  if (accountingDataBase_Fax) {
    address = address + accountingDataBase_Fax + " ";
  }
  
  if (accountingDataBase_Email) {
    address = address + accountingDataBase_Email + " ";
  }
  
  if (accountingDataBase_Web) {
    address = address + accountingDataBase_Web + " ";
  }
 
  if (accountingDataBase_VatNumber) {
    address = address + accountingDataBase_VatNumber;
  }

  if (accountingDataBase_Phone || accountingDataBase_Fax || accountingDataBase_Email || accountingDataBase_Web || accountingDataBase_VatNumber) {
    address = address + "\n";
  }
  
  return address;
}

function getSenderName(banDoc) {
  
  var address = "";

  var accountingDataBase_Company = banDoc.info("AccountingDataBase", "Company");
  var accountingDataBase_Name = banDoc.info("AccountingDataBase", "Name");
  var accountingDataBase_FamilyName = banDoc.info("AccountingDataBase", "FamilyName");
  var accountingDataBase_Zip = banDoc.info("AccountingDataBase", "Zip");
  var accountingDataBase_City = banDoc.info("AccountingDataBase", "City");
  var accountingDataBase_Country = banDoc.info("AccountingDataBase", "Country");

  if (accountingDataBase_Company) {
    address = accountingDataBase_Company + "\n";
  }
  
  if (accountingDataBase_Name) {
    address = address + accountingDataBase_Name + " ";
  }
 
  if (accountingDataBase_FamilyName) {
    address = address + accountingDataBase_FamilyName;
  }

  if (accountingDataBase_Name || accountingDataBase_FamilyName) {
    address = address + "\n";
  }
  
  if (accountingDataBase_Zip) {
    address = address + accountingDataBase_Zip + "-";
  }
  
  if (accountingDataBase_City) {
    address = address + accountingDataBase_City + " ";
  }
  
  if (accountingDataBase_Country) {
    address = address + accountingDataBase_Country;
  }

  if (accountingDataBase_Zip || accountingDataBase_City || accountingDataBase_Country) {
    address = address + "\n";
  }
  
  return address;
}

function getTexts(language) {
  var texts = {};
  if (language == 'it')
  {
    texts.param_font_family = 'Tipo carattere';
    texts.param_print_header = 'Includi intestazione pagina (1=si, 0=no)';
    texts.param_print_header_n = 'Includi intestazione pagina';
    texts.param_print_date = 'Data automatica (1=si, 0=no)';
    texts.param_print_date_n = 'Data automatica';
    texts.report_date = 'Data:';
    texts.report_description = 'Descrizione:';
    texts.report_paid_from = 'Pagato da:';
    texts.report_paid_to = 'Pagato a:';
    texts.report_received_by = 'Ricevuto da';
    texts.report_title = 'Ricevuta di pagamento n.';
    texts.report_signature = 'Firma:';
  }
  else if (language == 'de')
  {
    texts.param_font_family = 'Schriftart';
    texts.param_print_header = 'Seitenüberschrift einschliessen (1=ja, 0=nein)';
    texts.param_print_header_n = 'Seitenüberschrift einschliessen';
    texts.param_print_date = 'Automatisches Datum (1=ja, 0=nein)';
    texts.param_print_date_n = 'Automatisches Datum';
    texts.report_date = 'Datum:';
    texts.report_description = 'Beschreibung:';
    texts.report_paid_from = 'Bezahlt von:';
    texts.report_paid_to = 'Bezahlt an:';
    texts.report_received_by = 'Empfangen von:';
    texts.report_title = 'Zahlungseingang Nr.';
    texts.report_signature = 'Unterschrift:';
  }
  else if (language == 'fr')
  {
    texts.param_font_family = 'Police de caractère';
    texts.param_print_header = 'Inclure en-tête de page (1=oui, 0=non)';
    texts.param_print_header_n = 'Inclure en-tête de page';
    texts.param_print_date = 'Date automatique (1=oui, 0=non)';
    texts.param_print_date_n = 'Date automatique';
    texts.report_date = 'Date :';
    texts.report_description = 'Description :';
    texts.report_paid_from = 'Payé par :';
    texts.report_paid_to = 'Payé à :';
    texts.report_received_by = 'Reçu par :';
    texts.report_title = 'No de reçu de paiement';
    texts.report_signature = 'Signature:';
  }
  else if (language == 'nl')
  {
    texts.param_font_family = 'Lettertype';
    texts.param_print_header = 'Pagina-koptekst opnemen (1=ja, 0=nee)';
    texts.param_print_header_n = 'Pagina-koptekst opnemen';
    texts.param_print_date = 'Automatische datum (1=ja, 0=nee)';
    texts.param_print_date_n = 'Automatische datum';
    texts.report_date = 'Datum:';
    texts.report_description = 'Omschrijving:';
    texts.report_paid_from = 'Betaald van:';
    texts.report_paid_to = 'Betaald aan:';
    texts.report_received_by = 'Ontvangen door:';
    texts.report_title = 'Betalingsbewijs Nr.';
    texts.report_signature = 'Handtekening:';
  }
  else
  {
    texts.param_font_family = 'Font type';
    texts.param_print_header = 'Include page header (1=yes, 0=no)';
    texts.param_print_header_n = 'Include page header';
    texts.param_print_date = 'Automatic date (1=yes, 0=no)';
    texts.param_print_date_n = 'Automatic date';
    texts.report_date = 'Date:';
    texts.report_description = 'Description:';
    texts.report_paid_from = 'Paid from:';
    texts.report_paid_to = 'Paid to:';
    texts.report_received_by = 'Received by:';
    texts.report_title = 'Payment receipt No.';
    texts.report_signature = 'Signature:';
  }

  return texts;
}

/*
 * Check if the account number belongs to the account table
 */
function isAccount(banDoc, accountId) {
  if (!accountId || accountId.length <= 0)
    return false;
  if (!banDoc)
    return false;
  var tableAccounts = banDoc.table('Accounts');
  if (tableAccounts) {
    var accountRow = tableAccounts.findRowByValue('Account', accountId);
    if (accountRow)
      return true;
  }
  return false;
}

function addMdBoldText(reportElement, text) {
  var p = reportElement.addParagraph();
  let printBold = false;
  let startPosition = 0;

  // Check for malformed bold delimiters
  // var boldDelimiterCount = (text.match(/\*\*/g) || []).length;
  // if (boldDelimiterCount % 2 !== 0) {
  //   Banana.console.log("Warning: unmatched '**' delimiters in text: " + text);
  // }
  while (startPosition < text.length) {
    var endPosition = text.indexOf("**", startPosition);
    var nextPosition = endPosition === -1 ? text.length : endPosition;
    var segment = text.substring(startPosition, nextPosition);

    if (segment.length > 0) {
      var span = p.addText(segment, "");
      if (printBold) {
        span.setStyleAttribute("font-weight", "bold");
      }
    }

    printBold = !printBold;
    startPosition = endPosition === -1 ? text.length : endPosition + 2;
  }
}

/*
 * Update script's parameters
*/
function settingsDialog() {
  var param = initParam();
  var savedParam = Banana.document.getScriptSettings();
  if (savedParam.length > 0) {
    param = JSON.parse(savedParam);
  }
  param = verifyParam(param);

  if (typeof (Banana.Ui.openPropertyEditor) !== 'undefined') {
    var dialogTitle = 'Settings';
    var convertedParam = convertParam(param);
    var pageAnchor = 'dlgSettings';
    if (!Banana.Ui.openPropertyEditor(dialogTitle, convertedParam, pageAnchor))
       return;
    for (var i = 0; i < convertedParam.data.length; i++) {
       // Read values to param (through the readValue function)
       convertedParam.data[i].readValue();
    }
 }
 else {
    var lang = Banana.document.locale;
    if (lang.length>2)
      lang = lang.substr(0,2);
    var texts = getTexts(lang);

    param.print_header = Banana.Ui.getInt('Settings', texts.param_print_header, param.print_header);
    if (param.print_header === undefined)
      return;

    param.print_date = Banana.Ui.getInt('Settings', texts.param_print_date, param.print_date);
    if (param.print_date === undefined)
      return;

    param.font_family = Banana.Ui.getText('Settings', texts.param_font_family, param.font_family);
    if (param.font_family === undefined)
      return;
  }

  var paramToString = JSON.stringify(param);
  Banana.document.setScriptSettings(paramToString);
  
  return param;
}

function convertParam(param) {
  var lang = 'en';
  if (Banana.document.locale)
    lang = Banana.document.locale;
  if (lang.length > 2)
     lang = lang.substr(0, 2);
  var texts = getTexts(lang);

  var convertedParam = {};
  convertedParam.version = '1.0';
  /*array dei parametri dello script*/
  convertedParam.data = [];
  
  var currentParam = {};
  currentParam.name = 'print_header';
  currentParam.title = texts.param_print_header_n;
  currentParam.type = 'bool';
  currentParam.value = param.print_header ? true : false;
  currentParam.defaultvalue = true;
  currentParam.readValue = function() {
    param.print_header = this.value;
  }
  convertedParam.data.push(currentParam);

  var currentParam = {};
  currentParam.name = 'print_date';
  currentParam.title = texts.param_print_date_n;
  currentParam.type = 'bool';
  currentParam.value = param.print_date ? true : false;
  currentParam.defaultvalue = true;
  currentParam.readValue = function() {
    param.print_date = this.value;
  }
  convertedParam.data.push(currentParam);

  currentParam = {};
  currentParam.name = 'font_family';
  currentParam.title = texts.param_font_family;
  currentParam.type = 'string';
  currentParam.value = param.font_family ? param.font_family : '';
  currentParam.defaultvalue = '';
  currentParam.readValue = function() {
    param.font_family = this.value;
  }
  convertedParam.data.push(currentParam);

  return convertedParam;
}

function initParam() {
  var param = {};
  param.print_header = true;
  param.print_date = true;
  param.font_family = '';
  return param;
}

function verifyParam(param) {
  if (!param.print_header)
   param.print_header = false;
  if (!param.print_date)
    param.print_date = false;
  if (!param.font_family)
   param.font_family = '';

  return param;
}
