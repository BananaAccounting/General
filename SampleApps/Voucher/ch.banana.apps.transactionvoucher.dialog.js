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
// @id = ch.banana.apps.transactionvoucher
// @api = 1.0
// @pubdate = 2017-04-18
// @publisher = Banana.ch SA
// @description = Transaction Voucher
// @task = app.command
// @doctype = *.*
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



/**
    The BananaApp creates a voucher of the transactions for the selected Doc number.
    A dialog is used to let the user insert all the required settings.
    The settings are then saved and used as default settings for the future times. 
*/



var param = {};

var dialog = Banana.Ui.createUi("ch.banana.apps.transactionvoucher.dialog.ui");

dialog.checkdata = function () {

    var valid = true;

    if (dialog.VoucherNumberLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Voucher No. text can't be empty");
        valid = false;
    }

    if (dialog.PaidToLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Paid To text can't be empty");
        valid = false;
    }

    if (dialog.DescriptionLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Description text can't be empty");
        valid = false;
    }

    if (dialog.PaidInComboBox.text == "Cheque" && dialog.ChequeNumberLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Cheque Number text can't be empty");
        valid = false;
    }

    if (dialog.PaymentReceivedByLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Payment Received By text can't be empty");
        valid = false;
    }

    if (dialog.PaidByLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Paid By text can't be empty");
        valid = false;
    }

    if (dialog.PreparedByLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Prepared By text can't be empty");
        valid = false;
    }

    if (dialog.VerifiedByLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Verified By text can't be empty");
        valid = false;
    }

    if (dialog.RecommendedByLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Recommended By text can't be empty");
        valid = false;
    }

    if (dialog.ApprovedByLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Approved By text can't be empty");
        valid = false;
    }

    if (dialog.ProjectNameLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Project Name text can't be empty");
        valid = false;
    }

    if (dialog.ProjectNumberLineEdit.text.length <= 0) {
        Banana.Ui.showInformation("Error", "Project Number text can't be empty");
        valid = false;
    }

    if (valid) {
        dialog.accept();
    }

}



/** Show the dialog and set the parameters */
function dialogExec() {

    // dialog.ChequeNumberLabel.enabled = false;
    // dialog.ChequeNumberLineEdit.enabled = false;
    

    // Read saved script settings
    initParam();

    // Read script settings and use them for the dialog
    if (Banana.document) {
        var data = Banana.document.scriptReadSettings();
        if (data.length > 0) {
            param = JSON.parse(data);
        
            //dialog.VoucherNumberLineEdit.text = param["voucherNumber"];
            dialog.PaidToLineEdit.text = param["paidTo"];
            dialog.DescriptionLineEdit.text = param["description"];
            
            // if (param["paidIn"] = "Cash") {
            //     dialog.PaidInComboBox.currentIndex = 0;
            // }
            // else if (param["paidIn"] = "Bank") {
            //     dialog.PaidInComboBox.currentIndex = 1;
            // }
            // else if (param["paidIn"] = "Cheque") {
            //     dialog.PaidInComboBox.currentIndex = 2;
            // }
            // else if (param["paidIn"] = "Non Cash or Bank") {
            //     dialog.PaidInComboBox.currentIndex = 3;
            // }

            //dialog.ChequeNumberLineEdit.text = param["chequeNumber"];
            

            dialog.PaymentReceivedByLineEdit.text = param["paymentReceivedBy"];
            dialog.PaidByLineEdit.text = param["paidBy"];
            dialog.PreparedByLineEdit.text = param["preparedBy"];
            dialog.VerifiedByLineEdit.text = param["verifiedBy"];
            dialog.RecommendedByLineEdit.text = param["recommendedBy"];
            dialog.ApprovedByLineEdit.text = param["approvedBy"];
            dialog.ProjectNameLineEdit.text = param["projectName"];
            dialog.ProjectNumberLineEdit.text = param["projectNumber"];
        }
    }

    // Pause and resume are used to change the cursor aspect
    Banana.application.progressBar.pause();
    var dlgResult = dialog.exec();
    Banana.application.progressBar.resume();

    if (dlgResult !== 1) {
        return false;
    }

    // Read all the fields of the dialog and save the values as parameters 
    param["voucherNumber"] = dialog.VoucherNumberLineEdit.text;
    param["paidTo"] = dialog.PaidToLineEdit.text;
    param["description"] = dialog.DescriptionLineEdit.text;
    
    // Read combobox and assign to each index a value
    var resPaidInComboBox = dialog.PaidInComboBox.currentIndex;
    if (resPaidInComboBox == 0) {
        param["paidIn"] = "Cash";
    } else if (resPaidInComboBox == 1) {
        param["paidIn"] = "Bank";
    } else if (resPaidInComboBox == 2) {
        param["paidIn"] = "Cheque";
    } else if (resPaidInComboBox == 3) {
        param["paidIn"] = "Non Cash or Bank";
    }

    param["chequeNumber"] = dialog.ChequeNumberLineEdit.text;
    param["paymentReceivedBy"] = dialog.PaymentReceivedByLineEdit.text;
    param["paidBy"] = dialog.PaidByLineEdit.text;
    param["preparedBy"] = dialog.PreparedByLineEdit.text;
    param["verifiedBy"] = dialog.VerifiedByLineEdit.text;
    param["recommendedBy"] = dialog.RecommendedByLineEdit.text;
    param["approvedBy"] = dialog.ApprovedByLineEdit.text;
    param["projectName"] = dialog.ProjectNameLineEdit.text;
    param["projectNumber"] = dialog.ProjectNumberLineEdit.text;

    // Save script settings
    var paramToString = JSON.stringify(param);
    var value = Banana.document.scriptSaveSettings(paramToString);

    return true;
}





