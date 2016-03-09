## Banana Retrieve Tables Task Pane Add-in Sample for Excel 2016

Applies to: Excel 2016

This task pane add-in shows how to extract some data from Banana documents by using the JavaScript APIs in Excel 2016.


### Try it out

1. Be sure to have accomplished all the settings as shown in the [Create Office Add-ins guide](https://github.com/BananaAccounting/General/blob/master/OfficeAddIns/CreateAddIn.md).

2. Open one or more Banana Accounting documents.
   
3. Start the integrated Banana web server: **Tools** -> **Program options** -> check **Start Web Server** -> click **Ok**.

4. Test and run the add-in.

    a. Open a new blank Excel 2016 document as **Administrator** (Right click on Excel launcher -> Run as Administrator -> Ok).
    
    b. On the Insert tab, choose **My Add-ins**.

    d. In the Office Add-ins dialog box, choose **Shared Folder**.

    e. Choose **Account Card** and clic **Insert**. The add-in opens in a task pane as shown in this screenshot.
    
    ![Banana Add-in](https://raw.githubusercontent.com/BananaAccounting/General/master/OfficeAddIns/ExcelAddIns/AccountCard/Images/AccountCard_AddIn.png)
    
    f. Click on the "Update list" button to update the list with all the opened Banana documents
    
    g. Select one file from the list
    
    ![Update file list](https://raw.githubusercontent.com/BananaAccounting/General/master/OfficeAddIns/ExcelAddIns/AccountCard/Images/AccountCard_AddIn_file_selection.png)
    
    h. Click on the "Update list" button to update the list with all the Accounts and descriptions.
    
    i. Select an account.
    
    ![Update file list](https://raw.githubusercontent.com/BananaAccounting/General/master/OfficeAddIns/ExcelAddIns/AccountCard/Images/AccountCard_AddIn_account_selection.png)
    
    j. Select a period from the list.
    
    ![Update file list](https://raw.githubusercontent.com/BananaAccounting/General/master/OfficeAddIns/ExcelAddIns/AccountCard/Images/AccountCard_AddIn_period_selection.png)
    
    k. Click on the "Click me!" button to generate the sheet with the account card and a chart of the Balance.
    
    ![Update file list](https://raw.githubusercontent.com/BananaAccounting/General/master/OfficeAddIns/ExcelAddIns/AccountCard/Images/AccountCard_addIn_Example.png)
    
    
    


### Resources
[Build your first Excel add-in](https://msdn.microsoft.com/en-us/library/office/mt616491.aspx)

[Excel add-ins programming overview](https://msdn.microsoft.com/en-us/library/office/mt616487.aspx)

[Excel add-ins JavaScript API reference](https://msdn.microsoft.com/en-us/library/office/mt616490.aspx)

   
