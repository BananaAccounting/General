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
// @id = ch.banana.report.customer.invoice.without.amount.js
// @api = 1.0
// @pubdate = 2017-02-24
// @publisher = Banana.ch SA
// @description = Swiss invoice with ISR without amount
// @description.it = Fattura svizzera con PVR senza importo
// @task = report.customer.invoice

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
   var texts = setDocumentTexts(lang);
   
   param.isr_bank_name = Banana.Ui.getText('Settings', texts.param_isr_bank_name, param.isr_bank_name);
   if (param.isr_bank_name === undefined)
      return;
   param.isr_bank_address = Banana.Ui.getText('Settings', texts.param_isr_bank_address, param.isr_bank_address);
   if (param.isr_bank_address === undefined)
      return;
   param.isr_bank_iban = Banana.Ui.getText('Settings', texts.param_isr_bank_iban, param.isr_bank_iban);
   if (param.isr_bank_iban === undefined)
      return;
   param.isr_bank_id = Banana.Ui.getText('Settings', texts.param_isr_bank_id, param.isr_bank_id);
   if (param.isr_bank_id === undefined)
      return;
   param.isr_payment_to_row1 = Banana.Ui.getText('Settings', texts.param_isr_payment_to_row1, param.isr_payment_to_row1);
   if (param.isr_payment_to_row1 === undefined)
      return;
   param.isr_payment_to_row2 = Banana.Ui.getText('Settings', texts.param_isr_payment_to_row2, param.isr_payment_to_row2);
   if (param.isr_payment_to_row2 === undefined)
      return;
   param.isr_payment_to_row3 = Banana.Ui.getText('Settings', texts.param_isr_payment_to_row3, param.isr_payment_to_row3);
   if (param.isr_payment_to_row3 === undefined)
      return;
   param.isr_account = Banana.Ui.getText('Settings', texts.param_isr_account, param.isr_account);
   if (param.isr_account === undefined)
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

   var paramToString = JSON.stringify(param);
   var value = Banana.document.scriptSaveSettings(paramToString);
}

function initParam() {
   var param = {};
   param.isr_bank_name = '';
   param.isr_bank_address = '';
   param.isr_bank_iban = '';
   param.isr_bank_id = '';
   param.isr_payment_to_row1 = '';
   param.isr_payment_to_row2 = '';
   param.isr_payment_to_row3 = '';
   param.isr_account = '';
   param.isr_position_scaleX = '1.0';
   param.isr_position_scaleY = '1.0';
   param.isr_position_dX = '0';
   param.isr_position_dY = '0';
   param.isr_type = '04';
   return param;
}

