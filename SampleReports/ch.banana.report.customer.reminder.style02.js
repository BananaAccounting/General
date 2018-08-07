// Copyright [2018] [Banana.ch SA - Lugano Switzerland]
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
// @pubdate = 2018-08-06
// @publisher = Banana.ch SA
// @description = Payment reminder, with logo
// @description.it = Richiamo di pagamento, con logo
// @description.de = Zahlungserinnerung, mit Logo
// @description.fr = Rappel de paiement, avec logo
// @description.nl = Betalingsherinnering, met logo
// @description.en = Payment reminder, with logo
// @doctype = *
// @task = report.customer.reminder

function addPageHeader(invoiceObj, repDocObj, repStyleObj, param, texts) {

  // Page header
  if (repDocObj === undefined || repStyleObj === undefined)
    return;

  /***********
    LOGO
  ***********/
  var headerLogoSection = repDocObj.addSection("");
  if (param.print_logo) {
    //Check the version of Banana:
    //If 9.0.3 or greater we try to use the defined logo (not the one of the table documents).
    //If logo doesn't exists or Banana version is older than 9.0.3, we use the logo of the table Documents
    var requiredVersion = "9.0.3";
    if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) >= 0) {
      var logoFormat = Banana.Report.logoFormat("Logo");
      if (!logoFormat)
        logoFormat = Banana.Report.logoFormat("__default__");
      if (logoFormat) {
        var logoElement = logoFormat.createDocNode(headerLogoSection, repStyleObj, "logo");
        repDocObj.getHeader().addChild(logoElement);
      }
      else {
        Banana.document.addMessage( texts.err_msg01, "error");
      }
    }
  }

  /***********
    ADDRESS
  ***********/
  var table = repDocObj.getHeader().addTable("header_table");
  var col1 = table.addColumn("col1");
  var col2 = table.addColumn("col2");

  if (param.print_header) {
    tableRow = table.addRow();
    var cell1 = tableRow.addCell("", "");
    var cell2 = tableRow.addCell("", "amount");
    var supplierNameLines = getInvoiceSupplierName(invoiceObj.supplier_info).split('\n');
    for (var i=0; i < supplierNameLines.length; i++) {
      cell2.addParagraph(supplierNameLines[i], "bold", 1);
    }
    var supplierLines = getInvoiceSupplier(invoiceObj.supplier_info).split('\n');
    for (var i=0; i < supplierLines.length; i++) {
      cell2.addParagraph(supplierLines[i], "", 1);
    }
  }
  else {
    tableRow = table.addRow();
    var cell1 = tableRow.addCell("", "");
    var cell2 = tableRow.addCell("", "");
    cell2.addParagraph(" ");
    cell2.addParagraph(" ");
    cell2.addParagraph(" ");
    cell2.addParagraph(" ");
  }

}

