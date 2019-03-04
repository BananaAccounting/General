// Copyright [2016] [Banana.ch SA - Lugano Switzerland]
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
// @id = import_transaction_segments
// @api = 1.0
// @pubdate = 2019-03-01
// @publisher = Banana.ch SA
// @description = Import Transaction segments
// @task = import.transactions
// @doctype = 100.*; 110.*; 130.*
// @docproperties = 
// @outputformat = transactions.double
// @inputdatasource = 
// @timeout = -1


/**
 *	This app allows to extract from the previous year ac2 file all the segments balances
 *	and import them as transactions on the new year ac2 file.
 *
 *	1)	Take from the columns AccountDebit and AccountCredit of the Transactions table
 *		the accounts that contains segments. Segments symbol can be ":" or "-".
 *		Initialize each account to "0.00".
 *	2)  For each account calculate the currentBalance().
 *	3)	Correct the balances values
 *	4)	Create the output text in the format used by Banana Accounting to import.
 */


var _SEGMENTS_SYMBOL = "";


//Main function
function exec(inData) {

	//Check if we are on an opened document
	if (!Banana.document) { return; }

	//Check if the tables exist: if not, the script's execution will stop
	if (!Banana.document.table('Accounts')) { 
		return; 
	}
	if (!Banana.document.table('Transactions')) { 
		return; 
	}

	//Open a dialog window asking the user to select the previous year ac2 file
	var previousYearFile = Banana.application.openDocument("*.*");
	if(!previousYearFile){
		return;
	}
	else {
		//Check if the tables exist: if not, the script's execution will stop
		if (!previousYearFile.table('Accounts')) { 
			return; 
		}
		if (!previousYearFile.table('Transactions')) { 
			return; 
		}

		var accounts = [];
		getSegmentSymbol(previousYearFile);
		accounts = mapSegments(previousYearFile);
		calculateCurrentBalance(accounts, previousYearFile);
		correctBalances(accounts);

		var outText = "Date\tDocType\tDescription\tAccountDebit\tAccountCredit\tAmount\n";
		outText += createImportString(Banana.document, accounts);

		//Banana.console.log(accounts.length);
		//Banana.console.log(JSON.stringify(accounts, "", " "));

		return outText;
	}
}

function correctBalances(accounts) {

	/*
	*	Recalculate all balances: subtract all the next level segments
	*	es. from "4000:LO" we subtract "4000:LO:P1"
	*/

	for (var i = 0; i < accounts.length; i++) {

		var account = accounts[i].segment;
		var tmpAccounts = retrieveAccounts(accounts, account);
		//Banana.console.log(">>> " + account);
		//Banana.console.log(JSON.stringify(tmpAccounts,"",""));
		
		// The first is always the input account (the one we have to subtract the other values)
		var subtractValue = 0;
		for (var j = 0; j < tmpAccounts.length; j++) {
			subtractValue = Banana.SDecimal.add(subtractValue,tmpAccounts[j].balance);
		}
		//Banana.console.log("- " + subtractValue);
		

		// Subtract the calculated value
		//Banana.console.log("START = " + accounts[i].segment + ", " + accounts[i].balance);
		accounts[i].balance = Banana.SDecimal.subtract(accounts[i].balance, subtractValue);
		//Banana.console.log("END = " + accounts[i].segment + ", " + accounts[i].balance);
		//Banana.console.log("***");
	}
}

function retrieveAccounts(accounts, account) {
	var tmpAccounts = [];
	for (var i = 0; i < accounts.length; i++) {

		var cnt = account.split(_SEGMENTS_SYMBOL).length-1; //numbers of segment symbols (es. 4000:LU:P1 => 2)

		if (accounts[i].segment.indexOf(account) > -1 && accounts[i].segment.split(_SEGMENTS_SYMBOL).length-1 == cnt+1) {
			tmpAccounts.push(accounts[i]);
		}
	}
	return tmpAccounts;
}

function calculateCurrentBalance(accounts, previousBanDoc) {
    for (var i = 0; i < accounts.length; i++) {
    	var account = accounts[i].segment;
    	if (_SEGMENTS_SYMBOL === "-") {
	    	account = account.replace(/-/g, ":");	//replace - with : for the currentBalance() function
    	}
    	accounts[i].balance = previousBanDoc.currentBalance(account).balance;
    }
}

function mapSegments(banDoc) {
	var segments = [];
	var accounts = [];
	var transactionsTable = banDoc.table("Transactions");
	for (var i = 0; i < transactionsTable.rowCount; i++) {
		
		var tRow = transactionsTable.row(i);
		var debit = tRow.value("AccountDebit");
		var credit = tRow.value("AccountCredit");

		if (debit.indexOf(_SEGMENTS_SYMBOL) > -1) {
			accounts.push(debit);
		}

		if (credit.indexOf(_SEGMENTS_SYMBOL) > -1) {
			accounts.push(credit)
		}
	}

	accounts.sort();

	//Removing duplicates
    for (var i = 0; i < accounts.length; i++) {
        for (var x = i+1; x < accounts.length; x++) {
            if (accounts[x] === accounts[i]) {
                accounts.splice(x,1);
                --x;
            }
        }
    }

    // Initialize all segments balances
    for (var i = 0; i < accounts.length; i++) {
    	segments.push({"segment":accounts[i],"balance":"0.00"});
    }

	return segments;
}

function createImportString(banDoc, accounts) {

	var tmpOut = "";
	var year = Banana.Converter.toDate(banDoc.info("AccountingDataBase","OpeningDate")).getFullYear();
	var date = year + "-01-01";
	var doctype = "01";
	var description = "Import balance segment transaction";
	
	for (var i = 0; i < accounts.length; i++) {
		
		var account = accounts[i].segment;
		var balance = accounts[i].balance;

		if (balance > 0) {
			tmpOut += date +"\t" + doctype + "\t" + description + "\t"+ account +"\t"+ "[CA]" + "\t"+ Banana.Converter.toInternalNumberFormat(balance, ".") +"\n";
		} else {
			tmpOut += date +"\t" + doctype + "\t" + description + "\t"+ "[A]" + "\t" + account + "\t" + Banana.Converter.toInternalNumberFormat(balance, ".") +"\n";
		}
	}

	return tmpOut
}

function getSegmentSymbol(banDoc) {
	var transactionsTable = banDoc.table("Transactions");
	for (var i = 0; i < transactionsTable.rowCount; i++) {
		
		var tRow = transactionsTable.row(i);
		var debit = tRow.value("AccountDebit");
		var credit = tRow.value("AccountCredit");

		if (debit.indexOf(":") > -1 || credit.indexOf(":") > -1) {
			_SEGMENTS_SYMBOL = ":";
		} else {
			_SEGMENTS_SYMBOL = "-";
		}
	}
}

