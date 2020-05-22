// @id = ch.banana.documentpatch.sample.add
// @api = 1.0
// @pubdate = 2019-10-09
// @publisher = Banana.ch SA
// @description = DocumentPatch sample for adding, deleting and moving rows
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @includejs = DocumentPatch.js
// @timeout = -1

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

    //transactions.move(2, 15); // aggiungiamo il parametro rowCount opzionale, default = 1

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
    //Banana.Ui.showText("json object: " + docPatch.toJson());
    return docPatch.getJson();
}
