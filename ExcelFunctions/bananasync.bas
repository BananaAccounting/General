' Copyright (C) 2015-2017 Banana.ch SA
'
' Licensed under the Apache License, Version 2.0 (the "License");
' you may not use this file except in compliance with the License.
' You may obtain a copy of the License at
'' Copyright (C) 2015-2018 Banana.ch SA
'
' Licensed under the Apache License, Version 2.0 (the "License");
' you may not use this file except in compliance with the License.
' You may obtain a copy of the License at
'
' http://www.apache.org/licenses/LICENSE-2.0
'
' Unless required by applicable law or agreed to in writing, software
' distributed under the License is distributed on an "AS IS" BASIS,
' WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
' See the License for the specific language governing permissions and
' limitations under the License.
'
' History version 2
' 2017-02-01 First release with B Function with File and without file



'Option Explicit On

'Save lastQuery for debug purposes
Const MAXLASTQUERY = 10
Dim lastQuery(0 To MAXLASTQUERY) As String

'Reset in
'To avoid continuing error, maybe there is a better solution
Const MAXERROR = 5
Dim requestNumber As Integer
Dim lastRequestNumber As Integer
Dim errorCount As Integer


#If Mac Then
    'Function used in execShellMac() function (only for mac osx)
    Private Declare Function popen Lib "libc.dylib" (ByVal command As String, ByVal mode As String) As Long
    Private Declare Function pclose Lib "libc.dylib" (ByVal file As Long) As Long
    Private Declare Function fread Lib "libc.dylib" (ByVal outStr As String, ByVal size As Long, ByVal items As Long, ByVal stream As Long) As Long
    Private Declare Function feof Lib "libc.dylib" (ByVal file As Long) As Long
#End If


Function BGetFile(Optional num As Integer = 0) As String
Dim cellName As String
    If num = 0 Then
        cellName = "File0"
    ElseIf num = 1 Then
        cellName = "File1"
    ElseIf num = 2 Then
        cellName = "File2"
    ElseIf num = 3 Then
        cellName = "File3"
    End If
    BGetFile = Range(cellName).Value
End Function
' Return the version date
Public Function BFunctionsVersion() As String
    BFunctionsVersion = "2017-02-01"
End Function

' Retrieve the account description
Public Function BAccountDescription(account As String, Optional column As String = "") As String
    BAccountDescription = BAccountDescriptionF(BGetFile(), account, column)
End Function



' Retrieve the account description
Public Function BAccountDescriptionF(fileName As String, account As String, Optional column As String = "") As String
    Application.Volatile
    Dim myUrl As String
    myUrl = "accountdescription/" & account
    If Len(column) > 0 Then
        myUrl = myUrl & "/" & column
    End If
    BAccountDescriptionF = BHttpQuery(fileName, myUrl)
End Function


' Retrieve the Amount for Balance
' Need file name, account (or groups) and and optional period
' Amount depend on the BClass indicated in the accounting plan
Public Function BAmount(account As String, Optional period As String = "") As Double
    BAmount = BAmountF(BGetFile(), account, period)
End Function
Public Function BAmountF(fileName As String, account As String, Optional period As String = "") As Double
    BAmountF = BBalanceGetF(fileName, account, "balance", "amount", period)
End Function


' Retrieve the Amount for Balance
' Need file name, account (or groups) and and optional period
Public Function BBalance(account As String, Optional period As String = "") As Double
    BBalance = BBalanceF(BGetFile(), account, period)
End Function

Public Function BBalanceF(fileName As String, account As String, Optional period As String = "") As Double
    BBalanceF = BBalanceGetF(fileName, account, "balance", "balance", period)
End Function


' Retrieve the Balance by passing also the valueName
' Need file name, account (or groups) and and optional period
Public Function BBalanceGet(account As String, cmd As String, valueName As String, Optional period As String = "") As Double
    BBalanceGet = BBalanceGetF(BGetFile(), account, cmd, valueName, period)
End Function
Public Function BBalanceGetF(fileName As String, account As String, cmd As String, valueName As String, Optional period As String = "") As Double
    Application.Volatile
    Dim myUrl As String
    Dim myQuery As String
    myUrl = cmd & "/" & account & "/" & valueName
    If Len(period) > 0 Then
        myQuery = "period=" & period
    End If
    BBalanceGetF = Val(BQuery(fileName, myUrl, myQuery))
