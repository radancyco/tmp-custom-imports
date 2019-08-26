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
            
            if(hubID != undefined){
                if(valsExist != ""){
                    hubFeature.filterData(hubID);
                    $(hubID).addClass("filtered");
                    $(hubID + " .js-hub-reset-filters").prop('disabled', false);

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
                    $(hubID).removeClass("filtered");
                    $(hubID + " .js-hub-reset-filters").prop('disabled', true);
                    $(hubID + " .js-hub-submit-filters").prop("disabled", true);
                    hubFeature.resetData(hubID);
                }
            }
        });

        //===============================
        //Listening for filters to be selected
        $(hubID + " .js-hub-filter-form select").change(function(){
            if($(this).val() != "none"){
                $(hubID + " .js-hub-submit-filters").prop("disabled", false);
            }
        });



        //===============================
        //filter by buttons click event  including what to do if it is the reset button
        $(".js-hub-filter-button").click(function(i){
            i.preventDefault();
            var hubID = "#" + $(this).attr("data-hub-id");
            
            if(!$(this).hasClass("current-active")){

                $(hubID + " .js-hub-filter-button").removeClass("current-active");
                $(this).addClass("current-active");
                
                if($(this).hasClass("js-hub-filter-button-reset")){ // If this is the reset button then do the following
                    hubFeature.resetData(hubID);
                    // setTimeout(function(){
                    //     hubFeature.applyDateSort(hubID);
                    // }, 250); 
                } else  { // IF this is a regular filter button
                    var bValue = $(this).attr("data-query");
                    hubFeature.preFilterData(hubID, bValue);
                }
                
            }
        })
        
        //===============================
        // The load more system 
        // is initialized by the setup filters function when resetData runs
    
        // Load more button functionality
        // This will reveal more per click
        $('.js-hub-load-more-button').on('click', function (e) {
            e.preventDefault();

            
            var thisHub = $(this).closest('.js-hub'); // This gets the parent .js-content-load-more of the currently clicked .js-hub-load-more-button
            defaultLoadCount = +thisHub.attr('data-load-more-default'); // Following variables affect how many are shown per click Adding "+" in front of the variable makes it an integer
            loadMore = +thisHub.attr('data-load-more-amount'),
            currentLoad = +thisHub.attr('data-load-more-current');
            maxLoad = +thisHub.attr('data-load-more-max');
            var overMax = 0; // By default you are not over maxLoad
            
            // Prep fopr focus event
            thisHub.find('.js-hub-item').removeClass('focusHere');
            thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').slice(0, 1).addClass('focusHere'); // Adds a targetable class that we can focus to once the user has clicked load more
            
            if( loadMore == 0 ) { // if load more setting is set to zero then show all 
                thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').removeClass('hidden-by-load').addClass('showing-by-load'); // show all tilest
                currentLoad = maxLoad; // set current load to maxload so that
            } else {
                thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').slice(0, loadMore).removeClass('hidden-by-load').addClass('showing-by-load'); // Revals X ammount of more tiles based on the data-content-load-more-ammount set
                currentLoad = currentLoad + loadMore; // Get the new current load ammount by adding the previous current to how many were just shown
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
            
            // Focus Event
            thisHub.find('.focusHere .js-hub-item-link')[0].focus() // Focuses user to the link to the newly reveals content title
            
            

            thisHub.attr('data-load-more-current', currentLoad); // Set the new current load ammount

            
            // By default the load more button is disabled
            if (thisHub.find('.js-hub-item.showing-by-filter.hidden-by-load').length == 0 || overMax == 1 ) { //    If the default ammount is so high there are no more hidden titles or if current load great than or equal to  maxload 
                thisHub.find('.js-hub-load-more-button').prop('disabled', true); // Then hide the load more button
            } else {
                thisHub.find('.js-hub-load-more-button').prop('disabled', false); // Then show the load more button
            }
            
        });
        
    },
    setupPreFilters: function(hubID,setupFilters){
        var dFacet,
        dFacetValue,
        dKeepMapping = +$(hubID).attr("data-keepmappings");
        $(hubID + " .js-hub-prefilter").each(function(i){
            // dFacet = $(this).attr('data-facet');
            // dFacetValue = $(this).attr('data-facet-value');
            
            dValue = $(this).attr("data-query");
            $(hubID + " .mappings li" + dValue).each(function(i){
                console.log(i);
                $(this).addClass("js-keep-data").parent().parent().addClass("pre-filtered");
            })
            
        })

        if( dKeepMapping == 0) { // Remove mappings so that it does not show other mappings in form when filtering
            $(hubID + " .mappings li:not(.js-keep-data)").remove();
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
            $(hubID + " .js-hub-content .mappings li[" + thisFilter + "]").each(function(w){
                var v = $(this).attr(thisFilter);
                if(v != "ALL"){
                    keyA.push(v);
                }
            })
            
            keyA.sort();
            keyA = $.uniqueSort(keyA);
            // add options to the keyword field
            $.each( keyA, function( i, value ) {
                $(hubID + " select#" + thisFilter).append("<option value='" + value + "'>" + value + "</option>");
            });
            keyA = [];
        });
        
        // Check attributes to sort by date
        var dateSorting = $(hubID + " .js-hub-content").attr("data-date-sort");
        hubFeature.resetData(hubID);
    },
    applyDateSort: function(hubID){
        // Arranges list items in DESC order by default  
        // http://jsfiddle.net/greguarr/2fr0vmhu/
        var container = $(hubID + " .js-hub-content");
        var items = $(hubID + " .js-hub-item");
        var direction = $(hubID + " .js-hub-content").attr("data-date-direction");
        console.log("SORTING DATE");

        // Drews Method
        // if(!$(hubID).hasClass("date-initialized")){
        //     items.each(function() {
        //     // Convert the string in 'data-event-date' attribute to a more
        //     // standardized date format
        //         var BCDate = $(this).attr("data-hub-date-updated").split(" ")[0];
        //         BCDate = BCDate.split("/");
        //         var standardDate = BCDate[0]+"-"+BCDate[1]+"-"+BCDate[2];
        //         standardDate = new Date(standardDate).getTime();
        //         $(this).attr("data-hub-date-updated-sorting", standardDate);  
        //     });
        //     $(hubID).addClass("date-initialized")  
        // }
    
        // items.sort(function(a,b){
        //     a = parseFloat($(a).attr("data-hub-date-updated-sorting"));
        //     b = parseFloat($(b).attr("data-hub-date-updated-sorting"));
        //     return a<b ? -1 : a>b ? 1 : 0;
        // }).each(function(){
        //     container.prepend(this);
        // });

        /// Brox Method
        var itemsOrdered = items.detach().get();

        itemsOrdered.sort(function(a,b){
            a = new Date($(a).attr("data-hub-date-updated")).getTime();
            b = new Date($(b).attr("data-hub-date-updated")).getTime();
            return a>b ? -1 : a<b ? 1 : 0;
        });

        container.append(itemsOrdered);

    },
    randomSort:function(hubID, selector){
            $parents = $(hubID + " .js-hub-content");
        $parents.each(function(){
            $(this).children(selector).sort(function(){
                return Math.round(Math.random()) - 0.5;
            }).detach().appendTo(this);
        });
        
        return this;
    },
    exactSort:function(hubID){
        var topPosts = $(hubID + " .js-hub-item.showing-by-filter");
        var bottomPosts = $(hubID + " .js-hub-item:not(.showing-by-filter)");
        $(hubID + " .js-hub-content").empty()
        
        topPosts.each(function(i){
            var newItem = $(this);
            $(newItem).appendTo($(hubID + " .js-hub-content"));
        })
        bottomPosts.each(function(i){
            var newItem = $(this);
            $(newItem).appendTo($(hubID + " .js-hub-content"));
        })


        /* Exact Match */
        /* console.log('running exact sort');
        var topList = $(hubID + " .js-hub-item.showing-by-filter");
        var bottomList = topList + $(hubID + " .js-hub-item:not(.showing-by-filter)");
        $(hubID + " .js-hub-content").empty();
        bottomList.appendTo($(hubID + " .js-hub-content"));
        topList.appendTo($(hubID + " .js-hub-content"));
        */
    },
    filterSort: function(hubID){
    // sort done after filters applied and is done by weight  
    $(hubID + " .js-hub-item").sort(sort_li).appendTo(hubID + " .js-hub-content");
    
    function sort_li(a, b) {
        console.log("Hub ID: " + hubID + " Message: sort LI ran");
        return ($(b).attr('data-weight')) > ($(a).attr('data-weight')) ? 1 : -1;
    }
    
    },
    resetData: function(hubID){

        // Remove load more classes
        $(hubID + " .js-hub-item").removeClass('hidden-by-load showing-by-load hidden-by-filter').attr('data-weight','0').addClass("showing-by-filter");
        var dateSorting = +$(hubID + " .js-hub-content").attr("data-date-sort");
        if(dateSorting == 1){
            // resets the data and then applies a sort based on the date
            console.log("getting here");
            hubFeature.applyDateSort(hubID);
        }
        
        // reset filters
        $(hubID + " .js-hub-filter-form select").each(function(){
            var gID = "#" + $(this).attr("id"); 
            $(hubID + " .js-hub-filter-form " + gID + " option" ).prop('selected', function() {
                return this.defaultSelected;
            })
        })
        

        // Reset Classes so load more is not accidently hidding anything
        hubFeature.loadMoreReset(hubID);

        
    },  
    preFilterData:function(hubID, dataAttrString){
        var getString = dataAttrString;
        console.log(getString); 
        $(hubID + " .js-hub-item").removeClass("showing-by-filter").addClass("hidden-by-filter").attr("data-weight","0");
        $(hubID + " ul.mappings > li" + getString)
            .parent().parent().addClass("showing-by-filter").removeClass("hidden-by-filter").attr('data-weight','1');

            // Reset Classes so load more is not accidently hidding anything
            hubFeature.loadMoreReset(hubID);
    },
    filterData: function(hubID){
        var curField, 
            curValue,
            isWeighted ="",
            fieldsUsed ="",
            a = 1;
        isWeighted = $(hubID + " .js-hub-content").attr("data-filter-weight");
        $(hubID + " .js-hub-item").removeClass("showing-by-filter").addClass("hidden-by-filter").attr("data-weight","0");
        
        // filtered
        $(hubID + " .js-hub-filter-form select").each(function(){
            curField = $(this).attr("id");
            curValue = $(this).val();
            if(curValue != "none"){
                // weighted search
                if(isWeighted == "1"){
                    console.log("Hub ID: " + hubID + " Message: weighted running");
                    $(hubID + " ul.mappings > li[" + curField + "='" + curValue + "']")
                        .parent().parent().addClass("showing-by-filter").removeClass("hidden-by-filter").attr('data-weight','1');                        
                    fieldsUsed = fieldsUsed + "[" + curField + "='" + curValue + "']";
                    $(hubID + " ul.mappings > li" + fieldsUsed).each(function(){
                    $(this).parent().parent().addClass("showing-by-filter").removeClass("hidden-by-filter").attr('data-weight', a);  
                    })
                    a = a + 1;
                } else{
                    console.log("Hub ID: " + hubID + " Message: not-weighted running");
                    fieldsUsed = fieldsUsed + "[" + curField + "='" + curValue + "']";
                    $(hubID + " ul.mappings > li" + fieldsUsed).each(function(){
                    $(this).parent().parent().addClass("showing-by-filter").removeClass("hidden-by-filter");  
                    })
                }
            }
        });
        
        // not weighted
        if(isWeighted != "1"){
            console.log("Hub ID: " + hubID + " Message: fields matched " + fieldsUsed);
            $(hubID + " ul.mappings > li" + fieldsUsed).each(function(){
                $(this).parent().parent().addClass("showing-by-filter").removeClass("hidden-by-filter");  
            });
            hubFeature.exactSort(hubID);
            
        } else{
            hubFeature.filterSort(hubID);
        }
        
        // Reset Classes so load more is not accidently hidding anything
        hubFeature.loadMoreReset(hubID);
    },
    loadMoreReset: function(hubID){
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
            console.log("Hub ID: " + hubID + " Message: Set count Updated")
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
            thisHub.find('.js-hub-item').removeClass('focusHere'); // Remove any special focus classes
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
            thisHub.find('.js-hub-load-more-button').prop('disabled', true); // Then hide the load more button
        } else {
            thisHub.find('.js-hub-load-more-button').prop('disabled', false); // Then show the load more button
        }
        
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
            hubFeature.Init(h);
        })
    }
})