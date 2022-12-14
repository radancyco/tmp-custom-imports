(function () {
	// ==============================================================================================
	// TRIGGERING HUB FILTERS BY URL QUERY PARAMS (Legacy Site Type)
	// ==============================================================================================

	// this function returns the value for a given url query parameter
	// it returns undefined if there are no query params or if the query param has no value
	function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1];
			}
		}
	}

	// this function selects a value from the hub filter options
	// and triggers the filters submit button
	function triggerHubFilter(hubID, filter, value) {
		$(hubID + '-' + filter)
			.val(value)
			.trigger('change');
		$(hubID + ' .js-hub-submit-filters').trigger('click');
	}

	// this function returns true if the url param value is valid
	// Note: filter and value are case sensitive
	function isValidUrlParameter(hubID, filter, value) {
		var filterOption = $(
			hubID + '-' + filter + ' .hub-filter__option[value="' + value + '"]'
		);
		return filterOption.length ? true : false;
	}

	// this function triggers hub filtering based on a url param
	function filterHubByUrlParam(hubID, filter) {
		// get parameter value from url
		var paramVal = getUrlParameter(filter);
		// if valid, trigger the hub filter
		if (paramVal && isValidUrlParameter(hubID, filter, paramVal)) {
			triggerHubFilter(hubID, filter, paramVal);
		}
	}

	// wait for the hub initialization event and then filter based on url params
	$(document).on('hubInitialized', function (e) {
		if (e.detail.final) {
			// here we need to use a timeout to prevent the submit button from being
			// disabled before/after we trigger the submit button click
			// Note: this is likely due to the 'hubInitialized' custom event being triggered
			// before the filters are set up on legacy site types
			setTimeout(function () {
				filterHubByUrlParam('#data-hub-1', 'category');
				// if we need to filter by any other url param, or if we need to filter
				// another hub on this page, just call the same function again with new arguments
				// for example:
				// filterHubByUrlParam('#data-hub-1', 'location');
			}, 0);
		}
	});
})();
