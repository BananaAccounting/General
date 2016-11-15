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
// @description = GLS Bank
// @task = import.transactions
// @doctype = 100.*; 110.*; 130.*
// @docproperties = 
// @outputformat = transactions.simple
// @inputdatasource = openfiledialog
// @timeout = -1
// @inputfilefilter = Text files (*.txt *.csv);;All files (*.*)
//
// Import CSV Umsatzexport file from german GLS Bank.


//Main function
function exec(inData) {

	//1. Function call to define the conversion parameters
	var convertionParam = defineConversionParam();

	//2. we can eventually process the input text
	//inData = preProcessInData(inData);

	//3. intermediaryData is an array of objects where the property is the banana column name
	var intermediaryData = convertCsvToIntermediaryData(inData, convertionParam);

	//4. translate categories and Description
	// can define as much postProcessIntermediaryData function as needed
	postProcessIntermediaryData(intermediaryData);

	//5. convert to banana format
	//column that start with "_" are not converted
	return convertToBananaFormat(intermediaryData);
}


//The purpose of this function is to let the users define:
// - the parameters for the conversion of the CSV file;
// - the fields of the csv/table
function defineConversionParam() {

	var convertionParam = {};

	/** SPECIFY THE SEPARATOR AND THE TEXT DELIMITER USED IN THE CSV FILE */
	convertionParam.separator = ';';
	convertionParam.textDelim = '"';
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
		convertedRow["_VWZ8"] = inputRow["VWZ8"];
		convertedRow["_VWZ9"] = inputRow["VWZ9"];
		convertedRow["_VWZ10"] = inputRow["VWZ10"];
		convertedRow["_VWZ11"] = inputRow["VWZ11"];
		convertedRow["_VWZ12"] = inputRow["VWZ12"];
		convertedRow["_VWZ13"] = inputRow["VWZ13"];
		convertedRow["_VWZ14"] = inputRow["VWZ14"];
		convertedRow["_Empfänger"] = inputRow["Auftraggeber/Empfänger"];
		convertedRow["_Buchungstext"] = inputRow["Buchungstext"];
		convertedRow["Income"] = inputRow["Betrag"];
		/** END */

		return convertedRow;
	};
	return convertionParam;
}



function preProcessInData(inData) {
	return inData;
}



//The purpose of this function is to let the user specify how to convert the categories
function postProcessIntermediaryData(intermediaryData) {

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
		convertedData["Income"] = Banana.Converter.toInternalNumberFormat(convertedData["Income"]);

		// If Empfänger is emtpy it is the "GLS Bank" itself.
		if (!convertedData["_Empfänger"].length) {
			convertedData["_Empfänger"] = 'GLS Bank';
		}

		// Build Descripton from relevant "Verwendungszweck" fields (VWZ1 to VWZ7).
		convertedData["Description"] = '';

		// Put all VWZ fields into one string. Add Tabs as field separator needed
		// to identify field borders in later processing.
		convertedData["Description"] = convertedData["_VWZ1"] + "\t" + convertedData["_VWZ2"] + "\t" + convertedData["_VWZ3"] + "\t" + convertedData["_VWZ4"] + "\t" + convertedData["_VWZ5"] + "\t" + convertedData["_VWZ6"] + "\t" + convertedData["_VWZ7"] + "\t" + convertedData["_VWZ8"] + "\t" + convertedData["_VWZ9"] + "\t" + convertedData["_VWZ10"] + "\t" + convertedData["_VWZ11"] + "\t" + convertedData["_VWZ12"] + "\t" + convertedData["_VWZ13"] + "\t" + convertedData["_VWZ14"];

		// Remove BIC/IBAN etc. information originating from Online Banking or HBCI transactions.
		convertedData["Description"] = convertedData["Description"].replace(/^BIC:.+IBAN:.+Datum:[\.\s\d]+Zeit:[:\s\d]+\t/, '');
		convertedData["Description"] = convertedData["Description"].replace(/(KD|UFT)[\s\d]+TAN[\s\d]+\t/g, '');
		convertedData["Description"] = convertedData["Description"].replace(/(KD|UFT)[\s\d]+\t/g, '');

		// Remove Tabs and multiple spaces.
		convertedData["Description"] = convertedData["Description"].replace(/\t/g, '');
		convertedData["Description"] = convertedData["Description"].replace(/\s{2,}/g, ' ');

		// Add type and name of debitor/creditor, depending on debit or credit.
		if (convertedData["Income"] < 0) {
			convertedData["Notes"] = convertedData["_Buchungstext"] + " an " + convertedData["_Empfänger"];
		}
		else if (convertedData["Income"] > 0) {
			convertedData["Notes"] = convertedData["_Buchungstext"] + " von " + convertedData["_Empfänger"];
		}
	}
}

/* DO NOT CHANGE THIS CODE */

// Convert to an array of objects where each object property is the banana columnNameXml
function convertCsvToIntermediaryData(inData, convertionParam) {

	var form = [];
	var intermediaryData = [];
	//Read the CSV file and create an array with the data
	var csvFile = Banana.Converter.csvToArray(inData, convertionParam.separator, convertionParam.textDelim);

	//Variables used to save the columns titles and the rows values
	var columns = getHeaderData(csvFile); //array
	var rows = getRowData(csvFile); //array of array

	//Load the form with data taken from the array. Create objects
	loadForm(form, columns, rows);

	//Create the new CSV file with converted data
	var convertedRow;
	//For each row of the form, we call the rowConverter() function and we save the converted data
	for (var i = 0; i < form.length; i++) {
		convertedRow = convertionParam.rowConverter(form[i]);
		intermediaryData.push(convertedRow);
	}

	//Return the converted CSV data into the Banana document table
	return intermediaryData;
}


//The purpose of this function is to convert all the data into a format supported by Banana
function convertToBananaFormat(intermediaryData) {

	var columnTitles = [];

	//Create titles only for fields not starting with "_"
	for (var name in intermediaryData[0]) {
		if (name.substring(0,1) !== "_") {
			columnTitles.push(name);
		}

	}
	//Function call Banana.Converter.objectArrayToCsv() to create a CSV with new data just converted
   var convertedCsv = Banana.Converter.objectArrayToCsv(columnTitles, intermediaryData, "\t");

	return convertedCsv;
}


//The purpose of this function is to load all the data (titles of the columns and rows) and create a list of objects.
//Each object represents a row of the csv file
function loadForm(form, columns, rows) {
	var obj = new Object;

	for(var j = 0; j < rows.length; j++){
		var obj = {};

		for(var i = 0; i < columns.length; i++){
			obj[columns[i]] = rows[j][i];
		}
		form.push(obj);
	}
}


//The purpose of this function is to return all the titles of the columns
function getHeaderData(csvFile) {
	var headerData = csvFile[0];
	for (var i = 0; i < headerData.length; i++) {

		headerData[i] = headerData[i].trim();

		if (!headerData[i]) {
			headerData[i] = i;
		}
	}
	return headerData;
}


//The purpose of this function is to return all the data of the rows
function getRowData(csvFile) {
	var rowData = [];
	for (var i = 1; i < csvFile.length; i++) {
		rowData.push(csvFile[i]);
	}
	return rowData;
}

