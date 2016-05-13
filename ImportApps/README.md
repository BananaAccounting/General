#ImportApps
The ImportApp converts the data from the propietary to the format specified for bananaimport (a text file with tab separated header and data). See also:
* [Banana ImportApp documentation] (https://doc8.banana.ch/en/node/4731)
* [Banana import format documentation] (https://doc8.banana.ch/en/node/3713)
* List of [ImportApps that we have already developed] (https://www.banana.ch/portal/addons/filters?app=Banana80) and are available to users.


##Sample file import.csvstatement.template.js
Script that allows the user to import data from proprietary CSV file to the Banana document.

The user can define:
* the parameters for the conversion of the CSV file
  * separator and text delimiter
  * the column to use for sorting
* the fields of the csv/table
* eventually the conversion of the accounts/categories
* eventually add functions that perform desired tasks

#Develop your own CSV ImportApp
If you want to develop an app that converts a proprietary file to a Banana compatible import file: 
* Create a copy the import.csvstatement.template.js 
* Change the id and the description

Then you have two options: 

1. Add the file as a normal BananaApp, see [Documentation Manage Apps] (https://doc8.banana.ch/en/node/7709).  
   You can use debugging see https://doc8.banana.ch/en/node/4735 

2. Add the file as an import filter https://doc8.banana.ch/en/node/4160

Once you are done you can eventually install the App as an import App https://doc8.banana.ch/en/node/4731

#Contribute your ImportApp
We welcome people that develop and contribute back the developlments, that may be useful for other (for example proprietary e-bank statements).  
We plan to create a specific repository on github with all ImportApps that we have already deveveloped and that are available to the Banana Users.

* Set the ImportApp's file name:
 * "import" 
 * 2 letters for the country (for example "ch")
 * code bank name (for example "ubs")
 * format (for example "csv")
 * .js
 * (Example: "import.ch.ubs.csv.js")
* License terms must be apache 2.0 
* Create and example file with just few rows with the name "import.ch.ubs.csv.csv" (or the more appropriate extension")
* Create a pull request on this directory or send the file to info@banana.ch





