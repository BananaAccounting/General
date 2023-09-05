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

function exec() {
  let profit = getProfit();
  Banana.Ui.showInformation(`${getProfitLabel(profit)}: ${Banana.converter.toLocalAmountFormat(profit)}`);
}

function getProfit() {
  return Banana.document.value('Totals', 2 ,'Balance');
}

function getProfitLabel(amount) {
  if (Banana.SDecimal.sign(amount) >= 0) {
    return qsTr("Profit");
  } else {
    return qsTr("Loss");
  }
}