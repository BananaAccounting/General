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
// @id = ch.banana.ch.invoice.chredis.js
// @api = 1.0
// @pubdate = 2018-04-17
// @publisher = Banana.ch SA
// @description = [CHRED]Invoice with Red Inpayment slip (IS), logo and address
// @description.it = [CHRED]Fattura con Polizza di versamento rossa (PV), logo e indirizzo
// @description.de = [CHRED]Rechnung mit Roter Einzahlungsschein (ES), Logo und Adresse
// @description.fr = [CHRED]Facture avec Bulletin de versement rouge (BV), logo et adresse
// @doctype = *
// @task = report.customer.invoice


var rowNumber = 0;
var pageNr = 1;
var repTableObj = "";
var max_items_per_page = 31;
var max_items_per_page_with_isr = 18;

/*Update script's parameters*/
function settingsDialog() {
   var param = initParam();
   var savedParam = Banana.document.getScriptSettings();
   if (savedParam.length > 0) {
      param = JSON.parse(savedParam);
   }   
   param = verifyParam(param);
   
   if (typeof (Banana.Ui.openPropertyEditor) !== 'undefined') {
      param = Banana.Ui.openPropertyEditor('Settings', convertParam(param));
      if (!param)
         return;
   }
   else {
   var lang = Banana.document.locale;
   if (lang.length>2)
      lang = lang.substr(0,2);
   var texts = setInvoiceTexts(lang);
   
   param.print_header = Banana.Ui.getInt('Settings', texts.param_print_header, param.print_header);
   if (param.print_header === undefined)
      return;

   param.print_isr = Banana.Ui.getInt('Settings', texts.param_print_isr, param.print_isr);
   if (param.print_isr === undefined)
      return;

   if (param.print_isr === 1) {
      param.einzahlungFur_row1 = Banana.Ui.getText('Settings', texts.param_einzahlungFur_row1, param.einzahlungFur_row1);
      if (param.einzahlungFur_row1 === undefined)
         return;
      param.einzahlungFur_row2 = Banana.Ui.getText('Settings', texts.param_einzahlungFur_row2, param.einzahlungFur_row2);
      if (param.einzahlungFur_row2 === undefined)
         return;
      param.post_account = Banana.Ui.getText('Settings', texts.param_post_account, param.post_account);
      if (param.post_account === undefined)
         return;
	 
      param.zugunstenVon_IBAN = Banana.Ui.getText('Settings', texts.param_zugunstenVon_IBAN, param.zugunstenVon_IBAN);
      if (param.zugunstenVon_IBAN === undefined)
         return;
	  	 
      param.isr_id = Banana.Ui.getText('Settings', texts.param_isr_id, param.isr_id);
      if (param.isr_id === undefined)
         return;
	 
	  param.isr_zahlungszweck = Banana.Ui.getText('Settings', texts.param_isr_zahlungszweck, param.isr_zahlungszweck);
      if (param.isr_zahlungszweck === undefined)
         return;
	 
      param.isr_position_scaleX = Banana.Ui.getText('Settings', texts.param_isr_position_scaleX, param.isr_position_scaleX);
      if (param.isr_position_scaleX === undefined)
         return;
      param.isr_position_scaleY = Banana.Ui.getText('Settings', texts.param_isr_position_scaleY, param.isr_position_scaleY);
      if (param.isr_position_scaleY === undefined)
         return;
      param.isr_position_dX = Banana.Ui.getText('Settings', texts.param_isr_position_dX, param.isr_position_dX);
      if (param.isr_position_dX === undefined)
         return;
      param.isr_position_dY = Banana.Ui.getText('Settings', texts.param_isr_position_dY, param.isr_position_dY);
      if (param.isr_position_dY === undefined)
         return;
      param.isr_on_new_page = Banana.Ui.getInt('Settings', texts.param_isr_on_new_page, param.isr_on_new_page);
      if (param.isr_on_new_page === undefined)
         return;
   }

   param.image_height = Banana.Ui.getInt('Settings', texts.param_image_height, param.image_height);
   if (param.image_height === undefined)
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

function convertParam(param) {
   var lang = 'en';
   if (Banana.document.locale)
     lang = Banana.document.locale;
   if (lang.length > 2)
      lang = lang.substr(0, 2);
   var texts = setInvoiceTexts(lang);

   var convertedParam = {};
   convertedParam.version = '1.0';
   /*array dei parametri dello script*/
   convertedParam.data = [];
   
   var currentParam = {};
   currentParam.name = 'print_header';
   currentParam.title = texts.param_print_header;
   currentParam.type = 'bool';
   currentParam.value = false;
   if (param.print_header)
     currentParam.value = true;
   var paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);
   
   currentParam = {};
   currentParam.name = 'color_1';
   currentParam.title = texts.param_color_1;
   currentParam.type = 'string';
   currentParam.value = '#337ab7';
   if (param.color_1)
     currentParam.value = param.color_1;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'color_2';
   currentParam.title = texts.param_color_2;
   currentParam.type = 'string';
   currentParam.value = '#ffffff';
   if (param.color_2)
     currentParam.value = param.color_2;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'image_height';
   currentParam.title = texts.param_image_height;
   currentParam.type = 'number';
   currentParam.value = '20';
   if (param.image_height)
     currentParam.value = param.image_height;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);
   
   
   currentParam = {};
   currentParam.name = 'print_isr';
   currentParam.title = texts.param_print_isr;
   currentParam.type = 'bool';
   currentParam.value = false;
   if (param.print_isr)
     currentParam.value = true;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'einzahlungFur_row1';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_einzahlungFur_row1;
   currentParam.type = 'string';
   currentParam.value = '';
   if (param.einzahlungFur_row1)
     currentParam.value = param.einzahlungFur_row1;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'einzahlungFur_row2';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_einzahlungFur_row2;
   currentParam.type = 'string';
   currentParam.value = '';
   if (param.einzahlungFur_row2)
     currentParam.value = param.einzahlungFur_row2;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);
   
   currentParam = {};
   currentParam.name = 'zugunstenVon_IBAN';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_zugunstenVon_IBAN;
   currentParam.type = 'string';
   currentParam.value = '';
   if (param.zugunstenVon_IBAN)
     currentParam.value = param.zugunstenVon_IBAN;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'post_account';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_post_account;
   currentParam.type = 'string';
   currentParam.value = '';
   if (param.post_account)
     currentParam.value = param.post_account;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'isr_id';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_isr_id;
   currentParam.type = 'string';
   currentParam.value = '';
   if (param.isr_id)
     currentParam.value = param.isr_id;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);
   
   currentParam = {};
   currentParam.name = 'isr_zahlungszweck';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_isr_zahlungszweck;
   currentParam.type = 'string';
   currentParam.value = '';
   if (param.isr_zahlungszweck)
     currentParam.value = param.isr_zahlungszweck;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'isr_position_scaleX';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_isr_position_scaleX;
   currentParam.type = 'number';
   currentParam.value = '1.0';
   if (param.isr_position_scaleX)
     currentParam.value = param.isr_position_scaleX;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'isr_position_scaleY';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_isr_position_scaleY;
   currentParam.type = 'number';
   currentParam.value = '1.0';
   if (param.isr_position_scaleY)
     currentParam.value = param.isr_position_scaleY;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'isr_position_dX';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_isr_position_dX;
   currentParam.type = 'number';
   currentParam.value = '1.0';
   if (param.isr_position_dX)
     currentParam.value = param.isr_position_dX;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'isr_position_dY';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_isr_position_dY;
   currentParam.type = 'number';
   currentParam.value = '1.0';
   if (param.isr_position_dY)
     currentParam.value = param.isr_position_dY;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   currentParam = {};
   currentParam.name = 'isr_on_new_page';
   currentParam.parentObject = 'print_isr';
   currentParam.title = texts.param_isr_on_new_page;
   currentParam.type = 'bool';
   currentParam.value = false;
   if (param.isr_on_new_page)
     currentParam.value = true;
   paramToString = JSON.stringify(currentParam);
   convertedParam.data.push(paramToString);

   return convertedParam;
}

