// TODO: Minify JS (Probably need to make sure all for custom imports is minified)
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
                    // TODO: Fix aria live reading. Spell said "As for Reset, let's leave it alone for now. i think it should be fine for time being, but would like to reach out to so some friends on the matter for further advice."
                    // Brock's suggetsion is just change aira live to assertive
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
        $(hubID + ' .js-hub-load-more-button').on('click', function (e) {
            e.preventDefault();

            var hubID = "#" + $(this).attr("data-hub-id");
            thisHub = $(hubID),
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
                if ( matches("?custom-debug", url) ) {
                    console.log("Hub ID: " + thisHub.attr('id') + " Message: Over Max")
                }
            } else if ( maxLoad == 0 ) { // If maxLoad is set to zero then we will never hit maxload
                overMax = 0;
                if ( matches("?custom-debug", url) ) {
                    console.log("Hub ID: " + thisHub.attr('id') + " Message: Not Over Max")
                }
            }
            
            if( overMax == 1 ) { // If we have hit our max show
                thisHub.find('.js-hub-item.showing-by-filter').removeClass('hidden-by-load showing-by-load'); // Show all tiles to start fresh
                thisHub.find('.js-hub-item.showing-by-filter').addClass('hidden-by-load'); // Hide all tiles
                thisHub.find('.js-hub-item.showing-by-filter').slice(0, maxLoad).removeClass('hidden-by-load').addClass('showing-by-load');  // Show only the max ammount of tiles
            } 

            // Once all the correct ammount of items are show then load images
            hubFeature.wakeUpLazy(hubID);

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
                if (thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').length == 0 || overMax == 1 ) { //    If the default ammount is so high there are no more hidden titles or if current load great than or equal to  maxload 
                    thisHub.find('.js-hub-load-more-button').removeClass('enabled').addClass('disabled'); // Then hide the load more button
                } else {
                    thisHub.find('.js-hub-load-more-button').removeClass('disabled').addClass('enabled'); // Then show the load more button
                }
                console.warn("CI Error - HUB: Is using outdated load more button");
            }

            
        });
        
    },
    setupPreFilters: function(hubID,setupFilters){
        var dFacet,
        dFacetValue,
        dKeepMapping = +$(hubID).attr("data-keepmappings"),
        dNarrowMappings = +$(hubID).attr("data-narrowmappings");
        $(hubID + " .js-hub-prefilter").each(function(i){ // loop through each prefilter

            dValue = $(this).attr("data-query"); // prefilter data

            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Narrow Prefilters: " + dNarrowMappings)
            }

            if( dNarrowMappings == 0 || isNaN(dNarrowMappings) ) { // Each prefilter adds to the results NOTE: if data-narrowmappings is not setup it will aways add and not narrow
                
                $(hubID + " .js-hub-mappings li" + dValue).each(function(i){
                    $(this).addClass("js-keep-data").parents(".js-hub-item").addClass("pre-filtered");
                }).promise().done(function(){

                    $(hubID + " .js-hub-item:not(.pre-filtered)").remove(); // Remove the tile from the page if it is not apart of the prefilter

                })

            } else if ( dNarrowMappings == 1 ) { // Each prefilter Narrows the results
                
                $(hubID + " .js-hub-mappings").each(function(){ // Loop through each items mappings

                    $(this).parents(".js-hub-item").removeClass("pre-filtered"); // reset from last prefilter loop

                    $(this).children("li").each(function(){ // Loop through each mapping in this item

                        if( $(this).filter(dValue).length > 0 ) {
                            $(this).addClass("js-keep-data").parents(".js-hub-item").addClass("pre-filtered");
                        } 

                    }) // end js-hub-mappings li loop

                }).promise().done(function(){

                    $(hubID + " .js-hub-item:not(.pre-filtered)").remove(); // Remove the tile from the page if it is not apart of the prefilter

                }) // end js-hub-mappings loop

            }

        }) // end js-hub-prefilter loop

        if( dKeepMapping == 0) { // Remove mappings so that it does not show other mappings in form when filtering
            $(hubID + " .js-hub-mappings li:not(.js-keep-data)").remove();
            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Mappings Deleted");
            }
        }

        if(setupFilters == 1){
            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: FINISHED");
            }
            hubFeature.setupFilters(hubID);
        }

        // Reset and sort
        hubFeature.resetData(hubID);

        // Added error message if no results found for the prefilters
        var noResultsText = $(hubID).attr("data-no-prefiltered-results-text");
        if ( $(hubID + " .pre-filtered.showing-by-filter").length < 1 && typeof noResultsText != "undefined") {
            var noResultsHtml = '<p class="js-hub-error hub__error">' + noResultsText + '</p>';
            $(hubID + " .js-hub-content").before(noResultsHtml);
        }
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
                    // Check to make sure the value is unique before adding it to the array
                    if ($.inArray(v, keyA) == -1) keyA.push(v);

                }
            })
            
            keyA.sort();
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
            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Sorting using Date based caluations");
            }
        }

        if ( matches("?custom-debug", url) ) {
            console.log("Hub ID: " + hubID + " Message: Sort criteria - " + criteria);
            if ( order == 1 || order == 2  ) {
                console.log("Hub ID: " + hubID + " Message: Sort Order - 1 Descending");
            } else if ( order == 1 || order == 2  ) {
                console.log("Hub ID: " + hubID + " Message: Sort Order - 2 Ascending");
            } else if ( order == 1 || order == 2  ) {
                console.log("Hub ID: " + hubID + " Message: Sort Order - 0 Random");
            }
        }

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
            // Brock's suggetsion is just change aira live to assertive
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

        if ( matches("?custom-debug", url) ) {
            console.log('Hub ID: ' + hubID + '  Message: Button Data - ' + getString); 
        }
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
            fieldsUsed = [],
            a = 1,
            noResultsText = $(hubID).attr("data-no-results-text"),
            isWeighted = +$(hubID + " .js-hub-content").attr("data-filter-weight"),
            numberOfResults;

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
                // Collecting select values in the loop
                fieldsUsed.push("[" + curField + "='" + curValue + "']");
            }
        }).promise().done(function(){
            if ( matches("?custom-debug", url) ) {
                // weighted search
                if(isWeighted){
                    
                    console.log("Hub ID: " + hubID + " Message: weighted running");
                } else { // Each Match
                    console.log("Hub ID: " + hubID + " Message: eact match running");
                }

                console.log("Hub ID: " + hubID + " Message: fields to match on " + fieldsUsed);
            }

            // Reset the number of results at the start of each new appying of filters
            numberOfResults = 0;

            $(hubID + " .js-hub-mappings").each(function(){ // Loop through each items mappings

                var thisMapping = $(this),
                numberOfMatchesPerCard = 0,
                weight = 0;

                $.each(fieldsUsed, function(i, val){

                    // For this Field we only want one match but need to reset pre fieldsUsed
                    singleMatch = false;

                    // Loop through each mapping in this item
                    thisMapping.children("li").each(function(){ 

                        if( singleMatch == false ) {

                            if( $(this).filter(val).length > 0 ) {
                                numberOfMatchesPerCard++
                                singleMatch = true;
                                if(isWeighted){
                                    // First we evaluate what the value should be added to weighted match if there this value matches
                                    // Each addtional value is worth less
                                    calulatedValue = parseFloat( 1 / (i+1) );
                                    // Adding the calulated weight to any previous weight
                                    weight = weight + calulatedValue;
                                }
                            }

                            if ( matches("?custom-debug", url) ) {
                                // Added class on each mapping to show what was checked
                                $(this).addClass("checked-" + i + "-" + val)
                            }
                        }
                        

                    })// end LI loop inside each item mapping

                })// end of fieldsUsed loop

                if(isWeighted){ // What makes weighted match work
                    if(numberOfMatchesPerCard > 0) {
                        thisMapping.parents(".js-hub-item").addClass("showing-by-filter").removeClass("hidden-by-filter").attr('data-weight', weight.toFixed(2) );
                        numberOfResults++
                    } 
                } else { // What makes exact match work
                    if(numberOfMatchesPerCard == fieldsUsed.length) {
                        thisMapping.parents(".js-hub-item").addClass("showing-by-filter").removeClass("hidden-by-filter"); 
                        numberOfResults++
                    } 
                }

            }) // end js-hub-mapping loop and end of new exact match

        if(isWeighted){

            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Weighted matches - " + numberOfResults )
            }

            // If weight match then sort based on weight
            hubFeature.sortHub(hubID,"data-weight", 1);

        } else {

            // if exacth match sort based on set critira 
            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Exact matches - " + numberOfResults )
            }

            // Sorting data after filter (Needed if using nth-child stlying)
            var sorting = +$(hubID + " .js-hub-content").attr("data-sort");
            var sortingOrder = +$(hubID + " .js-hub-content").attr("data-sort-direction");
            var sortingCriteria = $(hubID + " .js-hub-content").attr("data-sort-criteria");
            if(sorting == 1){
                // resets the data and then applies a sort based on the date
                // The load more will trigger again when sort happens
                hubFeature.sortHub(hubID, sortingCriteria, sortingOrder);
            }
        }


        // Added error message if no results found
        if ( numberOfResults < 1 && typeof noResultsText != "undefined") {
            var noResultsHtml = '<p class="js-hub-error hub__error">' + noResultsText + '</p>';
            $(hubID + " .js-hub-content").before(noResultsHtml);
        }


        
        // Reset Classes so load more is not accidently hidding anything
        hubFeature.loadMoreReset(hubID);

        // Aria Live message gets updated
        hubFeature.ariaMessaging(hubID);

    })

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
            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Current Already Exists")
            }
        } else {
            setCount = +thisHub.attr('data-load-more-default'); // get the ammount of tiles to be visable on load
            thisHub.attr('data-load-more-current', setCount); // Set the current load ammount back to ammount of tiles to be visable on load
            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Current  Does not Exist but is now set")
            }
        }

        if ( setCount == 0 ) { // if set count is zero we need to make sure we know what maxload is
            setCount = maxLoad; // Set the current load ammount to maxload
            thisHub.attr('data-load-more-current', maxLoad); // Set the current load ammount to maxload
            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Set count Updated");
            }
        }
        
        //Find out if we are over maxLoad
        
        if ( (maxLoad != 0 && setCount >= maxLoad) ) { // Make sure maxLoad is not set to 0 and then check if current count is higher than max load
            overMax = 1;
            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Over Max")
            }
        } else if ( maxLoad == 0 ) { // If maxLoad is set to zero then we will never hit maxload
            overMax = 0;
            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Not Over Max")
            }
        }

        
        if( setCount > 0 && overMax == 0 ) { // if default load is higher than 0 and we are not over max load
            thisHub.find('.js-hub-item.showing-by-filter').removeClass('hidden-by-load showing-by-load'); // Show all tiles to start fresh
            if ( matches("?custom-debug", url) ) {
                console.log("Hub ID: " + hubID + " Message: Fired if default load is higher than 0 and we are not over max load ")
            }
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
        if (thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').length == 0 || overMax == 1 ) { //    If the default ammount is so high there are no more hidden titles or if current load great than or equal to  maxload 
            thisHub.find('.js-hub-load-more-button').removeClass('enabled').addClass('disabled'); // Then hide the load more button
        } else {
            thisHub.find('.js-hub-load-more-button').removeClass('disabled').addClass('enabled'); // Then show the load more button
        }

        // Make sure visable items have images
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
    if ( matches("?custom-debug", url) ) {
        console.log("Message: HUB JS INIT FOUND")
    }
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

