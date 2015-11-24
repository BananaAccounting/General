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
// @id = ch.banana.addon.voucher
// @api = 1.0
// @pubdate = 2015-11-23
// @publisher = Banana.ch SA
// @description = Report Voucher
// @task = app.command
// @doctype = 100.*;110.*
// @outputformat = none
// @inputdatasource = none
// @timeout = -1

var param = {};
param = {
    "systemPaymentVoucherNo" : "00001",
    "projectName" : "Vietnam Disaster Risk Reduction CA MAV",
    "projectNumber" : "445435",
    "paidTo" : "Virasat Nguyen",
    "description" : "R Nguyen project monitoring expenses Ca Mau 01-03 Jan 2014",
    "paidIn" : "",
    "chequeNumber" : "",
    "preparedBy" : "Person 1",
    "verifiedBy" : "Person 2",
    "approvedBy" : "Person 3"
}




function exec(string) {

    //Create the report
    var report = Banana.Report.newReport("Payment Voucher");
    
    createReport(report);

    //Add the styles
    var stylesheet = createStyleSheet();
    Banana.Report.preview(report, stylesheet);
}



function createReport(report) {
    
    addFooter(report);

    //Table Transactions
    var transactions = Banana.document.table('Transactions');

    //Table Journal
    var journal = Banana.document.journal(Banana.document.ORIGINTYPE_CURRENT, Banana.document.ACCOUNTTYPE_NORMAL);

    //Get the Doc value selected by the mouse cursor of the table transactions
    var docNumber = transactions.row(Banana.document.cursor.rowNr).value('Doc');



    var date = "";
    var doc = ""; 
    var desc = "";
    var totDebit = "";
    var totCredit = "";

    for (i = 0; i < journal.rowCount; i++)
    {
        var tRow = journal.row(i);

        //Take the row from the journal that has the same "Doc" as the one selectet by the user (cursor)
        if (tRow.value('Doc') === docNumber)
        {
            date = tRow.value("Date");
            doc = tRow.value("Doc");
            desc = tRow.value("Description");



            var amount = Banana.SDecimal.abs(tRow.value('JAmount'));
            // Debit
            if (Banana.SDecimal.sign(tRow.value('JAmount')) > 0 ){
                totDebit = Banana.SDecimal.add(totDebit, amount, {'decimals':0});
            }
            // Credit
            else {
                totCredit = Banana.SDecimal.add(totCredit, amount, {'decimals':0});
            }
        }
    }




    //report.addImage("SwissRedCross.jpg", "img alignCenter");
    report.addParagraph(" ", "");

    /**
        TABLE 1 
    **/

    //Create the table that will be printed on the report
    var table = report.addTable("table");
    tableRow = table.addRow();
    tableRow.addCell("Payment Voucher", "styleTitle heading1 alignCenter", 4);

    report.addParagraph(" ", "bordersLeftRight");

    //report.addImage("SwissRedCross.jpg", "img");


    /**
        TABLE 2
    **/

    var table = report.addTable("table");

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 2);
    tableRow.addCell("Date", "styleTitle alignRight", 1);
    tableRow.addCell(Banana.Converter.toLocaleDateFormat(date), "", 1);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 2);
    tableRow.addCell("Voucher Number", "styleTitle alignRight", 1);
    tableRow.addCell(docNumber, "", 1);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 2);
    tableRow.addCell("System Payment Voucer Number", "styleTitle alignRight", 1);
    tableRow.addCell(param.systemPaymentVoucherNo, "", 1);

    tableRow = table.addRow();
    tableRow.addCell("Project Name", "styleTitle alignRight", 1);
    tableRow.addCell(param.projectName, "", 1);
    tableRow.addCell(" ", "", 1);
    tableRow.addCell(" ", "", 1);

    tableRow = table.addRow();
    tableRow.addCell("Project Number", "styleTitle alignRight", 1);
    tableRow.addCell(param.projectNumber, "", 1);
    tableRow.addCell(" ", "", 1);
    tableRow.addCell(" ", "", 1);

    tableRow = table.addRow();
    tableRow.addCell("Currency", "styleTitle alignRight", 2);
    tableRow.addCell(Banana.document.info("AccountingDataBase","BasicCurrency"), "", 2);

    report.addParagraph(" ", "bordersLeftRight");



    /**
        TABLE 3
    **/

    var table = report.addTable("table");

    tableRow = table.addRow();
    tableRow.addCell("Paid to", "styleTitle alignRight", 1);
    tableRow.addCell(param.paidTo, "", 1);
    //tableRow.addCell(" ", "", 1);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);

    tableRow = table.addRow();
    tableRow.addCell("Description", "styleTitle alignRight", 1);
    tableRow.addCell(param.description, "", 1);
    //tableRow.addCell(" ", "", 1);


    report.addParagraph(" ", "bordersLeftRight");



    /**
        TABLE 4
    **/

    var table = report.addTable("table");

    // tableRow = table.addRow();
    // tableRow.addCell("Amount", "styleTitle", 1);
    // tableRow.addCell("In Figure", "styleTitle", 1);
    // tableRow.addCell("1260", "", 1);

    // tableRow = table.addRow();
    // tableRow.addCell("Amount", "styleTitle", 1);
    // tableRow.addCell("In Words", "styleTitle", 1);
    // tableRow.addCell(numberToEnglish("1260"), "", 1);



    tableRow = table.addRow();
    var amountCell = tableRow.addCell("", "styleTitle alignRight", 1);
    amountCell.addParagraph("Amount");
    amountCell.addParagraph(" ");

    var amountCell1 = tableRow.addCell("", "styleTitle", 1);
    amountCell1.addParagraph("In Figure", "");
    amountCell1.addParagraph("In Words", "");

    var amountCell2 = tableRow.addCell("", "", 1);
    amountCell2.addParagraph(Banana.Converter.toLocaleNumberFormat(totDebit), "");
    amountCell2.addParagraph(numberToEnglish(totDebit), "");

    report.addParagraph(" ", "bordersLeftRight");



    /**
        TABLE 5
    **/

    var table = report.addTable("table");

    tableRow = table.addRow();
    tableRow.addCell("Paid In", "styleTitle alignRight", 1);
    tableRow.addCell("Cash", "styleTitle", 1);
    tableRow.addCell(" ", "", 1);
    tableRow.addCell("Cheque", "styleTitle", 1);
    tableRow.addCell(" ", "", 1);
    tableRow.addCell("Bank Transfer", "styleTitle", 1);
    tableRow.addCell(" ", "", 1);

    tableRow = table.addRow();
    tableRow.addCell("If paid by cheque write down the cheque No.", "styleTitle alignRight", 2);
    tableRow.addCell(param.chequeNumber, "", 5);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 7);

    tableRow = table.addRow();
    tableRow.addCell("Payment Received by", "styleTitle", 2);
    tableRow.addCell("Paid by", "styleTitle", 5);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 2);
    tableRow.addCell(" ", "", 5);

    report.addParagraph(" ", "bordersLeftRight");



    /***********************************************************************************************************/
    /**
        TABLE 6
    **/

    var table = report.addTable("table");
    
    tableRow = table.addRow();
    tableRow.addCell("Swiss Red Cross - Accounting use only", "styleTitle alignCenter", 7);

    //var totDebit = "";
    //var totCredit = "";

    // Column header
    tableRow = table.addRow(); 
    tableRow.addCell("Date", "styleTitle alignCenter", 1);
    tableRow.addCell("Doc", "styleTitle alignCenter", 1);
    tableRow.addCell("Transaction Description", "styleTitle alignCenter", 1);
    tableRow.addCell("Account", "styleTitle alignCenter", 1);
    tableRow.addCell("Account Description", "styleTitle alignCenter", 1);
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
            tableRow.addCell(tRow.value('Doc'), "", 1);
            tableRow.addCell(tRow.value('Description'), "", 1);
            tableRow.addCell(tRow.value('JAccount'), "", 1);
            tableRow.addCell(tRow.value('JAccountDescription'), "", 1);
            var amount = Banana.SDecimal.abs(tRow.value('JAmount'));
            // Debit
            if (Banana.SDecimal.sign(tRow.value('JAmount')) > 0 ){
                //totDebit = Banana.SDecimal.add( totDebit, amount);
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount), "alignRight", 1);
                tableRow.addCell("", "", 1);
            }
            // Credit
            else {
                //totCredit = Banana.SDecimal.add( totCredit, amount);
                tableRow.addCell("", "", 1);
                tableRow.addCell(Banana.Converter.toLocaleNumberFormat(amount), "alignRight", 1);
            }

        }
    }

    //Total Line
    tableRow = table.addRow();
    tableRow.addCell("Total Amount","bold styleTitle alignRight", 4);
    tableRow.addCell();
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totDebit), "bold alignRight");
    tableRow.addCell(Banana.Converter.toLocaleNumberFormat(totCredit), "bold alignRight");























    report.addParagraph(" ", "bordersLeftRight");



    /***********************************************************************************************************/
    

    /**
        TABLE 7
    **/

    var table = report.addTable("table");

    tableRow = table.addRow();

    tableRow.addCell("Name and Signature", "styleTitle alignCenter", 2);
    tableRow.addCell("Designation", "styleTitle", 1);

    tableRow = table.addRow();
    tableRow.addCell("Prepared by", "styleTitle alignRight", 1);
    tableRow.addCell(param.preparedBy + "                                                                                  ", "", 1);
    tableRow.addCell("Cashier/Office Assistant", "", 1);

    tableRow = table.addRow();
    tableRow.addCell("Verified by", "styleTitle alignRight", 1);
    tableRow.addCell(param.verifiedBy + "                                                                                  ", "", 1);
    tableRow.addCell("Finance Officer", "", 1);

    tableRow = table.addRow();
    tableRow.addCell("Approved by", "styleTitle alignRight", 1);
    tableRow.addCell(param.approvedBy + "                                                                                  ", "", 1);
    tableRow.addCell("Head of SRC Vietnam", "", 1);




    //report.addParagraph(numberToEnglish( "25113" ));
    //report.addPageBreak();
}





function getDocList() {
    var str = [];
    for (var i = 0; i < Banana.document.table('Transactions').rowCount; i++) {
        var tRow = Banana.document.table('Transactions').row(i);
        if (tRow.value("Doc")) {
            str.push(tRow.value("Doc"));
        }
    }

    //Removing duplicates
    for (var i = 0; i < str.length; i++) {
        for (var x = i+1; x < str.length; x++) {
            if (str[x] === str[i]) {
                str.splice(x,1);
                --x;
            }
        }
    }

    return str;
}








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
            if( ints[0] || ints[1] ) {

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

    return words.reverse().join( ' ' );

}




//This function adds a Footer to the report
function addFooter(report) {
   report.getFooter().addClass("footer");
   var versionLine = report.getFooter().addText("Banana Accounting", "description");
}



//The main purpose of this function is to create styles for the report print
function createStyleSheet() {
    //Create stylesheet
    var stylesheet = Banana.Report.newStyleSheet();
    
    //Set page layout
    var pageStyle = stylesheet.addStyle("@page");

    //Set the margins
    pageStyle.setAttribute("margin", "15mm 15mm 10mm 20mm");

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