function initParam() {
   var param = {};
   param.print_header = true;
   param.print_isr = false;
   param.einzahlungFur_row1 = '';
   param.einzahlungFur_row2 = '';
   param.zugunstenVon_IBAN = '';
   param.post_account = '00-00000-0';
   param.isr_id = '';
   param.isr_zahlungszweck = '';   
   param.isr_position_scaleX = '1.0';
   param.isr_position_scaleY = '1.0';
   param.isr_position_dX = '0';
   param.isr_position_dY = '0';
   param.isr_on_new_page = false;
   param.color_1 = '#337ab7';
   param.color_2 = '#ffffff';
   param.color_3 = '';
   param.color_4 = '';
   param.color_5 = '';
   param.image_height = '20';
   return param;
}

function verifyParam(param) {
   if (!param.print_header)
     param.print_header = false;
   if (!param.print_isr)
     param.print_isr = false;
   if (!param.einzahlungFur_row1)
     param.einzahlungFur_row1 = '';
   if (!param.einzahlungFur_row2)
     param.einzahlungFur_row2 = '';
   if (!param.zugunstenVon_IBAN)
     param.zugunstenVon_IBAN = '';
   if (!param.post_account)
     param.post_account = '';
   if (!param.isr_id)
     param.isr_id = '';
   if (!param.isr_zahlungszweck)
     param.isr_zahlungszweck = '';
   if (!param.isr_position_scaleX)
     param.isr_position_scaleX = '1.0';
   if (!param.isr_position_scaleY)
     param.isr_position_scaleY = '1.0';
   if (!param.isr_position_dX)
     param.isr_position_dX = '0';
   if (!param.isr_position_dY)
     param.isr_position_dY = '0';
   if (!param.isr_on_new_page)
     param.isr_on_new_page = false;
   if (!param.color_1)
     param.color_1 = '#337ab7';
   if (!param.color_2)
     param.color_2 = '#ffffff';
   if (!param.color_3)
     param.color_3 = '';
   if (!param.color_4)
     param.color_4 = '';
   if (!param.color_5)
     param.color_5 = '';
   if (!param.image_height)
     param.image_height = '20';
   
   return param;
}

//Return the invoice number without the prefix
function pvrInvoiceNumber(jsonInvoice) {
  var prefixLength = jsonInvoice["document_info"]["number"].indexOf('-');
  if (prefixLength >= 0) {
    return jsonInvoice["document_info"]["number"].substr(prefixLength + 1);
  }
  return jsonInvoice["document_info"]["number"]
}

function printDocument(jsonInvoice, repDocObj, repStyleObj) {
  var param = initParam();
  var savedParam = Banana.document.getScriptSettings();
  if (savedParam.length > 0) {
    param = JSON.parse(savedParam);
    param = verifyParam(param);
  }
  repDocObj = printInvoice(jsonInvoice, repDocObj, param, repStyleObj);
  setInvoiceStyle(repDocObj, repStyleObj, param);
  setPvrStyle(repDocObj, repStyleObj, param); 
}