/** Initialize dialog values with default values */
function initParam() {
    param = {
        "voucherNumber": "",
        "paidTo" : "",
        "description" : "",
        "paidIn" : "",
        "chequeNumber" : "",
        "paymentReceivedBy" : "",
        "paidBy" : "",
        "preparedBy" : "",
        "verifiedBy" : "",
        "recommendedBy" : "",
        "approvedBy" : "",
        "projectName" : "",
        "projectNumber" : "",
    };

    //If selected take the doc number from the table transactions and insert it in the dialog
    var transactions = Banana.document.table('Transactions');
    var docNumber = transactions.row(Banana.document.cursor.rowNr).value('Doc');
    if (docNumber) {
        param["voucherNumber"] = docNumber;
        dialog.VoucherNumberLineEdit.text = param["voucherNumber"];

        for (var i = 0; i < transactions.rowCount; i++) {
            var tRow = transactions.row(i);

            if (docNumber === tRow.value("Doc") && tRow.value("NewColumn1")) {
                param["paidIn"] = "Cheque";
                dialog.PaidInComboBox.currentIndex = 2;

                param["chequeNumber"] = tRow.value("NewColumn1");
                dialog.ChequeNumberLineEdit.text = tRow.value("NewColumn1");

                //Banana.console.warn(tRow.value("NewColumn1"));
            }
        }

    } 
}



/**
* Dialog's events declaration
*/
dialog.buttonBox.accepted.connect(dialog, "checkdata");
dialog.buttonBox.rejected.connect(dialog, "close");





// Main function
function exec(inData) {

    //Calls dialog
    var rtnDialog = true;
    rtnDialog = dialogExec();

    if (rtnDialog && Banana.document) {
        Banana.document.clearMessages();

        //Create the report
        var report = Banana.Report.newReport("Payment Voucher");

        //Function call to create the report
        createReport(report, param["voucherNumber"]);
                
        //Add the styles
        var stylesheet = createStyleSheet();
        Banana.Report.preview(report, stylesheet);
    }
}



