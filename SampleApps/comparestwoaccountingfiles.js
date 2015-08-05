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
//
// @id = ch.banana.apps.comparestwoaccountingfiles
// @version = 1.0
// @pubdate = 2015-03-06
// @publisher = Banana.ch SA
// @description = Compare two accounting files
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @outputformat = none
// @inputdatasource = none
// @includejs = 
// @timeout = -1
//

function exec(string) {
    
    //versione
	var pubdate = "2015-03-06";

	// check if we are on an opened document
	if (!Banana.document)
		return;
	var transactions = Banana.document.table('Transactions');
	var accounts = Banana.document.table('Accounts');
	var exchangeRates = Banana.document.table('ExchangeRates');
	var vatCodes = Banana.document.table('VatCodes');
	var categories = Banana.document.table('Categories');

	
	
	
	//Apro il secondo file, quello da comparare.
	//Finestra per scegliere quale file .ac2 aprire
	var file2 = Banana.application.openDocument("*.*");
	
	//Se aperto/esiste
	if(!file2){
		return;
	}
	else{
		
		//variabili per il file2
		var transactions1 = file2.table('Transactions');
		var accounts1 = file2.table('Accounts');
		var exchangeRates1 = file2.table('ExchangeRates');
		var vatCodes1 = file2.table('VatCodes');
		var categories1 = file2.table('Categories');


		
		
		//Pulizia schermata messaggi a ogni avvio dello script
		Banana.document.clearMessages();
		file2.clearMessages();
		
		//Report per prove di stampa
		//var report = Banana.Report.newReport("Confronto contabilità");
				
		

		//------------------------------------------------------------------------------//
		// INIZIO VERIFICA
		//------------------------------------------------------------------------------//
		
		var flag = false;
			
		//1) Chiamata della funzione per comparare l'arrotondamento. Se ci sono differenze alza un flag.
		if(compareArrotondamento(file2)) {
			flag = true;
		}
		
		//2) Chiamata della funzione per comparare il numero decimali. Se ci sono differenze alza un flag.
		if(compareDecimali(file2)){
			flag = true;
		}
		
		//3) Chiamata della funzione per comparare l'arrotondamento IVA. Se ci sono differenze alza un flag.
		if(compareArrotondamentoIva(file2)){
			flag = true;
		}
	
		//4) Chiamata della funzione per comparare le tabelle Conti e Estratti Conti. Se ci sono differenze alza un flag.
		if(compareEstrattiConti(accounts, accounts1, transactions, transactions1, file2)){
			flag = true;
		}
		
		//Chiamata della funzione per comparare le tabelle Categorie. Se ci sono differenze alza un flag.
		if(compareEstrattiConti(categories, categories1, transactions, transactions1, file2)){
			flag = true;
		}
		
		//5) Chiamata della funzione per comparare le tabelle Cambi. Se ci sono differenze alza un flag.
		if(compareCambio(exchangeRates, exchangeRates1, file2)){
			flag = true;
		}

		//6) Chiamata della funzione per comparare le tabelle Conti IVA. Se ci sono differenze alza un flag.
		if(compareIva(vatCodes, vatCodes1, file2)){
			flag = true;
		}
	
		//7) Chiamata della funzione per comparare le tabelle Registrazioni. Se ci sono differenze alza un flag.
		if(compareTransactions(transactions, transactions1, file2)){
			flag = true;
		}
		
		//Se non esistono differenze viene mostrato un messaggio.
		if(!flag){
			var openingDate = Banana.document.info("AccountingDataBase","OpeningDate");
			var dataVerifica = getDataFinaleDiVerifica(transactions, transactions1);
			
			Banana.Ui.showInformation("Informazione", "Nessuna differenza dal <" 
			+ Banana.Converter.toLocaleDateFormat(openingDate) 
			+ "> al <"
			+ Banana.Converter.toLocaleDateFormat(dataVerifica)
			+ ">");
		}
		
	} //fine file2 aperto

	
/*	
	//------------------------------------------------------------------------------//
	// CREAZIONE/STAMPA DEL REPORT 
	//------------------------------------------------------------------------------//
	// Styles
	var stylesheet = CreaStyleSheet1();
	
	//Stampa report
	Banana.Report.preview(report, stylesheet);
	*/
}





//------------------------------------------------------------------------------//
// FUNZIONI
//------------------------------------------------------------------------------//

//Funzione che verifica che il conto sia effettivamente un conto
function verificaConto(conto){
	var controllo = 1;
	if(!Banana.document.table('Accounts').findRowByValue('Account',conto) || !conto){
		return false;
	}
	else{
		return true;
	}
}



//Funzione per stampare (sul report) un array contentente dei valori
//Usato per testare
function stampaArray(array, report){
	report.addParagraph(" ");
	report.addParagraph("Stampo Array:");
	for(i=0; i<array.length; i++){
		report.addParagraph(array[i]);
	}
	report.addParagraph(" ");
}