End Function


' Retrieve the Amount for Balance
' Need file name, account (or groups) and and optional period
' Amount depend on the BClass indicated in the accounting plan
Public Function BBudgetAmount(account As String, Optional period As String = "") As Double
    BBudgetAmount = BBudgetAmountF(Range("File0").Value, account, period)
End Function

Public Function BBudgetAmountF(fileName As String, account As String, Optional period As String = "") As Double
    Application.Volatile
    BBudgetAmountF = BBalanceGetF(fileName, account, "budget", "amount", period)
End Function


' Retrieve the Budget balance
Public Function BBudgetBalance(account As String, Optional period As String = "") As Double
    BBudgetBalance = BBudgetBalanceF(Range("File0").Value, account, period)
End Function

Public Function BBudgetBalanceF(fileName As String, account As String, Optional period As String = "") As Double
    Application.Volatile
    BBudgetBalanceF = BBalanceGetF(fileName, account, "budget", "balance", period)
End Function


' Retrieve the Budget interest
Public Function BBudgetInterest(account As String, interestRate As String, Optional period As String = "")
    BBudgetInterest = BBudgetInterestF(BGetFile(), account, interestRate, period)
End Function
Public Function BBudgetInterestF(fileName As String, account As String, interestRate As String, Optional period As String = "")
    Application.Volatile
    Dim myUrl As String
    Dim myQuery As String
    myUrl = "budgetinterest/" & account
    myQuery = "rate=" & interestRate
    If Len(period) > 0 Then
        myQuery = myQuery & "&period=" & period
    End If
    BBudgetInterestF = Val(BQuery(fileName, myUrl, myQuery))
End Function


' Retrieve the Budget opening amount
Public Function BBudgetOpening(account As String, Optional period As String = "") As Double
    BBudgetOpening = BBudgetOpeningF(Range("File0").Value, account)
End Function
Public Function BBudgetOpeningF(fileName As String, account As String, Optional period As String = "") As Double
    Application.Volatile
    BBudgetOpeningF = BBalanceGetF(fileName, account, "budget", "opening", period)
End Function


' Retrieve the Budget total amount
Public Function BBudgetTotal(account As String, Optional period As String = "") As Double
    BBudgetTotal = BBudgetTotalF(Range("File0").Value, account, period)
End Function

Public Function BBudgetTotalF(fileName As String, account As String, Optional period As String = "") As Double
    Application.Volatile
    BBudgetTotalF = BBalanceGetF(fileName, account, "budget", "total", period)
End Function


'Get a value from a cell as a double
Public Function BCellAmount(table As String, rowColumn As String, column As String) As Double
    BCellAmount = Val(BCellValueF(Range("File0").Value, table, rowColumn, column))
End Function
Public Function BCellAmountF(fileName As String, table As String, rowColumn As String, column As String) As Double
    Application.Volatile
    BCellAmountF = Val(BCellValueF(fileName, table, rowColumn, column))
End Function


'Get a value from a cell
Public Function BCellValue(table As String, rowColumn As String, column As String) As String
    BCellValue = BCellValueF(Range("File0").Value, table, rowColumn, column)
End Function
Public Function BCellValueF(fileName As String, table As String, rowColumn As String, column As String) As String
    Application.Volatile
    Dim myUrl As String
    myUrl = "table/" & table & "/row/" & rowColumn & "/column/" & column
    BCellValueF = BHttpQuery(fileName, myUrl)
End Function


'Receive start end end data and convert to a Banana period
Public Function BCreatePeriod(startDate As Date, endDate As Date) As String
    BCreatePeriod = Format(startDate, "yyyy-mm-dd") & "/" & Format(endDate, "yyyy-mm-dd")
End Function


'Convert from Iso date to Excel date format
Public Function BDate(dateIso As String) As Date
    If Len(dateIso) = 10 Then
        BDate = DateSerial(Left(dateIso, 4), Mid(dateIso, 6, 2), Right(dateIso, 2))
    End If
End Function


' Retrieve the end period date
Public Function BEndPeriod(Optional period As String = "") As Date
    BEndPeriod = BEndPeriodF(Range("File0").Value, period)
End Function

