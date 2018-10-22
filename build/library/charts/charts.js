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

function ratioForPadding(width, height) {
    var ratio = Math.round((height / width) * 100);
    var precent = ratio + '%';
    return precent;
}

if ( $('.js-ci-pie-chart__legend').exists() && $('.js-ci-pie-chart__graph').exists() ) { 

    $('.js-ci-pie-chart__legend').each(function() {

        var chartNumber = $(this).data('chart');

        var pieChartLegend = $('.js-ci-pie-chart__legend[data-chart="'+ chartNumber + '"]');
        var pieChartData = $('.js-ci-pie-chart__legend[data-chart="'+ chartNumber + '"] .js-ci-pie-chart__data');
        var pieChartHolder = '.js-ci-pie-chart__graph[data-chart="'+ chartNumber + '"]';
        var pieChartGraph = '.js-ci-pie-chart__graph[data-chart="'+ chartNumber + '"] .js-ci-pie-chart__svg-wrap';

        var width = pieChartLegend.data('width');
        var height = pieChartLegend.data('height');

        var outerRadius = pieChartLegend.data('outer-radius');
        var innerRadius = pieChartLegend.data('inner-radius');

        var centerImage = pieChartLegend.data('center-image');

        var fadeIn = pieChartLegend.data('fade-in') == true ? true : false;

        var hoverEffect = pieChartLegend.data('hover-effect') == true ? true : false;

        var stroke = pieChartLegend.data('stroke') == true ? true : false;
        var strokeWidth = 0;
        var strokeColor = "#fff";

        var tooltip = pieChartLegend.data('tooltip') == true ? true : false;

        var icons = pieChartLegend.data('icons') == true ? true : false;

        var ratioPadding = pieChartLegend.data('ratio-padding') == true ? true : false;


        if(icons) {
            pieChartData.each(function () {
                if ( matches("?custom-debug", url) ) {
                    console.log( 'CI Debug - Donut/Pie Chart ' + chartNumber + ' label ' + $(this).data('label')  + ' Data Color: ' + $(this).data('color') )
                }
                var color = $(this).data('color');

                console.log( 'THIS IS THE LENGTH ' + $(this).find('.js-ci-pie-chart__data-icon').length )

                // check to see if a custom icon is already added and if not prepend the icon
                if( $(this).find('.js-ci-pie-chart__data-icon').length <= 0 ) {
                    $(this).prepend('<span class="js-ci-pie-chart__data-icon"></span>')
                }

                $(this).find('.js-ci-pie-chart__data-icon')
                .css("background-color", color ).css("color", color );
            })
        }

        if(stroke) {
            strokeWidth = pieChartLegend.data('stroke-width');
            strokeColor = pieChartLegend.data('stroke-color');
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
        .value(function(d){ return $(d).data('value') }) // Get values for each span we created and return it
        .sort(null) // Sort

        // Add center image
        if(centerImage){
            var imageGroup = svg.append('g');
            imageGroup.append('defs')
            .append('clipPath')
            .attr('id','test')
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
            .attr('clip-path','url(#test)')
            .style('opacity', 0)
            .transition()
            .duration(500)
            .delay(function(d,i) { return 350 * pieChartData.length; })
            .style('opacity',1)
        }
  
        var paths = svg.selectAll('path') // Create virtual path element
        .data(pie(pieChartData))
        .enter()
        .append('path') // Adds path
        .attr('d', arc) // Adds path points of arc created earlier
        .attr('fill', function(d,i){ return $(d.data).data('color'); }); // Get the color attribute from each span

        // Stroke  set in legend
        if(stroke){
            paths.attr('stroke', strokeColor)
            .attr('stroke-width',strokeWidth);
        }


        // Fade-In is set in legend
        if(fadeIn) {
            paths.style('opacity',0) // set opacity to 0, to animate
            .transition() // enable transition
            .duration(400) // set 400 duration
            .delay(function(d,i){ return 400 * i }) // delay every path by 400
            .style('opacity',1); // set opacity to 1 animated
        }

         // Fade-In is set in legend
         if(tooltip) {
            donutChartTooltip(paths, hoverEffect) 
         }

    })

    function donutChartTooltip(paths, hoverEffect) {

        paths.on('mousemove',function(d,i){ // On mousemove over the paths
            console.log('Mouse move')
            // Tooltip
            var toolTipText = $(d.data).data('label'); // Get the tooltip label
            d3.select("#js-ci-chart__tooltip") // Select tooltip
            .style('visibility','visible') // Set to visibile
            .style('left', d3.event.pageX + "px") // set left
            .style('top',d3.event.pageY - 25 + "px") // set top
            .html(toolTipText) // set tooltip text
        
            //Hover effect
            if(hoverEffect) {
                var originalColor = $(d.data).data('color');
                var darkenedColor = LightenDarkenColor(originalColor,50);
                $(this).attr('fill',darkenedColor);
            }
        
        });

        paths.on('mouseout', function(d,i){ // on mouseout
            d3.select("#js-ci-chart__tooltip").style('visibility','hidden'); // hide tooltip
        
            // reset hover effect color
            if(hoverEffect) {
                var originalColor = $(d.data).data('color');
                $(this).attr('fill',originalColor);
            }
        })
    }

    // Create our tooltip
    // This is not apart of the donut chart tooltip as we may want to reuse this tooltip for other things
    d3.select("body") // Select page body
    .append("div") // Add div
    .attr("id", "js-ci-chart__tooltip") // Add tooltip id
    .style("position", "absolute") // set to absolute;
    .style("z-index", "100000") // Add crazy z-index
    .style('pointer-events','none') // get rid of pointer events on tooltip
    .style('visiblity','hidden') // Set to invisible
    .text(""); // Set text to blank


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
} else {
    if ( matches("?custom-debug", url) ) {
        console.error("CI Debug - Charts: Chart script is loading but Missing js-ci-pie-chart__legend or js-ci-pie-chart__graph class on the page");
    }
}