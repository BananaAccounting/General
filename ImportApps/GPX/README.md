# GPX import apps

With the new file format [JCSV](https://doc8.banana.ch/en/node/8400) developed by Banana Software it is possible to add any kind of data as tables in a Banana.

## From table to .gpx file
Starting from a table in Banana document the apps retrieve the data, create and then export **.gpx** files ([GPS Exchange Format](https://en.wikipedia.org/wiki/GPS_Exchange_Format)).

Using the appropriate BananaApp it is possible to retrieve the desired .gpx file.

There are three types of files:

 * **Waypoints** .gpx file
 	* a collection of points (waypoints) with coordinates and other information without any sequential relationship. 
 * **Route** .gpx file
 	* an ordered list of routepoint (waypoints representing a series of significant turn or stage points) leading to a destination.
 * **Track** .gpx file
 	* an ordered list of points describing a path which are logically connected in order.

### How to run the examples
1) Use the GPX.ac2 file or create a new accounting file and drag & drop the .jcsv file into it.
2) Add the desired App and run it.
3) The .gpx file is generated on the same directory of the .ac2 file.

## From .gpx file to .jcsv file
The idea is to strart from a .gpx file, retrieve all the needed data and then create a .jcsv file. At the end it is possible to import this .jcsv file into Banana to create a table.

## Resources
* GPX: 
	* https://en.wikipedia.org/wiki/GPS_Exchange_Format
	* http://www.topografix.com/gpx.asp
* TCX: https://en.wikipedia.org/wiki/Training_Center_XML
* KML: https://en.wikipedia.org/wiki/Keyhole_Markup_Language
* Other: 
	* https://ridewithgps.com/help/export-file-formats
	* GPX visualizer: http://www.gpsvisualizer.com/examples/google_gpx.html
	* Google Map import: https://support.google.com/mymaps/answer/3024836?hl=en
