(function () {
	// ==============================================================================================
	// TRIGGERING HUB FILTERS BY URL QUERY PARAMS (GST)
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
	function filterHubByUrlParam(uniqueHubClass, filter) {
		// First we need to get the hub section id. This is because the default content feed
		// layout code for hubs uses a dynamic hash string for the hub id.
		// To get this id, we must add a unique class to the hub section
		// (in this example, we're using 'news-hub' as this unique class)
		// and then use this class to target the section and get its id.
		var hubID = '#' + $(uniqueHubClass).get(0).id;
		// get parameter value from url
		var paramVal = getUrlParameter(filter);
		// if valid, trigger the hub filter
		if (paramVal && isValidUrlParameter(hubID, filter, paramVal)) {
			triggerHubFilter(hubID, filter, paramVal);
		}
	}

	// wait for the hub initialization event and then filter based on url params
	$(document).on('contentFeedInitialized', function (e) {
		if (e.detail.final) {
			filterHubByUrlParam('.news-hub', 'category');
			// if we need to filter by any other url param, or if we need to filter
			// another hub on this page, just call the same function again with new arguments
			// for example:
			// filterHubByUrlParam('.news-hub', 'location');
		}
	});
})();
