' Copyright (C) 2015 Banana.ch SA
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
' File is available onn
Option Explicit
'Save lastQuery for debug purposes
Const MAXLASTQUERY = 10
Dim lastQuery(0 To MAXLASTQUERY) As String

Public Function BFunctionsVersion() As String
BFunctionsVersion = "2015-10-06"
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
myUrl = cmd & "/" & account & "/" & valueName
If Not IsEmpty(period) Then
    myUrl = myUrl & "?period=" & period
    End If
BBalanceGet = Val(BQuery(fileName, myUrl))
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
myUrl = "budgetinterest/" & account & "?rate=" & interestRate
If Not IsEmpty(period) Then
    myUrl = myUrl & "&period=" & period
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
'Receive start end end data and convert to a Banana period
Public Function BCreatePeriod(startDate As Date, endDate As Date) As String
BCreatePeriod = Format(startDate, "yyyy-mm-dd") & "/" & Format(endDate, "yyyy-mm-dd")
End Function
'Get a value from a cell
Public Function BCellValue(fileName As String, table As String, rowColumn As String, column As String) As String
Application.Volatile
Dim myUrl As String
myUrl = "table/" & table & "/row/" & rowColumn & "/column/" & column
BCellValue = BHttpQuery(fileName, myUrl)
End Function
'Convert from Iso date to Excel date format
Public Function BDate(dateIso As String) As Date
If Len(dateIso) = 10 Then
    BDate = DateSerial(Left(dateIso, 4), Mid(dateIso, 6, 2), Right(dateIso, 2))
    End If
End Function
Public Function BEndPeriod(fileName As String, Optional period As String = "") As Date
Dim dateIso As String
dateIso = BHttpQuery(fileName, "endperiod?period=" & period)
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
If temp <> "" Then
    BFileName = Mid(temp, InStrRev(temp, "/") + 1)
Else
    BFileName = ""
End If
End Function
Public Function BInterest(fileName As String, account As String, interestRate As String, Optional period As String = "")
Application.Volatile
Dim myUrl As String
myUrl = "interest/" & account & "?rate=" & interestRate
If Not IsEmpty(period) Then
    myUrl = myUrl & "&period=" & period
    End If
BInterest = Val(BQuery(fileName, myUrl))

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
dateIso = BHttpQuery(fileName, "startperiod?period=" & period)
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

Public Function BQuery(fileName As String, query As String) As String
Application.Volatile
BQuery = BHttpQuery(fileName, query)
End Function
Public Sub RecalculateAll()
'First do some change to the spreadsheet
'We create a named range and delete it
On Error Resume Next
ActiveWorkbook.Names("someChanges").Delete
ActiveWorkbook.Names.Add Name:="someChanges", RefersTo:="=XEX1048575"
ActiveWorkbook.Names("someChanges").Delete
'Now recalculate all
Application.CalculateFullRebuild
End Sub
'We call the Banana Accounting web server
Private Function BHttpQuery(fileName As String, query As String) As String
' Example query
' http://localhost:8081/v1/doc/company-2015.ac2/balance/1000/balance
If fileName = "" Then
    Exit Function
End If
Dim myUrl As String
Dim oHttp As Object
Dim BananaHostName As String
'retrieve optiona hostName
On Error Resume Next
BananaHostName = Range("BananaHostName").Value
If BananaHostName = "" Then
    BananaHostName = "localhost:8081"
End If
Set oHttp = CreateObject("WinHttp.WinHttpRequest.5.1")
myUrl = "http://" & BananaHostName & "/v1/doc/" & fileName & "/" & query
' save last query for debug purpose
Dim i As Integer
For i = 0 To (MAXLASTQUERY - 1)
    lastQuery(i) = lastQuery(i + 1)
Next i
lastQuery(MAXLASTQUERY) = myUrl
oHttp.Open "GET", myUrl, False
On Error Resume Next
oHttp.send
If Err.Number = 0 Then
    If oHttp.Status < 300 Then
        BHttpQuery = oHttp.responseText
        '' result of query not correct query
        If Left(BHttpQuery, 6) = "<html " Then
            BHttpQuery = ""
        End If
    Else
    '
    End If
End If
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






