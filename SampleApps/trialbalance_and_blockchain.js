// Copyright [2024] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.app.trialbalanceandblockchain
// @api = 1.0
// @pubdate = 2024-07-19
// @publisher = Banana.ch SA
// @description = Trial Balance and blockchain (default period)
// @task = app.command
// @doctype = *;*
// @docproperties =
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



/*
	SUMMARY
	=======
	The app prints the table Accounts and at the end the blockchain
*/


//Main function
function exec(string) {
	
	//Check if we are on an opened document
	if (!Banana.document) {
		return;
	}

	var userParam = initUserParam();
	var savedParam = Banana.document.getScriptSettings();
	if (savedParam && savedParam.length > 0) {
		userParam = JSON.parse(savedParam);
	}
	// If needed show the settings dialog to the user
	if (!options || !options.useLastSettings) {
		userParam = settingsDialog(); // From properties
	}
	if (!userParam) {
		return "@Cancel";
	}

	printReport(userParam.selectionStartDate, userParam.selectionEndDate, userParam);
}


//Function that creates and prints the report
function printReport(startDate, endDate, userParam) {

	var report = Banana.Report.newReport("Trial Balance and blockchain");

	printAccountsTable(startDate, endDate, report);
	addHeader(startDate, endDate, report, userParam);
	addFooter(report);

	//Print the report
	var stylesheet = createStyleSheet(userParam);
	Banana.Report.preview(report, stylesheet);
}

function printAccountsTable(startDate, endDate, report) {

	var texts = setTexts();
	var accountsTab = Banana.document.table("Accounts");
	var tColumnNames = accountsTab.columnNames;
	var flag = false;
	if (tColumnNames.indexOf("Kostenstelle") > -1 && tColumnNames.indexOf("Zuordnung") >-1) {
		flag = true;
	}
	
	//Create the table that will be printed on the report
	var table = report.addTable("table");

	// var col1 = table.addColumn("col1");
	// var col2 = table.addColumn("col2");
	// var col3 = table.addColumn("col3");
	// var col4 = table.addColumn("col4");
	// var col5 = table.addColumn("col5");
	// var col6 = table.addColumn("col6");
	// var col7 = table.addColumn("col7");
	// var col8 = table.addColumn("col8");
	// var col9 = table.addColumn("col9");
	// var col10 = table.addColumn("col10");

	//Add column titles to the table report
	var tableHeader = table.getHeader();
    tableRow = tableHeader.addRow();
	tableRow.addCell(texts.account, " bold borderBottom"); //account
	tableRow.addCell(texts.description, " bold borderBottom"); //description
	if (flag) {
		tableRow.addCell(texts.kostenstelle, " bold borderBottom");
		tableRow.addCell(texts.zuordnung, " bold borderBottom");
	}
	tableRow.addCell(texts.vatnumber, " bold borderBottom"); //vatnumber
	tableRow.addCell(texts.movements, "alignCenter bold borderBottom"); //movements
	tableRow.addCell(texts.debit, "alignCenter bold borderBottom"); //debit
	tableRow.addCell(texts.credit, "alignCenter bold borderBottom"); //credit
	tableRow.addCell(texts.opening, "alignCenter bold borderBottom"); //opening
	tableRow.addCell(texts.balance, "alignCenter bold borderBottom"); //balance


	//Get the Accounts table
	for (var i = 0; i < accountsTab.rowCount; i++) {	
		var tRow = accountsTab.row(i);

		tableRow = table.addRow();
		var diff = Banana.SDecimal.subtract(tRow.value("Debit"), tRow.value("Credit"));

		if ((tRow.value("Description") && !tRow.value("Group") && !tRow.value("Account")) 
			|| tRow.value("Group") 
			|| tRow.value("Kostenstelle") && tRow.value("Zuordnung")) 
		{
			var currentBal = Banana.document.currentBalance("Gr="+tRow.value("Group"), startDate, endDate);
			var debit = currentBal.debit;
			var credit = currentBal.credit;
			var opening = currentBal.opening;
			var balance = currentBal.balance;
			var diff = Banana.SDecimal.subtract(debit, credit);

			tableRow.addCell(tRow.value("Account"), " bold", 1);
			tableRow.addCell(tRow.value("Description"), " bold", 1);
			if (flag) {
				tableRow.addCell(tRow.value("Kostenstelle"), " bold", 1);
				tableRow.addCell(tRow.value("Zuordnung"), " bold", 1);
			}			
			tableRow.addCell(tRow.value("VatNumber"), " bold", 1);
			if (diff != 0) {
				tableRow.addCell(diff, "alignRight bold", 1);
			} else {
				tableRow.addCell("", "alignRight bold", 1);
			}
			tableRow.addCell(debit, "alignRight bold", 1);
			tableRow.addCell(credit, "alignRight bold", 1);
			tableRow.addCell(opening, "alignRight bold", 1);
			tableRow.addCell(balance, "alignRight bold", 1);
		}
		else 
		{
			var currentBal = Banana.document.currentBalance(tRow.value("Account"), startDate, endDate);
			var debit = currentBal.debit;
			var credit = currentBal.credit;
			var opening = currentBal.opening;
			var balance = currentBal.balance;
			var diff = Banana.SDecimal.subtract(debit, credit);

			tableRow.addCell(tRow.value("Account"), "", 1);
			tableRow.addCell(tRow.value("Description"), "", 1);
			if (flag) {
				tableRow.addCell(tRow.value("Kostenstelle"), "", 1);
				tableRow.addCell(tRow.value("Zuordnung"), "", 1);
			}
			tableRow.addCell(tRow.value("VatNumber"), "", 1);
			if (diff != 0) {
				tableRow.addCell(diff, "alignRight", 1);
			} else {
				tableRow.addCell("", "alignRight", 1);
			}
			tableRow.addCell(debit, "alignRight", 1);
			tableRow.addCell(credit, "alignRight", 1);
			tableRow.addCell(opening, "alignRight", 1);
			tableRow.addCell(balance, "alignRight", 1);
		}
	}

	report.addParagraph(" ", "");
	report.addParagraph(" ", "");
	report.addParagraph(" ", "");


	//Blockchain for startDate - 1 day
	var dstart = Banana.Converter.toDate(startDate);
	dstart.setDate(dstart.getDate() - 1);
	report.addParagraph(getBlockChain(Banana.Converter.toInternalDateFormat(dstart), report));

	//Blockchain for endDate
	report.addParagraph(getBlockChain(endDate, report));
}

