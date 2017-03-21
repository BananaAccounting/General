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
// @id = ch.banana.app.vcardfromaddress
// @api = 1.0
// @pubdate = 2017-01-30
// @publisher = Banana.ch SA
// @description = Create vCard from address
// @task = export.file
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdatasource = none
// @timeout = -1
// @exportfiletype = vcf





/*
	SUMMARY
	=======
	This app creates a vCard (.vcf file) containing the contacts taken from the banana document.
	It is possible to create a vCard with all the contacts or only with specific contacts.
*/



function exec() {

    //Check if we are on an opened document
    if (!Banana.document) { 
    	return; 
    }

	var contactsTable = Banana.document.table("Contacts");
	if (!contactsTable) {
		contactsTable = Banana.document.table("Accounts");
		if (!contactsTable) { 
			return;
		}
	}

    //Get the language of the document and the right translations
    var traduzioni = setLanguage();
    var scelta = Banana.Ui.getText(traduzioni.creavcard, traduzioni.inserire);

	//All the contacts
    if (scelta === "*") { 
    	var contacts = getIDs(contactsTable);
    } 
    //Specific contacts
    else { 
        var contacts = scelta.split(",");
    }
	var vCard = createvCard(contactsTable, contacts);
	return vCard;
}



/* Function that creates the vCard of the contacts selected by the user */
function createvCard(contactsTable, contacts) {
	var vCard = "";

	for (var j = 0; j < contacts.length; j++) {

	    for (var i = 0; i < contactsTable.rowCount; i++) {
	        var tRow = contactsTable.row(i);
	        
	        if (!tRow.isEmpty) {

	        	var id = tRow.value("RowId");

	        	if (contacts[j].trim() === id) {

					var familyname = tRow.value("FamilyName");
					var name = tRow.value("FirstName");
					var sesso = tRow.value("Sesso");
					var emailHome = tRow.value("EmailHome");
					var telCell = tRow.value("PhoneMobile");
					var telHome = tRow.value("PhoneHome");
					var adrHome = tRow.value("Street");
					var posHome = tRow.value("PostalCode");
					var locHome = tRow.value("Locality");
					var codeCountry = tRow.value("CountryCode");
					var nameCountry = tRow.value("Country");
					var timestamp = new Date().toISOString(); // es. 2011-10-05T14:48:00.000Z

					vCard += "BEGIN:VCARD";
					vCard += "\nVERSION:3.0";
					vCard += "\nN:"+familyname+";"+name;
					vCard += "\nFN:"+name+" " +familyname;

					if (sesso) {
						vCard += "\nTITLE:"+sesso;
					}

					if (emailHome) {
						vCard += "\nEMAIL:"+emailHome;
					}

					if (telCell) {
						vCard += "\nTEL;type=CELL:"+telCell;
					}

					if (telHome) {
						vCard += "\nTEL;type=HOME:"+telHome;
					}
					
					if (codeCountry && nameCountry) {
						vCard += "\nADR;TYPE=HOME:;;"+adrHome+";"+locHome+";;"+posHome+";"+codeCountry+" "+nameCountry;
					}
					else {
						vCard += "\nADR;TYPE=HOME:;;"+adrHome+";"+locHome+";;"+posHome+";";
					}
					
					vCard += "\nLABEL;TYPE=HOME:"+adrHome+"\n"+locHome+"\,"+posHome;
					vCard += "\nREV:"+timestamp;
					vCard += "\nEND:VCARD\n";
		        }
	    	}
	    }
	}
	return vCard;
}


/* Get all the ID of the contacts */
function getIDs(table) {
    var IDsList = [];

    for (var i = 0; i < table.rowCount; i++) {
        var tRow = table.row(i);

        if (!tRow.isEmpty) {
            var id = tRow.value("RowId");
            IDsList.push(id);
        }
    }
    return IDsList.sort();
}



/* Function that get the language of the document and uses the right translations */
function setLanguage() {
    var lan = Banana.document.info("Base","Language");
    var traduzioni = {};
    if (lan === "ita") {
    	traduzioni["titolo"] = "vCard";
        traduzioni["creavcard"] = "Creazione vCard";
        traduzioni["inserire"] = "Inserire id contatti (Tutti = *  ;  Specifici es. 1,4,32)";
    }
    else if (lan === "fra") {
    	traduzioni["titolo"] = "vCard";
        traduzioni["creavcard"] = "Créer des vCard";
        traduzioni["inserire"] = "Entrez l’id de contact (Tous = * ; Spécifiques par exemple. 1,4,32)";
    }
    else if (lan === "deu") {
    	traduzioni["titolo"] = "vCard";
        traduzioni["creavcard"] = "VCard erstellen";
        traduzioni["inserire"] = "Kontakt-Id eingeben (Alle = *; Spezifische zB. 1,4,32)";
    }
    else {
    	traduzioni["titolo"] = "vCard";
        traduzioni["creavcard"] = "Create vCard";
        traduzioni["inserire"] = "Enter contact id (All = *  ;  Specific eg. 1,4,32)";
    }
    return traduzioni;
}

