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
// Create a file that use the C3 chart libraries
// @id = ch.banana.demo.createc3chart
// @description = Create a C3 chart
// @doctype = 100.*;110.*;130.*
// @task = export.file
// @exportfiletype = html
// @inputdatasource = none
// @timeout = -1

function exec( string) {
	if (!Banana.document)
		return;
	var th = generateHtmlBegin();
	th += generateChart();
	th += generateHtmlEnd();
	
	return th;
	//Banana.Ui.showText(th);
	
}

function generateHtmlBegin()
{
	var th;
	th ='<html>\n';
	th +='<head>\n';
	th +='<link href="http://c3js.org/css/c3.css" rel="stylesheet" type="text/css">\n';
	th +='</head>\n';
  	th +='<body>\n';
    th +='<div id="chart"></div>\n';
	// lib files are available on this web site
    th +='<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>\n';
	th +='<script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js"></script>\n';
    //th +='<script src="c3.min.js"></script>\n';
	th +='<script>\n';
	return th;
}

function generateHtmlEnd()
{
	var th;
	th ='</script>\n';
	th +='</body>\n';
	th +='</html>\n';
	return th;
}
function generateTimeSeries()
{
	//12 months 
	var dates = [];
	for ( var i = 1; i <= 12; i++) {
		var period = {};
		var p = "M" + i;
		period.start = Banana.document.startPeriod(p);
		period.end = Banana.document.endPeriod(p);
		dates.push(period);
	}
	return dates;
}


function generateChart()
{
	var dates = generateTimeSeries();
	// the list of account for witch we want to create a graph
	var accounts = {}
	accounts[1] = {account:'Gr=100' };
	accounts[2] = {account:'Gr=4'};
	accounts[3] = {account:'Gr=3'};
	accounts[4] = {account:'Gr=02'};
	var th = "";
	var timeS = "['x' ";
	for (var i = 0; i < dates.length; i++) {
		timeS += ",'" + dates[i].end + "'";
	}
	timeS += "],\n";
	var dS = {};
	for (ac in accounts) {
		dS[accounts[ac].account] = "['" + Banana.document.accountDescription(accounts[ac].account) + "' ";
	}
	for (ac in accounts) {
		for (var i = 0; i < dates.length; i++) {
			var balance = Banana.document.currentBalance(accounts[ac].account, dates[i].start, dates[i].end);
			// use amount that is already normalized based on the bclass 
			dS[accounts[ac].account] += ",'" + balance.amount + "' "; 
		}
		dS[accounts[ac].account]  += "],\n";
	}

	th += "var chart = c3.generate({\n";
    th += "data: {\n";
    th += "x: 'x',\n";
    th += "columns: [\n";
    //th += "['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],\n";
	th += timeS;
	//th += "['data1', 30, 200, 100, 400, 150, 250],\n";
	for (ac in accounts) {
		th += dS[accounts[ac].account];
	}
    th += "]\n";
    th += "},\n";
	
    th += "axis: {\n";
    th += "x: {\n";
	th += "type: 'timeseries',\n";
    th += "tick: {\n";
	th += "format: '%Y-%m-%d'\n";
	th += "}\n";
    th += "}\n";
    th += "}\n";
	th += "});	\n";
	return th;
	
}
