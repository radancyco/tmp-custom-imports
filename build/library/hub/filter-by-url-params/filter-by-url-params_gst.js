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


//// NOTE: the code above may not work as intended.
/// https://www.capitalonecareers.com/blog?topic=benefits is a GST site and the code below works for it



// UDS-1355
(function () {
    // ==============================================================================================
    // TRIGGERING HUB FILTERS BY URL QUERY PARAMS (GST)
    // ==============================================================================================

    // this function returns the value for a given url query parameter
    // it returns undefined if there are no query params or if the query param has no value
    function getUrlParameter(sParam) {
        // console.log('getUrlParameter', 'sParam = ' + sParam);
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
    };
    
    // this function selects a value from the hub filter options 
    // and triggers the filters submit button
    function triggerHubFilter(hubID, filter, value) {
        //console.log('triggerHubFilter', 'hubID = ' + hubID, 'filter = ' + filter, 'value = ' + value);
        var actualFilter = filter === 'topic' ? 'pillar-2' : filter;
        var actualValue = value;
        if (window.location.href.indexOf("preview.radancy.net") > -1 || window.location.href.indexOf("runmytests.com") > -1) {
            if (filter === 'topic') {
                switch (value) {
                    case "benefits":
                        actualValue = "33";
                        break;
                    case "capital-101":
                        actualValue = "34";
                        break;
                    case "career-development":
                        actualValue = "35";
                        break;
                    case "culture":
                        actualValue = "39";
                        break;
                    case "diversity-and-inclusion":
                        actualValue = "40";
                        break;
                    case "students-and-grads":
                        actualValue = "41";
                        break;
                    case "tech":
                        actualValue = "42";
                        break;
                    case "thought-leadership":
                        actualValue = "43";
                        break;
                }
            }
        }
        else {
            if (filter === 'topic') {
                switch (value) {
                    case "benefits":
                        actualValue = "243";
                        break;
                    case "capital-101":
                        actualValue = "245";
                        break;
                    case "career-development":
                        actualValue = "247";
                        break;
                    case "culture":
                        actualValue = "248";
                        break;
                    case "diversity-and-inclusion":
                        actualValue = "249";
                        break;
                    case "students-and-grads":
                        actualValue = "250";
                        break;
                    case "tech":
                        actualValue = "251";
                        break;
                    case "thought-leadership":
                        actualValue = "252";
                        break;
                }
            }
        }
        
        $(hubID + '-' + actualFilter).val(actualValue).trigger('change');
    	$(hubID + ' .js-hub-submit-filters').trigger('click');
    	// for some reason the select defaults back to its original state so we need to change the value again
    	$(document).ready(function () {
    	    $(hubID + '-' + actualFilter).val(actualValue).trigger('change');
    	});
    }
    
    // this function returns true if the url param value is valid
    // Note: filter and value are case sensitive
    function isValidUrlParameter(hubID, filter, value) {
        //console.log('isValidUrlParameter', 'hubID = ' + hubID, 'filter = ' + filter, 'value = ' + value);
        var actualFilter = filter === 'topic' ? 'pillar-2' : filter;
        var actualValue = value;
        if (window.location.href.indexOf("preview.radancy.net") > -1 || window.location.href.indexOf("runmytests.com") > -1) {
            if (filter === 'topic') {
                switch (value) {
                    case "benefits":
                        actualValue = "33";
                        break;
                    case "capital-101":
                        actualValue = "34";
                        break;
                    case "career-development":
                        actualValue = "35";
                        break;
                    case "culture":
                        actualValue = "39";
                        break;
                    case "diversity-and-inclusion":
                        actualValue = "40";
                        break;
                    case "students-and-grads":
                        actualValue = "41";
                        break;
                    case "tech":
                        actualValue = "42";
                        break;
                    case "thought-leadership":
                        actualValue = "43";
                        break;
                }
            }
        }
        else {
            if (filter === 'topic') {
                switch (value) {
                    case "benefits":
                        actualValue = "243";
                        break;
                    case "capital-101":
                        actualValue = "245";
                        break;
                    case "career-development":
                        actualValue = "247";
                        break;
                    case "culture":
                        actualValue = "248";
                        break;
                    case "diversity-and-inclusion":
                        actualValue = "249";
                        break;
                    case "students-and-grads":
                        actualValue = "250";
                        break;
                    case "tech":
                        actualValue = "251";
                        break;
                    case "thought-leadership":
                        actualValue = "252";
                        break;
                }
            }
        }
        
        var filterOption = $(hubID + '-' + actualFilter + ' .hub-filter__option[value="' + actualValue + '"]');
        //console.log(filterOption.length > 0);
        return filterOption.length ? true : false;
    }
    
    // this function triggers hub filtering based on a url param
    function filterHubByUrlParam(uniqueHubClass, filter) {
        // console.log('filterHubByUrlParam', 'uniqueHubClass = ' + uniqueHubClass, 'filter = ' + filter);
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
		  //  console.log('contentFeedInitialized');
			filterHubByUrlParam('.stories-hub', 'topic');
			// if we need to filter by any other url param, or if we need to filter
			// another hub on this page, just call the same function again with new arguments
			// for example:
			// filterHubByUrlParam('.news-hub', 'location');
		}
	});
	var filterCat;
	$('.hub-filter__select').on("change", function () {
	    filterCat = this.selectedOptions[0].text;
	});
	$('.js-hub-submit-filters').on("click", function() {
        ga('send', 'event', 'Custom Event', 'HUB-Main-Filter', 'Filter:' + filterCat);
    });
    $('.js-hub-reset-filters').on("click", function() {
        ga('send', 'event', 'Custom Event', 'HUB-Main-Filter', 'Reset');
    });
})();




