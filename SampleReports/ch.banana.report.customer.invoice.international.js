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
// @id = ch.banana.report.customer.invoice.international.js
// @api = 1.0
// @pubdate = 2017-12-13
// @publisher = Banana.ch SA
// @description = Style International
// @description.it = Style International
// @description.de = Style International
// @description.fr = Style International
// @description.nl = Style International
// @description.en = Style International
// @doctype = *
// @task = report.customer.invoice

var rowNumber = 0;
var pageNr = 1;
var repTableObj = "";
var max_items_per_page = 30;

/*Update script's parameters*/
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
   var texts = setInvoiceTexts(lang);
   
   param.print_header = Banana.Ui.getInt('Settings', texts.param_print_header, param.print_header);
   if (param.print_header === undefined)
      return;

   param.personal_text_1 = Banana.Ui.getText('Settings', texts.param_personal_text_1, param.personal_text_1);
   if (param.personal_text_1 === undefined)
      return;

   param.personal_text_2 = Banana.Ui.getText('Settings', texts.param_personal_text_2, param.personal_text_2);
   if (param.personal_text_2 === undefined)
      return;

   param.color_1 = Banana.Ui.getText('Settings', texts.param_color_1, param.color_1);
   if (param.color_1 === undefined)
      return;
	  
   param.color_2 = Banana.Ui.getText('Settings', texts.param_color_2, param.color_2);
   if (param.color_2 === undefined)
      return;
   
   var paramToString = JSON.stringify(param);
   var value = Banana.document.scriptSaveSettings(paramToString);
}

function initParam() {
   var param = {};
   param.print_header = true;
   param.personal_text_1='';
   param.personal_text_2='';
   param.font_family = '';
   param.color_1 = '';
   param.color_2 = '';
   param.color_3 = '';
   param.color_4 = '';
   param.color_5 = '';
   return param;
}

function verifyParam(param) {
   if (!param.print_header)
     param.print_header = false;
   if (!param.personal_text_1)
     param.personal_text_1='';
   if (!param.personal_text_2)
     param.personal_text_2='';
   if (!param.font_family)
     param.font_family = '';
   if (!param.color_1)
     param.color_1 = '';
   if (!param.color_2)
     param.color_2 = '';
   if (!param.color_3)
     param.color_3 = '';
   if (!param.color_4)
     param.color_4 = '';
   if (!param.color_5)
     param.color_5 = '';
   
   return param;
}

function printDocument(jsonInvoice, repDocObj, repStyleObj) {
  var param = initParam();
  var savedParam = Banana.document.scriptReadSettings();
  if (savedParam.length > 0) {
    param = JSON.parse(savedParam);
    param = verifyParam(param);
  }
  printInvoice(jsonInvoice, repDocObj, repStyleObj, param);
}

