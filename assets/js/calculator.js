// Commerce Title - Mortagage Calculator
// Developer: Adam Culpepper

$(function() {
	var env = location.href;
	var isProd = env.includes('commercetitle.com');
	var settlementFee = 0;
	var abstractFee = 0;
	var documentPreperation = 0;
	var transactionType = '';
	var salesPrice = 0;
	var loanAmount = 0;
	var salesPriceRoundedToNearestThousand = 0;
	var loanAmountRoundedToNearestThousand = 0;
	var propertyParish = '';

	$('#updatable-inputs').on('change', 'input, select', function(e) {
		if ($('#loan-amount').val() == '') {
			$('#loan-amount').val(0);
		}
		
		if ($('#sales-price').val() && $('#loan-amount').val()) {
			updateValues();
		}

		$('.parish-selected').text($('#property-parish option:selected').text());
	});

	function decimalCleaner(input) {
		return parseFloat(input.toFixed(2));
	}

	function currencyFormatter(input) {
		if (!input.includes('Included')) {
			return '<span class="number"><span class="symbol">$</span>' + parseFloat(input).toFixed(2) + '</span>';
		}
	}

	function numberCleaner() {
		setTimeout(function() {
			var textValue;
			var maxWidth = 0;
			var thisWidth = 0;
			$('.value').each(function() {
				textValue = $(this).text();
				if (textValue != 'N/A') {
					$(this).html(currencyFormatter(textValue));
				}
				//$(this).css({'background': 'lightblue'});

				// thisWidth = $(this).find('.number').width() + 1;
				// if (thisWidth > maxWidth) {
				// 	maxWidth = thisWidth;
				// }
			});
			//$('.value').find('.number').width(maxWidth);
		}, 0);
	}

	updateValues();

	function updateValues() {
		function initValues() {
			transactionType = $('#transaction-type').val();
			salesPrice = parseInt($('#sales-price').val());
			loanAmount = parseInt($('#loan-amount').val());
			salesPriceRoundedToNearestThousand = Math.ceil(salesPrice / 1000) * 1000; //rounded to the nearest thousand
			loanAmountRoundedToNearestThousand = Math.ceil(loanAmount / 1000) * 1000; //rounded to the nearest thousand
			propertyParish = $('#property-parish').val();

			if (transactionType == 'refinance') {
				$('#label-sales-price-or-current-payoff').text('Current Payoff');
			} else {
				$('#label-sales-price-or-current-payoff').text('Sales Price');
			}

			if (transactionType == 'cash') {
				$('#loan-amount').val('0');
				$('#loan-amount').prop('disabled', true);
			} else {
				$('#loan-amount').prop('disabled', false);
			}

			matrixTitleInsurance();
			titleServices();
			titleInsurance();
			recordingFees();
			totalTitleFees();
			estimatedPropertyTaxes();
		}

		var miscValues = [];

		var matrixTitleInsurance = function() {
			var salesPriceTotalsArray = [];
			var loanAmountTotalsArray = [];

			function arrayBuilder(price, type) {
				if (!isProd) {
					console.warn(type + ': ' + price);
				}
				var tempArray = [];
				var loopFrom, loopTo, loopMPol, loopOPol, loopMmm, loopOmm, loopIncrement, loopMtgPrem, loopOwnPrem;
				var totalIncrement = 0;
				var totalMtgPrem = 0;
				var totalOwnPrem = 0;
				var totalMtgM = 0;
				var totalOwnM = 0;
				var totalUnknown1 = 0;
				var totalUnknown2 = 0;
				var arrayFrom = [0, 12000, 50000, 100000, 500000, 1000000, 2000000, 10000000, 15000000, 25000000, 35000000];
				var arrayTo = [12000, 50000, 100000, 500000, 1000000, 2000000, 10000000, 15000000, 25000000, 35000000, 99000000];
				var arrayMPol = ['min. $100', 4.20, 3.60, 3.30, 2.70, 2.40, 2.10, 2.10, 1.80, 1.50, 1.20];
				var arrayOPol = ['min. $100', 5.40, 4.80, 4.50, 3.60, 3.00, 2.70, 2.40, 2.10, 1.80, 1.50];
				var arrayMmm = [2.00, 2.00, 1.50, 1.00, 0.75, 0.50, 0.25, 0.25, 0.25, 0.25, 0.25];
				var arrayOmm = [2.50, 2.50, 2.00, 1.50, 1.00, 0.75, 0.50, 0.50, 0.50, 0.50, 0.50];

				for (var i = 0; i < arrayFrom.length; i++) {
					loopFrom = arrayFrom[i];
					loopTo = arrayTo[i];
					loopMPol = arrayMPol[i];
					loopOPol = arrayOPol[i];
					loopMmm = arrayMmm[i];
					loopOmm = arrayOmm[i];

					loopIncrement = function() {
						if (type == 'salesPrice') {
							var number = salesPriceRoundedToNearestThousand;
						} else if (type == 'loanAmount') {
							var number = loanAmountRoundedToNearestThousand;
						}

						if (typeof arrayOPol[i] != "number") {
							arrayOPol[i] = 0;
						}

						if (number > arrayTo[i]) {
							//console.warn('i:' + i + ' | result: ' + (price > arrayTo[i]) + ' | price: ' + price + ' | arrayTo: ' + arrayTo[i]);
							return arrayTo[i] - arrayFrom[i];
						} else {
							//console.warn('i:' + i + ' | result: ' + (price > arrayTo[i]) + ' | price: ' + price + ' | arrayTo: ' + arrayTo[i]);
							if (number < arrayFrom[i]) {
								return 0;
							} else {
								return number - arrayFrom[i];
							}
						}
					}

					loopMtgPrem = function() {
						if (loopIncrement != 0) {
							if (arrayMPol[i] > 0) {
								return loopIncrement() * arrayMPol[i] / 1000;
							} else {
								return 100;
							}
						} else {
							return 0;
						}
					}

					loopOwnPrem = function() {
						if (typeof arrayOPol[i] != "number") {
							arrayOPol[i] = 0;
						}

						if (loopIncrement != 0) {
							if (arrayOPol[i] > 0) {
								return loopIncrement() * arrayOPol[i] / 1000;
							} else {
								return 100;
							}
						} else {
							return 0;
						}

						// if (loopIncrement != 0) {
						// 	if (arrayOPol[i] > 0) {
						// 		return loopIncrement() * arrayOPol[i] / 1000;
						// 	} else {
						// 		return 0;
						// 	}
						// }
					}

					loopMtgM = function() {
						if (loopIncrement != 0) {
							return loopIncrement() * arrayMmm[i] / 1000;
						} else {
							return 0;
						}
					}

					loopOwnM = function() {
						if (loopIncrement != 0) {
							return loopIncrement() * arrayOmm[i] / 1000;
						} else {
							return 0;
						}
					}

					loopUnknown1 = function() {
						if (loopIncrement() == 0) {
							return 0;
						} else {
							if (loopIncrement() <= salesPrice) {
								return 0.6;
							} else {
								return 1;
							}						
						}
					}

					loopUnknown2 = function() {
						if (loopUnknown1() == 1) {
							return 0;
						} else {
							return loopMtgPrem() * loopUnknown1();
						}
					}

					//totals
					totalIncrement += loopIncrement();
					totalMtgPrem += loopMtgPrem();
					totalOwnPrem += loopOwnPrem();
					totalMtgM += loopMtgM();
					totalOwnM += loopOwnM();
					totalUnknown1 += loopUnknown1(); //unknown percentage
					totalUnknown2 += loopUnknown2(); //unknown dollar value

					tempArray.push({
						'Type': (type == 'salesPrice' ? 'salesPrice': 'loanAmount'),
						//'Basis': price,
						'From': loopFrom,
						'To': loopTo,
						'MPol': loopMPol,
						'OPol': loopOPol,
						'Increment': loopIncrement(),
						'MtgPrem': loopMtgPrem(),
						'OwnPrem': loopOwnPrem(),
						'MMM': loopMmm,
						'OMM': loopOmm,
						'MtgM': loopMtgM(),
						'OwnM': loopOwnM(),
						'Unknown1': loopUnknown1(),
						'Unknown2': decimalCleaner(loopUnknown2())
					});
				}

				if (type == 'salesPrice') {
					salesPriceTotalsArray.push({
						'type': type,
						'totalIncrement': decimalCleaner(totalIncrement),
						'totalMtgPrem': decimalCleaner(totalMtgPrem),
						'totalOwnPrem': decimalCleaner(totalOwnPrem),
						'totalMtgM': decimalCleaner(totalMtgM),
						'totalOwnM': decimalCleaner(totalOwnM)
					});
				} else if (type == 'loanAmount') {
					loanAmountTotalsArray.push({
						'type': type,
						'totalIncrement': decimalCleaner(totalIncrement),
						'totalMtgPrem': decimalCleaner(totalMtgPrem),
						'totalOwnPrem': decimalCleaner(totalOwnPrem),
						'totalMtgM': decimalCleaner(totalMtgM),
						'totalOwnM': decimalCleaner(totalOwnM),
						'totalUnknown1': decimalCleaner(totalUnknown1), //Reissue Rates (tab) > unknown column 1
						'totalUnknown2': decimalCleaner(totalUnknown2) //Reissue Rates (tab) > unknown column 2
					});
				}

				if (!isProd) {
					console.log(type);
					console.warn('tempArray');
					console.table(tempArray);
				}
			}
			arrayBuilder(salesPrice, 'salesPrice');
			arrayBuilder(loanAmount, 'loanAmount');
			//arrayBuilder(loanPolicy, 'loanPolicy');
			//arrayBuilder(newLoan, 'newLoan');
			//arrayBuilder(loanPayoff, 'loanPayoff');

			if (!isProd) {
				console.warn('salesPriceTotalsArray');
				console.table(salesPriceTotalsArray);
				console.warn('loanAmountTotalsArray');
				console.table(loanAmountTotalsArray);
				//console.table(loanPolicyTotalsArray);
				//console.table(newLoanTotalsArray);
				//console.table(loanPayoffTotalsArray);
			}

			var ownPrem = parseFloat(salesPriceTotalsArray[0].totalOwnPrem);
			var ownSurcharge = parseFloat(decimalCleaner(ownPrem * 0.1));
			var ownSiFee = 100;
			var ownTotal = decimalCleaner(ownPrem + ownSurcharge + ownSiFee);
			var ownOnly = decimalCleaner(ownPrem + ownSurcharge);
			var mtgPrem = decimalCleaner(loanAmountTotalsArray[0].totalMtgPrem);
			var mtgExcess = function() {
				if (loanAmountTotalsArray[0].totalMtgPrem > salesPriceTotalsArray[0].totalMtgPrem) {
					return decimalCleaner(loanAmountTotalsArray[0].totalMtgPrem - salesPriceTotalsArray[0].totalMtgPrem);
				} else {
					return 0;
				}
			}
			var mtg10PercentOfPrem = decimalCleaner(loanAmountTotalsArray[0].totalMtgPrem * 0.1);
			var mtgLoanOnly = mtgPrem;
			var mtgExtra1 = ownTotal - mtgPrem + mtgExcess();
			var mtgExtra2 = ownTotal - mtgLoanOnly;

			var loanPayoffCredit = decimalCleaner(salesPriceTotalsArray[0].totalMtgPrem * 0.4);
			var reissuePremium = decimalCleaner(mtgPrem - loanPayoffCredit);

			miscValues.push({
				'ownLimit': salesPriceRoundedToNearestThousand,
				'ownPrem': ownPrem,
				'ownSurcharge': ownSurcharge,
				'ownSiFee': ownSiFee,
				'ownTotal': ownTotal,
				'ownOnly': ownOnly,

				'mtgLimit': loanAmountRoundedToNearestThousand,
				'mtgPrem': mtgPrem,
				'mtgExcess': mtgExcess(),
				'mtg10PercentOfPrem': mtg10PercentOfPrem,
				'mtgLoanOnly': mtgLoanOnly,
				'mtgExtra1': mtgExtra1,
				'mtgExtra2': mtgExtra2,

				'newLoanPremium': mtgPrem, //duplicate from above
				'loanPayoffCredit': loanPayoffCredit,
				'reissuePremium': reissuePremium,
				'totalUnknown1': loanAmountTotalsArray[0].totalUnknown1,
				'totalUnknown2': loanAmountTotalsArray[0].totalUnknown2
			});

			if (!isProd) {
				console.warn('miscValues');
				console.table(miscValues);
			}
		}

		var titleServices = function() {
			if (transactionType == 'purchase') {
				settlementFee = 395;
				abstractFee = 220;
				documentPreperation = 235;
			} else if (transactionType == 'refinance') {
				settlementFee = 395;
				abstractFee = 130;
				documentPreperation = 235;
			} else if (transactionType == 'cash') {
				settlementFee = 635;
				abstractFee = '<i>Included</i>';
				documentPreperation = '<i>Included</i>';
			} else {
				console.warn('updateValues() error');
			}

			$('#settlement-fee').html(settlementFee);
			$('#abstract-fee').html(abstractFee);
			$('#document-preperation').html(documentPreperation);
			
			if (transactionType == 'cash') {
				$('#total-title-services').text(settlementFee);
			} else {
				$('#total-title-services').text(settlementFee + abstractFee + documentPreperation);
			}
		}

		var titleInsurance = function() {
			//Title Insurance: Lender's Title Insurance
			if (transactionType == 'cash') {
				$('#lenders-title-insurance').text('N/A');
			} else if (transactionType == 'refinance') {
				if (salesPrice > loanAmount) {
					$('#lenders-title-insurance').text(miscValues[0].totalUnknown2);
				} else {
					$('#lenders-title-insurance').text(miscValues[0].mtgPrem); //previously miscValues[0].reissuePremium
				}

				// var a = miscValues[0].totalUnknown2;
				// var b = miscValues[0].reissuePremium;
				// var c = miscValues[0].mtgPrem;
				// debugger;

			} else if (transactionType == 'purchase') {
				if (loanAmount == 0) {
					$('#lenders-title-insurance').text('0');
				} else {
					$('#lenders-title-insurance').text(miscValues[0].newLoanPremium);
				}
			}

			//Title Insurance: Advanced Owner's Title Insurance
			if (transactionType == 'refinance') {
				$('#advanced-owners-title-insurance').text('N/A');
			} else {
				if (salesPrice == 0) {
					$('#advanced-owners-title-insurance').text('0');
				} else {
					if (loanAmount == 0) {
						$('#advanced-owners-title-insurance').text(decimalCleaner(miscValues[0].ownOnly)); //Title Insurance'!B6
					} else {
						$('#advanced-owners-title-insurance').text(decimalCleaner(miscValues[0].mtgExtra1)); //Title Insurance'!B12
					}
				}
			}

			//Title Insurance: ALTA 8.1 Endorsement + ALTA 9 Endorsement + Closing Protection Letter
			if (transactionType == 'cash') {
				$('#alta-8-1-endorsement').text('N/A');
				$('#alta-9-endorsement').text('N/A');
				$('#closing-protection-letter').text('N/A');
			} else {
				$('#alta-8-1-endorsement').text('50');

				var tenPercentPrem = miscValues[0].mtgPrem * 0.1;
				if (tenPercentPrem < 150) {
					$('#alta-9-endorsement').text('150');
				} else {
					$('#alta-9-endorsement').text(tenPercentPrem);
				}

				$('#closing-protection-letter').text('25');
			}

			var lendersTitleInsurance = parseFloat($('#lenders-title-insurance').text());
			var advancedOwnersTitleInsurance = parseFloat($('#advanced-owners-title-insurance').text());
			var alta81Endorsement = parseFloat($('#alta-8-1-endorsement').text());
			var alta9Endorsement = parseFloat($('#alta-9-endorsement').text());
			var closingProtectionLetter = parseFloat($('#closing-protection-letter').text());

			if (transactionType == 'cash') {
				var totalTitleInsurance = advancedOwnersTitleInsurance;
			} else if (transactionType == 'refinance') {
				var totalTitleInsurance = lendersTitleInsurance + alta81Endorsement + alta9Endorsement + closingProtectionLetter;
			} else if (transactionType == 'purchase') {
				var totalTitleInsurance = lendersTitleInsurance + advancedOwnersTitleInsurance + alta81Endorsement + alta9Endorsement + closingProtectionLetter;
			}

			$('#total-title-insurance').text(totalTitleInsurance.toFixed(2));
		}

		var recordingFees = function() {
			//Recording Fees: Cash Sale / Deed
			if (transactionType == 'refinance') {
				$('#cash-sale-deed').text('N/A');
			} else {
				if (propertyParish == 'ebr') {
					$('#cash-sale-deed').text('140');
				} else if (propertyParish == 'ascension') {
					$('#cash-sale-deed').text('110');
				} else if (propertyParish == 'livingston') {
					$('#cash-sale-deed').text('130');
				} else if (propertyParish == 'all') {
					$('#cash-sale-deed').text('140');
				}
			}

			//Recording Fees: Mortgage
			if (transactionType == 'cash') {
				$('#mortgage-recording-fees').text('N/A');
			} else {
				if (propertyParish == 'ebr') {
					$('#mortgage-recording-fees').text('235');
				} else if (propertyParish == 'ascension') {
					$('#mortgage-recording-fees').text('205');
				} else if (propertyParish == 'livingston') {
					$('#mortgage-recording-fees').text('225');
				} else if (propertyParish == 'all') {
					$('#mortgage-recording-fees').text('235');
				}
			}

			var cashSaleDeed = parseFloat($('#cash-sale-deed').text());
			var mortgageRecordingFees = parseFloat($('#mortgage-recording-fees').text());

			//Recording Fees: Total
			if (transactionType == 'cash') {
				$('#total-recording-fees').text(cashSaleDeed);
			} else if (transactionType == 'refinance') {
				$('#total-recording-fees').text(mortgageRecordingFees);
			} else if (transactionType == 'purchase') {
				$('#total-recording-fees').text(cashSaleDeed + mortgageRecordingFees);
			}
		}

		var totalTitleFees = function() {
			//Total Title Fees
			var totalTitleServices = parseFloat($('#total-title-services').text());
			var totalTitleInsurance = parseFloat($('#total-title-insurance').text());
			var totalRecordingFees = parseFloat($('#total-recording-fees').text());

			if (propertyParish == 'all') {
				var totalTitleFees = totalTitleServices + totalTitleInsurance;
			} else {
				var totalTitleFees = totalTitleServices + totalTitleInsurance + totalRecordingFees;
			}

			$('#total-title-fees').text(totalTitleFees.toFixed(2));
		}

		var estimatedPropertyTaxes = function() {
			//Estimated Property Taxes
			if (propertyParish == 'ebr') {
				$('#all-other-parishes-with-homestead-exception').text( decimalCleaner((salesPrice-75000) * 0.0120) );
				$('#all-other-parishes-without-homestead-exception').text( decimalCleaner(salesPrice * 0.0120) );
			} else if (propertyParish == 'ascension') {
				$('#all-other-parishes-with-homestead-exception').text( decimalCleaner((salesPrice-75000) * 0.0115) );
				$('#all-other-parishes-without-homestead-exception').text( decimalCleaner(salesPrice * 0.0115) );
			} else if (propertyParish == 'livingston') {
				$('#all-other-parishes-with-homestead-exception').text( decimalCleaner((salesPrice-75000) * 0.0123) );
				$('#all-other-parishes-without-homestead-exception').text( decimalCleaner(salesPrice * 0.0123) );
			} else if (propertyParish == 'all') {
				$('#all-other-parishes-with-homestead-exception').text( decimalCleaner((salesPrice-75000) * 0.01193333333) );
				$('#all-other-parishes-without-homestead-exception').text( decimalCleaner(salesPrice * 0.01193333333) );
			}

			if ($('#all-other-parishes-with-homestead-exception').text() < 0) {
				$('#all-other-parishes-with-homestead-exception').text(0);
			}

			if ($('#all-other-parishes-without-homestead-exception').text() < 0) {
				$('#all-other-parishes-without-homestead-exception').text(0);
			}
		}

		initValues();
		numberCleaner();
	}

});