function printInvoice(jsonInvoice, repDocObj, param, repStyleObj) {
  // jsonInvoice can be a json string or a js object
  var invoiceObj = null;
  if (typeof(jsonInvoice) === 'object') {
    invoiceObj = jsonInvoice;
  } else if (typeof(jsonInvoice) === 'string') {
    invoiceObj = JSON.parse(jsonInvoice)
  }

  // Invoice texts which need translation
  var langDoc = '';
  if (invoiceObj.customer_info.lang )
    langDoc = invoiceObj.customer_info.lang;
  if (langDoc.length <= 0)
    langDoc = invoiceObj.document_info.locale;
  var texts = setInvoiceTexts(langDoc);

  // Invoice document
  var reportObj = Banana.Report;
  
  if (!repDocObj) {
    repDocObj = reportObj.newReport(getTitle(invoiceObj, texts) + " " + invoiceObj.document_info.number);
  } else {
    var pageBreak = repDocObj.addPageBreak();
    pageBreak.addClass("pageReset");
  }


  /***********
    1. HEADER
  ***********/
  var tab = repDocObj.addTable("header_table");
  var col1 = tab.addColumn("col1");
  var col2 = tab.addColumn("col2");
  var headerLogoSection = repDocObj.addSection("");
  
  if (param.print_header) {
    //Check the version of Banana:
    //If 9.0.3 or greater we try to use the defined logo (not the one of the table documents).
    //If logo doesn't exists or Banana version is older than 9.0.3, we use the logo of the table Documents
    var requiredVersion = "9.0.3";
    if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) >= 0) {
      // If there is a defined logo it is used as default logo
      var logoFormat = Banana.Report.logoFormat("Logo");
      if (logoFormat) {
        var logoElement = logoFormat.createDocNode(headerLogoSection, repStyleObj, "logo");
        repDocObj.getHeader().addChild(logoElement);
      }
      // If there is not a defined logo, than it is used the logo of the Documents table
      else {
        repDocObj.addImage("documents:logo", "logoStyle");
      }
    }
    // If the version of Banana is older than 9.0.3 it is used the logo of the Documents table
    else {
      repDocObj.addImage("documents:logo", "logoStyle");
    }

    tableRow = tab.addRow();
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
    tableRow = tab.addRow();
    var cell1 = tableRow.addCell("", "");
    var cell2 = tableRow.addCell("", "");
    cell2.addParagraph(" ");
    cell2.addParagraph(" ");
    cell2.addParagraph(" ");
    cell2.addParagraph(" ");
  }



  /**********************
    2. INVOICE TEXTS INFO
  **********************/
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

  var invoiceDate = Banana.Converter.toLocaleDateFormat(invoiceObj.document_info.date);
  cell1.addParagraph(getTitle(invoiceObj, texts) + ":", "");
  cell1.addParagraph(texts.date + ":", "");
  cell1.addParagraph(texts.customer + ":", "");
  //Payment Terms
  var payment_terms_label = texts.payment_terms_label;
  var payment_terms = '';
  if (invoiceObj.billing_info.payment_term) {
    payment_terms = invoiceObj.billing_info.payment_term;
  }
  else if (invoiceObj.payment_info.due_date) {
  payment_terms_label = texts.payment_due_date_label
    payment_terms = Banana.Converter.toLocaleDateFormat(invoiceObj.payment_info.due_date);
  }
  cell1.addParagraph(payment_terms_label + ":", "");
  cell1.addParagraph(texts.page + ":", "");

  cell2.addParagraph(invoiceObj.document_info.number, "");
  cell2.addParagraph(invoiceDate, "");
  cell2.addParagraph(invoiceObj.customer_info.number, "");
  cell2.addParagraph(payment_terms, "");
  cell2.addParagraph(pageNr, "");

  var addressLines = getInvoiceAddress(invoiceObj.customer_info).split('\n');
  for (var i=0; i < addressLines.length; i++) {
    cell3.addParagraph(addressLines[i]);
  }

  //Text begin
  if (invoiceObj.document_info.text_begin) {
    repTableObj = repDocObj.addTable("doc_table1");
    repDocObj.addParagraph(invoiceObj.document_info.text_begin, "begin_text");
  }
  else {
    repTableObj = repDocObj.addTable("doc_table");
  }

  /***************
    3. TABLE ITEMS
  ***************/
  //repTableObj = repDocObj.addTable("doc_table");
  var repTableCol1 = repTableObj.addColumn("repTableCol1");
  var repTableCol2 = repTableObj.addColumn("repTableCol2");
  var repTableCol3 = repTableObj.addColumn("repTableCol3");
  var repTableCol4 = repTableObj.addColumn("repTableCol4");

  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  var dd = repTableObj.getHeader().addRow();
  dd.addCell(texts.description, "doc_table_header", 1);
  dd.addCell(texts.qty, "doc_table_header amount", 1);
  dd.addCell(texts.unit_price, "doc_table_header amount", 1);
  dd.addCell(texts.total + " " + invoiceObj.document_info.currency, "doc_table_header amount", 1);


  //ITEMS
  for (var i = 0; i < invoiceObj.items.length; i++)
  {
    var item = invoiceObj.items[i];

    var className = "item_cell";
    if (item.item_type && item.item_type.indexOf("total") === 0) {
      className = "subtotal_cell";
    }
    if (item.item_type && item.item_type.indexOf("note") === 0) {
      className = "note_cell";
    }
  
    rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow();

    var descriptionCell = tableRow.addCell("", "padding-left padding-right thin-border-top " + className, 1);
    descriptionCell.addParagraph(item.description);
    descriptionCell.addParagraph(item.description2);
  if (className == "note_cell") {
    tableRow.addCell("", "padding-left padding-right thin-border-top " + className, 3);
  }
  else if (className == "subtotal_cell") {
      tableRow.addCell("", "amount padding-left padding-right thin-border-top " + className, 2);
      tableRow.addCell(toInvoiceAmountFormat(invoiceObj, item.total_amount_vat_exclusive), "amount padding-left padding-right thin-border-top " + className, 1);
  }
  else {
      tableRow.addCell(Banana.Converter.toLocaleNumberFormat(item.quantity), "amount padding-left padding-right thin-border-top " + className, 1);
      tableRow.addCell(Banana.Converter.toLocaleNumberFormat(item.unit_price.calculated_amount_vat_exclusive), "amount padding-left padding-right thin-border-top " + className, 1);
      tableRow.addCell(toInvoiceAmountFormat(invoiceObj, item.total_amount_vat_exclusive), "amount padding-left padding-right thin-border-top " + className, 1);
  }
  }

  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "border-bottom", 4);

  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 4);


  //TOTAL NET
  if (invoiceObj.billing_info.total_vat_rates.length > 0)
  {
    rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow();   
    tableRow.addCell(" ", "padding-left padding-right", 1)
    tableRow.addCell(texts.totalnet, "padding-left padding-right", 1);
    tableRow.addCell(" ", "padding-left padding-right", 1)
    tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_amount_vat_exclusive), "amount padding-left padding-right", 1);

    for (var i = 0; i < invoiceObj.billing_info.total_vat_rates.length; i++) 
    {
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell("", "padding-left padding-right", 1);
      tableRow.addCell(texts.vat + " " + invoiceObj.billing_info.total_vat_rates[i].vat_rate + "%", "padding-left padding-right", 1);
      tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_vat_rates[i].total_amount_vat_exclusive), "amount padding-left padding-right", 1);
      tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_vat_rates[i].total_vat_amount), "amount padding-left padding-right", 1);
    }
  }


  //TOTAL ROUNDING DIFFERENCE
  if (invoiceObj.billing_info.total_rounding_difference.length) 
  {
    rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow();
    tableRow.addCell(" ", "padding-left padding-right", 1);
    tableRow.addCell(texts.rounding, "padding-left padding-right", 1);
    tableRow.addCell(" ", "padding-left padding-right", 1)
    tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_rounding_difference), "amount padding-left padding-right", 1);
  }

  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 4);


  //FINAL TOTAL
  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 1)
  tableRow.addCell(texts.total.toUpperCase() + " " + invoiceObj.document_info.currency, "total_cell", 1);
  tableRow.addCell(" ", "total_cell", 1);
  tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_to_pay), "total_cell amount", 1);

  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 4);


  //Notes
  for (var i = 0; i < invoiceObj.note.length; i++) 
  {
    if (invoiceObj.note[i].description) {
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell(invoiceObj.note[i].description, "", 4);
    }
  }

  //Greetings
  if (invoiceObj.document_info.greetings) {
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell(invoiceObj.document_info.greetings, "", 4);
  }

  //Template params
  //Default text starts with "(" and ends with ")" (default), (Vorderfiniert)
  if (invoiceObj.template_parameters && invoiceObj.template_parameters.footer_texts) {
    var lang = '';
    if (invoiceObj.customer_info.lang )
      lang = invoiceObj.customer_info.lang;
    if (lang.length <= 0 && invoiceObj.document_info.locale)
      lang = invoiceObj.document_info.locale;
    var textDefault = [];
    var text = [];
    for (var i = 0; i < invoiceObj.template_parameters.footer_texts.length; i++) {
      var textLang = invoiceObj.template_parameters.footer_texts[i].lang;
      if (textLang.indexOf('(') === 0 && textLang.indexOf(')') === textLang.length-1) {
        textDefault = invoiceObj.template_parameters.footer_texts[i].text;
      }
      else if (textLang == lang) {
        text = invoiceObj.template_parameters.footer_texts[i].text;
      }
    }
    if (text.join().length <= 0)
      text = textDefault;
    for (var i=0; i < text.length; i++) {
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell(text[i], "", 4);
    }
  }
  
  // Pvr
  if (param.print_isr && invoiceObj.document_info.currency == "CHF") {
    
  var einzahlungFur = param.einzahlungFur_row1;
  if (einzahlungFur.length>0 && param.einzahlungFur_row2.length>0)
    einzahlungFur += ",";
  einzahlungFur += param.einzahlungFur_row2;
    invoiceObj["billing_info"]["einzahlungFur"] = einzahlungFur;
  invoiceObj["billing_info"]["iban_number"] = param.zugunstenVon_IBAN ;

    //pvr on new page
    if (param.isr_on_new_page) 
    {
      repDocObj.addPageBreak();
      pageNr++;
      printInvoiceDetails(invoiceObj, repDocObj, param, texts, rowNumber);
      printItemsHeader(invoiceObj, repDocObj, param, texts, rowNumber);
      var repStyleObj = print_isr(invoiceObj, repDocObj, repStyleObj, texts, param);
    }
    //pvr NOT (if possible) on new page
    else 
    {
      //pvr on the page 1, after the items table
      if (rowNumber <= max_items_per_page_with_isr && pageNr == 1) 
      {
        var repStyleObj = print_isr(invoiceObj, repDocObj, repStyleObj, texts, param);
      }
      //pvr on other pages, after the items table
      else if (rowNumber <= max_items_per_page && pageNr > 1) 
      {
        var repStyleObj = print_isr(invoiceObj, repDocObj, repStyleObj, texts, param);
      }
      //pvr goes automatically on new page if there is not enough space
      else 
      {
        repDocObj.addPageBreak();
        pageNr++;
        printInvoiceDetails(invoiceObj, repDocObj, param, texts, rowNumber);
        printItemsHeader(invoiceObj, repDocObj, param, texts, rowNumber);
        var repStyleObj = print_isr(invoiceObj, repDocObj, repStyleObj, texts, param);
      }
    }
  }

  return repDocObj;
}

