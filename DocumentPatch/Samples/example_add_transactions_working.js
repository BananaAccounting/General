// @id = ch.banana.test.add.documentPatch.ac2
// @api = 1.0
// @pubdate = 2019-10-09
// @publisher = Banana.ch SA
// @description = complete operation using JSON Patch
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @includejs = DocumentPatch.js

function exec(inData) {
    if (!Banana.document)
        return "@Cancel";

    var docPatch = new DocumentPatch("Vendite giornaliere");
    var row = {
        "Note": "Verificato Lorenzo"
    };
    var rows = [
        {
            "Date": "2020-02-23",
            "Description": "Vendita prodotti",
            "Amount": "350.00",
        },
        {
            "Date": "2020-02-23",
            "Description": "Acquisto prodotti",
            "Amount": "120.00",
        },
    ];
    var rows2 = [
        {
            "Date": "2020-02-23",
            "Description": "Vendita prodotti",
            "Amount": "350.00",
        },
        {
            "Date": "2020-02-23",
            "Description": "CIAO",
            "Amount": "120.00",
        },
    ];
    var rows3 = {
        "Date": "2020-02-23",
        "Description": "Hello World",
        "Amount": "350.00",
    };

    var transactions = docPatch.table("transactions").rows(); // chiamimamo il metodo rows e non row
    transactions.append(rows2);
    transactions.insert(8, rows);  // il parametro rowNr lo mettiamo al primo posto, NB.: rowNr va inserita come stringa nel docPatch!!!
    //

    transactions.newPatchBlock("Correzione vendite giorno precedente");
    //
    transactions.move(2, 15); // aggiungiamo il parametro rowCount opzionale, default = 1

    transactions.delete(16, 3); // aggiungiamo il parametro rowCount opzionale, default = 1
    // transactions.replace(10, row); // questa operazione è su una singola riga
    // transactions.modify(15, row);   // questa operazione è su una singola riga

    // docPatch.appendRow("Transactions", row);
    // docPatch.insertRow("Transactions", rowNr, row);
    // docPatch.moveRow("Transactions", rowNrFrom, rowNrTo, rowCount);
    // docPatch.deleteRow("Transactions", rowNrFrom, rowCount);
    // docPatch.replaceRow("Transactions", rowNr, row);
    // docPatch.modifyRow("Transactions", rowNr, row);

    // // Nuovo metodo: newPatchBlock
    // // Tramite newPatchBlock possiamo creare un nuovo oggetto/blocco di
    // // operazioni in  docPatch.data[] dandone una descrizione così da suddividere le
    // // operazioni in blocchi contestuali comprensibili all'utente che ne deve verificare
    // // il contenuto. NB.: in Banana quando viene applicato un docPatch, ogni blocco viene aggiunto
    // // e verificato separatamente, le verifiche e il ricalcolo della contabilità avviene dopo
    // // l'applicazione di ogni blocco di modifiche.
    // docPatch.newPatchBlock("Correzione vendite giorno precedente");
    // docPatch.appendRows("Transactions", rows, rowNr);
    //
    //
    // // Operazioni sulle colonne
    //
    var column = {
        "definition": {
            "lengthMax": 1024,
            "type": "text"
        },
        "description": "Customer reference",
        "header1": "CRef",
        "id": "CustomerReference",
        "name": "CustomerReference",
        "nameXml": "CustomerReference",
        "visibile": true,
        "width": 500,
        "wrap": true
    };
    var column2 = {
        "definition": {
            "lengthMax": 1024,
            "type": "text"
        },
        "description": "Colonna personalizzata",
        "header1": "Colonnapersonalizzata",
        "id": "Colonnapersonalizzata",
        "name": "Colonnapersonalizzata",
        "nameXml": "Colonnapersonalizzata",
        "visibile": true,
        "width": 500,
        "wrap": true
    };
    //
    // // Ogni operazione aggiunge un nuovo oggetto in docPatch.data[].document.dataUnit[]
    // var transactionsColumns = docPatch.table("transactions").columns();  // chiamiamao il metodo columns e non column
    // transactionsColumns.insert(16, column);
    // transactionsColumns.insert(0, column2);
    // transactionsColumns.move(16, "Amount"); //DOES NOT WORK CHECK BANANA VERSION
    // transactionsColumns.delete("Colonnapersonalizzata");
    // transactionsColumns.replace(columnNr, column);
    // transactionsColumns.modify("Transactions", column, columnNr);

    // Giusto per debug
    Banana.Ui.showText("json object: " + docPatch.toJson());
    return docPatch.getJson();
}