function convertParam(param) {
   var lang = 'en';
   if (Banana.document.locale)
     lang = Banana.document.locale;
   if (lang.length > 2)
      lang = lang.substr(0, 2);
   var texts = setTexts(lang);

   var convertedParam = {};
   convertedParam.version = '1.0';
   /*array dei parametri dello script*/
   convertedParam.data = [];
   
   var currentParam = {};
   currentParam.name = 'print_header';
   currentParam.title = texts.param_print_header;
   currentParam.type = 'bool';
   currentParam.value = param.print_header ? true : false;
   currentParam.readValue = function() {
     param.print_header = this.value;
   }
   convertedParam.data.push(currentParam);

   currentParam = {};
   currentParam.name = 'print_logo';
   currentParam.title = texts.param_print_logo;
   currentParam.type = 'bool';
   currentParam.value = param.print_logo ? true : false;
   currentParam.readValue = function() {
     param.print_logo = this.value;
   }
   convertedParam.data.push(currentParam);

   currentParam = {};
   currentParam.name = 'font_family';
   currentParam.title = texts.param_font_family;
   currentParam.type = 'string';
   currentParam.value = param.font_family ? param.font_family : '';
   currentParam.readValue = function() {
     param.font_family = this.value;
   }
   convertedParam.data.push(currentParam);

   currentParam = {};
   currentParam.name = 'color_1';
   currentParam.title = texts.param_color_1;
   currentParam.type = 'string';
   currentParam.value = param.color_1 ? param.color_1 : '#337ab7';
   currentParam.readValue = function() {
     param.color_1 = this.value;
   }
   convertedParam.data.push(currentParam);

   currentParam = {};
   currentParam.name = 'color_2';
   currentParam.title = texts.param_color_2;
   currentParam.type = 'string';
   currentParam.value = param.color_2 ? param.color_2 : '#ffffff';
   currentParam.readValue = function() {
     param.color_2 = this.value;
   }
   convertedParam.data.push(currentParam);

   return convertedParam;
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

  if (invoiceSupplier.address1) {
    supplierAddress = supplierAddress + invoiceSupplier.address1 + "\n";
  }
  
  if (invoiceSupplier.address2) {
    supplierAddress = supplierAddress + invoiceSupplier.address2 + "\n";
  }

  if (invoiceSupplier.postal_code) {
    supplierAddress = supplierAddress + invoiceSupplier.postal_code + " ";
  }
  
  if (invoiceSupplier.city) {
    supplierAddress = supplierAddress + invoiceSupplier.city + "\n";
  }
  
  if (invoiceSupplier.phone) {
    supplierAddress = supplierAddress + "Tel: " + invoiceSupplier.phone + "\n";
  }
  
  if (invoiceSupplier.fax) {
    supplierAddress = supplierAddress + "Fax: " + invoiceSupplier.fax + "\n";
  }
  
  if (invoiceSupplier.email) {
    supplierAddress = supplierAddress + invoiceSupplier.email + "\n";
  }
  
  if (invoiceSupplier.web) {
    supplierAddress = supplierAddress + invoiceSupplier.web + "\n";
  }
 
  if (invoiceSupplier.vat_number) {
    supplierAddress = supplierAddress + invoiceSupplier.vat_number;
  }

  return supplierAddress;
}

function getInvoiceSupplierName(invoiceSupplier) {
  
  var supplierName = "";

  if (invoiceSupplier.business_name) {
    supplierName = invoiceSupplier.business_name + "\n";
  }
  
  if (supplierName.length<=0)
  {
    if (invoiceSupplier.first_name) {
      supplierName = invoiceSupplier.first_name + " ";
    }
  
    if (invoiceSupplier.last_name) {
      supplierName = supplierName + invoiceSupplier.last_name + "\n";
    }
  }
  return supplierName;
}

function initParam() {
   var param = {};
   param.print_header = true;
   param.print_logo = true;
   param.font_family = '';
   param.color_1 = '#337ab7';
   param.color_2 = '#ffffff';
   return param;
}

function printDocument(jsonObj, repDocObj, repStyleObj) {
  var param = initParam();
  var savedParam = Banana.document.getScriptSettings();
  if (savedParam.length > 0) {
    param = JSON.parse(savedParam);
    param = verifyParam(param);
  }
  printReminder(jsonObj, repDocObj, repStyleObj, param);
  setStyle(jsonObj, repStyleObj, param);
}

