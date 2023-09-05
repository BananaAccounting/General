function getProfit(doc) {
  return doc.value('Totals', 2 ,'Balance');
}

function getProfitLabel(amount) {
  if (Banana.SDecimal.sign(amount) >= 0) {
    return qsTr("Profit");
  } else {
    return qsTr("Loss");
  }
}