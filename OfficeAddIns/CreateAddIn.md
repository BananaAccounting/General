#Create Office Add-in

#Prerequisite
Applies to: Excel 2016


This task pane add-in shows how to extract some data from Banana documents by using the JavaScript APIs in Excel 2016.

#Install a local web server

#Setup the environment
The simplest way to deploy and test your add-in is to copy the files to a network share.


1. Create a folder on a network share (for example, \\\MyShare\001_Tables) and then copy the folder **001_Tables** (with all the files inside) to that folder.
	a. 

2. Edit the **SourceLocation element** of the manifest file (001_Tables.xml) so that it points to the share location for the **Home.html** page from step 1.

3. Copy the manifest (001_Tables.xml) to a network share (for example, \\\BananaManifests).

4. Add the share location that contains the manifest as a trusted app catalog in Excel.

	a. Launch Excel and open a blank spreadsheet.
    
    b. Choose the **File** tab, and then choose **Options**.

    c. Choose **Trust Center**, and then choose the **Trust Center Settings** button.

    d. Choose **Trusted Add-in Catalogs**.

    e. In the Catalog Url box, enter the **path to the network share you created in step 3**, and then choose **Add Catalog**.

    f. Select the Show in Menu check box, and then choose OK. A message appears to inform you that your settings will be applied the next time you start Office.



## Resources
Some useful links:
* [Build your first Excel add-in](https://msdn.microsoft.com/en-us/library/office/mt616491.aspx)
* [Excel add-ins programming overview](https://msdn.microsoft.com/en-us/library/office/mt616487.aspx)
* [Excel add-ins JavaScript API reference](https://msdn.microsoft.com/en-us/library/office/mt616490.aspx)

   
