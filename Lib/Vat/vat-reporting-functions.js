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

/**************************************************************************************
*
* VAT functions 
*
**************************************************************************************/

/* Function that checks for all the used vat codes without Gr1 and prints a warning message */
function VatUsedVatCodeWithInappropriateGr1(banDoc, report) {

	// Get all the vat codes used on the Transactions table
	var usedVatCodes = VatGetVatCodesUsedInTransactions(banDoc);

	// For each code checks if on the VatCodes table there is a Gr1
	// Shows a warning message in red for all the vat codes without the Gr1
	var codesWithoutGr1 = [];

	// Save all the vat codes without Gr1 into an array
	for (var i = 0; i < usedVatCodes.length; i++) {
		var gr1 = VatGetVatCodesForGr1(banDoc, usedVatCodes[i]);
		if (!gr1) {
			codesWithoutGr1.push(usedVatCodes[i]);
		}
	}

	// Print all the warning messages
	for (var i = 0; i < codesWithoutGr1.length; i++) {
		report.addParagraph(param.checkVatCode4 + codesWithoutGr1[i] + param.checkVatCode5, "red");
	}
}

/* Function that retrieves the total vat from Banana */
function VatGetTotalFromBananaVatReport(banDoc, startDate, endDate) {
	var vatReportTable = banDoc.vatReport(startDate, endDate);
	var res = "";

	for (var i = 0; i < vatReportTable.rowCount; i++) {
		var tRow = vatReportTable.row(i);
		var group = tRow.value("Group");

		//The balance is summed in group named "_tot_"
		if (group === "_tot_") {
			res = tRow.value("VatBalance"); //VatAmount VatBalance

			// //In order to compare correctly the values we have to invert the sign of the result from Banana (if negative)
			// if (Banana.SDecimal.sign(totalFromBanana) == -1) {
			//     totalFromBanana = Banana.SDecimal.invert(totalFromBanana);
			// }
		}
	}
	return res;
}

/* checks all the vat/gr1 codes used in the transactions.
*  Add a warning message (red) to the report if codes with not appropriate Gr1 are used */
function VatUsedVatCodeWithInappropriateGr1(param, banDoc, appropriateGr) {
    var inappropriatGr1Codes = [];
    var usedGr1Codes = [];
	var vatCodes = VatGetVatCodesUsedInTransactions(banDoc);
	for (var i = 0; i < vatCodes.length; i++) {
		var gr1Codes = VatGetVatCodesForGr1(banDoc, vatCodes[i]);
		for (var j = 0; j < gr1Codes.length; j++) {
			usedGr1Codes.push(gr1Codes[j]);
		}
	}

	//Removing duplicates
	for (var i = 0; i < usedGr1Codes.length; i++) {
		for (var x = i + 1; x < usedGr1Codes.length; x++) {
			if (usedGr1Codes[x] === usedGr1Codes[i]) {
				usedGr1Codes.splice(x, 1);
				--x;
			}
		}
	}

	for (var j = 0; j < usedGr1Codes.length; j++) {
        var appropriate = false;
        for (var i = 0; appropriateGr.length; i++) {
            if (usedGr1Codes[j] === appropriateGr[i]) {
                appropriate = true;
            }
        }
        if (!appropriate) {
            inappropriatGr1Codes.push(usedGr1Codes[j]);
        }
    }
    return inappropriatGr1Codes;
}

/* returns an array with all the gr1 codes for the given vat code 
*  Gr1 code can be separated by ";"                */
function VatGetVatCodesForGr1(banDoc, vatCode) {
	var str = [];
	var table = banDoc.table("VatCodes");
	if (table === undefined || !table) {
		return str;
	}
	//Loop to take the values of each rows of the table
	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);
		var gr1 = tRow.value("Gr1");
		var vatcode = tRow.value("VatCode");

		if (gr1 && vatcode === vatCode) {
			var code = gr1.split(";");
			for (var j = 0; j < code.length; j++) {
				if (code[j]) {
					str.push(code[j]);
				}
			}
		}
	}
	return str;
}

/* Returns an array with all the vat codes used in the Transactions table */
function VatGetVatCodesUsedInTransactions(banDoc) {
	var str = [];
	var table = banDoc.table("Transactions");
	if (table === undefined || !table) {
		return str;
	}
	//Loop to take the values of each rows of the table
	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);
		var vatRow = tRow.value("VatCode");

		if (vatRow) {
			var code = vatRow.split(";");
			for (var j = 0; j < code.length; j++) {
				if (code[j]) {
					str.push(code[j]);
				}
			}
		}
	}
	//Removing duplicates
	for (var i = 0; i < str.length; i++) {
		for (var x = i + 1; x < str.length; x++) {
			if (str[x] === str[i]) {
				str.splice(x, 1);
				--x;
			}
		}
	}
	//Return the array
	return str;
}