function verifyParam(param) {
   if (!param.isr_bank_name)
     param.isr_bank_name = '';
   if (!param.isr_bank_address)
     param.isr_bank_address = '';
   if (!param.isr_bank_iban)
     param.isr_bank_iban = '';
   if (!param.isr_bank_id)
     param.isr_bank_id = '';
   if (!param.isr_payment_to_row1)
     param.isr_payment_to_row1 = '';
   if (!param.isr_payment_to_row2)
     param.isr_payment_to_row2 = '';
   if (!param.isr_payment_to_row3)
     param.isr_payment_to_row3 = '';
   if (!param.isr_account)
     param.isr_account = '';
   if (!param.isr_position_scaleX)
     param.isr_position_scaleX = '1.0';
   if (!param.isr_position_scaleY)
     param.isr_position_scaleY = '1.0';
   if (!param.isr_position_dX)
     param.isr_position_dX = '0';
   if (!param.isr_position_dY)
     param.isr_position_dY = '0';
   if (!param.isr_type)
     param.isr_type = '04';
   
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
  var texts = setDocumentTexts(langDoc);

  // Invoice document
  var reportObj = Banana.Report;
  
  if (!repDocObj) {
    repDocObj = reportObj.newReport(texts.title);
  } else {
    var pageBreak = repDocObj.addPageBreak();
    pageBreak.addClass("pageReset");
  }


  /***********
    1. HEADER
  ***********/
  var headerTable = repDocObj.addTable("header_table");
  var col1 = headerTable.addColumn("header_col1");
  var tableRow = headerTable.addRow();
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
  cell.addParagraph(business_name, "logo left bold");
  
  tableRow = headerTable.addRow();
  cell = tableRow.addCell("", "", 1);

  var supplierLines = getInvoiceSupplier(invoiceObj.supplier_info).split('\n');
  for (var i=0; i < supplierLines.length; i++) {
    cell.addParagraph(supplierLines[i], "header_address");
  }

  /**************
    2. ADDRESS
  ***************/
  var addressTable = repDocObj.addTable("address_table");
  var addressCol1 = addressTable.addColumn("address_col1");
  var addressCol2 = addressTable.addColumn("address_col2")

  tableRow = addressTable.addRow();
  var cell1 = tableRow.addCell("", "", 1);
  var cell2 = tableRow.addCell("","",1); 
  var addressLines = getInvoiceAddress(invoiceObj.customer_info).split('\n');
  for (var i=0; i < addressLines.length; i++) {
    cell2.addParagraph(addressLines[i], "");
  }

 /***************
    3. TEXT
  ***************/
  var docTable = repDocObj.addTable("doc_table");
  var docCol1 = docTable.addColumn("doc_col1");
  var docCol2 = docTable.addColumn("doc_col2");
  var docCol3 = docTable.addColumn("doc_col3");
 
  //Date
  tableRow = docTable.addRow();
  tableRow.addCell("", "", 2);
  tableRow.addCell(invoiceObj.supplier_info.city + ", " + Banana.Converter.toLocaleDateFormat(invoiceObj.document_info.date), "date", 1);

  //Title
  tableRow = docTable.addRow();
  tableRow.addCell(texts.title, "bold title", 3);

  //Text
  tableRow = docTable.addRow();
  tableRow.addCell(texts.p1, "normal", 3);
  tableRow = docTable.addRow();
  tableRow.addCell(texts.p2, "normal", 3);
  tableRow = docTable.addRow();
  tableRow.addCell(texts.p3, "normal", 3);
  tableRow = docTable.addRow();
  tableRow.addCell("", "normal", 3);
  tableRow = docTable.addRow();
  tableRow.addCell(texts.quote_text_1, "list");
  tableRow.addCell(texts.quote_1, "amount");
  tableRow.addCell("", "amount");
  tableRow = docTable.addRow();
  tableRow.addCell(texts.quote_text_2, "list");
  tableRow.addCell(texts.quote_2, "amount");
  tableRow.addCell("", "amount");
  tableRow = docTable.addRow();
  tableRow.addCell(texts.quote_text_3, "list");
  tableRow.addCell(texts.quote_3, "amount");
  tableRow.addCell("", "amount");
  tableRow = docTable.addRow();
  tableRow.addCell("", "normal", 3);
  tableRow = docTable.addRow();
  tableRow.addCell(texts.p4, "normal", 3);
  tableRow = docTable.addRow();
  tableRow.addCell(texts.p5, "normal", 3);

  //Signature
  var signatureTable = repDocObj.addTable("signature_table");
  var signatureCol1 = signatureTable.addColumn("signature_col1");
  var signatureCol2 = signatureTable.addColumn("signature_col2");

  tableRow = signatureTable.addRow();
  tableRow.addCell("", "");
  tableRow.addCell(texts.signature, "signature bold");

 /***************
    4. PVR
  ***************/
  if (invoiceObj.document_info.currency == "CHF") {
    print_isr(invoiceObj, repDocObj, repStyleObj, param);
  }
   
  //Set document style
  setDocumentStyle(reportObj, repStyleObj, param);
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
  
  if (invoiceAddress.country) {
    address = address + invoiceAddress.country + "-";
  }

  if (invoiceAddress.postal_code) {
    address = address + invoiceAddress.postal_code + " ";
  }
  
  if (invoiceAddress.city) {
    address = address + invoiceAddress.city + "\n";
  }

  return address;
}

