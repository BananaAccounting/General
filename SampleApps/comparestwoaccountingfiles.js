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
// @pubdate = 2016-01-20
// @publisher = Banana.ch SA
// @description = Compare with another accounting file
// @task = app.command
// @doctype = 100.*;110.*;130.*
// @outputformat = none
// @inputdatasource = none
// @includejs = 
// @timeout = -1
//


/**
	Main function
*/
function exec(string) {
    
	//Check if we are on an opened document
	if (!Banana.document)
		return;
	var transactions = Banana.document.table('Transactions');
	var accounts = Banana.document.table('Accounts');
	var exchangeRates = Banana.document.table('ExchangeRates');
	var vatCodes = Banana.document.table('VatCodes');
	var categories = Banana.document.table('Categories');
	var budget = Banana.document.table('Budget');
	var documents = Banana.document.table('Documents');
	
	//Open a dialog window asking the user to select the .ac2 file to compare
	var file2 = Banana.application.openDocument("*.*");
	
	//Check if the file has been selected and opened
	if(!file2){
		return;
	}
	else{
		
		//Variables used for the file2
		var transactions1 = file2.table('Transactions');
		var accounts1 = file2.table('Accounts');
		var exchangeRates1 = file2.table('ExchangeRates');
		var vatCodes1 = file2.table('VatCodes');
		var categories1 = file2.table('Categories');
		var budget1 = file2.table('Budget');
		var documents1 = file2.table('Documents');

		//Clear all the messages from the messages tab
		Banana.document.clearMessages();
		file2.clearMessages();
		
				
		//------------------------------------------------------------------------------//
		// COMPARE THE TWO FILES
		//------------------------------------------------------------------------------//
		
		var flag = false;
			
		//1) Function call to compare the rounding. If there are differences the flag is set to true
		if(compareRounding(file2)) {
			flag = true;
		}
		
		//2) Function call to compare the decimals numbers. If there are differences the flag is set to true
		if(compareDecimals(file2)){
			flag = true;
		}
		
		//3) Function call to compare the VAT rounding. If there are differences the flag is set to true
		if(compareRoundingVat(file2)){
			flag = true;
		}
	
		//4) Function call to compare the tables Accounts and Bank Statement. If there are differences the flag is set to true
		if(compareBankStatements(accounts, accounts1, transactions, transactions1, file2)){
			flag = true;
		}
		
		//5) Function call to compare the tables Categories. If there are differences the flag is set to true
		if(compareBankStatements(categories, categories1, transactions, transactions1, file2)){
			flag = true;
		}
		
		//6) Function call to compare the tables Exchange rate table. If there are differences the flag is set to true
		if(compareExchangeRates(exchangeRates, exchangeRates1, file2)){
			flag = true;
		}

		//7) Function call to compare the tables VAT Accounts. If there are differences the flag is set to true
		if(compareVatTable(vatCodes, vatCodes1, file2)){
			flag = true;
		}
	
		//8) Function call to compare the tables Transactions. If there are differences the flag is set to true
		if(compareTransactions(transactions, transactions1, file2)){
			flag = true;
		}

		//9) Function call to compare the tables Budget. If there are differences the flag is set to true
		if(compareBudget(budget, budget1, file2)){
			flag = true;
		}

		//10) Function call to compare the tables Documents. If there are differences the flag is set to true
		if (compareDocuments(documents, documents1)) {
			flag = true;
		}
	
		//Shows a messages if there are not differences between the two files
		if(!flag){
			var openingDate = Banana.document.info("AccountingDataBase","OpeningDate");
			var dataVerifica = getDateOfVerification(transactions, transactions1);
			
			Banana.Ui.showInformation("Information", "No differences from <" + Banana.Converter.toLocaleDateFormat(openingDate) 
			+ "> to <"+ Banana.Converter.toLocaleDateFormat(dataVerifica) + ">");
		}	
	}
}


//------------------------------------------------------------------------------//
// FUNCTIONS
//------------------------------------------------------------------------------//

/**
	Function that checks that the Account is valid
*/
function checkAccount(conto) {
	var controllo = 1;
	if (!Banana.document.table('Accounts').findRowByValue('Account',conto) || !conto) {
		return false;
	} else{
		return true;
	}
}


/**
	Function that compares two arrays and returns an array containing all the differences
*/
function diffArray(a, b) {
	var seen = [], diff = [];
	for (var i = 0; i < a.length; i++) {
		seen[a[i]] = true;
	}
	for(var i = 0; i < b.length; i++) {
		if (!seen[b[i]]) {
			diff.push(b[i]);
		}
	}
	return diff;
}


/**
	Function that returns an array containing all the accounts of the table Accounts
*/
function getAccounts(tabella){
	
	var tRow = "";
	var arrConti = [];
		
	for(var i = 0; i < tabella.rowCount; i++) {
		tRow = tabella.row(i);

		if (tRow.value('Account')) {
			arrConti.push(tRow.value('Account'));
		}
	}
	return arrConti;
}


/**
	Function that returns an array containing all the UniqueID of the rows for the given table
*/
function getUniqueIds(tabella) {

	var tRow = "";
	var arrUniqueIds = [];
	
	for (var i = 0; i < tabella.rowCount; i++) {
		tRow = tabella.row(i);

		if(tRow.uniqueId){
			arrUniqueIds.push(tRow.uniqueId);
		}
	}
	return arrUniqueIds;
}


/**
	Function that, given a table and a column, returns an array containing all the elements of the column
*/
function getTableByKey(table, keyColumn) {
	
	var tRow = "";
	var arrElements = [];
	
	for(var i = 0; i < table.rowCount; i++) {
		tRow = table.row(i);

		if(tRow.value(keyColumn)){
			arrElements.push(tRow.value(keyColumn));
		}	
	}
	return arrElements;
}