function getBlockChain(endDate, report) {

	var texts = setTexts();
	var transactionsTab = Banana.document.table("Transactions");
	var blockchain = "";

	for (var i = 0; i < transactionsTab.rowCount; i++) {	
		var tRow = transactionsTab.row(i);
		var date = tRow.value("Date");
		var locknumber = tRow.value("LockNumber");
		var lockprogressive = tRow.value("LockProgressive");

		//if (date <= endDate && locknumber && lockprogressive) {
		if (date && date <= endDate) {
			blockchain = texts.blockchain + " " + endDate + ": " + date + ", " + locknumber + ", "+lockprogressive;
		}
	}

	return blockchain;
}

//Function that adds an Header to the report
function addHeader(startDate, endDate, report, userParam) {
	var texts = setTexts();
    var headerLeft = Banana.document.info("Base","HeaderLeft");
    var headerRight = Banana.document.info("Base","HeaderRight");
    var pageHeader = report.getHeader();
    var tab = pageHeader.addTable("header");
    tableRow = tab.addRow();
    if (headerLeft) {
    	tableRow.addCell(headerLeft, "", 1);
    }
    if (headerRight) {
    	tableRow.addCell(headerRight, "alignRight", 1);
    }

    tableRow = tab.addRow();
    tableRow.addCell(userParam.secondHeaderLeft, "", 1);
    tableRow.addCell(userParam.secondHeaderRight, "alignRight", 1);

    tableRow = tab.addRow();
    tableRow.addCell(" ", "", 2);

    tableRow = tab.addRow();
    tableRow.addCell(userParam.title, "heading2", 2);

    tableRow = tab.addRow();
    tableRow.addCell(texts.period + ": " + Banana.Converter.toLocaleDateFormat(startDate) + " - " + Banana.Converter.toLocaleDateFormat(endDate), "", 2);

    tableRow = tab.addRow();
    tableRow.addCell(" ", "", 2);
}

