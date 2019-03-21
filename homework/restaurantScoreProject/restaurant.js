var width = window.innerWidth;
var height = 800;

var svg = d3.select("#map")
            .attr("height", height)
            .attr("weight", width) 
            .append("g");


/* Read in data */
d3.queue()
.defer(d3.json, "sf.geojson")
.defer(d3.csv, "restaurant.csv")
.defer(d3.json, "sf.json")
.awaitAll(ready);

function ready(error, dataArray) {
    console.log(dataArray[1]);
    //topojson transform
    var neighborhoods = topojson.feature(dataArray[2], dataArray[2].objects.SFFind_Neighborhoods);

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

// svg.selectAll(".restaurant-circle")
//     .data(dataArray[0])	        
//     .enter().append("circle")	        
//     .attr("r", 2)	        
//     .attr("cx", function(d){	        
//         var coords = projection([d.business_latitude, d.business_longitude]);	            
//         return coords[0];	            
//     }) 	    
//     .attr("cx", function(d){	        
//         var coords = projection([d.business_latitude, d.business_longitude]);	            
//         return coords[1];	            

// Append Div for tooltip to SVG
    var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
            .style("opacity", 0);

//Create dots and attach tool tips

    var restaurants = svg.selectAll("circle")
        .data(dataArray[1]);
        restaurants.enter().append("circle")
        .attr("transform", function(d) {
        return "translate(" + projection([ d.business_longitude, d.business_latitude]) + ")";
    })
        .attr("r", 5)
        .attr("fill", "cornflowerblue")
        .style("opacity", .4)
        .on("mouseover", function(d) {      
            div.transition()        
                 .duration(200)      
               .style("opacity", .9);      
               div.text(d.business_name)
               .style("left", (d3.event.pageX) + "px")     
               .style("top", (d3.event.pageY - 28) + "px");    
        })   
        .on("mouseout", function(d) {       
            div.transition()        
               .duration(500)      
               .style("opacity", 0);   
        });
    
 



}




