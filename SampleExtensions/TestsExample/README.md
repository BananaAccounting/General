# TestFramework example

This test case is a simple example where all the functionalities of the [BananaApps Test Framework](https://www.banana.ch/doc/en/node/9026) are showed. This example is ideal as template for new test cases.

## Create a new test case

* Create a folder `test` in the same folder where the BananaApp is located.
* Copy the file ['test/ch.banana.script.testframework.test.js'](test/ch.banana.script.testframework.test.js) to the `test` folder.
* Rename the file with the same file name as the BananaApp, set the extention as `.test.js`.
* If you have `ac2` files for the test case, create a folder `test/testcases` and copy the files there.
* If you are working with GIT copy the `.gitignore` file too.
* Edit the file `test/ch.banana.script.bananaapp.test.js`
* Run the test case
* Verify that the test terminated succesfully
* If you have differences and they are correct, copy the test results from the folder `test/testresults` to the folder `test/testexpected`

## Run a test case

You can run a test case in two ways:

* Through Visual Studio Code (this is the preferred method)
   * Set up the cmake project as described in [Build extensions with VS Code and CMake](https://www.banana.ch/doc/en/node/10058#run_the_tests)
   * Open the cmake project in Visual studio code
   * From the Activity bar on the left select CMake
   * Right click on the test project and select Run utility

* Through the [Manage Apps](https://www.banana.ch/doc9/en/node/4727) dialog
   * Open the Manage Apps dialog
   * Select the BananaApp to test
   * Click over 'Show details'
   * Click on the button 'Run test case'
   
* Through the Command line
   * *bananaplus.exe -cmd=runtestsapps -p1=path_to_testcase.js|folder*  
   * As parameter p1 you can specify the path to a test case file, or the path of a folder
   * In case of a folder all files in the folder and subfolders ending with test.js are run
     
## Test case folder structure
This is the default test structure of a test case. All the files used for the test case are stored in a folder named `test`.

In the dialog Manage apps the button `Run test case` is showed only if the application find a file named `test/<same_name_bananaapps>.test.js`.

```
ch.banana.script.bananaapp.js                # BananaApps
ch.banana.script.bananaapp2.js
...
test/
  ch.banana.script.bananaapp.test.js         # BananaApps Test Cases
  ch.banana.script.bananaapp2.test.js
  ...
  testcases/
    *.ac2                                    # ac2 files for the test cases
    ...
  testexpected/                              # Expected test results used for verifying the current results
    ch.banana.script.bananaapp.test/
      *.txt
    ch.banana.script.bananaapp2.test/
      *.txt
    ...  
  testresults/                               # Current test results
    ch.banana.script.bananaapp.test/
      *.txt
    ch.banana.script.bananaapp2.test/
      *.txt
    ...  
```

If you want to put the test scripts in another folder, you can specify the path through the BananaApp parameter [`@testapp`](https://www.banana.ch/doc9/en/node/4715#attribute_testapp)