/* Function that returns the lines from the journal as an array */
function VatGetJournal(banDoc, startDate, endDate) {

	var journal = banDoc.journal(banDoc.ORIGINTYPE_CURRENT, banDoc.ACCOUNTTYPE_NORMAL);
	var len = journal.rowCount;
	var transactions = []; //Array that will contain all the lines of the transactions

	for (var i = 0; i < len; i++) {

		var line = {};
		var tRow = journal.row(i);

		if (tRow.value("JDate") >= startDate && tRow.value("JDate") <= endDate) {

			line.date = tRow.value("JDate");
			line.account = tRow.value("JAccount");
			line.vatcode = tRow.value("JVatCodeWithoutSign");
			line.doc = tRow.value("Doc");
			line.description = tRow.value("Description");
			line.isvatoperation = tRow.value("JVatIsVatOperation");
			

			//We take only the rows with a VAT code and then we convert values from base currency to CHF
			if (line.isvatoperation) {

				line.vattaxable = tRow.value("JVatTaxable");
				line.vatamount = tRow.value("VatAmount");
				line.vatposted = tRow.value("VatPosted");
				line.amount = tRow.value("JAmount");
				line.vatextrainfo = tRow.value("VatExtraInfo");

				transactions.push(line);
			}
		}
	}
	return transactions;
}

/* Sums the vat amounts for the specified vat code and period retrieved from transactions (converted journal's lines)
Returns an object containing {vatTaxable, vatPosted, vatAmount} 
extraInfo is "*" for all or a specific value, inclusive void 
*/
function VatGetVatCodesBalanceExtraInfo(transactions, vatCodes, vatExtraInfo, startDate, endDate) {

	var sDate = Banana.Converter.toDate(startDate);
	var eDate = Banana.Converter.toDate(endDate);
	var vattaxable = "";
	var vatposted = "";
	var vatamount = "";
	var currentBal = {};

		for (var i = 0; i < transactions.length; i++) {
         var row = transactions[i];
         var tDate = Banana.Converter.toDate(row.date);
			if (tDate >= sDate && tDate <= eDate) {
            for (var j = 0; j < vatCodes.length; j++) {
				if (vatCodes[j] === row.vatcode) {
					if (vatExtraInfo === "*" || vatExtraInfo === row.vatextrainfo) { // The VatExtraInfo column is not used
						vattaxable = Banana.SDecimal.add(vattaxable, row.vattaxable);
						vatposted = Banana.SDecimal.add(vatposted, row.vatposted);
						vatamount = Banana.SDecimal.add(vatamount, row.vatamount);
					}
					
				}
			}
		}
	}
   currentBal.vatTaxable = vattaxable;
   currentBal.vatPosted = vatposted;
   currentBal.vatAmount = vatamount;
   return currentBal;
}

/* Retrieve the Vat value for a specific gr1 Codes
*  grCodes can be more then one, sepatated by ";"
*  vatClass determines the return value  */
function VatGetGr1Balance(banDoc, transactions, grCodes, vatClass, startDate, endDate) {

   return VatGetGr1BalanceExtraInfo(banDoc, transactions, grCodes, vatClass, "*", startDate, endDate);
   
}


/* Retrieve the Vat value for a specific gr1 Codes
*  grCodes can be more then one, sepatated by ";"
*  vatClass determines the return value  
*  extraInfo is "*" for all or a specific value, inclusive void */
function VatGetGr1BalanceExtraInfo(banDoc, transactions, grCodes, vatClass, vatExtraInfo, startDate, endDate) {

	var vatCodes = VatGetVatCodesForGr(banDoc, grCodes, 'Gr1');

	//Sum the vat amounts for the specified vat code and period
	var currentBal = VatGetVatCodesBalanceExtraInfo(transactions, vatCodes, vatExtraInfo, startDate, endDate);

	//The "vatClass" decides which value to use
	if (vatClass == "1") {
		// Recoverable VAT Taxable (VAT netto)
		return currentBal.vatTaxable;
	} else if (vatClass == "2") {
		// Due  VAT Taxable
		return Banana.SDecimal.invert(currentBal.vatTaxable);
	} else if (vatClass == "3") {
		// Recoverable VAT posted (VAT Amount)
		return currentBal.vatPosted;
	} else if (vatClass == "4") {
		// Due  VAT posted  (VAT Amount)
		return Banana.SDecimal.invert(currentBal.vatPosted);
	} else if (vatClass == "5") {
		// Recoverable VAT gross amount (VAT taxable + VAT amount)
		return Banana.SDecimal.add(currentBal.vatTaxable, currentBal.vatAmount);
	} else if (vatClass == "6") {
		// Due VAT gross amount (VAT taxable + VAT amount)
		return Banana.SDecimal.invert(Banana.SDecimal.add(currentBal.vatTaxable, currentBal.vatAmount));
	}
}

/* Return and array with all the VAT Codes 
*  belonging to the same group (grCodes) , can include different values separated by ";"
*  in the indicate colums, usually "Gr1"           */
function VatGetVatCodesForGr(banDoc, grCodes, grColumn) {

	var str = [];
	if (!grCodes || !banDoc || !banDoc.table("VatCodes")) {
		return str;
	}
	var table = banDoc.table("VatCodes");

	if (!grColumn) {
		grColumn = "Gr1";
	}

	/* Can have multiple values */
	var arrayGrCodes = grCodes.split(';');

	//Loop to take the values of each rows of the table
	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);

		//If Gr1 column contains other characters (in this case ";") we know there are more values
		//We have to split them and take all values separately
		//If there are only alphanumeric characters in Gr1 column we know there is only one value
		var arrCodeString = tRow.value(grColumn).split(";");
		for (var j = 0; j < arrayGrCodes.length; j++) {
			if (arrayContains(arrCodeString, arrayGrCodes[j])) {
				var vatCode = tRow.value('VatCode');
				if (!arrayContains(str, vatCode)) {
					str.push(vatCode);
				}
			}
		}
	}

	//Return the array
	return str;
}

function arrayContains(array, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === value) {
			return true;
		}
	}
	return false;
}