/**
	Function that, given two tables, extract the last date of each table and returns the "youngest".
	It is used to extract the dates from the table Transactions in order to use the correct one
*/
function getDateOfVerification(tab1, tab2){

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


/**
	Function that reads all the dates and returns the last one for the given table
*/
function getLastTransactionDate(tab1) {
	var data = "";
	var dataRow = "";
	for (var i = 0; i < tab1.rowCount; i++) {
		dataRow = tab1.value(i, "Date");
		
		if (dataRow > data) {
			data = dataRow;
		}
	}
	return data;
}


/**
	Function that compares the rounding between the two files
*/
function compareRounding(file) {

	var tipoArrotondamento1 = Banana.document.info("Base","RoundingType");
	var tipoArrotondamento2 = file.info("Base","RoundingType");
	
	if (tipoArrotondamento1 != tipoArrotondamento2) {
			Banana.document.addMessage("[Accounting] different type of rounding: CURRENT <" + tipoArrotondamento1 +">, OTHER <" + tipoArrotondamento2 + ">");
		return true;
	} else {
		return false;
	}
}


/**
	Function that compares the decimals numbers between the two files
*/
function compareDecimals(file) {
	
	var numeroDecimali1 = Banana.document.info("Base","DecimalsAmounts");
	var numeroDecimali2 = file.info("Base","DecimalsAmounts");

	if (numeroDecimali1 != numeroDecimali2) {
			Banana.document.addMessage("[Accounting] different number of decimals: CURRENT <" + numeroDecimali1 +">, OTHER <" + numeroDecimali2 + ">");
		return true;
	} else {
		return false;
	}
}


/**
	Function that compares the VAT rounding between the two files
*/
function compareRoundingVat(file) {
	
	var arrIva1 = Banana.document.info("AccountingDataBase","VatRounding");
	var arrIva2 = file.info("AccountingDataBase","VatRounding");

	if (arrIva1 != arrIva2) {
			Banana.document.addMessage("[Accounting] different VAT rounding: CURRENT <" + arrIva1 +">, OTHER <" + arrIva2 + ">");
		return true;
	} else {
		return false;
	}
}


/**
	Function that compares the Bank Statements of the two files.
	Given the Accounts and Transactions tables of the two files, the function:
	- extracts all the accounts numbers
	- for each account creates the Bank Statement table
	- from the bank statement extracts the Opening and the final balance
	- the values between the two files are compared only if belonging to the same account
	- any differences are shown as messages into the primary file (the one opened in Banana)
	- compares the rounding type, decimals numbers, VAT rounding
**/
function compareBankStatements(tabAccounts1, tabAccounts2, tabTransactions1, tabTransactions2, file) {
	
	if (!tabAccounts1 || !tabAccounts2) {
		return false;
	}
	
	if (!tabTransactions1 || !tabTransactions2) {
		return false;
	}
	
	var numeroConto1, numeroConto2, descrizione, currentBal1, currentBal2, openingBalance1, openingBalance2, endBalance1, endBalance2 = "";
	var arrContiFile1 = [], arrContiFile2 = [], arrDifferenze1 = [], arrDifferenze2 = []; 
	var tabellaEstrattoConto1, tabellaEstrattoConto2 = "";
	var tRow1, tRow2 ="";
	var dataVerifica = getDateOfVerification(tabTransactions1, tabTransactions2);
	var flag = false;
			
	for (var i = 0; i < tabAccounts2.rowCount; i++) {
		tRow2 = tabAccounts2.row(i);
		numeroConto2 = tRow2.value('Account');
		tabellaEstrattoConto2 = file.currentCard(numeroConto2);
	
		if (checkAccount(numeroConto2)) {
			currentBal2 = file.currentBalance(numeroConto2,'', dataVerifica);
			openingBalance2 = currentBal2.opening;
			endBalance2 = currentBal2.balance;
			
			for (var j = 0; j < tabAccounts1.rowCount; j++) {
				tRow1 = tabAccounts1.row(j); 
				numeroConto1 = tRow1.value('Account');
				descrizione = tRow1.value('Description');
				tabellaEstrattoConto1 = Banana.document.currentCard(numeroConto1);
					
				if (checkAccount(numeroConto1)) {
					//Check if the accounts are the same
					if (numeroConto1 == numeroConto2) {
						currentBal1 = Banana.document.currentBalance(numeroConto1,'', dataVerifica);
						openingBalance1 = currentBal1.opening;
						endBalance1 = currentBal1.balance;
						
						//Compare, if there are differences set the flag to true								
						if (openingBalance1 != openingBalance2) {
							tRow1.addMessage("Account <" + numeroConto1 + " " + descrizione + "> different opening balance: CURRENT <" 
							+ Banana.Converter.toLocaleNumberFormat(openingBalance1)
							+ ">, OTHER <" + 	Banana.Converter.toLocaleNumberFormat(openingBalance2) + ">");
							flag = true;
						}
						if (endBalance1 != endBalance2) {
							tRow1.addMessage("Account <" + numeroConto1 + " " + descrizione + "> balance at <" + Banana.Converter.toLocaleDateFormat(dataVerifica) 
							+ "> different: CURRENT <" + Banana.Converter.toLocaleNumberFormat(endBalance1)
							+ ">, OTHER <" + 	Banana.Converter.toLocaleNumberFormat(endBalance2) + ">");
							flag = true;
						}
					}				
				}
			}
		}
	}
	
	//Check of any added/removed accounts of the File2
	arrContiFile1 = getAccounts(tabAccounts1);
	arrContiFile2 = getAccounts(tabAccounts2);
		
	arrDifferenze1 = diffArray(arrContiFile2, arrContiFile1);
	arrDifferenze2 = diffArray(arrContiFile1, arrContiFile2);
	
	//Deleted accounts
	if (arrDifferenze1.length > 0) {				
		for (var i = 0; i < tabAccounts1.rowCount; i++) {
			var tRow1 = tabAccounts1.row(i); 
			var numeroContoTab = tRow1.value('Account');
			var descrizione = tRow1.value('Description');
			
			for (var j = 0; j < arrDifferenze1.length; j++) {
				var numeroContoArr = arrDifferenze1[j];
				
				if (numeroContoTab == numeroContoArr) {
					//Add messages to the "current" file
					tRow1.addMessage("Account <" + numeroContoTab + " " + descrizione + "> NOT in OTHER"); 
				}
			}
		}
		flag = true;
	}
	//Added accounts
	if (arrDifferenze2.length > 0) {
		for (var i = 0; i < tabAccounts2.rowCount; i++) {
			var tRow2 = tabAccounts2.row(i); 
			var numeroContoTab = tRow2.value('Account');
			var descrizione = tRow2.value('Description');
				
			for (var j = 0; j < arrDifferenze2.length; j++) {
				var numeroContoArr = arrDifferenze2[j];
					
				if (numeroContoTab == numeroContoArr) {

					//Add message to the "current" file, specifying the row of the "other" file
					var r = parseInt(tRow2.rowNr);
					var rr = r+1;

					Banana.document.addMessage("[Accounts: Row " + rr + "] Account <" + numeroContoTab + " " + descrizione + "> NOT in CURRENT");
				}
			}
		}
		flag = true;
	}
	return flag;
}


/**
	Function that, given two ExchangeRates tables, compares all the rows with equal Currency Reference and Currency
*/
function compareExchangeRates(table1, table2, file){
	
	if (!table1 || !table2) {
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
	
	
	for (var i = 0; i < table2.rowCount; i++) {
		tRow2 = table2.row(i);
		data2 = tRow2.value('Date');
		
		//Check if Date are NULL then begins comparison
		if (!data2 && !tRow2.isEmpty) {	

			currencyReference2 = tRow2.value('CurrencyReference');
			currency2 = tRow2.value('Currency');
			description2 = tRow2.value('Description');
			multiplier2 = tRow2.value('Multiplier');
			rate2 = tRow2.value('Rate');
			rateOpening2 = tRow2.value('RateOpening');
						
			for (var j = 0; j < table1.rowCount; j++) {
				tRow1 = table1.row(j);
				data1 = tRow1.value('Date');
				currencyReference1 = tRow1.value('CurrencyReference');
				currency1 = tRow1.value('Currency');
				description1 = tRow1.value('Description');
				multiplier1 = tRow1.value('Multiplier');
				rate1 = tRow1.value('Rate');
				rateOpening1 = tRow1.value('RateOpening');
			
				//Check if Date are NULL then begins comparison
				if (!data1 && !tRow1.isEmpty) {

					//If Currency Reference are equal then begins the comparison
					if ((currencyReference1 == currencyReference2) && (currency1 == currency2)) {
						
						//Show differences if column values are different						
						if (description1 != description2) {
							tRow1.addMessage("Exchange rate <" +  currencyReference1 + "," + currency1 + "> edited <" 
							+ "Text" + ">: CURRENT <" + description1 + ">, OTHER <" + description2 + ">");
							flag = true;
						}
						if (multiplier1 != multiplier2) {
							tRow1.addMessage("Exchange rate <" +  currencyReference1 + "," + currency1 + "> edited <" 
							+ "Multiplier" + ">: CURRENT <" + multiplier1 + ">, OTHER <" + multiplier2 + ">");
							flag = true;
						}
						if (rate1 != rate2) {
							tRow1.addMessage("Exchange rate <" +  currencyReference1 + "," + currency1 + "> edited <" 
							+ "Rate" + ">: CURRENT <" + rate1 + ">, OTHER <" + rate2 + ">");
							flag = true;
						}
						if (rateOpening1 != rateOpening2) {
							tRow1.addMessage("Exchange rate <" +  currencyReference1 + "," + currency1 + "> edited <" 
							+ "Opening rate" + ">: CURRENT <" + rateOpening1 + ">, OTHER <" + rateOpening2 + ">");
							flag = true;
						}
					}					
				}
			}
		}
	}
		
	
	//Check if there are any added and/or deleted ExchangeRates
	arrUniqueIdsFile1 = getUniqueIds(table1);
	arrUniqueIdsFile2 = getUniqueIds(table2);
	
	arrDifferenze1 = diffArray(arrUniqueIdsFile2,arrUniqueIdsFile1);
	arrDifferenze2 = diffArray(arrUniqueIdsFile1,arrUniqueIdsFile2);
	
	//Deleted ExchangeRates
	if (arrDifferenze1.length > 0) {
		for (var i = 0; i < table1.rowCount; i++) {
			var tRow1 = table1.row(i);
			var idTab = tRow1.uniqueId;
			currencyReference1 = tRow1.value('CurrencyReference');
			currency1 = tRow1.value('Currency');
			description1 = tRow1.value('Description');
			multiplier1 = tRow1.value('Multiplier');
			rate1 = tRow1.value('Rate');
			rateOpening1 = tRow1.value('RateOpening');
			
			for (var j = 0; j < arrDifferenze1.length; j++) {
				var idArr = arrDifferenze1[j];
				
				if (idTab == idArr) {
					//Add a message to the "current" file
					tRow1.addMessage("Exchange rate <" + currencyReference1 + "," + currency1 + "> NOT in OTHER: <" 
					+ currencyReference1 + ", " + currency1 + ", " + description1 + ", " + multiplier1 + ", " + rate1 + ", " + rateOpening1 + ">");	
				}
			}
		}
		flag = true;
	}
	
	//Added ExchangeRates
	if (arrDifferenze2.length > 0) {		
		for (var i = 0; i < table2.rowCount; i++) {
			var tRow2 = table2.row(i);
			var idTab = tRow2.uniqueId;
			currencyReference2 = tRow2.value('CurrencyReference');
			currency2 = tRow2.value('Currency');
			description2 = tRow2.value('Description');
			multiplier2 = tRow2.value('Multiplier');
			rate2 = tRow2.value('Rate');
			rateOpening2 = tRow2.value('RateOpening');
			
			for (var j = 0; j < arrDifferenze2.length; j++) {
				var idArr = arrDifferenze2[j];
				
				if (idTab == idArr) {
					//Add message to the "current" file, specifying the row of the "other" file
					var r = parseInt(tRow2.rowNr);
					var rr = r+1;

					Banana.document.addMessage("[Exchange rates: Row " + rr + "] Exchange rate <" + currencyReference2 + "," + currency2 
					+ "> NOT in CURRENT: <" + currencyReference2 + ", " + currency2
					+ ", " + description2 + ", " + multiplier2 + ", " + rate2 + ", " + rateOpening2 + ">");
				}
			}
		}
		flag = true;
	}
	return flag;
}


/**
	Function that, given two VAT tables, compares the rows with equal Vat Code
*/
function compareVatTable(table1, table2, file) {
	
	if (!table1 || !table2) {
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
		
	
	for (var i = 0; i < table2.rowCount; i++) {
		tRow2 = table2.row(i);
		vatCode_2 = tRow2.value('VatCode');
		
		if (vatCode_2) {	

			description_2 = tRow2.value('Description');
			gr_2 = tRow2.value('Gr');
			gr1_2 = tRow2.value('Gr1');
			isDue_2 = tRow2.value('IsDue');
			amountType_2 = tRow2.value('AmountType');
			vatRate_2 = tRow2.value('VatRate');
			vatRateOnGross_2 = tRow2.value('VatRateOnGross');
			vatPercentNonDeductible_2 = tRow2.value('VatPercentNonDeductible');
			vatAccount_2 = tRow2.value('VatAccount');
			
			
			for (var j = 0; j < table1.rowCount; j++) {
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
				
				
				if (vatCode_1) {
					
					//If Vat Code are equal then begins the comparison
					if (vatCode_1 == vatCode_2) {					
					
						//Show differences if column values are different
						if (description_1 != description_2) {
							tRow1.addMessage("VAT code <" +  vatCode_1 + "> edited <" 
							+ "Description" + ">: CURRENT <" + description_1 + ">, OTHER <" + description_2 + ">");
							flag = true;
						}
						if (gr_1 != gr_2) {
							tRow1.addMessage("VAT code <" +  vatCode_1 + "> edited <" 
							+ "Gr" + ">: CURRENT <" + gr_1 + ">, OTHER <" + gr_2 + ">");
							flag = true;
						}
						if (gr1_1 != gr1_2) {
							tRow1.addMessage("VAT code <" +  vatCode_1 + "> edited <" 
							+ "Gr1" + ">: CURRENT <" + gr1_1 + ">, OTHER <" + gr1_2 + ">");
							flag = true;
						}
						if (isDue_1 != isDue_2) {
							tRow1.addMessage("VAT code <" +  vatCode_1 + "> edited <" 
							+ "VAT due" + ">: CURRENT <" + isDue_1 + ">, OTHER <" + isDue_2 + ">");
							flag = true;
						}
						if (amountType_1 != amountType_2) {
							tRow1.addMessage("VAT code <" +  vatCode_1 + "> edited <" 
							+ "Amount type" + ">: CURRENT <" + amountType_1 + ">, OTHER <" + amountType_2 + ">");
							flag = true;
						}
						if (vatRate_1 != vatRate_2) {
							tRow1.addMessage("VAT code <" +  vatCode_1 + "> edited <" 
							+ "%VAT rate" + ">: CURRENT <" + vatRate_1 + ">, OTHER <" + vatRate_2 + ">");
							flag = true;
						}
						if (vatRateOnGross_1 != vatRateOnGross_2) {
							tRow1.addMessage("VAT code <" +  vatCode_1 + "> edited <" 
							+ "%VAT rate on gross" + ">: CURRENT <" + vatRateOnGross_1 + ">, OTHER <" + vatRateOnGross_2 + ">");
							flag = true;
						}
						if (vatPercentNonDeductible_1 != vatPercentNonDeductible_2) {
							tRow1.addMessage("VAT code <" +  vatCode_1 + "> edited <" 
							+ "%VAT non deductible" + ">: CURRENT <" + vatPercentNonDeductible_1 + ">, OTHER <" + vatPercentNonDeductible_2 + ">");
							flag = true;
						}
						if (vatAccount_1 != vatAccount_2) {
							tRow1.addMessage("VAT code <" +  vatCode_1 + "> edited <" 
							+ "VAT account" + ">: CURRENT <" + vatAccount_1 + ">, OTHER <" + vatAccount_2 + ">");
							flag = true;
						}
					}					
				}
			}
		}
	}
	
	//Check if there are any added and/or deleted rows
	arrUniqueIdsFile1 = getUniqueIds(table1);
	arrUniqueIdsFile2 = getUniqueIds(table2);
	
	arrDifferenze1 = diffArray(arrUniqueIdsFile2,arrUniqueIdsFile1);
	arrDifferenze2 = diffArray(arrUniqueIdsFile1,arrUniqueIdsFile2);
	
	//Deleted rows
	if (arrDifferenze1.length > 0) {
		for (var i = 0; i < table1.rowCount; i++) {
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
			
			for (var j = 0; j < arrDifferenze1.length; j++) {
				var idArr = arrDifferenze1[j];
				
				if (idTab == idArr) {
					tRow1.addMessage("VAT code <" + vatCode_1 + "> NOT in OTHER: <" + vatCode_1 + ", " + description_1
					+ ", " + gr_1 + ", " + gr1_1 + ", " + isDue_1 + ", " + amountType_1 + ", " + vatRate_1 + ", " + vatRateOnGross_1
					+ ", " + vatPercentNonDeductible_1 + ", " + vatAccount_1 + ">");
				}
			}
		}
		flag = true;
	}
	
	//Added rows
	if (arrDifferenze2.length > 0) {
		// var nameString = file.info("Base","FileName");
		// var nameArray = nameString.split('/');
		// var fileName = nameArray[nameArray.length - 1];
		
		for (var i = 0; i < table2.rowCount; i++) {
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
			
			for (var j = 0; j < arrDifferenze2.length; j++) {
				var idArr = arrDifferenze2[j];
				
				if (idTab == idArr) {

					//Add message to the "current" file, specifying the row of the "other" file
					var r = parseInt(tRow2.rowNr);
					var rr = r+1;

					Banana.document.addMessage("[VAT Codes: Row " + rr + "] VAT code <" + vatCode_2 + "> NOT in CURRENT: <" 
					+ vatCode_2 + ", " + description_2 + ", " + gr_2 + ", " + gr1_2 + ", " + isDue_2 + ", " + amountType_2 + ", " + vatRate_2 
					+ ", " + vatRateOnGross_2 + ", " + vatPercentNonDeductible_2 + ", " + vatAccount_2 + ">");
				}
			}
		}
		flag = true;
	}
	return flag;
}


/**
	Function that, given two Transactions tables and the second file:
	- compares all the transactions finding the differences (columns)
	- compares the two tables finding the deleted and added rows
*/
function compareTransactions(tabTransactions1, tabTransactions2, file) {
	
	if (!tabTransactions1 || !tabTransactions2) {
		return false;
	}
	
	var tRow1, tRow2 = "";
	var dataVerifica = getDateOfVerification(tabTransactions1, tabTransactions2);
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

	
	for (var i = 0; i < tabTransactions2.rowCount; i++) {
		
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
				
		if (data2 && data2 <= dataVerifica) {	
	
			for (var j = 0; j < tabTransactions1.rowCount; j++) {
			
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
				
				if (data1 && data1 <= dataVerifica) {

					//If uniqueIds are equal then begins the comparison
					if (uniqueId1 == uniqueId2) {
						
						//Show differences if column values are different
						if (data1 != data2) {
							tRow1.addMessage("Edited Date: CURRENT <" + Banana.Converter.toLocaleDateFormat(data1) 
							+ ">, OTHER <" + Banana.Converter.toLocaleDateFormat(data2) + ">");
							flag = true;
						}
						if (description1 != description2) {
							tRow1.addMessage("Edited Description: CURRENT <" + description1 + ">, OTHER <" + description2 + ">");
							flag = true;
						}
						if (accountDebit1 != accountDebit2) {
							tRow1.addMessage("Edited Debit Account: CURRENT <" + accountDebit1 + ">, OTHER <" + accountDebit2 + ">");
							flag = true;
						}
						if (accountCredit1 != accountCredit2) {
							tRow1.addMessage("Edited Credit Account: CURRENT <" 
							+ accountCredit1 + ">, OTHER <" + accountCredit2 + ">");
							flag = true;
						}
						if (amount1 != amount2) {
							tRow1.addMessage("Edited Amount: CURRENT <" + Banana.Converter.toLocaleNumberFormat(amount1)
							+ ">, OTHER <" + Banana.Converter.toLocaleNumberFormat(amount2) + ">");
							flag = true;
						}
						if (moneta1 != moneta2) {
							tRow1.addMessage("Edited Currency: CURRENT <" + moneta1 + ">, OTHER <" + moneta2 + ">");
							flag = true;
						}
						if (cambio1 != cambio2) {
							tRow1.addMessage("Edited Exchange rate: CURRENT <" + cambio1 + ">, OTHER <" + cambio2 + ">");
							flag = true;
						}
						if (vatCode1 != vatCode2) {
							tRow1.addMessage("Edited VAT code: CURRENT <" + vatCode1 + ">, OTHER <" + vatCode2 + ">");
							flag = true;
						}
						if (vatRate1 != vatRate2) {
							tRow1.addMessage("Edited %VAT: CURRENT <" + vatRate1 + ">, OTHER <" + vatRate2 + ">");
							flag = true;
						}
						if (vatPosted1 != vatPosted2) {
							tRow1.addMessage("Edited IVA posted: CURRENT <" + vatPosted1 + ">, OTHER <" + vatPosted2 + ">");
							flag = true;
						}
						if (cc1_1 != cc1_2) {
							tRow1.addMessage("Edited CC1: CURRENT <" + cc1_1 + ">, OTHER <" + cc1_2 + ">");
							flag = true;
						}
						if (cc2_1 != cc2_2) {
							tRow1.addMessage("Edited CC2: CURRENT <" + cc2_1 + ">, OTHER <" + cc2_2 + ">");
							flag = true;
						}
						if (cc3_1 != cc3_2) {
							tRow1.addMessage("Edited CC3: CURRENT <" + cc3_1 + ">, OTHER <" + cc3_2 + ">");
							flag = true;
						}
					}
				}
			}
		}
	}

	//Check if there are any added and/or deleted transactions
	arrUniqueIdsFile1 = getUniqueIds(tabTransactions1);
	arrUniqueIdsFile2 = getUniqueIds(tabTransactions2);
	
	arrDifferenze1 = diffArray(arrUniqueIdsFile2,arrUniqueIdsFile1);
	arrDifferenze2 = diffArray(arrUniqueIdsFile1,arrUniqueIdsFile2);
	
	//Deleted transactions
	if (arrDifferenze1.length > 0) {
		for (var i = 0; i < tabTransactions1.rowCount; i++) {
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
			
			for (var j = 0; j < arrDifferenze1.length; j++) {
				var idArr = arrDifferenze1[j];
				
				if (idTab == idArr) {
					tRow1.addMessage("Transaction <" + description1 + "> NOT in OTHER: <" + Banana.Converter.toLocaleDateFormat(data1) 
					+ ", " + description1 + ", " + accountDebit1 + ", " + accountCredit1 + ", " + Banana.Converter.toLocaleNumberFormat(amount1) + ", " 
					+ moneta1 + ", " + cambio1 + ", " + vatCode1 + ", " + vatRate1 + ", " + vatPosted1 + ", " + cc1_1 + ", " + cc2_1 + ", " + cc3_1);	
				}
			}
		}
		flag = true;
	}
	
	//Added transactions
	if (arrDifferenze2.length > 0) {
		// var nameString = file.info("Base","FileName");
		// var nameArray = nameString.split('/');
		// var fileName = nameArray[nameArray.length - 1];
		
		for (var i = 0; i < tabTransactions2.rowCount; i++) {
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
			
			for (var j = 0; j < arrDifferenze2.length; j++) {
				var idArr = arrDifferenze2[j];
				
				if (idTab == idArr) {
					
					//Add message to the "current" file, specifying the row of the "other" file
					var r = parseInt(tRow2.rowNr);
					var rr = r+1;

					Banana.document.addMessage("[Transactions: Row " + rr + "] Transaction <" + description2 + "> NOT in CURRENT: <" 
					+ Banana.Converter.toLocaleDateFormat(data2) + ", " + description2 + ", " + accountDebit2 + ", " + accountCredit2 + ", " 
					+ Banana.Converter.toLocaleNumberFormat(amount2) + ", " + moneta2 + ", " + cambio2 + ", " + vatCode2 + ", " + vatRate2 + ", " 
					+ vatPosted2 + ", " + cc1_2 + ", " + cc2_2 + ", " + cc3_2);
				}
			}
		}
		flag = true;
	}
	return flag;
}


/**
	Function that compares the two Budget tables finding all the differences
*/
function compareBudget(tabBudget1, tabBudget2, file) {

	if (!tabBudget1 && !tabBudget2) {
		return false;
	}
	else if (tabBudget1 && !tabBudget2) {
		Banana.document.addMessage("Table Budget exists in CURRENT and not in OTHER");
		flag = true;
	}
	else if (!tabBudget1 && tabBudget2) {
		Banana.document.addMessage("Table Budget exists in OTHER and not in CURRENT");
		flag = true;
	}
	else if (tabBudget1 && tabBudget2) {
		var tRow1, tRow2 = "";
		var dataVerifica = getDateOfVerification(tabBudget1, tabBudget2);
		var uniqueId1, uniqueId2 ="";
		var data1, data2 = "";
		var dataEnd1, dataEnd2 = "";
		var repeat1, repeat2 = ""; 
		var description1, description2 = ""; 
		var accountDebit1, accountDebit2 = "";
		var accountCredit1, accountCredit2 = "";
		var quantity1, quantity2 = "";
		var unitReference1, unitReference2 = "";
		var unitPrice1, unitPrice2 = "";
		var formulaAmountBaseCurrency1, formulaAmountBaseCurrency2 = "";
		var amount1, amount2 = "";
		var amountTotal1, amountTotal2 = "";
		var vatCode1, vatCode2 = "";
		var vatRate1, vatRate2 = "";
		var arrDifferenze1 = [];
		var arrDifferenze2 = [];
		var flag = false;

		for (var i = 0; i < tabBudget2.rowCount; i++) {
			tRow2 = tabBudget2.row(i);	
			uniqueId2 = tRow2.uniqueId;
			data2 = tRow2.value('Date');
			dataEnd2 = tRow2.value('DateEnd');
			repeat2 = tRow2.value('Repeat');
			description2 = tRow2.value('Description');
			accountDebit2 = tRow2.value('AccountDebit');
			accountCredit2 = tRow2.value('AccountCredit');
			quantity2 = tRow2.value('Quantity');
			unitReference2 = tRow2.value('UnitReference');
			unitPrice2 = tRow2.value('UnitPrice');
			formulaAmountBaseCurrency2 = tRow2.value('FormulaAmountBaseCurrency');
			amount2 = tRow2.value('Amount');
			amountTotal2 = tRow2.value('AmountTotal');
			vatCode2 = tRow2.value('VatCode');
			vatRate2 = tRow2.value('VatRate');
					
			if (data2) {
				for (var j = 0; j < tabBudget1.rowCount; j++) {
					tRow1 = tabBudget1.row(j);	
					uniqueId1 = tRow1.uniqueId;
					data1 = tRow1.value('Date');
					dataEnd1 = tRow1.value('DateEnd');
					repeat1 = tRow1.value('Repeat');
					description1 = tRow1.value('Description');
					accountDebit1 = tRow1.value('AccountDebit');
					accountCredit1 = tRow1.value('AccountCredit');
					quantity1 = tRow1.value('Quantity');
					unitReference1 = tRow1.value('UnitReference');
					unitPrice1 = tRow1.value('UnitPrice');
					formulaAmountBaseCurrency1 = tRow1.value('FormulaAmountBaseCurrency');
					amount1 = tRow1.value('Amount');
					amountTotal1 = tRow1.value('AmountTotal');
					vatCode1 = tRow1.value('VatCode');
					vatRate1 = tRow1.value('VatRate');
					
					if (data1) {

						//If uniqueIds are equal then begins the comparison
						if (uniqueId1 == uniqueId2) {
							
							//Show differences if column values are different
							if (data1 != data2) {
								tRow1.addMessage("Edited Date: CURRENT <" + Banana.Converter.toLocaleDateFormat(data1) 
								+ ">, OTHER <" + Banana.Converter.toLocaleDateFormat(data2) + ">");
								flag = true;
							}
							if (dataEnd1 != dataEnd2) {
								tRow1.addMessage("Edited Date End: CURRENT <" + Banana.Converter.toLocaleDateFormat(dataEnd1) 
								+ ">, OTHER <" + Banana.Converter.toLocaleDateFormat(dataEnd2) + ">");
								flag = true;
							}
							if (repeat1 != repeat2) {
								tRow1.addMessage("Edited Repeat: CURRENT <" + repeat1 + ">, OTHER <" + repeat2 + ">");
								flag = true;
							}
							if (description1 != description2) {
								tRow1.addMessage("Edited Description: CURRENT <" + description1 + ">, OTHER <" + description2 + ">");
								flag = true;
							}
							if (accountDebit1 != accountDebit2) {
								tRow1.addMessage("Edited Debit: CURRENT <" + accountDebit1 + ">, OTHER <" + accountDebit2 + ">");
								flag = true;
							}
							if (accountCredit1 != accountCredit2) {
								tRow1.addMessage("Edited Credit: CURRENT <" + accountCredit1 + ">, OTHER <" + accountCredit2 + ">");
								flag = true;
							}
							if (quantity1 != quantity2) {
								tRow1.addMessage("Edited Quantity: CURRENT <" + quantity1 + ">, OTHER <" + quantity2 + ">");
								flag = true;
							}
							if (unitReference1 != unitReference2) {
								tRow1.addMessage("Edited UnitReference: CURRENT <" + unitReference1 + ">, OTHER <" + unitReference2 + ">");
								flag = true;
							}
							if (unitPrice1 != unitPrice2) {
								tRow1.addMessage("Edited UnitPrice: CURRENT <" + unitPrice1 + ">, OTHER <" + unitPrice2 + ">");
								flag = true;
							}
							if (formulaAmountBaseCurrency1 != formulaAmountBaseCurrency2) {
								tRow1.addMessage("Edited FormulaAmountBaseCurrency: CURRENT <" + formulaAmountBaseCurrency1 
								+ ">, OTHER <" + formulaAmountBaseCurrency2 + ">");
								flag = true;
							}
							if (amount1 != amount2) {
								tRow1.addMessage("Edited Amount: CURRENT <" + Banana.Converter.toLocaleNumberFormat(amount1) + ">, OTHER <" + Banana.Converter.toLocaleNumberFormat(amount2) + ">");
								flag = true;
							}
							if (amountTotal1 != amountTotal2) {
								tRow1.addMessage("Edited AmountTotal: CURRENT <" + Banana.Converter.toLocaleNumberFormat(amountTotal1)
								+ ">, OTHER <" + Banana.Converter.toLocaleNumberFormat(amountTotal2) + ">");
								flag = true;
							}
							if (vatCode1 != vatCode2) {
								tRow1.addMessage("Edited VAT code: CURRENT <" + vatCode1 + ">, OTHER <" + vatCode2 + ">");
								flag = true;
							}
							if (vatRate1 != vatRate2) {
								tRow1.addMessage("Edited %VAT: CURRENT <" + vatRate1 + ">, OTHER <" + vatRate2 + ">");
								flag = true;
							}
						}
					}
				}
			}
		}

		//Check if there are any added and/or deleted transactions
		arrUniqueIdsFile1 = getUniqueIds(tabBudget1);
		arrUniqueIdsFile2 = getUniqueIds(tabBudget2);
		
		arrDifferenze1 = diffArray(arrUniqueIdsFile2,arrUniqueIdsFile1); //Banana.console.log(arrDifferenze1);
		arrDifferenze2 = diffArray(arrUniqueIdsFile1,arrUniqueIdsFile2); //Banana.console.log(arrDifferenze2);
		
		//Deleted transactions
		if (arrDifferenze1.length > 0) {
			for (var i = 0; i < tabBudget1.rowCount; i++) {
				var tRow1 = tabBudget1.row(i);
				var idTab = tRow1.uniqueId;
				data1 = tRow1.value('Date');
				dataEnd1 = tRow1.value('DateEnd');
				repeat1 = tRow1.value('Repeat');
				description1 = tRow1.value('Description');
				accountDebit1 = tRow1.value('AccountDebit');
				accountCredit1 = tRow1.value('AccountCredit');
				quantity1 = tRow1.value('Quantity');
				unitReference1 = tRow1.value('UnitReference');
				unitPrice1 = tRow1.value('UnitPrice');
				formulaAmountBaseCurrency1 = tRow1.value('FormulaAmountBaseCurrency');
				amount1 = tRow1.value('Amount');
				amountTotal1 = tRow1.value('AmountTotal');
				vatCode1 = tRow1.value('VatCode');
				vatRate1 = tRow1.value('VatRate');
				
				for (var j = 0; j < arrDifferenze1.length; j++) {
					var idArr = arrDifferenze1[j];
					
					if (idTab == idArr) {
						tRow1.addMessage("Row NOT in OTHER: <" 
							+ Banana.Converter.toLocaleDateFormat(data1)
							+ ", "
							+ Banana.Converter.toLocaleDateFormat(dataEnd1)
							+ ", "
							+ repeat1
							+ ", " 
							+ description1 
							+ ", " 
							+ accountDebit1 
							+ ", " 
							+ accountCredit1
							+ ", "
							+ Banana.Converter.toLocaleNumberFormat(quantity1)
							+ ", "
							+ unitReference1
							+ ", "
							+ Banana.Converter.toLocaleNumberFormat(unitPrice1)
							+ ", "
							+ formulaAmountBaseCurrency1
							+ ", " 
							+ Banana.Converter.toLocaleNumberFormat(amount1)
							+ ", " 
							+ Banana.Converter.toLocaleNumberFormat(amountTotal1) 
							+ ", " 
							+ vatCode1 
							+ ", " 
							+ vatRate1
						);
					}
				}
			}
			flag = true;
		}
		
		//Added transactions
		if (arrDifferenze2.length > 0) {
			for (var i = 0; i < tabBudget2.rowCount; i++) {
				var tRow2 = tabBudget2.row(i);
				var idTab = tRow2.uniqueId;
				data2 = tRow2.value('Date');
				dataEnd2 = tRow2.value('DateEnd');
				repeat2 = tRow2.value('Repeat');
				description2 = tRow2.value('Description');
				accountDebit2 = tRow2.value('AccountDebit');
				accountCredit2 = tRow2.value('AccountCredit');
				quantity2 = tRow2.value('Quantity');
				unitReference2 = tRow2.value('UnitReference');
				unitPrice2 = tRow2.value('UnitPrice');
				formulaAmountBaseCurrency2 = tRow2.value('FormulaAmountBaseCurrency');
				amount2 = tRow2.value('Amount');
				amountTotal2 = tRow2.value('AmountTotal');
				vatCode2 = tRow2.value('VatCode');
				vatRate2 = tRow2.value('VatRate');
				
				for (var j = 0; j < arrDifferenze2.length; j++) {
					var idArr = arrDifferenze2[j];
					
					if (idTab == idArr) {

						//Add message into "current" file, specifying the row of the "other" file
						var r = parseInt(tRow2.rowNr);
						var rr = r+1;

						Banana.document.addMessage("[Budget: Row " + rr + "] NOT in CURRENT: <"
							+ Banana.Converter.toLocaleDateFormat(data2)
							+ ", "
							+ Banana.Converter.toLocaleDateFormat(dataEnd2)
							+ ", "
							+ repeat2
							+ ", " 
							+ description2 
							+ ", " 
							+ accountDebit2 
							+ ", " 
							+ accountCredit2
							+ ", "
							+ Banana.Converter.toLocaleNumberFormat(quantity2)
							+ ", "
							+ unitReference2
							+ ", "
							+ Banana.Converter.toLocaleNumberFormat(unitPrice2)
							+ ", "
							+ formulaAmountBaseCurrency2
							+ ", " 
							+ Banana.Converter.toLocaleNumberFormat(amount2)
							+ ", " 
							+ Banana.Converter.toLocaleNumberFormat(amountTotal2) 
							+ ", " 
							+ vatCode2 
							+ ", " 
							+ vatRate2
						);
					}
				}
			}
			flag = true;
		}
	}
	return flag;
}



/**
	Function that compares the two Documents tables finding all the differences
*/
function compareDocuments(table1, table2) {
	
	var flag = false;

	if (!table1 && !table2) {
		return false;
	}
	else if (table1 && !table2) {
		Banana.document.addMessage("Table Documents exists in CURRENT and not in OTHER");
		flag = true;
	}
	else if (!table1 && table2) {
		Banana.document.addMessage("Table Documents exists in OTHER and not in CURRENT");
		flag = true;
	}
	else if (table1 && table2) {
		
		var tRow1, tRow2 =""
		var rowId_1, rowId_2 = "";
		var description_1, description_2 = "";
		var attachments_1, attachments_2 = "";
		var flag = false;
			
		//comparare table: RowId, Description, sAttachments
		for (i = 0; i < table2.rowCount; i++) {
			tRow2 = table2.row(i);
			rowId_2 = tRow2.value('RowId');
			description_2 = tRow2.value('Description');
			attachments_2 = tRow2.value('Attachments');
				
			for (j = 0; j < table1.rowCount; j++) {
				tRow1 = table1.row(j);
			
				rowId_1 = tRow1.value('RowId');
				description_1 = tRow1.value('Description');
				attachments_1 = tRow1.value('Attachments');
					
				//If Id are equal then begins the comparison
				if (rowId_1 == rowId_2) {					
				
					//Show differences if column values are different
					if (description_1 != description_2) {
						tRow1.addMessage("Id <" +  rowId_1 + "> edited <Description>: CURRENT <" + description_1 + ">, OTHER <" + description_2 + ">");
						flag = true;
					}
					if (attachments_1 != attachments_2) {
						tRow1.addMessage("Id <" +  rowId_1 + "> edited <Attachments>: CURRENT different from OTHER");
						flag = true;
					}
				}
			}
		}
		
		//Check if there are any added and/or deleted rows
		arrUniqueIdsFile1 = getUniqueIds(table1);
		arrUniqueIdsFile2 = getUniqueIds(table2);
		
		arrDifferenze1 = diffArray(arrUniqueIdsFile2,arrUniqueIdsFile1);
 		arrDifferenze2 = diffArray(arrUniqueIdsFile1,arrUniqueIdsFile2);
		
		//Deleted rows
		if (arrDifferenze1.length > 0) {
			for (var i = 0; i < table1.rowCount; i++) {
				
				var tRow1 = table1.row(i);
				var idTab = tRow1.uniqueId;
				rowId_1 = tRow1.value('RowId');
				description_1 = tRow1.value('Description');
				attachments_1 = tRow1.value('Attachments');
				
				for (var j = 0; j < arrDifferenze1.length; j++) {
					if (idTab == arrDifferenze1[j]) {
						tRow1.addMessage("<" + rowId_1 + ", " + description_1 + "> Deleted in OTHER and not in CURRENT");
					}
				}
			}
			flag = true;
		}
		
		//Added rows
		if (arrDifferenze2.length > 0) {
			for (var i = 0; i < table2.rowCount; i++) {
				var tRow2 = table2.row(i);
				var idTab = tRow2.uniqueId;
				rowId_2 = tRow2.value('RowId');
				description_2 = tRow2.value('Description');
				attachments_2 = tRow2.value('Attachments');
				
				for (var j = 0; j < arrDifferenze2.length; j++) {
					if (idTab == arrDifferenze2[j]) {
						//Add message to the "current" file, specifying the row of the "other" file
						var r = parseInt(tRow2.rowNr);
						var rr = r+1;

						Banana.document.addMessage("[Documents: Row " + rr + "] <" + rowId_2 + ", " + description_2 + "> Added in OTHER and not in CURRENT");
					}
				}
			}
			flag = true;
		}
	}
	return flag;
}