class DocumentPatch{
    constructor(action) {
        this.action = action;
        this.baseData = {"format": "documentPatch", "error": "", "data": []};
        this.jsonDoc = initDocument(this.action);
    }
    table(xmlTableName){
        return new Table(xmlTableName, this.jsonDoc, this.baseData, this.action);
    }
    appendRow(xmlTableName, newRow){
        var table = this.table(xmlTableName);
        var row = table.rows();
        row.append(newRow);
    }
    insertRow(xmlTableName, rowNr, newRow){
        var table = this.table(xmlTableName);
        var row = table.rows();
        row.insert(rowNr, newRow);
    }
    moveRow(xmlTableName, rowNrFrom, rowNrTo, rowCount){
        var table = this.table(xmlTableName);
        var row = table.rows();
        row.move(rowNrFrom, rowNrTo, rowCount);
    }
    deleteRow(xmlTableName, rowNr, rowCount){
        var table = this.table(xmlTableName);
        var row = table.rows();
        row.delete(rowNr, rowCount);
    }
    replaceRow(xmlTableName, rowNr, newRow){
        var table = this.table(xmlTableName);
        var row = table.rows();
        row.replace(rowNr, newRow);
    }
    modifyRow(xmlTableName, rowNr, newRow){
        var table = this.table(xmlTableName);
        var row = table.rows();
        row.modify(rowNr, newRow);
    }
    toJson(){
        return JSON.stringify(this.baseData, null, 3);
    }
    getJson(){
        return this.baseData;
    }
}

class Table extends DocumentPatch{
    constructor(xmlTableName, jsonDoc, data, action) {
        super();
        this.xmlTableName = xmlTableName;
        this.jsonDoc = jsonDoc;
        this.dataUnitTransactions = [];
        this.action = action;
        var obj = {
            "id": this.xmlTableName,
            "nameXml": this.xmlTableName,
            "nid": 103,
            "data": {}
        };
        this.dataUnitTransactions.push(obj);
        this.data = data;
        this.listIndexesOperations = new Map();
    }
    rows(){
        return new Row(this.xmlTableName, this.jsonDoc, this.dataUnitTransactions, this.data, this.listIndexesOperations, this.action);
    }
    columns(){
        return new Column(this.jsonDoc, this.dataUnitTransactions, this.data, this.listIndexesOperations, this.blocks);
    }
}

