// Copyright [2015] [Banana.ch SA - Lugano Switzerland]
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @id = ch.banana.translations
// @api = 1.1
// @pubdate = 2020-07-14
// @publisher = Banana.ch SA
// @description = String's translations
// @task = app.command
// @doctype = nodocument
// @docproperties =
// @outputformat = none
// @inputdatasource = none
// @timeout = -1

// Description:
// This script is an example for translating strings in javascript and
// qml files.

function exec(string) {

    // Exemple for function qsTr
    var translatedText = qsTr("Translations:");  // Mark text for translation
    // NB: The variabile translatedText contains the translated string "Translated texts"
    // in the application's language


    // Exemple for function QT_TRANSLATE_NOOP
    var myReportTexts = {};
    myReportTexts.account_card = QT_TRANSLATE_NOOP("MyReport", "Account card"); // Mark text for translation
    // NB: The variable myReportTexts.account_card contains the source code string "Account card"
    // You need a Banana.Translator object to translate it in the desired language

    // Translate to the document's language
    var documentLanguage = "en";
    if (Banana.document) {
        documentLanguage = Banana.document.locale.substring(0,2);
    }
    var docTranslator = Banana.Translations.getTranslator(documentLanguage, "MyReport");
    var myReportTranslatedText = docTranslator.tr(myReportTexts.account_card); // Translate to the document's language

    // Translate to italian
    var translatorIt = Banana.Translations.getTranslator("it", "MyReport");
    var myReportTranslatedTextIt = translatorIt.tr(myReportTexts.account_card); // Translate to Italian: "Scheda conto"

    // Translate to French
    var translatorFr = Banana.Translations.getTranslator("fr", "MyReport");
    var myReportTranslatedTextFr = translatorFr.tr(myReportTexts.account_card); // Translate to French: "Fiche de compte"

    // Translate to German
    var translatorDe = Banana.Translations.getTranslator("de", "MyReport");
    var myReportTranslatedTextDe = translatorDe.tr(myReportTexts.account_card); // Translate to German: "Fiche de

    // Translate to English
    var translatorEn = Banana.Translations.getTranslator("en", "MyReport");
    var myReportTranslatedTextEn = translatorEn.tr(myReportTexts.account_card); // Translate to French: "Fiche de

    // Translate to not existing language
    var translatorXx = Banana.Translations.getTranslator("xx", "MyReport");
    var myReportTranslatedTextXx = translatorXx.tr(myReportTexts.account_card); // Translate to French: "Fiche de


    // Build text to show
    var text = translatedText + "\n\n";
    text += qsTr("Italian") + ": " + myReportTranslatedTextIt + "\n";
    text += qsTr("French") + ": " + myReportTranslatedTextFr + "\n";
    text += qsTr("German") + ": " + myReportTranslatedTextDe + "\n";
    text += qsTr("English") + ": " + myReportTranslatedTextEn + "\n";
    text += qsTr("Unknow") + ": " + myReportTranslatedTextXx + "\n";
    if (Banana.document) {
        text += "\n";
        text += qsTr("In the language of the document") + ": " + myReportTranslatedText + "\n";
    }


    // Create dialog
    var dlg = Banana.Ui.createQml(qsTr("Text"), "Dialog.qml");
    dlg.qmlObject.text = text;

    // Show dialog with translated text
    Banana.application.progressBar.pause();
    dlg.exec();
    Banana.application.progressBar.resume();

}


