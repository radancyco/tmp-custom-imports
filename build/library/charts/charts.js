/*** Features and Data Attributes ***
* Radius: data-outer-radius(number), data-inner-radius(number)
* Tooltip: data-label(text) on span tags
* Animation: data-fade-in(true)
* Stroke: data-stroke(true), data-stroke-width(number), data-stroke-color(hex color)
* Center Image: data-center-image(url)
* Hover Effect: data-hover-effect(true)
*****************/


var pieChartLegend = $('.pie-chart-legend');
var pieChartData = $('.pie-chart-legend span');
var pieChartHolder = $('pie-chart-svg-wrap');

var width = pieChartLegend.data('width');
var height = pieChartLegend.data('height');

var outerRadius = pieChartLegend.data('outer-radius');
var innerRadius = pieChartLegend.data('inner-radius');

var centerText = pieChartLegend.data('center-text');
var centerImage = pieChartLegend.data('center-image');

var fadeIn = pieChartLegend.data('fade-in') == true ? true : false;

var hoverEffect = pieChartLegend.data('hover-effect') == true ? true : false;

var stroke = pieChartLegend.data('stroke') == true ? true : false;
var strokeWidth = 0;
var strokeColor = "#fff";

if(stroke) {
	strokeWidth = pieChartLegend.data('stroke-width');
  strokeColor = pieChartLegend.data('stroke-color');
}

var svg = d3.select('.pie-chart-svg-wrap') // Select our svg wrap
.append('svg') // add SVG into it
.attr('width', width) // Set defined width
.attr('height', height) // set defined height
.append('g') // create our group element to put our arcs in.
.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

var arc = d3.arc() // create arc
.outerRadius(outerRadius) // set outer radius
.innerRadius(innerRadius); //set inner radius

var pie = d3.pie()
.value(function(d){ return $(d).data('value') }) // Get values for each span we created and return it
.sort(null) // Sort

// Add center image
if(centerImage){
  svg.append('g')
  .append('foreignObject')
  .attr('x', innerRadius * -1)
  .attr('y', innerRadius * -1)
  .attr('width', innerRadius * 2)
  .attr('height', innerRadius * 2)
  .append('xhtml:div')
  .style('background','url(' + centerImage + ')')
  .style('background-size', 'cover')
  .style('width', '100%')
  .style('height', '100%')
  .style('border-radius', '50%')
  .style('box-sizing', 'border-box')
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

// Stroke
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

// Create our tooltip
d3.select("body") // Select page body
.append("div") // Add div
.attr("id", "tooltip") // Add tooltip id
.style("position", "absolute") // set to absolute;
.style("z-index", "100000") // Add crazy z-index
.style('pointer-events','none') // get rid of pointer events on tooltip
.style('visiblity','hidden') // Set to invisible
.text(""); // Set text to blank

paths.on('mousemove',function(d,i){ // On mousemove over the paths
	// Tooltip
  var toolTipText = $(d.data).data('label'); // Get the tooltip label
 	d3.select("#tooltip") // Select tooltip
  .style('visibility','visible') // Set to visibile
  .style('left', d3.event.pageX + "px") // set left
  .style('top',d3.event.pageY - 25 + "px") // set top
  .text(toolTipText) // set tooltip text
  
  //Hover effect
  if(hoverEffect) {
    var originalColor = $(d.data).data('color');
    var darkenedColor = LightenDarkenColor(originalColor,50);
    $(this).attr('fill',darkenedColor);
  }
  
});

paths.on('mouseout', function(d,i){ // on mouseout
	d3.select("#tooltip").style('visibility','hidden'); // hide tooltip
  
  // reset hover effect color
  if(hoverEffect) {
    var originalColor = $(d.data).data('color');
    $(this).attr('fill',originalColor);
  }
})


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