class Row extends Table {
    constructor(xmlTableName, jsonDoc, dataUnitTransactions, data, listIndexesOperations, action) {
        super();
        this.jsonDoc = jsonDoc;
        this.dataUnitTransactions = dataUnitTransactions;
        this.dataUnitTransactions[this.dataUnitTransactions.length-1].data.rowLists = [];
        var obj = {"rows": []};
        this.dataUnitTransactions[this.dataUnitTransactions.length-1].data.rowLists.push(obj);
        this.data = data;
        this.listIndexesOperations = listIndexesOperations;
        this.action = action;
        this.newBlock = false;
    }
    append(newRow){
        var rows = [];
        var fields, operation, obj;
        if (Array.isArray(newRow)){
            for (var i = 0; i < newRow.length; i++){
                fields = newRow[i];
                operation = {};
                operation.name = "add";
                obj = {};
                obj.fields = fields;
                obj.operation = operation;
                rows.push(obj);
            }
        }else{
            fields = newRow;
            operation = {};
            operation.name = "add";
            obj = {};
            obj.fields = fields;
            obj.operation = operation;
            rows.push(obj);
        }
        this.pushChanges(rows);
    }
    insert(rowNr, newRow){
        var rows = [];
        var fields, operation, obj;
        if (Array.isArray(newRow)){
            for (var i = 0; i < newRow.length; i++){
                fields = newRow[i];
                operation = {};
                operation.name = "add";
                operation.sequence = this.computeSequence(rowNr);
                obj = {};
                obj.fields = fields;
                obj.operation = operation;
                rows.push(obj);
            }
        }else{
            fields = newRow;
            operation = {};
            operation.name = "add";
            operation.sequence = this.computeSequence(rowNr);
            obj = {};
            obj.fields = fields;
            obj.operation = operation;
            rows.push(obj);
        }
        this.pushChanges(rows);
    }
    delete(rowNr, rowCount){
        var rows = [];
        var operation, obj;
        if (rowCount != null){
            for (var i = 0; i < rowCount; i++){
                operation = {};
                operation.name = "delete";
                operation.sequence = rowNr.toString();
                obj = {};
                obj.operation = operation;
                rows.push(obj);
            }
        }else{
            operation = {};
            operation.name = "delete";
            operation.sequence = rowNr.toString();
            obj = {};
            obj.operation = operation;
            rows.push(obj);
        }

        this.pushChanges(rows)
    }
    modify(rowNr, newRow){
        var row = [];
        var fields, operation, obj;
        fields = newRow;
        operation = {};
        operation.name = "modify";
        operation.sequence = this.computeSequence(rowNr);
        obj = {};
        obj.fields = fields;
        obj.operation = operation;
        row.push(obj);
        this.pushChanges(row)
    }
    replace(rowNr, newRow){
        var row = [];
        var fields, operation, obj;
        fields = newRow;
        operation = {};
        operation.name = "replace";
        operation.sequence = this.computeSequence(rowNr);
        obj = {};
        obj.fields = fields;
        obj.operation = operation;
        row.push(obj);
        this.pushChanges(row)
    }
    move(rowStartPosition, rowEndPosition, rowCount){
        var rows = [];
        var operation, obj;
        if (rowCount != null){
            for (var i = 0; i < rowCount; i++){
                //TODO: if move > rows.length --> append
                operation = {};
                operation.name = "move";
                operation.sequence = this.computeSequence(rowStartPosition + i);
                operation.moveTo = this.computeSequence(rowEndPosition + i);
                obj = {};
                obj.operation = operation;
                rows.push(obj);
            }
        }else{
            //TODO: if move > rows.length --> append
            operation = {};
            operation.name = "move";
            operation.sequence = this.computeSequence(rowStartPosition);
            operation.moveTo = this.computeSequence(rowEndPosition);
            obj = {};
            obj.operation = operation;
            rows.push(obj);
        }
        this.pushChanges(rows)
    }
    newPatchBlock(action){
        this.action = action;
        this.newBlock = true;
    }
    pushChanges(row){
        if (this.newBlock){
            this.jsonDoc = initDocument(this.action);
            this.newBlock = false;
            var vector = [];
            if (Array.isArray(row)) {
                for (var i = 0; i < row.length; i++) {
                    vector.push(row[i]);
                }
            } else {
                vector.push(row);
            }
            var obj2 = {
                "id": this.xmlTableName,
                "nameXml": this.xmlTableName,
                "nid": 103,
                "data": {}
            };
            this.dataUnitTransactions.push(obj2);
            this.dataUnitTransactions[this.dataUnitTransactions.length-1].data = {"rowLists": []};
            var obj = {"rows": vector};
            this.dataUnitTransactions[this.dataUnitTransactions.length-1].data.rowLists.push(obj);
            // Banana.Ui.showText("json object: newPatch Block" + JSON.stringify(this.data, null, 3));
            this.jsonDoc.document.dataUnits = [];
            this.jsonDoc.document.dataUnits.push(this.dataUnitTransactions[this.dataUnitTransactions.length-1]);
            this.data["data"].push(this.jsonDoc);
            this.listIndexesOperations = new Map();
            // Banana.Ui.showText("json object: " + JSON.stringify(this.data, null, 3));
        } else {
            var vector = [];
            for (var i = 0; i < this.dataUnitTransactions[this.dataUnitTransactions.length-1].data.rowLists[0].rows.length; i++) {
                vector.push(this.dataUnitTransactions[this.dataUnitTransactions.length-1].data.rowLists[0].rows[i]);
            }
            if (Array.isArray(row)) {
                for (var i = 0; i < row.length; i++) {
                    vector.push(row[i]);
                }
            } else {
                vector.push(row);
            }
            this.dataUnitTransactions[this.dataUnitTransactions.length-1].data.rowLists[0].rows = vector;
            this.jsonDoc.document.dataUnits = [];
            this.jsonDoc.document.dataUnits.push(this.dataUnitTransactions[this.dataUnitTransactions.length-1]);
            this.data["data"].pop();
            this.data["data"].push(this.jsonDoc);
            this.listIndexesOperations = new Map();
            // Banana.Ui.showText("json object: " + JSON.stringify(this.data, null, 3));
        }
    }
    computeSequence(rowNr){
        if (this.listIndexesOperations.has(rowNr)){
            let value =  this.listIndexesOperations.get(rowNr)+1;
            this.listIndexesOperations.set(rowNr, value);
            return rowNr.toString() + "." + value.toString();
        }else {
            this.listIndexesOperations.set(rowNr, 1);
            return rowNr.toString();
        }
    }
}

