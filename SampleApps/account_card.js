// Copyright [2015] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @id = ch.banana.app.accountcard
// @api = 1.0
// @pubdate = 2017-03-15
// @publisher = Banana.ch SA
// @description = Account card
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdatasource = none
// @timeout = -1



/*
	SUMMARY
	=======
	This app creates an account card for the selected account number and period.
	It is possible to add an address next to the desired account on the Accounts-Address view.
*/



var param = {
	"text" : [	
		"Prima frase di test.", 
		"Seconda frase di test con saldo %balance% calcolato.",
		" ",
		"Terza frase di test con periodo iniziale %startPeriod%.",
		"Quarta frase di test con periodo finale %endPeriod%.",
		"Quinta frase di test con saldo %balance%, periodo iniziale %startPeriod% e periodo finale %endPeriod%."
	]
};



function exec(string) {
    
    //versione
	var pubdate = Banana.script.getParamValue("pubdate");

	// check if we are on an opened document
	if (!Banana.document)
		return;
	var transactions = Banana.document.table('Transactions');
	if (!transactions)
		return;
	var accounts = Banana.document.table('Accounts');
	if (!accounts)
		return;
	

	var conto = Banana.Ui.getText("Account statement", "Insert an account number");
	var dateform = getPeriodSettings();

	if (conto && dateform) {
		//Oggetto tabella del conto selezionato
		var table = Banana.document.currentCard(conto, dateform.selectionStartDate, dateform.selectionEndDate);		

		//Se il conto selezionato esiste, allora crea il report
		if(verificaConto(conto)) {

			//Variabile per il controllo della lingua
			var lingua = Banana.document.info("Base","Language");

			//Variabili per la data odierna
			var dataOdierna = new Date();
			//var giorno = dataOdierna.getDay();
			var giorno = dataOdierna.getDate();
			var anno = dataOdierna.getFullYear();
			var arrMesi = new Array();
			var meseIntero ="";

			//Variabile per il titolo
			var titolo ="";

			//Variabili per i titoli delle colonne
			var data ="";
			var descrizione ="";
			var dare ="";
			var avere ="";
			var saldo ="";
			var totaliMovimenti = "";

			//Variabili per scelte
			var ricevuta ="";
			var pagatoContanti ="";
			var versamentoConto ="";
			var fattura ="";
			var altro ="";

			var testoBanca="";
			var testoContoBanca="";
			var testoContoClearing="";

			//Variabili per data e firma
			var luogoData ="";
			var firma = "";

			//Controllo della lingua
			//Italiano
			if(lingua == "ita"){
				arrMesi[0] = "gennaio";
				arrMesi[1] = "febbraio";
				arrMesi[2] = "marzo";
				arrMesi[3] = "aprile";
				arrMesi[4] = "maggio";
				arrMesi[5] = "giugno";
				arrMesi[6] = "luglio";
				arrMesi[7] = "agosto";
				arrMesi[8] = "settembre";
				arrMesi[9] = "ottobre";
				arrMesi[10] = "novembre";
				arrMesi[11] = "dicembre";
				meseIntero = arrMesi[dataOdierna.getMonth()];

				titolo = "Estratto conto";

				data ="Data";
				descrizione ="Descrizione";
				dare ="Dare";
				avere ="Avere";
				saldo ="Saldo";
				totaliMovimenti = "Totali movimenti"

				ricevuta ="Ricevuta";
				pagatoContanti ="Pagamento in contanti";
				versamentoConto ="Versamento su conto";
				fattura ="Fattura";
				altro ="Altro";
				testoContoBanca="numero conto";

				luogoData = "Luogo e data:";
				firma = "Firma:"
			}
			//Francese
			else if(lingua == "fra"){
				arrMesi[0] = "janvier";
				arrMesi[1] = "février";
				arrMesi[2] = "mars";
				arrMesi[3] = "avril";
				arrMesi[4] = "mai";
				arrMesi[5] = "juin";
				arrMesi[6] = "juillet";
				arrMesi[7] = "août";
				arrMesi[8] = "septembre";
				arrMesi[9] = "octobre";
				arrMesi[10] = "novembre";
				arrMesi[11] = "décembre";
				meseIntero = arrMesi[dataOdierna.getMonth()];

				titolo = "Extrait de compte";

				data ="Date";
				descrizione ="Description";
				dare ="Débit";
				avere ="Crédit";
				saldo ="Solde";
				totaliMovimenti = "Totaux mouvements"

				ricevuta ="Quittance";
				pagatoContanti ="Paiement au comptant";
				versamentoConto ="Versement sur compte";
				fattura ="Facture";
				altro ="Autre";
				testoContoBanca="numéro de compte";

				luogoData = "Lieu et date:";
				firma = "Signature:"
			}
			//Tedesco
			else if(lingua == "deu"){
				arrMesi[0] = "Januar";
				arrMesi[1] = "Februar";
				arrMesi[2] = "März";
				arrMesi[3] = "April";
				arrMesi[4] = "Mai";
				arrMesi[5] = "Juni";
				arrMesi[6] = "Juli";
				arrMesi[7] = "August";
				arrMesi[8] = "September";
				arrMesi[9] = "Oktober";
				arrMesi[10] = "November";
				arrMesi[11] = "Dezember";
				meseIntero = arrMesi[dataOdierna.getMonth()];

				titolo = "Kontoauszuges";

				data ="Datum";
				descrizione ="Beschreibung";
				dare ="Soll";
				avere ="Haben";
				saldo ="Saldo";
				totaliMovimenti = "Totalsumme Bewegungen"

				ricevuta ="Erhalt";
				pagatoContanti ="Barzahlung";
				versamentoConto ="Einzahlung auf Konto";
				fattura ="Rechnung";
				altro ="Andere";
				testoContoBanca="Kontonummer";

				luogoData = "Ort und datum:";
				firma = "Unterschrift:"
			}
			//Inglese
			else{
				arrMesi[0] = "January";
				arrMesi[1] = "February";
				arrMesi[2] = "March";
				arrMesi[3] = "April";
				arrMesi[4] = "May";
				arrMesi[5] = "June";
				arrMesi[6] = "July";
				arrMesi[7] = "August";
				arrMesi[8] = "September";
				arrMesi[9] = "October";
				arrMesi[10] = "November";
				arrMesi[11] = "December";
				meseIntero = arrMesi[dataOdierna.getMonth()];

				titolo = "Account statement";

				data ="Date";
				descrizione ="Description";
				dare ="Debit";
				avere ="Credit";
				saldo ="Balance";
				totaliMovimenti = "Total transactions"

				ricevuta ="Receipt";
				pagatoContanti ="Payment in cash";
				versamentoConto ="Payment on account";
				fattura ="Invoice";
				altro ="Other";
				testoContoBanca="account number";

				luogoData = "Place and date:";
				firma = "Signature:"
			}


			//determino la valuta (se esiste viene preso dalla tabella conto, altrimenti dalle informazioni file)
			var valuta = "";
			if(Banana.document.table('Accounts').findRowByValue('Account',conto).value('Currency')){
				valuta = Banana.document.table('Accounts').findRowByValue('Account',conto).value('Currency');
			}
			else{
				valuta = Banana.document.info("AccountingDataBase","BasicCurrency");
			}

			//Creazione report
			var report = Banana.Report.newReport(titolo);

			//Footer
			var pageFooter = report.getFooter();
			pageFooter.addClass("footer");
			pageFooter.addText("Banana Accounting, v. " + Banana.document.info("Base", "ProgramVersion") + ", script v. " + pubdate, "footer");
			
			
			//------------------------------------------------------------------------------//
			// INTESTAZIONI
			//------------------------------------------------------------------------------//
			//Indirizzo (proprietà file) - Mittente
			var societa = Banana.document.info("AccountingDataBase","Company");
			var cap = Banana.document.info("AccountingDataBase","Zip");
			var localita = Banana.document.info("AccountingDataBase","City");
			var telefono = Banana.document.info("AccountingDataBase","Phone");
			var cellulare = Banana.document.info("AccountingDataBase","Mobile");
			var email = Banana.document.info("AccountingDataBase","Email");
			var partitaIva = Banana.document.info("AccountingDataBase","VatNumber");
			var nomeMittente = Banana.document.info("AccountingDataBase","Name");
			var cognomeMittente = Banana.document.info("AccountingDataBase","FamilyName");
			var indirizzo1Mittente = Banana.document.info("AccountingDataBase","Address1");
			var indirizzo2Mittente = Banana.document.info("AccountingDataBase","Address2");
			
			var sezioneIndirizzo1 = report.addSection("indirizzoStyle1");
			if (societa) {
				sezioneIndirizzo1.addParagraph(societa, "bold");
			}
			if (nomeMittente && cognomeMittente) {
				sezioneIndirizzo1.addParagraph(nomeMittente + " " + cognomeMittente);
			}
			if (indirizzo1Mittente) {
				sezioneIndirizzo1.addParagraph(indirizzo1Mittente);
			}
			if (indirizzo2Mittente) {
				sezioneIndirizzo1.addParagraph(indirizzo2Mittente);
			}
			if (cap && localita) {
				sezioneIndirizzo1.addParagraph(cap + " " + localita);
			}
			if (telefono) {
				sezioneIndirizzo1.addParagraph("Tel. " + telefono);
			}
			if (cellulare) {
				sezioneIndirizzo1.addParagraph("Cel. " + cellulare);
			}
			if (email) {
				sezioneIndirizzo1.addParagraph("Email: " + email);
			}
			if (partitaIva) {
				sezioneIndirizzo1.addParagraph("Partita IVA: " + partitaIva);
			}

			//Indirizzo (tablella conti) - Destinatario
			var nomePrefisso = Banana.document.table('Accounts').findRowByValue('Account',conto).value('NamePrefix');
			var nomeDestinatario = Banana.document.table('Accounts').findRowByValue('Account',conto).value('FirstName');
			var cognomeDestinatario = Banana.document.table('Accounts').findRowByValue('Account',conto).value('FamilyName');
			var indirizzo1Destinatario = Banana.document.table('Accounts').findRowByValue('Account',conto).value('Street');
			var capDestinatario = Banana.document.table('Accounts').findRowByValue('Account',conto).value('Zip');
			var luogoDestinatario = Banana.document.table('Accounts').findRowByValue('Account',conto).value('Locality');
			var indirizzo2Destinatario = Banana.document.table('Accounts').findRowByValue('Account',conto).value('AddressExtra');
			var nazioneDestinatario = Banana.document.table('Accounts').findRowByValue('Account',conto).value('Country');
			var codiceNazioneDestinatario = Banana.document.table('Accounts').findRowByValue('Account',conto).value('CountryCode');
			
			var sezioneIndirizzo = report.addSection("indirizzoStyle");
			if (nomePrefisso) {
				sezioneIndirizzo.addParagraph(nomePrefisso);
			}
			if (nomeDestinatario && cognomeDestinatario) {
				sezioneIndirizzo.addParagraph(nomeDestinatario + " " + cognomeDestinatario);
			} else if (cognomeDestinatario) {
				sezioneIndirizzo.addParagraph(cognomeDestinatario);
			}

			if (indirizzo1Destinatario) {
				sezioneIndirizzo.addParagraph(indirizzo1Destinatario);
			}
			if (indirizzo2Destinatario) {
				sezioneIndirizzo.addParagraph(indirizzo2Destinatario);
			}
			if (capDestinatario && luogoDestinatario) {
				sezioneIndirizzo.addParagraph(capDestinatario + " " + luogoDestinatario);
			}
			if(codiceNazioneDestinatario && nazioneDestinatario) {
				sezioneIndirizzo.addParagraph(codiceNazioneDestinatario + "-" + nazioneDestinatario);
			}
			else{
				sezioneIndirizzo.addParagraph(nazioneDestinatario);
			}
			
			
			//Data intestazione
			var sezioneData = report.addSection("dataStyle");
			sezioneData.addParagraph(localita + ", " + giorno + " " + meseIntero + " " + anno);
			
			
			//------------------------------------------------------------------------------//
			// ESTRATTO CONTO - Titolo
			//------------------------------------------------------------------------------//
			//Descrizione del conto selezionato
			var descrizioneConto = Banana.document.table('Accounts').findRowByValue('Account',conto).value('Description');
			
			report.addParagraph(" ", "paragrafiStyle");
			report.addParagraph(titolo + " - " + conto + " " + descrizioneConto, "intestazioneStyle bordoSottoStyle");
			report.addParagraph(" ");
			
			
			//------------------------------------------------------------------------------//
			// TABELLA CONTO NEL REPORT
			//------------------------------------------------------------------------------//
			//Creazione tabella nel report
			var tableEstrattoConto = report.addTable("tableEC"); 
			
			//Aggiunge le colonne dei titoli alla tabella
			var tableHeaderEstrattoConto = tableEstrattoConto.getHeader();
			tableRow = tableHeaderEstrattoConto.addRow();	
			
			//Aggiunge i titoli delle varie colonne
			tableRow.addCell(data,"intestazioneTableStyle");
			tableRow.addCell(descrizione,"intestazioneTableStyle");
			tableRow.addCell(dare + " " + valuta,"intestazioneTableStyle");
			tableRow.addCell(avere + " " + valuta,"intestazioneTableStyle");
			tableRow.addCell(saldo + " " + valuta,"intestazioneTableStyle");
			
			//Tabella conto selezionato con le colonne desiderate
			for(i=0; i<table.rowCount-1; i++) {
			
				var tRow = table.row(i);
				
				tableRow = tableEstrattoConto.addRow();
				tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('JDate')), "testoTab");
				tableRow.addCell(tRow.value('JDescription'), "testoTab");
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JDebitAmountAccountCurrency')), "importiTab");
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JCreditAmountAccountCurrency')), "importiTab");
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "importiTab");
			}

			//Totali movimenti del conto selezionato
			for(i=table.rowCount-1; i<table.rowCount; i++) {
			
				var tRow = table.row(i);
				
				tableRow = tableEstrattoConto.addRow();
				tableRow.addCell(Banana.Converter.toLocaleDateFormat(tRow.value('JDate')), "testoTabTotali");	
				//tableRow.addCell(tRow.value('JDescription'), "testoTabTotali");
				tableRow.addCell(totaliMovimenti, "testoTabTotali");
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JDebitAmountAccountCurrency')), "totalStyle");
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JCreditAmountAccountCurrency')), "totalStyle");
				tableRow.addCell(Banana.Converter.toLocaleNumberFormat(tRow.value('JBalanceAccountCurrency')), "totalStyle");
			}


			
			//------------------------------------------------------------------------------//
			// TESTO
			//------------------------------------------------------------------------------//
			report.addParagraph(" ", "");
			report.addParagraph(" ", "");
			report.addParagraph(" ", "");

			for (var i = 0; i < param.text.length; i++) 
			{
				
				var str = param.text[i];

				if (str.indexOf("%balance%") > -1 || str.indexOf("%startPeriod%") > -1 || str.indexOf("%endPeriod%") > -1) 
				{
					var currentBal = Banana.document.currentBalance(conto, dateform.selectionStartDate, dateform.selectionEndDate);
					var endBalance = currentBal.balance;
					str = str.replace("%balance%", Banana.Converter.toLocaleNumberFormat(endBalance));
					str = str.replace("%startPeriod%", Banana.Converter.toLocaleDateFormat(dateform.selectionStartDate));
					str = str.replace("%endPeriod%", Banana.Converter.toLocaleDateFormat(dateform.selectionEndDate));
				}

				report.addParagraph(str);
			}


			
			


			
			//------------------------------------------------------------------------------//
			// CREAZIONE/STAMPA DEL REPORT
			//------------------------------------------------------------------------------//
			// Styles
			var stylesheet = CreaStyleSheet1();
			
			//Stampa report
			Banana.Report.preview(report, stylesheet);
		}
	} else {
		return;
	}
}


