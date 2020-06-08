// The prod verison of this file exists on https://services1.tmpwebeng.com/custom-imports/custom-imports.js

// Check to See if Jquery is running, if it is not report the error as this script and many of the scripts is calls requires jQuery
if (!window.jQuery) {
    console.error("CI Debug - Error: jQuery is needed for the Custom Imports script to work");
}

// Function to get parameters often times found in urls after a ?
// Use case:
// getParameter("scripts","www.brock.com/?scripts=charts,inpagenav,inview?no-styles=charts?no-dependencies=inview")
// Expected result: ["charts", "inpagenav", "inview"]
function getParameter(name, source) {
    var regex = new RegExp('[^&?]*?' + name + '=([^&?]*)');
    if ( regex.test(source) ) {
        var results = regex.exec(source);
        var array = results[1].toString().split(',');
    } else {
        var array = "";
    }
    return array;
};

// Function to test if object exists
// Use case:
// if ( $('.ClassName').exists() ) { }
jQuery.fn.exists = function(){return ($(this).length > 0);};

// Function to test if string or array have a match
// Use case:
// var fruits = ["Banana", "Orange", "Apple", "Mango"];
// matches("apple", fruits);
// This has a built in default of false if the source is not present
function matches(name, source) {
    if ( typeof name != 'undefined' && typeof source != 'undefined' ) {
        var name = name.toString().toLowerCase();
        var source = source.toString().toLowerCase();
        return (source.indexOf(name) > -1);
    } else {
        return false;
    }
};


// Function to check to see if URL exists and report its status code
// Originally from https://stackoverflow.com/a/3915698/5476295

function UrlExists(url, cb){
    jQuery.ajax({
        url:      url,
        dataType: 'text',
        type:     'GET',
        complete:  function(xhr){
            if(typeof cb === 'function')
            cb.apply(this, [xhr.status]);
        }
    });
}

// PollyFill for Event
(function () {
    if ( typeof window.CustomEvent === "function" ) return false; // Check to make sure CustomEvent is not a function

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.Event = CustomEvent;
})();

// PollyFill for Includes
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

// Debounce Fundtion
// Use case:
// var myEfficientFn = debounce(function() {
// 	// All the taxing stuff you do
// }, 250);
// $(window).on('resize', myEfficientFn);
// By default this triggers at the end of the event tiggering however 
// If 'immediate' is passed, it will trigger the function on the
// leading edge, instead of the trailing. As seen here
// var rightAwayFn = debounce(function() {
// 	// All the taxing stuff you do
// }, 250, 'immediate');
// $(window).on('resize', rightAwayFn);
function ciDebounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// Variable needed to see if QA script has been ran
if (typeof qaMode === 'undefined') {
    var qaMode = "";
}

// Variable needed to see if Local script has been 
if (typeof localMode === 'undefined') {
    var localMode = "";
    var localModePath = "";
}

// Set global vairable for url
var url = window.location.href;

// The following document ready code will determine what version of the script will run
// if there are no additional parameters in the url of thr browser it will load the production version of the script
// if it contains ?custom-local-mode it will load the local version of the script
// if it contains ?custom-qa-mode it will load the qa version of the script
// if it contains ?custom-debug, it will not change what version of the script is running but it will so all the console logs


(function() { // On Document ready


    // Check URL and see if it wants qa version or prod

    if ( matches("?custom-qa-mode", url) ) {
    
        // Check variable to make sure it is empty so that a loading script loop does not happen
        if ( qaMode == "" ) {
            // set qaMode to true do it does not load the script again
            qaMode = true;
            localMode = false;
            // Load the QA version of the custom script located on github
            $.getScript("https://tmpworldwide.github.io/tmp-custom-imports/build/custom-imports.js", function() {
                alert("Custom Imports QA Script now loaded");
                customImports();
            });
        }
    } else if ( matches("?custom-local-mode", url) ) {
    
        // Check variable to make sure it is empty so that a loading script loop does not happen
        if ( localMode == "" ) {
            // set qaMode to true do it does not load the script again
            localMode = true;
            qaMode = false;
            // Load the local version of the custom script located on github


            $.getScript("http://localhost/sites/tmp-custom-imports/build/custom-imports.js", function() {
                alert("Custom Imports Local Script now loaded");
                localModePath = "http://localhost/sites/tmp-custom-imports/build/";
                customImports();
            }).fail(function(){
                $.getScript("http://localhost:61651/tmp-custom-imports/build/custom-imports.js", function() {
                    alert("Drew's custom path  for Custom Imports Local Script now loaded");
                    localModePath = "http://localhost:61651/tmp-custom-imports/build/";
                    customImports();
                })
            });
        }

    } else {
        // Set QA and local mode to false so the script does not run again
        qaMode = false;
        localMode = false;
        // Run the script as normal
        customImports();
    }

})();  // end on doc ready

