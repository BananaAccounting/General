/**
 * This example shows the use of a QTableWidget
 * The user interface is defined in file "ch.banana.tutorial.tablewidget.ui"
 * This example is also found in the tutorial file "embedded_javascript_tutorial1.ac2"
 */
// @id = ch.banana.exmaple.tablewidget
// @version = 1.0
// @date = 2019-12-06
// @publisher = Banana.ch SA
// @description = Tutorial QTableWidget
// @task = app.command
// @inputdatasource = none
// @timeout = -1
// @doctype = nodocument

var param = {};

/** Dialog's functions declaration */
var dialog = Banana.Ui.createUi("documents:740.ui");
var table = dialog.findChild("tableWidget");
var buttonBox = dialog.findChild("buttonBox");
var statusLabel = dialog.findChild("statusLabel");

/** Main function */
function exec(inData) {

    // Connect button box signals
    buttonBox.accepted.connect(function() {dialog.close();});
    buttonBox.rejected.connect(function() {dialog.close();});

    // Set the table read
    // table.setEditTriggers(0); // see flags QAbstractItemView::EditTriggers

    // Set columns
    table.setColumnCount(4);
    table.setHorizontalHeaderLabels(["A", "B", "C", "D"])
    table.setColumnWidth(1, 200);

    // Set rows
    table.setRowCount(5);

    // Set cell text
    table.item(1,0).text = "hello";

    // Set cell colors
    var item2 = table.item(1,1);
    item2.text = "colors";
    item2.background = "red";
    item2.foreground = "white";

    // Set cell checkable
    var item3 = table.item(1,2);
    item3.flags = 0x33; // See flags Qt::ItemFlags
    item3.text = "check-it";
    item3.checkState = 0; // See flags Qt::CheckState

    // Set current cell
    // table.setCurrentCell(1,0);

    // Connect table's signals after the table is populated
    table.cellClicked.connect(updateStatusBar);
    table.cellChanged.connect(updateStatusBar);

    // Show dialog
    Banana.application.progressBar.pause();
    dialog.exec();
    Banana.application.progressBar.resume();

    // Get table size
    Banana.console.log("Table size: " + table.rowCount + ", " + table.columnCount);

    // Get current position
    Banana.console.log("Current position: " + table.currentRow + ", " + table.currentColumn);

    // Get current text
    var curItem = table.currentItem();
    Banana.console.log("Current text: " + curItem.text);

    // Get item check state
    Banana.console.log("Item check state: " + (item3.checkState === 2 ? "checked" : "unchecked"));
}

// Update status bar with useful info about the current cell
function updateStatusBar() {
    var curItem = table.currentItem();
    if (curItem) {
        var msg = "Cell " + (table.currentRow + 1) + "," + (table.currentColumn + 1) + " clicked. ";
        if (curItem.text.length > 0)
            msg += "Text: '" + curItem.text + "'. ";
        if (curItem.checkState === 2)
            msg += "Checked: true.";
        statusLabel.text = msg;
    } else {
        statusLabel.text = "";
    }
}
