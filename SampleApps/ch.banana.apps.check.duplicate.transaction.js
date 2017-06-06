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
// @id = ch.banana.apps.check.duplicate.transaction
// @api = 1.0
// @pubdate = 2017-06-06
// @publisher = Banana.ch SA
// @description = Duplicate transaction checking
// @task = app.command
// @doctype = 100.*
// @docproperties =
// @outputformat = none
// @inputdatasource = none
// @timeout = -1

// Description:
// This script checks for duplicate transactions
// A transaction is duplicate if another transaction exists with the
// same amount, the same credit account and the same debit account in
// a time laps of '3' days.
// If a duplicate is found, a message is shown to the user.
// It is possible to skip the check for a transactions: just add a column
// with the name 'SkipDuplicateCheck' and insert any value (ie.: 'x') to
// the transacation to skip.


// Settings

//< Days before and after a duplicate transaction have to be searched for
var duplicateDaysSpan = 3;

//< RegExp of accounts not to check
//var skipAccountsCheck = [/^10\.001\..*$/];
var skipAccountsCheck = [/^$/];

//< Name of the columns that contains a flag to not to check the transaction
var skipDuplicateCheckColumnName = 'SkipDuplicateCheck';

//If true check only a single account
var checkOnlySelectedAccount = false;


// Function

function exec(string) {

   // Version
   var pubdate = Banana.script.getParamValue("pubdate");

   if (!Banana.document)
      return;

   Banana.document.clearMessages();

   var transactionsTable = Banana.document.table('Transactions');
   if (!transactionsTable)
      return;

   // Get the current selected account
   var selectedAccount = '';
   if (checkOnlySelectedAccount) {
     selectedAccount = getSelectedAccount();
     if (!selectedAccount) {
        Banana.Ui.showInformation("Select account", "Select an account to run this script.");
        return;
     } else if (!accountExists(selectedAccount)) {
        Banana.Ui.showInformation("Select account", "The selected account doesn't exist.");
        return;
     }
   }

   // Check for double transactions
   amountColumnName = 'Amount';
   if (transactionsTable.columnNames.indexOf('AmountCurrency') >= 0)
      amountColumnName = 'AmountCurrency';

   var transactionHashs = {};

   for (var i = 0; i < transactionsTable.rowCount; i++) {
      var skipDuplicateCheck = transactionsTable.value(i, skipDuplicateCheckColumnName);
      if (!skipDuplicateCheck && checkOnlySelectedAccount) {
         if (transactionsTable.value(i, 'AccountCredit') !== selectedAccount &&
             transactionsTable.value(i, 'AccountDebit') !== selectedAccount) {
            skipDuplicateCheck = true;
         }
      }

      if (!skipDuplicateCheck) {
         var date = transactionsTable.value(i, 'Date');
         if (date) {
            var jsDate = Banana.Converter.toDate(date);
            var amount = transactionsTable.value(i, amountColumnName);
            var creditAccount = transactionsTable.value(i, 'AccountCredit');
            var debitAccount = transactionsTable.value(i, 'AccountDebit');

            var checkTransaction = true;
            for (var j = 0; j < skipAccountsCheck.length; j++) {
               if (skipAccountsCheck[j].test(creditAccount))
                  checkTransaction = false;
               else if (skipAccountsCheck[j].test(debitAccount))
                  checkTransaction = false;
            }

            if (checkTransaction) {
               jsDate.setDate(jsDate.getDate() - duplicateDaysSpan);
               for (var d = 0; d <= duplicateDaysSpan; d++) {
                  var dateString = jsDate.toISOString();
                  var transactionHash = dateString + '&' + amount + '&' +
                     creditAccount + '&' + debitAccount;
                  if (transactionHashs[transactionHash]) {
                     transactionHashs[transactionHash].push(i);
                  } else {
                     transactionHashs[transactionHash] = [i];
                  }
                  jsDate.setDate(jsDate.getDate() + 1);
               }
            }
         }
      }
   }

   var duplicatesFound = false;
   var duplicateRows = [];
   var duplicateIndex = 0;
   for(var hash in transactionHashs) {
      var transactionHash = transactionHashs[hash];
      if (transactionHash.length > 1) {
         for (var i = 0; i < transactionHash.length; i++) {
            duplicatesFound = true;
            var rowNr = transactionHash[i];
            if (!duplicateRows[rowNr]) {
               if (i === 0)
                  duplicateIndex++;
               transactionsTable.addMessage('Duplicates found no. ' + duplicateIndex, rowNr);
            }
            duplicateRows[rowNr] = true;
         }
      }
   }

   if (!duplicatesFound) {
      var msg = 'No duplicates found';
      if (selectedAccount.length)
        msg += ' for account ' + selectedAccount;
      Banana.Ui.showInformation('Duplicate transaction check', msg)
   }
   else {
      var msg = 'Duplicates found';
      if (selectedAccount.length)
        msg += ' for account ' + selectedAccount;
      Banana.Ui.showInformation('Duplicate transaction check', msg + ' : ' + duplicateIndex)
   }

}

//------------------------------------------------------------------------------//
// FUNZIONI
//------------------------------------------------------------------------------//

// Verify that the selected account exists in the table account
function accountExists(conto){
   if (!conto)
      return false;
   else if (!Banana.document)
      return false;
   else if (Banana.document.table('Accounts') && Banana.document.table('Accounts').findRowByValue('Account', conto))
      return true;
   else if (Banana.document.table('Categories') && Banana.document.table('Categories').findRowByValue('Category', conto))
      return true;
   return false;
}

// Return from the current cursor position the selected account,
// If any account is selected an 'empty' string is returned
function getSelectedAccount(account){
   var cursorRow = Banana.document.cursor.rowNr;
   var cursorColumn = Banana.document.cursor.columnName;
   var cursorTable = Banana.document.cursor.tableName;

   var selectedAccount = '';
   if (cursorTable === "Accounts" && cursorColumn === "Account") {
      selectedAccount = Banana.document.value(cursorTable, cursorRow, cursorColumn);
   } else if (cursorTable === "Transactions" && cursorColumn === "AccountCredit") {
      selectedAccount = Banana.document.value(cursorTable, cursorRow, cursorColumn);
   } else if (cursorTable === "Transactions" && cursorColumn === "AccountDebit") {
      selectedAccount = Banana.document.value(cursorTable, cursorRow, cursorColumn);
   } else if (cursorTable === "Budget" && cursorColumn === "AccountCredit") {
      selectedAccount = Banana.document.value(cursorTable, cursorRow, cursorColumn);
   } else if (cursorTable === "Budget" && cursorColumn === "AccountDebit") {
      selectedAccount = Banana.document.value(cursorTable, cursorRow, cursorColumn);
   }

   Banana.console.log(selectedAccount);
   return selectedAccount;
}

