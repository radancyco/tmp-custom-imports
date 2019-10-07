// Look for any [data-custom-event="true"]
$('[data-custom-event="true"]').each(function(){
    $(this).removeAttr('data-custom-event'); // Removing attribute for TB Core does not fire it's script
    if( !$(this).hasClass('js-tb-click-tracking') ) {
        $(this).addClass('js-tb-click-tracking');
    }
}).promise().done( function(){ // Promise will wait for the loop to complete 

    // Matches function is apart of the Custom Imports script removing during peer review
    if ( matches("?custom-debug", url) ) {
        console.log('CI Debug - Tracking: No more data-custom-event attributes');
    }

    $('.js-tb-click-tracking').click(function(){ // now on anything with class of js-tb-click-tracking we will list for a click
            var cat = $(this).attr('data-custom-category');
            var label = $(this).attr('data-custom-label');
    if ( (typeof cat !== typeof undefined && cat !== false) && (typeof label !== typeof undefined && label !== false) ) { // Make sure Category and label exist
            APP.MODELS.GoogleBot.sendCustomDimensions(cat,'Click',label,'event');
            if ( matches("?custom-debug", url) ) {
                console.log('CI Debug - Tracking: ga fired');
            }
    } else { // if category or label are missing print a error to the console log
        var msg = $(this)[0].outerHTML;
        console.error("CI Error - Tracking: Missing 'data-custom-category' or 'data-custom-label' on: " + msg)
    }
    })
});