function getInvoiceSupplier(invoiceSupplier) {
  
  var supplierAddress = "";

  if (invoiceSupplier.first_name) {
    supplierAddress = invoiceSupplier.first_name + " ";
  }
  
  if (invoiceSupplier.last_name) {
    supplierAddress = supplierAddress + invoiceSupplier.last_name;
  }

  if (supplierAddress.length>0) {
    supplierAddress = supplierAddress + "\n";
  }
  
  if (invoiceSupplier.address1) {
    supplierAddress = supplierAddress + invoiceSupplier.address1 + "\n";
  }
  
  if (invoiceSupplier.address2) {
    supplierAddress = supplierAddress + invoiceSupplier.address2 + "\n";
  }

  if (invoiceSupplier.country) {
    supplierAddress = supplierAddress + invoiceSupplier.country + " - ";
  }

  if (invoiceSupplier.postal_code) {
    supplierAddress = supplierAddress + invoiceSupplier.postal_code + " ";
  }
  
  if (invoiceSupplier.city) {
    supplierAddress = supplierAddress + invoiceSupplier.city + "\n";
  }

  if (invoiceSupplier.web) {
    supplierAddress = supplierAddress + invoiceSupplier.web + "\n";
  }
 
  if (invoiceSupplier.email) {
    supplierAddress = supplierAddress + invoiceSupplier.email + "\n";
  }

  if (invoiceSupplier.phone) {
    supplierAddress = supplierAddress + "Tel: " + invoiceSupplier.phone;
  }
  
  return supplierAddress;
}