//Funzione che, dati due arrays, ritorna un array con tutte le differenze
//Utile per trovare le differenze di due arrays
function diffArray(a, b){
	var seen = [], diff = [];
	for(var i=0; i<a.length; i++){
		seen[a[i]] = true;
	}
	for(var i=0; i<b.length; i++){
		if(!seen[b[i]]){
			diff.push(b[i]);
		}
	}
	return diff;
}





//Funzione che, data la tabella ACCOUNTS (piano dei conti) 
//ritorna in un array TUTTI i CONTI presenti nel PIANO DEI CONTI
function getAccounts(tabella){
	
	var tRow =""
	var conto ="";
	var arrConti = [];
	
	//report.addParagraph("CONTI:");
	//var stampaTabella1 = report.addTable("tableProva1");
	
	for(i=0; i<tabella.rowCount; i++){ //-480
		tRow = tabella.row(i);
		conto = tRow.value('Account');
		
		if(conto){
			//tableRow = stampaTabella1.addRow();
			//tableRow.addCell(conto);
			arrConti.push(conto);
		}
	}
	return arrConti;
}




//Funzione che, data una tabella 
//ritorna in un array TUTTI gli UNIQUEID delle righe presenti
function getUniqueIds(tabella){
	var tRow =""
	var id ="";
	var arrUniqueIds = [];
	
	for(i=0; i<tabella.rowCount; i++){
		tRow = tabella.row(i);
		id = tRow.uniqueId;
		
		if(id){
			arrUniqueIds.push(id);
		}
	}
	return arrUniqueIds;
}



//Funzione che data una tabella e una colonna, ritorna in un array tutti gli elementi della colonna
function getTableByKey(table, keyColumn){
	var tRow =""
	var key ="";
	var arrElements = [];
	
	for(i=0; i<table.rowCount; i++){
		tRow = table.row(i);
		key = tRow.value(keyColumn);
		
		if(key){
			arrElements.push(key);
		}	
	}
	return arrElements;
}








//Funzione che, date due tabelle, estrae l'ultima data (per ogni tabella) e ritorna quella "più giovane"
//Usata per estrarre le date dalle tabelle REGISTRAZIONI in modo da utilizzare la data corretta
function getDataFinaleDiVerifica(tab1, tab2){

	var data1 = getLastTransactionDate(tab1);
	var data2 = getLastTransactionDate(tab2);	
	var dataFinaleDiVerifica = "";

	if(data1 > data2){
		dataFinaleDiVerifica = data2;
	}
	else if(data1 < data2){
		dataFinaleDiVerifica = data1;
	}
	else if(data1 == data2){
		dataFinaleDiVerifica = data1;
	}
	return dataFinaleDiVerifica;
}




//Funzione che, data una tabella, estrae tutte le DATE e ritorna L'ULTIMA
function getLastTransactionDate(tab1){
	var data = "";
	var dataRow = "";
	for(i=0; i<tab1.rowCount; i++){
		dataRow = tab1.value(i, "Date");
		if(dataRow > data){
			data = dataRow;
		}
	}
	return data;
}




//Funzione che, passato il file esterno, confronta il tipo di arrotondamento fra i due files.
function compareArrotondamento(file){
	var tipoArrotondamento1 = Banana.document.info("Base","RoundingType");
	var tipoArrotondamento2 = file.info("Base","RoundingType");
	
	if(tipoArrotondamento1 != tipoArrotondamento2){
			Banana.document.addMessage("Contabilità tipo arrotondamento differente: base <" 
			+ tipoArrotondamento1 +">, nuovo <" + tipoArrotondamento2 + ">");
		return true;
	}
	else{
		return false;
	}
}



//Funzione che, passato il file esterno, confronta il numero di decimali fra i due files.
function compareDecimali(file){
	var numeroDecimali1 = Banana.document.info("Base","DecimalsAmounts");
	var numeroDecimali2 = file.info("Base","DecimalsAmounts");

	if(numeroDecimali1 != numeroDecimali2){
			Banana.document.addMessage("Contabilità numero decimali differente: base <" 
			+ numeroDecimali1 +">, nuovo <" + numeroDecimali2 + ">");
		return true;
	}
	else{
		return false;
	}
}


//Funzione che, passato il file esterno, confronta l'arrotondamento dell'IVA fra i due files.
function compareArrotondamentoIva(file){
	var arrIva1 = Banana.document.info("AccountingDataBase","VatRounding");
	var arrIva2 = file.info("AccountingDataBase","VatRounding");

	if(arrIva1 != arrIva2){
			Banana.document.addMessage("Contabilità arrotondamento IVA differente: base <" 
			+ arrIva1 +">, nuovo <" + arrIva2 + ">");
		return true;
	}
	else{
		return false;
	}
}




