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
// @id = ch.banana.report.customer.reminder.style01.js
// @api = 1.0
// @pubdate = 2016-10-06
// @publisher = Banana.ch SA
// @description = Payment reminder
// @description.it = Richiamo di pagamento 
// @description.de = Zahlungserinnerung
// @description.fr = Rappel de paiement 
// @description.nl = Betalingsherinnering
// @description.en = Payment reminder
// @task = report.customer.reminder

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
  param = verifyParam(param);
  var lang = Banana.document.locale;
  if (lang.length>2) {
    lang = lang.substr(0,2);
  }
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

function printDocument(jsonReminder, repDocObj, repStyleObj) {
  var param = initParam();
  var savedParam = Banana.document.scriptReadSettings();
  if (savedParam.length > 0) {
    param = JSON.parse(savedParam);
    param = verifyParam(param);
  }
  printReminder(jsonReminder, repDocObj, repStyleObj, param);
}

function printReminder(jsonReminder, repDocObj, repStyleObj, param) {

  // jsonReminder can be a json string or a js object
  var reminderObj = null;
  if (typeof(jsonReminder) === 'object') {
    reminderObj = jsonReminder;
  } else if (typeof(jsonReminder) === 'string') {
    reminderObj = JSON.parse(jsonReminder);
  }

  // Reminder texts which need translation
  var langDoc = '';
  if (reminderObj.customer_info.lang )
    langDoc = reminderObj.customer_info.lang;
  if (langDoc.length <= 0)
    langDoc = reminderObj.document_info.locale;
  var texts = setTexts(langDoc);

  // Reminder document
  var reportObj = Banana.Report;
  if (!repDocObj) {
    repDocObj = reportObj.newReport(texts.invoice + ": " + reminderObj.document_info.number);
  } else {
    var pageBreak = repDocObj.addPageBreak();
    pageBreak.addClass("pageReset");
  }


  /***********
    1. HEADER
  ***********/
  if (param.print_header) {
    //repDocObj.addImage("documents:logo", "logoStyle");

    var tab = repDocObj.addTable("header_table");
    var col1 = tab.addColumn("col1");
    
    var tableRow = tab.addRow();
    var business_name = '';
    if (reminderObj.supplier_info.business_name) {
      business_name = reminderObj.supplier_info.business_name;
    }
    if (business_name.length<=0) {
      if (reminderObj.supplier_info.first_name) {
        business_name = reminderObj.supplier_info.first_name + " ";
      }
      if (reminderObj.supplier_info.last_name) {
        business_name += reminderObj.supplier_info.last_name;
      }
    }
    tableRow.addCell(business_name.toUpperCase(), "logo left bold");
    
    tableRow = tab.addRow();
    var cell = tableRow.addCell("");
    var supplierLines = getInvoiceSupplier(reminderObj.supplier_info).split('\n');
    for (var i=0; i < supplierLines.length; i++) {
      cell.addParagraph(supplierLines[i], "headerAddress");
    }
  }


  /**********************
    3. ADDRESSES
  **********************/
  var addressTable = repDocObj.addTable("address_table");
  var addressCol1 = addressTable.addColumn("addressCol1");
  var addressCol2 = addressTable.addColumn("addressCol2")

  tableRow = addressTable.addRow();
  
  var cell3 = tableRow.addCell("", "", 1);
  cell3.addParagraph(texts.date + ": " + Banana.Converter.toLocaleDateFormat(reminderObj.document_info.date));  
  cell3.addParagraph(texts.customer + ": " + reminderObj.customer_info.number);
  cell3.addParagraph(texts.page + ": " + pageNr);

  var cell5 = tableRow.addCell("","",1); 
  var addressLines = getReminderAddress(reminderObj.customer_info).split('\n');
  for (var i=0; i < addressLines.length; i++) {
    cell5.addParagraph(addressLines[i], "");
  }


 /***************
    4. TABLE ITEMS
  ***************/
  var titleTable = repDocObj.addTable("title_table");
  tableRow = titleTable.addRow();
  tableRow.addCell(texts.reminder, "bold title", 1);


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

  rowNumber = checkFileLength(reminderObj, repDocObj, param, texts, rowNumber);
  var dd = repTableObj.getHeader().addRow();
  dd.addCell(texts.invoice_no, "items_table_header center", 1);
  dd.addCell(texts.invoice_date, "items_table_header center", 1);
  dd.addCell(texts.invoice_debit, "items_table_header center", 1);
  dd.addCell(texts.invoice_credit, "items_table_header center", 1);
  dd.addCell(texts.invoice_balance, "items_table_header center", 1);
  dd.addCell(texts.invoice_currency, "items_table_header center", 1);
  dd.addCell(texts.invoice_status, "items_table_header center", 1);

  //ITEMS
  var countRows = 0;
  for (var i = 0; i < reminderObj.items.length; i++) 
  {
    var item = reminderObj.items[i];

    var classRow = "item_row";
    if (item.item_type && item.item_type.indexOf("total") === 0) {
      classRow = "item_total";
    }


    var classTotal = "";
    if (i == reminderObj.items.length-1) {
      classTotal = " bold total";

      rowNumber = checkFileLength(reminderObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell("", "", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
    }

    rowNumber = checkFileLength(reminderObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow(classRow);

    tableRow.addCell(item.number, "center padding-left padding-right" + classTotal, 1);
    tableRow.addCell(Banana.Converter.toLocaleDateFormat(item.date), "padding-left padding-right border-left" + classTotal, 1);
    tableRow.addCell(getFormattedAmount(reminderObj, item.debit), "padding-left padding-right border-left amount" + classTotal, 1);
    tableRow.addCell(getFormattedAmount(reminderObj, item.credit), "padding-left padding-right border-left amount" + classTotal, 1);
    tableRow.addCell(getFormattedAmount(reminderObj, item.balance), "padding-left padding-right border-left amount" + classTotal, 1);
    tableRow.addCell(item.currency, "center padding-left padding-right border-left" + classTotal, 1);
    var status = item.status;
    if (status.length>13) {
      status = status.substr(0,13) + ".";
    }
    tableRow.addCell(status, "center padding-left padding-right border-left" + classTotal, 1);
  }

  //Set reminder style
	setReminderStyle(reportObj, repStyleObj, param);

}

function getFormattedAmount(reminder, value) {

    return Banana.Converter.toLocaleNumberFormat(value, reminder.document_info.decimals_amounts, true);
}


function getReminderAddress(invoiceAddress) {
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


function checkFileLength(reminderObj, repDocObj, param, texts, rowNumber)
{
  if (rowNumber >= 37) 
  {
    repDocObj.addPageBreak();
    pageNr++;

    printStatementDetails(reminderObj, repDocObj, param, texts, rowNumber);
    printItemsHeader(reminderObj, repDocObj, param, texts, rowNumber);

    return 0;
  }

  rowNumber++;
  return rowNumber;
}


function printStatementDetails(reminderObj, repDocObj, param, texts, rowNumber) {
  var addressTable = repDocObj.addTable("address_table_row0");
  var addressCol1 = addressTable.addColumn("addressCol1R0");

  tableRow = addressTable.addRow();
  var cell1 = tableRow.addCell("", "", 1);
  cell1.addParagraph(texts.date + ": " + Banana.Converter.toLocaleDateFormat(reminderObj.document_info.date), "");  
  cell1.addParagraph(texts.customer + ": " + reminderObj.customer_info.number, "");
  cell1.addParagraph(texts.page + ": " + pageNr, "");
}


function printItemsHeader(reminderObj, repDocObj, param, texts, rowNumber) {
  repTableObj = repDocObj.addTable("doc_table_row0");
  var repTableCol1 = repTableObj.addColumn("repTableCol1");
  var repTableCol2 = repTableObj.addColumn("repTableCol2");
  var repTableCol3 = repTableObj.addColumn("repTableCol3");
  var repTableCol4 = repTableObj.addColumn("repTableCol4");
  var repTableCol5 = repTableObj.addColumn("repTableCol5");
  var repTableCol6 = repTableObj.addColumn("repTableCol6");
  var repTableCol7 = repTableObj.addColumn("repTableCol7");

  var dd = repTableObj.getHeader().addRow();
  dd.addCell(texts.invoice_no, "items_table_header center", 1);
  dd.addCell(texts.invoice_date, "items_table_header center", 1);
  dd.addCell(texts.invoice_debit, "items_table_header center", 1);
  dd.addCell(texts.invoice_credit, "items_table_header center", 1);
  dd.addCell(texts.invoice_balance, "items_table_header center", 1);
  dd.addCell(texts.invoice_currency, "items_table_header center", 1);
  dd.addCell(texts.invoice_status, "items_table_header center", 1);
}


//====================================================================//
// STYLES
//====================================================================//
function setReminderStyle(reportObj, repStyleObj, param) {
    
    if (!repStyleObj) {
        repStyleObj = reportObj.newStyleSheet();
    }

    //Set default values
    if (!param.font_family) {
        param.font_family = "Calibri";
    }

    if (!param.color_1) {
        param.color_1 = "#ed1c24";
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

    //Set page layout
    var pageStyle = repStyleObj.addStyle("@page");
    pageStyle.setAttribute("margin", "0mm 0mm 0mm 0mm");

    repStyleObj.addStyle(".pageReset", "counter-reset: page");
    repStyleObj.addStyle("body", "font-size: 12pt; font-family:" + param.font_family);
    repStyleObj.addStyle(".headerAddress", "font-size:11pt;text-align:right;");
    repStyleObj.addStyle(".amount", "text-align:right");
    repStyleObj.addStyle(".subtotal_cell", "font-weight:bold;");
    repStyleObj.addStyle(".center", "text-align:center");
    repStyleObj.addStyle(".left", "text-align:left");
    repStyleObj.addStyle(".bold", "font-weight: bold");
    repStyleObj.addStyle(".title", "font-size:18pt;");
    repStyleObj.addStyle(".items_table_header", "font-weight:bold; background-color:" + param.color_2);
    repStyleObj.addStyle(".items_table_header td", "padding-top:5px; padding-bottom:5px");
    repStyleObj.addStyle(".total", "font-size:14pt; ");
    repStyleObj.addStyle(".evenRowsBackgroundColor", "background-color:" + param.color_2);    
    repStyleObj.addStyle(".border-bottom", "border-bottom:2px solid " + param.color_2);
    repStyleObj.addStyle(".border-top", "border-top:2px solid " + param.color_2);
    repStyleObj.addStyle(".border-left", "border-left:thin solid " + param.color_2);
    repStyleObj.addStyle(".padding-right", "padding-right:3px");
    repStyleObj.addStyle(".padding-left", "padding-left:3px");
    repStyleObj.addStyle(".padding-bottom", "padding-bottom:5px");
    repStyleObj.addStyle(".addressCol1","width:43%");
    repStyleObj.addStyle(".addressCol2","width:43%");
    repStyleObj.addStyle(".addressCol1R0","width:100%");

    repStyleObj.addStyle(".repTableCol1","width:10%");
    repStyleObj.addStyle(".repTableCol2","width:11%");
    repStyleObj.addStyle(".repTableCol3","width:12%");
    repStyleObj.addStyle(".repTableCol4","width:12%");
    repStyleObj.addStyle(".repTableCol5","width:12%");
    repStyleObj.addStyle(".repTableCol6","width:7%");
    repStyleObj.addStyle(".repTableCol7","width:10%");

    repStyleObj.addStyle(".summary_filename", "padding-top:10mm;padding-left:10mm;font-size:8pt;");
    repStyleObj.addStyle(".summary_title", "padding-top:20mm; padding-left:10mm; font-size: 16pt; ");
    repStyleObj.addStyle(".summary_title2", "padding-left:10mm; font-size: 11pt; ");
    repStyleObj.addStyle(".summary_table_header", "font-weight:bold; background-color:" + param.color_2);
    repStyleObj.addStyle(".summary_table_header td", "padding-top:2mm; padding-bottom:2mm;font-size:12pt;");
    repStyleObj.addStyle(".summary_table_customer", "font-weight:bold; font-size:12pt; padding-top:2mm;padding-bottom:2mm;");
    repStyleObj.addStyle(".summary_table_details td.detail_row", "");
    repStyleObj.addStyle(".summary_table_details td.date", "padding-left:5mm;padding-right:10mm;");
    repStyleObj.addStyle(".summary_table_details td.number", "padding-right:10mm");
    repStyleObj.addStyle(".summary_table_details td.currency", "padding-right:10mm");
    repStyleObj.addStyle(".summary_table_details td", "font-size:12pt;");
    repStyleObj.addStyle(".summary_table_details tr.total td.amount", "border-top:1px solid black;padding-bottom:5px;font-weight:bold");
    repStyleObj.addStyle(".summary_table_grandtotal td", "font-weight:bold");
    repStyleObj.addStyle(".summary_table_grandtotal td.amount", "border-top:1px solid black; border-bottom:1px double black;");
    repStyleObj.addStyle(".summary_table td.status", "padding-left:20px;");


    //====================================================================//
    // LOGO
    //====================================================================//
    var logoStyle = repStyleObj.addStyle(".logoStyle");
    logoStyle.setAttribute("position", "absolute");
    logoStyle.setAttribute("margin-top", "5mm");
    logoStyle.setAttribute("margin-left", "16mm");
    logoStyle.setAttribute("width", "120px");

    //====================================================================//
    // TABLES
    //====================================================================//
    var headerStyle = repStyleObj.addStyle(".header_table");
    headerStyle.setAttribute("position", "absolute");
    headerStyle.setAttribute("margin-top", "7mm"); 
    headerStyle.setAttribute("margin-left", "20mm");
    headerStyle.setAttribute("margin-right", "16mm");
    headerStyle.setAttribute("width", "100%");
    //repStyleObj.addStyle("table.header_table td", "border: thin solid black");


    var infoStyle = repStyleObj.addStyle(".title_table");
    infoStyle.setAttribute("position", "absolute");
    infoStyle.setAttribute("margin-top", "90mm");
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
    itemsStyle.setAttribute("margin-top", "105mm"); //106
    itemsStyle.setAttribute("margin-left", "23mm"); //20
    itemsStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.doc_table td", "border: thin solid #6959CD;");
    itemsStyle.setAttribute("width", "100%");


    var itemsStyle = repStyleObj.addStyle(".doc_table_row0");
    itemsStyle.setAttribute("margin-top", "45mm"); //106
    itemsStyle.setAttribute("margin-left", "23mm"); //20
    itemsStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.doc_table td", "border: thin solid #282828; padding: 3px;");
    itemsStyle.setAttribute("width", "100%");
	
    var summaryStyle = repStyleObj.addStyle(".summary_table");
    summaryStyle.setAttribute("position", "relative");
    summaryStyle.setAttribute("margin-top", "10mm");
    summaryStyle.setAttribute("margin-left", "10mm");
    summaryStyle.setAttribute("margin-right", "10mm");
    summaryStyle.setAttribute("margin-bottom", "10mm");
    summaryStyle.setAttribute("width", "100%");
    //repStyleObj.addStyle("table.summary_table td", "border: thin solid black");

}

function setTexts(language) {
  var texts = {};
  if (language == 'it')
  {
  texts.customer = 'No Cliente';
  texts.date = 'Data';
  texts.page = 'Pagina';
  texts.invoice_no = 'No fattura';
  texts.invoice_date = 'Data';
  texts.invoice_debit = 'Importo';
  texts.invoice_credit = 'Pagamenti';
  texts.invoice_balance = 'Saldo';
  texts.invoice_currency = 'Divisa';
  texts.invoice_status = 'Situazione';
  texts.reminder = 'Richiamo di pagamento';
  }
  else if (language == 'de')
  {
  texts.customer = 'Kunde-Nr';
  texts.date = 'Datum';
  texts.page = 'Seite';
  texts.invoice_no = 'Rechnung-Nr';
  texts.invoice_date = 'Datum';
  texts.invoice_debit = 'Soll';
  texts.invoice_credit = 'Haben';
  texts.invoice_balance = 'Saldo';
  texts.invoice_currency = 'Währung';
  texts.invoice_status = 'Status';
  texts.reminder = 'Zahlungserinnerung';
  }
  else if (language == 'fr')
  {
  texts.customer = 'No Client';
  texts.date = 'Date';
  texts.page = 'Page';
  texts.invoice_no = 'No facture';
  texts.invoice_date = 'Date';
  texts.invoice_debit = 'Débit';
  texts.invoice_credit = 'Crédit';
  texts.invoice_balance = 'Solde';
  texts.invoice_currency = 'Devise';
  texts.invoice_status = 'Situation';
  texts.reminder = 'Rappel de paiement';
  }
  else if (language == 'nl')
  {
  texts.customer = 'Klantennummer';
  texts.date = 'Datum';
  texts.page = 'Pagina';
  texts.invoice_no = 'Factuurnummer';
  texts.invoice_date = 'Datum';
  texts.invoice_debit = 'Debit';
  texts.invoice_credit = 'Credit';
  texts.invoice_balance = 'Saldo';
  texts.invoice_currency = 'Valuta';
  texts.invoice_status = 'Status';
  texts.reminder = 'Betalingsherinnering';
  }
  else
  {
  texts.customer = 'Customer No';
  texts.date = 'Date';
  texts.page = 'Page';
  texts.invoice_no = 'Invoice Nr';
  texts.invoice_date = 'Date';
  texts.invoice_debit = 'Debit';
  texts.invoice_credit = 'Credit';
  texts.invoice_balance = 'Balance';
  texts.invoice_currency = 'Currency';
  texts.invoice_status = 'Status';
  texts.reminder = 'Payment reminder';
  }
  return texts;
}

