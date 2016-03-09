# Create Office Add-in
The steps below walk you through all the setup of the environment required to run Banana Office Add-ins.

## Prerequisite
Applies to: Microsoft Office Excel 2016

## Install a local web server
To run properly all the Banana Office Add-ins it is highly recommended to install a local web server and deploy all the add-ins files into it.

For example:

1.	Download [XAMPP](https://www.apachefriends.org/index.html) for windows.

2.	Install XAMPP.

3.	After the installation, open the **XAMPP Control Panel** and activate **Apache web server** by checking the box and clicking Start.

4.	Go to the folder where XAMPP is installed (usually **C:\xampp\htdocs**).

5.	Basically this is the folder where to put all the files, but it is recommended to create other folder and subfolder in order to separate each add-in. In our case, the final structure should be something like
	* **C:\xampp\htdocs\OfficeAddIns\ExcelAddIns** for all the Excel Add-ins.
		* C:\xampp\htdocs\OfficeAddIns\ExcelAddIns\FirstAddIn
		* C:\xampp\htdocs\OfficeAddIns\ExcelAddIns\SecondAddIn
		* ...
 
	* **C:\xampp\htdocs\OfficeAddIns\WordAddIns** for all the Word Add-ins.
		* C:\xampp\htdocs\OfficeAddIns\WordAddIns\FirstAddIn
		* C:\xampp\htdocs\OfficeAddIns\WordAddIns\SecondAddIn
		* ...

## Setup the environment
1.	Create a folder for the Manifests on a network share.

	a	Create a folder wherever you want (for example, C:\Desktop\BananaManifests).
	
    b.	Right click on the folder, select **properties**.
    
	c.	Click on **Sharing** tab.
    
	d.	Click on **Advanced Sharing...**
    
	e.	Check the **Share this folder** box.
    
	f.	Click **Apply** and then **Ok**.
    
2.	Download the files of the chosen add-in from the Banana Accounting Office Add-ins GitHub repository (for example for the AccountCard add-in, https://github.com/BananaAccounting/General/tree/master/OfficeAddIns/ExcelAddIns/AccountCard):
	
	* AccountCardManifest.xml
	* Common.css
	* Home.html
	* Home.js
	* Notification.js


3.	Save the files into the web server folder (for example, C:\xampp\htdocs\OfficeAddIns\ExcelAddIns\AccountCard).
4.	Edit the **SourceLocation** element of the Manifest file (for example, AccountCardManifest.xml) so that it points to the web server location for the Home.html page

```html
<SourceLocation DefaultValue="http://localhost/OfficeAddIns/ExcelAddIns/AccountCard/Home.html"/>
```

5.	Save the file.
6.	Copy the Manifest to the network share from the step 1.
7.	Add the share location that contains the manifest as a trusted app catalog in Excel.

	a. Launch Excel and open a blank spreadsheet.
    
    b. Choose the **File** tab, and then choose **Options**.

    c. Choose **Trust Center**, and then choose the **Trust Center Settings** button.

    d. Choose **Trusted Add-in Catalogs**.

    e. In the Catalog Url box, enter the **path to the network share you created in step 1**, and then choose **Add Catalog** (to see the path: right click on the shared folder -> Properties -> Sharing -> Network Path).

    f. Select the **Show** in Menu check box, and then choose **OK**. A message appears to inform you that your settings will be applied the next time you start Office.

## Resources
Some useful links:
* [Build your first Excel add-in](https://msdn.microsoft.com/en-us/library/office/mt616491.aspx)
* [Excel add-ins programming overview](https://msdn.microsoft.com/en-us/library/office/mt616487.aspx)
* [Excel add-ins JavaScript API reference](https://msdn.microsoft.com/en-us/library/office/mt616490.aspx)