//Function that adds a Footer to the report
function addFooter(report) {
	var texts = setTexts();
	var date = new Date();
	var d = Banana.Converter.toLocaleDateFormat(date);
	report.getFooter().addClass("footer");
	var versionLine = report.getFooter().addText(d + " - " + texts.page + " ", "description");
	report.getFooter().addFieldPageNr();
}

//Function that creates styles for the report
function createStyleSheet(userParam) {
	var stylesheet = Banana.Report.newStyleSheet();

    var pageStyle = stylesheet.addStyle("@page");
    pageStyle.setAttribute("margin", "10mm 10mm 10mm 10mm");

    stylesheet.addStyle("body", "font-family : " + userParam.fontFamily +"; font-size:" + userParam.fontSize + "px");

	style = stylesheet.addStyle(".footer");
	style.setAttribute("text-align", "center");
	style.setAttribute("font-size", userParam.fontSize + "px");
	style.setAttribute("font-family", "Courier New");
	//style.setAttribute("border-top", "thin solid black");

	style = stylesheet.addStyle(".heading2");
	style.setAttribute("font-size", userParam.fontSizeTitle+"px");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle("table");
	style.setAttribute("width", "100%");
	style.setAttribute("font-size", userParam.fontSize+"px");
	stylesheet.addStyle("table.table td", "padding-left:3px; padding-right:3px; padding-top:2px; padding-bottom:2px");
	//stylesheet.addStyle("table.table td", "border: thin solid black;");

	// stylesheet.addStyle(".col1", "width:10%");
	// stylesheet.addStyle(".col2", "width:%");
	// stylesheet.addStyle(".col3", "width:%");
	// stylesheet.addStyle(".col4", "width:%");
	// stylesheet.addStyle(".col5", "width:%");
	// stylesheet.addStyle(".col6", "width:%");
	// stylesheet.addStyle(".col7", "width:%");
	// stylesheet.addStyle(".col8", "width:%");
	// stylesheet.addStyle(".col9", "width:%");
	// stylesheet.addStyle(".col10", "width:%");


	var headerStyle = stylesheet.addStyle("header");
    headerStyle.setAttribute("width", "100%");

	style = stylesheet.addStyle(".borderBottom"); 
	style.setAttribute("border-bottom","thin solid black");

	style = stylesheet.addStyle(".bold");
	style.setAttribute("font-weight", "bold");

	style = stylesheet.addStyle(".alignRight");
	style.setAttribute("text-align", "right");

	style = stylesheet.addStyle(".alignCenter");
	style.setAttribute("text-align", "center");

	style = stylesheet.addStyle(".underline");
	style.setAttribute("text-decoration", "underline");
	//style.setAttribute("border-bottom", "1px double black");

	return stylesheet;
}


//Function that gets the document language
function getLanguage() {
	var language = "en";
	if (Banana.document.locale) {
		language = Banana.document.locale;
	}
	if (language.length > 2) {
		language = language.substr(0, 2);
	}
	return language;
}