//Funzione che fa la comparazione degli ESTRATTI CONTO di 2 files.
//Date le due tabelle del PIANO DEI CONTI dei due files, le due tabelle delle REGISTRAZIONI, il file esterno...
//vengono estratti tutti i CONTI (di entrambi i files)
//per ogni conto viene creata la tabella relativa dell'ESTRATTO CONTO (di entrambi i files)
//dall'estratto conto vengono estratti i valori di SALDO APERTURA (di entrambi i files) se esistono 
//dall'estratto conto vengono estratti i valori del SALDO FINALE (di entrambi i files) fino alla "data finale di verifica"
//i valori del FILE1 e del FILE2 sono confrontati fra di loro SOLO se appartenenti allo stesso CONTO (stesso numero)
//le eventuali differenze vengono visualizzate sottoforma di messaggi nel FILE1 (siccome è il file principale ed è quello sul quale si sta lavorando).
//Inoltre vengono confrontati i valori relativi al tipo di arrotondamento, numero di decimali, arrotondamento IVA.
function compareEstrattiConti(tabAccounts1, tabAccounts2, tabTransactions1, tabTransactions2, file){
	
	if(!tabAccounts1 || !tabAccounts2){
		return false;
	}
	
	if(!tabTransactions1 || !tabTransactions2){
		return false;
	}
	
	var numeroConto1, numeroConto2, descrizione, currentBal1, currentBal2, openingBalance1, openingBalance2, endBalance1, endBalance2 = "";
	var arrContiFile1 = [], arrContiFile2 = [], arrDifferenze1 = [], arrDifferenze2 = []; 
	var tabellaEstrattoConto1, tabellaEstrattoConto2 = "";
	var tRow1, tRow2 ="";
	var dataVerifica = getDataFinaleDiVerifica(tabTransactions1, tabTransactions2);
	var flag = false;
			
	for(i=0; i<tabAccounts2.rowCount; i++){
		tRow2 = tabAccounts2.row(i);
		numeroConto2 = tRow2.value('Account');
		tabellaEstrattoConto2 = file.currentCard(numeroConto2);
	
		if(verificaConto(numeroConto2)){
			currentBal2 = file.currentBalance(numeroConto2,'', dataVerifica);
			openingBalance2 = currentBal2.opening;
			endBalance2 = currentBal2.balance;
			
			for(j=0; j<tabAccounts1.rowCount; j++){
				tRow1 = tabAccounts1.row(j); 
				numeroConto1 = tRow1.value('Account');
				descrizione = tRow1.value('Description');
				tabellaEstrattoConto1 = Banana.document.currentCard(numeroConto1);
					
				if(verificaConto(numeroConto1)){
					//Se sono lo stesso conto (stesso numero)
					if(numeroConto1 == numeroConto2){
						currentBal1 = Banana.document.currentBalance(numeroConto1,'', dataVerifica);
						openingBalance1 = currentBal1.opening;
						endBalance1 = currentBal1.balance;
														
						//Comparazione: se ci sono differenze stampo messaggio e alzo un flag.
						if(openingBalance1 != openingBalance2){
							tRow1.addMessage("Conto <" + numeroConto1 + " " + descrizione + "> saldo d'apertura differente: base <" 
							+ Banana.Converter.toLocaleNumberFormat(openingBalance1)
							+ ">, nuovo <" + 	Banana.Converter.toLocaleNumberFormat(openingBalance2) + ">");
							flag = true;
						}
						if(endBalance1 != endBalance2){
							tRow1.addMessage("Conto <" + numeroConto1 + " " + descrizione + "> saldo al <" + Banana.Converter.toLocaleDateFormat(dataVerifica) 
							+ "> differente: base <" + Banana.Converter.toLocaleNumberFormat(endBalance1)
							+ ">, nuovo <" + 	Banana.Converter.toLocaleNumberFormat(endBalance2) + ">");
							flag = true;
						}
					} //if equal						
				} //if conto1 exists
			} //for j
		} //if conto2 exists
	} //for i
	
	
	//Controllo di eventuali Conti AGGIUNTi e/o ELIMINATI nel File2 rispetto al File1
	arrContiFile1 = getAccounts(tabAccounts1);
	arrContiFile2 = getAccounts(tabAccounts2);
		
	arrDifferenze1 = diffArray(arrContiFile2, arrContiFile1);
	arrDifferenze2 = diffArray(arrContiFile1, arrContiFile2);
	
	//Conti ELIMINATI
	if(arrDifferenze1.length > 0){				
		for(i=0; i<tabAccounts1.rowCount; i++){
			var tRow1 = tabAccounts1.row(i); 
			var numeroContoTab = tRow1.value('Account');
			var descrizione = tRow1.value('Description');
			
			for(j=0; j<arrDifferenze1.length; j++){
				var numeroContoArr = arrDifferenze1[j];
				
				if(numeroContoTab == numeroContoArr){
					tRow1.addMessage("Conto <" + numeroContoTab + " " + descrizione + "> eliminato");
				}
			}
		}
		flag = true;
	}
	//Conti AGGIUNTI
	if(arrDifferenze2.length > 0){
		var nameString = file.info("Base","FileName");
		var nameArray = nameString.split('/');
		var fileName = nameArray[nameArray.length - 1];	

		for(i=0; i<tabAccounts2.rowCount; i++){
			var tRow2 = tabAccounts2.row(i); 
			var numeroContoTab = tRow2.value('Account');
			var descrizione = tRow2.value('Description');
				
			for(j=0; j<arrDifferenze2.length; j++){
				var numeroContoArr = arrDifferenze2[j];
					
				if(numeroContoTab == numeroContoArr){
					tRow2.addMessage("Conto <" + numeroContoTab + " " + descrizione + "> aggiunto in <" + fileName + ">");
				}
			}
		}
		flag = true;
	}
	return flag;
}




