var width = 500,
    height = 700;

var svg = d3.select("#myMap")
                    .attr("width", width + "px")
                    .attr("height", height + "px");


/* Read in data */
d3.queue()
.defer(d3.json, "usa.json")
.await(ready);

/* Create a new projection */
var projection = d3.geoMercator()
    .translate([width, height])
    .scale(100);

/* Create a path (geopath)*/
var path = d3.geoPath()
    .projection(projection);

function ready(error, data) {
    var states = topojson.feature(data, data.objects.states).features;
    console.log(states);

    /* Add a path for each country */
    svg.selectAll(".state")
        .data(states)
        .enter().append("path")
        .attr("class", "state")
        .attr("d", path)
        .on("mouseover", function(d) {
            d3.select(this).classed('selected', true)
        })
        .on("mouseout", function(d) {
            d3.select(this).classed('selected', false)
        })


}

