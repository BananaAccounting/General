# SampleTest1

This test case is a simple example where all the functionalities of the [BananaApps Test Framework](https://www.banana.ch/doc9/en/node/9026) are showed. This example is ideal as template for new test cases.

## Create a new test case

* Create a folder `test` in the same folder where the BananaApp is located.
* Copy the file ['test/ch.banana.script.bananaapp.test.js'](test/ch.banana.script.bananaapp.test.js) to the `test` folder.
* Rename the file with the same file name as the BananaApp, set the extention as `.test.js`.
* If you have `ac2` files for the test case, create a folder `test/testcases` and copy the files there.
* Edit the file `test/ch.banana.script.bananaapp.test.js`
* Run the test case
* Verify that the test terminated succesfully
* If you have differences and they are correct, copy the test results from the folder `test/testresults` to the folder `test/testexpected`

## Run a test case

You can run a test case in two ways (both availables starting Banana Accounting 9.0.4):

* Through the [Manage Apps](https://www.banana.ch/doc9/en/node/4727) dialog
   * Open the Manage Apps dialog
   * Select the BananaApp to test
   * Click over 'Show details'
   * Click on the button 'Run test case'
   
* Through the Command linne
   * *banana90.exe -cmd=runtestsapps -p1=path_to_testcase.js|folder*  
   * As parameter p1 you can specify the path to a test case file, or the path of a folder
   * In case of a folder all files in the folder and subfolders ending with test.js are run
   
     


