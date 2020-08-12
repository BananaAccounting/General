// Copyright [2020] [Banana.ch SA - Lugano Switzerland]
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
// @id = DocumentChangeDate.js
// @api = 1.0
// @pubdate = 2020.08.12
// @publisher = Banana.ch SA
// @description = Modify ac2 file using document changes
// @task = app.command
// @doctype = *.*
// @timeout = -1

//ho diviso su 2 documenti perche ce un bug da risolvere.
function exec(inData, options) {

    var param = initParam();
    var ischange = false;

    var documentChange = { "format": "documentChange", "error": "", "data": [] };

    if (param.accountingopenyear.length > 0) {
        var jsonDoc = setfileInfo("AccountingDataBase", "OpeningDate", param.accountingopenyear);
        documentChange["data"].push(jsonDoc);
        ischange = true;
    }

    if (param.accountingcloseyear.length > 0) {
        jsonDoc = setfileInfo("AccountingDataBase", "ClosureDate", param.accountingcloseyear);
        documentChange["data"].push(jsonDoc);
        ischange = true;
    }

    if (param.accountingheaderleft.length > 0) {
        jsonDoc = setfileInfo("Base", "HeaderLeft", param.accountingheaderleft);
        documentChange["data"].push(jsonDoc);
        ischange = true;
    }

    if (param.accountingheaderright.length > 0) {
        jsonDoc = setfileInfo("Base", "HeaderRight", param.accountingheaderright);
        documentChange["data"].push(jsonDoc);
        ischange = true;
    }

    jsonDoc = setTransactionsDate(param);
    if (typeof(jsonDoc) == "object") {
        documentChange["data"].push(jsonDoc);
        ischange = true;
    }


    jsonDoc = setBudgetDate(param);
    if (typeof(jsonDoc) == "object") {
        documentChange["data"].push(jsonDoc);
        ischange = true;
    }
    if (ischange) {

        return documentChange;
    }
}

function initParam() {
    var param = {};
    param.accountingyear = "";
    param.newaccountingyear = "";
    param.accountingopenyear = "";
    param.accountingcloseyear = "";
    param.accountingheaderleft = "";
    param.accountingheaderright = "";

    //anno corrente
    var currentDate = new Date();
    var currentyear = currentDate.getFullYear();
    param.newaccountingyear = currentyear;

    //nuova data d'apertura del documento
    param.accountingopenyear = currentyear + "0101";

    //nuova data di chiusura del documento
    param.accountingcloseyear = currentyear + "1231";


    //controllo gli header

    var OpeningDate = Banana.document.info("AccountingDataBase", "OpeningDate");
    if (OpeningDate && OpeningDate.length > 4) {
        param.accountingyear = OpeningDate.toString().substr(0, 4);
        var Headerleft = Banana.document.info("Base", "HeaderLeft");
        if (Headerleft && Headerleft.indexOf(param.accountingyear) >= 0) {
            Headerleft = Headerleft.replace(param.accountingyear, currentyear);
            param.accountingheaderleft = Headerleft;

        }
        var Headerright = Banana.document.info("Base", "HeaderRight");
        if (Headerright && Headerright.indexOf(param.accountingyear) >= 0) {
            Headerright = Headerright.replace(param.accountingyear, currentyear);
            param.accountingheaderright = Headerright;
        }

    } else {
        param.accountingopenyear = "";
        param.accountingcloseyear = "";

    }

    return param;
}

function getCurrentDate() {
    var d = new Date();
    var datestring = d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2);
    return Banana.Converter.toInternalDateFormat(datestring, "yyyymmdd");
}

function getCurrentTime() {
    var d = new Date();
    var timestring = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return Banana.Converter.toInternalTimeFormat(timestring, "hh:mm");
}

function initDocument() {
    var jsonDoc = {};
    jsonDoc.document = {};
    jsonDoc.document.fileVersion = "1.0.0";
    jsonDoc.document.dataUnits = [];
    jsonDoc.creator = {};
    jsonDoc.creator.executionDate = getCurrentDate();
    jsonDoc.creator.executionTime = getCurrentTime();
    jsonDoc.creator.name = Banana.script.getParamValue('id');
    jsonDoc.creator.version = "1.0";
    return jsonDoc;
}

function setfileInfo(key1, key2, value) {

    //row operation
    var row = {};
    row.operation = {};
    row.operation.name = "modify";

    row.fields = {};
    row.fields["SectionXml"] = key1;
    row.fields["IdXml"] = key2;
    row.fields["ValueXml"] = value;

    var rows = [];
    rows.push(row);

    //table
    var dataUnitTransactions = {};
    dataUnitTransactions.nameXml = "FileInfo";
    dataUnitTransactions.data = {};
    dataUnitTransactions.data.rowLists = [];
    dataUnitTransactions.data.rowLists.push({ "rows": rows });

    //document
    var jsonDoc = initDocument();
    jsonDoc.document.dataUnits.push(dataUnitTransactions);

    return jsonDoc;

}

function setTransactionsDate(param) {

    var table = Banana.document.table("Transactions");
    if (!table) {
        return;
    }
    var rows = [];

    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i)
        var TransYear = tRow.value('Date');
        if (TransYear && TransYear.length > 4) {
            TransYear = param.newaccountingyear.toString() + TransYear.substr(4);

            //row operation
            var row = {};
            row.operation = {};
            row.operation.name = "modify";
            row.operation.sequence = i.toString();

            row.fields = {};
            row.fields["Date"] = TransYear;


            rows.push(row);
        }
    }
    if (rows.length <= 0)
        return;


    //table
    var dataUnitTransactions = {};
    dataUnitTransactions.nameXml = "Transactions";
    dataUnitTransactions.data = {};
    dataUnitTransactions.data.rowLists = [];
    dataUnitTransactions.data.rowLists.push({ "rows": rows });

    //document
    var jsonDoc = initDocument();
    jsonDoc.document.dataUnits.push(dataUnitTransactions);

    return jsonDoc;

}

function setBudgetDate(param) {

    var table = Banana.document.table("Budget");
    if (!table) {
        return;
    }
    var rows = [];

    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i)
        var TransYear = tRow.value('Date');
        if (TransYear && TransYear.length > 4) {
            TransYear = param.newaccountingyear.toString() + TransYear.substr(4);

            //row operation
            var row = {};
            row.operation = {};
            row.operation.name = "modify";
            row.operation.sequence = i.toString();

            row.fields = {};
            row.fields["Date"] = TransYear;


            rows.push(row);
        }
    }
    if (rows.length <= 0)
        return;


    //table
    var dataUnitTransactions = {};
    dataUnitTransactions.nameXml = "Budget";
    dataUnitTransactions.data = {};
    dataUnitTransactions.data.rowLists = [];
    dataUnitTransactions.data.rowLists.push({ "rows": rows });

    //document
    var jsonDoc = initDocument();
    jsonDoc.document.dataUnits.push(dataUnitTransactions);

    return jsonDoc;

}