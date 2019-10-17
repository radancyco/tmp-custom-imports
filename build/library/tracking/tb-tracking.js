var gaCheck = window[window['GoogleAnalyticsObject'] || 'ga']; // TODO: Since this is for TB only maybe adjust this for the TB verision of GA

if( $('[data-custom-event="true"]').length ) {

    // Look for any [data-custom-event="true"]
    $('[data-custom-event="true"]').each(function(){
        $(this).removeAttr('data-custom-event'); // Removing attribute for TB Core does not fire it's script
        if( !$(this).hasClass('js-tb-click-tracking') ) {
            $(this).addClass('js-tb-click-tracking');
        }
    }).promise().done( function(){ // Promise will wait for the loop to complete 

        // Matches function is apart of the Custom Imports script removing during peer review
        if ( matches("?custom-debug", url) ) {
            console.log('CI Debug - TB Tracking: No more data-custom-event attributes');
        }

        clickTrackingListener()
    });
} else if( $('.js-tb-click-tracking').length ) {

    clickTrackingListener()

} else {
    // Since this script could be added in the theme level don't want to have this state an error
    if ( matches("?custom-debug", url) ) {
        console.log('CI Debug - TB Tracking: There appears to be no custom events for the script to track');
    }
}

function clickTrackingListener() { 
    $('.js-tb-click-tracking').click(function(){ // now on anything with class of js-tb-click-tracking we will list for a click
        var cat = $(this).attr('data-custom-category');
        var label = $(this).attr('data-custom-label');
    if ( (typeof cat !== typeof undefined && cat !== false) && (typeof label !== typeof undefined && label !== false) ) { // Make sure Category and label exist

    if ( matches("?custom-debug", url) ) { // If the URL has ?tracking-debug create a popup when the tracked item is clicked
        alert('CI Debug - TB Tracking: Event Category = "' + cat + '" Event Label = "'+ label + '"' );
    }

    if ( matches("preview.", url) || matches("runmytests.com", url) ) { // If you are on a preview site 
        if ( matches("?custom-debug", url) ) { // If the URL has ?tracking-debug create a popup when the tracked item is clicked
            console.log('CI Debug - TB Tracking: On Preview')
        }
    } else { // If not on a preview site
        if ( matches("?tracking-debug", url) ) { // If the URL has ?tracking-debug create a popup when the tracked item is clicked
            console.log('CI Debug - TB Tracking: On Live')
        }
        if( typeof gaCheck == 'function' ) { // Check to make sure GA is running
            APP.MODELS.GoogleBot.sendCustomDimensions(cat,'Click',label,'event'); // Fire the TB GA tracking 
            if ( matches("?custom-debug", url) ) {
                console.log('CI Debug - TB Tracking: ga fired');
            }
        } else {
            console.error("CI Error - TB Tracking: GA is not a function");
        }
    }

    } else { // if category or label are missing print a error to the console log
    var msg = $(this)[0].outerHTML;
    console.error("CI Error - TB Tracking: Missing 'data-custom-category' or 'data-custom-label' on: " + msg);
    }
    })
}

// Hub Filter Tracking

if( $('.js-hub-submit-filters').length ) {
    $('.js-hub-submit-filters').click(function(){
        var hubID = '#' + $(this).attr('data-hub-id'),
            eventCategory = $(this).attr('data-custom-category'),
            eventLabel = "";

        $(hubID + ' .js-hub-filter-form select').each(function(w){
            var selectId = $(this).attr('id'),
                selectVal = $(hubID + " #" + selectId).val();
                selectLabel = $(hubID + ' label[for="' + selectId + '"]').text();
            if(selectVal != "none"){
                if(eventLabel == "") {
                    eventLabel = selectLabel + ' - ' + selectVal;
                } else {
                    eventLabel = eventLabel + ' | ' + selectLabel + ' - ' + selectVal;
                }
            }
        })

        if ( matches("?tracking-debug", url) ) { // If the URL has ?tracking-debug create a popup when the tracked item is clicked
            alert('CI Debug - TB Tracking: Event Category = "' + eventCategory + '" Event Label = "' + eventLabel + '"' );
        }

        if ( matches("preview.", url) || matches("runmytests.com", url) ) { // If you are on a preview site 
            if ( matches("?custom-debug", url) ) { // If the URL has ?tracking-debug create a popup when the tracked item is clicked
                console.log('CI Debug - TB Tracking: On Preview')
            }
        } else { // If not on a preview site
            if ( matches("?custom-debug", url) ) { // If the URL has ?tracking-debug create a popup when the tracked item is clicked
                console.log('CI Debug - TB Tracking: On Live')
            }
            if( typeof gaCheck == 'function' ) { // Check to make sure GA is running
                APP.MODELS.GoogleBot.sendCustomDimensions(cat,'Click',label,'event'); // Fire the TB GA tracking 
                if ( matches("?custom-debug", url) ) {
                    console.log('CI Debug - TB Tracking: ga fired');
                }
            } else {
                console.error("CI Error - TB Tracking: GA is not a function");
            }
        }

    })
}


