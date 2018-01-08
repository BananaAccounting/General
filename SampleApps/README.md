# @id attribute for JavaScript apps

The **@id** attribute is used to identify the script. In order to avoid duplicates banana.ch use the following scheme:
**developer**.**country**.**type**.**name**

| Value | Description | Example |
| ------ | ------ | ------ |
| developer | The developer of the app. | ch.banana |
| country | The country for which the app is designed. If the app is not designed for a specific country, use **uni** as universal. | ch, it, de, ... uni|
| type | The type of the app. | app, import, invoice, reminder, statement |
| name | The name of the app. | vatreport, template1 |

Examples:
  - @id = ch.banana.uni.invoice.template1
  - @id = ch.banana.ch.app.vatreport2018


# Examples of Banana Apps

## account_card.js
This app creates an account card for the selected account number and period.


## account_statement_with_receipt.js
This app creates an account statement with a receipt for the selected account number.


## balancedailyinmonth.js

This app will show the daily balance for a specified account and month   

## calcinterest.js
This app calculate the interst debit and credit for the account and with the tax rate you specify. 

## comparestwoaccountingfiles.js

This app will show the differences between two accounting files. It is very useful when at some point it is needed to compare data of two files.

## comparedailybalance.js

Very useful for bank account reconciliation.  
It takes a mt940 or ISO20022 bank statements file, and show if there are difference day by day.

## createc3chart.js

This app will show ho to create a chart using C3 javascript library.  
It is a very basic, in the function generateChart you specify the accounts or groups number. 

## ch.banana.apps.details.js

Balance Sheet and Profit & Loss report with transactions details for each account.


## frommemberfee.js
It create incoice transactions, taking all  accounts in the accounting tabl that have a value in the column MemberFee.
Useful for a not for profit organisation that send Member fee incoices.
 

## ch.banana.apps.transactionvoucher.dialog.js and ch.banana.apps.transactionvoucher.dialog.ui

This app will show a report containing a detailed payment voucher for the Swiss Red Cross.
To change the image there are two ways:
1) In the script folder add an image and name it "transaction_voucher_image.png".
2) In Banana Accounting add the Documents table (Tools -> Add new functionalities... -> Add Documents table). Now on the Id column insert "transaction_voucher_image" and in the Attachments column add the image (double click on cell -> Image -> Ok)


## trialbalance.js

This app prints a report containing the balance sheet and the profit/loss statement.


## trialbalance_and_blockchain.js

This app prints a report containing the table Account and the blockchain.


## trialbalance_and_blockchain_quarter.js

This app prints a report containing the table Account and the blockchain. The period choice is in quarter.


## ch.banana.apps.segments.js

This app will show a report containing a detailed subdivision of the segments with balances.

## vattransactionslist.js

This app will show a report containing a list of transcactions that have vat code. 

## vattransactionslist_multicurrency.js

This app will show a report containing a list of transcactions that have vat code and the vat amounts converted in transaction's currency. 