//------------------------------------------------------------------------------//
// FUNZIONI
//------------------------------------------------------------------------------//
//Verifica se il conto selezionato sia effettivamente un conto.
//Se non lo fosse ritorna un messaggio di errore.
function verificaConto(conto){

	var controllo = 1;

	if(!Banana.document.table('Accounts').findRowByValue('Account',conto) || !conto){
		Banana.application.addMessage("Invalid account selected.");
		controllo = 0;
		return false;
	}
	else{
		return true;
	}
}








//The main purpose of this function is to allow the user to enter the accounting period desired and saving it for the next time the script is run.
//Every time the user runs of the script he has the possibility to change the date of the accounting period.
function getPeriodSettings() {
	
	//The formeters of the period that we need
	var scriptform = {
	   "selectionStartDate": "",
	   "selectionEndDate": "",
	   "selectionChecked": "false"
	};

	//Read script settings
	var data = Banana.document.scriptReadSettings();
	
	//Check if there are previously saved settings and read them
	if (data.length > 0) {
		try {
			var readSettings = JSON.parse(data);
			
			//We check if "readSettings" is not null, then we fill the formeters with the values just read
			if (readSettings) {
				scriptform = readSettings;
			}
		} catch (e){}
	}
	
	//We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
	var docStartDate = Banana.document.startPeriod();
	var docEndDate = Banana.document.endPeriod();	
	
	//A dialog window is opened asking the user to insert the desired period. By default is the accounting period
	var selectedDates = Banana.Ui.getPeriod("Period", docStartDate, docEndDate, 
		scriptform.selectionStartDate, scriptform.selectionEndDate, scriptform.selectionChecked);
		
	//We take the values entered by the user and save them as "new default" values.
	//This because the next time the script will be executed, the dialog window will contains the new values.
	if (selectedDates) {
		scriptform["selectionStartDate"] = selectedDates.startDate;
		scriptform["selectionEndDate"] = selectedDates.endDate;
		scriptform["selectionChecked"] = selectedDates.hasSelection;

		//Save script settings
		var formToString = JSON.stringify(scriptform);
		var value = Banana.document.scriptSaveSettings(formToString);		
    } else {
		//User clicked cancel
		return;
	}
	return scriptform;
}





