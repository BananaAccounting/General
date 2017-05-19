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



var num = 1;
var __SUBSTRING_FILE_NAME_TEST = "_test_expected";
var __IS_EXPERIMENTAL = applicationInfo("isexperimental");
var queryAccountRangeAddress = "A16:A100000";
var worksheetRangeAddress = "A2:AZ100000";
var excelColumns = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
    "AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ"
    //"BA","BB","BC","BD","BE","BF","BG","BH","BI","BJ","BK","BL","BM","BN","BO","BP","BQ","BR","BS","BT","BU","BV","BW","BX","BY","BZ"
];



//////////////////////////////////////////////////////////////////////////////////
//
// Functions that accesses Banana Accounting web server
//
//////////////////////////////////////////////////////////////////////////////////

/* Function that take the content from an url */
function Get(yourUrl) {
    var bananaLocalhost = "http://localhost:8081/v1/";
    var Httpreq = new XMLHttpRequest();
    
    if (yourUrl.indexOf("?") > -1) {
        Httpreq.open("GET",bananaLocalhost + yourUrl + "&" + num,false);
    } else {
        Httpreq.open("GET",bananaLocalhost + yourUrl + "?" + num,false);
    }
    
    Httpreq.send(null);
    num++;
    return Httpreq.responseText;
}

function applicationInfo(info) {
    return Get("application/" + info);
}

function info(bananaFileName, section, id) {
    return Get("doc/" + bananaFileName + "/info/" + section +"/" + id);
}

function accountDescription(bananaFileName, account, column) {
    if (column == "Account") {
        var res = Get("doc/" + bananaFileName + "/accountdescription/" + account +"/Account");
        if (res == "") {
            res = Get("doc/" + bananaFileName + "/accountdescription/" + account +"/Category");
        }
    }
    else if (column == "Category") {
        var res = Get("doc/" + bananaFileName + "/accountdescription/" + account +"/Category");
        if (res == "") {
            res = Get("doc/" + bananaFileName + "/accountdescription/" + account +"/Account");
        }
    }
    else {
        var res = Get("doc/" + bananaFileName + "/accountdescription/" + account +"/" + column);
    }

    return res;
}

function currentBalance(bananaFileName, account, period) {
    var res = Get("doc/" + bananaFileName + "/balance/" + account + "/?period=" + period + "&format=json");
    return JSON.parse(res);
}

function budgetBalance(bananaFileName, account, period) {
    var res = Get("doc/" + bananaFileName + "/budget/" + account + "/?period=" + period + "&format=json");
    return JSON.parse(res);
}

function startperiod(bananaFileName, period) {
    if (period == "ALL") {
        return Get("doc/" + bananaFileName + "/startperiod?period");
    } else {
        return Get("doc/" + bananaFileName + "/startperiod?period=" + period);
    }
}

function endperiod(bananaFileName, period) {
    if (period == "ALL") {
        return Get("doc/" + bananaFileName + "/endperiod?period");    
    } else {
        return Get("doc/" + bananaFileName + "/endperiod?period=" + period);
    }
}


function vatCurrentBalance(bananaFileName, vatcode, period) {
    var res = Get("doc/" + bananaFileName + "/vatbalance/" + vatcode + "/?period=" + period + "&format=json");
    return JSON.parse(res);
}

function vatDescription(bananaFileName, vatcode, column) {
    var res = Get("doc/" + bananaFileName + "/vatdescription/" + vatcode +"/" + column);
    return res;
}

function tableAccounts(bananaFileName) {
    var res = Get("doc/" + bananaFileName + "/table/Accounts?format=json");
    return JSON.parse(res);
}

function tableVatCodes(bananaFileName) {
    var res = Get("doc/" + bananaFileName + "/table/VatCodes?format=json");
    return JSON.parse(res);
}




//Function that appends a text in the log textarea
function log(text) {
    $('#log').append('>'+ text+'\n');
}









