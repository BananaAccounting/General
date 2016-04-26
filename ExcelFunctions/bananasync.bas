' Copyright (C) 2015-2016 Banana.ch SA
'
' Licensed under the Apache License, Version 2.0 (the "License");
' you may not use this file except in compliance with the License.
' You may obtain a copy of the License at
'' Copyright (C) 2015 Banana.ch SA
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
' History
' 2015-11-28 Separated url from query
' 2016-04-25 Added BCellAmount
'

Option Explicit
'Save lastQuery for debug purposes
Const MAXLASTQUERY = 10
Dim lastQuery(0 To MAXLASTQUERY) As String
'Reset in
' To avoid continuing error, maybe there is a better solution
Const MAXERROR = 5
Dim requestNumber As Integer
Dim lastRequestNumber As Integer
Dim errorCount As Integer
'Return the version date
Public Function BFunctionsVersion() As String
BFunctionsVersion = "2015-04-26"
End Function
Public Function BAccountDescription(fileName As String, account As String, Optional column As String = "") As String
Application.Volatile
Dim myUrl As String
myUrl = "accountdescription/" & account
If Len(column) > 0 Then
    myUrl = myUrl & "/" & column
    End If
BAccountDescription = BHttpQuery(fileName, myUrl)
End Function
Public Function BAmount(fileName As String, account As String, Optional period As String = "") As Double
' Retrieve the Amount for Balance
' Need file name, account (or groups) and and optional period
' Amount depend on the BClass indicated in the accounting plan
Application.Volatile
BAmount = Val(BBalanceGet(fileName, account, "balance", "amount", period))
End Function
Public Function BBalance(fileName As String, account As String, Optional period As String = "") As Double
' Retrieve the Amount for Balance
' Need file name, account (or groups) and and optional period
Application.Volatile
BBalance = Val(BBalanceGet(fileName, account, "balance", "balance", period))
End Function
' Retrieve the Balance by passing also the valueName
' Need file name, account (or groups) and and optional period
Public Function BBalanceGet(fileName As String, account As String, cmd As String, valueName As String, Optional period As String = "") As Double
Application.Volatile
Dim myUrl As String
Dim myQuery As String
myUrl = cmd & "/" & account & "/" & valueName
If Len(period) > 0 Then
    myQuery = "period=" & period
    End If
BBalanceGet = Val(BQuery(fileName, myUrl, myQuery))
End Function
Public Function BBudgetAmount(fileName As String, account As String, Optional period As String = "") As Double
' Retrieve the Amount for Balance
' Need file name, account (or groups) and and optional period
' Amount depend on the BClass indicated in the accounting plan
Application.Volatile
BBudgetAmount = Val(BBalanceGet(fileName, account, "budget", "amount", period))
End Function
Public Function BBudgetBalance(fileName As String, account As String, Optional period As String = "") As Double
Application.Volatile
BBudgetBalance = Val(BBalanceGet(fileName, account, "budget", "balance", period))
End Function
Public Function BBudgetInterest(fileName As String, account As String, interestRate As String, Optional period As String = "")
Application.Volatile
Dim myUrl As String
Dim myQuery As String
myUrl = "budgetinterest/" & account
myQuery = "rate=" & interestRate
If Len(period) > 0 Then
    myQuery = myQuery & "&period=" & period
    End If
BBudgetInterest = Val(BQuery(fileName, myUrl))
End Function
Public Function BBudgetOpening(fileName As String, account As String, Optional period As String = "") As Double
Application.Volatile
BBudgetOpening = Val(BBalanceGet(fileName, account, "budget", "opening", period))
End Function
Public Function BBudgetTotal(fileName As String, account As String, Optional period As String = "") As Double
Application.Volatile
BBudgetTotal = Val(BBalanceGet(fileName, account, "budget", "total", period))
End Function
'Get a value from a cell as a double
Public Function BCellAmount(fileName As String, table As String, rowColumn As String, column As String) As Double
Application.Volatile
BCellAmount = Val(BCellValue(fileName, table, rowColumn, column))
End Function
'Get a value from a cell
Public Function BCellValue(fileName As String, table As String, rowColumn As String, column As String) As String
Application.Volatile
Dim myUrl As String
myUrl = "table/" & table & "/row/" & rowColumn & "/column/" & column
BCellValue = BHttpQuery(fileName, myUrl)
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
Public Function BEndPeriod(fileName As String, Optional period As String = "") As Date
Dim dateIso As String
dateIso = BHttpQuery(fileName, "endperiod", "period=" & period)
If Len(dateIso) = 10 Then
    BEndPeriod = DateSerial(Left(dateIso, 4), Mid(dateIso, 6, 2), Right(dateIso, 2))
    End If
End Function

Public Function BFileName(fileName As String, Optional disableConnection As String = "") As String
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
Public Function BInterest(fileName As String, account As String, interestRate As String, Optional period As String = "")
Application.Volatile
Dim myUrl As String
Dim myQuery As String
myUrl = "interest/" & account
myQuery = "rate=" & interestRate
If Not IsEmpty(period) Then
    myQuery = myQuery & "&period=" & period
    End If
BInterest = Val(BQuery(fileName, myUrl, myQuery))

End Function
Public Function BInfo(fileName As String, sectionXml As String, idXml As String) As String
Application.Volatile
Dim myUrl As String
myUrl = "info/" & sectionXml & "/" & idXml
BInfo = BHttpQuery(fileName, myUrl)
End Function
Public Function BLastQuery(i As Integer) As String
If i >= 0 And i <= MAXLASTQUERY Then
    BLastQuery = lastQuery(i)
