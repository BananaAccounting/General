// Copyright [2024] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.apps.parametrizable.import.csv
// @api = 1.0
// @pubdate = 2024-12-30
// @publisher = Banana.ch SA
// @description = Parameterizable import CSV
// @task = import.transactions
// @doctype = 100.*; 110.*; 130.*
// @docproperties = 
// @outputformat = transactions.simple
// @inputdatasource = openfiledialog
// @timeout = -1
// @inputfilefilter = Text files (*.txt *.csv);;All files (*.*)



//This function defines the parameters specific for the CSV Transactions file to be imported
function getConversionParamUser(convertionParam) {
    
    // The following variables need to be set according to the specific 
    // CSV file that will be imported
    
    // Column separator character.
    // Use '\t' for tab separated columns.
    convertionParam.column_separator = ';';

    // Text delimiter character for string
    convertionParam.text_delimiter = '"';

    // Decimal separator charachter used for amounts
    convertionParam.amounts_decimal_separator = '.';

    // Line number where the column header starts (with the columns name)
    // First line is 0
    convertionParam.header_line_start = 0;

    // Line number where data starts 
    // Usually header_line_start + 1
    convertionParam.data_line_start = 1;

    // Column name header for the date transaction 
    convertionParam.column_date_name = '';

    // Date format for column containing dates 
    // For example 'dd.mm.yyyy', 'mm/dd/yyyy', 'dd.mm.yy', 'yyyy-mm-dd'
    convertionParam.date_format = '';

    // Column name for the column description 
    convertionParam.column_description_name = '';

    // Column name for the income amount 
    convertionParam.column_income_name = '';

    // Column name for the expenses/outcome amounts 
    convertionParam.column_expenses_name = '';

    // Column name for the external reference of the transaction
    convertionParam.column_external_reference_name = '';
}

function rowConverterUser(convertionParam, inputRow, convertedRow) {

    /**
	 * The purpose of this function is to let the users define the columns row to be converded
	 * 
	 * MODIFY THE FIELDS NAME AND THE CONVERTION HERE 
	 * The right part is a statements that is then executed for each inputRow
	 * Field that start with the underscore "_" will not be exported 
	 * Create this fields so that you can use it in the postprocessing function 
	 * For a date type, use the Banana.Converter.toInternalDateFormat to convert to the appropriate date format
	 * For an amount type, use the Banana.Converter.toInternalNumberFormat to convert to the appropriate number format
	 */

	//convertedRow["_Description2"] = inputRow["Gruppe nach"];
    //convertedRow["VatCode"] = inputRow["MWST Code"];
    //convertedRow["ContraAccount"] = inputRow["Kategorie"];
    //convertedRow["Account"] = inputRow["Art"];
};




/**
 * DO NOT CHANGE THE FOLLOWING CODE
 */

//The purpose of this function is to define the parameters for the conversion of the CSV file
function defineConversionParam() {
    var convertionParam = {};
    convertionParam.format = "csv";
    convertionParam.column_separator = ';';
    convertionParam.text_delimiter = '"';
    convertionParam.amounts_decimal_separator = ',';
    convertionParam.header_line_start = 0;
    convertionParam.data_line_start = 1;
    convertionParam.column_date_name = '';
    convertionParam.date_format = '';
    convertionParam.column_description_name = '';
    convertionParam.column_income_name = '';
    convertionParam.column_expenses_name = '';
    convertionParam.column_external_reference_name = '';

    /** IN CASE THERE IS NO HEADER 
     *   include the end of line */
    //convertionParam.header = "Date,Income,_None,Description,_Description2\n";

    /** SPECIFY THE COLUMN TO USE FOR SORTING
    If sortColums is empty the data are not sorted */
    convertionParam.sortColums = ["Date", "ExternalReference"];
    convertionParam.sortDescending = false;

    getConversionParamUser(convertionParam);

    return convertionParam;
}