//Function that sets the texts
function setTexts() {
	
	var texts = {};
	var lang = getLanguage();
	
	if (lang === "it") {
		texts.secondHeaderLeft = "Intestazione sinistra";
		texts.secondHeaderRight = "Intestazione destra";
		texts.title = "Titolo";
		texts.account = "Conto";
		texts.description = "Descrizione";
		texts.kostenstelle = "KST";
		texts.zuordnung = "ZUO";
		texts.vatnumber = "Numero IVA";
		texts.movements = "Movimenti";
		texts.debit = "Dare";
		texts.credit = "Avere";
		texts.opening = "Apertura";
		texts.balance = "Saldo";
		texts.period = "Periodo";
		texts.page = "Pagina";
		texts.groupTexts = "Testi";
		texts.groupStyles = "Stili";
		texts.accounts = "Conti";
		texts.fontFamily = "Tipo carattere";
		texts.fontSize = "Dimensione carattere";
		texts.fontSizeTitle = "Dimensione carattere titolo";
		texts.blockchain = "Blockchain per";
	} else if (lang === "fr") {
		texts.secondHeaderLeft = "En-tête à gauche";
		texts.secondHeaderRight = "En-tête à droite";
		texts.title = "Titre";
		texts.account = "Compte";
		texts.description = "Description";
		texts.kostenstelle = "KST";
		texts.zuordnung = "ZUO";
		texts.vatnumber = "Numéro TVA";
		texts.movements = "Mouvements";
		texts.debit = "Débit";
		texts.credit = "Crédit";
		texts.opening = "Ouverture";
		texts.balance = "Solde";
		texts.period = "Période";
		texts.page = "Page";
		texts.groupTexts = "Textes";
		texts.groupStyles = "Styles";
		texts.accounts = "Comptes";
		texts.fontFamily = "Type de caractère";
		texts.fontSize = "Taille des caractères";
		texts.fontSizeTitle = "Taille des caractères titre";
		texts.blockchain = "Blockchain pour";
	} else if (lang === "de") {
		texts.secondHeaderLeft = "Überschrift links";
		texts.secondHeaderRight = "Überschrift rechts";
		texts.title = "Titel";
		texts.account = "Konto";
		texts.description = "Kontobezeichnung";
		texts.kostenstelle = "KST";
		texts.zuordnung = "ZUO";
		texts.vatnumber = "MwStCode";
		texts.movements = "Bewegungen";
		texts.debit = "Soll";
		texts.credit = "Haben";
		texts.opening = "Eröffnung";
		texts.balance = "Saldo";
		texts.period = "Periode";
		texts.page = "Seite";
		texts.groupTexts = "Texte";
		texts.groupStyles = "Schriftarten";
		texts.accounts = "Konten";
		texts.fontFamily = "Schriftzeichen";
		texts.fontSize = "Schriftgrösse";
		texts.fontSizeTitle = "Schriftgrösse Titel";
		texts.blockchain = "Blockchain für";
	} else {
		texts.secondHeaderLeft = "Header left";
		texts.secondHeaderRight = "Header right";
		texts.title = "Title";
		texts.account = "Account";
		texts.description = "Description";
		texts.kostenstelle = "KST";
		texts.zuordnung = "ZUO";
		texts.vatnumber = "VAT Number";
		texts.movements = "Movements";
		texts.debit = "Debit";
		texts.credit = "Credit";
		texts.opening = "Opening";
		texts.balance = "Balance";
		texts.period = "Period";
		texts.page = "Page";
		texts.groupTexts = "Texts";
		texts.groupStyles = "Styles";
		texts.accounts = "Accounts";
		texts.fontFamily = "Font family";
		texts.fontSize = "Font size";
		texts.fontSizeTitle = "Title font size";
		texts.blockchain = "Blockchain for";
	}
	return texts;
}


