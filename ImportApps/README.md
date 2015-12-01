#Import App

##Sample file import.csvstatement.template.js
Script that allows the user to import data from proprietary CSV file to the Banana document.
The ImportApp translate the data from  the propietary to the format specified for bananaimport (a text file with tab separated header and data). See also:
* [Banana ImportApp documentation] (https://doc8.banana.ch/en/node/4731)
* [Banana import format documentation] (https://doc8.banana.ch/en/node/3713)


The user can define:
* the parameters for the conversion of the CSV file
* the fields of the csv/table
* eventually the conversion of the accounts/categories
* eventually add functions that perform desired tasks

#Develop you own CSV ImportApp
If you want to develop an app that tranlsate a proprietary file to a Banana compatible import file: 
* Create a copy the import.csvstatement.template.js 
* Change the id and the description
* Add the file as a normal BananaApp see [Documentation Manage Apps] (https://doc8.banana.ch/en/node/7709)
* Change the file and test with you data.
* For debugging see https://doc8.banana.ch/en/node/4735
* Once you are done install the App as an import App https://doc8.banana.ch/en/node/4731