Public Function BEndPeriodF(fileName As String, Optional period As String = "") As Date
    Dim dateIso As String
    dateIso = BHttpQuery(fileName, "endperiod", "period=" & period)
    If Len(dateIso) = 10 Then
        BEndPeriodF = DateSerial(Left(dateIso, 4), Mid(dateIso, 6, 2), Right(dateIso, 2))
    End If
End Function


' Retrieve the name of the Banana Accounting file
Public Function BFileName(fileName As String, Optional disableConnection As String = "") As String
    Application.Volatile
    If Not BananaIsRunning() Then
        BFileName = ""
        Exit Function
    End If

    If disableConnection <> "0" And Len(disableConnection) > 0 Then
        BFileName = ""
        Exit Function
    End If
    Dim myUrl As String
    myUrl = "info/Base/FileName"
    Dim temp As String
    temp = BHttpQuery(fileName, myUrl)
    If Len(temp) > 0 Then
        BFileName = Mid(temp, InStrRev(temp, "/") + 1)
    Else
        BFileName = ""
    End If
End Function


' Retrieve the interest
Public Function BInterest(account As String, interestRate As String, Optional period As String = "")
    BInterest = BInterestF(Range("File0").Value, account, interestRate, period)
End Function

Public Function BInterestF(fileName As String, account As String, interestRate As String, Optional period As String = "")
    Application.Volatile
    Dim myUrl As String
    Dim myQuery As String
    myUrl = "interest/" & account
    myQuery = "rate=" & interestRate
    If Not IsEmpty(period) Then
        myQuery = myQuery & "&period=" & period
    End If
    BInterestF = Val(BQuery(fileName, myUrl, myQuery))
End Function


' Retrieve the info file
Public Function BInfo(sectionXml As String, idXml As String) As String
    BInfo = BInfoF(Range("File0").Value, sectionXml, idXml)
End Function

Public Function BInfoF(fileName As String, sectionXml As String, idXml As String) As String
    Application.Volatile
    Dim myUrl As String
    myUrl = "info/" & sectionXml & "/" & idXml
    BInfoF = BHttpQuery(fileName, myUrl)
End Function


' Retrieve the last query
Public Function BLastQuery(i As Integer) As String
    If i >= 0 And i <= MAXLASTQUERY Then
        BLastQuery = lastQuery(i)
    End If
End Function


'Return opening for CurrentBalance
Public Function BOpening(account As String, Optional period As String = "") As Double
    BOpening = BOpeningF(Range("File0").Value, account, period)
End Function

Public Function BOpeningF(fileName As String, account As String, Optional period As String = "") As Double
    Application.Volatile
    BOpeningF = BBalanceGetF(fileName, account, "balance", "opening", period)
End Function


' Retrieve the start period date
Public Function BStartPeriod(Optional period As String = "") As Double
    BStartPeriod = BStartPeriodF(Range("File0").Value, period)
End Function

Public Function BStartPeriodF(fileName As String, Optional period As String = "") As Date
    Dim dateIso As String
    dateIso = BHttpQuery(fileName, "startperiod", "period=" & period)
    If Len(dateIso) = 10 Then
        BStartPeriodF = DateSerial(Left(dateIso, 4), Mid(dateIso, 6, 2), Right(dateIso, 2))
    End If
End Function


' Retrieve the total amount
Public Function BTotal(account As String, Optional period As String = "") As Double
    BTotal = BTotalF(Range("File0").Value, account, period)
End Function

Public Function BTotalF(fileName As String, account As String, Optional period As String = "") As Double
    Application.Volatile
    BTotalF = BBalanceGetF(fileName, account, "balance", "total", period)
End Function


' Retrieve the VAT balance amount
Public Function BVatBalance(vatCode As String, vatValue As String, Optional period As String = "") As Double
    BVatBalance = BVatBalanceF(Range("File0").Value, vatCode, vatValue, period)
End Function

Public Function BVatBalanceF(fileName As String, vatCode As String, vatValue As String, Optional period As String = "") As Double
    Application.Volatile
    BVatBalanceF = BBalanceGetF(fileName, vatCode, "vatbalance", vatValue, period)
End Function


' Retrieve the VAT description
Public Function BVatDescription(fileName As String, vatCode As String, Optional column As String = "") As String
    BVatDescription = BVatDescriptionF(Range("File0").Value, column)
End Function