(function () {
    "use strict";
   
    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {

        $(document).ready(function () {
            app.initialize();

            //If it's the Experimental version of Banana Accounting, than load and initialize the Office Add-in
            if (__IS_EXPERIMENTAL == "true") {

                $('#update-list').ready(getFileNamesList);
                $('#update-list').click(getFileNamesList);
                $('#load-data').click(generateWorksheetContent);
                $('#update-data').click(updateTables);
                $('#create-test-current').click(createTestCurrent);
                $('#create-test-all').click(createTestAll);
                $('#test-data').click(test);
                $('#slct1').change(populate);
                $('#add_to_query_account').click(addToQueryAccount);
                $('#delete-all').click(deleteActiveWorksheet);
                log("OK");
            } else { //If it's not the Experimental version of Banana Accounting

                app.showNotification("Banana Experimental required. This Office add-in works only with the newest version of Banana Experimental.");
                document.getElementById("ListBox").disabled = true;
                document.getElementById("update-list").disabled = true;
                document.getElementById("load-data").disabled = true;
                document.getElementById("update-data").disabled = true;
                document.getElementById("create-test-current").disabled = true;
                document.getElementById("create-test-all").disabled = true;
                document.getElementById("test-data").disabled = true;
                document.getElementById("slct1").disabled = true;
                document.getElementById("add_to_query_account").disabled = true;
                document.getElementById("delete-all").disabled = true;
            }

        });
    };







    //////////////////////////////////////////////////////////////////////////////////
    //
    // Function that delete active worksheet
    // Used during the development of the add in
    //
    //////////////////////////////////////////////////////////////////////////////////
    function deleteActiveWorksheet() {
        Excel.run(function (ctx) { 

            var worksheet = ctx.workbook.worksheets.getActiveWorksheet();
            worksheet.delete();

            return ctx.sync(); 

        }).catch(function(error) {
            log("Error: " + error);
        });
    }








    //////////////////////////////////////////////////////////////////////////////////
    //
    // Function that retrieve a list with all opened Banana Accounting documents
    //
    //////////////////////////////////////////////////////////////////////////////////
    function getFileNamesList() {

        //Hide the notification message
        app.clearNotification();

        //Empty the list to avoid duplicates
        $('#ListBox').empty();

        var jsonFilenameObj = JSON.parse(Get("docs"));
        var len = jsonFilenameObj.length;

        //If Banana web server is running and there is one or more accounting file retrieved into the list:
        if (len > 0) 
        {
            //Add to the list all the files
            for (var i = 0; i < len; i++)
            {
                var x = document.getElementById("ListBox");
                var option = document.createElement("option");
                option.text = jsonFilenameObj[i];
                x.add(option);
            }
        }
    }









    //////////////////////////////////////////////////////////////////////////////////
    //
    // Populate checkboxes and add the selected values to the worksheet
    //
    //////////////////////////////////////////////////////////////////////////////////
    function populate() {
        app.clearNotification();
        var bananaFileName = $("#ListBox").val();
        var s1 = document.getElementById('slct1');
        var s2 = document.getElementById('slct2');
        s2.innerHTML = "";
        
        if (s1.value == "Accounts") {
            var _accountsAndCategories = loadAccountsAndCategories(bananaFileName);
            var optionArray = _accountsAndCategories;

            document.getElementById("select-all").checked = false;
            document.getElementById("select-all-div").style.display = "block";
        }
        else if (s1.value == "Groups") {
            var _groups = loadGroupsOfAccountsAndCategories(bananaFileName);
            var optionArray = _groups;

            document.getElementById("select-all").checked = false;
            document.getElementById("select-all-div").style.display = "block";
        }
        else if (s1.value == "CostCenters") {
            var _costcenters = loadCostCenters(bananaFileName);
            var optionArray = _costcenters;

            document.getElementById("select-all").checked = false;
            document.getElementById("select-all-div").style.display = "block";
        }
        else if (s1.value == "Segments") {
            var _segments = loadSegments(bananaFileName);
            var optionArray = _segments;

            document.getElementById("select-all").checked = false;
            document.getElementById("select-all-div").style.display = "block";
        }
        else if (s1.value == "All") {
            var _all = loadAll(bananaFileName);
            var optionArray = _all;

            document.getElementById("select-all").checked = false;
            document.getElementById("select-all-div").style.display = "block";
        }
        else if (s1.value == "VatCodes") {
            var _vatcodes = loadVatCodes(bananaFileName);
            var optionArray = _vatcodes;

            document.getElementById("select-all").checked = false;
            document.getElementById("select-all-div").style.display = "block";
        }
        else if (s1.value == "") {
            document.getElementById("select-all").checked = false;
            document.getElementById("select-all-div").style.display = "none";
        }

        //Create checkboxes for the selected option
        for (var option in optionArray) {
            if (optionArray.hasOwnProperty(option)) {
                var pair = optionArray[option];
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "checkboxes[]";
                checkbox.value = pair;
                s2.appendChild(checkbox);
        
                var label = document.createElement('label')
                label.htmlFor = pair;
                label.appendChild(document.createTextNode(pair));

                s2.appendChild(label);
                s2.appendChild(document.createElement("br"));    
            }
        }
    }

    //Load accounts and categories
    function loadAccountsAndCategories(bananaFileName) {
        
        var array = [];

        //ACCOUNTS
        var jsonAccountsObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Accounts?format=json"));
        var lenAccounts = jsonAccountsObj.length;
        
        for (var i = 0; i < lenAccounts; i++) {
            if (jsonAccountsObj[i].Account) {
                var str = jsonAccountsObj[i].Account;
                if (str.substring(0,1) != "." 
                    && str.substring(0,1) != "," 
                    && str.substring(0,1) != ";"
                    && str.substring(0,1) != ":"
                    && str.substring(0,2) != "::"
                    && str.substring(0,3) != ":::"
                    && str.substring(0,4) != "::::"
                    && str.substring(0,5) != ":::::"
                    && str.substring(0,6) != "::::::"
                    && str.substring(0,7) != ":::::::"
                    && str.substring(0,8) != "::::::::"
                    && str.substring(0,9) != ":::::::::"
                    && str.substring(0,10) != "::::::::::") {

                    var account = jsonAccountsObj[i].Account;
                    var description = jsonAccountsObj[i].Description;
                    if (account) {
                        array.push(account + " " + description);
                    }
                }
            }
        }

        //CATEGORIES
        var filetype = info(bananaFileName, "Base", "FileType");
        if (filetype == 'Income & Expense accounting') {
            
            var jsonCategoriesObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Categories?format=json"));
            var lenCategories = jsonCategoriesObj.length;
            
            for (var i = 0; i < lenCategories; i++) {
                if (jsonCategoriesObj[i].Category) {
                    var str = jsonCategoriesObj[i].Category;
                    if (str.substring(0,1) != "." 
                        && str.substring(0,1) != "," 
                        && str.substring(0,1) != ";"
                        && str.substring(0,1) != ":"
                        && str.substring(0,2) != "::"
                        && str.substring(0,3) != ":::"
                        && str.substring(0,4) != "::::"
                        && str.substring(0,5) != ":::::"
                        && str.substring(0,6) != "::::::"
                        && str.substring(0,7) != ":::::::"
                        && str.substring(0,8) != "::::::::"
                        && str.substring(0,9) != ":::::::::"
                        && str.substring(0,10) != "::::::::::") {

                        var category = jsonCategoriesObj[i].Category;
                        var description = jsonCategoriesObj[i].Description;
                        if (category) {
                            array.push(category + " " + description);
                        }
                    }
                }
            }
        }

        return array; 
    }

    //Load groups of the accounts
    function loadGroupsOfAccountsAndCategories(bananaFileName) {
        
        var array = [];
        
        //ACCOUNTS
        var jsonAccountsObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Accounts?format=json"));
        var lenAccounts = jsonAccountsObj.length;
        
        for (var i = 0; i < lenAccounts; i++) {
            var group = jsonAccountsObj[i].Group;
            var description = jsonAccountsObj[i].Description;
            if (group) {
                array.push("Gr="+group + " " + description);
            }
        }

        //CATEGORIES
        var filetype = info(bananaFileName, "Base", "FileType");
        if (filetype == 'Income & Expense accounting') {

            var jsonCategoriesObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Categories?format=json"));
            var lenCategories = jsonCategoriesObj.length;
            
            for (var i = 0; i < lenCategories; i++) {
                var group = jsonCategoriesObj[i].Group;
                var description = jsonCategoriesObj[i].Description;
                if (group) {
                    array.push("GrC="+group + " " + description);
                } 
            }
        }

        return array; 
    }

    //Load cost centers for accounts
    function loadCostCenters(bananaFileName) {
        var array = [];

        //ACCOUNTS
        var jsonAccountsObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Accounts?format=json"));
        var len = jsonAccountsObj.length;
        for (var i = 0; i < len; i++) {
            if (jsonAccountsObj[i].Account) {
                var str = jsonAccountsObj[i].Account;
                if (str.substring(0,1) == "." || str.substring(0,1) == "," || str.substring(0,1) == ";") {
                    var account = jsonAccountsObj[i].Account;
                    var description = jsonAccountsObj[i].Description;
                    array.push(account + " " + description);
                }          
            }
        }

        //CATEGORIES
        var filetype = info(bananaFileName, "Base", "FileType");
        if (filetype == 'Income & Expense accounting') {
            var jsonCategoriesObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Categories?format=json"));
            var len = jsonCategoriesObj.length;
            for (var i = 0; i < len; i++) {
                if (jsonCategoriesObj[i].Category) {
                    var str = jsonCategoriesObj[i].Category;
                    if (str.substring(0,1) == "." || str.substring(0,1) == "," || str.substring(0,1) == ";") {
                        var category = jsonCategoriesObj[i].Category;
                        var description = jsonCategoriesObj[i].Description;
                        array.push(category + " " + description);
                    }          
                }
            }
        }

        return array; 
    }

    //Load segments for accounts
    function loadSegments(bananaFileName) {
        var array = [];
        
        //ACCOUNTS
        var jsonAccountsObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Accounts?format=json"));
        var len = jsonAccountsObj.length;
        for (var i = 0; i < len; i++) {
            if (jsonAccountsObj[i].Account) {
                var str = jsonAccountsObj[i].Account;
                if (str.substring(0,1) == ":" ||
                    str.substring(0,2) == "::" ||
                    str.substring(0,3) == ":::" ||
                    str.substring(0,4) == "::::" ||
                    str.substring(0,5) == ":::::" ||
                    str.substring(0,6) == "::::::" ||
                    str.substring(0,7) == ":::::::" ||
                    str.substring(0,8) == "::::::::" ||
                    str.substring(0,9) == ":::::::::" ||
                    str.substring(0,10) == "::::::::::"
                ) {
                    var account = jsonAccountsObj[i].Account;
                    var description = jsonAccountsObj[i].Description;
                    array.push(account + " " + description);
                }          
            }
        } 

        //CATEGORIES
        var filetype = info(bananaFileName, "Base", "FileType");
        if (filetype == 'Income & Expense accounting') {
            var jsonAccountsObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Categories?format=json"));
            var len = jsonAccountsObj.length;
            for (var i = 0; i < len; i++) {
                if (jsonAccountsObj[i].Category) {
                    var str = jsonAccountsObj[i].Category;
                    if (str.substring(0,1) == ":" ||
                        str.substring(0,2) == "::" ||
                        str.substring(0,3) == ":::" ||
                        str.substring(0,4) == "::::" ||
                        str.substring(0,5) == ":::::" ||
                        str.substring(0,6) == "::::::" ||
                        str.substring(0,7) == ":::::::" ||
                        str.substring(0,8) == "::::::::" ||
                        str.substring(0,9) == ":::::::::" ||
                        str.substring(0,10) == "::::::::::"
                    ) {
                        var category = jsonAccountsObj[i].Category;
                        var description = jsonAccountsObj[i].Description;
                        array.push(category + " " + description);
                    }          
                }
            }       
        }
        
        return array; 
    }

    //Load sequentially all elementes of Accounts and Categories tables
    function loadAll(bananaFileName) {
        
        var array = [];

        //ACCOUNTS
        var jsonAccountsObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Accounts?format=json"));
        var lenAccounts = jsonAccountsObj.length;

        for (var i = 0; i < lenAccounts; i++) {
            
            var group = jsonAccountsObj[i].Group;
            var account = jsonAccountsObj[i].Account;
            var description = jsonAccountsObj[i].Description;

            if (account) {
                array.push(account + " " + description);
            }
            if (group) {
                array.push("Gr="+group + " " + description);
            }
        }

        //CATEGORIES
        var filetype = info(bananaFileName, "Base", "FileType");
        if (filetype == 'Income & Expense accounting') {
            
            var jsonCategoriesObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Categories?format=json"));
            var lenCategories = jsonCategoriesObj.length;
            
            for (var i = 0; i < lenCategories; i++) {
                
                var group = jsonCategoriesObj[i].Group;
                var category = jsonCategoriesObj[i].Category;
                var description = jsonCategoriesObj[i].Description;

                if (category) {
                    array.push(category + " " + description);
                }
                if (group) {
                    array.push("GrC="+group + " " + description);
                }
            }
        }

        return array;
    }


    function loadVatCodes(bananaFileName) {
        var array = [];
        var jsonVatCodesObj = JSON.parse(Get("doc/" + bananaFileName +"/vatcodes?format=json"));
        var len = jsonVatCodesObj.length;

        for (var i = 0; i < len; i++) {
            if (jsonVatCodesObj[i].id) {
                var id = jsonVatCodesObj[i].id;
                var description = jsonVatCodesObj[i].descr;
                if (id) {
                    array.push(id + " " + description);
                }
            }
        }
        return array; 
    }

    //Add to the worksheet all the selected elements from the checkbox
    //Values are added starting from the selected cell:
    // >> At the moment it is possible to add values only on the column A 
    function addToQueryAccount() {

        app.clearNotification();

        //Retrieve all selected checkboxes
        var values = [].filter.call(document.getElementsByName('checkboxes[]'), function(c) {
            return c.checked;
        }).map(function(c) {
            return c.value;
        });
        //log(values);

        //For each selected checkbox we take only the account/group string and push it into a new array
        var selected = [];
        for (var i = 0; i < values.length; i++) {
            selected.push(values[i].split(" ")[0]);
        }
        //log(selected);

        //Write data into the worksheet
        Excel.run(function (ctx) {

            //Get the current selected cell's worksheet (ex. Sheet1!A16)
            var selectedRange = ctx.workbook.getSelectedRange().load();
            
            return ctx.sync().then(function() {
                
                //From the selected cell we get only the column-row (ex. A16)
                var cell = selectedRange.address.split("!")[1]; 

                //Split the cell into two parts: column (A) and row (16)
                var parts = cell.match(/([A-Za-z]+)([0-9]+)/);
                var column = parts[1];
                var row = parts[2];

                //log("column : " + column);
                //log("row: " + row);

                //Check that the selected cell in the worksheet is from the column "A" (the QueryAccount column)
                if (column == "A") {
                    for (var i = 0; i < selected.length; i++) {
                        //Write the value
                        ctx.workbook.worksheets.getActiveWorksheet().getRange(column+row).values = "'"+selected[i];
                        //log("Added new QueryAccount... " + column + row);
                        
                        //Increase the row for the next value
                        row++;
                    }
                } else {
                    app.showNotification('Wrong cell. Select a cell from the "QueryAccount" column.');
                }

                //After the selected QueryAccounts has been added uncheck all the checkboxes 
                uncheckAll("select-all-div"); //"(select all)" checkbox
                uncheckAll("slct2"); //list checkboxes

            });
        }).catch(function (error) {
            log(error);
        });
    }







    //////////////////////////////////////////////////////////////////////////////////
    //
    // Functions that generates the Header section in the current worksheet
    //
    //////////////////////////////////////////////////////////////////////////////////
    
    //Function that generates the content of the worksheet
    function generateWorksheetContent() {

        //Get the File Name
        var bananaFileName = $("#ListBox").val();

        Excel.run(function (ctx) {

            app.clearNotification();

            //Take the current active worksheet and use it to generate the Header
            var activeWorksheet = ctx.workbook.worksheets.getActiveWorksheet();
            activeWorksheet.load('name');

            return ctx.sync().then(function () {
                
                //Function call to generate the Header
                generateHeader(ctx, activeWorksheet, bananaFileName);
                activeWorksheet.activate();

            });

        }).then(function () {
            //app.showNotification("Table successfully generated.");
            //log("Table successfully generated.");
        }).catch(function (error) {
            app.showNotification("Error", "Something went wrong: " + error);
            log("Error: " + error);
        });
    }


    //Function that generates the Header section
    function generateHeader(ctx, activeSheet, bananaFileName) {

        //var radiovalue = $("input[type=radio]:checked").val();
        
        //Run the batched commands
        return ctx.sync().then(function () {

            activeSheet.getRange().clear();

            activeSheet.getRange("A1").values = 'QueryStart';
            activeSheet.getRange("A1").format.font.bold = true;

            activeSheet.getRange("A2").values = 'QueryColumn';
            activeSheet.getRange("A3").values = 'File name';
            activeSheet.getRange("A4").values = 'Type';
            activeSheet.getRange("A5").values = 'Column';
            activeSheet.getRange("A6").values = 'Segment';
            activeSheet.getRange("A7").values = 'Start date';
            activeSheet.getRange("A8").values = 'End date';
            activeSheet.getRange("A9").values = 'Period Begin';
            activeSheet.getRange("A10").values = 'Period End';
            activeSheet.getRange("A11").values = 'Currency';
            activeSheet.getRange("A12").values = 'Header Left';
            activeSheet.getRange("A13").values = 'Header Right';
            activeSheet.getRange("A2").format.font.bold = true;

            activeSheet.getRange("B2").values = 'QueryOptions';
            activeSheet.getRange("B2").format.font.bold = true;
            activeSheet.getRange("B11").values = 'repeat';
            activeSheet.getRange("B12").values = 'repeat';
            activeSheet.getRange("B13").values = 'repeat';

            activeSheet.getRange("C3").values = bananaFileName;
            activeSheet.getRange("C4").values = 'Column';
            activeSheet.getRange("C5").values = 'Group';

            activeSheet.getRange("D4").values = 'Column';
            activeSheet.getRange("D5").values = 'Account';

            activeSheet.getRange("E4").values = 'Column';
            activeSheet.getRange("E5").values = 'Description';

            activeSheet.getRange("F4").values = 'Current';
            activeSheet.getRange("F5").values = 'Opening';
            activeSheet.getRange("F7").values = '';

            activeSheet.getRange("G4").values = 'Current';
            activeSheet.getRange("G5").values = 'Amount';
            activeSheet.getRange("G7").values = '';
            activeSheet.getRange("G8").values = '';

            //TABLE
            activeSheet.getRange("A15").values = 'QueryAccount';
            activeSheet.getRange("B15").values = 'QueryOptions';
            activeSheet.getRange("A15:AZ15").format.font.bold = true;
            
            // activeSheet.getRange("A3:A8").format.fill.color = "Yellow";
            // activeSheet.getRange("C3:AZ8").format.fill.color = "Yellow";
            // activeSheet.getRange("B11").format.fill.color = "Yellow";
            // activeSheet.getRange("B12").format.fill.color = "Yellow";
            // activeSheet.getRange("B13").format.fill.color = "Yellow";

            //activeSheet.getRange("A12").values = radiovalue;
        
        app.showNotification("Header successfully created.");
        log("Header successfully created.");

        }).then(ctx.sync);
    }









    //////////////////////////////////////////////////////////////////////////////////
    //
    // Update worksheet
    //
    //////////////////////////////////////////////////////////////////////////////////
    
    //Function that creates a range with the given parameters
    function createRange(startRow, startColumn, endRow, endColumn ) { //, offsetRow, offsetColumn) {

        // var excelColumns = [
        //     "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
        //     "AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ"
        //     //"BA","BB","BC","BD","BE","BF","BG","BH","BI","BJ","BK","BL","BM","BN","BO","BP","BQ","BR","BS","BT","BU","BV","BW","BX","BY","BZ"
        // ];


        // if (offsetRow > 0) {
        //     startRow = startRow + offsetRow -1;
        // }
        // if (offsetColumn > 0) {
        //     startColumn = startColumn + offsetColumn -1;
        // }

        var rangeStartColumn = excelColumns[startColumn];
        var rangeEndColumn = excelColumns[endColumn];
        var range = rangeStartColumn+startRow + ":" + rangeEndColumn+endRow;
        return range;
    }





    // Function that updates the current worksheet with data taken from Banana Accounting.
    // To do this are used: 
    // - the data of "QueryColumn" and "QueryOptions" of the header section
    // - the data of "QueryAccount" and "QueryOptions" of the table section
    function updateTables() {

        //At the begin of the update we show a loader to help user understand that the script is working
        document.getElementById('loader').style.display = 'block';

        app.clearNotification();
        

        var queryColumnsRange = []; // Array containing all the ranges for the "QueryColumns"
        var queryColumns = {}; // Object containing all the QueryColumn's data (File name, Column, Segement, Start date, End date) of each column
        var queryColumnsAll = []; // Array of objects used to store all the single queryColumns

        var queryAccountRange = []; // Array containing all the ranges for the column "QueryAccount"
        var queryAccount = {}; // Object containing all the account numbers with their cell addresses and QueryOptions 
        var usedQueryAccounts = {}; // Object containing the number of used cells in the QueryAccount column
        var blocksQueryAccountStartingRows = []; // Array containing the first row number of each block of QueryAccount
        
        var headerQueryOptionsRange = [];   //Array containing the range of the QueryOptions for the header section
        var headerQueryOptions = {}; // Object containing the options of the header  

        var queryOptionsRange = []; // Array containing all the ranges of the column "QueryOptions" for the table section

        var balances = []; // Array of objects containing for each account: the column index, the row and the calculated balance value

      

        


        
        // Create a starter promise object
        var promise = new OfficeExtension.Promise(function(resolve, reject) { resolve (null); });
        

        //LEGGERE QUERYSTART....


        //We set the columns range with default values
        //It is used to read the header input field of each column that will be used to calculate and display all the data
        queryColumnsRange.push(createRange(3,2,8,25));  // C3:Z8
        queryColumnsRange.push(createRange(3,26,8,51)); // AA3:AZ8

        //We set the range for the header query options
        //It is used to read the header input options that define how to display Currency / Header Left / Header Right data
        headerQueryOptionsRange.push(createRange(11,1,13,1)); // B11:B13


        //-------------------------------------------------------------------------------------------------------------------
        //  [1] For each columns of the queryColumnsRange we read the header section and create the queryColumns object
        //      that will contain all the data needed to update the worksheet:
        //      file name, type, column, segment, start date, end date, currency, header left, header right
        //-------------------------------------------------------------------------------------------------------------------
        var queryColumnsRangeLength = queryColumnsRange.length;
        for (var i = 0; i < queryColumnsRangeLength; i++) {
            // Create a closure over i, since it's used inside a function that won't be immediately executed.
            (function(i) {
                promise = promise.then(function() {
                    return ReadDataFromColumns(queryColumns, queryColumnsAll, queryColumnsRange[i], usedQueryAccounts, headerQueryOptionsRange, headerQueryOptions);
                })
            })(i);
        }


        //-------------------------------------------------------------------------------------------------------------------
        //  [2] Creates ranges using the used cells of the QueryAccount and QueryOptions.
        //      queryAccountRange for the account/group/segment/cost centers inserted on the QueryAccount column
        //      queryOptionsRange for the options (invert, budget, budgetinvert) inserted on the QueryOptions column
        //
        //      Instead of using a single big range we divide it into multiple small ranges.
        //-------------------------------------------------------------------------------------------------------------------
        promise = promise.then(function() {
            //log("Outside, between ReadDataFromColumns and ReadQueryAccount : " + usedQueryAccounts.cellCount);

            //Calculates the max row:
            // - 16 it's the starting row (before there is the header section)
            // - usedQueryAccounts.cellCount is the number of used rows (rows that contains a QueryAccount number)
            var maxRow = 16+usedQueryAccounts.cellCount;
            
            if (maxRow <= 100) { //If there are 100 rows or less, for the range creation we use an increment of 10 rows 
                var incr = 10;
            } else { //else we use an increment of 100 rows 
                var incr = 100;
            }

            //Instead of using a single big range we divide it into multiple small ranges
            for (i = 16; i < maxRow; i+=incr) {
                queryAccountRange.push(createRange(i,0,i + incr-1,0));  // ex. A16:A115, A116:A225, ...
                queryOptionsRange.push(createRange(i,1,i + incr-1,1)); // ex. B16:B115, B116:B225, ...
            }

            //Fill the blocksQueryAccountStartingRows array with all the starting rows of each range
            //This is used to know exactly at which row a range begins
            for (var i = 0; i < queryAccountRange.length; i++) {
                //Split the cell into two parts: column and row. We need the row
                var cell = queryAccountRange[i].split(":")[0];
                var parts = cell.match(/([A-Za-z]+)([0-9]+)/); 
                blocksQueryAccountStartingRows.push(parseInt(parts[2])); //row number
            }

            // log("maxRow: " + maxRow);
            // log("queryAccountRange: " + queryAccountRange);
            // log("queryOptionsRange: " + queryOptionsRange);
            // log("blocksQueryAccountStartingRows: " + blocksQueryAccountStartingRows);

        })
        


        promise = promise.then(function() {

            //-------------------------------------------------------------------------------------------------------------------
            //  [3] For each row of the queryAccountRange we read the QueryAccount number and the QueryOption text.
            //      With them and the data from the QueryColumns we can create the query to use for the Banana webserver calls.
            //      These calls returns the data that will be displayed in the worksheet
            //-------------------------------------------------------------------------------------------------------------------
            var queryAccountRangeLength = queryAccountRange.length;
            for (var i = 0; i < queryAccountRangeLength; i++) {
                // Create a closure over i, since it's used inside a function that won't be immediately executed.
                (function(i) {
                    promise = promise.then(function() {
                        return ReadQueryAccount(queryAccount, queryAccountRange[i], queryOptionsRange[i], blocksQueryAccountStartingRows[i]);
                    })
                    promise = promise.then(function() {
                        return ReadDataFromBanana(queryAccount, queryColumnsAll, blocksQueryAccountStartingRows[i], balances);
                    })
                })(i);
            }

            //-------------------------------------------------------------------------------------------------------------------
            //  [4] At the end, when we have all the needed data, we write them in excel's worksheet
            //-------------------------------------------------------------------------------------------------------------------
            promise = promise.then(function() {
                return WriteDataInExcel(queryColumnsAll, balances, headerQueryOptions);
            })

        })

    }

 





    /////////////////////////////////////////////////////////////////////////////////
    // 1. Read data from columns
    /////////////////////////////////////////////////////////////////////////////////
    function ReadDataFromColumns(columnsQuery, columnsQueryAll, ColumnsRange, usedRange, HeaderQueryOptionsRange, headerQueryOptions) {

        return Excel.run(function (ctx) {

            //Get the actual active worksheet
            var activeWorksheet = ctx.workbook.worksheets.getActiveWorksheet();
            activeWorksheet.load('name');

            //File, Type, Column, Segment, Start date, End date
            var columnsRange = activeWorksheet.getRange(ColumnsRange);
            columnsRange.load('address, values');

            //Header QueryOptions
            var headerQueryOptionsRange = activeWorksheet.getRange(HeaderQueryOptionsRange[0]);
            headerQueryOptionsRange.load('address, values');

            //Return the number of used rows of the column "QueryAccount"
            var range = activeWorksheet.getRange(queryAccountRangeAddress);
            var rangeUR = range.getUsedRange();
            rangeUR.load('cellCount');


            return ctx.sync().then(function () {

                //1. Read data from the Header QueryOptions: "repeat" or "norepeat"
                var optionCurrency = headerQueryOptionsRange["values"][0];
                var optionHeaderLeft = headerQueryOptionsRange["values"][1];
                var optionHeaderRight = headerQueryOptionsRange["values"][2];

                //Convert them into strings and set lowercase
                headerQueryOptions.currency = optionCurrency.toString();
                headerQueryOptions.headerLeft = optionHeaderLeft.toString().toLowerCase();
                headerQueryOptions.headerRight = optionHeaderRight.toString().toLowerCase();


                //2. Read data from the Header QueryColumns
                var lastFileName = "";

                var len = columnsRange["values"][0].length;
                for (var j = 0; j < len; j++) {
                    columnsQuery[j] = {
                        file : columnsRange["values"][0][j],
                        type : columnsRange["values"][1][j].toLowerCase(),
                        column : columnsRange["values"][2][j].toLowerCase(),
                        segment : columnsRange["values"][3][j],
                        startdate : columnsRange["values"][4][j],
                        enddate : columnsRange["values"][5][j],
                        //columnIndex : ...
                    };
                    
                    //Split the cell address in two parts: column and row
                    var cell = columnsRange.address.split("!")[1];
                    var parts = cell.match(/([A-Za-z]+)([0-9]+)/);
                    var column = parts[1];
                    // log("CELL: " + cell);
                    // log("PARTS: " + parts);
                    // log("COLUMN: " + column);
                    
                    if (column.length == 1) { // ex. A, B, C, ...
                        columnsQuery[j].columnIndex = String.fromCharCode(column.charCodeAt(0) + j); //Increment character
                        // log("LEN=1: " + columnsQuery[j].columnIndex);
                    }
                    else if (column.length == 2) { // ex. AA, AB, AC, ..
                        columnsQuery[j].columnIndex = column.charAt(0) + String.fromCharCode(column.charCodeAt(1) + j); //Increment second character
                        // log("LEN=2: " + columnsQuery[j].columnIndex);
                    }

                    //Take the new filename if:
                    //-it's not the same as lastFileName
                    //-it's not a previous string (p1, p2, p3, ...)                    
                    if (columnsQuery[j].file 
                        && columnsQuery[j].file != lastFileName 
                        && columnsQuery[j].file.substring(0,1) != "p" 
                        && columnsQuery[j].file.indexOf(".ac2") > -1) {

                        lastFileName = columnsQuery[j].file;
                        // log("new filename " + lastFileName);
                    }
                    //Set the new file name if:
                    //-it's the same as lastFileName
                    //-cell is empty
                    else if (columnsQuery[j].file == lastFileName || !columnsQuery[j].file) {
                        columnsQuery[j].file = lastFileName;
                        // log("same filename or empty cell. We use " + lastFileName);
                    }
                    //Take the "previous" file name if:
                    //-it's different than lastFileName
                    //-it's a previous string (start with "p" and no ".ac2")
                    else if (columnsQuery[j].file != lastFileName 
                        && columnsQuery[j].file.substring(0,1) == "p" 
                        && columnsQuery[j].file.indexOf(".ac2") < 0) {

                        lastFileName = lastFileName.replace(/_p[0-9]/g, ''); //remove _pXX before add the new
                        var numberPrevious = columnsQuery[j].file.substring(1); //take the number
                        columnsQuery[j].file = lastFileName + "_p" + numberPrevious;

                        // log("numberPrevious = " + numberPrevious);
                        // log("p"+numberPrevious + ". We use " + lastFileName + "_p" + numberPrevious);

                        lastFileName = columnsQuery[j].file;
                    }


                    //Add properties to columnsQuery
                    columnsQuery[j].basiccurrency = info(lastFileName, "AccountingDataBase", "BasicCurrency");
                    columnsQuery[j].headerleft = info(lastFileName, "Base", "HeaderLeft");
                    columnsQuery[j].headerright = info(lastFileName, "Base", "HeaderRight");


                    //At the end we store the columnsQuery into an array that will contain all the QueryColumn
                    columnsQueryAll.push(columnsQuery[j]);
                    
                    //Save the number of used cells of the QueryAccounts
                    usedRange.cellCount = rangeUR.cellCount;
                }
            
            });
        }).catch(function (error) {
            app.showNotification("Error", "Something went wrong: " + error);
            log("Error: " + error);
        });
    }
    
    



    /////////////////////////////////////////////////////////////////////////////////
    //2. Read QueryAccount and QueryInvert data 
    /////////////////////////////////////////////////////////////////////////////////
    function ReadQueryAccount(queryAccount, QueryAccountRange, QueryOptionsRange, startingRows) {
        return Excel.run(function (ctx) {

            // log("Inside ReadQueryAccount: usedRange => " + usedRange.cellCount);
            // log("Inside ReadQueryAccount: QueryAccountRange => " + QueryAccountRange);
            // log("Inside ReadQueryAccount: QueryOptionsRange => " + QueryOptionsRange);
            // log("Inside ReadQueryAccount: startingRows => " + startingRows);

            //Get the active worksheet
            var activeWorksheet = ctx.workbook.worksheets.getActiveWorksheet();
            activeWorksheet.load('name');

            //Load QueryAccountRange values and address
            var queryAccountsRange = activeWorksheet.getRange(QueryAccountRange);
            queryAccountsRange.load('address, values');

            //Load QueryOptionsRange values and address
            var queryOptionsRange = activeWorksheet.getRange(QueryOptionsRange);
            queryOptionsRange.load('address, values');


            return ctx.sync().then(function () {

                var row = startingRows;
                var len = queryAccountsRange["values"].length;
                for (var j = 0; j < len; j++) {
                    queryAccount[j] = {
                        address : "A"+row,
                        text : queryAccountsRange["values"][j], //account number
                        queryoptions: queryOptionsRange["values"][j].toString().toLowerCase().trim() //Remove spaces and set lower case
                    };
                    row++;
                }

            }); 

        }).catch(function (error) {
            app.showNotification("Error", "Something went wrong: " + error);
            log("Error: " + error);
        });
    }







    /////////////////////////////////////////////////////////////////////////////////
    // 3. Read data from banana
    /////////////////////////////////////////////////////////////////////////////////
    function ReadDataFromBanana(queryAccount, columnsQuery, rowStart, balances) {

        return Excel.run(function (ctx) {

            // log("Inside ReadDataFromBanana: usedRange => " + usedRange.cellCount);
            // log("Inside ReadDataFromBanana: startingRows => " + rowStart);

            return ctx.sync().then(function () {

                for (var i in queryAccount) {

                    var account = queryAccount[i].text;
                    var queryoptions = queryAccount[i].queryoptions;

                    //For all the rows that contain a QueryAccount we take data from columnsQuery and with them we
                    //calculate all the values using accountDescription(), currentBalance(), budgetBalance() functions
                    if (account != "") {

                        var columnsQueryLength = columnsQuery.length;
                        for (var j = 0; j < columnsQueryLength; j++) {

                            var filename = columnsQuery[j].file;
                            var type = columnsQuery[j].type;
                            var column = columnsQuery[j].column;
                            var segment = columnsQuery[j].segment;
                            var startdate = columnsQuery[j].startdate;
                            var enddate = columnsQuery[j].enddate;
                            var columnIndex = columnsQuery[j].columnIndex;

                            // a) ACCOUNT DESCRIPTION
                            if (type == "column") { //Account description

                                if (column == "bclass") {
                                    column = "BClass";
                                }
                                else {
                                    column = column.charAt(0).toUpperCase() + column.slice(1); //capitalize first letter for the webserver call
                                }
                                var columnValue = accountDescription( filename, account, column ).trim();
                                var row = rowStart + parseInt(i);
                                balances.push({"col":columnIndex, "row":row, "value":columnValue});
                                //log(JSON.stringify(balances));
                            }

                            // b) VAT DESCRIPTION: Group, VatCode, Description, Gr, Gr1, IsDue, AmountType, VatRate, VatRateOnGross, VatPercentNonDeductible, VatAccount
                            else if (type == "columnvat") { //Vat description
                                
                                if (column == "vatcode") {
                                    column = "VatCode";
                                }
                                else if (column == "isdue") {
                                    column = "IsDue";
                                }
                                else if (column == "amounttype") {
                                    column = "AmountType";
                                }
                                else if (column == "vatrate") {
                                    column = "VatRate";
                                }
                                else if (column == "vatrateongross") {
                                    column = "VatRateOnGross";
                                }
                                else if (column == "vatpercentnondeductible") {
                                    column = "VatPercentNonDeductible";
                                }
                                else if (column == "vataccount") {
                                    column = "VatAccount";
                                }
                                else {
                                    column = column.charAt(0).toUpperCase() + column.slice(1); //capitalize first letter for the webserver call
                                }
                                var columnValue = vatDescription( filename, account, column ).trim();
                                var row = rowStart + parseInt(i);
                                balances.push({"col":columnIndex, "row":row, "value":columnValue});
                                //log(JSON.stringify(balances));
                            }

                            // c) CURRENT && BUDGET BALANCE
                            else if (type == "current" || type == "budget") {

                                //Function call to convert the period
                                convertPeriod(filename, columnsQuery[j], startdate, enddate);
                                
                                

                                //QueryAccount's first character is not a "$": it is a normal Account or Group
                                if (account.toString().substring(0,1) != "$") {
                                    var _account = account+segment;
                                }

                                //QueryAccount's first character is "$": it is a custom regroup using a column
                                else if (account.toString().substring(0,1) == "$") {
                                    
                                    //Crates the array containing all the accounts with tha same columnValue
                                    var accountsArray = getAccountsList(filename, account.toString()); //ex. [1000,1010,1011]
                                    
                                    //Creates the string that will be used in the currentBalance/budgetBalance functions
                                    var _account = accountsArray.join("|"); //ex. 1000|1010|1011 (accounts)

                                    if (_account.indexOf("Gr=") > -1) { //ex. Gr=100|Gr=110|Gr=120 (groups)
                                        _account = _account.replace(/Gr=/g, ""); //ex. 100|110|120
                                        _account = "Gr="+_account; //ex. Gr=100|110|120
                                    }
                                    //log(_account);
                                }



                                //Check if is Current or Budget: we use the currentBalance() or the budgetBalance() function to calculate the balance value
                                if (type == "current") {
                                    var balanceValue = currentBalance( filename, _account, columnsQuery[j].formattedString );
                                } else if (type == "budget") {
                                    var balanceValue = budgetBalance( filename, _account, columnsQuery[j].formattedString );
                                }

                                //Check the content of QueryOptions cell:
                                //a) Cell contains "invert", so we invert the value (except for the bclass, dates, period string and row count)
                                if (queryoptions == "invert" && balanceValue[column] && column!="bclass" && column!="enddate" && column!="periodstring" && column!="rowcount" && column!="startdate") {
                                    var balanceValueColumn = -1 * balanceValue[column];
                                }
                                //b) cell contains "budget", so we use the budgetBalance() function
                                else if (queryoptions == "budget") {
                                    var balanceValue = budgetBalance( filename, _account, columnsQuery[j].formattedString );
                                    var balanceValueColumn = balanceValue[column];
                                }
                                //c) cell contains "budgetinvert", so we use the budgetBalance() function and than invert the value (except for the bclass, dates, period string and row count)
                                else if (queryoptions == "budgetinvert" && balanceValue[column] && column!="bclass" && column!="enddate" && column!="periodstring" && column!="rowcount" && column!="startdate") {
                                    var balanceValue = budgetBalance( filename, _account, columnsQuery[j].formattedString );
                                    var balanceValueColumn = -1 * balanceValue[column];
                                }
                                //d) empty cell, so we use the balanceValue just calculated
                                else { 
                                    var balanceValueColumn = balanceValue[column];
                                }

                                //Check if the calculated value is 0.00 (empty), so we set it manually to 0 insted of a blank cell
                                if (balanceValueColumn == "") { 
                                    balanceValueColumn = 0;
                                }

                                //Save data into balances object
                                var row = rowStart + parseInt(i);
                                balances.push({"col":columnIndex, "row":row, "value":balanceValueColumn});

                            }

                            // d) VATCURRENT BALANCE: taxable, amount, notdeductible, posted, rowcount
                            else if (type == "currentvat") {

                                //Function call to convert the period
                                convertPeriod(filename, columnsQuery[j], startdate, enddate);


                                //QueryAccount's first character is not a "$": it is a normal vat code
                                if (account.toString().substring(0,1) != "$") {
                                    var _account = account;
                                }

                                //QueryAccount's first character is "$": it is a custom regroup using a column
                                else if (account.toString().substring(0,1) == "$") {
                                    
                                    //Crates the array containing all the vat codes with tha same columnValue
                                    var vatCodesArray = getVatCodesList(filename, account.toString()); //ex. [S0,S10,P5]
                                    
                                    //Creates the string that will be used in the currentBalance/budgetBalance functions
                                    var _account = vatCodesArray.join("|"); //ex. V0|V10|V80 (accounts)
                                    //log(_account);
                                }


                                //We use the vatCurrentBalance() to calculate the balance value
                                var balanceValue = vatCurrentBalance( filename, _account, columnsQuery[j].formattedString );
                                var balanceValueColumn = balanceValue[column];

                                //Check if the calculated value is 0.00 (empty), so we set it manually to 0 insted of a blank cell
                                if (balanceValueColumn == "") { 
                                    balanceValueColumn = 0;
                                }

                                //Save data into balances object
                                var row = rowStart + parseInt(i);
                                balances.push({"col":columnIndex, "row":row, "value":balanceValueColumn});
                            }
                        }
                    }
                }
            });
        
        }).catch(function (error) {
            app.showNotification("Error", "Something went wrong: " + error);
            log("Error: " + error);
        });
    }









    //This function is used to group the vat codes that have the same Gr1 column value 
    //The QueryAccount string is splitted in two data: the column name and the column value of the Banana Accounting file.
    //All the vat codes with the same value of this column are grouped together.
    function getVatCodesList(bananaFileName, str) {
        //ex. str = $Gr1=200
        //$ indicate this is a custom accounts regroup
        //Gr1 is the XML name of the column in Banana Accounting
        //200 is the value used to regroup the vat codes 
        var columnName = str.substring(str.lastIndexOf("$")+1,str.lastIndexOf("=")).trim(); //ex. Gr1
        var columnValue = str.substr(str.indexOf("=") + 1).trim(); //ex. 200
        var vatCodesArray = [];


        //Web server function call to take the json of the VatCodes table
        var jsonVatCodesTableObj = tableVatCodes(bananaFileName);
        var len = jsonVatCodesTableObj.length;     

        //From the VatCodes table all the vat codes with the same columnValue are stored into an array
        for (var i in jsonVatCodesTableObj) {

            //Check if there is a value in the cell
            if (jsonVatCodesTableObj[i][columnName]) {
                
                //Split the value cell in Banana and crete an array (ex. 200;220 =>  [200,220] )
                var arraySplittedAccounts = jsonVatCodesTableObj[i][columnName].split(";");
                
                //For each element of the array check if it match with the one specified in the excel file after the "$Gr1="
                for (var j = 0; j < arraySplittedAccounts.length; j++) {

                    if (arraySplittedAccounts[j] == columnValue) {

                        if (jsonVatCodesTableObj[i]["VatCode"]) {
                            vatCodesArray.push(jsonVatCodesTableObj[i]["VatCode"]);
                        }
                    }
                }
            }
        }
        return vatCodesArray;
    }















    //This function is used to group the accounts that have the same custom column value 
    //The QueryAccount string is splitted in two data: the column name and the column value of the Banana Accounting file.
    //All the accounts with the same value of this column are grouped together.
    function getAccountsList(bananaFileName, str) {
        //ex. str = $Abc=9000
        //$ indicate this is a custom accounts regroup
        //Abc is the XML name of the column in Banana Accounting
        //9000 is the value used to regroup the accounts 
        var columnName = str.substring(str.lastIndexOf("$")+1,str.lastIndexOf("=")).trim(); //ex. Abc
        var columnValue = str.substr(str.indexOf("=") + 1).trim(); //ex. 9000
        var accountsArray = [];


        //Web server function call to take the json of the Accounts table
        var jsonAccountsTableObj = tableAccounts(bananaFileName);
        var len = jsonAccountsTableObj.length;     

        //From the Accounts table all the accounts with the same columnValue are stored into an array
        for (var i in jsonAccountsTableObj) {

            //Check if there is a value in the cell
            if (jsonAccountsTableObj[i][columnName]) {
                
                //Split the value cell in Banana and create an array (ex. 10;20 =>  [10,20] )
                var arraySplittedAccounts = jsonAccountsTableObj[i][columnName].split(";");
                
                //For each element of the array check if it match with the one specified in the excel file after the "$Abc="
                for (var j = 0; j < arraySplittedAccounts.length; j++) {

                    if (arraySplittedAccounts[j] == columnValue) {

                        if (jsonAccountsTableObj[i]["Account"]) {
                            accountsArray.push(jsonAccountsTableObj[i]["Account"]);
                        }
                        else if (jsonAccountsTableObj[i]["Group"]) {
                            accountsArray.push("Gr="+jsonAccountsTableObj[i]["Group"]);
                        }
                    }
                }
            }
        }
        return accountsArray;
    }



    /////////////////////////////////////////////////////////////////////////////////
    // 4. Write data in Excel
    /////////////////////////////////////////////////////////////////////////////////
    function WriteDataInExcel(columnsQuery, balances, headerQueryOptions) {
        return Excel.run(function (ctx) {

            var activeWorksheet = ctx.workbook.worksheets.getActiveWorksheet();
            activeWorksheet.load('name');

            return ctx.sync().then(function () 
            {

                //Update properties depending of options (repeat/norepeat)
                updateProperties(columnsQuery, headerQueryOptions);   
        

                ////////////////////////////////////////////////////////////////////////////////// 
                // 1. Write periods, properties and columns titles in the header section
                //////////////////////////////////////////////////////////////////////////////////
                var columnsQueryLength = columnsQuery.length;
                for (var j = 0; j < columnsQueryLength; j++) {


                    if (columnsQuery[j].type != "" && columnsQuery[j].column != "") {

                        //PeriodBegin / PeriodEnd
                        activeWorksheet.getRange(columnsQuery[j].columnIndex+"9").values = columnsQuery[j].formattedStartDate;
                        activeWorksheet.getRange(columnsQuery[j].columnIndex+"10").values = columnsQuery[j].formattedEndDate; 

                        //Properties (currency, header left, header right)
                        activeWorksheet.getRange(columnsQuery[j].columnIndex +"11").values = columnsQuery[j].basiccurrency;
                        activeWorksheet.getRange(columnsQuery[j].columnIndex +"12").values = columnsQuery[j].headerleft; 
                        activeWorksheet.getRange(columnsQuery[j].columnIndex +"13").values = columnsQuery[j].headerright;

                        //Columns titles
                        var column = columnsQuery[j].column;
                        column = column.charAt(0).toUpperCase() + column.slice(1);
                        activeWorksheet.getRange(columnsQuery[j].columnIndex+"15").values = column;
                        activeWorksheet.getRange("A15:AZ15").format.font.bold = true;
                    }

                }


                ////////////////////////////////////////////////////////////////////////////////// 
                // 1. Write balances values in the data section of the worksheet
                //////////////////////////////////////////////////////////////////////////////////
                var balancesLength = balances.length;
                for (var k = 0; k < balancesLength; k++) {
                    activeWorksheet.getRange(balances[k].col+balances[k].row).values = balances[k].value;
                    //log(balances[k].row + ";" + balances[k].col + ";" + balances[k].value);
                }

            }); 

        }).then(function (){
            // After the data has been written we hide the loader and show the notification
            document.getElementById('loader').style.display = 'none';
            app.showNotification("Worksheet successfully updated.");
            log("Worksheet successfully updated.");

        }).catch(function (error) {
            app.showNotification("Error updateTables()", "Something went wrong: " + error);
            log("Error: " + error);
        });
    }








    //Function that updates the properties object depending of the QueryOptions value
    // - repeat => Currency, HeaderLeft and HeaderRight are repeated in each column
    // - norepeat => Currency, HeaderLeft and HeaderRight are written only when the file name changes
    function updateProperties(columnsQuery, headerQueryOptions) {


        //On the first column we always write the properties.
        //From the second column we start to check.
        for (var i = 1; i < columnsQuery.length; i++) {

            //Check for the currency
            if (headerQueryOptions.currency == "norepeat") {
                if (columnsQuery[i].file == columnsQuery[i-1].file) {
                    columnsQuery[i].basiccurrency = "";
                }
            }
            
            //Check for the header left
            if (headerQueryOptions.headerLeft == "norepeat") {
                if (columnsQuery[i].file == columnsQuery[i-1].file) {
                    columnsQuery[i].headerleft = "";
                }
            }
            
            //Check for the header right
            if (headerQueryOptions.headerRight == "norepeat") {
                if (columnsQuery[i].file == columnsQuery[i-1].file) {
                    columnsQuery[i].headerright = "";
                }
            }
            
            //log(JSON.stringify(columnsQuery[i].basiccurrency));
            //log(JSON.stringify(columnsQuery[i].headerleft));
            //log(JSON.stringify(columnsQuery[i].headerright));
        }
    }






    //Function that converts the period taken from the excel file
    function convertPeriod(filename, columnsQuery, startdate, enddate) {

        // Case 1)
        // "Start date" and "End date" cells contain dates.
        // Since the date we read from excel is a number, we convert it into a Date object and then in "yyyy-mm-dd" format
        if (startdate.toString().length > 3 && enddate.toString().length > 3) {

            //Take the date serial number of excel and convert it to a date string
            var startdateFromExcel = new Date(Math.round((startdate - 25569)*86400*1000));
            var enddateFromExcel = new Date(Math.round((enddate - 25569)*86400*1000));

            //Format the date yyyy-mm-dd
            var formattedStartDate = startdateFromExcel.toISOString().slice(0,10);
            var formattedEndDate = enddateFromExcel.toISOString().slice(0,10);

            //Period string
            columnsQuery.formattedStartDate = formattedStartDate;
            columnsQuery.formattedEndDate = formattedEndDate;
            columnsQuery.formattedString = formattedStartDate + "/" + formattedEndDate;
        }

        else {
            // Case 2)
            // "Start date" cell contain a specific period like M1, M2, ..., S1, S2, Q1, Q2, ...
            // We take the content, set upper case and use it as period 
            startdate = startdate.toUpperCase();
            if (startdate != "") {
                columnsQuery.formattedStartDate = startperiod(filename, startdate);
                columnsQuery.formattedEndDate = endperiod(filename, startdate); 
                columnsQuery.formattedString = startdate;
            }

            // Case 3)
            // "Start date" and "End date" cells are empty.
            // In this case we use all year as period (from 01.01.yyyy to 31.12.yyyy)
            else {
                columnsQuery.formattedStartDate = startperiod(filename, "ALL");
                columnsQuery.formattedEndDate = endperiod(filename, "ALL");
                columnsQuery.formattedString = "ALL";
            }
        }
    }








    ////////////////////////////////////////////////////////////////////////////////////// 
    //
    //  Test
    //
    ////////////////////////////////////////////////////////////////////////////////////// 

    //Function that creates the "_test_expected" for the current selected worksheet
    function createTestCurrent() {
        Excel.run(function (ctx) {
        
            var activeWorksheet = ctx.workbook.worksheets.getActiveWorksheet().load("name");
            var worksheets = ctx.workbook.worksheets.load("name");

            return ctx.sync().then(function () {

                //Get the name of the current worksheet
                var wSheetName = activeWorksheet.name;
                
                if (wSheetName.indexOf(__SUBSTRING_FILE_NAME_TEST) < 0) {
                    duplicateSheet(wSheetName);
                } else {
                    log("Wrong worksheet selected.");
                }
            });
        
        }).catch(function (error) {
            app.showNotification(error);
            log(error);
        });  
    }


    //Function that creates the "_test_expected" for all the worksheets
    function createTestAll() {
        Excel.run(function (ctx) {
            var worksheets = ctx.workbook.worksheets.load("name");
            return ctx.sync().then(function () {
                for (var i = 0; i < worksheets.items.length; i++) {
                    if (worksheets.items[i].name.indexOf(__SUBSTRING_FILE_NAME_TEST) < 0) {
                        duplicateSheet(worksheets.items[i].name);
                    }
                }
            });
        }).catch(function (error) {
            log(error);
        }); 
    }


    //Function that duplicates the worksheet
    function duplicateSheet(worksheetName) {
        Excel.run(function (ctx) {
            var worksheet = ctx.workbook.worksheets.getItem(worksheetName);
            var range = worksheet.getUsedRange();
            range.load("values");
            range.load("address");

            var newWorksheet = ctx.workbook.worksheets.add(worksheetName + __SUBSTRING_FILE_NAME_TEST);
            return ctx.sync().then(function() {
                var newAddress = range.address.substring(range.address.indexOf("!") + 1);
                newWorksheet.getRange(newAddress).values = range.values;              
            }).then(ctx.sync);
        }).catch(function (error) {
            log(error);
        });
    }



    /**
        Function test:
        - Read and get a list of all the worksheets
        - For each worksheet that ends with "_test_expected" take its original (without "_test_expected")
        - Call the testWorksheet() function passing the original file
        - The function compare row by row the original and the _test_expected files to find differences
        - All the differences are displayed in red color and as message in the Logs tab of the add-in
        - In case there are not differences a message is displayed in the Logs tab of the add-in
    */
    function test() {

        //For each "xx_test_expected" worksheet created, we take original and test it
        return Excel.run(function (ctx) {

            //Get all the worksheets in an array
            var worksheets = ctx.workbook.worksheets.load("name"); 

            return ctx.sync().then(function () {

                //Take worksheets that ends with the content of __SUBSTRING_FILE_NAME_TEST string variable
                for (var i = 0; i < worksheets.items.length; i++) {
                    if (worksheets.items[i].name.indexOf(__SUBSTRING_FILE_NAME_TEST) > -1) {

                        //Than, take the original worksheet of the __SUBSTRING_FILE_NAME_TEST
                        var wSheetName = worksheets.items[i].name.replace(__SUBSTRING_FILE_NAME_TEST, "");

                        //Function call to test the worksheet
                        testWorksheet(wSheetName);
                    }
                }
            });
        }).catch(function (error) {
            log(error);
        });
    }




    
    /**
        Function test worksheet
        - Take all the "original" worksheet
        - Take all the generated "_test_expected" worksheet
        - Check row by row if there are differences between the original and his _test_expected
    */
    function testWorksheet(wSheetName) {

        Excel.run(function (ctx) {

            app.clearNotification();

            var differencesFound = false;
            var row = 2; //Starting row where test begin
            // var excelColumns = [
            //     "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
            //     "AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ"
            //     //"BA","BB","BC","BD","BE","BF","BG","BH","BI","BJ","BK","BL","BM","BN","BO","BP","BQ","BR","BS","BT","BU","BV","BW","BX","BY","BZ"
            // ];
            
            //Take the range size
            var rangeFile = ctx.workbook.worksheets.getItem(wSheetName).getRange(worksheetRangeAddress);
            var rangeURFile = rangeFile.getUsedRange();
            rangeURFile.load('address, values, cellCount');

            var rangeTest = ctx.workbook.worksheets.getItem(wSheetName + __SUBSTRING_FILE_NAME_TEST).getRange(worksheetRangeAddress);
            var rangeURTest = rangeTest.getUsedRange();
            rangeURTest.load('address, values, cellCount');


            return ctx.sync().then(function () {

                log("..."+ wSheetName + " test begin...");
            
                for (var i = 0; i < rangeURFile["values"].length; i++) {

                    //Check row by row both files:
                    //If the row of the current file is different than the expected file..
                    if (rangeURFile["values"][i].toString() != rangeURTest["values"][i].toString()) {

                        //Create an array with all the values of the row for both files
                        //The array structure is useful to determine the column where the value is
                        var arrFile = rangeURFile["values"][i];
                        var arrTest = rangeURTest["values"][i];
                        // log(JSON.stringify(arrFile));
                        // log(JSON.stringify(arrTest));

                        //Check value by value the two arrays
                        //When there is a difference write a log message, indicating the cell where the difference is and the values of both files
                        for (var k = 0; k < arrFile.length; k++) {

                            if (arrFile[k] != arrTest[k]) {

                                log("Cell " + excelColumns[k] + row + " : " + wSheetName + " '" + arrFile[k] + "', " + wSheetName+"_test_expected '" + arrTest[k]+ "'");
                                
                                //Set the font color of the cell to red when a difference is found
                                ctx.workbook.worksheets.getItem(wSheetName).getRange(excelColumns[k]+row).format.font.color = "Red";
                                differencesFound = true;
                            }
                        }
                    }
                    //Next row
                    row++;
                }

                //If there are not differences a log message is displayed
                if (!differencesFound) {
                    log(wSheetName + ": No differences found.");
                }

                log("..."+ wSheetName + " test end...");
                log("");

            });

        }).then(function () {
            app.showNotification("Test successfully executed: check LOGS for details.");
        }).catch(function (error) {
            app.showNotification("Error test()", "Something went wrong: " + error);
            log("Error: " + error);
        });
    }


    

   //END OF SCRIPT

})();


