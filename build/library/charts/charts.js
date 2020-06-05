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
var ciChartInitialized = new Event('ciChartInitialized');

// Animation event when you dispatch this event it will run the animation on the chart
// To run the event: elem.dispatchEvent('ciAnimateGraph');
var ciAnimateGraph = new Event('ciAnimateGraph');



//
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
        var animateLegendType = pieChartLegend.attr('data-animate-type-legend') != undefined ? pieChartLegend.attr('data-animate-type-legend') : 'fadein';

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

        var pie = d3.pie()
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

        var paths = svg.selectAll('path') // Create virtual path element
        .data(pie(pieChartData))
        .enter()
        .append('path') // Adds path
        .attr('d', arc) // Adds path points of arc created earlier
        .attr('fill', function(d,i){ return $(d.data).attr('data-color'); }); // Get the color attribute from each span

        // Stroke  set in legend
        if(stroke){
            paths.attr('stroke', strokeColor)
            .attr('stroke-width',strokeWidth);
        }


        // Fade-In is set in legend
        if(animateGraph) {


            $(pieChartHolder).on('ciAnimateGraph', function (e) {
                
                
                if ( matches("?custom-debug", url) ) {
                    console.log("CI Debug - Donut/Pie Chart: Event Fired")
                }
                
                if ( matches("fadein", animateGraphType) ) {

                    var items = 0;

                    paths.interrupt()
                    .style('opacity',0) // set opacity to 0, to animate
                    .transition() // enable transition
                    .duration(animateDuration) // set animateSpeed duration
                    .delay(function(d,i){return animateDelay * i }) // delay every path by 400
                    .style('opacity',1) // set opacity to 1 animated
                    .each(function(d,i){ return items += 1 });
                    
                    d3.select( pieChartHolder + ' .ci-pie-chart__center-img')
                    .interrupt()
                    .style('opacity',0) // set opacity to 0, to animate
                    .transition() // enable transition
                    .duration(animateDuration) // set animateSpeed duration
                    .delay( animateDelay * items ) // delay every path by animateSpeed
                    .style('opacity',1); // set opacity to 1 animated
                
                }
                
                if ( animateLegend ) {

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

                }
            });
            // TODO: Add more animations
        }

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

    $('body').on('resizestart', function () {
        // Reset ToolTip
        resetChartTooltip
    });

    $('body').on('resizeend', function () {
        // Update Window Size once done resizing
        windowWidth = $('body').innerWidth();
        console.log('width ' + windowWidth);
    });

    $(window).on('orientationchange', function () {
        setTimeout(function(){ 
            // Update Window Size if device orintation changes
            windowWidth = $('body').innerWidth();
            console.log('width orientationchange ' + windowWidth);
            // Reset ToolTip
            resetChartTooltip
        }, 300);
    });

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

        paths.on('mousemove',function(d,i){ // On mousemove over the paths
            if ( matches("?custom-debug", url) ) {
                console.log('Mouse move')
            }
            // Tooltip
            var toolTipText = $(d.data).attr('data-label'); // Get the tooltip label
            if( toolTipText != null && toolTipText != ""  ) {

                chartToolTip.html(toolTipText); // set tooltip text
                
                //
                var tooltipX = d3.event.pageX;
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
                .style('top',d3.event.pageY - 25 + "px") // set top
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

        paths.on('mouseout', function(d,i){ // on mouseout
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