//---------------------------------------------------------------------------------------------------------//
// PVR PRINT FUNCTIONS
//---------------------------------------------------------------------------------------------------------//
//The purpose of this function is return a complete address
function getAddressLines_isr(jsonAddress, fullAddress) {

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

//Return the invoice number without the prefix
function getInvoiceNumber_isr(jsonInvoice) {
  var prefixLength = jsonInvoice["document_info"]["number"].indexOf('-');
  if (prefixLength >= 0) {
    return jsonInvoice["document_info"]["number"].substr(prefixLength + 1);
  }
  return jsonInvoice["document_info"]["number"]
}

function print_isr(jsonInvoice, report, repStyleObj, param) {

   var pvrForm = report.addSection("pvr_Form");

   print_isrBankInfo(jsonInvoice, pvrForm, repStyleObj, param);
   print_isrSupplierInfo(jsonInvoice, pvrForm, repStyleObj, param);
   print_isrAccount(jsonInvoice, pvrForm, repStyleObj, param);
   print_isrAmount(jsonInvoice, pvrForm, repStyleObj, param);
   print_isrCustomerInfo(jsonInvoice, pvrForm, repStyleObj, param);
   print_isrCode(jsonInvoice, pvrForm, repStyleObj, param);

   setPvrStyle(report, repStyleObj, param);
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
function print_isrAmount(jsonInvoice, report, repStyleObj, param) {

   if (param.isr_type == '04') {
     return;
   }

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

//The purpose of this function is to print the billing info informations in the correct position
function print_isrBankInfo(jsonInvoice, report, repStyleObj, param) {

   var bank = param.isr_bank_name;
   if (bank.length>0 && param.isr_bank_address.length>0)
      bank += ",";
   bank += param.isr_bank_address;
   var str = bank.split(',');

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

//The purpose of this function is to print the full PVR code in the correct position
function print_isrCode(jsonInvoice, report, repStyleObj, param) {

   var amount = jsonInvoice["billing_info"]["total_to_pay"];

   var pvrReference = pvrReferenceString(param.isr_bank_id, jsonInvoice["customer_info"]["number"],
                                         getInvoiceNumber_isr(jsonInvoice) );
   if (pvrReference.indexOf("@error")>=0) {
       Banana.document.addMessage( pvrReference, "error");
   }

   var pvrFullCode = pvrCodeString(amount, pvrReference, param.isr_account, param.isr_type);
   if (pvrFullCode.indexOf("@error")>=0) {
       Banana.document.addMessage( pvrFullCode, "error");
   }

   var pvrFullCode_PAY = report.addSection("pvrFullCode_PAY");
   pvrFullCode_PAY.addParagraph(pvrFullCode);
}

//The purpose of this function is to print the customer address in the correct position
function print_isrCustomerInfo(jsonInvoice, report, repStyleObj, param) {

   var addressLines = getAddressLines_isr(jsonInvoice["customer_info"], false);
   var pvrReference = pvrReferenceString(param.isr_bank_id, jsonInvoice["customer_info"]["number"], getInvoiceNumber_isr(jsonInvoice));
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

//The purpose of this function is to print the supplier informations in the correct position
function print_isrSupplierInfo(jsonInvoice, report, repStyleObj, param) {

   //Receipt
   var supplierInfo_REC = report.addSection("supplierInfo_REC");
   supplierInfo_REC.addParagraph(param.isr_bank_iban);
   supplierInfo_REC.addParagraph(param.isr_payment_to_row1);
   supplierInfo_REC.addParagraph(param.isr_payment_to_row2);
   supplierInfo_REC.addParagraph(param.isr_payment_to_row3);

   //Payment
   var supplierInfo_PAY = report.addSection("supplierInfo_PAY");
   supplierInfo_PAY.addParagraph(param.isr_bank_iban);
   supplierInfo_PAY.addParagraph(param.isr_payment_to_row1);
   supplierInfo_PAY.addParagraph(param.isr_payment_to_row2);
   supplierInfo_PAY.addParagraph(param.isr_payment_to_row3);
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
function pvrCodeString(amount, pvrReference, ccpAccount, pvrType) {

   // The amout have to be 10 digit lenght, prepend with zeros
   // Example: '18.79' => '00001879'
   var pvrAmount = amount.replace('.','').replace(' ', '');
   if (pvrType == '01') {
      if (amount.lastIndexOf('.') !== amount.length - 3)
        return "@error Invalid amount, have to contain 2 decimals.";
      while (pvrAmount.length < 10) {
        pvrAmount = '0' + pvrAmount;
      }
   }
   else if (pvrType == '04') {
     pvrAmount = '';
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

   if (pvrType.length <= 0)
     pvrType = "01";
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
function setDocumentStyle(reportObj, repStyleObj, param) {
    
    if (!repStyleObj) {
        repStyleObj = reportObj.newStyleSheet();
    }

    //====================================================================//
    // GENERAL
    //====================================================================//
    repStyleObj.addStyle(".pageReset", "counter-reset: page");
    repStyleObj.addStyle("body", "font-size: 12pt; font-family: Arial, Helvetica, sans-serif");
    repStyleObj.addStyle(".address_col1","width:43%");
    repStyleObj.addStyle(".address_col2","width:57%");
    repStyleObj.addStyle(".amount", "text-align:right;");
    repStyleObj.addStyle(".bold", "font-weight: bold");
    repStyleObj.addStyle(".border-bottom", "border-bottom:2px solid;");
    repStyleObj.addStyle(".border-top", "border-top:2px solid;");
    repStyleObj.addStyle(".date","padding-bottom:20px;");
    repStyleObj.addStyle(".doc_col1","width:30%;");
    repStyleObj.addStyle(".doc_col2","width:20%");
    repStyleObj.addStyle(".doc_col3","width:50%");
    repStyleObj.addStyle(".header_address", "font-size:11pt;");
    repStyleObj.addStyle(".header_col1","width:100%");
    repStyleObj.addStyle(".logo", "font-size: 14pt;");
    repStyleObj.addStyle(".list", "font-size: 12pt;padding-left:20px;padding-top:5px;");
    repStyleObj.addStyle(".normal", "height:1.6em;padding-top:10px;");
    repStyleObj.addStyle(".signature", "font-size:12pt;");
    repStyleObj.addStyle(".signature_col1","width:43%");
    repStyleObj.addStyle(".signature_col2","width:57%");
    repStyleObj.addStyle(".title", "font-size:18pt;");

    //====================================================================//
    // TABLES
    //====================================================================//
    var headerStyle = repStyleObj.addStyle(".header_table");
    headerStyle.setAttribute("position", "absolute");
    headerStyle.setAttribute("margin-top", "10mm");
    headerStyle.setAttribute("margin-left", "20mm");
    headerStyle.setAttribute("margin-right", "4mm");

    var addressStyle = repStyleObj.addStyle(".address_table");
    addressStyle.setAttribute("position", "absolute");
    addressStyle.setAttribute("margin-top", "55mm");
    addressStyle.setAttribute("margin-left", "20mm");
    addressStyle.setAttribute("margin-right", "10mm");
    addressStyle.setAttribute("width", "100%");

    var docStyle = repStyleObj.addStyle(".doc_table");
    docStyle.setAttribute("margin-top", "100mm");
    docStyle.setAttribute("margin-left", "23mm");
    docStyle.setAttribute("margin-right", "10mm");
    docStyle.setAttribute("width", "100%");

    var signatureStyle = repStyleObj.addStyle(".signature_table");
    signatureStyle.setAttribute("margin-top", "10mm");
    signatureStyle.setAttribute("margin-left", "23mm");
    signatureStyle.setAttribute("margin-right", "10mm");
    signatureStyle.setAttribute("width", "100%");
}

//====================================================================//
// TEXTS
//====================================================================//
function setDocumentTexts(language) {
  var texts = {};
  if (language == 'it')
  {
    texts.param_isr_bank_name = 'Nome banca (solo con conto bancario, con conto postale lasciare vuoto)';
    texts.param_isr_bank_address = 'Indirizzo banca (solo con conto bancario, con conto postale lasciare vuoto)';
    texts.param_isr_bank_iban = 'IBAN banca (solo con conto bancario, con conto postale lasciare vuoto)';
    texts.param_isr_bank_id = 'Numero di adesione PVR banca (solo con conto bancario, con conto postale lasciare vuoto)';
    texts.param_isr_account = 'Conto PVR (o numero di cliente PVR)';
    texts.param_isr_payment_to_row1 = 'Campo PVR: Versamento per (riga 1)';
    texts.param_isr_payment_to_row2 = 'Campo PVR: Versamento per (riga 2)';
    texts.param_isr_payment_to_row3 = 'Campo PVR: Versamento per (riga 3)';
    texts.param_isr_position_scaleX = 'Scala orizzontale caratteri (default 1.0)';
    texts.param_isr_position_scaleY = 'Scala verticale caratteri (default 1.0)';
    texts.param_isr_position_dX = 'PVR X-Position mm (default 0)';
    texts.param_isr_position_dY = 'PVR Y-Position mm (default 0)';
    texts.title = 'Tassa sociale SEV 2017';
    texts.p1 = 'Caro socio,';
    texts.p2 = 'ci permettiamo di inviare la tassa sociale per il 2017 e in allegato la convocazione all\'assemblea ordinaria.';
    texts.p3 = 'Vi ricordiamo gli importi delle quote che sono i seguenti';
    texts.p4 = 'Prossimamente sul nostro sito www.sev-verzasca.ch avrete la possibilità di iscrivervi alla newsletter.';
    texts.p5 = 'Ringraziamo per il prezioso sostegno e salutiamo cordialmente.';
    texts.signature = 'SOCIETÀ ESCURSIONISTICA VERZASCHESE';
    texts.quote_text_1 = '● socio attivo';
    texts.quote_text_2 = '● socio fino 20 anni';
    texts.quote_text_3 = '● famiglia';
    texts.quote_1 = '20.00 CHF';
    texts.quote_2 = '10.00 CHF';
    texts.quote_3 = '30.00 CHF';
  }
  else
  {
    texts.param_isr_bank_name = 'Bank name (only with bank account, with postal account leave blank)';
    texts.param_isr_bank_address = 'Bank address (only with bank account, with postal account leave blank)';
    texts.param_isr_bank_iban = 'Bank IBAN (only with bank account, with postal account leave blank)';
    texts.param_isr_bank_id = 'Bank ISR subscriber number (only with bank account, with postal account leave blank)';
    texts.param_isr_account = 'ISR Account (or ISR customer number)';
    texts.param_isr_payment_to_row1 = 'Field ISR: Payment to (row 1)';
    texts.param_isr_payment_to_row2 = 'Field ISR: Payment to (row 2)';
    texts.param_isr_payment_to_row3 = 'Field ISR: Payment to (row 3)';
    texts.param_isr_position_scaleX = 'Character Horizontal Scaling (default 1.0)';
    texts.param_isr_position_scaleY = 'Character Vertical Scaling (default 1.0)';
    texts.param_isr_position_dX = 'ISR X-Position mm (default 0)';
    texts.param_isr_position_dY = 'ISR Y-Position mm (default 0)';
    texts.title = 'Tassa sociale SEV 2017';
    texts.p1 = 'Caro socio,';
    texts.p2 = 'ci permettiamo di inviare la tassa sociale per il 2017 e in allegato la convocazione all\'assemblea ordinaria.';
    texts.p3 = 'Vi ricordiamo gli importi delle quote che sono i seguenti';
    texts.p4 = 'Prossimamente sul nostro sito www.sev-verzasca.ch avrete la possibilità di iscrivervi alla newsletter.';
    texts.p5 = 'Ringraziamo per il prezioso sostegno e salutiamo cordialmente.';
    texts.signature = 'SOCIETÀ ESCURSIONISTICA VERZASCHESE';
    texts.quote_text_1 = '● socio attivo';
    texts.quote_text_2 = '● socio fino 20 anni';
    texts.quote_text_3 = '● famiglia';
    texts.quote_1 = '20.00 CHF';
    texts.quote_2 = '10.00 CHF';
    texts.quote_3 = '30.00 CHF';
  }
 
  return texts;
}

