var margin = {top: 50, left: 50, bottom: 50, right: 50},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

var svg = d3.select("#map")
            .append("svg")
            .attr("height", height + margin.top + margin.bottom)
            .attr("weight", width + margin.left + margin.right)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* Read in data */
d3.queue()
.defer(d3.json, "world.json")
.await(ready);

/* Create a new projection using Macator (geoMacator)
    and center it (translate)
    and zoom it in a certain scale (scale)
*/
var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(100);

/* Create a path (geopath)
    using the projection
*/
var path = d3.geoPath()
    .projection(projection);

function ready(error, data) {
    /* topojson.feature converts the raw geodata into usable geodata,
    pass the data, data.objects_somthing_
    then get.features out of it 
    */
  
    var countries = topojson.feature(data, data.objects.countries).features;
    console.log(countries);

    /* Add a path for each country */
    svg.selectAll(".country")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .on("mouseover", function(d) {
            d3.select(this).classed('selected', true)
        })
        .on("mouseout", function(d) {
            d3.select(this).classed('selected', false)
        })


}

