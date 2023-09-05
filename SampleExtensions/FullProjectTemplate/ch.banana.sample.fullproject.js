// @id = ch.banana.sample.simpleproject
// @api = 1.0
// @pubdate = 2023-09-04
// @publisher = Banana.ch SA
// @description = Simple extension project
// @description.it = Progetto semplice di estensione
// @description.fr = Projet d'extension simple
// @description.de = "Einfaches Erweiterungsprojekt
// @description.en = Simple extension project
// @task = app.command
// @doctype = *.*
// @docproperties =
// @outputformat = none
// @inputdataform = none
// @timeout = -1
// @includejs = ch.banana.sample.fullproject.lib.js

function exec() {
  let profit = getProfit(Banana.document);
  Banana.Ui.showInformation(`${getProfitLabel(profit)}: ${Banana.converter.toLocalAmountFormat(profit)}`);
}
