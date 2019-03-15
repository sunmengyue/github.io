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

/* Create a new projection */
function ready(error, dataArray) {
    //topojson transform
    var neighborhoods = topojson.feature(dataArray[1], dataArray[1].objects.SFFind_Neighborhoods);
    console.log(neighborhoods);

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
    // console.log(dataArray[0]);
    // svg.selectAll(".restaurant-circle")
    // .data(dataArray[0])
    // .enter().append("circle")
    // .attr("r", 2)
    // .attr("cx", function(d){
    //     var coords = projection([d.business_latitude, d.business_longitude]);
    //     return coords[0];
    // })
    // .attr("cy", function(d){
    //     var coords = projection([d.business_latitude, d.business_longitude]);
    //     return coords[1];
    // })

}