//Function that, given two ExchangeRates tables,
//compare all the rows with equal Currency Reference and Currency
function compareCambio(table1, table2, file){
	
	if(!table1 || !table2){
		return false;
	}
	
	var tRow1, tRow2 ="";
	
	var data1 = "";
	var currencyReference1 ="";
	var currency1 = "";
	var multiplier1 = "";
	var rate1 = "";
	var rateOpening1 ="";
	var description1 = "";
	
	var data2 = "";
	var currencyReference2 ="";
	var currency2 = "";
	var multiplier2 = "";
	var rate2 = "";
	var rateOpening2 ="";
	var description2 = "";
	
	var arrDifferenze1 = [];
	var arrDifferenze2 = [];
	var arrUniqueIdsFile1 = [];
	var arrUniqueIdsFile2 = [];
	
	var flag = false;
	
	
	for(i=0; i<table2.rowCount; i++){
		tRow2 = table2.row(i);
		data2 = tRow2.value('Date');
		
		//Check if Date are NULL then begins comparison
		if(!data2 && !tRow2.isEmpty){	

			currencyReference2 = tRow2.value('CurrencyReference');
			currency2 = tRow2.value('Currency');
			description2 = tRow2.value('Description');
			multiplier2 = tRow2.value('Multiplier');
			rate2 = tRow2.value('Rate');
			rateOpening2 = tRow2.value('RateOpening');
						
			for(j=0; j<table1.rowCount; j++){
				tRow1 = table1.row(j);
				data1 = tRow1.value('Date');
			
				currencyReference1 = tRow1.value('CurrencyReference');
				currency1 = tRow1.value('Currency');
				description1 = tRow1.value('Description');
				multiplier1 = tRow1.value('Multiplier');
				rate1 = tRow1.value('Rate');
				rateOpening1 = tRow1.value('RateOpening');
			
				//Check if Date are NULL then begins comparison
				if(!data1 && !tRow1.isEmpty){

					//If Currency Reference are equal then begins the comparison
					if((currencyReference1 == currencyReference2) && (currency1 == currency2)){
						
						//Show differences if column values are different						
						if(description1 != description2){
							tRow1.addMessage("Cambio <" +  currencyReference1 + "," + currency1 + "> modificato <" 
							+ "Testo" + ">: base <" + description1 + ">, nuovo <" + description2 + ">");
							flag = true;
						}
						if(multiplier1 != multiplier2){
							tRow1.addMessage("Cambio <" +  currencyReference1 + "," + currency1 + "> modificato <" 
							+ "Moltiplicatore" + ">: base <" + multiplier1 + ">, nuovo <" + multiplier2 + ">");
							flag = true;
						}
						if(rate1 != rate2){
							tRow1.addMessage("Cambio <" +  currencyReference1 + "," + currency1 + "> modificato <" 
							+ "Cambio" + ">: base <" + rate1 + ">, nuovo <" + rate2 + ">");
							flag = true;
						}
						if(rateOpening1 != rateOpening2){
							tRow1.addMessage("Cambio <" +  currencyReference1 + "," + currency1 + "> modificato <" 
							+ "Cambio apertura" + ">: base <" + rateOpening1 + ">, nuovo <" + rateOpening2 + ">");
							flag = true;
						}
					}					
				}//data1
			}//for j
		}//data2	
	}//for i	
		
	
	//Check if there are any added and/or deleted ExchangeRates
	arrUniqueIdsFile1 = getUniqueIds(table1);
	arrUniqueIdsFile2 = getUniqueIds(table2);
	
	arrDifferenze1 = diffArray(arrUniqueIdsFile2,arrUniqueIdsFile1);
	arrDifferenze2 = diffArray(arrUniqueIdsFile1,arrUniqueIdsFile2);
	
	//Deleted ExchangeRates
	if(arrDifferenze1.length > 0){
		for(i=0; i<table1.rowCount; i++){
			var tRow1 = table1.row(i);
			var idTab = tRow1.uniqueId;

			currencyReference1 = tRow1.value('CurrencyReference');
			currency1 = tRow1.value('Currency');
			description1 = tRow1.value('Description');
			multiplier1 = tRow1.value('Multiplier');
			rate1 = tRow1.value('Rate');
			rateOpening1 = tRow1.value('RateOpening');
			
			for(j=0; j<arrDifferenze1.length; j++){
				var idArr = arrDifferenze1[j];
				
				if(idTab == idArr){
					tRow1.addMessage("Cambio <" + currencyReference1 + "," + currency1 + "> eliminato: <" + currencyReference1 + ", " + currency1
					+ ", " + description1 + ", " + multiplier1 + ", " + rate1 + ", " + rateOpening1 + ">");	
				}
			}
		}
		flag = true;
	}
	
	//Added ExchangeRates
	if(arrDifferenze2.length > 0){
		var nameString = file.info("Base","FileName");
		var nameArray = nameString.split('/');
		var fileName = nameArray[nameArray.length - 1];
		
		for(i=0; i<table2.rowCount; i++){
			var tRow2 = table2.row(i);
			var idTab = tRow2.uniqueId;
			currencyReference2 = tRow2.value('CurrencyReference');
			currency2 = tRow2.value('Currency');
			description2 = tRow2.value('Description');
			multiplier2 = tRow2.value('Multiplier');
			rate2 = tRow2.value('Rate');
			rateOpening2 = tRow2.value('RateOpening');
			
			for(j=0; j<arrDifferenze2.length; j++){
				var idArr = arrDifferenze2[j];
				
				if(idTab == idArr){
					tRow2.addMessage("Cambio <" + currencyReference2 + "," + currency2 + "> aggiunto in <" + fileName + ">: <" + currencyReference2 + ", " + currency2
					+ ", " + description2 + ", " + multiplier2 + ", " + rate2 + ", " + rateOpening2 + ">");
				}
			}
		}
		flag = true;
	}
	return flag;
}





