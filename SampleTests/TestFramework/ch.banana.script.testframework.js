// Copyright [2018] [Banana.ch SA - Lugano Switzerland]
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

// @id = ch.banana.script.bananaapp
// @api = 1.0
// @pubdate = 2018-03-30
// @publisher = Banana.ch SA
// @description = Simple app for using Test.logger class
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1

function exec() {
   return findBiggestTransactionAmount(Banana.document);
}

/** N.B.: This function is testable alone outside the exec() function */
function findBiggestTransactionAmount(accounting) {
   if (!accounting)
      return 0;

   var tableTransactions = accounting.table("Transactions");
   if (!tableTransactions)
      return 0;

   var biggestTransaction = -1;
   var biggestTransactionAmount = 0;
   for (var i = 0; i < tableTransactions.rowCount; i++) {
      var curAmount = tableTransactions.value(i, "Amount");
      if (curAmount && Banana.SDecimal.compare(curAmount, biggestTransactionAmount) > 0) {
         biggestTransaction = i;
         biggestTransactionAmount = curAmount;
      }
   }

   return biggestTransactionAmount;
}
