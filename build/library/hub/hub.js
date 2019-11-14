// TODO: change all console logs into debug logs and try to make them readable
// TODO: Once sites have gone like change over mappings to js-mappings
var hubFeature = {
    Init: function(hubID){
        //===============================
        // runs on load
        //===============================
        $(hubID).addClass("initializing");
        var isPrefiltered = $(hubID).attr("data-prefilter");
        var showFiltersForm = $(hubID).attr("data-show-form");
        // disable form filter and reset on load
        $(hubID + " .js-hub-reset-filters").prop('disabled', true);
        $(hubID + " .js-hub-submit-filters").prop('disabled', true);
        // populates filter options
        if(isPrefiltered == 1){
            hubFeature.setupPreFilters(hubID, showFiltersForm);
        } else{
            if(showFiltersForm == 1){
                hubFeature.setupFilters(hubID);
            } else {
                // If prefilters are not setup and the filter form is not setup make sure to run load more
                hubFeature.loadMoreReset(hubID);
            }
        }
        $(hubID).addClass("initialized").removeClass("initializing");
        //===============================
        //filter button on form
        $(".js-hub-submit-filters").on('click',function(i){
            i.preventDefault();
            var hubID = "#" + $(this).attr("data-hub-id"),
                valsExist = "";
            $(hubID + " .js-hub-filter-form select").each(function(w){
                var getVals = "#" + $(this).attr('id'),
                    hasVals = $(hubID + " " + getVals).val();
                if(hasVals != "none"){
                    valsExist = valsExist + $(hubID + " " + getVals).val();
                }
            })
            
            if(hubID != undefined && valsExist != "" ){
                    $(hubID).addClass("filtered"); // This must come first so that addtional functions inside filterByFormData knows how to react
                    hubFeature.filterByFormData(hubID); 
                    $(hubID + " .js-hub-reset-filters").prop('disabled', false); // If reset isn't already enabled make sure to allow it
            } else if ( hubID != undefined && valsExist == "" ) { // if there are no values
                if ( $(hubID).hasClass("filtered") ) { // if the content has already been filtered
                    hubFeature.resetData(hubID); // treat filter button like reset
                } 

            }
        });

        //===============================
        //reset button on filter form
        $(".js-hub-reset-filters").on('click',function(i){
            i.preventDefault();
            var hubID = "#" + $(this).attr("data-hub-id");
            if(hubID != undefined){

                if( $(hubID).hasClass("filtered") ) {
                    hubFeature.resetData(hubID);
                } else {

                    $(hubID + " .js-hub-reset-filters").prop('disabled', true);
                    $(hubID + " .js-hub-submit-filters").prop("disabled", true);
                        
                    // reset filters
                    $(hubID + " .js-hub-filter-form select").each(function(){
                        var gID = "#" + $(this).attr("id"); 
                        $(hubID + " .js-hub-filter-form " + gID + " option" ).prop('selected', function() {
                            return this.defaultSelected;
                        })
                    });
                }
            }
        });

        //===============================
        //Listening for filters to be selected
        $(hubID + " .js-hub-filter-form select").change(function(){


            if($(this).val() == "none") { // If there are no options selected

                if ( $(hubID).hasClass("filtered") ) { // if the content has already been filtered then let the filter buttons be selected
                    $(hubID + " .js-hub-submit-filters").prop("disabled", false);
                    $(hubID + " .js-hub-reset-filters").prop('disabled', false);
                } else { // if the user has not filtered the form yet then the buttons are disbaled
                    $(hubID + " .js-hub-submit-filters").prop("disabled", true);
                    $(hubID + " .js-hub-reset-filters").prop('disabled', true);
                }

            } else { // if there are options selected then the buttons should be able to be clicked
                $(hubID + " .js-hub-submit-filters").prop("disabled", false);
                $(hubID + " .js-hub-reset-filters").prop('disabled', false);
            }

        });



        //===============================
        //filter by buttons click event  including what to do if it is the reset button
        $(".js-hub-filter-button").on('click',function(i){
            i.preventDefault();
            var hubID = "#" + $(this).attr("data-hub-id");
            
            if(!$(this).hasClass("current-active")){

                $(hubID + " .js-hub-filter-button").removeClass("current-active");
                $(this).addClass("current-active");
                
                if($(this).hasClass("js-hub-filter-button-reset")){ // If this is the reset button then do the following
                    hubFeature.resetData(hubID);
                } else  { // IF this is a regular filter button
                    var bValue = $(this).attr("data-query");
                    hubFeature.filterByButtonData(hubID, bValue);
                }
                
            }
        })

        //===============================
        // Back to filter button

        // js-hub-back-to-button

        $(hubID + " .js-hub-back-to-button").on('click',function(e){
            e.preventDefault();
            var hubID = "#" + $(this).attr("data-hub-id");

            if( $(hubID + " .js-hub-filter-form").length ) {
                $(hubID + " .js-hub-filter-form select").first().focus();
            } else if ( $(hubID + " .js-hub-filter-button-wrapper" ).length ) {
                $(hubID + " .js-hub-filter-button-wrapper button").first().focus();
            } else {
                console.error("CI Error - HUB: No form to go back to");
            }

        });
        
        //===============================
        // The load more system 
        // is initialized by the setup filters function when resetData runs
    
        // Load more button functionality
        // // This will reveal more per click
        // TODO: Change this once al sites are updated
        // $(hubID + ' .js-hub-load-more-button').on('click', function (e) {
        //     e.preventDefault();

        //     var hubID = "#" + $(this).attr("data-hub-id");
        //     thisHub = $(hubID),
        $('.js-hub-load-more-button').on('click', function (e) {
            e.preventDefault();

            var thisHub = $(this).closest('.js-hub'), // This gets the parent .js-content-load-more of the currently clicked .js-hub-load-more-button
            defaultLoadCount = +thisHub.attr('data-load-more-default'), // Following variables affect how many are shown per click Adding "+" in front of the variable makes it an integer
            loadMore = +thisHub.attr('data-load-more-amount'),
            previousLoad = +thisHub.attr('data-load-more-current'),
            currentLoad = +thisHub.attr('data-load-more-current'),
            maxLoad = +thisHub.attr('data-load-more-max'),
            overMax = 0, // By default you are not over maxLoad
            loadedMsg = $(this).attr('data-items-loaded-msg'),
            finishedMsg = $(this).attr('data-items-finished-msg');
            
            
            if( loadMore == 0 ) { // if load more setting is set to zero then show all 
                thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').removeClass('hidden-by-load').addClass('showing-by-load'); // show all tilest
                currentLoad = maxLoad; // set current load to maxload so that
            } else {
                thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').slice(0, loadMore).removeClass('hidden-by-load').addClass('showing-by-load'); // Revals X ammount of more tiles based on the data-content-load-more-ammount set
                currentLoad = +thisHub.find('.js-hub-item.showing-by-filter.showing-by-load').length;  // Get the new current load ammount 
            }
            
            //Find out if we are over maxLoad
            if ( ( maxLoad != 0 && currentLoad >= maxLoad ) ) { // Make sure maxLoad is not set to 0 and then check if current count is higher than max load or if maxload is not set to zero but loadMore is set to show all 
                overMax = 1;
                console.log("Hub ID: " + thisHub.attr('id') + " Message: Over Max")
            } else if ( maxLoad == 0 ) { // If maxLoad is set to zero then we will never hit maxload
                overMax = 0;
                console.log("Hub ID: " + thisHub.attr('id') + " Message: Not Over Max")
            }
            
            if( overMax == 1 ) { // If we have hit our max show
                thisHub.find('.js-hub-item.showing-by-filter').removeClass('hidden-by-load showing-by-load'); // Show all tiles to start fresh
                thisHub.find('.js-hub-item.showing-by-filter').addClass('hidden-by-load'); // Hide all tiles
                thisHub.find('.js-hub-item.showing-by-filter').slice(0, maxLoad).removeClass('hidden-by-load').addClass('showing-by-load');  // Show only the max ammount of tiles
            } 

            // Once all the correct ammount of items are show then load images
            // hubFeature.wakeUpLazy(hubID);

            // TODO: Don't use this once all sites go live
            thisHub.find('.js-hub-item.showing-by-filter.showing-by-load .js-hub-lazy[data-src]').each(function(){
                var thisIMG = $(this).attr('data-src');
                $(this).attr('src', thisIMG).removeAttr("data-src");
            });

            // Updating data and status before next click
            
            thisHub.attr('data-load-more-current', currentLoad); // Set the new current load ammount

            var howManyLoaded = currentLoad - previousLoad;

    
        
            if( $(this).hasClass('enabled') || $(this).hasClass('disabled') ) {
                
                if (thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').length == 0 || overMax == 1 ) { //    If the default ammount is so high there are no more hidden titles or if current load great than or equal to  maxload 
        
                    $(this).removeClass('enabled').addClass('disabled'); // Then hide the load more button

                    if( howManyLoaded > 0 ) {
                        // Aria message
                        thisHub.find('.js-aria-hub-msg').html(howManyLoaded + " " + finishedMsg);
                    } else {
                        // Aria Message, incase the design does not have a disabled state
                        thisHub.find( '.js-aria-hub-msg').html("0 " + loadedMsg);
                    }


                } else { 
                    $(this).removeClass('disabled').addClass('enabled'); // Then show the load more button

                    if( howManyLoaded > 0 ) {
                        // Aria Message
                        thisHub.find( '.js-aria-hub-msg').html(howManyLoaded + " " + loadedMsg);

                    } else {
                        // Aria Message, incase the design does not have a disabled state
                        thisHub.find( '.js-aria-hub-msg').html("0 " + loadedMsg);
                    }


                }
            } else {
                // TODO: Remove once all sites are live
                if (thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').length == 0 || overMax == 1 ) { //    If the default ammount is so high there are no more hidden titles or if current load great than or equal to  maxload 
                    thisHub.find('.js-hub-load-more-button').prop('disabled', true); // Then hide the load more button
                } else {
                    thisHub.find('.js-hub-load-more-button').prop('disabled', false); // Then show the load more button
                }
                console.warn("CI Error - HUB: Is using outdated load more button");
            }

            
        });
        
    },
    setupPreFilters: function(hubID,setupFilters){
        var dFacet,
        dFacetValue,
        dKeepMapping = +$(hubID).attr("data-keepmappings");
        $(hubID + " .js-hub-prefilter").each(function(i){
            
            dValue = $(this).attr("data-query");
            $(hubID + " .js-hub-mappings li" + dValue).each(function(i){
                console.log(i);
                $(this).addClass("js-keep-data").parents(".js-hub-item").addClass("pre-filtered");
            })
            
        })

        if( dKeepMapping == 0) { // Remove mappings so that it does not show other mappings in form when filtering
            $(hubID + " .js-hub-mappings li:not(.js-keep-data)").remove();
            console.log("Hub ID: " + hubID + " Message: Mappings Deleted");
        }

        $(hubID + " .js-hub-item:not(.pre-filtered)").remove(); // Remove the tile from the page if it is not apart of the prefilter


        if(setupFilters == 1){
            console.log("Hub ID: " + hubID + " Message: FINISHED");
            hubFeature.setupFilters(hubID);
        }

        // Reset and sort
        hubFeature.resetData(hubID);
    },
    setupFilters: function(hubID){
        var keyA = [];
        var thisFilter ='';
        // cycle through each of the available form filter fields to find out the names of filters in use
        $(hubID + " select[id^='data-hub-']").each(function(){
            var thisFilter = $(this).attr("id");
            // cycle through the mapping entries to find matches and pass keyword to the array variable
            $(hubID + " .js-hub-mappings li[" + thisFilter + "]").each(function(w){
                var v = $(this).attr(thisFilter);
                if(v != "ALL"){
                    keyA.push(v);
                }
            })
            
            keyA.sort();
            keyA = $.uniqueSort(keyA);
            // add options to the keyword field
            $.each( keyA, function( i, value ) {
                $(hubID + " select#" + thisFilter).append("<option class='hub-filter__option' value='" + value + "'>" + value + "</option>");
            });
            keyA = [];
        });
        
        // Resetting the data will also sort the data
        hubFeature.resetData(hubID);
    },
    sortHub: function(hubID,criteria,order){
        // Sort function for the whole hub list
        // NOTE: Never add aria live into this function, it is triggered by too mmany other commands
        var container = $(hubID + " .js-hub-content"); // The whole list of items
        var date = 0; // Default state of saying the data will be sorted alphabeitnly

        if( $(hubID).hasClass("filtered") ) {
            var itemsToSort = $(hubID + " .js-hub-item.showing-by-filter");
            var itemsToIgnore = $(hubID + " .js-hub-item:not(.showing-by-filter)");
            itemsToIgnore.detach().get();
        } else {
            var itemsToSort = $(hubID + " .js-hub-item"); // Each invidual item
        }

        $(hubID + " .js-hub-item").removeClass('hidden-by-load showing-by-load'); // Prevent load more from affecting sort


        if ( ( criteria.includes("date") ) ) { // test to see if the word date is in the criteria target
            date = 1;
        }

        console.log("SORTING DATE");
        console.log(criteria);
        console.log(order);

        var itemsOrdered = itemsToSort.detach().get(); // Creates and array we can sort on


        if ( order == 1 || order == 2  ) { // Make sure we aren't sorting by random

            itemsOrdered.sort(function(a,b){
                if (date) {
                    a = new Date($(a).attr(criteria)).getTime();
                    b = new Date($(b).attr(criteria)).getTime();
                } else {
                    a = $(a).attr(criteria);
                    b = $(b).attr(criteria);
                }

                
                if ( order == 1 ) {
                    // Descending
                    return a>b ? -1 : a<b ? 1 : 0;
                } else {
                    // Ascending
                    return a<b ? -1 : a>b ? 1 : 0;
                }
                
            }); 
    
        } else if ( order == 0 ) { // If random
            function shuffle(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                return a;
            }

            shuffle(itemsOrdered);
        }

        // Add items that were sorted back to container
        container.append(itemsOrdered);
        // Also if there were items that were filtered out add them to the end
        if( $(hubID).hasClass("filtered") ) {
            container.append(itemsToIgnore);
        } 
                
        // Rerun loadmore
        hubFeature.loadMoreReset(hubID);

    },
    resetData: function(hubID){


        if ( $(hubID).hasClass("filtered") ) {
            // TODO: Determine if we want to force a message on reset
            // setTimeout(function(){
                hubFeature.ariaMessaging(hubID);
        // }, 500);

        } // NOTE: Do not add aira live in this function outside this if sttatement because this function runs on init for setting up prefilters and would confuse users.


        $(hubID).removeClass("filtered");
    
        // Remove load more classes
        $(hubID + " .js-hub-item").removeClass('hidden-by-load showing-by-load hidden-by-filter').attr('data-weight','0').addClass("showing-by-filter");

        // Remove any visable error messages
        if ( $(hubID + " .js-hub-error").length ) {
            $(hubID + " .js-hub-error").remove()
        }
    

        var sorting = +$(hubID + " .js-hub-content").attr("data-sort");
        var sortingOrder = +$(hubID + " .js-hub-content").attr("data-sort-direction");
        var sortingCriteria = $(hubID + " .js-hub-content").attr("data-sort-criteria");
        if(sorting == 1){
            // resets the data and then applies a sort based on the date
            // The load more will trigger again when sort happens
            console.log("getting here");
            hubFeature.sortHub(hubID, sortingCriteria, sortingOrder);
        }

        

        $(hubID + " .js-hub-reset-filters").prop('disabled', true);
        $(hubID + " .js-hub-submit-filters").prop("disabled", true);
            
        // reset filters
        $(hubID + " .js-hub-filter-form select").each(function(){
            var gID = "#" + $(this).attr("id"); 
            $(hubID + " .js-hub-filter-form " + gID + " option" ).prop('selected', function() {
                return this.defaultSelected;
            })
        });
        
    
    },  
    filterByButtonData:function(hubID, dataAttrString){
        var getString = dataAttrString,
        noResultsText = $(hubID).attr("data-no-results-text");

        // Remove any visable error messages
        if ( $(hubID + " .js-hub-error").length ) {
            $(hubID + " .js-hub-error").remove()
        }

        console.log(getString); 
        $(hubID + " .js-hub-item").removeClass("showing-by-filter").addClass("hidden-by-filter").attr("data-weight","0");
        $(hubID + " .js-hub-mappings > li" + getString)
            .parents(".js-hub-item").addClass("showing-by-filter").removeClass("hidden-by-filter").attr('data-weight','1');

        // Reset Classes so load more is not accidently hidding anything
        hubFeature.loadMoreReset(hubID);

        // Added error message if no results found
        if ( $(hubID + " .js-hub-mappings > li" + getString).length < 1 && typeof noResultsText != "undefined") {
            var noResultsHtml = '<p class="js-hub-error hub__error">' + noResultsText + '</p>';
            $(hubID + " .js-hub-content").before(noResultsHtml);
        }
    },
    filterByFormData: function(hubID){
        var curField, 
            curValue,
            isWeighted ="",
            fieldsUsed ="",
            a = 1,
            noResultsText = $(hubID).attr("data-no-results-text"),
            isWeighted = +$(hubID + " .js-hub-content").attr("data-filter-weight");

        // Reset data
        $(hubID + " .js-hub-item").removeClass("showing-by-filter").addClass("hidden-by-filter").attr("data-weight","0");
        
        // Remove any visable error messages
        if ( $(hubID + " .js-hub-error").length ) {
            $(hubID + " .js-hub-error").remove()
        }

        // filtered
        $(hubID + " .js-hub-filter-form select").each(function(){
            curField = $(this).attr("id");
            curValue = $(this).val();
            if(curValue != "none"){
                // weighted search
                if(isWeighted){
                    console.log("Hub ID: " + hubID + " Message: weighted running");
                    $(hubID + " .js-hub-mappings > li[" + curField + "='" + curValue + "']")
                    .parents(".js-hub-item").addClass("showing-by-filter").removeClass("hidden-by-filter").attr('data-weight','1');                        
                    fieldsUsed = fieldsUsed + "[" + curField + "='" + curValue + "']";
                    $(hubID + " .js-hub-mappings > li" + fieldsUsed).each(function(){
                    $(this).parents(".js-hub-item").addClass("showing-by-filter").removeClass("hidden-by-filter").attr('data-weight', a);  
                    })
                    a = a + 1;
                } else{
                    console.log("Hub ID: " + hubID + " Message: not-weighted running");
                    // Collecting select values in the loop
                    fieldsUsed = fieldsUsed + "[" + curField + "='" + curValue + "']";
                }
            }
        });
        
        // After filter values have been identified
        if(isWeighted){
            // Sort by relevancy
            hubFeature.sortHub(hubID,"data-weight", 1);
            
        } else { // Not Weighted also know as exact match
            
            console.log("Hub ID: " + hubID + " Message: fields matched " + fieldsUsed);
            // Using collected filter values to do an  exact match
            $(hubID + " .js-hub-mappings > li" + fieldsUsed).each(function(){
                $(this).parents(".js-hub-item").addClass("showing-by-filter").removeClass("hidden-by-filter");  
            });

            // Sorting data after filter (Needed if using nth-child stlying)
            var sorting = +$(hubID + " .js-hub-content").attr("data-sort");
            var sortingOrder = +$(hubID + " .js-hub-content").attr("data-sort-direction");
            var sortingCriteria = $(hubID + " .js-hub-content").attr("data-sort-criteria");
            if(sorting == 1){
                // resets the data and then applies a sort based on the date
                // The load more will trigger again when sort happens
                console.log("getting here");
                hubFeature.sortHub(hubID, sortingCriteria, sortingOrder);
            }
    

            console.log("Exact matches: " + $(hubID + " .js-hub-mappings > li" + fieldsUsed).length )

            // Added error message if no results found
            if ( $(hubID + " .js-hub-mappings > li" + fieldsUsed).length < 1 && typeof noResultsText != "undefined") {
                var noResultsHtml = '<p class="js-hub-error hub__error">' + noResultsText + '</p>';
                $(hubID + " .js-hub-content").before(noResultsHtml);
            }

        }
        
        // Reset Classes so load more is not accidently hidding anything
        hubFeature.loadMoreReset(hubID);

        // Aria Live message gets updated
        hubFeature.ariaMessaging(hubID);

    },
    loadMoreReset: function(hubID){
        // NOTE: Never add aria live into this function, it is triggered by too mmany other commands

        // then reveal the number of tiles set by the developer to set by default
        // This will be called in an each function
        
        var thisHub = $(hubID); // This gets the parent .js-content-load-more of the currently clicked .js-hub-load-more-button
        var maxLoad = +thisHub.attr('data-load-more-max');
        var overMax = 0; // By default you are not over maxLoad
        
        var setCount = 0; // This could be the default load count or it could be the current load count depending on if this event is trigged by on load or by a filter

        // get the ammount of tiles to be visable on load or reset
        if ( thisHub.attr('data-load-more-current') != null ) { // if it is not null then that means it has run before and we should ue current count instead of default
            setCount = +thisHub.attr('data-load-more-current');
            console.log("Hub ID: " + hubID + " Message: Current Already Exists")
        } else {
            setCount = +thisHub.attr('data-load-more-default'); // get the ammount of tiles to be visable on load
            thisHub.attr('data-load-more-current', setCount); // Set the current load ammount back to ammount of tiles to be visable on load
            console.log("Hub ID: " + hubID + " Message: Current  Does not Exist but is now set")
        }

        if ( setCount == 0 ) { // if set count is zero we need to make sure we know what maxload is
            setCount = maxLoad; // Set the current load ammount to maxload
            thisHub.attr('data-load-more-current', maxLoad); // Set the current load ammount to maxload
            console.log("Hub ID: " + hubID + " Message: Set count Updated");
        }
        
        //Find out if we are over maxLoad
        
        if ( (maxLoad != 0 && setCount >= maxLoad) ) { // Make sure maxLoad is not set to 0 and then check if current count is higher than max load
            overMax = 1;
            console.log("Hub ID: " + hubID + " Message: Over Max")
        } else if ( maxLoad == 0 ) { // If maxLoad is set to zero then we will never hit maxload
            overMax = 0;
            console.log("Hub ID: " + hubID + " Message: Not Over Max")
        }

        
        if( setCount > 0 && overMax == 0 ) { // if default load is higher than 0 and we are not over max load
            thisHub.find('.js-hub-item.showing-by-filter').removeClass('hidden-by-load showing-by-load'); // Show all tiles to start fresh
            console.log("fired if default load is higher than 0 and we are not over max load ")
            thisHub.find('.js-hub-item.showing-by-filter').addClass('hidden-by-load'); // Hide all tiles
            thisHub.find('.js-hub-item.showing-by-filter').slice(0, setCount).removeClass('hidden-by-load').addClass('showing-by-load');  // Show only the ammount of tiles to be visable on load
        } else {
            thisHub.find('.js-hub-item.showing-by-filter').removeClass('hidden-by-load showing-by-load'); // Show all tiles
        }
        
        if( overMax == 1 ) { // If we have hit our max show
            thisHub.find('.js-hub-item.showing-by-filter').removeClass('hidden-by-load showing-by-load'); // Show all tiles to start fresh
            thisHub.find('.js-hub-item.showing-by-filter').addClass('hidden-by-load'); // Hide all tiles
            thisHub.find('.js-hub-item.showing-by-filter').slice(0, maxLoad).removeClass('hidden-by-load').addClass('showing-by-load');  // Show only the max ammount of tiles
        }

        // By default the load more button is disabled
        if( thisHub.find('.js-hub-load-more-button').hasClass('enabled') || thisHub.find('.js-hub-load-more-button').hasClass('disabled') ) {
            if (thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').length == 0 || overMax == 1 ) { //    If the default ammount is so high there are no more hidden titles or if current load great than or equal to  maxload 
                thisHub.find('.js-hub-load-more-button').removeClass('enabled').addClass('disabled'); // Then hide the load more button
            } else {
                thisHub.find('.js-hub-load-more-button').removeClass('disabled').addClass('enabled'); // Then show the load more button
            }
        } else {
            // TODO: Delete this once all live sites are updated
            // By default the load more button is disabled
            if (thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').length == 0 || overMax == 1 ) { //    If the default ammount is so high there are no more hidden titles or if current load great than or equal to  maxload 
                thisHub.find('.js-hub-load-more-button').prop('disabled', true); // Then hide the load more button
            } else {
                thisHub.find('.js-hub-load-more-button').prop('disabled', false); // Then show the load more button
            }
            console.warn("CI Error - HUB: Is using outdated load more button");
        }




        hubFeature.wakeUpLazy(hubID);
        
    },
    ariaMessaging:  function(hubID) {
        var thisHub = $(hubID),
            resultsFoundText = thisHub.attr('data-results-found-text'),
            noResultsFoundText = thisHub.attr('data-no-results-text'),
            numberOfResults = +thisHub.find('.js-hub-item.showing-by-filter').length;

        // If HUB has Aria Live messaging setup
        if( thisHub.find('.js-aria-hub-msg').length ) {
            if( numberOfResults > 0 && typeof resultsFoundText !== "undefined") { // If there is results found
                thisHub.find('.js-aria-hub-msg').html(numberOfResults + " " + resultsFoundText);
            } else if( typeof noResultsFoundText !== "undefined") { // If there were no results found
                thisHub.find('.js-aria-hub-msg').html(noResultsFoundText);
            }
        }

    },
    wakeUpLazy: function(hubID) {
        
        // get recently processed
        $(hubID + ' .js-hub-item.showing-by-filter.showing-by-load .js-hub-lazy[data-src]').each(function(){
            var thisIMG = $(this).attr('data-src');
            $(this).attr('src', thisIMG).removeAttr("data-src");
        });

        
    }
}


// JQUERY READY FUNCTION  
$(function(){  
  // initiates hub
    console.log("Message: HUB JS INIT FOUND")
    if($(".js-hub").length){
        // in case we have multiple hubs on a page
        $(".js-hub").each(function(){
            var h = "#" + $(this).attr("id");
            var l = $(".js-hub[id='" + $(this).attr("id") + "']").length;
            // Error checking to prevent the HUB from inititing if the developer adds more than one HUB with the same ID on the page.
            if ( l > 1 ) {
                console.error("CI Error - HUB: Did not initiate due to there being multiple HUBs with the same ID.");
            } else {
                hubFeature.Init(h);
            }
        })
    }
})

