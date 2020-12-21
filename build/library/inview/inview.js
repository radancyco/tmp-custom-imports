
function ciIsElementPartiallyInViewport(el, TopViewPortOffset, BottomViewPortOffset)
{

    if( TopViewPortOffset == undefined || TopViewPortOffset == 'null') {
        TopViewPortOffset = 0;
    }
    if( BottomViewPortOffset == undefined || BottomViewPortOffset  == 'null' ) {
        BottomViewPortOffset = 0;
    }

    var rect = el.getBoundingClientRect();
    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    var vertInView = (rect.top <= (windowHeight - BottomViewPortOffset) ) && ((rect.top + rect.height) >= TopViewPortOffset);
    var horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

    return (vertInView && horInView);
}



function ciIsElementFullyInViewport(el, TopViewPortOffset, BottomViewPortOffset) 
{
    if( TopViewPortOffset == undefined || TopViewPortOffset == 'null') {
        TopViewPortOffset = 0;
    }
    if( BottomViewPortOffset == undefined || BottomViewPortOffset  == 'null' ) {
        BottomViewPortOffset = 0;
    }
    //special bonus for those using jQuery
    // if (typeof jQuery !== 'undefined' && el instanceof jQuery) el = el[0];

    var rect = el.getBoundingClientRect();
    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

    return (
           (rect.left >= 0)
        && (rect.top >= TopViewPortOffset)
        && ((rect.left + rect.width) <= windowWidth)
        && ((rect.top + rect.height) <= (windowHeight - BottomViewPortOffset))
    );

}


function ciIsElementPercentHeightInViewport(el, percentInView, TopViewPortOffset, BottomViewPortOffset )
{
    if( TopViewPortOffset == undefined || TopViewPortOffset == 'null') {
        TopViewPortOffset = 0;
    }
    if( BottomViewPortOffset == undefined || BottomViewPortOffset  == 'null' ) {
        BottomViewPortOffset = 0;
    }

    var rect = el.getBoundingClientRect();
    var windowHeight = (window.innerHeight || document.documentElement.clientHeight );

    // Take the percentage and convert it to get the remainder
    percentInView = (100 - percentInView);
    var offsetTopOfElememnt = (percentInView / 100) * rect.height;
    var offsetBottomOfElememnt = rect.height - offsetTopOfElememnt;

    var vertInView = (rect.top + offsetBottomOfElememnt <= (windowHeight - BottomViewPortOffset)  ) && ((rect.top + offsetTopOfElememnt)  >= TopViewPortOffset);

    return (vertInView);
}