Public Function BVatDescriptionF(fileName As String, vatCode As String, Optional column As String = "") As String
    Application.Volatile
    Dim myUrl As String
    myUrl = "vatdescription/" & vatCode
    If Len(column) > 0 Then
        myUrl = myUrl & "/" & column
    End If
    BVatDescriptionF = BHttpQuery(fileName, myUrl)
End Function


' Retrieve the query
Public Function BQuery(fileName As String, url As String, Optional query As String = "") As String
    Application.Volatile
    BQuery = BHttpQuery(fileName, url, query)
End Function




Public Sub RecalculateAll()
    'We check if the Banana process is running.
    'If so, it means that there is an opened Banana Accounting file and we can proceede.
    'Otherwise we stop the script's execution to avoid making queries.

    If Not BananaIsRunning() Then
        MsgBox "Warning: Banana is not running."
        Application.CalculateFullRebuild
        Exit Sub
    End If

#If Mac Then
        ' check on mac
        
            'First do some change to the spreadsheet
            'We create a named range and delete it
            requestNumber = requestNumber + 1
            errorCount = 0
            On Error Resume Next
            ActiveWorkbook.Names("someChanges").Delete
            ActiveWorkbook.Names.Add Name:="someChanges", RefersTo:="=XEX1048575"
            ActiveWorkbook.Names("someChanges").Delete
            'Now recalculate all
            Application.CalculateFullRebuild
#Else
    'First do some change to the spreadsheet
    'We create a named range and delete it
    requestNumber = requestNumber + 1
    errorCount = 0
    On Error Resume Next
    ActiveWorkbook.Names("someChanges").Delete
    ActiveWorkbook.Names.Add Name:="someChanges", RefersTo:="=XEX1048575"
            ActiveWorkbook.Names("someChanges").Delete

    'Now recalculate all
    Application.CalculateFullRebuild
#End If

End Sub










'-------------------------------------------------------------------------------------------------
' Banana web server call
'     Example query     =>     http://localhost:8081/v1/doc/company-2015.ac2/balance/1000/balance
'-------------------------------------------------------------------------------------------------
Private Function BHttpQuery(fileName As String, url As String, Optional query As String = "") As String

    BHttpQuery = ""

    ' we do not want to repeat the same error
    If (lastRequestNumber = requestNumber And errorCount > MAXERROR) Then
        Exit Function
    End If

    lastRequestNumber = requestNumber
    If Len(fileName) = 0 Then
        Exit Function
    End If

    ' Check if we are on MAC OS X operating system
#If Mac Then
        BHttpQuery = BHttpQueryMac(fileName, url, query)
#Else
    ' We are on Windows operating system
    BHttpQuery = BHttpQueryWindows(fileName, url, query) '
#End If

End Function

#If Mac Then
#Else
'============================================================================================================================================
' WINDOWS
'============================================================================================================================================

' Windows - We call the Banana Accounting web server using WinHttpRequest
Private Function BHttpQueryWindows(fileName As String, url As String, query As String) As String
    ' Example query
    ' http://localhost:8081/v1/doc/company-2015.ac2/balance/1000/balance
    BHttpQueryWindows = ""
    ' we do not want to repeat the same error
    If (lastRequestNumber = requestNumber And errorCount > MAXERROR) Then
        Exit Function
    End If
    lastRequestNumber = requestNumber
    If Len(fileName) = 0 Then
        Exit Function
    End If
    Dim myUrl As String
    Dim oHttp As Object
    Dim BananaHostName As String
    'retrieve optiona hostName
    On Error Resume Next
    BananaHostName = Range("BananaHostName").Value
    If Len(BananaHostName) = 0 Then
        BananaHostName = "localhost:8081"
    End If

    On Error Resume Next
    Set oHttp = CreateObject("WinHttp.WinHttpRequest.5.1")
    If Err.Number > 0 Then
        MsgBox "Could not create object 'WinHttp.WinHttpRequest.5.1'"
        errorCount = errorCount + 1
        Exit Function
    End If
    myUrl = "http://" & BananaHostName & "/v1/doc/" & fileName & "/" & url & "?" & query
    ' save last query for debug purpose
    Dim i As Integer
    For i = 0 To (MAXLASTQUERY - 1)
        lastQuery(i) = lastQuery(i + 1)
    Next i
    lastQuery(MAXLASTQUERY) = myUrl
    oHttp.Open "POST", myUrl, False
    On Error Resume Next
    oHttp.send
    If Err.Number = 0 Then
        If oHttp.Status < 300 Then
            errorCount = 0
            BHttpQueryWindows = oHttp.responseText
            '' result of query not correct query
            If Left(BHttpQueryWindows, 6) = "<html " Then
                BHttpQueryWindows = ""
            End If
        Else
            errorCount = errorCount + 1
            '
        End If
    Else
        errorCount = errorCount + 1
    End If
