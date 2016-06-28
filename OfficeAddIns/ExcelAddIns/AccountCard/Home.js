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
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
            $('#update-list').click(getFileNamesList);
            $('#accounts-list').click(getAccountsList);
            $('#load-data-and-create-file').click(generateTables);
        });
    };


    /////////////////////////////////////////////////////////////////////////////////



    //Function that fills the listbox with all the opened Banana documents names
    function getFileNamesList()
    {
        //Hide the notification message
        app.clearNotification();

        //Empty the list to avoid duplicates
        $('#ListBox').empty();

        //Get the content of the url
        var jsonFilenamesObj = JSON.parse(Get("http://localhost:8081/v1/docs"));
        var len = jsonFilenamesObj.length;

        //Add the content to the listbox
        for (var i = 0; i < len; i++)
        {
            var x = document.getElementById("ListBox");
            var option = document.createElement("option");
            option.text = jsonFilenamesObj[i];
            x.add(option);
        }
    }





    //Function that take the content from an url
    function Get(yourUrl) 
    {
        var Httpreq = new XMLHttpRequest();
        Httpreq.open("GET",yourUrl,false);
        Httpreq.send(null);
        return Httpreq.responseText;
    }





    //Function that fills the listbox with all the accounts of the selected Banana document
    function getAccountsList() 
    {
        //Each time we call getAccountsList() function we empty the list to avoid having duplicates
        $('#ListAccounts').empty();

        //Get the file name selected from the listbox
        var bananaFileName = $("#ListBox").val();

        //Get the content of the url
        var jsonAccountsObj = JSON.parse(Get("http://localhost:8081/v1/doc/" + bananaFileName +"/accounts"));
        var len = jsonAccountsObj.length;

        //Add the content to the listbox
        for (var i = 0; i < len; i++)
        {
            var x = document.getElementById("ListAccounts");
            var option = document.createElement("option");
            option.text = jsonAccountsObj[i].id + " " + jsonAccountsObj[i].descr;
            x.add(option);
        }
    }





    //Function that generates the file
    function generateTables() 
    {
        //Get the file name selected from the listbox
        var bananaFileName = $("#ListBox").val();
        
        //Run a batch operation against the Excel object model
        Excel.run(function (ctx)
        {
            //Create a proxy object for the active worksheet
            var activeSheet = ctx.workbook.worksheets.getActiveWorksheet();
            ctx.load(activeSheet.tables, "name");
            
            //Run the queued commands
            return ctx.sync().then(function ()
            {
                return generateAccountCard(ctx, activeSheet, bananaFileName);
            })
        }).catch(function (error) {
            app.showNotification("Error", "Something went wrong: " + error);
            console.log("Error: " + error);
            if (error instanceof OfficeExtension.Error) {
                console.log("Debug info: " + JSON.stringify(error.debugInfo));
            }
        });
    }


 


    //Function that generates the Account card
    function generateAccountCard(ctx, activeSheet, bananaFileName) 
    {
        activeSheet.getRange().clear();

        //Get the selected accounts from the listbox and use it as name for the excel sheet
        activeSheet.name = $('#ListAccounts').val();

        //Get the selected account and use it in the http request
        var account = $('#ListAccounts').val();
        var res = account.split(" ");

        //Get the period and use it in the http request 
        var period = $('#ListPeriod').val();

        if (period !== "All" && period !== "YTD")
        {
            if (period === "Jan") {period = "M1";}
            else if (period === "Feb") {period = "M2";}
            else if (period === "Mar") {period = "M3";}
            else if (period === "Apr") {period = "M4";}
            else if (period === "May") {period = "M5";}
            else if (period === "Jun") {period = "M6";}
            else if (period === "Jul") {period = "M7";}
            else if (period === "Aug") {period = "M8";}
            else if (period === "Sep") {period = "M9";}
            else if (period === "Oct") {period = "M10";}
            else if (period === "Nov") {period = "M11";}
            else if (period === "Dec") {period = "M12";}
            else if (period === "Q1") {period = "Q1";}
            else if (period === "Q2") {period = "Q2";}
            else if (period === "Q3") {period = "Q3";}
            else if (period === "Q4") {period = "Q4";}
            else if (period === "S1") {period = "S1";}
            else if (period === "S2") {period = "S2";}

            //Function call to get the url content 
            var accountCardObj = JSON.parse(Get("http://localhost:8081/v1/doc/" + bananaFileName + "/accountcard/" + res[0] + "?period=" + period + "&format=json"));
        }
        else if (period === "All") 
        {
            //Function call to get the url content 
            var accountCardObj = JSON.parse(Get("http://localhost:8081/v1/doc/" + bananaFileName + "/accountcard/" + res[0] + "?format=json"));
        }
        else if (period === "YTD")
        {
            //Get the opening date
            var jsonOpeningDateObj = Get("http://localhost:8081/v1/doc/" + bananaFileName + "/info/AccountingDataBase/OpeningDate");

            //Get the present date
            var date = formatDate(new Date());

            //Function call to get the url content 
            var accountCardObj = JSON.parse(Get("http://localhost:8081/v1/doc/" + bananaFileName + "/accountcard/" + res[0] + "?period=" + jsonOpeningDateObj + "/" + date + "&format=json"));
        }
        
        var len = accountCardObj.length;

        //Run the batched commands
        return ctx.sync().then(function ()
        {
            //Clear the sheet before to insert new data
            activeSheet.getRange().clear();

            //Insert a title at the beginning of the sheet
            activeSheet.getRange("A1").values = "Account Card - " +  $('#ListAccounts').val();
            activeSheet.getRange("A1").format.font.size = 20;
            activeSheet.getRange("A1").format.font.bold = true;

            //Insert the headers of the columns
            activeSheet.getRange("A3").values = "Date";
            activeSheet.getRange("B3").values = "Balance";
            activeSheet.getRange("C3").values = "Description";
            activeSheet.getRange("D3").values = "Contra Account";
            activeSheet.getRange("E3").values = "Debit amount";
            activeSheet.getRange("F3").values = "Credit amount";
            activeSheet.getRange("G3").values = "Doc";
            activeSheet.getRange("A3:G3").format.font.bold = true;

            //Use this counter to print on the right cell
            var cnt = 3;

            //Insert the data of the table 
            for (var i = 0; i < len; i++)
            {
                cnt++;
                activeSheet.getRange("A" + cnt).values = accountCardObj[i].JDate
                activeSheet.getRange("B" + cnt).values = accountCardObj[i].JBalance;
                activeSheet.getRange("C" + cnt).values = accountCardObj[i].JDescription
                activeSheet.getRange("D" + cnt).values = accountCardObj[i].JContraAccount
                activeSheet.getRange("E" + cnt).values = accountCardObj[i].JDebitAmount
                activeSheet.getRange("F" + cnt).values = accountCardObj[i].JCreditAmount
                activeSheet.getRange("G" + cnt).values = accountCardObj[i].Doc;
            }

            generateChart(activeSheet, cnt);

        }).then(ctx.sync);
    }



    function generateChart(sheet, cnt)
    {
        //var sourceData = sheet + "!" + "A3:A"+cnt;
        var range = sheet.getRange("A3:B"+cnt);

        //Queue a command to add a new chart
        var chart = sheet.charts.add("LineMarkers", range, "Auto");

        //Queue commands to set the properties and format the chart
        chart.setPosition("A"+(cnt+3), "G"+ (cnt+20));
        chart.title.text = "Balance chart";
        chart.legend.position = "right"
        chart.legend.format.fill.setSolidColor("white");
        chart.dataLabels.format.font.size = 15;
        chart.dataLabels.format.font.color = "black";
        var points = chart.series.getItemAt(0).points;
        points.getItemAt(0).format.fill.setSolidColor("pink");
        points.getItemAt(1).format.fill.setSolidColor('indigo');
    }






    //Function that format the date as "yyyy-mm-dd"
    function formatDate(date)
    {
        var d = new Date(date);
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    }



})();