function createReport(report, docNumber) {
    
    addFooter(report);

    //Table Journal
    var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);

    var date = new Date();
    var totDebit = "";
    var totCredit = "";
    
    // for (i = 0; i < journal.rowCount; i++) {
    //     var tRow = journal.row(i);

    //     //Take the row from the journal that has the same "Doc" as the one selectet by the user (cursor)
    //     if (docNumber && tRow.value('Doc') === docNumber) {
    //         date = tRow.value("Date");
    //     }
    // }

    report.addParagraph(" ", "");

    //Create the table that will be printed on the report
    var table = report.addTable("table");
    var col1 = table.addColumn("col1");
    var col2 = table.addColumn("col2");
    var col3 = table.addColumn("col3");
    var col4 = table.addColumn("col4");
    var col5 = table.addColumn("col5");
    var col6 = table.addColumn("col6");


    tableRow = table.addRow();
    tableRow.addCell("Transaction Voucher", "styleTitle heading1 alignCenter", 6);

    tableRow = table.addRow();
    var imageCell = tableRow.addCell("","",3);
    
    //If the table Documents contains an image we use it
    //If not, we use the image located in the script folder
    if (Banana.document.table("Documents") && Banana.document.table("Documents").findRowByValue("RowId", "transaction_voucher_image").value("Attachments")) {
        imageCell.addImage("documents:transaction_voucher_image", "3.5cm", "1cm");
    }
    else {
        imageCell.addImage("file:script/transaction_voucher_image.png", "3.5cm", "1cm");
    }

    var headerCell = tableRow.addCell("", "styleTitle borderBottom", 1);
    headerCell.addParagraph("Date",  "");
    headerCell.addParagraph(" ", "");
    headerCell.addParagraph("Voucher No.", "");

    var dateAndDocCell = tableRow.addCell("", "borderBottom", 2);
    dateAndDocCell.addParagraph(Banana.Converter.toLocaleDateFormat(date), "");
    dateAndDocCell.addParagraph(" ", "");
    dateAndDocCell.addParagraph(docNumber, "");

    tableRow = table.addRow();
    tableRow.addCell("Project Name", "styleTitle ", 2);
    tableRow.addCell(param["projectName"], "", 4);
    
    tableRow = table.addRow();
    tableRow.addCell("Project Number", "styleTitle ", 2);
    tableRow.addCell(param["projectNumber"], "", 4);

    tableRow = table.addRow();
    tableRow.addCell("Currency", "styleTitle ", 2);
    tableRow.addCell(Banana.document.info("AccountingDataBase","BasicCurrency"), "", 4);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 6);

    tableRow = table.addRow();
    tableRow.addCell("Paid to", "styleTitle ", 2);
    tableRow.addCell(param["paidTo"], "", 4);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 6);

    tableRow = table.addRow();
    tableRow.addCell("Description", "styleTitle ", 2);
    tableRow.addCell(param["description"], "", 4);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 6);

    tableRow = table.addRow();
    tableRow.addCell("Paid In", "styleTitle ", 2);
    tableRow.addCell(param["paidIn"], "", 4);

    tableRow = table.addRow();
    tableRow.addCell("Cheque No.", "styleTitle ", 2);
    if (param["paidIn"] === "Cheque") {
        tableRow.addCell(param["chequeNumber"], "", 4);
    } else { 
        tableRow.addCell("", "", 4);
    }

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 6);

    tableRow = table.addRow();
    tableRow.addCell("Payment Received by", "styleTitle", 2);
    tableRow.addCell(param["paymentReceivedBy"], "", 4);

    tableRow = table.addRow();
    tableRow.addCell("Paid by", "styleTitle", 2);
    tableRow.addCell(param["paidBy"], "", 4);

    // tableRow = table.addRow();
    // tableRow.addCell(" ", "", 6);
    report.addParagraph(" ", "");

    /***********************************************************************************************************/

    // Column header
    var table = report.addTable("table");
    var col1a = table.addColumn("col1a");
    var col2a = table.addColumn("col2a");
    var col3a = table.addColumn("col3a");
    var col4a = table.addColumn("col4a");
    var col5a = table.addColumn("col5a");
    var col6a = table.addColumn("col6a");
    var tableHeader = table.getHeader();
    tableRow = tableHeader.addRow();  

    //tableRow = table.addRow(); 
    tableRow.addCell("Date", "styleTitle alignCenter", 1);
    tableRow.addCell("Doc Original", "styleTitle alignCenter", 1);
    tableRow.addCell("Description", "styleTitle alignCenter", 1);
    tableRow.addCell("Account", "styleTitle alignCenter", 1);
    tableRow.addCell("Debit", "styleTitle alignCenter", 1);
    tableRow.addCell("Credit", "styleTitle alignCenter", 1);

    //Print transactions row
    for (i = 0; i < journal.rowCount; i++)
    {
        var tRow = journal.row(i);

        //Take the row from the journal that has the same "Doc" as the one selectet by the user (cursor)
        if (tRow.value('Doc') === docNumber)
        {
            tableRow = table.addRow();  
            tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('Date')), "", 1);
            tableRow.addCell(tRow.value('DocOriginal'), "", 1);
            tableRow.addCell(tRow.value('Description'), "", 1);
            tableRow.addCell(tRow.value('JAccount'), "", 1);
            var amount = Banana.SDecimal.abs(tRow.value('JAmount'));
            // Debit
            if (Banana.SDecimal.sign(tRow.value('JAmount')) > 0 ){
                totDebit = Banana.SDecimal.add(totDebit, tRow.value('JDebitAmount'), {'decimals':0});
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount), "alignRight", 1);
                tableRow.addCell("", "", 1);
            }
            // Credit
            else {
                totCredit = Banana.SDecimal.add(totCredit, tRow.value('JCreditAmount'), {'decimals':0});
                tableRow.addCell("", "", 1);
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount), "alignRight", 1);
            }

        }
    }

    //Total Line
    tableRow = table.addRow();
    tableRow.addCell("Total Amount","bold styleTitle", 2);
    tableRow.addCell("","", 2);
    //tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount), "bold alignRight", 1);
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totDebit), "bold alignRight", 1);
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totCredit), "bold alignRight", 1);

    tableRow = table.addRow();
    tableRow.addCell("In Words", "bold styleTitle", 2);
    tableRow.addCell(numberToEnglish(totDebit), "alignRight", 4);

    /***********************************************************************************************************/
    
    // tableRow = table.addRow();
    // tableRow.addCell(" ", "", 6);

    report.addParagraph(" ", "");
    var table = report.addTable("table");
    var col1b = table.addColumn("col1b");
    var col2b = table.addColumn("col2b");
    var col3b = table.addColumn("col3b");
    var col4b = table.addColumn("col4b");
    var col5b = table.addColumn("col5b");
    var col6b = table.addColumn("col6b");


    tableRow = table.addRow();
    tableRow.addCell("Name and Signature", "styleTitle alignCenter", 3);
    tableRow.addCell("Designation", "styleTitle", 3);

    tableRow = table.addRow();
    tableRow.addCell("Prepared by", "styleTitle", 1);
    tableRow.addCell(param["preparedBy"], "", 2);
    tableRow.addCell("", "", 3);

    tableRow = table.addRow();
    tableRow.addCell("Verified by", "styleTitle", 1);
    tableRow.addCell(param["verifiedBy"], "", 2);
    tableRow.addCell("", "", 3);

    tableRow = table.addRow();
    tableRow.addCell("Recommended by", "styleTitle", 1);
    tableRow.addCell(param["recommendedBy"], "", 2);
    tableRow.addCell("", "", 3);

    tableRow = table.addRow();
    tableRow.addCell("Approved by", "styleTitle", 1);
    tableRow.addCell(param["approvedBy"], "", 2);
    tableRow.addCell("", "", 3);

}







