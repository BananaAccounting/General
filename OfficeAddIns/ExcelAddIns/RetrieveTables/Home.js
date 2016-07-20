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


(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason)
    {
        $(document).ready(function () {
            app.initialize();
            $('#update-list').click(getFileNamesList);
            $('#load-data-and-create-chart').click(generateTables);

            //Initially we disable some of the elements (buttons and lists)
            document.getElementById('ListBox').disabled = true;
            document.getElementById('select-service').disabled = true;
            document.getElementById('load-data-and-create-chart').disabled = true;   
        });
    };


    /////////////////////////////////////////////////////////////////////////////////


    //Function that takes all the opened Banana documents and creates a list
    function getFileNamesList()
    {
        
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

            //Enable the elements
            document.getElementById('ListBox').disabled = false;
            document.getElementById('select-service').disabled = false;
            document.getElementById('load-data-and-create-chart').disabled = false;
        }
    }



    //Function that take the content from an url
    function Get(yourUrl) 
    {
        var bananaLocalhost = "http://localhost:8081/v1/";
        var Httpreq = new XMLHttpRequest();
        Httpreq.open("GET",bananaLocalhost + yourUrl,false);
        Httpreq.send();
        return Httpreq.responseText;
    }






    //Function that generates all the content
    function generateTables() 
    {
        //File Name
        var bananaFileName = $("#ListBox").val();
        
        Excel.run(function (ctx)
        {
            
            var activeSheet = ctx.workbook.worksheets.getActiveWorksheet();
            ctx.load(activeSheet.tables, "name");
            
            return ctx.sync().then(function () 
            {
                switch ($("#select-service").val()) 
                {
                    case "Info":
                        return generateInfoTable(ctx, activeSheet, bananaFileName);
                    case "Accounts":
                        return generateAccountsTable(ctx, activeSheet, bananaFileName);
                    case "Journal":
                        return generateJournalTable(ctx, activeSheet, bananaFileName);
                }

            })
        }).catch(function (error) {
            app.showNotification("Error", "Something went wrong: " + error);
            console.log("Error: " + error);
            if (error instanceof OfficeExtension.Error) {
                console.log("Debug info: " + JSON.stringify(error.debugInfo));
            }
        });
    }


    //Function that generates the table of Informations
    function generateInfoTable(ctx, activeSheet, bananaFileName) 
    {
        activeSheet.name = $("#select-service").val();

        //Run the batched commands
        return ctx.sync().then(function () {

            //Clear the sheet before to insert new data
            activeSheet.getRange().clear();

            /*
                Info
            */

            //File name
            activeSheet.getRange("A1").values = 'File Info';
            activeSheet.getRange("A1").format.font.bold = true;
            activeSheet.getRange("B1").values = "File name";
            activeSheet.getRange("C1").values = bananaFileName;

            //DateLastSaved
            var jsonDateLastSavedObj = Get("doc/" + bananaFileName + "/info/Base/DateLastSaved");
            activeSheet.getRange("B2").values = "Date last saved";
            activeSheet.getRange("C2").values = jsonDateLastSavedObj;

            //Language
            var jsonLanguageObj = Get("doc/" + bananaFileName + "/info/Base/Language");
            activeSheet.getRange("B3").values = "Language";
            activeSheet.getRange("C3").values = jsonLanguageObj;

            /*
                Accounting
            */
            activeSheet.getRange("A5").values = "Accounting";
            activeSheet.getRange("A5").format.font.bold = true;
    
            //HeaderLeft
            var jsonHeaderLeftObj = Get("doc/" + bananaFileName + "/info/Base/HeaderLeft");
            activeSheet.getRange("B5").values = 'HeaderLeft';
            activeSheet.getRange("C5").values = jsonHeaderLeftObj;
           
            //HeaderRight
            var jsonHeaderRightObj = Get("doc/" + bananaFileName + "/info/Base/HeaderRight");
            activeSheet.getRange("B6").values = 'HeaderRight';
            activeSheet.getRange("C6").values = jsonHeaderRightObj;         

            //Dates
            var jsonOpeningDateObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/OpeningDate"); 
            var jsonClosureDateObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/ClosureDate");
            activeSheet.getRange("B7").values = 'Opening date';
            activeSheet.getRange("B8").values = 'Closure date';
            activeSheet.getRange("C7").values = jsonOpeningDateObj;
            activeSheet.getRange("C8").values = jsonClosureDateObj;

            //Currency
            var jsonCurrencyObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/BasicCurrency");
            activeSheet.getRange("B9").values = 'Basic currency';
            activeSheet.getRange("C9").values = jsonCurrencyObj;


            /*
                Address
            */
            activeSheet.getRange("A11").values = "Address";
            activeSheet.getRange("A11").format.font.bold = true;
            var jsonCompanyObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/Company");
            var jsonNameObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/Name");
            var jsonFamilyNameObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/FamilyName");
            var jsonAddress1Obj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/Address1");
            var jsonZipObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/Zip");
            var jsonCityObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/City");
            var jsonStateObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/State");
            var jsonCountryObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/Country");
            var jsonWebObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/Web");
            var jsonEmailObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/Email");
            var jsonPhoneObj = Get("doc/" + bananaFileName + "/info/AccountingDataBase/Phone");
            activeSheet.getRange("B11").values = 'Company';
            activeSheet.getRange("C11").values = jsonCompanyObj;
            activeSheet.getRange("B12").values = 'Name';
            activeSheet.getRange("C12").values = jsonNameObj;
            activeSheet.getRange("B13").values = 'FamilyName';
            activeSheet.getRange("C13").values = jsonFamilyNameObj;
            activeSheet.getRange("B14").values = 'Address1';
            activeSheet.getRange("C14").values = jsonAddress1Obj;
            activeSheet.getRange("B15").values = 'Zip';
            activeSheet.getRange("C15").values = jsonZipObj;
            activeSheet.getRange("B16").values = 'City';
            activeSheet.getRange("C16").values = jsonCityObj;
            activeSheet.getRange("B17").values = 'State';
            activeSheet.getRange("C17").values = jsonStateObj;
            activeSheet.getRange("B18").values = 'Country';
            activeSheet.getRange("C18").values = jsonCountryObj;
            activeSheet.getRange("B19").values = 'Web';
            activeSheet.getRange("C19").values = jsonWebObj;
            activeSheet.getRange("B20").values = 'Email';
            activeSheet.getRange("C20").values = jsonEmailObj;
            activeSheet.getRange("B21").values = 'Phone';
            activeSheet.getRange("C21").values = jsonPhoneObj;

        }).then(ctx.sync);
    }


    //Function that generates the table of Accounts
    function generateAccountsTable(ctx, activeSheet, bananaFileName) 
    {

        activeSheet.name = $("#select-service").val();

        var jsonAccountsObj = JSON.parse(Get("doc/" + bananaFileName +"/table/Accounts?format=json"));
        var len = jsonAccountsObj.length;

        //Run the batched commands
        return ctx.sync().then(function () 
        {

            //Clear the sheet before to insert new data
            activeSheet.getRange().clear();
            //activeSheet.getRange("A1:F"+ len+1).clear();

            //Insert the titles of the columns
            activeSheet.getRange("A1").values = "Account";
            activeSheet.getRange("B1").values = "Description";
            activeSheet.getRange("C1").values = "BClass";
            activeSheet.getRange("D1").values = "Gr";
            activeSheet.getRange("E1").values = "Opening";
            activeSheet.getRange("F1").values = "Balance";
            activeSheet.getRange("A1:F1").format.font.bold = true;

            //Use this counter to print on the right cell
            var cnt = 1;

            //Insert the data of the table 
            for (var i = 0; i < len; i++)
            {
                if (jsonAccountsObj[i].Account) 
                {
                    cnt++;
                    activeSheet.getRange("A" + cnt).values = jsonAccountsObj[i].Account;
                    activeSheet.getRange("B" + cnt).values = jsonAccountsObj[i].Description;
                    activeSheet.getRange("C" + cnt).values = jsonAccountsObj[i].BClass;
                    activeSheet.getRange("D" + cnt).values = jsonAccountsObj[i].Gr;
                    activeSheet.getRange("E" + cnt).values = jsonAccountsObj[i].Opening;
                    activeSheet.getRange("F" + cnt).values = jsonAccountsObj[i].Balance;
                }
            }
        }).then(ctx.sync);
    }


    //Function that generates the table of Journal
    function generateJournalTable(ctx, activeSheet, bananaFileName) 
    {

        activeSheet.name = $("#select-service").val();

        var jsonJournalObj = JSON.parse(Get("doc/" + bananaFileName +"/journal?format=json"));
        var len = jsonJournalObj.length;

        //Run the batched commands
        return ctx.sync().then(function () 
        {

            //Clear the sheet before to insert new data
            activeSheet.getRange().clear();
            //activeSheet.getRange("A1:J"+ len+1).clear();

            //Insert the titles of the columns
            activeSheet.getRange("A1").values = "Date";
            activeSheet.getRange("B1").values = "Description";
            activeSheet.getRange("C1").values = "JAccount";
            activeSheet.getRange("D1").values = "JAccountClass";
            activeSheet.getRange("E1").values = "JAmount";
            activeSheet.getRange("F1").values = "JCC1";
            activeSheet.getRange("G1").values = "JCC2";
            activeSheet.getRange("H1").values = "JCC3";
            activeSheet.getRange("I1").values = "JSegment1";
            activeSheet.getRange("J1").values = "JRowOrigin";
            activeSheet.getRange("A1:J1").format.font.bold = true;
            
            //Use this counter to print on the right cell
            var cnt = 1;

            //Insert the data of the table 
            for (var i = 0; i < len; i++)
            {
                cnt++;
                activeSheet.getRange("A" + cnt).values = jsonJournalObj[i].Date;
                activeSheet.getRange("B" + cnt).values = jsonJournalObj[i].Description;
                activeSheet.getRange("C" + cnt).values = jsonJournalObj[i].JAccount;
                activeSheet.getRange("D" + cnt).values = jsonJournalObj[i].JAccountClass;
                activeSheet.getRange("E" + cnt).values = jsonJournalObj[i].JAmount;
                activeSheet.getRange("F" + cnt).values = jsonJournalObj[i].JCC1;
                activeSheet.getRange("G" + cnt).values = jsonJournalObj[i].JCC2;
                activeSheet.getRange("H" + cnt).values = jsonJournalObj[i].JCC3;
                activeSheet.getRange("I" + cnt).values = jsonJournalObj[i].JSegment1;
                activeSheet.getRange("J" + cnt).values = jsonJournalObj[i].JRowOrigin;
            }

        }).then(ctx.sync);
    }

})();