//Creazione degli stili per il report
function CreaStyleSheet1() {
	//------------------------------------------------------------------------------//
	// GENERALI
	//------------------------------------------------------------------------------//
	var docStyles = Banana.Report.newStyleSheet();
	var pageStyle = docStyles.addStyle("@page");
  	pageStyle.setAttribute("margin", "20m 15mm 15mm 25mm");

	//Footer
	style = docStyles.addStyle(".footer");
	style.setAttribute("text-align", "right");
	style.setAttribute("font-size", "8px");
	style.setAttribute("font-family", "Courier New");
	
	//Titoletti intestazione
	style = docStyles.addStyle(".intestazioneStyle");
	style.setAttribute("font-size", "14pt");
	style.setAttribute("font-weight", "bold");
	
	//Bordo sotto
  	style = docStyles.addStyle(".bordoSottoStyle");
  	style.setAttribute("border-bottom","1px solid black");
	
	////Testo data
	//style = docStyles.addStyle(".dataStyle");
	//style.setAttribute("font-size", "12");
	//style.setAttribute("margin-left", "9.5cm");
	
	//Testo data 
	style = docStyles.addStyle(".dataStyle");
	style.setAttribute("position", "absolute");
	style.setAttribute("left", "100mm");
	style.setAttribute("top", "70mm");
	style.setAttribute("width", "80mm");
	style.setAttribute("height", "30mm");
	style.setAttribute("font-size", "12");
	
	//Testo generale
	style = docStyles.addStyle(".generalStyle");
	style.setAttribute("font-size", "12");
	
	//Testo indirizzo
	//style = docStyles.addStyle(".indirizzoStyle");
	//style.setAttribute("font-size", "12");
	//style.setAttribute("font-weight", "bold");
	//style.setAttribute("margin-left", "9.5cm");
	
	//Testo indirizzo 
	style = docStyles.addStyle(".indirizzoStyle");
	style.setAttribute("position", "absolute");
	style.setAttribute("left", "100mm");
	style.setAttribute("top", "35mm");
	style.setAttribute("width", "80mm");
	style.setAttribute("height", "30mm");
	style.setAttribute("overflow-shrink-max", "0.6");
	style.setAttribute("overflow", "shrink");
	
	//Testo indirizzo1
	style = docStyles.addStyle(".indirizzoStyle1");
	style.setAttribute("position", "absolute");
	style.setAttribute("left", "0mm");
	style.setAttribute("top", "0mm");
	style.setAttribute("width", "80mm");
	style.setAttribute("height", "30mm");
	style.setAttribute("overflow-shrink-max", "0.6");
	style.setAttribute("overflow", "shrink");

	style = docStyles.addStyle(".bold");
	style.setAttribute("font-weight", "bold");
	
	//Spazio tra paragrafi
	style = docStyles.addStyle(".paragrafiStyle");
	style.setAttribute("margin", "112px");
	
	//Spazio tra paragrafi
	style = docStyles.addStyle(".paragrafiStyle1");
	style.setAttribute("margin", "24px");
	
	//Spazio tra paragrafi
	style = docStyles.addStyle(".paragrafiStyle2");
	style.setAttribute("margin", "12px");
	
	//Testo scelte e firma
	style = docStyles.addStyle(".scelteStyle");
	style.setAttribute("font-family", "Arial");
	style.setAttribute("font-size", "10");
	
	//Testo italic
	style = docStyles.addStyle(".italicStyle");
	style.setAttribute("font-style", "italic");
	
	//------------------------------------------------------------------------------//
	// TABELLA
	//------------------------------------------------------------------------------//
	//Titoletti tabella
	style = docStyles.addStyle(".intestazioneTableStyle");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("padding-bottom", "5px"); 
	style.setAttribute("background-color", "#ffd100");
	style.setAttribute("color", "#1b365d");
	
	//Testo tabella
	style = docStyles.addStyle(".testoTab");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("text-align", "left");
	
	//Testo tabella Totali
	style = docStyles.addStyle(".testoTabTotali");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("text-align", "left");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("background-color", "#b7c3e0"); 
	
	//Importi tabella
	style = docStyles.addStyle(".importiTab");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("text-align", "right");
	
	//Totali tabella
	style = docStyles.addStyle(".totalStyle");
	style.setAttribute("font-size", "10pt");
	style.setAttribute("font-weight", "bold");
	style.setAttribute("text-align", "right");
	style.setAttribute("background-color", "#b7c3e0"); 
	
	//Tabella Estratto conto
	var tableStyle1 = docStyles.addStyle(".tableEC");
	tableStyle1.setAttribute("width", "100%");
  	tableStyle1.setAttribute("border-left", "thin solid black");
	tableStyle1.setAttribute("border-top", "thin solid black");
	tableStyle1.setAttribute("border-bottom", "thin solid black");
	tableStyle1.setAttribute("border-right", "thin solid black");
  	docStyles.addStyle("table.tableEC td", "border-top: thin solid black; border-left: thin solid black; border-bottom: thin solid black; padding: 3px;");

  	//Tabella scelte
	var tableStyle3 = docStyles.addStyle(".tableScelte");
	tableStyle3.setAttribute("width", "100%");
	tableStyle3.setAttribute("page-break-inside", "avoid");
  	docStyles.addStyle("table.tableScelte td", "padding: 3px;");
	
	var tableStyle4 = docStyles.addStyle(".tableFirme");
	tableStyle4.setAttribute("width", "100%");
	tableStyle4.setAttribute("page-break-inside", "avoid");
  	docStyles.addStyle("table.tableFirme td", "padding: 3px;");
	
	return docStyles;
}



