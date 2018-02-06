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
// @id = ch.banana.report.customer.statement.style01.js
// @api = 1.0
// @pubdate = 2016-11-14
// @publisher = Banana.ch SA
// @description = Customer Statement
// @description.it = Estratto cliente 
// @description.de = Kundenauszug
// @description.fr = Extrait de compte client
// @description.nl = Rekeninguittreksel klant
// @description.en = Customer statement
// @doctype = *
// @task = report.customer.statement

var rowNumber = 0;
var repTableObj = "";
var pageNr = 1;

/*Update script's parameters*/
function settingsDialog() {
   var param = initParam();
   var savedParam = Banana.document.scriptReadSettings();
   if (savedParam.length > 0) {
      param = JSON.parse(savedParam);
   }   
   var lang = Banana.document.locale;
   if (lang.length>2)
      lang = lang.substr(0,2);
   var texts = setTexts(lang);

   param.print_header = Banana.Ui.getInt('Settings', texts.param_print_header, param.print_header);
   if (param.print_header === undefined)
      return;

   var paramToString = JSON.stringify(param);
   var value = Banana.document.scriptSaveSettings(paramToString);
}

function initParam() {
   var param = {};
   param.print_header = true;
   param.font_family = '';
   param.font_color_1 = '';
   param.font_color_2 = '';
   param.font_color_3 = '';
   param.font_color_4 = '';
   param.font_color_5 = '';
   return param;
}

function verifyParam(param) {
   if (!param.print_header)
     param.print_header = false;
   if (!param.font_family)
     param.font_family = '';
   if (!param.font_color_1)
     param.font_color_1 = '';
   if (!param.font_color_2)
     param.font_color_2 = '';
   if (!param.font_color_3)
     param.font_color_3 = '';
   if (!param.font_color_4)
     param.font_color_4 = '';
   if (!param.font_color_5)
     param.font_color_5 = '';
   
   return param;
}

function printDocument(jsonStatement, repDocObj, repStyleObj) {
  var param = initParam();
  var savedParam = Banana.document.scriptReadSettings();
  if (savedParam.length > 0) {
    param = JSON.parse(savedParam);
    param = verifyParam(param);
  }
  printInvoiceStatement(jsonStatement, repDocObj, repStyleObj, param);
}

