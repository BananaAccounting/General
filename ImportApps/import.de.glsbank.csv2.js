// Copyright [2015] [Bernhard Fürst - fuerstnet GmbH - Dresden Germany]
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
// @id = ch.banana.apps.import.de.glsbank.csv
// @api = 1.0
// @pubdate = 2015-30-11
// @publisher = fuerstnet GmbH
// @description = GLS Bank With Template
// @task = import.transactions
// @doctype = 100.*; 110.*; 130.*
// @docproperties = 
// @outputformat = transactions.simple
// @inputdatasource = openfiledialog
// @timeout = -1
// @inputfilefilter = Text files (*.txt *.csv);;All files (*.*)
// @includejs = import.csvstatement.template.js
//
// Import CSV Umsatzexport file from german GLS Bank.
// This version use as base the template file which is included through the @includejs parameter


//The purpose of this function is to let the users define:
// - the parameters for the conversion of the CSV file;
// - the fields of the csv/table
var defineConversionParam = function() {

	var convertionParam = {};

	/** SPECIFY THE SEPARATOR AND THE TEXT DELIMITER USED IN THE CSV FILE */
	convertionParam.separator = ';';
	convertionParam.textDelim = '"';
	/** END */

   /** SPECIFY THE COLUMN TO USE FOR SORTING
   If sortColum is empty the data are not sorted */
   convertionParam.sortColums = ["Date", "ExternalReference"];
   convertionParam.sortDescending = false;
   /** END */

   convertionParam.rowConverter = function(inputRow) {
		var convertedRow = {};


		/** MODIFY THE FIELDS NAME AND THE CONVERTION HERE
		*   The right part is a statements that is then executed for each inputRow
		*   inputRow is a javascript object where the property is the FieldName  */

		/*   Field that start with the underscore "_" will not be exported
		*    Create this fields so that you can use-it in the postprocessing function
		*
		* 	 GLS Bank CVS Format as follows:
		*    Kontonummer;Buchungstag;Wertstellung;Auftraggeber/Empfänger;Buchungstext;VWZ1;VWZ2;VWZ3;VWZ4;VWZ5;VWZ6;VWZ7;VWZ8;VWZ9;VWZ10;VWZ11;VWZ12;VWZ13;VWZ14;Betrag;Kontostand;Währung
		*/
		convertedRow["Date"] = Banana.Converter.toInternalDateFormat(inputRow["Buchungstag"], "dd.mm.yy");
      convertedRow["_VWZ1"] = inputRow["VWZ1"];
		convertedRow["_VWZ2"] = inputRow["VWZ2"];
		convertedRow["_VWZ3"] = inputRow["VWZ3"];
		convertedRow["_VWZ4"] = inputRow["VWZ4"];
		convertedRow["_VWZ5"] = inputRow["VWZ5"];
		convertedRow["_VWZ6"] = inputRow["VWZ6"];
		convertedRow["_VWZ7"] = inputRow["VWZ7"];
		convertedRow["_Empfänger"] = inputRow["Auftraggeber/Empfänger"];
		convertedRow["_Buchungstext"] = inputRow["Buchungstext"];
		convertedRow["Income"] = inputRow["Betrag"];
		/** END */

		return convertedRow;
	};
	return convertionParam;
}

//The purpose of this function is to let the user specify how to convert the categories
var postProcessIntermediaryData = function(intermediaryData) {

   /** INSERT HERE THE LIST OF ACCOUNTS NAME AND THE CONVERSION NUMBER
   *   See import.csvstatement.template.js.
   */

   /** INSERT HERE THE LIST OF CATEGORIES NAME AND THE CONVERSION NUMBER
   *   See import.csvstatement.template.js.
   */

   //Apply the conversions
   for (var i = 0; i < intermediaryData.length; i++) {
      var convertedData = intermediaryData[i];

      // Convert amount to internal Banana format.
      convertedData["Income"] = Banana.Converter.toInternalAmountFormat(convertedData["Income"]);

      // If Empfänger is emtpy it is the "GLS Bank" itself.
      if (!convertedData["_Empfänger"].length) {
         convertedData["_Empfänger"] = 'GLS Bank';
      }

      // Build Descripton from relevant "Verwendungszweck" fields (VWZ1 to VWZ7).
      convertedData["Description"] = '';

      // Use VWZ1 to VWZ4 only if it is not filled with BIC/IBAN etc. information
      // by Online Banking or HBCI transactions.
      if (convertedData["_VWZ1"].search('^BIC:') == -1 && convertedData["_VWZ2"].search('^IBAN:') == -1) {
         convertedData["Description"] = convertedData["_VWZ1"] + convertedData["_VWZ2"] + convertedData["_VWZ3"] + convertedData["_VWZ4"];
      }

      // More VWZ fields
      convertedData["Description"] = convertedData["Description"] + convertedData["_VWZ5"] + convertedData["_VWZ6"] + convertedData["_VWZ7"];

      // Add type and name of debitor/creditor, depending on debit or credit.
      if (convertedData["Income"] < 0) {
         convertedData["Description"] = convertedData["Description"] + " (" + convertedData["_Buchungstext"] + " an " + convertedData["_Empfänger"] + ")";
      }
      else if (convertedData["Income"] > 0) {
         convertedData["Description"] = convertedData["Description"] + " (" + convertedData["_Buchungstext"] + " von " + convertedData["_Empfänger"] + ")";
      }
   }
}