//Function that converts digits into words
function numberToEnglish( n ) {

    var string = n.toString(), units, tens, scales, start, end, chunks, chunksLen, chunk, ints, i, word, words, and = 'and';

    /* Is number zero? */
    if( parseInt( string ) === 0 ) {
        return 'zero';
    }

    /* Array of units as words */
    units = [ '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen' ];

    /* Array of tens as words */
    tens = [ '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety' ];

    /* Array of scales as words */
    scales = [ '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion' ];

    /* Split user arguemnt into 3 digit chunks from right to left */
    start = string.length;
    chunks = [];
    while( start > 0 ) {
        end = start;
        chunks.push( string.slice( ( start = Math.max( 0, start - 3 ) ), end ) );
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length;
    if( chunksLen > scales.length ) {
        return '';
    }

    /* Stringify each integer in each chunk */
    words = [];
    for( i = 0; i < chunksLen; i++ ) {

        chunk = parseInt( chunks[i] );

        if( chunk ) {

            /* Split chunk into array of individual integers */
            ints = chunks[i].split( '' ).reverse().map( parseFloat );

            /* If tens integer is 1, i.e. 10, then add 10 to units integer */
            if( ints[1] === 1 ) {
                ints[0] += 10;
            }

            /* Add scale word if chunk is not zero and array item exists */
            if( ( word = scales[i] ) ) {
                words.push( word );
            }

            /* Add unit word if array item exists */
            if( ( word = units[ ints[0] ] ) ) {
                words.push( word );
            }

            /* Add tens word if array item exists */
            if( ( word = tens[ ints[1] ] ) ) {
                words.push( word );
            }

            /* Add 'and' string after units or tens integer if: */
            if( ints[0] || ints[1]) {

                /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                if( ints[2] || ! i && chunksLen ) {
                    words.push( and );
                }
            }

            /* Add hundreds word if array item exists */
            if( ( word = units[ ints[2] ] ) ) {
                words.push( word + ' hundred' );
            }
        }
    }
    return words.reverse().join( ' ' ) + " only";
}





//This function adds a Footer to the report
function addFooter(report) {
   report.getFooter().addClass("footer");
   var versionLine = report.getFooter().addText("Banana Accounting - Page ", "description");
   report.getFooter().addFieldPageNr();
}



//The main purpose of this function is to create styles for the report print
function createStyleSheet() {
    //Create stylesheet
    var stylesheet = Banana.Report.newStyleSheet();
    
    //Set page layout
    var pageStyle = stylesheet.addStyle("@page");

    //Set the margins
    pageStyle.setAttribute("margin", "15mm 10mm 10mm 20mm");

    //Set the page landscape
    //pageStyle.setAttribute("size", "landscape");
    
    //Set the font
    stylesheet.addStyle("body", "font-family : Helvetica");
   
    style = stylesheet.addStyle(".footer");
    style.setAttribute("text-align", "right");
    style.setAttribute("font-size", "8px");
    style.setAttribute("font-family", "Courier New");

    style = stylesheet.addStyle(".heading1");
    style.setAttribute("font-size", "14px");
    style.setAttribute("font-weight", "bold");

    style = stylesheet.addStyle(".img");
    style.setAttribute("height", "40");
    style.setAttribute("width", "120");
    
    //Set Table styles
    style = stylesheet.addStyle("table");
    style.setAttribute("width", "100%");
    style.setAttribute("font-size", "8px");
    stylesheet.addStyle("table.table td", "border: thin solid black; padding-bottom: 2px; padding-top: 5px");

    stylesheet.addStyle(".col1", "width:15%");
    stylesheet.addStyle(".col2", "width:10%");
    stylesheet.addStyle(".col3", "width:40%");
    stylesheet.addStyle(".col4", "width:10%");
    stylesheet.addStyle(".col5", "width:10%");
    stylesheet.addStyle(".col6", "width:10%");

    stylesheet.addStyle(".col1a", "width:15%");
    stylesheet.addStyle(".col2a", "width:10%");
    stylesheet.addStyle(".col3a", "width:40%");
    stylesheet.addStyle(".col4a", "width:10%");
    stylesheet.addStyle(".col5a", "width:10%");
    stylesheet.addStyle(".col6a", "width:10%");

    stylesheet.addStyle(".col1b", "width:15%");
    stylesheet.addStyle(".col2b", "width:10%");
    stylesheet.addStyle(".col3b", "width:40%");
    stylesheet.addStyle(".col4b", "width:10%");
    stylesheet.addStyle(".col5b", "width:10%");
    stylesheet.addStyle(".col6b", "width:10%");

    style = stylesheet.addStyle(".styleTableHeader");
    style.setAttribute("background-color", "#464e7e"); 
    style.setAttribute("border-bottom", "1px double black");
    style.setAttribute("color", "#fff");

    style = stylesheet.addStyle(".bold");
    style.setAttribute("font-weight", "bold");

    style = stylesheet.addStyle(".alignRight");
    style.setAttribute("text-align", "right");

    style = stylesheet.addStyle(".alignCenter");
    style.setAttribute("text-align", "center");

    style = stylesheet.addStyle(".styleTitle");
    style.setAttribute("font-weight", "bold");
    style.setAttribute("background-color", "#eeeeee");
    //style.setAttribute("padding-bottom", "5px");

    style = stylesheet.addStyle(".bordersLeftRight");
    style.setAttribute("border-left", "thin solid black");
    style.setAttribute("border-right", "thin solid black");
    style.setAttribute("padding", "2px");
    
    return stylesheet;
}


