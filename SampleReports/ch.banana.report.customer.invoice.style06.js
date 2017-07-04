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
// @id = ch.banana.report.customer.invoice.style06.js
// @api = 1.0
// @pubdate = 2017-02-16
// @publisher = Banana.ch SA
// @description = Style 6: logo, address on the right, 1 color
// @description.it = Stile 6: logo, indirizzo sulla destra, 1 colore
// @description.de = Stil 6: Logo, Adresse rechts ausgedruckt, 1 Farbe
// @description.fr = Style 6: logo, adresse à droite, 1 couleur
// @description.nl = Stijl 6: logo, adres rechts, 1 kleur
// @description.en = Style 6: logo, address on the right, 1 color
// @task = report.customer.invoice

var rowNumber = 0;
var pageNr = 1;
var repTableObj = "";
var max_items_per_page = 26;
var max_items_per_page_with_isr = 13;

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

   param.print_isr = Banana.Ui.getInt('Settings', texts.param_print_isr, param.print_isr);
   if (param.print_isr === undefined)
      return;

   if (param.print_isr === 1) {
      param.isr_bank_name = Banana.Ui.getText('Settings', texts.param_isr_bank_name, param.isr_bank_name);
      if (param.isr_bank_name === undefined)
         return;
      param.isr_bank_address = Banana.Ui.getText('Settings', texts.param_isr_bank_address, param.isr_bank_address);
      if (param.isr_bank_address === undefined)
         return;
      param.isr_account = Banana.Ui.getText('Settings', texts.param_isr_account, param.isr_account);
      if (param.isr_account === undefined)
         return;
      param.isr_id = Banana.Ui.getText('Settings', texts.param_isr_id, param.isr_id);
      if (param.isr_id === undefined)
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
   param.print_isr = false;
   param.isr_bank_name = '';
   param.isr_bank_address = '';
   param.isr_account = '';
   param.isr_id = '';
   param.isr_position_scaleX = '1.0';
   param.isr_position_scaleY = '1.0';
   param.isr_position_dX = '0';
   param.isr_position_dY = '0';
   param.isr_on_new_page = false;
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
   if (!param.print_isr)
     param.print_isr = false;
   if (!param.isr_bank_name)
     param.isr_bank_name = '';
   if (!param.isr_bank_address)
     param.isr_bank_address = '';
   if (!param.isr_account)
     param.isr_account = '';
   if (!param.isr_id)
     param.isr_id = '';
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
  
  if (param.print_header) {
    repDocObj.addImage("documents:logo", "logoStyle");
  }

  tableRow = tab.addRow();
  var cell = tableRow.addCell("", "border-left", 1);
  cell.addParagraph(texts.from, "bold");

  var supplierLines = getInvoiceSupplier(invoiceObj.supplier_info).split('\n');
  for (var i=0; i < supplierLines.length; i++) {
    cell.addParagraph(supplierLines[i], "", 1);
  }

  var cell2 = tableRow.addCell("","border-left",1); 
  cell2.addParagraph(texts.to, "bold");

  var addressLines = getInvoiceAddress(invoiceObj.customer_info).split('\n');
  for (var i=0; i < addressLines.length; i++) {
    cell2.addParagraph(addressLines[i], "");
  }


  /**********************
    2. TITLE
  **********************/
  var titleTable = repDocObj.addTable("title_table");
  var titleCol1 = titleTable.addColumn("titleCol1");
  tableRow = titleTable.addRow();
  tableRow.addCell(getTitle(invoiceObj, texts).toUpperCase() + " ", "title", 4).addText(invoiceObj.document_info.number, "colorText");



  /**********************
    2. INVOICE TEXTS INFO
  **********************/
  var infoTable = repDocObj.addTable("info_table");
  var infoCol1 = infoTable.addColumn("infoCol1");
  var infoCol2 = infoTable.addColumn("infoCol2");
  var infoCol3 = infoTable.addColumn("infoCol3");
  var infoCol4 = infoTable.addColumn("infoCol4");
  var invoiceDate = Banana.Converter.toLocaleDateFormat(invoiceObj.document_info.date);

  tableRow = infoTable.addRow();
  tableRow.addCell(texts.date + ": ", "", 1).addText(invoiceDate, "colorText");
  tableRow.addCell(texts.customer + ": ", "", 1).addText(invoiceObj.customer_info.number, "colorText");
  tableRow.addCell(texts.total + ": ", "", 1).addText(invoiceObj.document_info.currency + " " + toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_to_pay), "colorText");
  tableRow.addCell(texts.page + ": ", "amount", 1).addText(pageNr, "colorText");



 /***************
    5. TABLE ITEMS
  ***************/
  repTableObj = repDocObj.addTable("doc_table");
  var repTableCol1 = repTableObj.addColumn("repTableCol1");
  var repTableCol2 = repTableObj.addColumn("repTableCol2");
  var repTableCol3 = repTableObj.addColumn("repTableCol3");
  var repTableCol4 = repTableObj.addColumn("repTableCol4");

  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  var dd = repTableObj.getHeader().addRow();
  dd.addCell(texts.description, "bold border-left padding-top padding-bottom border-right", 1);
  dd.addCell(texts.qty, "bold border-left padding-top padding-bottom border-right", 1);
  dd.addCell(texts.unit_price, "bold border-left amount padding-top padding-bottom border-right", 1);
  dd.addCell(texts.total + " " + invoiceObj.document_info.currency, "bold border-left border-right amount padding-top padding-bottom", 1);
  

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

    var descriptionCell = tableRow.addCell("", classNameEvenRow + " border-left " + className, 1);
    descriptionCell.addParagraph(item.description);
    descriptionCell.addParagraph(item.description2);
	if (className == "note_cell") {
      tableRow.addCell("", classNameEvenRow + " amount border-left border-right " + className, 1);
      tableRow.addCell("", classNameEvenRow + " amount border-left border-right " + className, 1);
      tableRow.addCell("", classNameEvenRow + " amount border-left border-right " + className, 1);
	}
	else if (className == "subtotal_cell") {
      tableRow.addCell("", classNameEvenRow + " amount border-left border-right " + className, 1);
      tableRow.addCell("", classNameEvenRow + " amount border-left border-right " + className, 1);
      tableRow.addCell(toInvoiceAmountFormat(invoiceObj, item.total_amount_vat_exclusive), classNameEvenRow + " amount border-left border-right " + className, 1);
	}
	else {
      tableRow.addCell(Banana.Converter.toLocaleNumberFormat(item.quantity), classNameEvenRow + " amount border-left border-right " + className, 1);
      tableRow.addCell(Banana.Converter.toLocaleNumberFormat(item.unit_price.calculated_amount_vat_exclusive), classNameEvenRow + " amount border-left border-right " + className, 1);
      tableRow.addCell(toInvoiceAmountFormat(invoiceObj, item.total_amount_vat_exclusive), classNameEvenRow + " amount border-left border-right " + className, 1);
	}
  }

  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 1);
  tableRow.addCell("", "", 1);
  tableRow.addCell("", "border-left border-right", 1);
  tableRow.addCell("", "border-left border-right", 1);

  //TOTAL NET
  if (invoiceObj.billing_info.total_vat_rates.length > 0)
  {
    rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow();
    tableRow.addCell(" ", "", 1)
    tableRow.addCell(" ", "", 1)
    tableRow.addCell(texts.totalnet, "border-left border-right", 1);
    tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_amount_vat_exclusive), "border-left border-right amount", 1);

    for (var i = 0; i < invoiceObj.billing_info.total_vat_rates.length; i++) 
    {
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell("", "", 1);
      tableRow.addCell("", "", 1);
      tableRow.addCell(texts.vat + " " + invoiceObj.billing_info.total_vat_rates[i].vat_rate + "%" 
        + " (" + toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_vat_rates[i].total_amount_vat_exclusive) + ")", "border-left border-right", 1);
      tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_vat_rates[i].total_vat_amount), "amount vat_amount border-left border-right", 1);
    }
  }


  //TOTAL ROUNDING DIFFERENCE
  if (invoiceObj.billing_info.total_rounding_difference.length) 
  {
    rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
    tableRow = repTableObj.addRow();
    tableRow.addCell(" ", "", 1);
    tableRow.addCell(" ", "", 1);
    tableRow.addCell(texts.rounding, "border-left border-right", 1);
    tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_rounding_difference), "amount border-left border-right", 1);
  }


  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 1);
  tableRow.addCell("", "", 1);
  tableRow.addCell("", "border-left border-right", 1);
  tableRow.addCell("", "border-left border-right", 1);


  //FINAL TOTAL
  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 1);
  tableRow.addCell(" ", "", 1);
  tableRow.addCell(texts.total.toUpperCase() + " " + invoiceObj.document_info.currency, "bold border-left border-right", 1);
  tableRow.addCell(toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_to_pay), "bold amount border-left border-right colorText", 1);

  rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
  tableRow = repTableObj.addRow();
  tableRow.addCell("", "", 4);

  //Payment Terms
  if (invoiceObj.billing_info.payment_term) {
    var payment_terms_label = texts.payment_terms_label;
    var payment_terms = invoiceObj.billing_info.payment_term;
    tableRow = repTableObj.addRow();
    tableRow.addCell(payment_terms_label + ": ", "", 4).addText(payment_terms, "colorText");
  }


  //Notes
  for (var i = 0; i < invoiceObj.note.length; i++) 
  {
    if (invoiceObj.note[i].description) {
      tableRow = repTableObj.addRow();
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow.addCell(invoiceObj.note[i].description,"",4);
    }
  }

  //Greetings
  if (invoiceObj.document_info.greetings) {
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell(invoiceObj.document_info.greetings, "", 4);
  }

  //Params personal_text_1/personal_text_2
  if (param.personal_text_1 || param.personal_text_2) {
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell("", "", 4);
	  
      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell(param.personal_text_1, "", 4);

      rowNumber = checkFileLength(invoiceObj, repDocObj, param, texts, rowNumber);
      tableRow = repTableObj.addRow();
      tableRow.addCell(param.personal_text_2, "", 4);
  }
  
  // Pvr
  if (param.print_isr && invoiceObj.document_info.currency == "CHF") {
    
	var bank = param.isr_bank_name;
	if (bank.length>0 && param.isr_bank_address.length>0)
	  bank += ",";
	bank += param.isr_bank_address;
    invoiceObj["billing_info"]["bank_name"] = bank;
	invoiceObj["billing_info"]["iban_number"] = "";

    //pvr on new page
    if (param.isr_on_new_page) 
    {
      repDocObj.addPageBreak();
      pageNr++;
      printInvoiceDetails(invoiceObj, repDocObj, param, texts, rowNumber);
      printItemsHeader(invoiceObj, repDocObj, param, texts, rowNumber);
      print_isr(invoiceObj, repDocObj, repStyleObj, param);
    }
    //pvr NOT (if possible) on new page
    else 
    {
       //pvr on the page 1, after the items table
      if (rowNumber <= max_items_per_page_with_isr && pageNr == 1) 
      {
        print_isr(invoiceObj, repDocObj, repStyleObj, param);
      }
      //pvr on other pages, after the items table
      else if (rowNumber <= max_items_per_page && pageNr > 1) 
      {
        print_isr(invoiceObj, repDocObj, repStyleObj, param);
      }
      //pvr goes automatically on new page if there is not enough space
      else 
      {
        repDocObj.addPageBreak();
        pageNr++;
        printInvoiceDetails(invoiceObj, repDocObj, param, texts, rowNumber);
        printItemsHeader(invoiceObj, repDocObj, param, texts, rowNumber);
        print_isr(invoiceObj, repDocObj, repStyleObj, param);
      }
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

  if (invoiceSupplier.business_name) {
    supplierAddress = invoiceSupplier.business_name + "\n";
  }

  if (supplierAddress.length<=0)
  {
    if (invoiceSupplier.first_name) {
      supplierAddress = invoiceSupplier.first_name + " ";
    }
  
    if (invoiceSupplier.last_name) {
      supplierAddress = supplierAddress + invoiceSupplier.last_name + "\n";
    }
  }

  if (invoiceSupplier.address1) {
    supplierAddress = supplierAddress + invoiceSupplier.address1 + " ";
  }
  
  if (invoiceSupplier.address2) {
    supplierAddress = supplierAddress + invoiceSupplier.address2 + " ";
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

function print_isr(jsonInvoice, report, repStyleObj, param) {

   var pvrForm = report.addSection("pvr_Form");

   print_isrBankInfo(jsonInvoice, pvrForm, repStyleObj);
   print_isrSupplierInfo(jsonInvoice, pvrForm, repStyleObj);
   print_isrAccount(jsonInvoice, pvrForm, repStyleObj, param);
   print_isrAmount(jsonInvoice, pvrForm, repStyleObj);
   print_isrCustomerInfo(jsonInvoice, pvrForm, repStyleObj, param);
   print_isrCode(jsonInvoice, pvrForm, repStyleObj, param);

   setPvrStyle(report, repStyleObj, param);
}



//The purpose of this function is to print the billing info informations in the correct position
function print_isrBankInfo(jsonInvoice, report, repStyleObj) {

   var str = jsonInvoice["billing_info"]["bank_name"].split(',');

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
function print_isrSupplierInfo(jsonInvoice, report, repStyleObj) {

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
function print_isrAccount(jsonInvoice, report, repStyleObj, param) {

   //Receipt
   var accountNumber_REC = report.addSection("accountNumber_REC");
   accountNumber_REC.addParagraph(param.isr_account);

   //Payment
   var accountNumber_PAY = report.addSection("accountNumber_PAY");
   accountNumber_PAY.addParagraph(param.isr_account);
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
   var pvrReference = pvrReferenceString(param.isr_id, jsonInvoice["customer_info"]["number"], pvrInvoiceNumber(jsonInvoice));
   pvrReference = pvrReference.substr(0,2) + " " +
   pvrReference.substr(2,5) + " " +
   pvrReference.substr(7,5) + " " +
   pvrReference.substr(12,5) + " " +
   pvrReference.substr(17,5) + " " +
   pvrReference.substr(22,5) + " " +
   pvrReference.substr(27,5);

   //Receipt
   var customerAddress_REC = report.addSection("customerAddress_REC");
   customerAddress_REC.addParagraph(pvrReference, "pvr_reference");
   for (var i = 0; i < addressLines.length; i++) {
      customerAddress_REC.addParagraph(addressLines[i]);
   }

   //Payment
   var customerAddress_PAY = report.addSection("customerAddress_PAY");
   for (var i = 0; i < addressLines.length; i++) {
      customerAddress_PAY.addParagraph(addressLines[i]);
   }

   //Reference number
   var referenceNumber_PAY = report.addSection("referenceNumber_PAY");
   referenceNumber_PAY.addParagraph(pvrReference);

}

//The purpose of this function is to print the full PVR code in the correct position
function print_isrCode(jsonInvoice, report, repStyleObj, param) {

   var amount = jsonInvoice["billing_info"]["total_to_pay"];

   var pvrReference = pvrReferenceString(param.isr_id, jsonInvoice["customer_info"]["number"],
                                         pvrInvoiceNumber(jsonInvoice) );
   if (pvrReference.indexOf("@error")>=0) {
       Banana.document.addMessage( pvrReference, "error");
   }

   if (amount == '')
     amount = '0.00';

   var pvrFullCode = pvrCodeString(amount, pvrReference, param.isr_account);
   if (pvrFullCode.indexOf("@error")>=0) {
       Banana.document.addMessage( pvrFullCode, "error");
   }

   var pvrFullCode_PAY = report.addSection("pvrFullCode_PAY");
   pvrFullCode_PAY.addParagraph(pvrFullCode);
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
  var infoTable = repDocObj.addTable("info_table_row0");
  var infoCol1 = infoTable.addColumn("infoCol1");
  var infoCol2 = infoTable.addColumn("infoCol2");
  var infoCol3 = infoTable.addColumn("infoCol3");
  var infoCol4 = infoTable.addColumn("infoCol4");
  var invoiceDate = Banana.Converter.toLocaleDateFormat(invoiceObj.document_info.date);

  tableRow = infoTable.addRow();
  tableRow.addCell(texts.date + ": ", "", 1).addText(invoiceDate, "colorText");
  tableRow.addCell(texts.customer + ": ", "", 1).addText(invoiceObj.customer_info.number, "colorText");
  tableRow.addCell(texts.total + ": ", "", 1).addText(invoiceObj.document_info.currency + " " + toInvoiceAmountFormat(invoiceObj, invoiceObj.billing_info.total_to_pay), "colorText");
  tableRow.addCell(texts.page + ": ", "amount", 1).addText(pageNr, "colorText");
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
  dd.addCell(texts.description, "bold border-left padding-top padding-bottom border-right", 1);
  dd.addCell(texts.qty, "bold border-left padding-top padding-bottom border-right", 1);
  dd.addCell(texts.unit_price, "bold border-left amount padding-top padding-bottom border-right", 1);
  dd.addCell(texts.total + " " + invoiceObj.document_info.currency, "bold border-left border-right amount padding-top padding-bottom", 1);
}

//====================================================================//
// PVRCODE
//====================================================================//
/**
 * The function pvrCodeString build the code on the pvr,
 * as described under the document "Postinance, Descrizione dei record,
 * Servizi elettronici".
 * @param amount The amount of the pvr, have to contains 2 decimals (ex.: 1039.75).
 * @param pvrReference The refecence code of the pvr, have to be 27 digit length.
 * @param ccpAccount The CCP account number, the syntax have to be XX-YYYYY-ZZ.
 */
function pvrCodeString(amount, pvrReference, ccpAccount) {

   // The amout have to be 10 digit lenght, prepend with zeros
   // Example: '18.79' => '00001879'
   if (amount.lastIndexOf('.') !== amount.length - 3) {
      return "@error Invalid amount, have to contain 2 decimals.";
   }
   
   var pvrAmount = amount.replace('.','').replace(' ', '');
   while (pvrAmount.length < 10) {
      pvrAmount = '0' + pvrAmount;
   }

   // The ccp account have to be 8 digit lenght, prepend the second part with zeros
   var cppAccountParts = ccpAccount.split('-');
   if (cppAccountParts.length < 3) {
      return "@error Invalid CCP account, syntax have to be 'XX-YYYYY-ZZ'. Your CCP account " + ccpAccount;
   }

   while (cppAccountParts[0].length + cppAccountParts[1].length < 8) {
      cppAccountParts[1] = '0' + cppAccountParts[1];
   }

   // Verify control digit of ccp account
   if (cppAccountParts[2] !== modulo10(cppAccountParts[0] + cppAccountParts[1])) {
      return "@error Invalid CCP, wrong control digit.";
   }

   var pvrAccount = cppAccountParts[0] + cppAccountParts[1] + cppAccountParts[2];

   // Verify control digit of CCP reference
   pvrReference = pvrReference.replace(/\s+/g, ''); //remove "white" spaces
   if (pvrReference.length !== 27) {
      return "@error Invalid PVR reference code, has to be 27 digit length.";
   }
   
   if (pvrReference[pvrReference.length-1] !== modulo10(pvrReference.substr(0,pvrReference.length-1))) {
      return "@error Invalid PVR reference, wrong control digit.";
   }

   var pvrType = "01";
   var pvrAmountControlDigit = modulo10(pvrType + pvrAmount);
   var pvrFullCode = pvrType + pvrAmount + pvrAmountControlDigit + '>' + pvrReference + "+ " + pvrAccount + ">";

   return pvrFullCode;
}

/**
 * The function pvrReferenceString build the pvr reference,
 * containg the pvr identification, the customer and the invoice number.
 * @param pvrId The pvr idetification number (given by the bank). Max 8 chars.
 * @param customerNo The customer number. Max 7 chars.
 * @param invoiceNo The invoice/oder number. Max 7 chars.
 */
function pvrReferenceString(pvrId, customerNo, invoiceNo) {
   if (pvrId.length > 8)
      return "@error pvrId too long, max 8 chars. Your pvrId " + pvrId;
   else if (!pvrId.match(/^[0-9]*$/))
      return "@error pvrId invalid, only digits are permitted. Your pvrId " + pvrId ;
   else if (customerNo.length > 7)
      return "@error customerNo too long, max 7 digits. Your customerNo " + customerNo;
   else if (!customerNo.match(/^[0-9]*$/))
      return "@error customerNo invalid, only digits are permitted. Your customerNo " + customerNo;
   else if (invoiceNo.length > 7)
      return "@error invoiceNo too long, max 7 digits. Your invoiceNo " + invoiceNo;
   else if (!invoiceNo.match(/^[0-9]*$/))
      return "@error invoiceNo invalid, only digits are permitted. Your invoiceNo " + invoiceNo;

   var pvrReference = pvrId;
   while (pvrReference.length + customerNo.length < 18)
      pvrReference += "0";
   pvrReference += customerNo;
   while (pvrReference.length + invoiceNo.length < 25)
      pvrReference += "0";
   pvrReference += invoiceNo;
   pvrReference += "0";
   pvrReference += modulo10(pvrReference);

   return pvrReference;
}

/**
 * The function modulo10 calculate the modulo 10 of a string,
 * as described under the document "Postinance, Descrizione dei record,
 * Servizi elettronici".
 */
function modulo10(string) {

   // Description of algorithm on
   // Postinance, Descrizione dei record, Servizi elettronici
   var modulo10Table = [
            [0, 9, 4, 6, 8, 2, 7, 1, 3, 5, "0"],
            [9, 4, 6, 8, 2, 7, 1, 3, 5, 0, "9"],
            [4, 6, 8, 2, 7, 1, 3, 5, 0, 9, "8"],
            [6, 8, 2, 7, 1, 3, 5, 0, 9, 4, "7"],
            [8, 2, 7, 1, 3, 5, 0, 9, 4, 6, "6"],
            [2, 7, 1, 3, 5, 0, 9, 4, 6, 8, "5"],
            [7, 1, 3, 5, 0, 9, 4, 6, 8, 2, "4"],
            [1, 3, 5, 0, 9, 4, 6, 8, 2, 7, "3"],
            [3, 5, 0, 9, 4, 6, 8, 2, 7, 1, "2"],
            [5, 0, 9, 4, 6, 8, 2, 7, 1, 3, "1"],
         ];

   var module10Report = 0;

   if (string) {
      for (var i = 0; i < string.length; i++) {
         switch (string[i]) {
         case "0":
            module10Report = modulo10Table[module10Report][0];
            break;
         case "1":
            module10Report = modulo10Table[module10Report][1];
            break;
         case "2":
            module10Report = modulo10Table[module10Report][2];
            break;
         case "3":
            module10Report = modulo10Table[module10Report][3];
            break;
         case "4":
            module10Report = modulo10Table[module10Report][4];
            break;
         case "5":
            module10Report = modulo10Table[module10Report][5];
            break;
         case "6":
            module10Report = modulo10Table[module10Report][6];
            break;
         case "7":
            module10Report = modulo10Table[module10Report][7];
            break;
         case "8":
            module10Report = modulo10Table[module10Report][8];
            break;
         case "9":
            module10Report = modulo10Table[module10Report][9];
            break;
         }
      }
   }

   return modulo10Table[module10Report][10];
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
   style.setAttribute("top", "9mm");

   style = repStyleObj.addStyle(".billingInfo_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "64mm");
   style.setAttribute("top", "9mm");

   //printPvrSupplierInfo
   style = repStyleObj.addStyle(".supplierInfo_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "4mm");
   style.setAttribute("top", "22mm");

   style = repStyleObj.addStyle(".supplierInfo_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "64mm");
   style.setAttribute("top", "22mm");
   
   //printPvrAccount
   style = repStyleObj.addStyle(".accountNumber_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "30mm");
   style.setAttribute("top", "42mm");

   style = repStyleObj.addStyle(".accountNumber_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "90mm");
   style.setAttribute("top", "42mm");
   
   //printPvrAmount 
   style = repStyleObj.addStyle(".totalInvoiceFr_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "4mm");
   style.setAttribute("top", "51mm");
   style.setAttribute("width", "37mm");
   style.setAttribute("font-size", "11px");
   style.setAttribute("text-align", "right");

   style = repStyleObj.addStyle(".totalInvoiceCts_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "50mm");
   style.setAttribute("top", "51mm");
   style.setAttribute("font-size", "11px");

   style = repStyleObj.addStyle(".totalInvoiceFr_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "65mm");
   style.setAttribute("top", "51mm");
   style.setAttribute("width", "37mm");
   style.setAttribute("font-size", "11px");
   style.setAttribute("text-align", "right");

   style = repStyleObj.addStyle(".totalInvoiceCts_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "111mm");
   style.setAttribute("top", "51mm");
   style.setAttribute("font-size", "11px");
   
   //printPvrCustomerInfo
   style = repStyleObj.addStyle(".customerAddress_REC");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "4mm");
   style.setAttribute("top", "62mm");
   style.setAttribute("font-size", "10px");

   style = repStyleObj.addStyle(".customerAddress_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("left", "125mm");
   style.setAttribute("top", "50mm");
   style.setAttribute("font-size", "10px");
   
   //printPvrReference
   style = repStyleObj.addStyle(".referenceNumber_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("text-align", "center");
   style.setAttribute("left", "122mm");
   style.setAttribute("top", "34mm");
   style.setAttribute("width", "83mm");
   style.setAttribute("font-size", "10pt");
   style.setAttribute("font-family", "OCRB");
   
   //printPvrCode
   style = repStyleObj.addStyle(".pvrFullCode_PAY");
   style.setAttribute("position", "absolute");
   style.setAttribute("right", "6mm");
   style.setAttribute("text-align", "right");
   style.setAttribute("top", "85mm");// 20th row * (25.4mm / 6)
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
    if (!param.font_family) {
        param.font_family = "Helvetica";
    }

    if (!param.color_1) {
        param.color_1 = "#FFFACD";
    }

    if (!param.color_2) {
        param.color_2 = "#333333";
    }

    if (!param.color_3) {
        param.color_3 = "#000000";
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
    repStyleObj.addStyle(".amount", "text-align:right");
    repStyleObj.addStyle(".subtotal_cell", "font-weight:bold;");
    repStyleObj.addStyle(".bold", "font-weight: bold");
    repStyleObj.addStyle(".left", "text-align:left");
    repStyleObj.addStyle(".center", "text-align:center");
    repStyleObj.addStyle(".evenRowsBackgroundColor", "background-color:" + param.color_1 + ";color:" + param.color_2);
    repStyleObj.addStyle(".colorText", "color:" + param.color_3);
    repStyleObj.addStyle(".title", "font-size: 18pt;padding-left:10px;");

    repStyleObj.addStyle(".col1","width:49%");
    repStyleObj.addStyle(".col2","width:50%");

    repStyleObj.addStyle(".repTableCol1","width:40%");
    repStyleObj.addStyle(".repTableCol2","width:12%");
    repStyleObj.addStyle(".repTableCol3","width:26%");
    repStyleObj.addStyle(".repTableCol4","width:22%");

    repStyleObj.addStyle(".border-left", "border-left:1px solid black; padding-left:10px");
    repStyleObj.addStyle(".border-right", "border-right:1px solid black; padding-right:10px");
    repStyleObj.addStyle(".border-top", "border-top:1px solid black");
    repStyleObj.addStyle(".border-bottom", "border-bottom:1px solid black");

    repStyleObj.addStyle(".padding-top", "padding-top:5px");
    repStyleObj.addStyle(".padding-right", "padding-right:5px");
    repStyleObj.addStyle(".padding-bottom", "padding-bottom:5px");
    repStyleObj.addStyle(".padding-left", "padding-left:5px");

    //====================================================================//
    // LOGO
    //====================================================================//
    var logoStyle = repStyleObj.addStyle(".logoStyle");
    logoStyle.setAttribute("position", "absolute");
    logoStyle.setAttribute("margin-top", "5mm");
    logoStyle.setAttribute("margin-left", "20mm"); 
    logoStyle.setAttribute("width", "100px"); 

    //====================================================================//
    // TABLES
    //====================================================================//
    var headerStyle = repStyleObj.addStyle(".header_table");
    headerStyle.setAttribute("position", "absolute");
    headerStyle.setAttribute("margin-top", "50mm"); //106
    headerStyle.setAttribute("margin-left", "22mm"); //20
    headerStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.header_table td", "border: thin solid black");
    headerStyle.setAttribute("width", "100%");


    var titleStyle = repStyleObj.addStyle(".title_table");
    titleStyle.setAttribute("position", "absolute");
    titleStyle.setAttribute("margin-top", "100mm");
    titleStyle.setAttribute("margin-left", "18mm");
    titleStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.title_table td", "border: thin solid black");
    titleStyle.setAttribute("width", "100%");


    
    var infoStyle = repStyleObj.addStyle(".info_table");
    infoStyle.setAttribute("position", "absolute");
    infoStyle.setAttribute("margin-top", "120mm");
    infoStyle.setAttribute("margin-left", "22mm");
    infoStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.info_table td", "border: thin solid black");
    infoStyle.setAttribute("width", "100%");


    var infoStyle = repStyleObj.addStyle(".info_table_row0");
    infoStyle.setAttribute("position", "absolute");
    infoStyle.setAttribute("margin-top", "10mm");
    infoStyle.setAttribute("margin-left", "22mm");
    infoStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.info_table td", "border: thin solid black");
    infoStyle.setAttribute("width", "100%");

    

    var itemsStyle = repStyleObj.addStyle(".doc_table");
    itemsStyle.setAttribute("margin-top", "130mm"); //106
    itemsStyle.setAttribute("margin-left", "23mm"); //20
    itemsStyle.setAttribute("margin-right", "10mm");
    //repStyleObj.addStyle("table.doc_table td", "border: thin solid black; padding: 3px;");
    itemsStyle.setAttribute("width", "100%");


    var itemsStyle = repStyleObj.addStyle(".doc_table_row0");
    itemsStyle.setAttribute("margin-top", "35mm"); //106
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
	texts.param_color_1 = 'Colore 1';
	texts.param_color_2 = 'Colore 2';
	texts.param_font_family = 'Tipo carattere';
    texts.param_print_header = 'Includi intestazione pagina (1=si, 0=no)';
    texts.param_print_isr = 'Stampa PVR (1=si, 0=no)';
    texts.param_isr_bank_name = 'Nome banca (solo con conto bancario, con conto postale lasciare vuoto)';
    texts.param_isr_bank_address = 'Indirizzo banca (solo con conto bancario, con conto postale lasciare vuoto)';
    texts.param_isr_account = 'Conto PVR (numero di cliente PVR)';
    texts.param_isr_id = 'Numero di adesione PVR (solo con conto bancario, con conto postale lasciare vuoto)';
    texts.param_isr_position_scaleX = 'Scala orizzontale caratteri (default 1.0)';
    texts.param_isr_position_scaleY = 'Scala verticale caratteri (default 1.0)';
    texts.param_isr_position_dX = 'PVR X-Position mm (default 0)';
    texts.param_isr_position_dY = 'PVR Y-Position mm (default 0)';
	texts.param_isr_on_new_page = 'Stampa polizza di versamento su pagina separata (1=si, 0=no)';
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
    texts.from = 'VON:';
    texts.to = 'ZU:';
	texts.param_color_1 = 'Farbe 1';
	texts.param_color_2 = 'Farbe 2';
	texts.param_font_family = 'Typ Schriftzeichen';
    texts.param_print_header = 'Seitenüberschrift einschliessen (1=ja, 0=nein)';
    texts.param_print_isr = 'ESR ausdrucken (1=ja, 0=nein)';
    texts.param_isr_bank_name = 'Name der Bank (nur Bankkonto, mit Postkonto leer lassen)';
    texts.param_isr_bank_address = 'Bankadresse (nur Bankkonto, mit Postkonto leer lassen)';
    texts.param_isr_account = 'ESR-Konto (ESR-Kundennummer)';
    texts.param_isr_id = 'ESR-Teilnehmernummer (nur Bankkonto, mit Postkonto leer lassen)';
    texts.param_isr_position_scaleX = 'Horizontale Zeichenskalierung (default 1.0)';
    texts.param_isr_position_scaleY = 'Vertikale Zeichenskalierung (default 1.0)';
    texts.param_isr_position_dX = 'ESR X-Position mm (default 0)';
    texts.param_isr_position_dY = 'ESR Y-Position mm (default 0)';
	texts.param_isr_on_new_page = 'ESR auf ein separates Blatt drucken (1=ja, 0=nein)';
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
	texts.param_color_1 = 'Couleur 1';
	texts.param_color_2 = 'Couleur 2';
    texts.param_font_family = 'Police de caractère';
	texts.param_print_header = 'Inclure en-tête de page (1=oui, 0=non)';
    texts.param_print_isr = 'Imprimer BVR (1=oui, 0=non)';
    texts.param_isr_bank_name = 'Compte bancaire (seulement avec compte bancaire, avec compte postal laisser vide)';
    texts.param_isr_bank_address = 'Adresse de la banque (seulement avec compte bancaire, avec compte postal laisser vide)';
    texts.param_isr_account = 'Compte BVR (numéro de client BVR)';
    texts.param_isr_id = 'Numéro d’adhérent BVR (seulement avec compte bancaire, avec compte postal laisser vide)';
    texts.param_isr_position_scaleX = 'Décalage horizontal caractère (default 1.0)';
    texts.param_isr_position_scaleY = 'Décalage vertical caractère (default 1.0)';
    texts.param_isr_position_dX = 'BVR X-Position mm (default 0)';
    texts.param_isr_position_dY = 'BVR Y-Position mm (default 0)';
	texts.param_isr_on_new_page = 'Imprimer le bulletin sur une page séparée (1=oui, 0=non)';
	texts.param_personal_text_1 = 'Texte libre (ligne 1)';
	texts.param_personal_text_2 = 'Texte libre (ligne 2)';
    texts.payment_due_date_label = 'Echéance';
    texts.payment_terms_label = 'Paiement';
	//texts.param_max_items_per_page = 'Nombre d’éléments sur chaque facture';
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
    texts.from = 'VAN:';
    texts.to = 'TOT:';
	texts.param_color_1 = 'Kleur 1';
	texts.param_color_2 = 'Kleur 2';
	texts.param_font_family = 'Lettertype';
    texts.param_print_header = 'Pagina-koptekst (1=ja, 0=nee)';
    texts.param_print_isr = 'Print ISR (1=yes, 0=no)';
    texts.param_isr_bank_name = 'Bank name (only with bank account, with postal account leave blank)';
    texts.param_isr_bank_address = 'Bank address (only with bank account, with postal account leave blank)';
    texts.param_isr_account = 'ISR Account (ISR customer number)';
    texts.param_isr_id = 'ISR subscriber number (only with bank account, with postal account leave blank)';
    texts.param_isr_position_scaleX = 'Character Horizontal Scaling (default 1.0)';
    texts.param_isr_position_scaleY = 'Character Vertical Scaling (default 1.0)';
    texts.param_isr_position_dX = 'ISR X-Position mm (default 0)';
    texts.param_isr_position_dY = 'ISR Y-Position mm (default 0)';
	texts.param_isr_on_new_page = 'Print ISR on a new page (1=yes, 0=no)';
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
    texts.from = 'FROM:';
    texts.to = 'TO:';
	texts.param_color_1 = 'Color 1';
	texts.param_color_2 = 'Color 2';
	texts.param_font_family = 'Font type';
    texts.param_print_header = 'Include page header (1=yes, 0=no)';
    texts.param_print_isr = 'Print ISR (1=yes, 0=no)';
    texts.param_isr_bank_name = 'Bank name (only with bank account, with postal account leave blank)';
    texts.param_isr_bank_address = 'Bank address (only with bank account, with postal account leave blank)';
    texts.param_isr_account = 'ISR Account (ISR customer number)';
    texts.param_isr_id = 'ISR subscriber number (only with bank account, with postal account leave blank)';
    texts.param_isr_position_scaleX = 'Character Horizontal Scaling (default 1.0)';
    texts.param_isr_position_scaleY = 'Character Vertical Scaling (default 1.0)';
    texts.param_isr_position_dX = 'ISR X-Position mm (default 0)';
    texts.param_isr_position_dY = 'ISR Y-Position mm (default 0)';
	texts.param_isr_on_new_page = 'Print ISR on a new page (1=yes, 0=no)';
	texts.param_personal_text_1 = 'Personal text (row 1)';
	texts.param_personal_text_2 = 'Personal text (row 2)';
    texts.payment_due_date_label = 'Due date';
    texts.payment_terms_label = 'Payment';
	//texts.param_max_items_per_page = 'Number of items on each page';
  }
  return texts;
}

