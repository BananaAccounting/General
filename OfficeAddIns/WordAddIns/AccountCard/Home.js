(function () {
    
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason)
    {
        $(document).ready(function () {
            app.initialize();
            $('#update-list').click(GetFileNamesList);
            $('#accounts-list').click(getAccountsList);
            $('#load-data-and-create-file').click(generateAccountCard);
        });
    };



    //Function that takes all the opened Banana documents and creates a list
    function GetFileNamesList()
    {    
        var fileNames = [];
        var jsonObj = JSON.parse(Get("http://localhost:8081/v1/docs"));
        var fileNames = jsonObj;

        for (var i = 0; i < fileNames.length; i++)
        {
            var x = document.getElementById("ListBox");
            var option = document.createElement("option");
            option.text = fileNames[i];
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



    //Function that creates a list with all the accounts and descriptions
    function getAccountsList(bananaFileName) 
    {
        //File Name
        var bananaFileName = $("#ListBox").val();

        var jsonAccountsObj = JSON.parse(Get("http://localhost:8081/v1/doc/" + bananaFileName +"/accounts"));
        var len = jsonAccountsObj.length;

        for (var i = 0; i < len; i++)
        {
            var x = document.getElementById("ListAccounts");
            var option = document.createElement("option");
            option.text = jsonAccountsObj[i].id + " " + jsonAccountsObj[i].descr;
            x.add(option);
        }
    }



    //Function that generates word document with the account card details
    function generateAccountCard() 
    {
        Word.run(function (context) 
        {
            // Create a proxy object for the document.
            var thisDocument = context.document;

            //Clear the document before starting to insert new texts
            thisDocument.body.clear();

            // Queue a command to get the current selection. 
            // Create a proxy range object for the selection.
            var range = thisDocument.getSelection();

            //Retrieve values selected from the lists
            var bananaFileName = $("#ListBox").val();
            var account = $('#ListAccounts').val();
            var res = account.split(" ");
            var period = $('#ListPeriod').val();

            //Use the selected values to get all the required informations to generate the account card
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

            //Insert into the word document a text as title
            range.insertText("Account statement - " + account + "\n\n").font.bold = true;
 
            //Insert into the word document some account card data
            for (var i = 0; i < len; i++) 
            {
                //Opening and totals
                if (accountCardObj[i].SysCod) 
                {
                    range.insertText(
                        accountCardObj[i].SysCod + ", " +
                        accountCardObj[i].JBalance + "\n"
                    ).font.bold = true;
                }
                else
                {
                    range.insertText(
                    accountCardObj[i].Date + ", " +
                    accountCardObj[i].Description + ", " +
                    accountCardObj[i].JBalance + "\n");
                }
            }

            // Synchronize the document state by executing the queued commands, 
            // and return a promise to indicate task completion.
            return context.sync();  
        })
        .catch(function (error) {
            // Always be sure to catch any accumulated errors that bubble up from the Word.run execution
            app.showNotification("Error: " + error);
            console.log("Error: " + error);
            if (error instanceof OfficeExtension.Error) {
                console.log("Debug info: " + JSON.stringify(error.debugInfo));
            }
        });
    }

})();