function printReminder(jsonObj, repDocObj, repStyleObj, param) {
  // jsonObj can be a json string or a js object
  var invoiceObj = null;
  if (typeof(jsonObj) === 'object') {
    invoiceObj = jsonObj;
  } else if (typeof(jsonObj) === 'string') {
    invoiceObj = JSON.parse(jsonObj)
  }

  // Invoice texts which need translation
  var langDoc = '';
  if (invoiceObj.customer_info.lang )
    langDoc = invoiceObj.customer_info.lang;
  if (langDoc.length <= 0)
    langDoc = invoiceObj.document_info.locale;
  var texts = setTexts(langDoc);

  // Invoice document
  if (!repDocObj) {
    repDocObj = Banana.Report.newReport(texts.reminder + " " + invoiceObj.customer_info.number);
  } else {
    var pageBreak = repDocObj.addPageBreak();
    pageBreak.addClass("pageReset");
  }

  var pageNumber = 1;
  addPageHeader(invoiceObj, repDocObj, repStyleObj, param, texts);
  printReminderAddress(invoiceObj, repDocObj, texts, pageNumber);
  printReminderHeader(invoiceObj, repDocObj, texts);


  //ITEMS
  var rowNumber = 0;
  var maxRowNumber = 28;
  for (var i = 0; i < invoiceObj.items.length; i++) {
    var item = invoiceObj.items[i];

    var classRow = "item_row";
    if (item.item_type && item.item_type.indexOf("total") === 0) {
      classRow = "item_total";
    }
    var classTotal = "";
    if (i == invoiceObj.items.length-1) {
      classTotal = " bold total";

      tableRow = repTableObj.addRow();
      tableRow.addCell("", "", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
      tableRow.addCell("", "border-left", 1);
    }

    if (parseInt(rowNumber) >= maxRowNumber) { 
      repDocObj.addPageBreak();
      rowNumber = 0;
      pageNumber += 1;
      printReminderAddress(invoiceObj, repDocObj, texts, pageNumber);
      printReminderHeader(invoiceObj, repDocObj, texts);
      printReminderFooter(invoiceObj, repDocObj, texts);
    }

    tableRow = repTableObj.addRow(classRow);
    rowNumber = rowNumber + 1;

    tableRow.addCell(item.number, "center padding-left padding-right" + classTotal, 1);
    tableRow.addCell(Banana.Converter.toLocaleDateFormat(item.date), "padding-left padding-right border-left" + classTotal, 1);
    tableRow.addCell(toInvoiceAmountFormat(invoiceObj, item.debit), "padding-left padding-right border-left amount" + classTotal, 1);
    tableRow.addCell(toInvoiceAmountFormat(invoiceObj, item.credit), "padding-left padding-right border-left amount" + classTotal, 1);
    tableRow.addCell(toInvoiceAmountFormat(invoiceObj, item.balance), "padding-left padding-right border-left amount" + classTotal, 1);
    tableRow.addCell(item.currency, "center padding-left padding-right border-left" + classTotal, 1);
    var status = item.status;
    if (status.length>13) {
      status = status.substr(0,13) + ".";
    }
    tableRow.addCell(status, "center padding-left padding-right border-left" + classTotal, 1);
  }

  tableRow = repTableObj.addRow();
  tableRow.addCell("", "border-bottom", 7);

  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 7);

  return repDocObj;
}

function printReminderAddress(invoiceObj, repDocObj, texts, pageNumber) {

  var infoTable = repDocObj.addTable("info_table");
  var col1 = infoTable.addColumn("infoCol1");
  var col2 = infoTable.addColumn("infoCol2");
  var col3 = infoTable.addColumn("infoCol3");

  tableRow = infoTable.addRow();
  tableRow.addCell(" ", "", 3);

  tableRow = infoTable.addRow();
  var cell1 = tableRow.addCell("","",1);
  var cell2 = tableRow.addCell("", "bold", 1);
  var cell3 = tableRow.addCell("", "", 1);

  var documentDate = Banana.Converter.toLocaleDateFormat(invoiceObj.document_info.date);
  cell1.addParagraph(texts.date + ":", "");
  cell1.addParagraph(texts.customer + ":", "");
  cell1.addParagraph(texts.page + ":", "");

  cell2.addParagraph(documentDate, "");
  cell2.addParagraph(invoiceObj.customer_info.number, "");
  //cell2.addParagraph("", "").addFieldPageNr();
  cell2.addParagraph(pageNumber, "");

  var addressLines = getInvoiceAddress(invoiceObj.customer_info).split('\n');
  for (var i=0; i < addressLines.length; i++) {
    cell3.addParagraph(addressLines[i]);
  }

}

function printReminderHeader(invoiceObj, repDocObj, texts) {
  /***************
    2. TABLE
  ***************/
  repTableObj = repDocObj.addTable("doc_table");
  var repTableCol1 = repTableObj.addColumn("repTableCol1");
  var repTableCol2 = repTableObj.addColumn("repTableCol2");
  var repTableCol3 = repTableObj.addColumn("repTableCol3");
  var repTableCol4 = repTableObj.addColumn("repTableCol4");
  var repTableCol5 = repTableObj.addColumn("repTableCol5");
  var repTableCol6 = repTableObj.addColumn("repTableCol6");
  var repTableCol7 = repTableObj.addColumn("repTableCol7");

  
  var dd = repTableObj.getHeader().addRow();
  dd.addCell(texts.reminder, "bold title", 7);

  dd = repTableObj.getHeader().addRow();
  dd.addCell(texts.invoice_no, "doc_table_header", 1);
  dd.addCell(texts.invoice_date, "doc_table_header", 1);
  dd.addCell(texts.invoice_debit, "doc_table_header amount", 1);
  dd.addCell(texts.invoice_credit, "doc_table_header amount", 1);
  dd.addCell(texts.invoice_balance, "doc_table_header amount", 1);
  dd.addCell(texts.invoice_currency, "doc_table_header", 1);
  dd.addCell(texts.invoice_status, "doc_table_header", 1);
}

