$(function() {



	//Title Services
	// var settlementFee = $('#settlement-fee').val();
	// var abstractFee = $('#abstract-fee').val();
	// var documentPreperation = $('#document-preperation').val();
	// var totalTitleServices = $('#total-title-services').val();

	var settlementFee = 0;
	var abstractFee = 0;
	var documentPreperation = 0;
	var totalTitleServices = 0;

	$('#settlement-fee').text('updated');
	$('#abstract-fee').text('updated');
	$('#document-preperation').text('updated');
	$('#total-title-services').text('updated');
	
	//Title Insurance
	$('#lenders-title-insurance').text('updated');
	$('#advanced-owners-title-insurance').text('updated');
	$('#alta-8-1-endorsement').text('updated');
	$('#alta-9-endorsement').text('updated');
	$('#closing-protection-letter').text('updated');
	$('#total-title-insurance').text('updated');

	//Recording Fees
	$('#cash-sale-deed').text('updated');
	$('#mortgage').text('updated');
	$('#total-recording-fees').text('updated');

	//Total TItle Fees
	$('#total-title-fees').text('updated');

	//Estimated Property
	$('#all-other-parishes-with-homestead-exception').text('updated');
	$('#all-other-parishes-without-homestead-exception').text('updated');

	$('#updatable-inputs').on('keyup', 'input', function(e) {
		updateValues();
	});

	$('#updatable-inputs').on('change', 'select', function(e) {
		updateValues();
	});

	updateValues();

	function updateValues() {
		var transactionType = $('#transaction-type').val();
		var salesPrice = $('#sales-price').val();
		var loanAmount = $('#loan-amount').val();
		var propertyParish = $('#property-parish').val();

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

		console.warn('settlementFee: ' + settlementFee);
		$('#settlement-fee').html(settlementFee);
		$('#abstract-fee').html(abstractFee);
		$('#document-preperation').html(documentPreperation);
		
		if (transactionType == 'cash') {
			$('#total-title-services').text(settlementFee);
		} else {
			$('#total-title-services').text(settlementFee + abstractFee + documentPreperation);
		}
	}

});


















