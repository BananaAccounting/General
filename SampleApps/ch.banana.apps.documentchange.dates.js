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
// @id = ch.banana.apps.documentchange.dates.js
// @api = 1.0
// @pubdate = 2020-08-31
// @publisher = Banana.ch SA
// @description = Update Dates in the accounting file
// @task = app.command
// @doctype = 100.*;110.*;130.*

function exec(inData, options) {

    var param = initParam(Banana.document);
     var ischange = false;

    var documentChange = { "format": "documentChange", "error": "", "data": [] };

    if (param.newaccountingopeningdate.length > 0) {
        var jsonDoc = setfileInfo("AccountingDataBase", "OpeningDate", param.newaccountingopeningdate);
        documentChange["data"].push(jsonDoc);
        ischange = true;
    }

    if (param.newaccountingclosuredate.length > 0) {
        jsonDoc = setfileInfo("AccountingDataBase", "ClosureDate", param.newaccountingclosuredate);
        documentChange["data"].push(jsonDoc);
        ischange = true;
    }

    if (param.newaccountingheaderleft.length > 0) {
        jsonDoc = setfileInfo("Base", "HeaderLeft", param.newaccountingheaderleft);
        documentChange["data"].push(jsonDoc);
        ischange = true;
    }

    if (param.newaccountingheaderright.length > 0) {
        jsonDoc = setfileInfo("Base", "HeaderRight", param.newaccountingheaderright);
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

function initParam(document, isTest) {
    var param = {};
    param.differenceyear = 0;
    param.accountingyear = "";
    param.newaccountingyear = new Date().getFullYear();
    if (isTest)
        param.newaccountingyear = "2020";
    param.newaccountingopeningdate = "";
    param.newaccountingclosuredate = "";
    param.newaccountingheaderleft = "";
    param.newaccountingheaderright = "";


    var OpeningDate = document.info("AccountingDataBase", "OpeningDate");
    if (OpeningDate && OpeningDate.length > 4) {
        param.accountingyear = OpeningDate.toString().substr(0, 4);
        var Headerleft = document.info("Base", "HeaderLeft");
        if (Headerleft && Headerleft.indexOf(param.accountingyear) >= 0) {
            Headerleft = Headerleft.replace(param.accountingyear, param.newaccountingyear);
            param.newaccountingheaderleft = Headerleft;

        }
        var Headerright = document.info("Base", "HeaderRight");
        if (Headerright && Headerright.indexOf(param.accountingyear) >= 0) {
            Headerright = Headerright.replace(param.accountingyear, param.newaccountingyear);
            param.newaccountingheaderright = Headerright;
        }

        var currentYearint = parseInt(param.newaccountingyear);
        var fileYearint = parseInt(param.accountingyear);

        param.differenceyear = Banana.SDecimal.subtract(currentYearint, fileYearint);

        param.newaccountingopeningdate = changeYearInDate(param.differenceyear, OpeningDate);
        var ClosureDate = document.info("AccountingDataBase", "ClosureDate");
        param.newaccountingclosuredate = changeYearInDate(param.differenceyear, ClosureDate);


    }
    return param;
}

function changeYearInDate(differenceyear, OpeningClosureDate) {
    if (OpeningClosureDate && OpeningClosureDate.length > 4) {
        var Year = OpeningClosureDate.toString().substr(0, 4);
        var newyear = Banana.SDecimal.add(parseInt(Year), parseInt(differenceyear));
        var changedDate = newyear.toString() + OpeningClosureDate.toString().substr(4);
        changedDate = changedDate.replace(/-/g, "");

        return changedDate;

    }
    return "";

}


function getNewRowDate(currentDate, param) {
    if (!currentDate || currentDate.length < 4)
        return "";
    if (param.differenceyear == 0)
        return "";
    var currentyear = currentDate.substr(0, 4);
    var newyear = parseInt(currentyear) + parseInt(param.differenceyear);
    var newDate = newyear.toString() + currentDate.substr(4);

    return newDate;
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
        var TransDate = tRow.value('Date');
        TransDate = getNewRowDate(TransDate, param);
        if (TransDate.length <= 0) {

            continue;
        }

        //row operation
        var row = {};
        row.operation = {};
        row.operation.name = "modify";
        row.operation.sequence = i.toString();

        row.fields = {};
        row.fields["Date"] = TransDate;


        rows.push(row);
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
        var tRow1 = table.row(i)
        var TransDate = tRow1.value('Date');
        var TransDateEnd = tRow1.value('DateEnd');
        TransDate = getNewRowDate(TransDate, param);
        TransDateEnd = getNewRowDate(TransDateEnd, param);
        if (TransDate.length <= 0) {

            continue;
        }

        //row operation
        var row = {};
        row.operation = {};
        row.operation.name = "modify";
        row.operation.sequence = i.toString();

        row.fields = {};
        row.fields["Date"] = TransDate;
        row.fields["DateEnd"] = TransDateEnd;


        rows.push(row);
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