function printReminderFooter(invoiceObj, repDocObj, texts) {
}

//====================================================================//
// STYLES
//====================================================================//
function setStyle(reportObj, repStyleObj, param) {

    if (!repStyleObj) {
        repStyleObj = reportObj.newStyleSheet();
    }

    //Set default values
    if (!param.font_family) {
      param.font_family = "Helvetica";
    }

    if (!param.color_1) {
        param.color_1 = "#337ab7";
    }

    if (!param.color_2) {
        param.color_2 = "#ffffff";
    }

    //====================================================================//
    // GENERAL
    //====================================================================//
    repStyleObj.addStyle("phead", "margin-bottom: 15em");
    repStyleObj.addStyle("body", "font-size: 11pt; font-family:" + param.font_family);
    repStyleObj.addStyle(".amount", "text-align:right");
    repStyleObj.addStyle(".bold", "font-weight: bold");
    repStyleObj.addStyle(".border-bottom", "border-bottom:2px solid " + param.color_1);
    repStyleObj.addStyle(".col1","width:50%");
    repStyleObj.addStyle(".col2","width:49%");
    repStyleObj.addStyle(".doc_table_header", "font-weight:bold; background-color:" + param.color_1 + "; color:" + param.color_2);
    repStyleObj.addStyle(".doc_table_header td", "padding:5px;");
    repStyleObj.addStyle(".infoCol1","width:15%");
    repStyleObj.addStyle(".infoCol2","width:30%");
    repStyleObj.addStyle(".infoCol3","width:54%");
    repStyleObj.addStyle(".item_row","padding-top:3px;");
    repStyleObj.addStyle(".padding-right", "padding-right:5px");
    repStyleObj.addStyle(".padding-left", "padding-left:5px");
    repStyleObj.addStyle(".pageReset", "counter-reset: page");
    repStyleObj.addStyle(".subtotal_cell", "font-weight:bold; background-color:" + param.color_1 + "; color: " + param.color_2 + "; padding:5px");
    repStyleObj.addStyle(".thin-border-top", "border-top:thin solid " + param.color_1);
    repStyleObj.addStyle(".title", "font-size:18pt;padding-bottom:10px");
    repStyleObj.addStyle(".total_cell", "font-weight:bold; background-color:" + param.color_1 + "; color: " + param.color_2 + "; padding:5px");

    repStyleObj.addStyle(".repTableCol1","width:10%");
    repStyleObj.addStyle(".repTableCol2","width:11%");
    repStyleObj.addStyle(".repTableCol3","width:12%");
    repStyleObj.addStyle(".repTableCol4","width:12%");
    repStyleObj.addStyle(".repTableCol5","width:12%");
    repStyleObj.addStyle(".repTableCol6","width:7%");
    repStyleObj.addStyle(".repTableCol7","width:10%");
    
    repStyleObj.addStyle(".summary_filename", "margin-left:20mm; font-size:8pt;");
    repStyleObj.addStyle(".summary_title", "margin-left:20mm; font-size: 18pt; ");
    repStyleObj.addStyle(".summary_title2", "margin-left:20mm; font-size: 11pt; ");
    repStyleObj.addStyle(".summary_table_header", "font-weight:bold;");
    repStyleObj.addStyle(".summary_table_header td", "padding-top:2mm; padding-bottom:2mm;font-size:12pt;");
    repStyleObj.addStyle(".summary_table_customer", "font-weight:bold; font-size:12pt; padding-top:2mm;padding-bottom:2mm;");
    repStyleObj.addStyle(".summary_table_details td.detail_row", "padding-top:7px;");
    repStyleObj.addStyle(".summary_table_details td.date", "padding-left:5mm;padding-right:10mm;");
    repStyleObj.addStyle(".summary_table_details td.number", "padding-right:10mm");
    repStyleObj.addStyle(".summary_table_details td.currency", "padding-right:10mm");
    repStyleObj.addStyle(".summary_table_details td", "font-size:12pt;");
    repStyleObj.addStyle(".summary_table_details tr.total td.amount", "border-top:1px solid black;padding-bottom:5px;font-weight:bold");
    repStyleObj.addStyle(".summary_table_grandtotal td", "font-weight:bold");
    repStyleObj.addStyle(".summary_table_grandtotal td.amount", "border-top:1px solid black; border-bottom:1px double black;padding-bottom:5px;");
    repStyleObj.addStyle(".summary_table td.status", "padding-left:20px;");

    var rectangleStyle = repStyleObj.addStyle(".rectangle");
    rectangleStyle.setAttribute("width","50px");
    rectangleStyle.setAttribute("height","100mm");
    rectangleStyle.setAttribute("background-color","white");

    //====================================================================//
    // LOGO
    //====================================================================//
    var logoStyle = repStyleObj.addStyle(".logo");
    logoStyle.setAttribute("position", "absolute");
    logoStyle.setAttribute("margin-top", "10mm");
    logoStyle.setAttribute("margin-left", "20mm");

    //====================================================================//
    // TABLES
    //====================================================================//
    var headerStyle = repStyleObj.addStyle(".header_table");
    headerStyle.setAttribute("position", "absolute");
    headerStyle.setAttribute("margin-top", "10mm"); 
    headerStyle.setAttribute("margin-left", "22mm");
    headerStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.header_table td", "border: thin solid black");
    headerStyle.setAttribute("width", "100%");

    var infoStyle = repStyleObj.addStyle(".info_table");
    infoStyle.setAttribute("position", "absolute");
    infoStyle.setAttribute("margin-top", "-20mm"); 
    infoStyle.setAttribute("margin-left", "20mm");
    infoStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.info_table td", "border: thin solid black");

    var itemsStyle = repStyleObj.addStyle(".doc_table");
    itemsStyle.setAttribute("margin-top", "35mm");
    itemsStyle.setAttribute("margin-left", "23mm");
    itemsStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.doc_table td", "border: thin solid black; padding: 3px;");
    itemsStyle.setAttribute("width", "100%");
    
    var summaryStyle = repStyleObj.addStyle(".summary_table");
    summaryStyle.setAttribute("position", "relative");
    summaryStyle.setAttribute("margin-left", "23mm");
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
  texts.err_msg01 = 'Immagine per il logo non trovata. Utilzzare il comando \'File - Imposta logo...\'';
  texts.page = 'Pagina';
  texts.invoice_no = 'No fattura';
  texts.invoice_date = 'Data';
  texts.invoice_debit = 'Importo';
  texts.invoice_credit = 'Pagamenti';
  texts.invoice_balance = 'Saldo';
  texts.invoice_currency = 'Divisa';
  texts.invoice_status = 'Situazione';
  texts.param_color_1 = 'Colore sfondo';
  texts.param_color_2 = 'Colore testo';
  texts.param_font_family = 'Tipo carattere';
  texts.param_print_header = 'Includi intestazione pagina (1=si, 0=no)';
  texts.param_print_logo = 'Stampa logo (1=si, 0=no)';
  texts.reminder = 'Richiamo di pagamento';
  }
  else if (language == 'de')
  {
  texts.customer = 'Kunde-Nr';
  texts.date = 'Datum';
  texts.err_msg01 = 'Logo nicht gefunden. Benutzen Sie bitte den Befehl \'Datei - Logo einrichten...\'';
  texts.page = 'Seite';
  texts.invoice_no = 'Rechnung-Nr';
  texts.invoice_date = 'Datum';
  texts.invoice_debit = 'Soll';
  texts.invoice_credit = 'Haben';
  texts.invoice_balance = 'Saldo';
  texts.invoice_currency = 'Währung';
  texts.invoice_status = 'Status';
  texts.param_color_1 = 'Hintergrundfarbe';
  texts.param_color_2 = 'Textfarbe';
  texts.param_font_family = 'Typ Schriftzeichen';
  texts.param_print_header = 'Seitenüberschrift einschliessen (1=ja, 0=nein)';
  texts.param_print_logo = 'Logo ausdrucken (1=ja, 0=nein)';
  texts.reminder = 'Zahlungserinnerung';
  }
  else if (language == 'fr')
  {
  texts.customer = 'No Client';
  texts.date = 'Date';
  texts.err_msg01 = 'Logo pas trouvé. Utiliser la commande \'Fichier - Configuration logo...\'';
  texts.page = 'Page';
  texts.invoice_no = 'No facture';
  texts.invoice_date = 'Date';
  texts.invoice_debit = 'Débit';
  texts.invoice_credit = 'Crédit';
  texts.invoice_balance = 'Solde';
  texts.invoice_currency = 'Devise';
  texts.invoice_status = 'Situation';
  texts.param_color_1 = 'Couleur de fond';
  texts.param_color_2 = 'Couleur du texte';
  texts.param_font_family = 'Police de caractère';
  texts.param_print_header = 'Inclure en-tête de page (1=oui, 0=non)';
  texts.param_print_logo = 'Imprimer logo (1=oui, 0=non)';
  texts.reminder = 'Rappel de paiement';
  }
  else if (language == 'nl')
  {
  texts.customer = 'Klantennummer';
  texts.date = 'Datum';
  texts.err_msg01 = 'Please add your logo using the command \'File - Logo setup...\'';
  texts.page = 'Pagina';
  texts.invoice_no = 'Factuurnummer';
  texts.invoice_date = 'Datum';
  texts.invoice_debit = 'Debit';
  texts.invoice_credit = 'Credit';
  texts.invoice_balance = 'Saldo';
  texts.invoice_currency = 'Valuta';
  texts.invoice_status = 'Status';
  texts.param_color_1 = 'Achtergrond kleur';
  texts.param_color_2 = 'tekstkleur';
  texts.param_font_family = 'Lettertype';
  texts.param_print_header = 'Pagina-koptekst opnemen (1=ja, 0=nee)';
  texts.param_print_logo = 'Druklogo (1=ja, 0=nee)';
  texts.reminder = 'Betalingsherinnering';
  }
  else
  {
  texts.customer = 'Customer No';
  texts.date = 'Date';
  texts.err_msg01 = 'Please add your logo using the command \'File - Logo setup...\'';
  texts.page = 'Page';
  texts.invoice_no = 'Invoice Nr';
  texts.invoice_date = 'Date';
  texts.invoice_debit = 'Debit';
  texts.invoice_credit = 'Credit';
  texts.invoice_balance = 'Balance';
  texts.invoice_currency = 'Currency';
  texts.invoice_status = 'Status';
  texts.param_color_1 = 'Background Color';
  texts.param_color_2 = 'Text Color';
  texts.param_font_family = 'Font type';
  texts.param_print_header = 'Include page header (1=yes, 0=no)';
  texts.param_print_logo = 'Print logo (1=yes, 0=no)';
  texts.reminder = 'Payment reminder';
  }
  return texts;
}