function printInvoice(jsonInvoice, repDocObj, repStyleObj, param) {
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
    repDocObj = reportObj.newReport(getTitle(invoiceObj, texts) + ": " + invoiceObj.document_info.number);
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
    var cell = tableRow.addCell("", "", 1);
    var business_name = '';
    if (invoiceObj.supplier_info.business_name) {
      business_name = invoiceObj.supplier_info.business_name;
    }
    if (business_name.length<=0) {
      if (invoiceObj.supplier_info.first_name) {
        business_name = invoiceObj.supplier_info.first_name + " ";
      }
      if (invoiceObj.supplier_info.last_name) {
        business_name += invoiceObj.supplier_info.last_name;
      }
    }
    cell.addParagraph(business_name.toUpperCase(), "logo left bold");
    
    tableRow = tab.addRow();
    var supplierLines = getInvoiceSupplier(invoiceObj.supplier_info).split('\n');
    var cell = tableRow.addCell("", "", 1);
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
  
  var cell1 = tableRow.addCell("", "", 1);
  cell1.addParagraph(texts.date + ": " + Banana.Converter.toLocaleDateFormat(invoiceObj.document_info.date));  
  cell1.addParagraph(texts.customer + ": " + invoiceObj.customer_info.number);
  //Payment Terms
  if (invoiceObj.billing_info.payment_term) {
    cell1.addParagraph(texts.payment_terms_label + ": " + invoiceObj.billing_info.payment_term);
  }
  else if (invoiceObj.payment_info.due_date){
    var payment_terms_label = texts.payment_due_date_label;
    payment_terms = Banana.Converter.toLocaleDateFormat(invoiceObj.payment_info.due_date);
    cell1.addParagraph(payment_terms_label + ": " + payment_terms);
  }
  cell1.addParagraph(texts.page + ": " + pageNr);

  
  var cell2 = tableRow.addCell("","",1); 
  var addressLines = getInvoiceAddress(invoiceObj.customer_info).split('\n');
  for (var i=0; i < addressLines.length; i++) {
    cell2.addParagraph(addressLines[i], "");
  }


 /***************
    4. TABLE ITEMS
  ***************/
  var titleTable = repDocObj.addTable("title_table");
  tableRow = titleTable.addRow();
  tableRow.addCell(getTitle(invoiceObj, texts) + " " + invoiceObj.document_info.number, "bold title");
  


 /***************
    4. TABLE ITEMS
  ***************/
  repTableObj = repDocObj.addTable("doc_table");
  var repTableCol1 = repTableObj.addColumn("repTableCol1");
  var repTableCol2 = repTableObj.addColumn("repTableCol2");
  var repTableCol3 = repTableObj.addColumn("repTableCol3");
  //var repTableCol4 = repTableObj.addColumn("repTableCol4");

  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  var dd = repTableObj.getHeader().addRow();
  dd.addCell(texts.description, "padding-left items_table_header", 1);
  //dd.addCell(texts.qty, "padding-right items_table_header amount", 1);
  //dd.addCell(texts.unit_price, "padding-right items_table_header amount", 1);
  dd.addCell("", "items_table_header", 1)
  dd.addCell(texts.total + " " + invoiceObj.document_info.currency, "padding-right items_table_header amount", 1);
  


  //ITEMS
  var countRows = 0;
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
	
    var classNameEvenRow = "";
    if (i % 2 == 0) {
	  classNameEvenRow = "evenRowsBackgroundColor";
	}
	
    rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow();
    
    var descriptionCell = tableRow.addCell("", classNameEvenRow + " padding-left " + className, 2);
    descriptionCell.addParagraph(item.description);
    descriptionCell.addParagraph(item.description2);
	if (className == "note_cell") {
	  tableRow.addCell("", classNameEvenRow + " padding-left padding-right thin-border-top " + className, 1);
    }
	else {
      tableRow.addCell(toInvoiceAmountFormat(invoiceObj, item.total_amount_vat_inclusive), classNameEvenRow + " padding-right amount " + className, 1);
	}
  }

  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 3);


  //TOTAL ROUNDING DIFFERENCE
  if (invoiceObj.billing_info.total_rounding_difference) 
  {
    rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow();
  
    tableRow.addCell(texts.rounding, "padding-left ", 1);
    tableRow.addCell("", "", 1);
    tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_rounding_difference), "padding-right amount", 1);
  }


  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 3);


  //FINAL TOTAL
  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();

  tableRow.addCell(texts.total.toUpperCase() + " " + invoiceObj.document_info.currency, "padding-left bold border-bottom border-top total", 1);
  tableRow.addCell("", "border-bottom border-top", 1);  
  tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_to_pay), "padding-right bold amount border-bottom border-top total", 1);

  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 3);

  //Notes
  for (var i = 0; i < invoiceObj.note.length; i++) 
  {
    if (invoiceObj.note[i].description) {
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell(invoiceObj.note[i].description, "", 3);
    }
  }

  //Greetings
  if (invoiceObj.document_info.greetings) {
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell(invoiceObj.document_info.greetings, "", 3);
  }

  //Params personal_text_1/personal_text_2
  if (param.personal_text_1 || param.personal_text_2) {
    rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow();
    tableRow.addCell("", "", 3);

    rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow();
    tableRow.addCell(param.personal_text_1, "", 3);

    rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow();
    tableRow.addCell(param.personal_text_2, "", 3);
  }

  //Template params
  if (invoiceObj.template_parameters && invoiceObj.template_parameters.footer_texts) {
    var lang = Banana.document.locale;
    if (lang.length>2)
      lang = lang.substr(0,2);
    var textDefault="";
    var text="";
    for (var i = 0; i < invoiceObj.template_parameters.footer_texts.length; i++) {
      var textLang = invoiceObj.template_parameters.footer_texts[i].lang;
      if (textLang =="[default]") {
        textDefault = invoiceObj.template_parameters.footer_texts[i].text;
      }
      else if (textLang == lang) {
        text = invoiceObj.template_parameters.footer_texts[i].text;
      }
    }
    if (text.length <= 0)
      text = textDefault;
    if (text.length > 0) {
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell(text, "", 3);
    }
  }
  
  //Set invoice style
  setInvoiceStyle(reportObj, repStyleObj, param);
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