// ---------------------------------------------
var ciInView = {

    Init: function(waitForCallback) {

        if( waitForCallback == undefined || waitForCallback == 'null') {
            waitForCallback = false;
        }
    
        var classToCheck = "prod-check-inView";
        // Specify the class that you want to add if what you're looking for is in viewport
        var classForElementInView = "element-exposed";
        var classToWaitFully = "prod-wait-till-fully-inView";
        var classToWaitTillHalf = "prod-wait-till-half-inView";
        var classToWaitTillSeventy = "prod-wait-till-mostly-inView";
        var classToRecheck = "prod-ivVew-recheck";
        // Create a list/array of objects based on what you're looking for
        var listenToList = document.getElementsByClassName(classToCheck);
        var arrayLength = listenToList.length;

        // TODO: Padd the offset messurments at any given time
        // var test = 0;

        //         // A developer could locally use 
        //         $(document).on('ciInViewCallBack', function (e) {

        //             test = e.detail.test;


        //         })


        // Don't trigger any of these scripts if the user has reders reduced motion on
        if(window.matchMedia('(prefers-reduced-motion: no-preference)').matches){
            if(waitForCallback) {
                $(document).on('ciInViewInit', function (e) {
                    // Check on fire
                    inview.Check(listenToList, arrayLength, classForElementInView, classToRecheck, classToWaitFully, classToWaitTillHalf, classToWaitTillSeventy)

                    // Check on scroll
                    window.addEventListener('scroll', function (event) {

                        inview.Check(listenToList, arrayLength, classForElementInView, classToRecheck, classToWaitFully, classToWaitTillHalf, classToWaitTillSeventy)

                    }, false);
                })
            } else {
                // Check on load
                inview.Check(listenToList, arrayLength, classForElementInView, classToRecheck, classToWaitFully, classToWaitTillHalf, classToWaitTillSeventy)

                // Check on scroll
                window.addEventListener('scroll', function (event) {

                    inview.Check(listenToList, arrayLength, classForElementInView, classToRecheck, classToWaitFully, classToWaitTillHalf, classToWaitTillSeventy)

                }, false);
            }
        
        }        





    },
    Check: function(listenToList, arrayLength, classForElementInView, classToRecheck, classToWaitFully, classToWaitTillHalf, classToWaitTillSeventy) {

        // if array is empty, don't continue to listen
        if(!listenToList.length) return false;
        // loop through the objects in list to see which ones are in viewport
        for (var i = 0; i < arrayLength; i++) {
            var currentItem = listenToList[i];
                        
            // console.log(currentItem)
            // console.log(curClasses)

            if (ciIsElementFullyInViewport(currentItem)) { // This will check to make sure thw ehole element that is going to animate is in the view[port
                // object is in the view port, create list of classes
                var curClasses = currentItem.classList;

                // if class has already been added, skip, otherwise append class to current list
                // Also make sure we wait till item is fully in view
                if( curClasses.contains(classToWaitFully) && !curClasses.contains(classForElementInView) ) {
                    curClasses = curClasses + " " + classForElementInView;
                    currentItem.setAttribute("class",curClasses);


                    if( currentItem.hasAttribute('data-inview-trigger') ) {
                        var triggerName = currentItem.getAttribute('data-inview-trigger');


                        var ciInView = new CustomEvent('ciInView', { detail: { 'trigger': triggerName, 'phase': 'FullyInView', 'element': currentItem } } );
                        document.dispatchEvent(ciInView);

                        
                    }
                }

            }
            if (ciIsElementPercentHeightInViewport(currentItem,75)) { // This will check to make sure thw ehole element that is going to animate is in the view[port
                var curClasses = currentItem.classList;

                // if class has already been added, skip, otherwise append class to current list
                // Also make sure we wait till item is fully in view
                if( curClasses.contains(classToWaitTillSeventy) && !curClasses.contains(classForElementInView) ) {
                    console.log('isElement75PercentHeightInViewport')

                    curClasses = curClasses + " " + classForElementInView;
                    currentItem.setAttribute("class",curClasses);
    

                    if( currentItem.hasAttribute('data-inview-trigger') ) {

                        var triggerName = currentItem.getAttribute('data-inview-trigger');

    

                        var ciInView = new CustomEvent('ciInView', { detail: { 'trigger': triggerName, 'phase': 'MostlyPercentInView', 'element': currentItem } } );
                        document.dispatchEvent(ciInView);
    
                    }
                }
        
            
            }
            if (ciIsElementPercentHeightInViewport(currentItem,50)) { // This will check to make sure thw ehole element that is going to animate is in the view[port
                var curClasses = currentItem.classList;

                // if class has already been added, skip, otherwise append class to current list
                // Also make sure we wait till item is fully in view
                if( curClasses.contains(classToWaitTillHalf) && !curClasses.contains(classForElementInView) ) {
                    curClasses = curClasses + " " + classForElementInView;
                    currentItem.setAttribute("class",curClasses);


                    if( currentItem.hasAttribute('data-inview-trigger') ) {
                        var triggerName = currentItem.getAttribute('data-inview-trigger');



                        var ciInView = new CustomEvent('ciInView', { detail: { 'trigger': triggerName, 'phase': 'HalfPercentInView', 'element': currentItem } } );
                        document.dispatchEvent(ciInView);
                    }
                }

    
            }

            if (ciIsElementPartiallyInViewport(currentItem)) { // this will check to see if the elment is partially in view
                var curClasses = currentItem.classList;

                // if class has already been added, skip, otherwise append class to current list
                if( !curClasses.contains(classForElementInView) && !curClasses.contains(classToWaitFully) && !curClasses.contains(classToWaitTillHalf) && !curClasses.contains(classToWaitTillSeventy) ){
                    curClasses = curClasses + " " + classForElementInView;
                    currentItem.setAttribute("class",curClasses);
                    console.log('isElementPartiallyInViewport')

                    

                    if( currentItem.hasAttribute('data-inview-trigger') ) {

                        var triggerName = currentItem.getAttribute('data-inview-trigger');

                        var ciInView = new CustomEvent('ciInView', { detail: { 'trigger': triggerName, 'phase': 'PartiallyInView', 'element': currentItem } } );
                        document.dispatchEvent(ciInView);
    
                    }

                }
            } else 
            if ( !ciIsElementPartiallyInViewport(currentItem) ) {
                var curClasses = currentItem.classList;

                // if the "exposed class" has already been added and the classToRecheck is present then remove that class so the item can reanimate
                if( curClasses.contains(classToRecheck) && curClasses.contains(classForElementInView) ) {
                    currentItem.classList.toggle(classForElementInView);
                    console.log('isElementNOTInViewport')

                    if( currentItem.hasAttribute('data-inview-trigger') ) {
                        var triggerName = currentItem.getAttribute('data-inview-trigger');
    
                        var ciInView = new CustomEvent('ciInView', { detail: { 'trigger': triggerName, 'phase': 'NotInView', 'element': currentItem } } );
                        document.dispatchEvent(ciInView);
    
                    }

                    // var curAnimation = listenToList[i].getAttribute('data-name');

                    // if( AnimationsLoaded && LottieLoaded ) {
                    //   lottie.stop(curAnimation);
                    // }
                }

            }
        }
    }









}
