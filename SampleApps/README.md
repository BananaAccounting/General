# Examples of Banana Apps


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

## details.js

This app will show a detailed report of the Profit/Loss Account.

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


## segments.js

This app will show a report containing a detailed subdivision of the segments with balances.

## vattransactionslist.js

This app will show a report containing a list of transcactions that have vat code. 

## vattransactionslist_multicurrency.js

This app will show a report containing a list of transcactions that have vat code and the vat amounts converted in transaction's currency. 
