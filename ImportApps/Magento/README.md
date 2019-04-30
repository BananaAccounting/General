# Import Magento invoices
The Magento Invoice Import BananaApp to import invoice data from the Magento e-commerce platform.
Invoice information is first exported from Magento in CSV file format

## Import in Banana Accounting
Follow the [Import Transactions Instruction](https://www.banana.ch/doc9/en/node/3054)

## How to export from Magento 
You have to take care to export all relevant information, related to the invoice. 
You have to export the invoice data from Magento, by following this 
* xx

The content of the file (columns and rows of the CSV)

### Export of only summary data 
You will have only one row for each invoice, the total amount of the invoice.
You have to  export all relevant information for the invoice:
* Invoice Date
* Invoice Number
* Customer data
  * Number 
  * Address (different fields)
  * Language
* Currency
* Invoice total amount
* Due date
* Applicable VAT percentage
* Revenue account
* Payment method (already payed, ...)

### Export of all the detail of the invice
It is necessary if you have invoice with different VAT percentace or if you want to register products in different accounts.
For each invoice you will have more lines.  