//Main function
function exec(inData) {

    //1. Function call to define the conversion parameters
    var convertionParam = defineConversionParam();

    //2. we can eventually process the input text
    inData = preProcessInData(inData);

    //3. intermediaryData is an array of objects where the property is the banana column name
    var intermediaryData = convertToIntermediaryData(inData, convertionParam);

    //4. translate categories and Description 
    // can define as much postProcessIntermediaryData function as needed
    postProcessIntermediaryData(intermediaryData);

    //5. sort data
    intermediaryData = sortData(intermediaryData, convertionParam);

    //TO DEBUG SHOW THE INTERMEDIARY TEXT
    //Banana.Ui.showText(intermediaryData);

    //6. convert to banana format
    //column that start with "_" are not converted
    var text = convertToBananaFormat(intermediaryData);

    //TO DEBUG SHOW THE INTERMEDIARY TEXT
    //Banana.Ui.showText(text);

    return text;
}


function rowConverter(convertionParam, inputRow) {

    /* rowConvert is a function that convert the inputRow (passed as parameter) to a convertedRow object:
     * - inputRow is an object where the properties are the column names found in the CSV file.
     * - convertedRow is an object where the properties are the column names to be exported in Banana.
     * For each column that you need to export in Banana create a line with the code that creates convertedRow column.
     * The right part can be any function or value.
     */

    var convertedRow = {};
    convertedRow["Date"] = Banana.Converter.toInternalDateFormat(inputRow[convertionParam.column_date_name], convertionParam.date_format);
    convertedRow["Description"] = inputRow[convertionParam.column_description_name];

    if (convertionParam.column_income_name && convertionParam.column_expenses_name && convertionParam.column_income_name !== convertionParam.column_expenses_name) {
        // CSV file with two columns for amounts, one column for income and one columns for expenses.
        // When using both columns Income and Expenses we need to remove negative sign from amounts.
        convertedRow["Income"] = Banana.Converter.toInternalNumberFormat(inputRow[convertionParam.column_income_name], convertionParam.amounts_decimal_separator).replace(/-/g, '');
        convertedRow["Expenses"] = Banana.Converter.toInternalNumberFormat(inputRow[convertionParam.column_expenses_name], convertionParam.amounts_decimal_separator).replace(/-/g, '');
    }
    else {
        // CSV file with one column for amounts (positive and negative amounts).
        // With negative amounts we don't need the to fill the column Expenses.
        // Negative amounts are automatically treated as expenses.
        convertedRow["Income"] = Banana.Converter.toInternalNumberFormat(inputRow[convertionParam.column_income_name], convertionParam.amounts_decimal_separator);
        convertedRow["Expenses"] = '';
    }

    convertedRow["ExternalReference"] = inputRow[convertionParam.column_external_reference_name];

    rowConverterUser(convertionParam, inputRow, convertedRow);

    return convertedRow;
};

function preProcessInData(inData) {
    return inData;
}