function toInvoiceAmountFormat(invoice, value) {

    return Banana.Converter.toLocaleNumberFormat(value, invoice.document_info.decimals_amounts, true);
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


//---------------------------------------------------------------------------------------------------------//
// PVR PRINT FUNCTIONS
//---------------------------------------------------------------------------------------------------------//

function print_isr(jsonInvoice, report, repStyleObj, texts, param) {

   var pvrForm = report.addSection("pvr_Form");

   print_einzahlungFur(jsonInvoice, pvrForm, repStyleObj);
   print_zugunstenVon(jsonInvoice, pvrForm, repStyleObj);
   print_postaccount(jsonInvoice, pvrForm, repStyleObj, param);
   print_isrAmount(jsonInvoice, pvrForm, repStyleObj);
   print_isrCustomerInfo(jsonInvoice, pvrForm, repStyleObj, param);
   print_isrIdCode(jsonInvoice, pvrForm, repStyleObj, param);
   print_isrZahlungszwec(jsonInvoice, pvrForm, repStyleObj, texts, param);

   // setPvrStyle(report, repStyleObj, param);
   return pvrForm;
}

//The purpose of this function is to print the billing info informations in the correct position
function print_einzahlungFur(jsonInvoice, report, repStyleObj) {

   var str = jsonInvoice["billing_info"]["einzahlungFur"].split(',');

   //Receipt
   var billingInfo_REC =  report.addSection("billingInfo_REC");

   for (var i = 0; i < str.length; i++) {
      billingInfo_REC.addParagraph(str[i].trim());
   }

   //Payment
   var billingInfo_PAY =  report.addSection("billingInfo_PAY");
   for (var i = 0; i < str.length; i++) {
      billingInfo_PAY.addParagraph(str[i].trim());
   }
}

//The purpose of this function is to print the supplier informations in the correct position
function print_zugunstenVon(jsonInvoice, report, repStyleObj) {

   //Receipt
   var supplierInfo_REC = report.addSection("supplierInfo_REC");
   supplierInfo_REC.addParagraph(jsonInvoice["billing_info"]["iban_number"]);
   supplierInfo_REC.addParagraph(jsonInvoice["supplier_info"]["business_name"]);
   supplierInfo_REC.addParagraph(jsonInvoice["supplier_info"]["address1"]);
   supplierInfo_REC.addParagraph(jsonInvoice["supplier_info"]["postal_code"] + " " + jsonInvoice["supplier_info"]["city"]);

   //Payment
   var supplierInfo_PAY = report.addSection("supplierInfo_PAY");
   supplierInfo_PAY.addParagraph(jsonInvoice["billing_info"]["iban_number"]);
   supplierInfo_PAY.addParagraph(jsonInvoice["supplier_info"]["business_name"]);
   supplierInfo_PAY.addParagraph(jsonInvoice["supplier_info"]["address1"]);
   supplierInfo_PAY.addParagraph(jsonInvoice["supplier_info"]["postal_code"] + " " + jsonInvoice["supplier_info"]["city"]);
}

//The purpose of this function is to print the account number in the correct position
function print_postaccount(jsonInvoice, report, repStyleObj, param) {

   //Receipt
   var accountNumber_REC = report.addSection("accountNumber_REC");
   accountNumber_REC.addParagraph(param.post_account);

   //Payment
   var accountNumber_PAY = report.addSection("accountNumber_PAY");
   accountNumber_PAY.addParagraph(param.post_account);
}

//The purpose of this function is to print the total amount of the invoice in the correct position
function print_isrAmount(jsonInvoice, report, repStyleObj) {

   var str = jsonInvoice["billing_info"]["total_to_pay"];
   var res = str.split('.');

   //Receipt
   var totalInvoiceFr_REC = report.addSection("totalInvoiceFr_REC");
   totalInvoiceFr_REC.addParagraph(res[0]);

   var totalInvoiceCts_REC = report.addSection("totalInvoiceCts_REC");
   totalInvoiceCts_REC.addParagraph(res[1]);

   //Payment
   var totalInvoiceFr_PAY = report.addSection("totalInvoiceFr_PAY");
   totalInvoiceFr_PAY.addParagraph(res[0]);

   var totalInvoiceCts_PAY = report.addSection("totalInvoiceCts_PAY");
   totalInvoiceCts_PAY.addParagraph(res[1]);
}

//The purpose of this function is to print the customer address in the correct position
function print_isrCustomerInfo(jsonInvoice, report, repStyleObj, param) {

   var addressLines = getAddressLines(jsonInvoice["customer_info"], false);
   
   //Receipt
   var customerAddress_REC = report.addSection("customerAddress_REC");
   for (var i = 0; i < addressLines.length; i++) {
      customerAddress_REC.addParagraph(addressLines[i]);
   }

   //Payment
   var customerAddress_PAY = report.addSection("customerAddress_PAY");
   for (var i = 0; i < addressLines.length; i++) {
      customerAddress_PAY.addParagraph(addressLines[i]);
   }
}

//The purpose of this function is to print the communication text in the correct position
function print_isrZahlungszwec(jsonInvoice, report, repStyleObj, texts, param) {
   var isrCommunication = report.addSection("isrCommunication");
   if(param.isr_zahlungszweck.length > 0){
      isrCommunication.addParagraph(param.isr_zahlungszweck);
   }
   var invoiceNumber = getTitle(jsonInvoice, texts) + " " + jsonInvoice.document_info.number;
   isrCommunication.addParagraph(invoiceNumber);
}

//The purpose of this function is to print the full PVR code in the correct position
function print_isrIdCode(jsonInvoice, report, repStyleObj, param) {
   if(param.isr_id.length > 0){
      var pvrBottomCodePay1 = report.addSection("pvrBottomCodePay1");
      pvrBottomCodePay1.addParagraph(param.isr_id  + ">");
   }
   
   var accountBottom = accountBottomLine(param.post_account);
   var pvrBottomCodePay2 = report.addSection("pvrBottomCodePay2");
   pvrBottomCodePay2.addParagraph(accountBottom + ">");
   
}

//The purpose of this function is return a complete address
function getAddressLines(jsonAddress, fullAddress) {

   var address = [];
   address.push(jsonAddress["business_name"]);

   var addressName = [jsonAddress["first_name"], jsonAddress["last_name"]];
   addressName = addressName.filter(function(n){return n}); // remove empty items
   address.push(addressName.join(" "));

   address.push(jsonAddress["address1"]);
   if (fullAddress) {
      address.push(jsonAddress["address2"]);
      address.push(jsonAddress["address3"]);
   }

   var addressCity = [jsonAddress["postal_code"], jsonAddress["city"]].join(" ");
   if (jsonAddress["country_code"] && jsonAddress["country_code"] !== "CH")
      addressCity = [jsonAddress["country_code"], addressCity].join(" - ");
   address.push(addressCity);

   address = address.filter(function(n){return n}); // remove empty items

   return address;
}

function getTitle(invoiceObj, texts) {
  var documentTitle = texts.invoice;
  if (invoiceObj.document_info.title) {  
    documentTitle = invoiceObj.document_info.title;
  }
  return documentTitle;
}

function checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber) {
  if (rowNumber >= max_items_per_page) 
  {
    repDocObj.addPageBreak();
    pageNr++;

    printInvoiceDetails(invoiceObj, repDocObj, param, texts, rowNumber);
    printItemsHeader(invoiceObj, repDocObj, param, texts, rowNumber);

    return 0;
  }

  rowNumber++;
  return rowNumber;
}