function printInvoiceStatement(jsonStatement, repDocObj, repStyleObj, param) {
  
  //jsonStatement can be a json string or a js object
  var statementObj = null;
  if (typeof(jsonStatement) === 'object') {
    statementObj = jsonStatement;
  } else if (typeof(jsonStatement) === 'string') {
    statementObj = JSON.parse(jsonStatement)
  }

  // Statement texts which need translation
  var langDoc = '';
  if (statementObj.customer_info.lang )
    langDoc = statementObj.customer_info.lang;
  if (langDoc.length <= 0)
    langDoc = statementObj.document_info.locale;
  var texts = setTexts(langDoc);

  // Document
  var reportObj = Banana.Report;
  
  if (!repDocObj) {
    repDocObj = reportObj.newReport(texts.invoice + ": " + statementObj.document_info.number);
  } else {
    var pageBreak = repDocObj.addPageBreak();
    pageBreak.addClass("pageReset");
  }


  /***********
    1. HEADER
  ***********/
  if (param.print_header) {

    var tab = repDocObj.addTable("header_table");
    var col1 = tab.addColumn("col1");
    
    tableRow = tab.addRow();
    var business_name = '';
    if (statementObj.supplier_info.business_name) {
      business_name = statementObj.supplier_info.business_name;
    }
    if (business_name.length<=0) {
      if (statementObj.supplier_info.first_name) {
        business_name = statementObj.supplier_info.first_name + " ";
      }
      if (statementObj.supplier_info.last_name) {
        business_name += statementObj.supplier_info.last_name;
      }
    }
    tableRow.addCell(business_name.toUpperCase(), "logo left bold");
    
    tableRow = tab.addRow();
    var cell = tableRow.addCell("");
    var supplierLines = getInvoiceSupplier(statementObj.supplier_info).split('\n');
    for (var i=0; i < supplierLines.length; i++) {
      cell.addParagraph(supplierLines[i], "headerAddress");
    }
  }


  /**********************
    3. DETAILS & ADDRESS
  **********************/
  var addressTable = repDocObj.addTable("address_table");
  var addressCol1 = addressTable.addColumn("addressCol1");
  var addressCol2 = addressTable.addColumn("addressCol2")

  tableRow = addressTable.addRow();
  
  var cell3 = tableRow.addCell("", "", 1);
  cell3.addParagraph(texts.date + ": " + Banana.Converter.toLocaleDateFormat(statementObj.document_info.date));  
  cell3.addParagraph(texts.customer + ": " + statementObj.customer_info.number);
  cell3.addParagraph(texts.page + ": " + pageNr);

  var cell5 = tableRow.addCell("","",1); 
  var addressLines = getInvoiceAddress(statementObj.customer_info).split('\n');
  for (var i=0; i < addressLines.length; i++) {
    cell5.addParagraph(addressLines[i], "");
  }
  

 /***************
    4. TABLE ITEMS
  ***************/
  var titleTable = repDocObj.addTable("title_table");
  tableRow = titleTable.addRow();
  tableRow.addCell(texts.statement, "bold title", 1);
  

 /***************
    4. TABLE ITEMS
  ***************/
  repTableObj = repDocObj.addTable("doc_table");
  var repTableCol1 = repTableObj.addColumn("repTableCol1");
  var repTableCol2 = repTableObj.addColumn("repTableCol2");
  var repTableCol3 = repTableObj.addColumn("repTableCol3");
  var repTableCol4 = repTableObj.addColumn("repTableCol4");
  var repTableCol5 = repTableObj.addColumn("repTableCol5");
  var repTableCol6 = repTableObj.addColumn("repTableCol6");
  var repTableCol7 = repTableObj.addColumn("repTableCol7");
  var repTableCol8 = repTableObj.addColumn("repTableCol8");
  var repTableCol9 = repTableObj.addColumn("repTableCol9");
  var repTableCol10 = repTableObj.addColumn("repTableCol10");

  rowNumber = checkFileLength(statementObj, repDocObj, param, texts, rowNumber);
  var dd = repTableObj.getHeader().addRow();
  dd.addCell(texts.invoice_no, "items_table_header center", 1);
  dd.addCell(texts.invoice_date, "items_table_header center", 1);
  dd.addCell(texts.invoice_debit, "items_table_header center", 1);
  dd.addCell(texts.invoice_credit, "items_table_header center", 1);
  dd.addCell(texts.invoice_balance, "items_table_header center", 1);
  dd.addCell(texts.invoice_currency, "items_table_header center", 1);
  dd.addCell(texts.invoice_payment_date, "items_table_header center", 1);
  dd.addCell(texts.invoice_due_date, "items_table_header center", 1);
  dd.addCell(texts.invoice_due_days, "items_table_header center", 1);
  dd.addCell(texts.invoice_last_reminder, "items_table_header center", 1);


  //ITEMS
  var countRows = 0;
  for (var i = 0; i < statementObj.items.length; i++) 
  { 
    var item = statementObj.items[i];

    var classRow = "item_row";
    if (item.item_type && item.item_type.indexOf("total") === 0) {
      classRow = "item_total";
    }


    var classTotal = "";
    if (i == statementObj.items.length-1) {
      classTotal = " bold total";

      rowNumber = checkFileLength(statementObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell("", "", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
    }

    rowNumber = checkFileLength(statementObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow(classRow);
    
    tableRow.addCell(item.number, "padding-left padding-right" + classTotal, 1);
    tableRow.addCell(Banana.Converter.toLocaleDateFormat(item.date), "padding-left padding-right border-left" + classTotal, 1);
    tableRow.addCell(getFormattedAmount(statementObj, item.debit), "padding-left padding-right border-left amount" + classTotal, 1);
    tableRow.addCell(getFormattedAmount(statementObj, item.credit), "padding-left padding-right border-left amount" + classTotal, 1);
    tableRow.addCell(getFormattedAmount(statementObj, item.balance), "padding-left padding-right border-left amount" + classTotal, 1);
    tableRow.addCell(item.currency, "padding-left padding-right border-left center" + classTotal, 1);
    tableRow.addCell(Banana.Converter.toLocaleDateFormat(item.payment_date), "padding-left padding-right border-left" + classTotal, 1);
    tableRow.addCell(Banana.Converter.toLocaleDateFormat(item.due_date), "padding-left padding-right border-left" + classTotal, 1);
    tableRow.addCell(item.due_days, "padding-left padding-right border-left center" + classTotal, 1);

    var lastReminderDate = Banana.Converter.toLocaleDateFormat(item.last_reminder_date);
    if (lastReminderDate.length > 0) {
        lastReminderDate = lastReminderDate + " (" + item.last_reminder + ".)";
    }
    tableRow.addCell(lastReminderDate, "padding-left padding-right border-left" + classTotal, 1);
  
  }

  //Set invoice style
  setInvoiceStyle(reportObj, repStyleObj, param);
}


function getFormattedAmount(statement, value) {

    return Banana.Converter.toLocaleNumberFormat(value, statement.document_info.decimals_amounts, true);
}


function getInvoiceAddress(invoiceAddress) {
  var address = "";
  if (invoiceAddress.courtesy) {
      address = invoiceAddress.courtesy + "\n";
  }
  if (invoiceAddress.first_name || invoiceAddress.last_name) {
    if (invoiceAddress.first_name) {
      address = address + invoiceAddress.first_name + " ";
    }
    if (invoiceAddress.last_name) {
      address = address + invoiceAddress.last_name;
    }
    address = address + "\n";
  }
  if (invoiceAddress.business_name) {
    address = address + invoiceAddress.business_name + "\n";
  }
  if (invoiceAddress.address1) {
    address = address + invoiceAddress.address1 + "\n";
  }
  if (invoiceAddress.address2) {
    address = address + invoiceAddress.address2 + "\n";
  }
  if (invoiceAddress.address3) {
    address = address + invoiceAddress.address3 + "\n";
  }
  if (invoiceAddress.postal_code) {
    address = address + invoiceAddress.postal_code + " ";
  }
  if (invoiceAddress.city) {
    address = address + invoiceAddress.city + "\n";
  }
  if (invoiceAddress.country) {
    address = address + invoiceAddress.country;
  }
  return address;
}


function getInvoiceSupplier(invoiceSupplier) {
  var supplierAddress = "";
  if (invoiceSupplier.business_name) {
    supplierAddress = invoiceSupplier.business_name + " - ";
  }
  if (invoiceSupplier.address1) {
    supplierAddress = supplierAddress + invoiceSupplier.address1 + " - ";
  }
  if (invoiceSupplier.address2) {
    supplierAddress = supplierAddress + invoiceSupplier.address2 + " - ";
  }
  if (invoiceSupplier.address1 || invoiceSupplier.address2) {
    supplierAddress = supplierAddress + "";
  }
  if (invoiceSupplier.postal_code) {
    supplierAddress = supplierAddress + invoiceSupplier.postal_code + " ";
  }
  if (invoiceSupplier.city) {
    supplierAddress = supplierAddress + invoiceSupplier.city;
  }
  if (invoiceSupplier.country) {
    supplierAddress = supplierAddress + " - " + invoiceSupplier.country + " ";
  }
  supplierAddress = supplierAddress + "\n";
  if (invoiceSupplier.phone) {
    supplierAddress = supplierAddress + "Tel: " + invoiceSupplier.phone + " - ";
  }
  if (invoiceSupplier.fax) {
    supplierAddress = supplierAddress + "Fax: " + invoiceSupplier.fax + " - ";
  }
  if (invoiceSupplier.email) {
    supplierAddress = supplierAddress + invoiceSupplier.email + " - ";
  }
  if (invoiceSupplier.web) {
    supplierAddress = supplierAddress + invoiceSupplier.web;
  }
  if (invoiceSupplier.vat_number) {
	supplierAddress = supplierAddress + "\n" + invoiceSupplier.vat_number;
  }
 return supplierAddress;
}


function checkFileLength(statementObj, repDocObj, param, texts, rowNumber)
{
  if (rowNumber >= 37) 
  {
    repDocObj.addPageBreak();
    pageNr++;

    printStatementDetails(statementObj, repDocObj, param, texts, rowNumber);
    printItemsHeader(statementObj, repDocObj, param, texts, rowNumber);

    return 0;
  }

  rowNumber++;
  return rowNumber;
}


function printStatementDetails(statementObj, repDocObj, param, texts, rowNumber) {
  var addressTable = repDocObj.addTable("address_table_row0");
  var addressCol1 = addressTable.addColumn("addressCol1R0");
  var addressCol2 = addressTable.addColumn("addressCol2R0")

  tableRow = addressTable.addRow();
  var cell1 = tableRow.addCell("", "", 1);
  cell1.addParagraph(texts.date + ": " + Banana.Converter.toLocaleDateFormat(statementObj.document_info.date), "");  
  cell1.addParagraph(texts.customer + ": " + statementObj.customer_info.number);
  cell1.addParagraph(texts.page + ": " + pageNr);
}


function printItemsHeader(statementObj, repDocObj, param, texts, rowNumber) {
  repTableObj = repDocObj.addTable("doc_table_row0");
  var repTableCol1 = repTableObj.addColumn("repTableCol1");
  var repTableCol2 = repTableObj.addColumn("repTableCol2");
  var repTableCol3 = repTableObj.addColumn("repTableCol3");
  var repTableCol4 = repTableObj.addColumn("repTableCol4");
  var repTableCol5 = repTableObj.addColumn("repTableCol5");
  var repTableCol6 = repTableObj.addColumn("repTableCol6");
  var repTableCol7 = repTableObj.addColumn("repTableCol7");
  var repTableCol8 = repTableObj.addColumn("repTableCol8");
  var repTableCol9 = repTableObj.addColumn("repTableCol9");
  var repTableCol10 = repTableObj.addColumn("repTableCol10");

  var dd = repTableObj.getHeader().addRow();
  dd.addCell(texts.invoice_no, "items_table_header center", 1);
  dd.addCell(texts.invoice_date, "items_table_header center", 1);
  dd.addCell(texts.invoice_debit, "items_table_header center", 1);
  dd.addCell(texts.invoice_credit, "items_table_header center", 1);
  dd.addCell(texts.invoice_balance, "items_table_header center", 1);
  dd.addCell(texts.invoice_currency, "items_table_header center", 1);
  dd.addCell(texts.invoice_payment_date, "items_table_header center", 1);
  dd.addCell(texts.invoice_due_date, "items_table_header center", 1);
  dd.addCell(texts.invoice_due_days, "items_table_header center", 1);
  dd.addCell(texts.invoice_last_reminder, "items_table_header center", 1);
}


//====================================================================//
// STYLES
//====================================================================//
function setInvoiceStyle(reportObj, repStyleObj, param) {
    
    if (!repStyleObj) {
        repStyleObj = reportObj.newStyleSheet();
    }

    //Set default values
    if (!param.font_family) {
        param.font_family = "Calibri";
    }

    if (!param.color_1) {
        param.color_1 = "#005392";
    }

    if (!param.color_2) {
        param.color_2 = "#E6E6FA";
    }

    if (!param.color_3) {
        param.color_3 = "#ffffff";
    }
    
    if (!param.color_4) {
        param.color_4 = "";
    }

    if (!param.color_5) {
        param.color_5 = "";
    }

    //====================================================================//
    // GENERAL
    //====================================================================//
    repStyleObj.addStyle(".pageReset", "counter-reset: page");
    repStyleObj.addStyle("body", "font-size: 12pt; font-family:" + param.font_family);
    repStyleObj.addStyle(".logo", "font-size: 24pt; color:" + param.color_1);
    repStyleObj.addStyle(".headerAddress", "font-size:9pt");
    repStyleObj.addStyle(".amount", "text-align:right");
    repStyleObj.addStyle(".subtotal_cell", "font-weight:bold;");
    repStyleObj.addStyle(".center", "text-align:center");
    repStyleObj.addStyle(".left", "text-align:left");
    repStyleObj.addStyle(".bold", "font-weight: bold");
    repStyleObj.addStyle(".title", "font-size:18pt; color:" + param.color_1);
    repStyleObj.addStyle(".items_table_header", "font-weight:bold; background-color:" + param.color_1 +"; color:" + param.color_3);
    repStyleObj.addStyle(".items_table_header td", "padding-top:5px; padding-bottom:5px");
    repStyleObj.addStyle(".total", "color: " + param.color_1);
    repStyleObj.addStyle(".evenRowsBackgroundColor", "background-color:" + param.color_2);    
    repStyleObj.addStyle(".border-bottom", "border-bottom:2px solid " + param.color_1);
    repStyleObj.addStyle(".border-top", "border-top:2px solid " + param.color_1);
    repStyleObj.addStyle(".border-left", "border-left:thin solid " + param.color_1);
    repStyleObj.addStyle(".padding-right", "padding-right:3px");
    repStyleObj.addStyle(".padding-left", "padding-left:3px");
    repStyleObj.addStyle(".padding-bottom", "padding-bottom:5px");
    repStyleObj.addStyle(".addressCol1","width:43%");
    repStyleObj.addStyle(".addressCol2","width:43%");
    repStyleObj.addStyle(".addressCol1R0","width:%");
    repStyleObj.addStyle(".addressCol2R0","width:%");

    repStyleObj.addStyle(".repTableCol1","width:10%"); //10
    repStyleObj.addStyle(".repTableCol2","width:11%"); //11
    repStyleObj.addStyle(".repTableCol3","width:12%"); //12
    repStyleObj.addStyle(".repTableCol4","width:12%"); //12
    repStyleObj.addStyle(".repTableCol5","width:12%"); //12
    repStyleObj.addStyle(".repTableCol6","width:10%");   //-
    repStyleObj.addStyle(".repTableCol7","width:11%"); //11
    repStyleObj.addStyle(".repTableCol8","width:11%"); //11
    repStyleObj.addStyle(".repTableCol9","width:7%");   //-
    repStyleObj.addStyle(".repTableCol10","width:15%");//15


    //====================================================================//
    // TABLES
    //====================================================================//
    var headerStyle = repStyleObj.addStyle(".header_table");
    headerStyle.setAttribute("position", "absolute");
    headerStyle.setAttribute("margin-top", "10mm"); //106
    headerStyle.setAttribute("margin-left", "20mm"); //20
    headerStyle.setAttribute("margin-right", "4mm");
    //headerStyle.setAttribute("width", "100%");
    //repStyleObj.addStyle("table.header_table td", "border: thin solid black");


    var infoStyle = repStyleObj.addStyle(".title_table");
    infoStyle.setAttribute("position", "absolute");
    infoStyle.setAttribute("margin-top", "95mm");
    infoStyle.setAttribute("margin-left", "22mm");
    infoStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.info_table td", "border: thin solid black");
    infoStyle.setAttribute("width", "100%");


    var addressStyle = repStyleObj.addStyle(".address_table");
    addressStyle.setAttribute("position", "absolute");
    addressStyle.setAttribute("margin-top", "40mm");
    addressStyle.setAttribute("margin-left", "20mm");
    addressStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.address_table td", "border: thin solid #6959CD");
    //addressStyle.setAttribute("width", "100%");


    var addressStyle = repStyleObj.addStyle(".address_table_row0");
    addressStyle.setAttribute("position", "absolute");
    addressStyle.setAttribute("margin-top", "10mm");
    addressStyle.setAttribute("margin-left", "19mm");
    addressStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.address_table_row0 td", "border: thin solid #6959CD");
    //addressStyle.setAttribute("width", "100%");


    var itemsStyle = repStyleObj.addStyle(".doc_table");
    itemsStyle.setAttribute("margin-top", "120mm"); //106
    itemsStyle.setAttribute("margin-left", "26mm"); //20
    itemsStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.doc_table td", "border: thin solid #6959CD;");
    itemsStyle.setAttribute("width", "100%");


    var itemsStyle = repStyleObj.addStyle(".doc_table_row0");
    itemsStyle.setAttribute("margin-top", "45mm"); //106
    itemsStyle.setAttribute("margin-left", "23mm"); //20
    itemsStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.doc_table td", "border: thin solid #282828; padding: 3px;");
    itemsStyle.setAttribute("width", "100%");

}


function setTexts(language) {
  var texts = {};
  if (language == 'it')
  {
    texts.customer = 'No Cliente';
    texts.date = 'Data';
    texts.invoice_balance = 'Saldo';
    texts.invoice_credit = 'Avere';
    texts.invoice_currency = 'Divisa';
    texts.invoice_date = 'Data';
    texts.invoice_debit = 'Dare';
    texts.invoice_due_date = 'Data scad.';
    texts.invoice_due_days = 'Giorni scad.';
    texts.invoice_last_reminder = 'Richiamo';
    texts.invoice_no = 'No. fattura';
    texts.invoice_payment_date = 'Data pag.';
    texts.page = 'Pagina';
    texts.total = 'Totale';
    texts.statement = 'Estratto conto';
    texts.param_print_header = 'Includi intestazione pagina (1=true, 0=false)';
  }
  else if (language == 'de')
  {
    texts.customer = 'Kunde-Nr';
    texts.date = 'Datum';
    texts.invoice_balance = 'Saldo';
    texts.invoice_credit = 'Haben';
    texts.invoice_currency = 'Währung';
    texts.invoice_date = 'Datum';
    texts.invoice_debit = 'Soll';
    texts.invoice_due_date = 'Due date';
    texts.invoice_due_days = 'Due days';
    texts.invoice_last_reminder = 'Paym. Reminder';
    texts.invoice_no = 'Rechnung-Nr.';
    texts.invoice_payment_date = 'Data pag.';
    texts.page = 'Seite';
    texts.statement = 'Kontoauszug';
    texts.param_print_header = 'Seitenüberschrift einschliessen (1=true, 0=false)';
  }
  else if (language == 'fr')
  {
    texts.customer = 'No. client';
    texts.date = 'Date';
    texts.invoice_balance = 'Solde';
    texts.invoice_credit = 'Crédit';
    texts.invoice_currency = 'Devise';
    texts.invoice_date = 'Date';
    texts.invoice_debit = 'Débit';
    texts.invoice_due_date = 'Due date';
    texts.invoice_due_days = 'Due days';
    texts.invoice_last_reminder = 'Paym. Reminder';
    texts.invoice_no = 'No. facture';
    texts.invoice_payment_date = 'Data pag.';
    texts.page = 'Page';
    texts.statement = 'Extrait client';
    texts.param_print_header = 'Inclure en-tête de page (1=true, 0=false)';
  }
  else if (language == 'nl')
  {
    texts.customer = 'Klantennummer';
    texts.date = 'Datum';
    texts.invoice_balance = 'Saldo';
    texts.invoice_credit = 'Credit';
    texts.invoice_currency = 'Valuta';
    texts.invoice_date = 'Datum';
    texts.invoice_debit = 'Debit';
    texts.invoice_due_date = 'Vervaldatum';
    texts.invoice_due_days = 'Dagen te laat';
    texts.invoice_last_reminder = 'Betalingsherinnering';
    texts.invoice_no = 'Factuurnummer';
    texts.invoice_payment_date = 'Bet.datum';
    texts.page = 'Pagina';
    texts.total = 'Totaal';
    texts.statement = 'Rekeninguittreksel klant';
    texts.param_print_header = 'Pagina-koptekst opnemen (1=true, 0=false)';
  }
  else
  {
    texts.customer = 'Customer No';
    texts.date = 'Date';
    texts.invoice_balance = 'Balance';
    texts.invoice_credit = 'Credit';
    texts.invoice_currency = 'Currency';
    texts.invoice_date = 'Date';
    texts.invoice_debit = 'Debit';
    texts.invoice_due_date = 'Due date';
    texts.invoice_due_days = 'Due days';
    texts.invoice_last_reminder = 'Paym. Reminder';
    texts.invoice_no = 'Invoice Nr.';
    texts.invoice_payment_date = 'Data pag.';
    texts.page = 'Page';
    texts.total = 'Total';
    texts.statement = 'Customer statement';
    texts.param_print_header = 'Include page header (1=true, 0=false)';
  }
  return texts;
}

