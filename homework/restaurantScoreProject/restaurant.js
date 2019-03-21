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
   var points = [
    {"name": "MARTHA & BROS. COFFEE CO", "coords":  [-122.426856,37.745974 ]},
    {"name": "KABABAYAN FAST FOOD", "coords": [ -122.46779,37.711185 ]},
    {"name": "The Little Chihuahua Mexican Restaurant", "coords": [ -122.421803,37.764744 ]},
    {"name": "Extreme Pizza", "coords": [ -122.421736,37.763664 ]},
    {"name": "ARINELL PIZZA", "coords": [ -122.460205,37.724778 ]},
    {"name": "JAVA ON OCEAN", "coords": [ -122.45005,37.731523 ]},
    {"name": "SAFEWAY #759", "coords": [ -122.43789,37.795882 ]},
    {"name": "ST VINCENT DE PAUL", "coords": [ -122.475639,37.728497 ]},
    {"name": "Cocola", "coords": [ -122.418444,37.751587 ]},
    {"name": "EL NORTENO", "coords": [ -122.394673,37.779777 ]},
    {"name": "KOH SAMUI & THE MONKEY", "coords": [ -122.420273,37.744901 ]},
    {"name": "CLUB PUERTORRIQUENO OF SF INC", "coords": [ -122.503939,37.760454 ]},
    {"name": "Mango Medley", "coords": [ -122.473318,37.731746 ]},
    {"name": "Shabu House", "coords": [ -122.421363,37.743313 ]},
    {"name": "PIZZA HUT", "coords": [ -122.414757,37.738927 ]},
    {"name": "MARTHA & BROS COFFEE CO", "coords": [ -122.418576,37.753973 ]},
    {"name": "THAT'S IT MARKET", "coords": [  -122.431629,37.751413 ]},
    {"name": "STARBUCKS COFFEE", "coords": [ -122.422722,37.744122 ]},
]

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