End Function


Private Function BananaIsRunning() As Boolean
#If Mac Then
    BananaIsRunning = True
#Else
    BananaIsRunning = BananaIsRunningWindows()
#End If
End Function



Private Function BananaIsRunningWindows() As Boolean

    BananaIsRunningWindows = False

    'Banana 8 process
    Dim banana80 As String
    banana80 = "Banana80.EXE"

    'Banana Experimental 8 process
    Dim bananaExpm80 As String
    bananaExpm80 = "BananaExpm80.EXE"

    'Banana 9 process
    Dim banana90 As String
    banana90 = "Banana90.EXE"

    'Banana Experimental 9 process
    Dim bananaExpm90 As String
    bananaExpm90 = "BananaExpm90.EXE"
    
    'Check if any Banana 8 process is running
    If (isProcessRunningWindows(bananaExpm80) Or isProcessRunningWindows(banana80) Or isProcessRunningWindows(bananaExpm90) Or isProcessRunningWindows(banana90)) Then
        BananaIsRunningWindows = True
    End If

End Function


Function isProcessRunningWindows(process As String) As Boolean
    Dim objList As Object

    Set objList = GetObject("winmgmts:") _
        .ExecQuery("select * from win32_process where name='" & process & "'")

    If objList.Count > 0 Then
        isProcessRunningWindows = True
    Else
        isProcessRunningWindows = False
    End If
End Function


#End If


#If Mac Then

'============================================================================================================================================
' MAC OS X
'============================================================================================================================================

' MAC OS X - We call the Banana Accounting web server using execShellMac function to call curl
Private Function BHttpQueryMac(fileName As String, url As String, query As String) As String

    BHttpQueryMac = ""

    ' we do not want to repeat the same error
    If (lastRequestNumber = requestNumber And errorCount > MAXERROR) Then
        Exit Function
    End If
    lastRequestNumber = requestNumber
    If Len(fileName) = 0 Then
        Exit Function
    End If

    Dim myUrl As String
    Dim oHttp As String

    Dim BananaHostName As String
    'retrieve optiona hostName
    On Error Resume Next
    BananaHostName = Range("BananaHostName").Value
    If Len(BananaHostName) = 0 Then
        BananaHostName = "localhost:8081"
    End If

    myUrl = "http://" & BananaHostName & "/v1/doc/" & fileName & "/" & url & "?" & query

    ' save last query for debug purpose
    Dim i As Integer
    For i = 0 To (MAXLASTQUERY - 1)
        lastQuery(i) = lastQuery(i + 1)
    Next i
    lastQuery(MAXLASTQUERY) = myUrl

    oHttp = HTTPGetMac(myUrl, query)

    If Len(oHttp) > 0 Then
        BHttpQueryMac = oHttp
    End If

End Function


' execShell() function courtesy of Robert Knight via StackOverflow
' http://stackoverflow.com/questions/6136798/vba-shell-function-in-office-2011-for-mac
Function execShellMac(command As String, Optional ByRef exitCode As Long) As String

    Dim file As Long
    file = popen(command, "r")

    If file = 0 Then
        Exit Function
    End If

    While feof(file) = 0
        Dim chunk As String
        Dim read As Long
        chunk = Space(50)
        read = fread(chunk, 1, Len(chunk) - 1, file)
        If read > 0 Then
            chunk = Left$(chunk, read)
            execShellMac = execShellMac & chunk
        End If
    Wend

    exitCode = pclose(file)

End Function


Function HTTPGetMac(sUrl As String, sQuery As String) As String

    Dim sCmd As String
    Dim sResult As String
    Dim lExitCode As Long

    sCmd = "curl --get -d """ & sQuery & """" & " " & sUrl
    sResult = execShellMac(sCmd, lExitCode)

    ' ToDo check lExitCode

    HTTPGetMac = sResult

End Function

#End If