End If
End Function
'Return opening for CurrentBalance
Public Function BOpening(fileName As String, account As String, Optional period As String = "") As Double
Application.Volatile
BOpening = Val(BBalanceGet(fileName, account, "balance", "opening", period))
End Function
Public Function BStartPeriod(fileName As String, Optional period As String = "") As Date
Dim dateIso As String
dateIso = BHttpQuery(fileName, "startperiod", "period=" & period)
If Len(dateIso) = 10 Then
    BStartPeriod = DateSerial(Left(dateIso, 4), Mid(dateIso, 6, 2), Right(dateIso, 2))
    End If
End Function
Public Function BTotal(fileName As String, account As String, Optional period As String = "") As Double
Application.Volatile
BTotal = Val(BBalanceGet(fileName, account, "balance", "total", period))
End Function
Public Function BVatBalance(fileName As String, vatCode As String, vatValue As String, Optional period As String = "") As Double
Application.Volatile
BVatBalance = Val(BBalanceGet(fileName, vatCode, "vatbalance", vatValue, period))
End Function
Public Function BVatDescription(fileName As String, vatCode As String, Optional column As String = "") As String
Application.Volatile
Dim myUrl As String
myUrl = "vatdescription/" & vatCode
If Len(column) > 0 Then
    myUrl = myUrl & "/" & column
    End If
BVatDescription = BHttpQuery(fileName, myUrl)
End Function

Public Function BQuery(fileName As String, url As String, Optional query As String = "") As String
Application.Volatile
BQuery = BHttpQuery(fileName, url, query)
End Function
Public Sub RecalculateAll()
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
End Sub
'We call the Banana Accounting web server
Private Function BHttpQuery(fileName As String, url As String, Optional query As String = "") As String
' Example query
' http://localhost:8081/v1/doc/company-2015.ac2/balance/1000/balance
BHttpQuery = ""
' we do not want to repeat the same error
If (lastRequestNumber = requestNumber And errorCount > MAXERROR) Then
    Exit Function
End If
lastRequestNumber = requestNumber
If Len(fileName) = 0 Then
    Exit Function
End If
Dim oHttp As Object
Err.Number = 0
On Error Resume Next
'for MAC remove comment
'Set oHttp = CreateObject("WinHttp.WinHttpRequest.5.1")
If Err.Number > 0 Then
    BHttpQuery = BHttpQuery_Mac(fileName, url, query)
    Exit Function
End If
BHttpQuery = BHttpQueryWindows(fileName, url, query)
End Function
'Windows We call the Banana Accounting web server using WinHttpRequest
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

'We call the Banana Accounting web server
Private Function BHttpQuery_Mac(fileName As String, url As String, query As String) As String
' Example query
' http://localhost:8081/v1/doc/company-2015.ac2/balance/1000/balance
BHttpQuery_Mac = ""
' we do not want to repeat the same error
If (lastRequestNumber = requestNumber And errorCount > MAXERROR) Then
    Exit Function
End If
lastRequestNumber = requestNumber
If Len(fileName) = 0 Then
    Exit Function
End If
'MsgBox "MAC not supported"
'Exit Function
Dim myUrl As String
Dim BananaHostName As String
'retrieve optiona hostName
On Error Resume Next
BananaHostName = Range("BananaHostName").Value
If Len(BananaHostName) = 0 Then
    BananaHostName = "localhost:8081"
End If
Dim src As Worksheet
Set src = ThisWorkbook.Sheets("Start")
src.Range("$A$50").Value = ""
myUrl = "http://" & BananaHostName & "/v1/doc/" & fileName & "/" & url & "?" & query
' save last query for debug purpose
Dim qt As QueryTable
Dim count As Integer
While src.QueryTables.count > 0
    src.QueryTables(1).Delete
Wend
Err.Number = 0
Set qt = src.QueryTables.Add(Connection:="URL;" & myUrl, Destination:=src.Range("$A$50"))
With qt
    .BackgroundQuery = True
    .TablesOnlyFromHTML = True
    .SaveData = True
    .BackgroundQuery = False
End With
On Error Resume Next
qt.Refresh
If Err.Number = 0 Then
    BHttpQuery_Mac = src.Range("$A$50").Value
End If
End Function

'Private Declare Function popen Lib "libc.dylib" (ByVal command As String, ByVal mode As String) As Long
'Private Declare Function pclose Lib "libc.dylib" (ByVal file As Long) As Long
'Private Declare Function fread Lib "libc.dylib" (ByVal outStr As String, ByVal size As Long, ByVal items As Long, ByVal stream As Long) As Long
'Private Declare Function feof Lib "libc.dylib" (ByVal file As Long) As Long
Function execShell_Mac(command As String, Optional ByRef exitCode As Long) As String
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
        execShell_Mac = execShell_Mac & chunk
    End If
Wend

exitCode = pclose(file)
End Function

Function getHTTP_Mac(sUrl As String, sQuery As String) As String

Dim sCmd As String
Dim sResult As String
Dim lExitCode As Long

sCmd = "curl --get -d """ & sQuery & """" & " " & sUrl
sResult = execShell_Mac(sCmd, lExitCode)

' ToDo check lExitCode

getHTTP_Mac = sResult

End Function

'Not working and not used
'It vould be interesting to check if Banana is running
'In case is not runninn to avoid making queries
Private Function BananaIsRunning() As Boolean
On Error Resume Next
    ' GetObject called without the first argument returns a
    ' reference to an instance of the application. If the
    ' application is not already running, an error occurs.
    Dim bananaObj As Object
    bananaObj = GetObject("", "Banana")
    If Err.Number = 0 Then
    BananaIsRunning = True
    Else
    BananaIsRunning = False
    End If
End Function



             



