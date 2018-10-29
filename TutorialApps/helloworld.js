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


// @id = ch.banana.app.helloworldexample
// @api = 1.0
// @pubdate = 2018-10-23
// @publisher = Banana.ch SA
// @description = Example "Hello world"
// @description.fr = Example "Hello world"
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @timeout = -1

function exec() {

    /* DIALOG */
    //Add a dialog that shows the "Hello world" text
    Banana.Ui.showInformation("Information dialog", 'Hello world!!!');


    /* REPORT */
    //Create the report
    var report = Banana.Report.newReport('Report title');

    //Add a paragraph with the "hello world" text
    report.addParagraph('Hello World!!!');

    //Print the report
    var stylesheet = Banana.Report.newStyleSheet();
    Banana.Report.preview(report, stylesheet);

}
