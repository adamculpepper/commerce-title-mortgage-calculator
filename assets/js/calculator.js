$(function() {

	var settlementFee = 0;
	var abstractFee = 0;
	var documentPreperation = 0;
	//var totalTitleServices = 0;

	var transactionType = '';
	var salesPrice = 0;
	var loanAmount = 0;
	var propertyParish = '';

	$('#updatable-inputs').on('keyup', 'input', function(e) {
		updateValues();
	});

	$('#updatable-inputs').on('change', 'select', function(e) {
		updateValues();
	});

	updateValues();

	function updateValues() {
		function initValues() {
			transactionType = $('#transaction-type').val();
			salesPrice = $('#sales-price').val();
			loanAmount = $('#loan-amount').val();
			propertyParish = $('#property-parish').val();

			if (transactionType == 'refinance') {
				$('#label-sales-price-or-current-payoff').text('Current Payoff');
			} else {
				$('#label-sales-price-or-current-payoff').text('Sales Price');
			}

			titleServices();
			titleInsurance();
			recordingFees();
			totalTitleFees();
			estimatedPropertyTaxes();

			matrixTitleInsurance();
		}

		var matrixTitleInsurance = function() {
			arrayTitleInsurance = [];
			loops = 11;

			
			function arrayBuilder(price, loan) {
				console.warn('price: ' + price + ' | loan: ' + loan);
				var tempArray = [];
				var loopFrom, loopTo, loopMPol, loopOPol, loopIncrement, loopMtgPrem, loopOwnPrem = '';
				var arrayFrom = ['0', '12000', '50000', '100000', '500000', '1000000', '2000000', '10000000', '15000000', '25000000', '35000000'];
				var arrayTo = ['12000', '50000', '100000', '500000', '1000000', '2000000', '10000000', '15000000', '25000000', '35000000', '99000000'];
				var arrayMPol = ['min. $100', '4.20', '3.60', '3.30', '2.70', '2.40', '2.10', '2.10', '1.80', '1.50', '1.20'];
				var arrayOPol = ['min. $100', '5.40', '4.80', '4.50', '3.60', '3.00', '2.70', '2.40', '2.10', '1.80', '1.50'];
				var arrayMmm = ['2.00', '2.00', '1.50', '1.00', '0.75', '0.50', '0.25', '0.25', '0.25', '0.25', '0.25'];
				var arrayOmm = ['2.50', '2.50', '2.00', '1.50', '1.00', '0.75', '0.50', '0.50', '0.50', '0.50', '0.50'];

				for (var i = 0; i < loops; i++) {
					loopFrom = arrayFrom[i];
					loopTo = arrayTo[i];
					loopMPol = arrayMPol[i];
					loopOPol = arrayOPol[i];
					loopMmm = arrayMmm[i];
					loopOmm = arrayOmm[i];

					loopIncrement = function() {
						if (price > arrayTo[i]) {
							console.warn('i:' + i + ' | result: ' + (price > arrayTo[i]) + ' | price: ' + price + ' | arrayTo: ' + arrayTo[i]);
							return arrayTo[i] - arrayFrom[i];
						} else {
							console.warn('i:' + i + ' | result: ' + (price > arrayTo[i]) + ' | price: ' + price + ' | arrayTo: ' + arrayTo[i]);
							if (price < arrayFrom[i]) {
								return 0;
							} else {
								return price - arrayFrom[i];
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
						if (loopIncrement != 0) {
							if (arrayOPol[i] > 0) {
								return loopIncrement() * arrayOPol[i] / 1000;
							} else {
								return 100;
							}
						} else {
							return 0;
						}
					}

					tempArray.push({
						//'Basis': price,
						'From': loopFrom,
						'To': loopTo,
						'MPol': loopMPol,
						'OPol': loopOPol,
						'Increment': loopIncrement(),
						'MtgPrem': loopMtgPrem(),
						'OwnPrem': loopOwnPrem(),
						'MMM': loopMmm,
						'OMM': loopOmm

					});
				}
				console.table(tempArray);
			}
			arrayBuilder(salesPrice, loanAmount);

			// data[0] = { "ID": "1", "Status": "Valid" };
			// data[1] = { "ID": "2", "Status": "Invalid" };

			//arrayTitleInsurance.push(arrayDump);
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
					$('#lenders-title-insurance').text('313.26');
				} else {
					$('#lenders-title-insurance').text('280.26');
				}
			} else if (transactionType == 'purchase') {
				if (loanAmount == 0) {
					$('#lenders-title-insurance').text('0');
				} else {
					$('#lenders-title-insurance').text('522.10');
				}
			}

			//Title Insurance: Advanced Owner's Title Insurance
			if (transactionType == 'refinance') {
				$('#advanced-owners-title-insurance').text('N/A');
			} else {
				//'Commerce Title'!F6

				if (salesPrice == 0) {
					$('#advanced-owners-title-insurance').text('0');
				} else {
					if (loanAmount == 0) {
						$('#advanced-owners-title-insurance').text('847.22');
					} else {
						$('#advanced-owners-title-insurance').text('425.12');
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
				$('#alta-9-endorsement').text('150');
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
				$('#all-other-parishes-with-homestead-exception').text('900.00');
				$('#all-other-parishes-without-homestead-exception').text('1800.00');
			} else if (propertyParish == 'ascension') {
				$('#all-other-parishes-with-homestead-exception').text('862.50');
				$('#all-other-parishes-without-homestead-exception').text('1725.00');
			} else if (propertyParish == 'livingston') {
				$('#all-other-parishes-with-homestead-exception').text('922.50');
				$('#all-other-parishes-without-homestead-exception').text('1845.00');
			} else if (propertyParish == 'all') {
				$('#all-other-parishes-with-homestead-exception').text('895.00');
				$('#all-other-parishes-without-homestead-exception').text('1790.00');
			}
		}

		initValues();
	}

});


















