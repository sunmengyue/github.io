var width = window.innerWidth;
var height = 600;

var svg = d3.select("#map")
            .append("svg")
            .attr("height", height)
            .attr("weight", width)
            .append("g");


/* Read in data */
d3.queue()
.defer(d3.csv, "restaurant.csv")
.defer(d3.json, "sf.json")
.await(ready);

/* Create a new projection */
var projection = d3.geoAlbers()
    .translate([width, height])
    .scale(200);

/* Create a path*/
var path = d3.geoPath()
    .projection(projection);

    
function ready(error, data) {
    //topojson transform
    console.log(data);
    var neighborhoods = topojson.feature(data, data.objects.SFFind_Neighborhoods).features;
    console.log(neighborhoods);

/* Add a path for each neighborhood */
    svg.selectAll(".neighborhood")
        .data(neighborhoods)
        .enter().append("path")
        .attr("class", "neighborhood")
        .attr("d", path)
        .on("mouseover", function(d) {
            d3.select(this).classed('selected', true)
        })
        .on("mouseout", function(d) {
            d3.select(this).classed('selected', false)
        })


}

