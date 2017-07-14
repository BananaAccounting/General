// Copyright [2016] [Banana.ch SA - Lugano Switzerland]
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
// @id = import_transaction_segments_opening
// @api = 1.0
// @pubdate = 2017-07-014
// @publisher = Banana.ch SA
// @description = Import Transaction with segments
// @task = import.transactions
// @doctype = 100.*; 110.*; 130.*
// @docproperties = 
// @outputformat = transactions.double
// @inputdatasource = 
// @timeout = -1


/**
	This app allows to extract from the previous year ac2 file all the segments balances,
	and use them to create the opening transactions on the current year ac2 file.
*/



//Main function
function exec(inData) {

	//Check if we are on an opened document
	if (!Banana.document) { return; }

	//Check if the tables exist: if not, the script's execution will stop
	if (!Banana.document.table('Accounts')) { 
		return; 
	}
	if (!Banana.document.table('Transactions')) { 
		return; 
	}
	var year = Banana.Converter.toDate(Banana.document.info("AccountingDataBase","OpeningDate")).getFullYear();

	//Open a dialog window asking the user to select the previous year ac2 file
	var previousYearFile = Banana.application.openDocument("*.*");
	if(!previousYearFile){
		return;
	}
	else {
		//Check if the tables exist: if not, the script's execution will stop
		if (!previousYearFile.table('Accounts')) { 
			return; 
		}
		if (!previousYearFile.table('Transactions')) { 
			return; 
		}


		//We take the dates from Banana document
		var startDate = Banana.Converter.toDate(previousYearFile.info("AccountingDataBase","OpeningDate"));
		var endDate = Banana.Converter.toDate(previousYearFile.info("AccountingDataBase","ClosureDate"));

		var accounts = getAccounts(previousYearFile);
		var segment1 = []; //accounts for segment level 1
		var segment2 = []; //accounts for segment level 2 
		var segment3 = []; //accounts for segment level 3 
		var segment4 = []; //accounts for segment level 4 
		var segment5 = []; //accounts for segment level 5 
		var segment6 = []; //accounts for segment level 6 
		var segment7 = []; //accounts for segment level 7 
		var segment8 = []; //accounts for segment level 8 
		var segment9 = []; //accounts for segment level 9 
		var segment10 = []; //accounts for segment level 10 

		//Function call to get and save all segments accounts for each level
		getSegments(previousYearFile, segment1, segment2, segment3, segment4, segment5, segment6, segment7, segment8, segment9, segment10);

		var segLv1 = segment1.length;
		var segLv2 = segment2.length;
		var segLv3 = segment3.length;
		var segLv4 = segment4.length;
		var segLv5 = segment5.length;
		var segLv6 = segment6.length;
		var segLv7 = segment7.length;
		var segLv8 = segment8.length;
		var segLv9 = segment9.length;
		var segLv10 = segment10.length;
		
		var outText = "Date\tDocType\tDescription\tAccountDebit\tAccountCredit\tAmount\n";

		var accountLength = accounts.length;
		for (var i = 0; i < accountLength; i++) {
			var account = accounts[i];
			var date = year + "-01-01";
			var doctype = "01";
			var description = "Segment transaction";
		
			//For each element of segment 1...
			for (var s1 = 0; s1 < segLv1; s1++) {
				var currentBalSegment1 = previousYearFile.currentBalance(account + segment1[s1]);
				var endBalSegment1 = currentBalSegment1.balance;
				if (endBalSegment1) {
					//Banana.console.log(account + segment1[s1] + " = " + endBalSegment1);
					if (endBalSegment1 > 0) {
						outText += date +"\t" + doctype + "\t" + description + "\t"+ account + segment1[s1] +"\t"+ account + "\t"+ Banana.Converter.toInternalNumberFormat(endBalSegment1, ".") +"\n";
					} else {
						outText += date +"\t" + doctype + "\t" + description + "\t"+ account + "\t" + account + segment1[s1] + "\t" + Banana.Converter.toInternalNumberFormat(endBalSegment1, ".") +"\n";
					}

					//For each element of segment 2...
					for (var s2 = 0; s2 < segLv2; s2++) {
						var currentBalSegment2 = previousYearFile.currentBalance(account + segment1[s1] + segment2[s2]);
						var endBalSegment2 = currentBalSegment2.balance;
						if (endBalSegment2) {
							//Banana.console.log(account + segment1[s1] + segment2[s2] + " = " + endBalSegment2);
							if (endBalSegment2 > 0) {
								outText += date +"\t" + doctype + "\t" + description + "\t"+ account + segment1[s1] + segment2[s2] +"\t"+ account + "\t"+ Banana.Converter.toInternalNumberFormat(endBalSegment2, ".") +"\n";
							} else {
								outText += date +"\t" + doctype + "\t" + description + "\t"+ account + "\t" + account + segment1[s1] + segment2[s2] + "\t" + Banana.Converter.toInternalNumberFormat(endBalSegment2, ".") +"\n";
							}
						
							//For each element of segment 3...
							for (var s3 = 0; s3 < segLv3; s3++) {
								var currentBalSegment3 = previousYearFile.currentBalance(account + segment1[s1] + segment2[s2] + segment3[s3]);
								var endBalSegment3 = currentBalSegment3.balance;
								if (endBalSegment3) {
									//Banana.console.log(account + segment1[s1] + segment2[s2] + segment3[s3] + " = " + endBalSegment3);
									if (endBalSegment3 > 0) {
										outText += date +"\t" + doctype + "\t" + description + "\t"+ account + segment1[s1] + segment2[s2] + segment3[s3] +"\t"+ account + "\t"+ Banana.Converter.toInternalNumberFormat(endBalSegment3, ".") +"\n";
									} else {
										outText += date +"\t" + doctype + "\t" + description + "\t"+ account + "\t" + account + segment1[s1] + segment2[s2] + segment3[s3] + "\t" + Banana.Converter.toInternalNumberFormat(endBalSegment3, ".") +"\n";
									}

									//For each element of segment 4...
									for (var s4 = 0; s4 < segLv4; s4++) {
										var currentBalSegment4 = previousYearFile.currentBalance(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4]);
										var endBalSegment4 = currentBalSegment4.balance;
										if (endBalSegment4) {
											//Banana.console.log(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + " = " + endBalSegment4);
											if (endBalSegment4 > 0) {
												outText += date +"\t" + doctype + "\t" + description + "\t"+ account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] +"\t"+ account + "\t"+ Banana.Converter.toInternalNumberFormat(endBalSegment4, ".") +"\n";
											} else {
												outText += date +"\t" + doctype + "\t" + description + "\t"+ account + "\t" + account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + "\t" + Banana.Converter.toInternalNumberFormat(endBalSegment4, ".") +"\n";
											}

											//For each element of segment 5...
											for (var s5 = 0; s5 < segLv5; s5++) {
												var currentBalSegment5 = previousYearFile.currentBalance(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5]);
												var endBalSegment5 = currentBalSegment5.balance;
												if (endBalSegment5) {
													//Banana.console.log(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + " = " + endBalSegment5);
													if (endBalSegment5 > 0) {
														outText += date +"\t" + doctype + "\t" + description + "\t"+ account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] +"\t"+ account + "\t"+ Banana.Converter.toInternalNumberFormat(endBalSegment5, ".") +"\n";
													} else {
														outText += date +"\t" + doctype + "\t" + description + "\t"+ account + "\t" + account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + "\t" + Banana.Converter.toInternalNumberFormat(endBalSegment5, ".") +"\n";
													}

													//For each element of segment 6...
													for (var s6 = 0; s6 < segLv6; s6++) {
														var currentBalSegment6 = previousYearFile.currentBalance(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6]);
														var endBalSegment6 = currentBalSegment6.balance;
														if (endBalSegment6) {
															//Banana.console.log(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + " = " + endBalSegment6);
															if (endBalSegment6 > 0) {
																outText += date +"\t" + doctype + "\t" + description + "\t"+ account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] +"\t"+ account + "\t"+ Banana.Converter.toInternalNumberFormat(endBalSegment6, ".") +"\n";
															} else {
																outText += date +"\t" + doctype + "\t" + description + "\t"+ account + "\t" + account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + "\t" + Banana.Converter.toInternalNumberFormat(endBalSegment6, ".") +"\n";
															}

															//For each element of segment 7...
															for (var s7 = 0; s7 < segLv7; s7++) {
																var currentBalSegment7 = previousYearFile.currentBalance(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7]);
																var endBalSegment7 = currentBalSegment7.balance;
																if (endBalSegment7) {
																	//Banana.console.log(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + " = " + endBalSegment7);
																	if (endBalSegment7 > 0) {
																		outText += date +"\t" + doctype + "\t" + description + "\t"+ account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] +"\t"+ account + "\t"+ Banana.Converter.toInternalNumberFormat(endBalSegment7, ".") +"\n";
																	} else {
																		outText += date +"\t" + doctype + "\t" + description + "\t"+ account + "\t" + account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + "\t" + Banana.Converter.toInternalNumberFormat(endBalSegment7, ".") +"\n";
																	}

																	//For each element of segment 8...
																	for (var s8 = 0; s8 < segLv8; s8++) {
																		var currentBalSegment8 = previousYearFile.currentBalance(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8]);
																		var endBalSegment8 = currentBalSegment8.balance;
																		if (endBalSegment8) {
																			//Banana.console.log(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] + " = " + endBalSegment8);
																			if (endBalSegment8 > 0) {
																				outText += date +"\t" + doctype + "\t" + description + "\t"+ account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] +"\t"+ account + "\t"+ Banana.Converter.toInternalNumberFormat(endBalSegment8, ".") +"\n";
																			} else {
																				outText += date +"\t" + doctype + "\t" + description + "\t"+ account + "\t" + account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] + "\t" + Banana.Converter.toInternalNumberFormat(endBalSegment8, ".") +"\n";
																			}

																			//For each element of segment 9...
																			for (var s9 = 0; s9 < segLv9; s9++) {
																				var currentBalSegment9 = previousYearFile.currentBalance(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] + segment9[s9]);
																				var endBalSegment9 = currentBalSegment9.balance;
																				if (endBalSegment9) {
																					//Banana.console.log(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] + segment9[s9] + " = " + endBalSegment9);
																					if (endBalSegment9 > 0) {
																						outText += date +"\t" + doctype + "\t" + description + "\t"+ account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] + segment9[s9] +"\t"+ account + "\t"+ Banana.Converter.toInternalNumberFormat(endBalSegment9, ".") +"\n";
																					} else {
																						outText += date +"\t" + doctype + "\t" + description + "\t"+ account + "\t" + account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] + segment9[s9] + "\t" + Banana.Converter.toInternalNumberFormat(endBalSegment9, ".") +"\n";
																					}

																					//For each element of segment 10...
																					for (var s10 = 0; s10 < segLv10; s10++) {
																						var currentBalSegment10 = previousYearFile.currentBalance(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] + segment9[s9] + segment10[s10]);
																						var endBalSegment10 = currentBalSegment10.balance;
																						if (endBalSegment10) {
																							//Banana.console.log(account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] + segment9[s9] + segment10[s10] + " = " + endBalSegment10);
																							if (endBalSegment10 > 0) {
																								outText += date +"\t" + doctype + "\t" + description + "\t"+ account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] + segment9[s9] + segment10[s10] +"\t"+ account + "\t"+ Banana.Converter.toInternalNumberFormat(endBalSegment10, ".") +"\n";
																							} else {
																								outText += date +"\t" + doctype + "\t" + description + "\t"+ account + "\t" + account + segment1[s1] + segment2[s2] + segment3[s3] + segment4[s4] + segment5[s5] + segment6[s6] + segment7[s7] + segment8[s8] + segment9[s9] + segment10[s10] + "\t" + Banana.Converter.toInternalNumberFormat(endBalSegment10, ".") +"\n";
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		} //accounts
		
		return outText;
	}
}



//The function creates for each segments level an array containing all the segments codes
function getSegments(banDoc, segment1, segment2, segment3, segment4, segment5, segment6, segment7, segment8, segment9, segment10) {

	//Access to the Banana document table "Accounts"
	var accountsTable = banDoc.table("Accounts");

	//We read row by row the table and we save only the data needed for each segment
	var accountsTableRow = accountsTable.rowCount;
	for (var i = 0; i < accountsTableRow; i++) {
		
		var tRow = accountsTable.row(i);
		var account = tRow.value("Account");

		//Segment 1, start with ":"
		if (account.substring(0,1) == ":" && account.substring(1,2) !== ":" && account.substring(1,2) !== "") { // :xxx
			segment1.push(account);
		}
		
		//Segment 2, start with "::"
		if (account.substring(0,2) == "::" && account.substring(2,3) !== ":" && account.substring(2,3) !== "") { // ::xxx
			segment2.push(account.substring(1)); //take only account without ":"
		}
		
		//Segment 3, start with ":::"
		if (account.substring(0,3) == ":::" && account.substring(3,4) !== ":" && account.substring(3,4) !== "") { // :::xxx
			segment3.push(account.substring(2)); //take only account without ":"
		}
		
		//Segment 4, start with ":::"
		if (account.substring(0,4) == "::::" && account.substring(4,5) !== ":" && account.substring(4,5) !== "") { // :::xxx
			segment4.push(account.substring(3)); //take only account without ":"
		}

		//Segment 5, start with ":::"
		if (account.substring(0,5) == ":::::" && account.substring(5,6) !== ":" && account.substring(5,6) !== "") { // :::xxx
			segment5.push(account.substring(4)); //take only account without ":"
		}

		//Segment 6, start with ":::"
		if (account.substring(0,6) == "::::::" && account.substring(6,7) !== ":" && account.substring(6,7) !== "") { // :::xxx
			segment6.push(account.substring(5)); //take only account without ":"
		}

		//Segment 7, start with ":::"
		if (account.substring(0,7) == ":::::::" && account.substring(7,8) !== ":" && account.substring(7,8) !== "") { // :::xxx
			segment7.push(account.substring(6)); //take only account without ":"
		}

		//Segment 8, start with ":::"
		if (account.substring(0,8) == "::::::::" && account.substring(8,9) !== ":" && account.substring(8,9) !== "") { // :::xxx
			segment8.push(account.substring(7)); //take only account without ":"
		}

		//Segment 9, start with ":::"
		if (account.substring(0,9) == ":::::::::" && account.substring(9,10) !== ":" && account.substring(9,10) !== "") { // :::xxx
			segment9.push(account.substring(8)); //take only account without ":"
		}

		//Segment 10, start with ":::"
		if (account.substring(0,10) == "::::::::::" && account.substring(10,11) !== ":" && account.substring(10,11) !== "") { // :::xxx
			segment10.push(account.substring(9)); //take only account without ":"
		}
	}
}




//Function that creates a list with all the account
function getAccounts(banDoc) {

	var accountsTable = banDoc.table("Accounts");
	var accountsTableRows = accountsTable.rowCount;
	var accounts = [];

	for (var i = 0; i < accountsTableRows; i++) {
		
		var tRow = accountsTable.row(i);
		var account = tRow.value("Account");
		if (account && account.substring(0,1) !== "." && account.substring(0,1) !== "," && account.substring(0,1) !== ";" && account.substring(0,1) !== ":") {
			accounts.push(account);
		}
	}
	return accounts;
}