//The purpose of this function is to let the user specify how to convert the categories
function postProcessIntermediaryData(intermediaryData) {

    /** INSERT HERE THE LIST OF ACCOUNTS NAME AND THE CONVERSION NUMBER 
     *   If the content of "Account" is the same of the text it will be replaced by the account number given */
    //Accounts conversion
    var accounts = {
        //"Raiffeisen Kontokorrent": "1020",
        //...
    }

    /** INSERT HERE THE LIST OF CATEGORIES NAME AND THE CONVERSION NUMBER 
     *   If the content of "ContraAccount" is the same of the text it will be replaced by the account number given */

    //Categories conversion
    var categories = {
        //"Abschreibung Praxisinnenausbau": "6921",
        //"Abschreibungen mobile Sachanlagen": "6920",
        //...
    }

    //Apply the conversions
    for (var i = 0; i < intermediaryData.length; i++) {
        var convertedData = intermediaryData[i];

        //Convert
        if (convertedData["ContraAccount"]) {
            var cleanContraAccount = convertedData["ContraAccount"].replace(/\(.*/, '').trim(); //We delete everything between parentheses
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

// Convert to an array of objects where each object property is the banana columnNameXml
function convertToIntermediaryData(inData, convertionParam) {
    if (convertionParam.format === "html") {
        return convertHtmlToIntermediaryData(inData, convertionParam);
    } else {
        return convertCsvToIntermediaryData(inData, convertionParam);
    }
}

// Convert to an array of objects where each object property is the banana columnNameXml
function convertCsvToIntermediaryData(inData, convertionParam) {

    var form = [];
    var intermediaryData = [];
    //Add the header if present 
    if (convertionParam.header) {
        inData = convertionParam.header + inData;
    }

    //Read the CSV file and create an array with the data
    var csvFile = Banana.Converter.csvToArray(inData, convertionParam.column_separator, convertionParam.text_delimiter);

    //Variables used to save the columns titles and the rows values
    var columns = getHeaderData(csvFile, convertionParam.header_line_start); //array
    var rows = getRowData(csvFile, convertionParam.data_line_start); //array of array

    //Load the form with data taken from the array. Create objects
    loadForm(form, columns, rows);

    //Create the new CSV file with converted data
    var convertedRow;
    //For each row of the form, we call the rowConverter() function and we save the converted data
    for (var i = 0; i < form.length; i++) {
        convertedRow = rowConverter(convertionParam, form[i]);
        intermediaryData.push(convertedRow);
    }

    //Return the converted CSV data into the Banana document table
    return intermediaryData;
}

// Convert to an array of objects where each object property is the banana columnNameXml
function convertHtmlToIntermediaryData(inData, convertionParam) {

    var form = [];
    var intermediaryData = [];

    //Read the HTML file and create an array with the data
    var htmlFile = [];
    var htmlRows = inData.match(/<tr[^>]*>.*?<\/tr>/gi);
    for (var rowNr = 0; rowNr < htmlRows.length; rowNr++) {
        var htmlRow = [];
        var htmlFields = htmlRows[rowNr].match(/<t(h|d)[^>]*>.*?<\/t(h|d)>/gi);
        for (var fieldNr = 0; fieldNr < htmlFields.length; fieldNr++) {
            var htmlFieldRe = />(.*)</g.exec(htmlFields[fieldNr]);
            htmlRow.push(htmlFieldRe.length > 1 ? htmlFieldRe[1] : "");
        }
        htmlFile.push(htmlRow);
    }

    //Variables used to save the columns titles and the rows values
    var columns = getHeaderData(htmlFile, convertionParam.header_line_start); //array
    var rows = getRowData(htmlFile, convertionParam.data_line_start); //array of array

    //Convert header names
    for (var i = 0; i < columns.length; i++) {
        var convertedHeader = columns[i];
        convertedHeader = convertedHeader.toLowerCase();
        convertedHeader = convertedHeader.replace(" ", "_");
        var indexOfHeader = columns.indexOf(convertedHeader);
        if (indexOfHeader >= 0 && indexOfHeader < i) { // Header alreay exist
            //Avoid headers with same name adding an incremental index
            var newIndex = 2;
            while (columns.indexOf(convertedHeader + newIndex.toString()) !== -1 && newIndex < 99)
                newIndex++;
            convertedHeader = convertedHeader + newIndex.toString()
        }
        columns[i] = convertedHeader;
    }

    //Banana.console.log(JSON.stringify(columns, null, "   "));

    //Load the form with data taken from the array. Create objects
    loadForm(form, columns, rows);

    //Create the new CSV file with converted data
    var convertedRow;
    //For each row of the form, we call the rowConverter() function and we save the converted data
    for (var i = 0; i < form.length; i++) {
        convertedRow = rowConverter(convertionParam, form[i]);
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
        if (name.substring(0, 1) !== "_") {
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
    for (var j = 0; j < rows.length; j++) {
        var obj = {};
        for (var i = 0; i < columns.length; i++) {
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