//Function that, given two Vat tables,
//compares the rows with equal Vat Code
function compareIva(table1, table2, file){
	
	if(!table1 || !table2){
		return false;
	}
	
	var tRow1, tRow2 =""

	var vatCode_1 = "";
	var description_1 = "";
	var gr_1 ="";
	var gr1_1 ="";
	var isDue_1 ="";
	var amountType_1 = "";
	var vatRate_1 ="";
	var vatRateOnGross_1 = "";
	var vatPercentNonDeductible_1 = "";
	var vatAccount_1 ="";

	var vatCode_2 = "";
	var description_2 = "";
	var gr_2 ="";
	var gr1_2 ="";
	var isDue_2 ="";
	var amountType_2 = "";
	var vatRate_2 ="";
	var vatRateOnGross_2 = "";
	var vatPercentNonDeductible_2 = "";
	var vatAccount_2 ="";
	
	var arrDifferenze1 = [];
	var arrDifferenze2 = [];
	var arrUniqueIdsFile1 = [];
	var arrUniqueIdsFile2 = [];

	var flag = false;
		
	
	for(i=0; i<table2.rowCount; i++){
		tRow2 = table2.row(i);
		vatCode_2 = tRow2.value('VatCode');
		
		if(vatCode_2){	

			description_2 = tRow2.value('Description');
			gr_2 = tRow2.value('Gr');
			gr1_2 = tRow2.value('Gr1');
			isDue_2 = tRow2.value('IsDue');
			amountType_2 = tRow2.value('AmountType');
			vatRate_2 = tRow2.value('VatRate');
			vatRateOnGross_2 = tRow2.value('VatRateOnGross');
			vatPercentNonDeductible_2 = tRow2.value('VatPercentNonDeductible');
			vatAccount_2 = tRow2.value('VatAccount');
			
			
			for(j=0; j<table1.rowCount; j++){
				tRow1 = table1.row(j);
			
				vatCode_1 = tRow1.value('VatCode');
				description_1 = tRow1.value('Description');
				gr_1 = tRow1.value('Gr');
				gr1_1 = tRow1.value('Gr1');
				isDue_1 = tRow1.value('IsDue');
				amountType_1 = tRow1.value('AmountType');
				vatRate_1 = tRow1.value('VatRate');
				vatRateOnGross_1 = tRow1.value('VatRateOnGross');
				vatPercentNonDeductible_1 = tRow1.value('VatPercentNonDeductible');
				vatAccount_1 = tRow1.value('VatAccount');
				
				
				if(vatCode_1){
					
					//If Vat Code are equal then begins the comparison
					if(vatCode_1 == vatCode_2){					
					
						//Show differences if column values are different
						if(description_1 != description_2){
							tRow1.addMessage("Codice IVA <" +  vatCode_1 + "> modificato <" 
							+ "Descrizione" + ">: base <" + description_1 + ">, nuovo <" + description_2 + ">");
							flag = true;
						}
						if(gr_1 != gr_2){
							tRow1.addMessage("Codice IVA <" +  vatCode_1 + "> modificato <" 
							+ "Gr" + ">: base <" + gr_1 + ">, nuovo <" + gr_2 + ">");
							flag = true;
						}
						if(gr1_1 != gr1_2){
							tRow1.addMessage("Codice IVA <" +  vatCode_1 + "> modificato <" 
							+ "Gr1" + ">: base <" + gr1_1 + ">, nuovo <" + gr1_2 + ">");
							flag = true;
						}
						if(isDue_1 != isDue_2){
							tRow1.addMessage("Codice IVA <" +  vatCode_1 + "> modificato <" 
							+ "IVA dovuta" + ">: base <" + isDue_1 + ">, nuovo <" + isDue_2 + ">");
							flag = true;
						}
						if(amountType_1 != amountType_2){
							tRow1.addMessage("Codice IVA <" +  vatCode_1 + "> modificato <" 
							+ "Tipo importo" + ">: base <" + amountType_1 + ">, nuovo <" + amountType_2 + ">");
							flag = true;
						}
						if(vatRate_1 != vatRate_2){
							tRow1.addMessage("Codice IVA <" +  vatCode_1 + "> modificato <" 
							+ "%IVA" + ">: base <" + vatRate_1 + ">, nuovo <" + vatRate_2 + ">");
							flag = true;
						}
						if(vatRateOnGross_1 != vatRateOnGross_2){
							tRow1.addMessage("Codice IVA <" +  vatCode_1 + "> modificato <" 
							+ "%IVA sul lordo" + ">: base <" + vatRateOnGross_1 + ">, nuovo <" + vatRateOnGross_2 + ">");
							flag = true;
						}
						if(vatPercentNonDeductible_1 != vatPercentNonDeductible_2){
							tRow1.addMessage("Codice IVA <" +  vatCode_1 + "> modificato <" 
							+ "%Non.Ded." + ">: base <" + vatPercentNonDeductible_1 + ">, nuovo <" + vatPercentNonDeductible_2 + ">");
							flag = true;
						}
						if(vatAccount_1 != vatAccount_2){
							tRow1.addMessage("Codice IVA <" +  vatCode_1 + "> modificato <" 
							+ "Conto IVA" + ">: base <" + vatAccount_1 + ">, nuovo <" + vatAccount_2 + ">");
							flag = true;
						}
					}					
				}//vatCode_1
			}//for j
		}//vatCode_2	
	} // for i
	
	
		
	//Check if there are any added and/or deleted rows
	arrUniqueIdsFile1 = getUniqueIds(table1);
	arrUniqueIdsFile2 = getUniqueIds(table2);
	
	arrDifferenze1 = diffArray(arrUniqueIdsFile2,arrUniqueIdsFile1);
	arrDifferenze2 = diffArray(arrUniqueIdsFile1,arrUniqueIdsFile2);
	
	//Deleted rows
	if(arrDifferenze1.length > 0){
		for(i=0; i<table1.rowCount; i++){
			var tRow1 = table1.row(i);
			var idTab = tRow1.uniqueId;
			vatCode_1 = tRow1.value('VatCode');
			description_1 = tRow1.value('Description');
			gr_1 = tRow1.value('Gr');
			gr1_1 = tRow1.value('Gr1');
			isDue_1 = tRow1.value('IsDue');
			amountType_1 = tRow1.value('AmountType');
			vatRate_1 = tRow1.value('VatRate');
			vatRateOnGross_1 = tRow1.value('VatRateOnGross');
			vatPercentNonDeductible_1 = tRow1.value('VatPercentNonDeductible');
			vatAccount_1 = tRow1.value('VatAccount');
			
			for(j=0; j<arrDifferenze1.length; j++){
				var idArr = arrDifferenze1[j];
				
				if(idTab == idArr){
					tRow1.addMessage("Codice IVA <" + vatCode_1 + "> eliminato: <" + vatCode_1 + ", " + description_1
					+ ", " + gr_1 + ", " + gr1_1 + ", " + isDue_1 + ", " + amountType_1 + ", " + vatRate_1 + ", " + vatRateOnGross_1
					+ ", " + vatPercentNonDeductible_1 + ", " + vatAccount_1 + ">");
				}
			}
		}
		flag = true;
	}
	
	//Added rows
	if(arrDifferenze2.length > 0){
		var nameString = file.info("Base","FileName");
		var nameArray = nameString.split('/');
		var fileName = nameArray[nameArray.length - 1];
		
		for(i=0; i<table2.rowCount; i++){
			var tRow2 = table2.row(i);
			var idTab = tRow2.uniqueId;
			vatCode_2 = tRow2.value('VatCode');
			description_2 = tRow2.value('Description');
			gr_2 = tRow2.value('Gr');
			gr1_2 = tRow2.value('Gr1');
			isDue_2 = tRow2.value('IsDue');
			amountType_2 = tRow2.value('AmountType');
			vatRate_2 = tRow2.value('VatRate');
			vatRateOnGross_2 = tRow2.value('VatRateOnGross');
			vatPercentNonDeductible_2 = tRow2.value('VatPercentNonDeductible');
			vatAccount_2 = tRow2.value('VatAccount');
			
			for(j=0; j<arrDifferenze2.length; j++){
				var idArr = arrDifferenze2[j];
				
				if(idTab == idArr){
					tRow2.addMessage("Codice IVA <" + vatCode_2 + "> aggiunto in <" + fileName + ">: <" + vatCode_2 + ", " + description_2
					+ ", " + gr_2 + ", " + gr1_2 + ", " + isDue_2 + ", " + amountType_2 + ", " + vatRate_2 + ", " + vatRateOnGross_2
					+ ", " + vatPercentNonDeductible_2 + ", " + vatAccount_2 + ">");
				}
			}
		}
		flag = true;
	}
	return flag;
}