class Column extends Table{
    constructor(jsonDoc, dataUnitTransactions, data, listIndexesOperations) {
        super();
        this.jsonDoc = jsonDoc;
        this.dataUnitTransactions = dataUnitTransactions;
        this.dataUnitTransactions[this.dataUnitTransactions.length-1].data.viewList = {};
        this.dataUnitTransactions[this.dataUnitTransactions.length-1].data.viewList.views = [];
        var obj = {"columns": []};
        this.dataUnitTransactions[this.dataUnitTransactions.length-1].data.viewList.views.push(obj);
        this.data = data;
        this.listIndexesOperations = listIndexesOperations;
    }
    insert(colNr, newCol){
        var columns = [];
        var fields, operation, obj;
        if (Array.isArray(newCol)){
            for (var i = 0; i < newCol.length; i++){
                fields = newCol[i];
                operation = {};
                operation.name = "add";
                operation.sequence = this.computeSequence(colNr);
                obj = {};
                obj.fields = fields;
                obj.operation = operation;
                columns.push(obj);
            }
        }else{
            fields = newCol;
            operation = {};
            operation.name = "add";
            operation.sequence = this.computeSequence(colNr);
            obj = {};
            obj = fields;
            obj.operation = operation;
            columns.push(obj);
        }
        this.pushChanges(columns);
    }
    delete(colName){
        var columns = [];
        var operation, obj;
        operation = {};
        operation.name = "delete";
        obj = {};
        obj.operation = operation;
        obj.nameXml = colName;
        columns.push(obj);
        this.pushChanges(columns);
    }
    modify(colName){
        return null
    }
    replace(){
        return null
    }
    move(colEndPosition, colName){
        var columns = [];
        var operation, obj;
        operation = {};
        operation.name = "move";
        operation.sequence = this.computeSequence(colEndPosition);
        obj = {};
        obj.operation = operation;
        obj.nameXml = colName;
        columns.push(obj);
        this.pushChanges(columns);
    }
    computeSequence(colNr){
        if (this.listIndexesOperations.has(colNr)){
            let value = this.listIndexesOperations.get(colNr)+1;
            this.listIndexesOperations.set(colNr, value);
            return colNr.toString() + "." + value.toString();
        }else {
            this.listIndexesOperations.set(colNr, 1);
            return colNr.toString();
        }
    }
    pushChanges(columns){
        var vector = [];
        var lastElemIndex = this.dataUnitTransactions.length-1;
        for (var i = 0; i < this.dataUnitTransactions[lastElemIndex].data.viewList.views[0].columns.length; i++){
            vector.push(this.dataUnitTransactions[lastElemIndex].data.viewList.views[0].columns[i]);
        }
        if (Array.isArray(columns)){
            for (var i = 0; i < columns.length; i++){
                vector.push(columns[i]);
            }
        }else{
            vector.push(columns);
        }
        this.dataUnitTransactions[lastElemIndex].data.viewList.views[0].columns = vector;
        this.dataUnitTransactions[lastElemIndex].data.viewList.views[0].id = "Base";
        this.dataUnitTransactions[lastElemIndex].data.viewList.views[0].nameXml = "Base";
        this.dataUnitTransactions[lastElemIndex].data.viewList.views[0].nid = 1;
        this.jsonDoc.document.dataUnits = [];
        this.jsonDoc.document.dataUnits.push(this.dataUnitTransactions[lastElemIndex]);
        this.data["data"] = [];
        this.data["data"].push(this.jsonDoc);
        this.listIndexesOperations = new Map();
    }
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
function initDocument(action) {
    var jsonDoc = {};
    jsonDoc.document = {};
    jsonDoc.document.fileVersion = "1.0.0";
    jsonDoc.document.dataUnits = [];
    jsonDoc.creator = {};
    jsonDoc.creator.executionDate = getCurrentDate();
    jsonDoc.creator.executionTime = getCurrentTime();
    jsonDoc.creator.name = action;
    jsonDoc.creator.version = "1.0";
    return jsonDoc;
}