/*Update script's parameters*/
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
     var texts = setTexts(lang);
     
     param.print_header = Banana.Ui.getInt('Settings', texts.param_print_header, param.print_header);
     if (param.print_header === undefined)
        return;

     param.print_logo = Banana.Ui.getInt('Settings', texts.param_print_logo, param.print_logo);
     if (param.print_logo === undefined)
        return;

     param.color_1 = Banana.Ui.getText('Settings', texts.param_color_1, param.color_1);
     if (param.color_1 === undefined)
        return;
      
     param.color_2 = Banana.Ui.getText('Settings', texts.param_color_2, param.color_2);
     if (param.color_2 === undefined)
        return;
   }
   
   var paramToString = JSON.stringify(param);
   var value = Banana.document.setScriptSettings(paramToString);
}

function toInvoiceAmountFormat(invoice, value) {
    return Banana.Converter.toLocaleNumberFormat(value, invoice.document_info.decimals_amounts, true);
}

function verifyParam(param) {
   if (!param.print_header)
     param.print_header = false;
   if (!param.print_logo)
     param.print_logo = false;
   if (!param.font_family)
     param.font_family = '';
   if (!param.color_1)
     param.color_1 = '#337ab7';
   if (!param.color_2)
     param.color_2 = '#ffffff';
   return param;
}
