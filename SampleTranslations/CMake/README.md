# Sample Translations

This folder contains a sample extention for translating strings in javascript
and qml files using a CMakeLists.txt project.

For a detailed description how to translate extensions see the docuemntation page [Extension's translation](https://www.banana.ch/doc/en/node/9743)

Content:

- translations.js: the extention;
- Dialog.qml: a dialog used by the extention;
- ch.banana.translations.sbaa: the extension as a [package file](https://www.banana.ch/doc/en/node/9740);
- ch.banana.translations.manifest.json: the [manifest file](https://www.banana.ch/doc/en/node/9740#manifest_file) describing the extension;
- CMakeLists.txt: the project file used to build the extension and to update the translations;
- translations.qrc: the resource file for creating the extention's package;
    It is also used to list the files to be parsed for strings marked for translations;