function getInvoiceSupplier(invoiceSupplier) {
  
  var supplierAddress = "";

  if (invoiceSupplier.first_name) {
    supplierAddress = invoiceSupplier.first_name + " ";
  }
  
  if (invoiceSupplier.last_name) {
    supplierAddress = supplierAddress + invoiceSupplier.last_name + " - ";
  }

  if (supplierAddress.length<=0)
  {
    if (invoiceSupplier.business_name) {
      supplierAddress = invoiceSupplier.business_name + " - ";
    }
  }

  if (invoiceSupplier.address1) {
    supplierAddress = supplierAddress + invoiceSupplier.address1 + " - ";
  }
  
  if (invoiceSupplier.address2) {
    supplierAddress = supplierAddress + invoiceSupplier.address2 + " - ";
  }

  if (invoiceSupplier.postal_code) {
    supplierAddress = supplierAddress + invoiceSupplier.postal_code + " ";
  }
  
  if (invoiceSupplier.city) {
    supplierAddress = supplierAddress + invoiceSupplier.city + " - ";
  }

  if (invoiceSupplier.country) {
    supplierAddress = supplierAddress + invoiceSupplier.country + " - ";
  }

  if (invoiceSupplier.phone) {
    supplierAddress = supplierAddress + "Tel: " + invoiceSupplier.phone + " - ";
  }

  if (invoiceSupplier.fax) {
    supplierAddress = supplierAddress + "Fax: " + invoiceSupplier.fax;
  }
  
  if (supplierAddress.lastIndexOf(" - ") >=0) {
    supplierAddress = supplierAddress.substr(0, supplierAddress.lastIndexOf(" - "));
  }

  supplierAddress = supplierAddress + "\n";
  
  if (invoiceSupplier.email) {
    supplierAddress = supplierAddress + invoiceSupplier.email + " - ";
  }
  
  if (invoiceSupplier.web) {
    supplierAddress = supplierAddress + invoiceSupplier.web + " - ";
  }
 
  if (invoiceSupplier.vat_number) {
	supplierAddress = supplierAddress + invoiceSupplier.vat_number;
  }

  if (supplierAddress.lastIndexOf(" - ") >=0) {
    supplierAddress = supplierAddress.substr(0, supplierAddress.lastIndexOf(" - "));
  }

  return supplierAddress;
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

function checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber)
{
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
  var addressTable = repDocObj.addTable("address_table_row0");
  var addressCol1 = addressTable.addColumn("addressCol1R0");

  tableRow = addressTable.addRow();
  var cell1 = tableRow.addCell("", "", 1);
  cell1.addParagraph(getTitle(invoiceObj, texts) + " " + invoiceObj.document_info.number, "");
  cell1.addParagraph(texts.date + ": " + Banana.Converter.toLocaleDateFormat(invoiceObj.document_info.date), "");  
  cell1.addParagraph(texts.customer + ": " + invoiceObj.customer_info.number, "");
  //Payment Terms
  if (invoiceObj.billing_info.payment_term) {
    cell1.addParagraph(texts.payment_terms_label + ": " + invoiceObj.billing_info.payment_term);
  }
  else if (invoiceObj.payment_info.due_date){
    var payment_terms_label = texts.payment_due_date_label;
    payment_terms = Banana.Converter.toLocaleDateFormat(invoiceObj.payment_info.due_date);
    cell1.addParagraph(payment_terms_label + ": " + payment_terms);
  }
  cell1.addParagraph(texts.page + ": " + pageNr, "");
  
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
  dd.addCell(texts.description, "padding-left items_table_header", 1);
  dd.addCell("", "items_table_header", 1)
  dd.addCell(texts.total + " " + invoiceObj.document_info.currency, "padding-right items_table_header amount", 1);
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
        param.color_2 = "#ffffff";
    }

    if (!param.color_3) {
        param.color_3 = "";
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
    repStyleObj.addStyle(".items_table_header", "font-weight:bold; background-color:" + param.color_1 +"; color:" + param.color_2);
    repStyleObj.addStyle(".items_table_header td", "padding-top:5px; padding-bottom:5px");
    repStyleObj.addStyle(".total", "font-size:16pt; color: " + param.color_1);
    repStyleObj.addStyle(".evenRowsBackgroundColor", "background-color:#f2f2f2");    
    repStyleObj.addStyle(".border-bottom", "border-bottom:2px solid " + param.color_1);
    repStyleObj.addStyle(".border-top", "border-top:2px solid " + param.color_1);
    repStyleObj.addStyle(".padding-right", "padding-right:5px");
    repStyleObj.addStyle(".padding-left", "padding-left:5px");
    repStyleObj.addStyle(".col1","width:100%");
    repStyleObj.addStyle(".addressCol1","width:43%");
    repStyleObj.addStyle(".addressCol2","width:43%");
    repStyleObj.addStyle(".addressCol1R0","width:100%");

    repStyleObj.addStyle(".repTableCol1","width:%");
    repStyleObj.addStyle(".repTableCol2","width:%");
    repStyleObj.addStyle(".repTableCol3","width:%");
    //repStyleObj.addStyle(".repTableCol4","width:%");



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
    texts.from = 'DA';
    texts.to = 'A';
	texts.param_color_1 = 'Colore 1';
	texts.param_color_2 = 'Colore 2';
	texts.param_font_family = 'Tipo carattere';
    texts.param_print_header = 'Includi intestazione pagina (1=si, 0=no)';
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
    texts.totalnet = 'Total net';
    texts.vat = 'MwSt.';
    texts.qty = 'Menge';
    texts.unit_ref = 'Einheit';
    texts.unit_price = 'Preiseinheit';
    texts.vat_number = 'Mehrwertsteuernummer: ';
    texts.bill_to = 'Rechnungsadresse';
    texts.shipping_to = 'Lieferadresse';
    texts.from = 'VON';
    texts.to = 'ZU';
	texts.param_color_1 = 'Farbe 1';
	texts.param_color_2 = 'Farbe 2';
	texts.param_font_family = 'Typ Schriftzeichen';
    texts.param_print_header = 'Seitenüberschrift einschliessen (1=ja, 0=nein)';
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
    texts.from = 'DE';
    texts.to = 'À';
	texts.param_color_1 = 'Couleur 1';
	texts.param_color_2 = 'Couleur 2';
	texts.param_font_family = 'Type caractère';
    texts.param_print_header = 'Inclure en-tête de page (1=oui, 0=non)';
	texts.param_personal_text_1 = 'Texte libre (ligne 1)';
	texts.param_personal_text_2 = 'Texte libre (ligne 2)';
    texts.payment_due_date_label = 'Echéance';
    texts.payment_terms_label = 'Paiement';
	//texts.param_max_items_per_page = 'Nombre d’éléments sur chaque facture';
  }
  else if (language == 'zh')
  {
    texts.customer = '客户编号';
    texts.date = '日期';
    texts.description = '摘要';
    texts.invoice = '发票';
    texts.page = '页数';
    texts.rounding = '四舍五入';
    texts.total = '总计';
    texts.totalnet = '总净值';
    texts.vat = '增值税';
    texts.qty = '数量';
    texts.unit_ref = '单位';
    texts.unit_price = '单价';
    texts.vat_number = '增值税号: ';
    texts.bill_to = '账单地址';
    texts.shipping_to = '邮寄地址';
    texts.from = '来自';
    texts.to = '至';
    texts.param_color_1 = '颜色 1';
    texts.param_color_2 = '颜色 2';
    texts.param_font_family = '字体类型';
    texts.param_print_header = '包括页眉 (1=是, 0=否)';
    texts.param_personal_text_1 = '个人文本 (行 1)';
    texts.param_personal_text_2 = '个人文本 (行 2)';
    texts.payment_due_date_label = '截止日期';
    texts.payment_terms_label = '付款';
    //texts.param_max_items_per_page = '每页上的项目数';
  }
  else if (language == 'nl')
  {
    texts.customer = 'Klantennummer';
    texts.date = 'Datum';
    texts.description = 'Beschrijving';
    texts.invoice = 'Factuur';
    texts.page = 'Pagina';
    texts.rounding = 'Afronding';
    texts.total = 'Totaal';
    texts.totalnet = 'Totaal netto';
    texts.vat = 'BTW';
    texts.qty = 'Hoeveelheid';
    texts.unit_ref = 'Eenheid';
    texts.unit_price = 'Eenheidsprijs';
    texts.vat_number = 'BTW-nummer: ';
    texts.bill_to = 'Factuuradres';
    texts.shipping_to = 'Leveringsadres';
    texts.from = 'VAN';
    texts.to = 'TOT';
	texts.param_color_1 = 'Kleur 1';
	texts.param_color_2 = 'Kleur 2';
	texts.param_font_family = 'Lettertype';
    texts.param_print_header = 'Pagina-koptekst opnemen (1=ja, 0=nee)';
	texts.param_personal_text_1 = 'Persoonlijke tekst (rij 1)';
	texts.param_personal_text_2 = 'Persoonlijke tekst (rij 2)';
    texts.payment_due_date_label = 'Vervaldatum';
    texts.payment_terms_label = 'Betaling';
	//texts.param_max_items_per_page = 'Aantal artikelen op iedere pagina';
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
    texts.from = 'FROM';
    texts.to = 'TO';
	texts.param_color_1 = 'Color 1';
	texts.param_color_2 = 'Color 2';
	texts.param_font_family = 'Font type';
    texts.param_print_header = 'Include page header (1=yes, 0=no)';
	texts.param_personal_text_1 = 'Personal text (row 1)';
	texts.param_personal_text_2 = 'Personal text (row 2)';
    texts.payment_due_date_label = 'Due date';
    texts.payment_terms_label = 'Payment';
	//texts.param_max_items_per_page = 'Number of items on each page';
  }
  return texts;
}