function printInvoiceDetails(invoiceObj, repDocObj, param, texts, rowNumber) {
  //
  // INVOICE DETAILS
  //
  var infoTable = repDocObj.addTable("info_table_row0");
  var col1 = infoTable.addColumn("infoCol1");
  var col2 = infoTable.addColumn("infoCol2");
  var col3 = infoTable.addColumn("infoCol3");

  tableRow = infoTable.addRow();
  tableRow.addCell(" ", "", 3);

  tableRow = infoTable.addRow();
  var cell1 = tableRow.addCell("", "amount", 1);
  var cell2 = tableRow.addCell("", "amount bold", 1);
  var cell3 = tableRow.addCell("", "", 1);
  
  var invoiceDate = Banana.Converter.toLocaleDateFormat(invoiceObj.document_info.date);
  cell1.addParagraph(getTitle(invoiceObj, texts) + ":", "");
  cell1.addParagraph(texts.date + ":", "");
  cell1.addParagraph(texts.customer + ":", "");
  //Payment Terms
  var payment_terms_label = texts.payment_terms_label;
  var payment_terms = '';
  if (invoiceObj.billing_info.payment_term) {
    payment_terms = invoiceObj.billing_info.payment_term;
  }
  else if (invoiceObj.payment_info.due_date) {
  payment_terms_label = texts.payment_due_date_label
    payment_terms = Banana.Converter.toLocaleDateFormat(invoiceObj.payment_info.due_date);
  }
  cell1.addParagraph(payment_terms_label + ":", "");
  cell1.addParagraph(texts.page + ":", "");

  cell2.addParagraph(invoiceObj.document_info.number, "");
  cell2.addParagraph(invoiceDate, "");
  cell2.addParagraph(invoiceObj.customer_info.number, "");
  cell2.addParagraph(payment_terms, "");
  cell2.addParagraph(pageNr, "");
}

function printItemsHeader(invoiceObj, repDocObj, param, texts, rowNumber) {
  //
  // ITEMS TABLE
  //
  repTableObj = repDocObj.addTable("doc_table_row0");
  var repTableCol1 = repTableObj.addColumn("repTableCol1");
  var repTableCol2 = repTableObj.addColumn("repTableCol2");
  var repTableCol3 = repTableObj.addColumn("repTableCol3");
  var repTableCol4 = repTableObj.addColumn("repTableCol4");
  
  var dd = repTableObj.getHeader().addRow();
  dd.addCell(texts.description, "doc_table_header", 1);
  dd.addCell(texts.qty, "doc_table_header", 1);
  dd.addCell(texts.unit_price, "doc_table_header amount", 1);
  dd.addCell(texts.total + " " + invoiceObj.document_info.currency, "doc_table_header amount", 1);
}

