//
// This script will contain several different charts and be apart of the custom-imports script
//

// Pie and Donut Chart

/*** Features and Data Attributes ***
* Radius: data-outer-radius(number), data-inner-radius(number)
* Tooltip: data-label(text) on span tags
* Animation: data-fade-in(true)
* Stroke: data-stroke(true), data-stroke-width(number), data-stroke-color(hex color)
* Center Image: data-center-image(url)
* Hover Effect: data-hover-effect(true)
*****************/

// Global Function
function ratioForPadding(width, height) {
    var ratio = Math.round((height / width) * 100);
    var precent = ratio + '%';
    return precent;
}


// Custom events

// Script has been Initialized
// Once the graph is built then it will trigger this event, which will allow 3rd party scripts like sliders to wait
// until this event is fired. To use this you would wrap the 3rd party script in $(document).on('ciChartInitialized', function () { });
var ciChartInitialized = new CustomEvent('ciChartInitialized');

// Animation event when you dispatch this event it will run the animation on the chart
// To run the event: elem.dispatchEvent('ciAnimateGraph');
var ciAnimateGraph = new CustomEvent('ciAnimateGraph');


if ( $('.js-ci-pie-chart__legend').exists() && $('.js-ci-pie-chart__graph').exists() ) {

    $('.js-ci-pie-chart__legend').each(function() {

        var chartNumber = $(this).attr('data-chart');

        var pieChartLegend = $('.js-ci-pie-chart__legend[data-chart="'+ chartNumber + '"]');
        var pieChartData = $('.js-ci-pie-chart__legend[data-chart="'+ chartNumber + '"] .js-ci-pie-chart__data');
        var pieChartHolder = '.js-ci-pie-chart__graph[data-chart="'+ chartNumber + '"]';
        var pieChartGraph = '.js-ci-pie-chart__graph[data-chart="'+ chartNumber + '"] .js-ci-pie-chart__svg-wrap';

        var width = pieChartLegend.attr('data-width');
        var height = pieChartLegend.attr('data-height');

        var outerRadius = pieChartLegend.attr('data-outer-radius');
        var innerRadius = pieChartLegend.attr('data-inner-radius');

        var centerImage = pieChartLegend.attr('data-center-image');
        var imageScale = parseFloat( pieChartLegend.attr('data-center-image-scale') ) != NaN && parseFloat( pieChartLegend.attr('data-center-image-scale') ) <= 1 ? pieChartLegend.attr('data-center-image-scale') : 1;

        var animateGraph = pieChartLegend.attr('data-animate') == 'true' ? true : false;
        var animateGraphType = pieChartLegend.attr('data-animate-type');
        var animateDuration = pieChartLegend.attr('data-animate-duration') != undefined ? pieChartLegend.attr('data-animate-duration') : 400;
        var animateDelay= pieChartLegend.attr('data-animate-delay') != undefined ? pieChartLegend.attr('data-animate-delay') : 400;
        var animateLegend = pieChartLegend.attr('data-animate-legend') == 'true' ? true : false;
        var animateLegendType = pieChartLegend.attr('data-animate-legend-type') != undefined ? pieChartLegend.attr('data-animate-legend-type') : 'fadein';

        var hoverEffect = pieChartLegend.attr('data-hover-effect') == 'true' ? true : false;

        var stroke = pieChartLegend.attr('data-stroke') == 'true' ? true : false;
        var strokeWidth = 0;
        var strokeColor = "#fff";

        var tooltip = pieChartLegend.attr('data-tooltip') == 'true' ? true : false;

        var icons = pieChartLegend.attr('data-icons') == 'true' ? true : false;

        var ratioPadding = pieChartLegend.attr('data-ratio-padding') == 'true' ? true : false;


        if(icons) {
            pieChartData.each(function () {
                if ( matches("?custom-debug", url) ) {
                    console.log( 'CI Debug - Donut/Pie Chart ' + chartNumber + ' label ' + $(this).attr('data-label')  + ' Data Color: ' + $(this).attr('data-color') )
                }
                var color = $(this).attr('data-color');

                // check to see if a custom icon is already added and if not prepend the icon
                if( $(this).find('.js-ci-pie-chart__data-icon').length <= 0 ) {
                    $(this).prepend('<span class="js-ci-pie-chart__data-icon"></span>')
                }

                $(this).find('.js-ci-pie-chart__data-icon')
                .css("background-color", color ).css("color", color );
            })
        }

        if(stroke) {
            strokeWidth = pieChartLegend.attr('data-stroke-width');
            strokeColor = pieChartLegend.attr('data-stroke-color');
        }

        // Debug report of what is in the variables
        if ( matches("?custom-debug", url) ) {
            console.log("CI Debug - Donut/Pie Chart chartNumber: " + chartNumber)
            console.log("CI Debug - Donut/Pie Chart pieChartLegend:")
            console.log(pieChartLegend)
            console.log("CI Debug - Donut/Pie Chart pieChartData:")
            console.log(pieChartData)
            console.log("CI Debug - Donut/Pie Chart pieChartHolder: "+ pieChartHolder)

            // console.log("CI Debug - Donut/Pie Chart param: " + noDepends)
        }

        $(pieChartHolder).append('<div class="js-ci-pie-chart__svg-wrap"></div>');


        var svg = d3.select(pieChartGraph) // Select our svg wrap
        .append('svg') // add SVG into it
        .attr('class', 'js-ci-pie-chart__svg')
        .attr('aria-hidden', 'true') // SVG simply a repeat of list, so not really needed by assistive tech
        .attr('preserveAspectRatio', 'xMinYMin meet') // making sure the svg is responsive
        .attr('viewBox', '0 0 ' + width + ' ' + height ) // set defined width and height
        .append('g') // create our group element to put our arcs in.
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        if( ratioPadding ) {
            if ( matches("?custom-debug", url) ) {
                console.log('CI Debug - Donut/Pie Chart Padding Ratio: ' + ratioForPadding(width, height));
            }
            $(pieChartGraph).css('padding-top', ratioForPadding(width, height))
        }


        var arc = d3.arc() // create arc
        .outerRadius(outerRadius) // set outer radius
        .innerRadius(innerRadius); //set inner radius

        //  Convert Legend Attributes to useable Pie Data
        var legendToPie = d3.pie()
        .value(function(d){ return $(d).attr('data-value') }) // Get values for each span we created and return it
        .sort(null) // Sort

        // Add center image
        if(centerImage){
            var imageGroup = svg.append('g');
            imageGroup.append('defs')
            .append('clipPath')
            .attr('id','centerimage')
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', innerRadius)
            .attr('fill',"#FFFFFF")
            imageGroup.append('image')
            .attr('x',(innerRadius)* -1)
            .attr('y',(innerRadius) * -1)
            .attr('width', innerRadius * 2)
            .attr('height', innerRadius * 2)
            .attr('xlink:href',centerImage)
            .attr('clip-path','url(#centerimage)')
            .attr('class','ci-pie-chart__center-img')
            .attr('transform', 'scale(' + imageScale + ')')
        }

        // Variable needed to store data for comparison such as for tweening animations
        var previousData = d3.local();

        // Inital Chart creation
        var paths = svg.selectAll('path') // Create virtual path element
        .data(legendToPie(pieChartData))
        .enter()
        .append('path') // Adds path
        .attr('d', arc) // Adds path points of arc created earlier
        .each(function(d) { previousData.set(this, d) }) // Setting current data in local variable
        .attr('fill', function(d,i){ return $(d.data).attr('data-color'); }) // Get the color attribute from each span and applying themn to the paths

        // Stroke  set in legend
        if(stroke){
            paths.attr('stroke', strokeColor)
            .attr('stroke-width',strokeWidth);
        }

        // Animate the Graph or Legend
        if(animateGraph || animateLegend) {
            $(pieChartHolder).on('ciAnimateGraph', function (e) {

                if ( matches("?custom-debug", url) ) {
                    console.log("CI Debug - Donut/Pie Chart: Event Fired")
                }


                // Getting updated variables incanse they have changed
                animateGraph = pieChartLegend.attr('data-animate') == 'true' ? true : false;
                animateGraphType = pieChartLegend.attr('data-animate-type');
                animateDuration = pieChartLegend.attr('data-animate-duration') != undefined ? pieChartLegend.attr('data-animate-duration') : 400;
                animateDelay= pieChartLegend.attr('data-animate-delay') != undefined ? pieChartLegend.attr('data-animate-delay') : 400;
                animateLegend = pieChartLegend.attr('data-animate-legend') == 'true' ? true : false;
                animateLegendType = pieChartLegend.attr('data-animate-legend-type') != undefined ? pieChartLegend.attr('data-animate-legend-type') : 'fadein';

                // Function for updating chart data
                function updatingData(chartNumber) {

                    // Resetting Data Variable so that it actually updates
                    data = "";
                    data = $('.js-ci-pie-chart__legend[data-chart="'+ chartNumber + '"] .js-ci-pie-chart__data');
                    numberOfslices = data.length - 1;


                    // Assigning new data to paths and creating new paths
                    svg.selectAll("path")
                    .data(legendToPie(data))
                    .enter()
                    .append("path")


                    // Deleting any extra paths that are not needed for the current ammount of data
                    svg.selectAll("path").each(function(d,i){
                        if ( i > numberOfslices ) {
                            return this.remove();
                        }
                    })
                }

                // Animation on the Graph
                if ( animateGraph ) {

                // only trigger the data updat if the chart is animated
                updatingData(chartNumber);

                // FadeIn Animation on the graph

                if ( matches("fadein", animateGraphType) ) {

                    var items = 0;

                    svg.selectAll("path") // Select all paths after updating data
                    .attr('fill', function(d,i){ return $(d.data).attr('data-color'); }) // Associating the correct path colors incase they have changed
                    .attr("d", arc) // Updating arcs in case they have changed
                    .style('opacity',0) // set opacity to 0, getting ready to animate
                    .transition() // enable transition
                    .duration(animateDuration) // set animateSpeed duration
                    .delay(function(d,i){return animateDelay * i }) // delay every path by animateDelay times how ever many items are before it
                    .style('opacity',1) // set opacity to 1 animated
                    .each(function(d,i){ return items += 1 });

                    d3.select( pieChartHolder + ' .ci-pie-chart__center-img')
                    .interrupt()
                    .style('opacity',0) // set opacity to 0, to animate
                    .transition() // enable transition
                    .duration(animateDuration) // set animateSpeed duration
                    .delay( animateDelay * items ) // delay every path by animateDelay times how ever many items are before it
                    .style('opacity',1); // set opacity to 1 animated

                }  // END FadeIn Anaimation on the graph

                // Pie Filling Anaimtion on the graph

                else if ( matches("pie-filling", animateGraphType) ) {


                    // checking variable on legend to see if we should tween between excisting arcs or not
                    tweeningBetweenData = $('.js-ci-pie-chart__legend[data-chart="'+ chartNumber + '"]').attr('data-tweening') == 'true' ? true : false;

                    // Animating between the angles that were there to the new angles
                    svg.selectAll("path").attr('fill', function(d,i){ return $(d.data).attr('data-color'); }).attr("d", arc).transition().duration(animateDuration).attrTween("d", function (d) {
                        // Default startinging and end is 0
                        var thisStart = 0;
                        var thisEnd = 0;

                        // We are replacing existing data we will use previous datat variable to get starting angles
                        if ( tweeningBetweenData ) {
                            if ( previousData.get(this) != undefined ) {
                                thisStart = previousData.get(this).startAngle;
                                thisEnd = previousData.get(this).endAngle;
                            } else {
                                thisStart =  d.startAngle;
                                thisEnd =  d.startAngle;
                            }
                        }


                        var start = {startAngle: thisStart, endAngle: thisEnd};
                        var interpolate = d3.interpolate(start, d);

                        // Sonce the math has been done for the tweening we can overwrite the previous data with the new data
                        previousData.set(this, d);
                        return function (t) {
                            return arc(interpolate(t));
                        }

                    })




                }// END Pie Filling Anaimtion on the graph



                } // END Animation on the Graph

                // Animation on the Legend

                if ( animateLegend ) {

                    // FadeIn Anaimation on the Legend

                    if ( matches("fadein", animateLegendType) ) {

                        var legendItems = 0;

                        d3.selectAll( '.js-ci-pie-chart__legend[data-chart="'+ chartNumber + '"] [data-animate-legend-item]' )
                        .each(function(d,i){
                            d3.select(this).interrupt()
                        .style('opacity',0) // set opacity to 0, to animate
                        .transition() // enable transition
                        .duration(animateDuration) // set animateSpeed duration
                        .delay( animateDelay * legendItems ) // delay every path by animateSpeed
                        .style('opacity',1) // set opacity to 1 animated
                        return legendItems += 1 });

                    }

                } // END Animation on the Legend

            }); // ENd Animation Event
        } // END ALL ANIMATIONS

        // Tooltip is set in legend
        if(tooltip) {
            donutChartTooltip(paths, hoverEffect)
        }

    }).promise().done( function(){ // Promise will wait for the loop to complete  // end loop for each legend

        $(document).trigger('ciChartInitialized');
        if ( matches("?custom-debug", url) ) {
            console.log('CI Debug - All charts have been initialized');
        }

    });

    // Donut Chart Tool Tip

    // Global Variables needed for the tool tip
    var windowWidth = $('body').innerWidth();

    var tooltipWindowWidthUpdate = ciDebounce(function() {
        // Update Window Size if device resizes
        windowWidth = $('body').innerWidth();
        if ( matches("?custom-debug", url) ) {
            console.log('CI Debug - Screen Width Update based on resize ' + windowWidth);
        }
        // Reset ToolTip
        resetChartTooltip();

    }, 250);

    $(window).on('resize', tooltipWindowWidthUpdate);

    // Create our tooltip
    // This is not apart of the donut chart tooltip as we may want to reuse this tooltip for other things
    d3.select("body") // Select page body
    .append("div") // Add div
    .attr("id", "js-ci-chart__tooltip") // Add tooltip id
    .style("position", "absolute") // set to absolute;
    .style("z-index", "100000") // Add crazy z-index
    .style('pointer-events','none') // get rid of pointer events on tooltip
    .style('visibility','hidden') // Set to invisible
    .style('left', "-10000px") // set left
    .style('top', "0px") // set top

    // Lighten or Darken Color
    function LightenDarkenColor(col, amt) {
        var usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
        var num = parseInt(col,16);
        var r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if  (r < 0) r = 0;
        var b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if  (b < 0) b = 0;
        var g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;

        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
    }

    // Tool tip variable needed for function
    var chartToolTip = d3.select("#js-ci-chart__tooltip");

    // Function for resetting the tooltip to be hidden
    function resetChartTooltip() {
        chartToolTip // Select tooltip
        .style('visibility','hidden') // Set to invisible
        .style('left', "-10000px") // set left
        .style('top', "0px") // set top
        .text(""); // Set text to blank

    }

    // Function for placing the tooltip on the donut chart
    function donutChartTooltip(paths, hoverEffect) {

        paths.on('mousemove',function(e,d,i){ // On mousemove over the paths
            if ( matches("?custom-debug", url) ) {
                console.log('Mouse move')
                console.log(e)
                console.log(d)
                console.log(i)
            }
            
            // Tooltip
            var toolTipText = $(d.data).attr('data-label'); // Get the tooltip label
            if( toolTipText != null && toolTipText != ""  ) {

                chartToolTip.html(toolTipText); // set tooltip text
                var tooltipX = e.pageX;
                var toolTipWidth = d3.select("#js-ci-chart__tooltip").node().getBoundingClientRect().width;
                var tooltipCenterPoint = parseInt(toolTipWidth / 2);


                if ( tooltipX < tooltipCenterPoint ) { // If the mouse x axis is left than the half of the tool tip, do not let go off screen
                    tooltipX = tooltipCenterPoint;
                } else if ( parseInt(tooltipX + tooltipCenterPoint) > windowWidth ) {

                    tooltipX = parseInt(windowWidth - tooltipCenterPoint);
                }


                // make tool tip visable and position it
                chartToolTip // Select tooltip
                .style('visibility','visible') // Set to visible
                .style('left', tooltipX + "px") // set left
                .style('top', e.pageY - 25 + "px") // set top
            }

            //Hover effect
            if(hoverEffect) {
                var originalColor = $(d.data).attr('data-color');
                var hoverColor = $(d.data).attr('data-hover-color');
                var darkenedColor = LightenDarkenColor(originalColor,50);
                if (hoverColor) {
                    $(this).attr('fill',hoverColor);
                } else {
                    $(this).attr('fill',darkenedColor);
                    if ( matches("?custom-debug", url) ) {
                        console.log('CI Debug - Charts Hover Status: Missing hoverColor')
                    }
                }
            }

        });

        paths.on('mouseout', function(e,d,i){ // on mouseout
            d3.select("#js-ci-chart__tooltip").style('visibility','hidden'); // hide tooltip

            // reset hover effect color
            if(hoverEffect) {
                var originalColor = $(d.data).attr('data-color');
                $(this).attr('fill',originalColor);
            }
        })
    }

} else { // End of if ( $('.js-ci-pie-chart__legend').exists() && $('.js-ci-pie-chart__graph').exists() )
    if ( matches("?custom-debug", url) ) {
        console.error("CI Debug - Charts: Chart script is loading but Missing js-ci-pie-chart__legend or js-ci-pie-chart__graph class on the page");
    }
}