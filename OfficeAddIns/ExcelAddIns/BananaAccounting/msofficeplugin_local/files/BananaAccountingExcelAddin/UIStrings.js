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

/* Last update: 2018-04-04 */

//Store the locale-specific strings
var UIStrings = (function ()
{
  "use strict";

  var UIStrings = {};

  // JSON object for English strings
  UIStrings.EN =
  {
      "strSetupdescription": "Setup the worksheet in order to create customized reports using your Banana Accounting data:",
      "strSetupstep1": "Select a Banana accounting file",
      "strSetupstep2": "Add a header to the worksheet",
      "strSetupstep3": "Set the columns of the header",
      "strSetupstep4": "Add accounts, groups, cost centers, segments, and more",
      "strSetupstep5": "Update the worksheet to retrieve your accounting data",
      "strUpdatedescription": "Keep your reports up-to-date with the current accounting data",
      "strBegin": "Let's Begin!",
      "strSetup": "Setup",
      "strUpdate": "Update",
      "strTest": "Development",
      "strLogs": "Messages",
      "strDev": "Development...",
      "strHelp":"Help",
      "strTitleSetup": "Setup of the worksheet",
      "strBananaFile": "Select an opened Banana file",
      "strUpdateList": "Refresh file list",
      "strSetHeader": "Set Header",
      "strSelectHeader": "a) Select an header and add it to the worksheet",
      "strPredefinedHeader": "Predefined header with columns",
      "strEmptyHeader": "Empty header",
      "strAddHeader": "Add header",
      "strTextHeaderOptions": "b) Add header options",
      "strSelectOptionCurrency": "Select Currency option",
      "strSelectOptionHeaderLeft": "Select Header Left option",
      "strSelectOptionHeaderRight": "Select Header Right option",
      "strRepeatCurrency": "Repeat (repeat)",
      "strNoRepeatCurrency": "Do not repeat (norepeat)",
      "strRepeatHeaderLeft": "Repeat (repeat)",
      "strNoRepeatHeaderLeft": "Do not repeat (norepeat)",
      "strRepeatHeaderRight": "Repeat (repeat)",
      "strNoRepeatHeaderRight": "Do not repeat (norepeat)",
      "strAddHeaderOptions": "Add options",
      "strSetQueryColumns": "Set QueryColumns",
      "strTextSetQueryColumns": "Set a column",
      "strSlctSheetColumn": "Select a column of the worksheet",
      "strOptSelectAnOption": "--select an option--",
      "strSelectedColumn": "Current",
      "strSlctFilename": "Select a filename",
      "strOptSelectAnOptionFile": "--select an option--",
      "strCurrentFile": "Current",
      "strCurrentVoid": "Current (void)",
      "strP1": "1 previous year (p1)",
      "strP2": "2 previous years (p2)",
      "strP3": "3 previous years (p3)",
      "strSlctTypeValue": "Select a Type value",
      "strOptSelectAnOptionType": "--select an option--",
      "strSlctColumnValue": "Select a Column value",
      "strOptSelectAnOptionColumn": "--select an option--",
      "strSlctSegmentValue": "Select a Segment (optional)",
      "strOptSelectAnOptionSegment": "--select an option--",
      "strSlctPeriodValue": "Select a period (optional)",
      "strAllVoid": "All (void)",
      "strCustomDate": "Custom date",
      "strM1": "Month 1 (M1)",
      "strM2": "Month 2 (M2)",
      "strM3": "Month 3 (M3)",
      "strM4": "Month 4 (M4)",
      "strM5": "Month 5 (M5)",
      "strM6": "Month 6 (M6)",
      "strM7": "Month 7 (M7)",
      "strM8": "Month 8 (M8)",
      "strM9": "Month 9 (M9)",
      "strM10": "Month 10 (M10)",
      "strM11": "Month 11 (M11)",
      "strM12": "Month 12 (M12)",
      "strQ1": "1. Quarter (Q1)",
      "strQ2": "2. Quarter (Q2)",
      "strQ3": "3. Quarter (Q3)",
      "strQ4": "4. Quarter (Q4)",
      "strS1": "1. Semester (S1)",
      "strS2": "2. Semester (S2)",
      "strY1": "Year 1 (Y1)",
      "strY2": "Year 2 (Y2)",
      "strLoadAllColumn": "Add column",
      "strSetQueryAccounts": "Set QueryAccounts",
      "strAddAccounts": "a) Add accounts",
      "strOptSelectAnOptionAccounts": "--select an option--",
      "strAddToQueryAccount": "Add accounts",
      "strQaAccounts": "Accounts",
      "strQaGroups": "Groups",
      "strQaCostCenters": "Cost centers",
      "strQaSegments": "Segments",
      "strQaAll": "All",
      "strQaVatCodes": "Vat codes",
      "strSelectAll": "(select all)",
      "strQaOptions": "b) Add options. Select a cell next to the account (optional)",
      "strOptSelectAnOptionOptions": "--select an option--",
      "strInvert": "invert",
      "strBudget": "budget",
      "strBudgetinvert": "budgetinvert",
      "strAddToQueryOptions": "Add option",
      "strTitleUpdate": "Update of the worksheet",
      "strTextUpdate": "Retrieve updated values from Banana Accounting",
      "strUpdateData": "Update current worksheet",
      "strTitleSettings": "Settings",
      "strInsertPort": "a) Port number Banana Accounting: insert the Port number for 'https://127.0.0.1' configured in Banana Accounting",
      // "strUsedUrl": "Settings changed. Please confirm change.",
      "strChangeLanguage": "b) Language",
      "strExcelPredefined": "Default",
      "strServerInformation": "a) Server information",
      "strInsertServerUrl": "Server URL",
      "strInsertToken": "Connection token",
      "strDefaultUrl": "(Empty = https://127.0.0.1:8089)",
      "strUrlOther": "Other",
      "strOptions": "Options",
      "strConfirmationMessageHeader": "Confirm change",
      "strConfirmationMessageBody": "You have modified a setting that requires the app to be reloaded.",
      "strConfirmationMessageBody2": "Continue?",
      "strConfirmYes": "Yes",
      "strConfirmNo": "No",
  };

  // JSON object for Italian strings
  UIStrings.IT =
  {
      "strSetupdescription": "Configura il foglio di lavoro per creare report personalizzati usando i tuoi dati di Banana Contabilità:",
      "strSetupstep1": "Seleziona un file contabile di Banana",
      "strSetupstep2": "Aggiungi un'intestazione al foglio di lavoro",
      "strSetupstep3": "Imposta le colonne dell'intestazione",
      "strSetupstep4": "Aggiungi conti, gruppi, centri di costo, segmenti e altro",
      "strSetupstep5": "Aggiorna il foglio di lavoro per recuperare i tuoi dati contabili",
      "strUpdatedescription": "Mantieni aggiornati i tuoi report con i dati contabili correnti",
      "strBegin": "Cominciamo!",
      "strSetup": "Configura",
      "strUpdate": "Aggiorna",
      "strTest": "Sviluppo",
      "strLogs": "Messaggi",
      "strDev": "Sviluppo...",
      "strHelp":"Aiuto",
      "strTitleSetup": "Imposta foglio di lavoro",
      "strBananaFile": "Seleziona un file Banana aperto",
      "strUpdateList": "Aggiorna lista file",
      "strSetHeader": "Imposta intestazione",
      "strSelectHeader": "a) Seleziona un'intestazione ed aggiungila al foglio di lavoro",
      "strPredefinedHeader": "Intestazione predefinita con colonne",
      "strEmptyHeader": "Intestazione vuota",
      "strAddHeader": "Aggiungi intestazione",
      "strTextHeaderOptions": "b) Aggiungi opzioni all'intestazione",
      "strSelectOptionCurrency": "Seleziona opzione per Currency",
      "strSelectOptionHeaderLeft": "Seleziona opzione per Header Left",
      "strSelectOptionHeaderRight": "Seleziona opzione per Header Right",
      "strRepeatCurrency": "Ripetere (repeat)",
      "strNoRepeatCurrency": "Non ripetere (norepeat)",
      "strRepeatHeaderLeft": "Ripetere (repeat)",
      "strNoRepeatHeaderLeft": "Non ripetere (norepeat)",
      "strRepeatHeaderRight": "Ripetere (repeat)",
      "strNoRepeatHeaderRight": "Non ripetere (norepeat)",
      "strAddHeaderOptions": "Aggiungi opzioni",
      "strSetQueryColumns": "Imposta QueryColumns",
      "strTextSetQueryColumns": "Imposta una colonna",
      "strSlctSheetColumn": "Seleziona una colonna del foglio di lavoro",
      "strOptSelectAnOption": "--seleziona un'opzione--",
      "strSelectedColumn": "Corrente",
      "strSlctFilename": "Seleziona un file",
      "strOptSelectAnOptionFile": "--seleziona un'opzione--",
      "strCurrentFile": "Corrente",
      "strCurrentVoid": "Corrente (vuoto)",
      "strP1": "1 anno precedente (p1)",
      "strP2": "2 anni precedenti (p2)",
      "strP3": "3 anni precedenti (p3)",
      "strSlctTypeValue": "Seleziona un valore per Type",
      "strOptSelectAnOptionType": "--seleziona un'opzione--",
      "strSlctColumnValue": "Seleziona un valore per Column",
      "strOptSelectAnOptionColumn": "--seleziona un'opzione--",
      "strSlctSegmentValue": "Seleziona un valore per Segment (opzionale)",
      "strOptSelectAnOptionSegment": "--seleziona un'opzione--",
      "strSlctPeriodValue": "Seleziona un periodo (opzionale)",
      "strAllVoid": "Tutto (vuoto)",
      "strCustomDate": "Data personalizzata",
      "strM1": "Mese 1 (M1)",
      "strM2": "Mese 2 (M2)",
      "strM3": "Mese 3 (M3)",
      "strM4": "Mese 4 (M4)",
      "strM5": "Mese 5 (M5)",
      "strM6": "Mese 6 (M6)",
      "strM7": "Mese 7 (M7)",
      "strM8": "Mese 8 (M8)",
      "strM9": "Mese 9 (M9)",
      "strM10": "Mese 10 (M10)",
      "strM11": "Mese 11 (M11)",
      "strM12": "Mese 12 (M12)",
      "strQ1": "1. Quadrimestre (Q1)",
      "strQ2": "2. Quadrimestre (Q2)",
      "strQ3": "3. Quadrimestre (Q3)",
      "strQ4": "4. Quadrimestre (Q4)",
      "strS1": "1. Semestre (S1)",
      "strS2": "2. Semestre (S2)",
      "strY1": "Anno 1 (Y1)",
      "strY2": "Anno 2 (Y2)",
      "strLoadAllColumn": "Aggiungi colonna",
      "strSetQueryAccounts": "Imposta QueryAccounts",
      "strAddAccounts": "a) Aggiungi conti",
      "strOptSelectAnOptionAccounts": "--seleziona un'opzione--",
      "strAddToQueryAccount": "Aggiungi conti",
      "strQaAccounts": "Conti",
      "strQaGroups": "Gruppi",
      "strQaCostCenters": "Centri di costo",
      "strQaSegments": "Segmenti",
      "strQaAll": "Tutto",
      "strQaVatCodes": "Codici IVA",
      "strSelectAll": "(seleziona tutto)",
      "strQaOptions": "b) Aggiungi opzioni. Seleziona la cella accanto al conto (opzionale)",
      "strOptSelectAnOptionOptions": "--seleziona un'opzione--",
      "strInvert": "invert",
      "strBudget": "budget",
      "strBudgetinvert": "budgetinvert",
      "strAddToQueryOptions": "Aggiungi opzione",
      "strTitleUpdate": "Aggiorna foglio di lavoro",
      "strTextUpdate": "Recupera i valori aggiornati da Banana Contabilità",
      "strUpdateData": "Aggiorna foglio di lavoro corrente",
      "strTitleSettings": "Impostazioni",
      "strInsertPort": "a) Numero di Porta Banana Contabilità: inserisci il numero di Porta per 'https://127.0.0.1' configurata in Banana Contabilità",
      // "strUsedUrl": "Impostazioni cambiate. Per favore confermare la modifica.",
      "strChangeLanguage": "b) Lingua",
      "strExcelPredefined": "Predefinita",
      "strServerInformation": "a) Informazioni server",
      "strInsertServerUrl": "Server URL",
      "strInsertToken": "Token connessione",
      "strDefaultUrl": "(Vuoto = https://127.0.0.1:8089)",
      "strUrlOther": "Altro",
      "strOptions": "Opzioni",
      "strConfirmationMessageHeader": "Conferma modifica",
      "strConfirmationMessageBody": "È stata modificata un'impostazione che richiede la ricarica dell'applicazione.",
      "strConfirmationMessageBody2": "Continuare?",
      "strConfirmYes": "Sì",
      "strConfirmNo": "No",
  };

  // JSON object for German strings
  UIStrings.DE =
  {
      "strSetupdescription": "Richten Sie das Arbeitsblatt ein, um mit Ihren Banana Buchhaltungdaten benutzerdefinierte Berichte erstellen zu können:",
      "strSetupstep1": "Wählen Sie eine Banana Buchhaltungsdatei",
      "strSetupstep2": "Fügen Sie dem Arbeitsblatt eine Überschrift hinzu",
      "strSetupstep3": "Richten Sie die Spaltenüberschriften ein",
      "strSetupstep4": "Fügen Sie Konten, Gruppen, Kostenstellen, Segmente usw. hinzu",
      "strSetupstep5": "Aktualisieren Sie das Arbeitsblatt, um Ihre Banana Buchhaltungsdaten abzurufen",
      "strUpdatedescription": "Halten Sie Ihre Berichte mit den aktuellsten Daten Ihrer Banana Buchhaltung auf neustem Stand",
      "strBegin": "Starten Sie!",
      "strSetup": "Konfigurieren",
      "strUpdate": "Aktualisieren",
      "strTest": "Entwicklung",
      "strLogs": "Meldungen",
      "strDev": "Entwicklung...",
      "strHelp":"Hilfe",
      "strTitleSetup": "Einrichten des Arbeitsblatts",
      "strBananaFile": "Eine geöffnete Banana Datei auswählen ",
      "strUpdateList": "Dateiliste aktualisieren",
      "strSetHeader": "Überschrift einrichten",
      "strSelectHeader": "a) Überschrift auswählen und Arbeitsblatt hinzufügen",
      "strPredefinedHeader": "Vordefinierte Überschrift mit Spalten",
      "strEmptyHeader": "Leere Überschrift",
      "strAddHeader": "Überschrift hinzufügen",
      "strTextHeaderOptions": "b) Hinzufügen von Überschrift-Optionen",
      "strSelectOptionCurrency": "Currency-Option auswählen",
      "strSelectOptionHeaderLeft": "Header Left-Option auswählen",
      "strSelectOptionHeaderRight": "Header Right-Option auswählen",
      "strRepeatCurrency": "Wiederholen (repeat)",
      "strNoRepeatCurrency": "Nicht wiederholen (norepeat)",
      "strRepeatHeaderLeft": "Wiederholen (repeat)",
      "strNoRepeatHeaderLeft": "Nicht wiederholen (norepeat)",
      "strRepeatHeaderRight": "Wiederholen (repeat)",
      "strNoRepeatHeaderRight": "Nicht wiederholen (norepeat)",
      "strAddHeaderOptions": "Optionen hinzufügen",
      "strSetQueryColumns": "QueryColumns einrichten",
      "strTextSetQueryColumns": "Spalte einrichten",
      "strSlctSheetColumn": "Eine Spalte des Arbeitsblatts auswählen",
      "strOptSelectAnOption": "--eine Option auswählen--",
      "strSelectedColumn": "Aktuellen",
      "strSlctFilename": "Datei auswählen",
      "strOptSelectAnOptionFile": "--eine Option auswählen--",
      "strCurrentFile": "Aktuellen",
      "strCurrentVoid": "Aktuellen (leer)",
      "strP1": "1 Vorjahr (p1)",
      "strP2": "2 Vorjahre (p2)",
      "strP3": "3 Vorjahre (p3)",
      "strSlctTypeValue": "Wert für Type auswählen",
      "strOptSelectAnOptionType": "--eine Option auswählen--",
      "strSlctColumnValue": "Wert für Column auswählen",
      "strOptSelectAnOptionColumn": "--eine Option auswählen--",
      "strSlctSegmentValue": "Wert für Segment auswählen (optional)",
      "strOptSelectAnOptionSegment": "--eine Option auswählen--",
      "strSlctPeriodValue": "Periode auswählen (optional)",
      "strAllVoid": "Alle (leer)",
      "strCustomDate": "Spezifisches Datum",
      "strM1": "Monat 1 (M1)",
      "strM2": "Monat 2 (M2)",
      "strM3": "Monat 3 (M3)",
      "strM4": "Monat 4 (M4)",
      "strM5": "Monat 5 (M5)",
      "strM6": "Monat 6 (M6)",
      "strM7": "Monat 7 (M7)",
      "strM8": "Monat 8 (M8)",
      "strM9": "Monat 9 (M9)",
      "strM10": "Monat 10 (M10)",
      "strM11": "Monat 11 (M11)",
      "strM12": "Monat 12 (M12)",
      "strQ1": "1. Quartal (Q1)",
      "strQ2": "2. Quartal (Q2)",
      "strQ3": "3. Quartal (Q3)",
      "strQ4": "4. Quartal (Q4)",
      "strS1": "1. Semester (S1)",
      "strS2": "2. Semester (S2)",
      "strY1": "Jahr 1 (Y1)",
      "strY2": "Jahr 2 (Y2)",
      "strLoadAllColumn": "Spalte hinzufügen",
      "strSetQueryAccounts": "QueryAccounts einrichten",
      "strAddAccounts": "a) Konten hinzufügen",
      "strOptSelectAnOptionAccounts": "--eine Option auswählen--",
      "strAddToQueryAccount": "Konten hinzufügen",
      "strQaAccounts": "Konten",
      "strQaGroups": "Gruppen",
      "strQaCostCenters": "Kostenstellen",
      "strQaSegments": "Segmente",
      "strQaAll": "Alle",
      "strQaVatCodes": "MwSt/USt-Codes",
      "strSelectAll": "(Alle auswählen)",
      "strQaOptions": "b) Optionen hinzufügen. Zelle neben dem Konto auswählen (optional)",
      "strOptSelectAnOptionOptions": "--eine Option auswählen--",
      "strInvert": "invert",
      "strBudget": "budget",
      "strBudgetinvert": "budgetinvert",
      "strAddToQueryOptions": "Option hinzufügen",
      "strTitleUpdate": "Arbeitsblatt aktualisieren",
      "strTextUpdate": "Aktualisierte Werte aus Banana Buchhaltung übernehmen",
      "strUpdateData": "Laufendes Arbeitsblatt aktualisieren",
      "strTitleSettings": "Einstellungen",
      "strInsertPort": "a)  Portnummer Banana Buchhaltung: Portnummer für 'https://127.0.0.1' eingeben, die in Banana Buchhaltung konfiguriert ist",
      // "strUsedUrl": "Einstellungen geänderte. Bitte bestätigen die Änderung.",
      "strChangeLanguage": "b) Sprache",
      "strExcelPredefined": "Standardmäßig",
      "strServerInformation": "a) Server-Informationen",
      "strInsertServerUrl": "Server URL",
      "strInsertToken": "Verbindungs-Token",
      "strDefaultUrl": "(Leer = https://127.0.0.1:8089)",
      "strUrlOther": "Andere",
      "strOptions": "Optionen",
      "strConfirmationMessageHeader": "Änderung bestätigen",
      "strConfirmationMessageBody": "Sie haben eine Einstellung geändert, bei der die App neu geladen werden muss.",
      "strConfirmationMessageBody2": "Weiterfahren?",
      "strConfirmYes": "Ja",
      "strConfirmNo": "Nein",
  }

  // JSON object for French strings
  UIStrings.FR =
  {
      "strSetupdescription": "Configurez la feuille de calcul pour créer des rapports personnalisés à l'aide de vos données comptables Banana:",
      "strSetupstep1": "Sélectionnez un fichier de comptabilité Banana",
      "strSetupstep2": "Ajoutez un en-tête à la feuille de calcul",
      "strSetupstep3": "Définissez les colonnes de l’en-tête",
      "strSetupstep4": "Ajoutez des comptes, des groupes, des centres de coûts, des segments, et plus",
      "strSetupstep5": "Mettez à jour votre feuille de calcul pour récupérer vos données comptables",
      "strUpdatedescription": "Tenez vos rapports à jour avec les données comptables actuelles",
      "strBegin": "Commencer!",
      "strSetup": "Configurer",
      "strUpdate": "Mettre à jour",
      "strTest": "Développement",
      "strLogs": "Messages",
      "strDev": "Développement...",
      "strHelp":"Aide",
      "strTitleSetup": "Configuration de la feuille de calcul",
      "strBananaFile": "Sélectionner un fichier Banana ouvert",
      "strUpdateList": "Mettre la liste de fichiers à jour",
      "strSetHeader": "Configurer en-tête",
      "strSelectHeader": "a) Sélectionner un en-tête et l'ajouter à la feuille de calcul",
      "strPredefinedHeader": "En-tête prédéfini avec colonnes",
      "strEmptyHeader": "En-tête vide",
      "strAddHeader": "Ajouter en-tête",
      "strTextHeaderOptions": "b) Ajouter options d'en-tête",
      "strSelectOptionCurrency": "Sélectionner option pour Currency",
      "strSelectOptionHeaderLeft": "Sélectionner option pour Header Left",
      "strSelectOptionHeaderRight": "Sélectionner option pour Header Right",
      "strRepeatCurrency": "Répéter (repeat)",
      "strNoRepeatCurrency": "Ne pas répéter (norepeat)",
      "strRepeatHeaderLeft": "Répéter (repeat)",
      "strNoRepeatHeaderLeft": "Ne pas répéter (norepeat)",
      "strRepeatHeaderRight": "Répéter (repeat)",
      "strNoRepeatHeaderRight": "Ne pas répéter (norepeat)",
      "strAddHeaderOptions": "Ajouter options",
      "strSetQueryColumns": "Configurer QueryColumns",
      "strTextSetQueryColumns": "Configurer une colonne",
      "strSlctSheetColumn": "Sélectionner une colonne de la feuille de calcul",
      "strOptSelectAnOption": "--sélectionner une option--",
      "strSelectedColumn": "Courant",
      "strSlctFilename": "Sélectionner un nom de fichier",
      "strOptSelectAnOptionFile": "--sélectionner une option--",
      "strCurrentFile": "Courant",
      "strCurrentVoid": "Courant (vide)",
      "strP1": "1 année précédente (p1)",
      "strP2": "2 années précédentes (p2)",
      "strP3": "3 années précédentes (p3)",
      "strSlctTypeValue": "Sélectionner une valeur de Type",
      "strOptSelectAnOptionType": "--sélectionner une option--",
      "strSlctColumnValue": "Sélectionner une valeur de Column",
      "strOptSelectAnOptionColumn": "--sélectionner une option--",
      "strSlctSegmentValue": "Sélectionner une valeur de Segment (facultatif)",
      "strOptSelectAnOptionSegment": "--sélectionner une option--",
      "strSlctPeriodValue": "Sélectionner une période (facultatif)",
      "strAllVoid": "Tout (vide)",
      "strCustomDate": "Date spécifique",
      "strM1": "Mois 1 (M1)",
      "strM2": "Mois 2 (M2)",
      "strM3": "Mois 3 (M3)",
      "strM4": "Mois 4 (M4)",
      "strM5": "Mois 5 (M5)",
      "strM6": "Mois 6 (M6)",
      "strM7": "Mois 7 (M7)",
      "strM8": "Mois 8 (M8)",
      "strM9": "Mois 9 (M9)",
      "strM10": "Mois 10 (M10)",
      "strM11": "Mois 11 (M11)",
      "strM12": "Mois 12 (M12)",
      "strQ1": "1. Trimestre (Q1)",
      "strQ2": "2. Trimestre (Q2)",
      "strQ3": "3. Trimestre (Q3)",
      "strQ4": "4. Trimestre (Q4)",
      "strS1": "1. Semestre (S1)",
      "strS2": "2. Semestre (S2)",
      "strY1": "Année 1 (Y1)",
      "strY2": "Année 2 (Y2)",
      "strLoadAllColumn": "Ajouter une colonne",
      "strSetQueryAccounts": "Configurer QueryAccounts",
      "strAddAccounts": "a) Ajouter comptes",
      "strOptSelectAnOptionAccounts": "--sélectionner une option--",
      "strAddToQueryAccount": "Ajouter comptes",
      "strQaAccounts": "Comptes",
      "strQaGroups": "Groupes",
      "strQaCostCenters": "Centres de coût",
      "strQaSegments": "Segments",
      "strQaAll": "Tous",
      "strQaVatCodes": "Codes TVA",
      "strSelectAll": "(sélectionner tous)",
      "strQaOptions": "b) Ajouter options. Sélectionner la cellule à côté du compte (facultatif)",
      "strOptSelectAnOptionOptions": "--sélectionner une option--",
      "strInvert": "invert",
      "strBudget": "budget",
      "strBudgetinvert": "budgetinvert",
      "strAddToQueryOptions": "Ajouter option",
      "strTitleUpdate": "Mettre la feuille de calcul à jour",
      "strTextUpdate": "Récupér les valeurs mises à jour de Banana Comptabilité",
      "strUpdateData": "Mettre la feuille de calcul courante à jour",
      "strTitleSettings": "Paramètres",
      "strInsertPort": "a) Numéro de port Banana Comptabilité: insérer le numéro de port pour 'https://127.0.0.1', configuré dans Banana Comptabilité",
      // "strUsedUrl": "Paramètres changés. Veuillez confirmer le changement.",
      "strChangeLanguage": "b) Langue",
      "strExcelPredefined": "Défaut",
      "strServerInformation": "a) Informations sur le serveur",
      "strInsertServerUrl": "URL du serveur",
      "strInsertToken": "Jeton de connexion",
      "strDefaultUrl": "(Vide = https://127.0.0.1:8089)",
      "strUrlOther": "Autre",
      "strOptions": "Options",
      "strConfirmationMessageHeader": "Confirmer le changement",
      "strConfirmationMessageBody": "Vous avez modifié un paramètre qui exige que l'application soit rechargée.",
      "strConfirmationMessageBody2": "Continuer?",
      "strConfirmYes": "Oui",
      "strConfirmNo": "Non",
  }

  UIStrings.getLocaleStrings = function (locale)
  {
      var text;
      
      // Get the resource strings that match the language.
      switch (locale)
      {
          case 'en-US':
              text = UIStrings.EN;
              break;
          case 'it-IT':
              text = UIStrings.IT;
              break;
          case 'de-DE':
              text = UIStrings.DE;
              break;
          case 'fr-FR':
              text = UIStrings.FR;
              break;
          default:
              text = UIStrings.EN;
              break;
      }

      return text;
  };

  return UIStrings;
})();