function convertParam(userParam) {

	var texts = setTexts();

	var convertedParam = {};
	convertedParam.version = '1.0';
	convertedParam.data = [];

	var currentParam = {};
	currentParam.name = 'groupTexts';
	currentParam.title = texts.groupTexts;
	currentParam.type = 'string';
	currentParam.value = '';
	currentParam.editable = false;
	currentParam.readValue = function() {
		userParam.groupTexts = this.value;
	}
	convertedParam.data.push(currentParam);

	var currentParam = {};
	currentParam.name = 'secondHeaderLeft';
	currentParam.parentObject = 'groupTexts';
	currentParam.title = texts.secondHeaderLeft;
	currentParam.type = 'string';
	currentParam.value = userParam.secondHeaderLeft ? userParam.secondHeaderLeft : '';
	currentParam.defaultvalue = '';
	currentParam.readValue = function() {
		userParam.secondHeaderLeft = this.value;
	}
	convertedParam.data.push(currentParam);

	var currentParam = {};
	currentParam.name = 'secondHeaderRight';
	currentParam.parentObject = 'groupTexts';
	currentParam.title = texts.secondHeaderRight;
	currentParam.type = 'string';
	currentParam.value = userParam.secondHeaderRight ? userParam.secondHeaderRight : '';
	currentParam.defaultvalue = '';
	currentParam.readValue = function() {
		userParam.secondHeaderRight = this.value;
	}
	convertedParam.data.push(currentParam);

	var currentParam = {};
	currentParam.name = 'title';
	currentParam.parentObject = 'groupTexts';
	currentParam.title = texts.title;
	currentParam.type = 'string';
	currentParam.value = userParam.title ? userParam.title : '';
	currentParam.defaultvalue = texts.accounts;
	currentParam.readValue = function() {
		userParam.title = this.value;
	}
	convertedParam.data.push(currentParam);

	var currentParam = {};
	currentParam.name = 'groupStyles';
	currentParam.title = texts.groupStyles;
	currentParam.type = 'string';
	currentParam.value = '';
	currentParam.editable = false;
	currentParam.readValue = function() {
		userParam.groupStyles = this.value;
	}
	convertedParam.data.push(currentParam);

	var currentParam = {};
	currentParam.name = 'fontFamily';
	currentParam.parentObject = 'groupStyles';
	currentParam.title = texts.fontFamily;
	currentParam.type = 'string';
	currentParam.value = userParam.fontFamily ? userParam.fontFamily : 'Arial';
	currentParam.defaultvalue = 'Arial';
	currentParam.readValue = function() {
		userParam.fontFamily = this.value;
	}
	convertedParam.data.push(currentParam);

	var currentParam = {};
	currentParam.name = 'fontSize';
	currentParam.parentObject = 'groupStyles';
	currentParam.title = texts.fontSize;
	currentParam.type = 'string';
	currentParam.value = userParam.fontSize ? userParam.fontSize : '7';
	currentParam.defaultvalue = '7';
	currentParam.readValue = function() {
		userParam.fontSize = this.value;
	}
	convertedParam.data.push(currentParam);

	var currentParam = {};
	currentParam.name = 'fontSizeTitle';
	currentParam.parentObject = 'groupStyles';
	currentParam.title = texts.fontSizeTitle;
	currentParam.type = 'string';
	currentParam.value = userParam.fontSizeTitle ? userParam.fontSizeTitle : '7';
	currentParam.defaultvalue = '7';
	currentParam.readValue = function() {
		userParam.fontSizeTitle = this.value;
	}
	convertedParam.data.push(currentParam);

	return convertedParam;
}

function initUserParam() {
	var texts = setTexts();
	var userParam = {};
	userParam.secondHeaderLeft = "";
	userParam.secondHeaderRight = "";
	userParam.title = texts.accounts;
	userParam.fontFamily = "Arial";
	userParam.fontSize = "7";
	userParam.fontSizeTitle = "7";
	return userParam;
}

function parametersDialog(userParam) {
	if (typeof(Banana.Ui.openPropertyEditor) !== 'undefined') {
		var dialogTitle = "Settings";
		var convertedParam = convertParam(userParam);
		var pageAnchor = 'dlgSettings';
		if (!Banana.Ui.openPropertyEditor(dialogTitle, convertedParam, pageAnchor)) {
			return null;
		}
		for (var i = 0; i < convertedParam.data.length; i++) {
			// Read values to userParam (through the readValue function)
			convertedParam.data[i].readValue();
		}
		//  Reset reset default values
		userParam.useDefaultTexts = false;
	}

	//We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
	var docStartDate = Banana.document.startPeriod();
	var docEndDate = Banana.document.endPeriod();

	//A dialog window is opened asking the user to insert the desired period. By default is the accounting period
	var selectedDates = Banana.Ui.getPeriod('', docStartDate, docEndDate, userParam.selectionStartDate, userParam.selectionEndDate, userParam.selectionChecked);

	//We take the values entered by the user and save them as "new default" values.
	//This because the next time the script will be executed, the dialog window will contains the new values.
	if (selectedDates) {
		userParam.selectionStartDate = selectedDates.startDate;
		userParam.selectionEndDate = selectedDates.endDate;
		userParam.selectionChecked = selectedDates.hasSelection;
	} else {
		//User clicked cancel
		return null;
	}
 
   return userParam;
}

function settingsDialog() {
	var userParam = initUserParam();
	var savedParam = Banana.document.getScriptSettings();
	if (savedParam && savedParam.length > 0) {
		userParam = JSON.parse(savedParam);
	}
	userParam = parametersDialog(userParam); // From propertiess
	if (userParam) {
		var paramToString = JSON.stringify(userParam);
		Banana.document.setScriptSettings(paramToString);
	}
	return userParam;
}

