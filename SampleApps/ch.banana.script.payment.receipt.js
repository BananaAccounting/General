// Copyright [2016] [Banana.ch SA - Lugano Switzerland]
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
// @pubdate = 2017-04-05
// @publisher = Banana.ch SA
// @description = Payment receipt for cashbook
// @description.it = Ricevuta di pagamento per libro cassa
// @description.de = Payment receipt for cashbook
// @description.fr = Payment receipt for cashbook
// @description.nl = Payment receipt for cashbook
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

  // Load data
  var transactions = Banana.document.table('Transactions');
  var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);
  if (!transactions.row(Banana.document.cursor.rowNr))
    return;
  var tDoc = transactions.row(Banana.document.cursor.rowNr).value('Doc');
  var tRow = Banana.document.table('Transactions').row(Banana.document.cursor.rowNr);
  if (!tDoc)
    return;
  // Transaction rows
  var rowList = [];
  var totalAmount = "";
  for ( i=0; i< journal.rowCount; i++) {
    var tRow = journal.row(i);
    if (tRow.value('Doc') == tDoc)
    {
      if (!isAccount(tRow.value('JAccount')))
        continue;

      var rowObject = {};
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

  // Report params
  var param = initParam();
  var savedParam = Banana.document.scriptReadSettings();
  if (savedParam.length > 0) {
    param = JSON.parse(savedParam);
    param = verifyParam(param);
  }

  // Translated texts
  var lang = Banana.document.locale;
  if (lang.length>2)
    lang = lang.substr(0,2);
  var texts = getTexts(lang);

  // Stylesheet
  var stylesheet = createStylesheet(param);

  // Report
  var report = Banana.Report.newReport(texts.report_title + ' ' + tDoc);

  // Report Header
  var headerTable = report.addTable("header_table");
  var col1 = headerTable.addColumn("header_col1");
  var tableRow = headerTable.addRow();
  if (param.print_header) {
    report.addImage("documents:logo", "logoStyle");
    var cell1 = tableRow.addCell("", "sender");
    var senderLines = getSenderAddress().split('\n');
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
      var currency = Banana.document.info("AccountingDataBase", "BasicCurrency");
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
    var senderLines = getSenderName().split('\n');
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
    var senderLines = getSenderName().split('\n');
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
    tableRow = docTable.addRow();  
    tableRow.addCell(rowList[i].description);
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
  tableRow.addCell("", "dots", 2);
  tableRow = docTable.addRow();
  tableRow.addCell(texts.report_received_by, "title", 2);
  tableRow = docTable.addRow();
  tableRow.addCell("", "dots", 2);
  
  // Print preview
  Banana.Report.preview(report, stylesheet);
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
  style.setAttribute("margin-top", "25mm");
  style.setAttribute("margin-right", "10mm");
  style.setAttribute("position", "absolute");
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
  style.setAttribute("margin-top", "10mm");
  style.setAttribute("margin-right", "10mm");
  style.setAttribute("position", "absolute");
  style.setAttribute("width", "100%");

  style = stylesheet.addStyle(".logoStyle");
  style.setAttribute("margin-top", "0mm");
  style.setAttribute("margin-left", "0mm"); 
  style.setAttribute("position", "absolute");
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
  
  return stylesheet;
}

function getSenderAddress() {
  
  var address = "";

  var accountingDataBase_Company = Banana.document.info("AccountingDataBase", "Company");
  var accountingDataBase_Name = Banana.document.info("AccountingDataBase", "Name");
  var accountingDataBase_FamilyName = Banana.document.info("AccountingDataBase", "FamilyName");
  var accountingDataBase_Address1 = Banana.document.info("AccountingDataBase", "Address1");
  var accountingDataBase_Address2 = Banana.document.info("AccountingDataBase", "Address2");
  var accountingDataBase_Zip = Banana.document.info("AccountingDataBase", "Zip");
  var accountingDataBase_City = Banana.document.info("AccountingDataBase", "City");
  var accountingDataBase_State = Banana.document.info("AccountingDataBase", "State");
  var accountingDataBase_Country = Banana.document.info("AccountingDataBase", "Country");
  var accountingDataBase_Web = Banana.document.info("AccountingDataBase", "Web");
  var accountingDataBase_Email = Banana.document.info("AccountingDataBase", "Email");
  var accountingDataBase_Phone = Banana.document.info("AccountingDataBase", "Phone");
  var accountingDataBase_Mobile = Banana.document.info("AccountingDataBase", "Mobile");
  var accountingDataBase_Fax = Banana.document.info("AccountingDataBase", "Fax");
  var accountingDataBase_FiscalNumber = Banana.document.info("AccountingDataBase", "FiscalNumber");
  var accountingDataBase_VatNumber = Banana.document.info("AccountingDataBase", "VatNumber");

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

function getSenderName() {
  
  var address = "";

  var accountingDataBase_Company = Banana.document.info("AccountingDataBase", "Company");
  var accountingDataBase_Name = Banana.document.info("AccountingDataBase", "Name");
  var accountingDataBase_FamilyName = Banana.document.info("AccountingDataBase", "FamilyName");
  var accountingDataBase_Zip = Banana.document.info("AccountingDataBase", "Zip");
  var accountingDataBase_City = Banana.document.info("AccountingDataBase", "City");
  var accountingDataBase_Country = Banana.document.info("AccountingDataBase", "Country");

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
    texts.report_date = 'Data:';
    texts.report_description = 'Descrizione:';
    texts.report_paid_from = 'Pagato da:';
    texts.report_paid_to = 'A favore di:';
    texts.report_received_by = 'Ricevuto da';
    texts.report_title = 'Ricevuta di pagamento n.';
  }
  else if (language == 'de')
  {
    texts.param_font_family = 'Schriftart';
    texts.param_print_header = 'Seitenüberschrift einschliessen (1=ja, 0=nein)';
    texts.report_date = 'Date:';
    texts.report_description = 'Description:';
    texts.report_paid_from = 'Paid from:';
    texts.report_paid_to = 'Paid to:';
    texts.report_received_by = 'Received by:';
    texts.report_title = 'Payment receipt No.';
  }
  else if (language == 'fr')
  {
    texts.param_font_family = 'Police de caractère';
    texts.param_print_header = 'Inclure en-tête de page (1=oui, 0=non)';
    texts.report_date = 'Date:';
    texts.report_description = 'Description:';
    texts.report_paid_from = 'Paid from:';
    texts.report_paid_to = 'Paid to:';
    texts.report_received_by = 'Received by:';
    texts.report_title = 'Payment receipt No.';
  }
  else if (language == 'nl')
  {
    texts.param_font_family = 'Lettertype';
    texts.param_print_header = 'Pagina-koptekst opnemen (1=ja, 0=nee)';
    texts.report_date = 'Date:';
    texts.report_description = 'Description:';
    texts.report_paid_from = 'Paid from:';
    texts.report_paid_to = 'Paid to:';
    texts.report_received_by = 'Received by:';
    texts.report_title = 'Payment receipt No.';
  }
  else
  {
    texts.param_font_family = 'Font type';
    texts.param_print_header = 'Include page header (1=yes, 0=no)';
    texts.report_date = 'Date:';
    texts.report_description = 'Description:';
    texts.report_paid_from = 'Paid from:';
    texts.report_paid_to = 'Paid to:';
    texts.report_received_by = 'Received by:';
    texts.report_title = 'Payment receipt No.';
  }

  return texts;
}

function initParam() {
  var param = {};
  param.print_header = true;
  param.font_family = '';
  return param;
}

/*
 * Check if the account number belongs to the account table
 */
function isAccount(accountId) {
  if (!accountId || accountId.length <= 0)
    return false;
  if (!Banana.document)
    return false;
  var tableAccounts = Banana.document.table('Accounts');
  if (tableAccounts) {
    var accountRow = tableAccounts.findRowByValue('Account', accountId);
    if (accountRow)
      return true;
  }
  return false;
}

/*
 * Update script's parameters
*/
function settingsDialog() {
  var param = initParam();
  var savedParam = Banana.document.scriptReadSettings();
  if (savedParam.length > 0) {
    param = JSON.parse(savedParam);
  }
  param = verifyParam(param);
  var lang = Banana.document.locale;
  if (lang.length>2)
    lang = lang.substr(0,2);
  var texts = getTexts(lang);

  param.print_header = Banana.Ui.getInt('Settings', texts.param_print_header, param.print_header);
  if (param.print_header === undefined)
    return;

  param.font_family = Banana.Ui.getText('Settings', texts.param_font_family, param.font_family);
  if (param.font_family === undefined)
    return;

  var paramToString = JSON.stringify(param);
  var value = Banana.document.scriptSaveSettings(paramToString);
}

function verifyParam(param) {
  if (!param.print_header)
   param.print_header = false;
  if (!param.font_family)
   param.font_family = '';

  return param;
}
