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
// @id = ch.banana.app.waypointsgpx
// @api = 1.0
// @pubdate = 2017-01-10
// @publisher = Banana.ch SA
// @description = Create a .gpx Waypoints file starting from a table in Banana
// @task = export.file
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdatasource = none
// @timeout = -1
// @exportfiletype = gpx



function exec() {

	var xml = '';
	xml += '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
	xml += '\n' + '<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="RouteConverter">';

	xml = add_metadata(xml);
	xml = add_wpt(xml);

	xml += '\n' + '</gpx>';

	return xml;
}

function add_metadata(xml) {

	var metadataName = 'Test file Banana.ch SA ....';

	xml += '\n' + '\t' + '<metadata>';
	xml += '\n' + '\t' + '\t' + '<name>' + metadataName + '</name>';
	xml += '\n' + '\t' + '</metadata>';

	return xml;
}


function add_wpt(xml) {

	var table = Banana.document.table('GPX');
	
	for (var i = 0; i < table.rowCount; i++) {
		var tRow = table.row(i);
		var lon = tRow.value("Lon");
		var lat = tRow.value("Lat");
		var ele = tRow.value("Ele");
		var name = tRow.value("Name");
	
		xml += '\n' + '\t' + '<wpt lon="'+ lon + '" lat="' + lat + '">';
		
		if (ele) {
			xml += '\n' + '\t' + '\t' + '<ele>' + ele + '</ele>';
		}
		xml += '\n' + '\t' + '\t' + '<name>' + name + '</name>';
		xml	+= '\n' + '\t' + '</wpt>';
	}

	return xml;
}