/**
 * The function accountBottomLine Prepares the Account number for the 
 * bottom line.
 */
function accountBottomLine(string) {

   var parts = string.split("-");
   var toReturn = parts[2];
   toReturn = parts[1] + toReturn;
   while (toReturn.length < 7)
      toReturn = "0" + toReturn;
   toReturn = parts[0] + toReturn;
   while (toReturn.length < 9)
      toReturn = "0" + toReturn;
   
   return toReturn;
}

function setPvrStyle(reportObj, repStyleObj, param) {

  if (!repStyleObj)
  repStyleObj = reportObj.newStyleSheet();

  //Overwrite default page margin of 20mm
   var style = repStyleObj.addStyle("@page");
   style.setAttribute("margin", "0mm");
   //isr text position style.setAttribute('transform', 'matrix(1.0, 0.0, 0.0, 1.0, -5mm, -9mm)');
   style.setAttribute("transform", "matrix(" + param.isr_position_scaleX + ", 0.0, 0.0, " + param.isr_position_scaleY + "," + param.isr_position_dX + "," + param.isr_position_dY + ")");

   //PVR form position
   style = repStyleObj.addStyle(".pvr_Form");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "0mm");
   style.setAttribute("top", "190mm"); //180
   style.setAttribute("color", "black");
   style.setAttribute("font-size", "10px");
   
   //printPvrBankInfo
   style = repStyleObj.addStyle(".billingInfo_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "4mm");
   style.setAttribute("top", "7mm");

   style = repStyleObj.addStyle(".billingInfo_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "63mm");
   style.setAttribute("top", "7mm");

   //printPvrSupplierInfo
   style = repStyleObj.addStyle(".supplierInfo_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "4mm");
   style.setAttribute("top", "20mm");

   style = repStyleObj.addStyle(".supplierInfo_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "63mm");
   style.setAttribute("top", "20mm");
   
   //printPvrAccount
   style = repStyleObj.addStyle(".accountNumber_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "30mm");
   style.setAttribute("top", "40mm");

   style = repStyleObj.addStyle(".accountNumber_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "90mm");
   style.setAttribute("top", "40mm");
   
   //printPvrAmount 
   style = repStyleObj.addStyle(".totalInvoiceFr_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "4mm");
   style.setAttribute("top", "49mm");
   style.setAttribute("width", "37mm");
   style.setAttribute("font-size", "11px");
   style.setAttribute("text-align", "right");

   style = repStyleObj.addStyle(".totalInvoiceCts_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "50mm");
   style.setAttribute("top", "49mm");
   style.setAttribute("font-size", "11px");

   style = repStyleObj.addStyle(".totalInvoiceFr_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "65mm");
   style.setAttribute("top", "49mm");
   style.setAttribute("width", "37mm");
   style.setAttribute("font-size", "11px");
   style.setAttribute("text-align", "right");

   style = repStyleObj.addStyle(".totalInvoiceCts_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "111mm");
   style.setAttribute("top", "49mm");
   style.setAttribute("font-size", "11px");
      
   //printIsrCommunication
   style = repStyleObj.addStyle(".isrCommunication");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "123mm");
   style.setAttribute("text-align", "left");
   style.setAttribute("top", "7mm");
   style.setAttribute("font-size", "11pt");
   
   //printPvrCustomerInfo
   style = repStyleObj.addStyle(".customerAddress_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "4mm");
   style.setAttribute("top", "61mm");
   style.setAttribute("font-size", "10px");

   style = repStyleObj.addStyle(".customerAddress_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "123mm");
   style.setAttribute("top", "49mm");
   style.setAttribute("font-size", "10px");
   
   //printIsrIdCode1 (bottom line)
   style = repStyleObj.addStyle(".pvrBottomCodePay1");
   style.setAttribute("position", "absolute");
   style.setAttribute("right", "6mm");
   style.setAttribute("text-align", "right");
   style.setAttribute("top", "84mm");// 20th row * (25.4mm / 6)
   style.setAttribute("font-size", "10pt");
   style.setAttribute("font-family", "OCRB");
   
   //printIsrIdCode2 (bottom line)
   style = repStyleObj.addStyle(".pvrBottomCodePay2");
   style.setAttribute("position", "absolute");
   style.setAttribute("right", "6mm");
   style.setAttribute("text-align", "right");
   style.setAttribute("top", "92mm");
   style.setAttribute("font-size", "10pt");
   style.setAttribute("font-family", "OCRB");
   
   
   //receiptPvrReference
   style = repStyleObj.addStyle(".pvr_reference");
   style.setAttribute("font-size", "8px");
}

//====================================================================//
// STYLES
//====================================================================//
function setInvoiceStyle(reportObj, repStyleObj, param) {

    if (!repStyleObj) {
        repStyleObj = reportObj.newStyleSheet();
    }

    //Set default values
    if (!param.color_1) {
        param.color_1 = "#337ab7";
    }

    if (!param.color_2) {
        param.color_2 = "#ffffff";
    }

    if (!param.color_3) {
        param.color_3 = "#000000";
    }
    
    if (!param.color_4) {
        param.color_4 = "#dddddd";
    }

    if (!param.image_height) {
        param.image_height = "30";
    }

    //====================================================================//
    // GENERAL
    //====================================================================//
    repStyleObj.addStyle(".pageReset", "counter-reset: page");
    repStyleObj.addStyle("body", "font-size: 11pt; font-family:Helvetica");
    repStyleObj.addStyle(".amount", "text-align:right");
    repStyleObj.addStyle(".bold", "font-weight: bold");
    repStyleObj.addStyle(".doc_table_header", "font-weight:bold; background-color:" + param.color_1 + "; color:" + param.color_2);
    repStyleObj.addStyle(".doc_table_header td", "padding:5px;");
    repStyleObj.addStyle(".total_cell", "font-weight:bold; background-color:" + param.color_1 + "; color: " + param.color_2 + "; padding:5px");
    repStyleObj.addStyle(".subtotal_cell", "font-weight:bold; background-color:" + param.color_4 + "; color: " + param.color_3 + "; padding:5px");
    repStyleObj.addStyle(".col1","width:50%");
    repStyleObj.addStyle(".col2","width:49%");
    repStyleObj.addStyle(".infoCol1","width:15%");
    repStyleObj.addStyle(".infoCol2","width:30%");
    repStyleObj.addStyle(".infoCol3","width:54%");
    repStyleObj.addStyle(".border-bottom", "border-bottom:2px solid " + param.color_3);
    repStyleObj.addStyle(".thin-border-top", "border-top:thin solid " + param.color_1);
    repStyleObj.addStyle(".padding-right", "padding-right:5px");
    repStyleObj.addStyle(".padding-left", "padding-left:5px");

    repStyleObj.addStyle(".repTableCol1","width:45%");
    repStyleObj.addStyle(".repTableCol2","width:15%");
    repStyleObj.addStyle(".repTableCol3","width:20%");
    repStyleObj.addStyle(".repTableCol4","width:20%");

    /* 
      Text begin
    */
    var beginStyle = repStyleObj.addStyle(".begin_text");
    beginStyle.setAttribute("position", "absolute");
    beginStyle.setAttribute("top", "90mm");
    beginStyle.setAttribute("left", "20mm");
    beginStyle.setAttribute("right", "10mm");
    beginStyle.setAttribute("font-size", "10px");

    //====================================================================//
    // LOGO
    //====================================================================//
    var logoStyle = repStyleObj.addStyle(".logoStyle");
    logoStyle.setAttribute("position", "absolute");
    logoStyle.setAttribute("margin-top", "10mm");
    logoStyle.setAttribute("margin-left", "20mm");
    logoStyle.setAttribute("height", param.image_height + "mm");

    var logoStyle = repStyleObj.addStyle(".logo");
    logoStyle.setAttribute("position", "absolute");
    logoStyle.setAttribute("margin-top", "10mm");
    logoStyle.setAttribute("margin-left", "20mm");

    //====================================================================//
    // TABLES
    //====================================================================//
    var headerStyle = repStyleObj.addStyle(".header_table");
    headerStyle.setAttribute("position", "absolute");
    headerStyle.setAttribute("margin-top", "10mm"); //106
    headerStyle.setAttribute("margin-left", "22mm"); //20
    headerStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.header_table td", "border: thin solid black");
    headerStyle.setAttribute("width", "100%");


    var infoStyle = repStyleObj.addStyle(".info_table");
    infoStyle.setAttribute("position", "absolute");
    infoStyle.setAttribute("margin-top", "45mm");
    infoStyle.setAttribute("margin-left", "22mm");
    infoStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.info_table td", "border: thin solid black");

    var infoStyle = repStyleObj.addStyle(".info_table_row0");
    infoStyle.setAttribute("position", "absolute");
    infoStyle.setAttribute("margin-top", "10mm");
    infoStyle.setAttribute("margin-left", "22mm");
    infoStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.info_table td", "border: thin solid black");
    infoStyle.setAttribute("width", "100%");



    var itemsStyle = repStyleObj.addStyle(".doc_table");
    itemsStyle.setAttribute("margin-top", "110mm"); //106
    itemsStyle.setAttribute("margin-left", "23mm"); //20
    itemsStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.doc_table td", "border: thin solid black; padding: 3px;");
    itemsStyle.setAttribute("width", "100%");

    var itemsStyle = repStyleObj.addStyle(".doc_table1");
    itemsStyle.setAttribute("margin-top", "125mm"); //106
    itemsStyle.setAttribute("margin-left", "23mm"); //20
    itemsStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.doc_table1 td", "border: thin solid black; padding: 3px;");
    itemsStyle.setAttribute("width", "100%");

    var itemsStyle = repStyleObj.addStyle(".doc_table_row0");
    itemsStyle.setAttribute("margin-top", "50mm"); //106
    itemsStyle.setAttribute("margin-left", "23mm"); //20
    itemsStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.doc_table td", "border: thin solid black; padding: 3px;");
    itemsStyle.setAttribute("width", "100%");
}

function setInvoiceTexts(language) {
  var texts = {};
  if (language == 'it')
  {
    texts.customer = 'No Cliente';
    texts.date = 'Data';
    texts.description = 'Descrizione';
    texts.invoice = 'Fattura';
    texts.page = 'Pagina';
    texts.rounding = 'Arrotondamento';
    texts.total = 'Totale';
    texts.totalnet = 'Totale netto';
    texts.vat = 'IVA';
    texts.qty = 'Quantità';
    texts.unit_ref = 'Unità';
    texts.unit_price = 'Prezzo unità';
    texts.vat_number = 'Partita IVA: ';
    texts.bill_to = 'Indirizzo fatturazione';
    texts.shipping_to = 'Indirizzo spedizione';
    texts.from = 'DA:';
    texts.to = 'A:';
    texts.param_color_1 = 'Colore sfondo';
    texts.param_color_2 = 'Colore testo';
    texts.param_image_height = 'Altezza immagine (mm)';
    texts.param_print_header = 'Includi intestazione pagina';
    texts.param_print_isr = 'Stampa Bollettino';
    texts.param_einzahlungFur_row1 = 'Versamento per, 1° riga';
    texts.param_einzahlungFur_row2 = 'Versamento per, 2° riga';
	texts.param_zugunstenVon_IBAN = 'Numero Iban (opzionale)'
    texts.param_post_account = 'Conto';
    texts.param_isr_id = 'Identificativo, 37 numeri in basso a destra (opzionale)';
	texts.param_isr_zahlungszweck = 'Motivo versamento (opzionale)';
    texts.param_isr_position_scaleX = 'Scala orizzontale caratteri (default 1.0)';
    texts.param_isr_position_scaleY = 'Scala verticale caratteri (default 1.0)';
    texts.param_isr_position_dX = 'Bollettino, mm da sinistra (default 0)';
    texts.param_isr_position_dY = 'Bollettino, mm dall\'alto (default 0)';
    texts.param_isr_on_new_page = 'Bollettino su pagina separata';
    texts.param_personal_text_1 = 'Testo libero (riga 1)';
    texts.param_personal_text_2 = 'Testo libero (riga 2)';
    texts.payment_due_date_label = 'Scadenza';
    texts.payment_terms_label = 'Pagamento';
    //texts.param_max_items_per_page = 'Numero di linee su ogni fattura';
  }
  else if (language == 'de')
  {
    texts.customer = 'Kunde-Nr';
    texts.date = 'Datum';
    texts.description = 'Beschreibung';
    texts.invoice = 'Rechnung';
    texts.page = 'Seite';
    texts.rounding = 'Rundung';
    texts.total = 'Total';
    texts.totalnet = 'Netto-Betrag';
    texts.vat = 'MwSt.';
    texts.qty = 'Menge';
    texts.unit_ref = 'Einheit';
    texts.unit_price = 'Preiseinheit';
    texts.vat_number = 'Mehrwertsteuernummer: ';
    texts.bill_to = 'Rechnungsadresse';
    texts.shipping_to = 'Lieferadresse';
    texts.from = 'VON:';
    texts.to = 'ZU:';
    texts.param_color_1 = 'Hintergrundfarbe';
    texts.param_color_2 = 'Textfarbe';
    texts.param_image_height = 'Bildhöhe (mm)';
    texts.param_print_header = 'Seitenüberschrift einschliessen (1=ja, 0=nein)';
    texts.param_print_isr = 'Einzahlungschein ausdrucken';
    texts.param_einzahlungFur_row1 = 'Einzahlung für, Erste Zeile';
    texts.param_einzahlungFur_row2 = 'Einzahlung für, Zweite Zeile';
	texts.param_zugunstenVon_IBAN = 'Iban (fakultativ)'
    texts.param_post_account = 'ESR-Konto';
    texts.param_isr_id = 'ESR-Teilnehmernummer, 37 Zahlen unten rechts (fakultativ)';
    texts.param_isr_zahlungszweck = 'Zahlungszweck (fakultativ)';
    texts.param_isr_position_scaleX = 'Horizontale Zeichenskalierung (default 1.0)';
    texts.param_isr_position_scaleY = 'Vertikale Zeichenskalierung (default 1.0)';
    texts.param_isr_position_dX = 'ESR X-Position mm (default 0)';
    texts.param_isr_position_dY = 'ESR Y-Position mm (default 0)';
    texts.param_isr_on_new_page = 'ESR auf separates Blatt';
    texts.param_personal_text_1 = 'Freier Text (Zeile 1)';
    texts.param_personal_text_2 = 'Freier Text (Zeile 2)';
    texts.payment_due_date_label = 'Fälligkeitsdatum';
    texts.payment_terms_label = 'Zahlungsbedingungen';
    //texts.param_max_items_per_page = 'Anzahl der Zeilen auf jeder Rechnung';
  }
  else if (language == 'fr')
  {
    texts.customer = 'No Client';
    texts.date = 'Date';
    texts.description = 'Description';
    texts.invoice = 'Facture';
    texts.page = 'Page';
    texts.rounding = 'Arrondi';
    texts.total = 'Total';
    texts.totalnet = 'Total net';
    texts.vat = 'TVA';
    texts.qty = 'Quantité';
    texts.unit_ref = 'Unité';
    texts.unit_price = 'Prix unité';
    texts.vat_number = 'Numéro de TVA: ';
    texts.bill_to = 'Adresse de facturation';
    texts.shipping_to = 'Adresse de livraison';
    texts.from = 'DE:';
    texts.to = 'À:';
    texts.param_color_1 = 'Couleur de fond';
    texts.param_color_2 = 'Couleur du texte';
    texts.param_image_height = "Hauteur de l'image (mm)";
    texts.param_print_header = 'Inclure en-tête de page (1=oui, 0=non)';
    texts.param_print_isr = 'Imprimer bulletin';
    texts.param_einzahlungFur_row1 = 'Versement pour, 1ère ligne';
    texts.param_einzahlungFur_row2 = 'Versement pour, 2ème ligne';
    texts.param_zugunstenVon_IBAN = 'Numero Compte Iban (facultatif)'
    texts.param_post_account = 'Compte Postale';
    texts.param_isr_id = 'Numéro identifiant BVR, 37 chiffres en bas à droite (facultatif)';
    texts.param_isr_zahlungszweck = 'Motif versement';
    texts.param_isr_position_scaleX = 'Décalage horizontal caractère (default 1.0)';
    texts.param_isr_position_scaleY = 'Décalage vertical caractère (default 1.0)';
    texts.param_isr_position_dX = 'BVR X-Position mm (default 0)';
    texts.param_isr_position_dY = 'BVR Y-Position mm (default 0)';
    texts.param_isr_on_new_page = 'Bulletin sur page séparée';
    texts.param_personal_text_1 = 'Texte libre (ligne 1)';
    texts.param_personal_text_2 = 'Texte libre (ligne 2)';
    texts.payment_due_date_label = 'Echéance';
    texts.payment_terms_label = 'Paiement';
    //texts.param_max_items_per_page = 'Nombre d’éléments sur chaque facture';
  }
  else
  {
    texts.customer = 'Customer No';
    texts.date = 'Date';
    texts.description = 'Description';
    texts.invoice = 'Invoice';
    texts.page = 'Page';
    texts.rounding = 'Rounding';
    texts.total = 'Total';
    texts.totalnet = 'Total net';
    texts.vat = 'VAT';
    texts.qty = 'Quantity';
    texts.unit_ref = 'Unit';
    texts.unit_price = 'Unit price';
    texts.vat_number = 'VAT Number: ';
    texts.bill_to = 'Billing address';
    texts.shipping_to = 'Shipping address';
    texts.from = 'FROM:';
    texts.to = 'TO:';
    texts.param_color_1 = 'Background Color';
    texts.param_color_2 = 'Text Color';
    texts.param_image_height = 'Image height (mm)';
    texts.param_print_header = 'Include page header';
    texts.param_print_isr = 'Print ISR';
    texts.param_einzahlungFur_row1 = 'Payment for, 1st line';
    texts.param_einzahlungFur_row2 = 'Payment for, 2nd line';
    texts.param_post_account = 'Account';
    texts.param_isr_id = 'ISR subscriber number, 37 digits bottom right (optional)';
	
	texts.param_zugunstenVon_IBAN = 'Bank Iban (optional)'
    texts.param_post_account = 'Postal account';
    texts.param_isr_zahlungszweck = 'Payment reason (optional)';
	
	
    texts.param_isr_position_scaleX = 'Character Horizontal Scaling (default 1.0)';
    texts.param_isr_position_scaleY = 'Character Vertical Scaling (default 1.0)';
    texts.param_isr_position_dX = 'ISR X-Position mm (default 0)';
    texts.param_isr_position_dY = 'ISR Y-Position mm (default 0)';
    texts.param_isr_on_new_page = 'ISR on a new page';
    texts.param_personal_text_1 = 'Personal text (row 1)';
    texts.param_personal_text_2 = 'Personal text (row 2)';
    texts.payment_due_date_label = 'Due date';
    texts.payment_terms_label = 'Payment';
    //texts.param_max_items_per_page = 'Number of items on each page';
  }
  return texts;
}