//
// The function that will call all other functions
//
function customImports() {
    // In console if url contains ?custom-debug then 
    // print to the console which version of the script is running
    if ( matches("?custom-debug", url) ) {
        if ( qaMode ) {
        console.log("CI Debug - Loading: QA Script")
        } else if ( localMode ) {
            console.log("CI Debug - Loading: Local Script")
        } else {
            console.log("CI Debug - Loading: Prod Custom Imports")
        }
    }

    // Global variable for paths for scripts
    var scriptPath = "https://services1.tmpwebeng.com/custom-imports/"
    if ( qaMode ) {
        scriptPath = "https://tmpworldwide.github.io/tmp-custom-imports/build/";
    } else if ( localMode ) {
        scriptPath = localModePath;
    }

    // Find parameters from the src of script file
    // please note script tag MUST contain ID js-custom-imports

    // when calling script you tell it what you want to do based on your url parameter. The main parameter is "scripts" wring like "?scripts=charts" 
    // if you want to put multiple scripts you can put in a comma like "?scripts=charts,inpagenav,inview"
    // By default the script will load dependencies and css

    if ( $('script#js-custom-imports').exists() ) { 

        // Variables of parameters
        var scriptSrc = $('script#js-custom-imports').attr('src');
        var scripts = getParameter("scripts", scriptSrc);
        var css = getParameter("css", scriptSrc);
        var noStyles = getParameter("no-styles", scriptSrc);
        var noDepends = getParameter("no-dependencies", scriptSrc);
        
        // Debug report of what is in the variables
        if ( matches("?custom-debug", url) ) {
            console.log("CI Debug - script src: " + scriptSrc)
            console.log("CI Debug - scripts param: " + scripts)
            console.log("CI Debug - css param: " + css)
            console.log("CI Debug - noStyles param: " + noStyles)
            console.log("CI Debug - noDepends param: " + noDepends)
        }

        // If there are script parameters
        // This will likely be libraries frequently used like slick slider or custom scripts written
        // for front-end devs to use
        if( scripts ) {
            // alert("script parameters found")


            // Charts script
            // if charts is present in the scripts param
            if ( matches("charts", scripts) ) {

                // Load styles for charts script
                if ( !matches("charts", noStyles) ) {
                    $('head').append( $('<link rel="stylesheet" type="text/css" href="' + scriptPath + "library/charts/charts.css" + '" />'));
                }

                // check to see if dependancy param on D3 is turned off
                if ( matches("charts", noDepends) ) {
                    // Run the charts script with out loading in D3 first
                    $.getScript( scriptPath + "library/charts/charts.js", function() {
                        if ( matches("?custom-debug", url) ) {
                            console.log("CI Debug - Charts Script: Loaded")
                        }
                    });
                } else {
                    // Run D3
                    $.getScript( scriptPath + "library/d3/d3.v5.min.js", function() {
                        if ( matches("?custom-debug", url) ) {
                            console.log("CI Debug - Charts Script: D3 Dependancy Loaded")
                        }
                        // After D3 runs then run the charts script
                        $.getScript( scriptPath + "library/charts/charts.js", function() {
                            if ( matches("?custom-debug", url) ) {
                                console.log("CI Debug - Charts Script: Loaded")
                            }
                        });

                    });


                }
            } // End Charts Script


            // Video script
            // if Video is present in the scripts param
            if ( matches("video", scripts) ) {

                // Load styles for video script
                if ( !matches("charts", noStyles) ) {
                    $('head').append( $('<link rel="stylesheet" type="text/css" href="' + scriptPath + "library/video/video.css" + '" />'));
                }

                // check to see if dependancy param on D3 is turned off
                if ( matches("video", noDepends) ) {
                    // Run the charts script with out loading in D3 first
                    $.getScript( scriptPath + "library/video/video.js", function() {
                        if ( matches("?custom-debug", url) ) {
                            console.log("CI Debug - Video Script: Loaded")
                        }
                    });
                } else {

                    // Load styles for Fancybox
                    if ( !matches("fancybox", noStyles) ) {
                        $('head').append( $('<link rel="stylesheet" type="text/css" href="' + scriptPath + "library/fancybox/jquery.fancybox.min.css" + '" />'));
                    }

                    // Run FancyBox3
                    $.getScript( scriptPath + "library/fancybox/jquery.fancybox.min.js", function() {
                        if ( matches("?custom-debug", url) ) {
                            console.log("CI Debug - Video Script: FancyBox3 Dependancy Loaded")
                        }
                        // After FancyBox3 runs then run the Video script
                        $.getScript( scriptPath + "library/video/video.js", function() {
                            if ( matches("?custom-debug", url) ) {
                                console.log("CI Debug - Video Script: Loaded")
                            }
                        });

                    });

                }
            } // End Video Script

            // HUB script
            // if hub is present in the scripts param
            if ( matches("hub", scripts) ) {

                if ( matches("?custom-debug", url) ) {
                    console.log("CI Debug - HUB Script: request detected")
                }

                // Load styles for hub script
                if ( !matches("charts", noStyles) ) {
                    $('head').append( $('<link rel="stylesheet" type="text/css" href="' + scriptPath + "library/hub/hub-functionality.css" + '" />'));
                }

                // Run Script

                $.getScript( scriptPath + "library/hub/hub.js", function() {
                    if ( matches("?custom-debug", url) ) {
                        console.log("CI Debug - HUB Script: Loaded")
                    }
                });

            } // End HUB script


            // Tracking script
            // should always be the LAST script in this list
            // if tracking is present in the scripts param
            if ( matches("tracking", scripts) ) {

                if ( matches("?custom-debug", url) ) {
                    console.log("CI Debug - TB Tracking Script: request detected")
                }

                // Run Script

                $.getScript( scriptPath + "library/tracking/tb-tracking.js", function() {
                    if ( matches("?custom-debug", url) ) {
                        console.log("CI Debug - TB Tracking Script: Loaded")
                    }
                });

            } // End HUB script


        }

        // If there are css parameters
        // This will likely be font libraries 
        if( css ) {
            alert("css parameters found")
        }




    } else {
        console.error("CI Debug - Error: Script tag is missing ID of js-custom-imports")
    } // end of $('#js-custom-imports').exists()

} // End of customImports function