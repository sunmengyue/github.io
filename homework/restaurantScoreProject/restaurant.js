var width = window.innerWidth;
var height = 800;

var svg = d3.select("#map")
            .attr("height", height)
            .attr("weight", width) 
            .append("g");


/* Read in data */
d3.queue() 
.defer(d3.csv, "SF.csv")
.defer(d3.json, "sf.json")
.awaitAll(ready);


function ready(error, dataArray) {

    //topojson transform
    var neighborhoods = topojson.feature(dataArray[1], dataArray[1].objects.SFFind_Neighborhoods);

    var projection = d3.geoAlbers()
    .fitSize([width, height], neighborhoods);
   
    /* Create a path*/
    var path = d3.geoPath()
    .projection(projection);

    /* Add a path for each neighborhood */
    svg.selectAll(".neighborhood") 
        .data(neighborhoods.features)
        .enter().append("path")
        .attr("class", "neighborhood")
        .attr("d", path)
        .on("mouseover", function(d) {
            d3.select(this).classed('selected', true)
        })
        .on("mouseout", function(d) {
            d3.select(this).classed('selected', false)
        })
    
    /* Add restaurants
    get x/y from the lat/long projection
    */
    //transform numeric data to its format
    dataArray[0].forEach(function (d) {
        d.business_id = +d.business_id;
        d.business_latitude = +d.business_latitude;
        d.business_longitude = +d.business_longitude;
        d.business_postal_code = +d.business_postal_code;
        d.inspection_score = +d.inspection_score;
    });
   
    //Put each restaurant as dot on the map
    svg.selectAll(".restaurant-circle")
    .data(dataArray[0])
    .enter().append("circle")
    .attr("r", 2)
    .attr("cx", function(d){
        var coords = projection([d.business_latitude, d.business_longitude]);
        return coords[0];
    }) 
    .attr("cx", function(d){
        var coords = projection([d.business_latitude, d.business_longitude]);
        return coords[1];
    });


}