//Function that, given two tables of TRANSACTIONS and the second file,
//compares all the transactions finding the differences (columns)
//compares the two tables finding the deleted and added rows
function compareTransactions(tabTransactions1, tabTransactions2, file){
	
	if(!tabTransactions1 || !tabTransactions2){
		return false;
	}
	
	var tRow1, tRow2 = "";
	var dataVerifica = getDataFinaleDiVerifica(tabTransactions1, tabTransactions2);
	var uniqueId1, uniqueId2 ="";
	var data1, data2 = ""; 
	var description1, description2 = ""; 
	var accountDebit1, accountDebit2 = "";
	var accountCredit1, accountCredit2 = "";
	var amount1, amount2 = "";
	var moneta1, moneta2 = "";
	var cambio1, cambio2 = "";
	var vatCode1, vatCode2 = "";
	var vatRate1, vatRate2 = "";
	var vatPosted1, vatPosted2 = "";
	var cc1_1, cc1_2 = "";
	var cc2_1, cc2_2 = "";
	var cc3_1, cc3_2 = "";
	var arrDifferenze1 = [];
	var arrDifferenze2 = [];
	var flag = false;

	
	for(i=0; i<tabTransactions2.rowCount; i++){
		
		tRow2 = tabTransactions2.row(i);	
		uniqueId2 = tRow2.uniqueId;
		data2 = tRow2.value('Date');
		description2 = tRow2.value('Description');
		accountDebit2 = tRow2.value('AccountDebit');
		accountCredit2 = tRow2.value('AccountCredit');
		amount2 = tRow2.value('Amount');
		moneta2 = tRow2.value('ExchangeCurrency');
		cambio2 = tRow2.value('ExchangeRate');
		vatCode2 = tRow2.value('VatCode');
		vatRate2 = tRow2.value('VatRate');
		vatPosted2 = tRow2.value('VatPosted');
		cc1_2 = tRow2.value('Cc1');
		cc2_2 = tRow2.value('Cc2');
		cc3_2 = tRow2.value('Cc3');
				
		if(data2 && data2 <= dataVerifica){	
	
			for(j=0; j<tabTransactions1.rowCount; j++){
			
				tRow1 = tabTransactions1.row(j);
				uniqueId1 = tRow1.uniqueId;
				data1 = tRow1.value('Date');
				description1 = tRow1.value('Description');
				accountDebit1 = tRow1.value('AccountDebit');
				accountCredit1 = tRow1.value('AccountCredit');
				amount1 = tRow1.value('Amount');
				moneta1 = tRow1.value('ExchangeCurrency');
				cambio1 = tRow1.value('ExchangeRate');
				vatCode1 = tRow1.value('VatCode');
				vatRate1 = tRow1.value('VatRate');
				vatPosted1 = tRow1.value('VatPosted');
				cc1_1 = tRow1.value('Cc1');
				cc2_1 = tRow1.value('Cc2');
				cc3_1 = tRow1.value('Cc3');	
				
				if(data1 && data1 <= dataVerifica){

					//If uniqueIds are equal then begins the comparison
					if(uniqueId1 == uniqueId2){
						
						//Show differences if column values are different
						if(data1 != data2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato Data: base <" + Banana.Converter.toLocaleDateFormat(data1) 
							+ ">, nuovo <" + Banana.Converter.toLocaleDateFormat(data2) + ">");
							flag = true;
						}
						if(description1 != description2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato Descrizione: base <" + description1 + ">, nuovo <" + description2 + ">");
							flag = true;
						}
						if(accountDebit1 != accountDebit2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato Dare: base <" + accountDebit1 + ">, nuovo <" + accountDebit2 + ">");
							flag = true;
						}
						if(accountCredit1 != accountCredit2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato Avere: base <" 
							+ accountCredit1 + ">, nuovo <" + accountCredit2 + ">");
							flag = true;
						}
						if(amount1 != amount2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato Importo: base <" + Banana.Converter.toLocaleNumberFormat(amount1)
							+ ">, nuovo <" + Banana.Converter.toLocaleNumberFormat(amount2) + ">");
							flag = true;
						}
						if(moneta1 != moneta2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato Moneta: base <" + moneta1 + ">, nuovo <" + moneta2 + ">");
							flag = true;
						}
						if(cambio1 != cambio2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato Cambio: base <" + cambio1 + ">, nuovo <" + cambio2 + ">");
							flag = true;
						}
						if(vatCode1 != vatCode2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato Cod. IVA: base <" + vatCode1 + ">, nuovo <" + vatCode2 + ">");
							flag = true;
						}
						if(vatRate1 != vatRate2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato %IVA: base <" + vatRate1 + ">, nuovo <" + vatRate2 + ">");
							flag = true;
						}
						if(vatPosted1 != vatPosted2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato IVA Contab.: base <" + vatPosted1 + ">, nuovo <" + vatPosted2 + ">");
							flag = true;
						}
						if(cc1_1 != cc1_2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato CC1: base <" + cc1_1 + ">, nuovo <" + cc1_2 + ">");
							flag = true;
						}
						if(cc2_1 != cc2_2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato CC2: base <" + cc2_1 + ">, nuovo <" + cc2_2 + ">");
							flag = true;
						}
						if(cc3_1 != cc3_2){
							tRow1.addMessage("Registrazione <" + description1 + "> modificato CC3: base <" + cc3_1 + ">, nuovo <" + cc3_2 + ">");
							flag = true;
						}
					} //uniqueId
				} //data1
			} //for j
		} //data2
	} //for i	

	//Check if there are any added and/or deleted transactions
	arrUniqueIdsFile1 = getUniqueIds(tabTransactions1);
	arrUniqueIdsFile2 = getUniqueIds(tabTransactions2);
	
	arrDifferenze1 = diffArray(arrUniqueIdsFile2,arrUniqueIdsFile1);
	arrDifferenze2 = diffArray(arrUniqueIdsFile1,arrUniqueIdsFile2);
	
	//Deleted transactions
	if(arrDifferenze1.length > 0){
		for(i=0; i<tabTransactions1.rowCount; i++){
			var tRow1 = tabTransactions1.row(i);
			var idTab = tRow1.uniqueId;
			data1 = tRow1.value('Date');
			description1 = tRow1.value('Description');
			accountDebit1 = tRow1.value('AccountDebit');
			accountCredit1 = tRow1.value('AccountCredit');
			amount1 = tRow1.value('Amount');
			moneta1 = tRow1.value('ExchangeCurrency');
			cambio1 = tRow1.value('ExchangeRate');
			vatCode1 = tRow1.value('VatCode');
			vatRate1 = tRow1.value('VatRate');
			vatPosted1 = tRow1.value('VatPosted');
			cc1_1 = tRow1.value('Cc1');
			cc2_1 = tRow1.value('Cc2');
			cc3_1 = tRow1.value('Cc3');	
			
			for(j=0; j<arrDifferenze1.length; j++){
				var idArr = arrDifferenze1[j];
				
				if(idTab == idArr){
					tRow1.addMessage("Registrazione <" + description1 + "> eliminata: <" + Banana.Converter.toLocaleDateFormat(data1) + ", " + description1 
					+ ", " + accountDebit1 + ", " + accountCredit1 + ", " + Banana.Converter.toLocaleNumberFormat(amount1) + ", " + moneta1 + ", " 
					+ cambio1 + ", " + vatCode1 + ", " + vatRate1 + ", " + vatPosted1 + ", " + cc1_1 + ", " + cc2_1 + ", " + cc3_1);	
				}
			}
		}
		flag = true;
	}
	
	//Added transactions
	if(arrDifferenze2.length > 0){
		var nameString = file.info("Base","FileName");
		var nameArray = nameString.split('/');
		var fileName = nameArray[nameArray.length - 1];
		
		for(i=0; i<tabTransactions2.rowCount; i++){
			var tRow2 = tabTransactions2.row(i);
			var idTab = tRow2.uniqueId;
			data2 = tRow2.value('Date');
			description2 = tRow2.value('Description');
			accountDebit2 = tRow2.value('AccountDebit');
			accountCredit2 = tRow2.value('AccountCredit');
			amount2 = tRow2.value('Amount');
			moneta2 = tRow2.value('ExchangeCurrency');
			cambio2 = tRow2.value('ExchangeRate');
			vatCode2 = tRow2.value('VatCode');
			vatRate2 = tRow2.value('VatRate');
			vatPosted2 = tRow2.value('VatPosted');
			cc1_2 = tRow2.value('Cc1');
			cc2_2 = tRow2.value('Cc2');
			cc3_2 = tRow2.value('Cc3');
			
			for(j=0; j<arrDifferenze2.length; j++){
				var idArr = arrDifferenze2[j];
				
				if(idTab == idArr){
					tRow2.addMessage("Registrazione <" + description2 + "> aggiunta in <" + fileName + ">: <" + Banana.Converter.toLocaleDateFormat(data2) + ", " + description2 
					+ ", " + accountDebit2 + ", " + accountCredit2 + ", " + Banana.Converter.toLocaleNumberFormat(amount2) + ", " + moneta2 + ", " 
					+ cambio2 + ", " + vatCode2 + ", " + vatRate2 + ", " + vatPosted2 + ", " + cc1_2 + ", " + cc2_2 + ", " + cc3_2);	
				}
			}
		}
		flag = true;
	}
	return flag;
}



//Funzione per la creazione degli stili per il report
function CreaStyleSheet1() {
	var docStyles = Banana.Report.newStyleSheet();
	var pageStyle = docStyles.addStyle("@page");
  	pageStyle.setAttribute("margin", "20m 15mm 15mm 25mm");
		
	//Tabella
	var tableStyle1 = docStyles.addStyle(".tableProva1");
	tableStyle1.setAttribute("width", "100%");
  	tableStyle1.setAttribute("border-left", "thin solid black");
	tableStyle1.setAttribute("border-top", "thin solid black");
	tableStyle1.setAttribute("border-bottom", "thin solid black");
	tableStyle1.setAttribute("border-right", "thin solid black");
  	docStyles.addStyle("table.tableProva1 td", "border-top: thin solid black; border-left: thin solid black; border-bottom: thin solid black; padding: 3px;");	
	
	return docStyles;
}
