// Copyright [2015] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.apps.import.csvstatemen.template
// @api = 1.0
// @pubdate = 2016-04-06
// @publisher = Banana.ch SA
// @description = Import CSV
// @task = import.transactions
// @doctype = 100.*; 110.*; 130.*
// @docproperties = 
// @outputformat = transactions.simple
// @inputdatasource = openfiledialog
// @timeout = -1
// @inputfilefilter = Text files (*.txt *.csv);;All files (*.*)


//Main function
function exec(inData) {
	
	//1. Function call to define the conversion parameters
	var convertionParam = defineConversionParam();

	//2. we can eventually process the input text
	inData = preProcessInData(inData);

	//3. intermediaryData is an array of objects where the property is the banana column name
	var intermediaryData = convertCsvToIntermediaryData(inData, convertionParam);

	//4. translate categories and Description 
	// can define as much postProcessIntermediaryData function as needed
	postProcessIntermediaryData(intermediaryData);

   //5. sort data
   intermediaryData = sortData(intermediaryData, convertionParam);

   //6. convert to banana format
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

	/** SPECIFY AT WHICH ROW OF THE CSV FILE IS THE HEADER (COLUMN TITLES)
	We suppose the data will always begin right away after the header line */
	convertionParam.headerLineStart = 0;
	convertionParam.dataLineStart = 1;


   /** SPECIFY THE COLUMN TO USE FOR SORTING
   If sortColums is empty the data are not sorted */
   convertionParam.sortColums = ["Date", "ExternalReference"];
   convertionParam.sortDescending = false;
	/** END */

	/* rowConvert is a function that convert the inputRow (passed as parameter)
	*  to a convertedRow object 
	* - inputRow is an object where the properties is the column name found in the CSV file
	* - convertedRow is an  object where the properties are the column name to be exported in Banana 
	* For each column that you need to export in Banana create a line that create convertedRow column 
	* The right part can be any fuction or value 
	* Remember that in Banana
	* - Date must be in the format "yyyy-mm-dd"
	* - Number decimal separator must be "." and there should be no thousand separator */
	convertionParam.rowConverter = function(inputRow) {
		var convertedRow = {};

		/** MODIFY THE FIELDS NAME AND THE CONVERTION HERE 
		*   The right part is a statements that is then executed for each inputRow
		
		/*   Field that start with the underscore "_" will not be exported 
		*    Create this fields so that you can use-it in the postprocessing function */
		/* use the Banana.Converter.toInternalDateFormat to convert to the appropriate date format */
		convertedRow["Date"] = Banana.Converter.toInternalDateFormat(inputRow["Überweisungsdatum"], "dd.mm.yy");
		convertedRow["Description"] = inputRow["Kommentar"];
		convertedRow["_Description2"] = inputRow["Gruppe nach"];
		/* use the Banana.Converter.toInternalNumberFormat to convert to the appropriate number format 
		*  we already have negative amounts in Betrag and don't need the to fill the column Expenses*/
		convertedRow["Income"] = Banana.Converter.toInternalNumberFormat(inputRow["Betrag"], ",");
		//convertedRow["Expenses"] = inputRow["Total"];
		convertedRow["VatCode"] = inputRow["MWST Code"];
		convertedRow["ContraAccount"] = inputRow["Kategorie"];
		convertedRow["Account"] = inputRow["Art"];
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
	*   If the content of "Account" is the same of the text 
	*   it will be replaced by the account number given */
	//Accounts conversion
	var accounts = {

		"Raiffeisen Kontokorrent" : "1020",
		"Bar" : "1000"

		//...
		
	}

	/** INSERT HERE THE LIST OF CATEGORIES NAME AND THE CONVERSION NUMBER 
	*   If the content of "ContraAccount" is the same of the text 
	*   it will be replaced by the account number given */

	//Categories conversion
	var categories = {

		"Abschreibung Praxisinnenausbau" : "6921",
		"Abschreibungen mobile Sachanlagen" : "6920",
		"AHV, IV, EO, ALV" : "5700",
		"Aufwand für drittleistungen" : "4400",
		"Ausserordentlicher Aufwand" : "8010",
		"Ausserordentlicher Ertrag" : "8000",
		"Bankkreditzinsaufwand" : "6800",
		"Bankspesen und -gebühren" : "6840",
		"Beiträge/Spenden/Vergabungen" : "6520",
		"Berufliche Vorsorge" : "5720",
		"Bruttoertrag Barverkäufe" : "3000",
		"Bruttoertrag Handel Artikel" : "3200",
		"Büromaterial und Fachliteratur" : "6500",
		"Darlehenszinsaufwand" : "6801",
		"Direkte Einkaufsspesen/Frachten/Transporte" : "4070",
		"Einkauf von Bestandteilen" : "4001",
		"Ertrag Miete/Infrastruktur" : "3400",
		"Erträge aus Postcheck- und Bank" : "6850",
		"Fahrzeugaufwand" : "6200",
		"FAK" : "5710",
		"Gebühren und Abgaben" : "6360",
		"Gründungsaufwand" : "6580",
		"Handelseinkauf" : "4200",
		"inaktiv" : "6574",
		"Informatikaufwand" : "6570",
		"Krankentaggeldversicherung" : "5740",
		"Kursgewinne flüssige Mittel" : "6892",
		"Kursverluste" : "6842",
		"Löhne Handel" : "5200",
		"Löhne Produktion" : "5000",
		"Löhne Verwaltung" : "5600",
		"Materialaufwand / Einkauf von Apparaten" : "4000",
		"Mietaufwand" : "6000",
		"Mobiliar und Einrichtung" : "1510",
		"Nebenkosten" : "6030",
		"Privatanteile Verwaltungsaufwand" : "6550",
		"Quellensteuer" : "5790",
		"Rechts- und Beratungsaufwand" : "6530",
		"Reinigung und Entsorgung" : "6460",
		"Reise- und Repräsentationsaufwand" : "6640",
		"Reparaturen / Unterhalt mobile Sachanlagen" : "6100",
		"Sachversicherungen" : "6300",
		"Skonti" : "3290", //Duplicate category name but different numbers: => 3090
		"Sonstiger Personalaufwand" : "5089", //Duplicate category name but different numbers: => 5880
		"Spesenentschädigungen effektiv" : "5820",
		"Spesenentschädigungen pauschal" : "5830",
		"Steuern" : "8900",
		"Strom/Wasser" : "6400",
		"Telefon/Telefax/Porti/Internet" : "6510",
		"Temporäre Arbeitnehmer" : "5900",
		"Unfallversicherung" : "5730",
		"Werbeaufwand" : "6600",
		"Zinsaufwand Gesellschafter" : "6820"

		//...
		
	}

	//Apply the conversions
	for (var i = 0; i < intermediaryData.length; i++) {
		var convertedData = intermediaryData[i];

		//Convert
      if (convertedData["ContraAccount"]) {
         var cleanContraAccount = convertedData["ContraAccount"].replace(/\(.*/,'').trim(); //We delete everything between parentheses
         if (categories.indexOf(cleanContraAccount) > -1)
            convertedData["ContraAccount"] = categories[cleanContraAccount];
      }

      if (convertedData["Account"]) {
         if (accounts.indexOf(convertedData["Account"]) > -1)
            convertedData["Account"] = accounts[convertedData["Account"]];
      }

		if (convertedData["_Description2"]) {
			convertedData["Description"] = convertedData["_Description2"] + ", " + convertedData["Description"];
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
	var columns = getHeaderData(csvFile, convertionParam.headerLineStart); //array
	var rows = getRowData(csvFile, convertionParam.dataLineStart); //array of array

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

// The purpose of this function is to sort the data
function sortData(intermediaryData, convertionParam) {
   if (convertionParam.sortColums && convertionParam.sortColums.length) {
      intermediaryData.sort(
               function(row1, row2) {
                  for (var i = 0; i < convertionParam.sortColums.length; i++) {
                     var columnName = convertionParam.sortColums[i];
                     if (row1[columnName] > row2[columnName])
                        return 1;
                     else if (row1[columnName] < row2[columnName])
                        return -1;
                  }
                  return 0;
               });

      if (convertionParam.sortDescending)
         intermediaryData.reverse();
   }

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
	convertedCsv = Banana.Converter.objectArrayToCsv(columnTitles, intermediaryData, "\t");

	return convertedCsv;
}


//The purpose of this function is to load all the data (titles of the columns and rows) and create a list of objects.
//Each object represents a row of the csv file
function loadForm(form, columns, rows) {
	for(var j = 0; j < rows.length; j++){
		var obj = {};
		for(var i = 0; i < columns.length; i++){
			obj[columns[i]] = rows[j][i];
		}
		form.push(obj);
	}
}


//The purpose of this function is to return all the titles of the columns
function getHeaderData(csvFile, startLineNumber) {
	if (!startLineNumber) {
		startLineNumber = 0;
	}
	var headerData = csvFile[startLineNumber];
	for (var i = 0; i < headerData.length; i++) {

		headerData[i] = headerData[i].trim();

      if (!headerData[i]) {
         headerData[i] = i;
      }

      //Avoid duplicate headers
      var headerPos = headerData.indexOf(headerData[i]);
      if (headerPos >= 0 && headerPos < i) { // Header already exist
         var postfixIndex = 2;
         while (headerData.indexOf(headerData[i] + postfixIndex.toString()) !== -1 && postfixIndex <= 99)
            postfixIndex++; // Append an incremental index
         headerData[i] = headerData[i] + postfixIndex.toString()
      }

	}
	return headerData;
}


//The purpose of this function is to return all the data of the rows
function getRowData(csvFile, startLineNumber) {
	if (!startLineNumber) {
		startLineNumber = 1;
	}
	var rowData = [];
	for (var i = startLineNumber; i < csvFile.length; i++) {
		rowData.push(csvFile[i]);
	}
	return rowData;
}

