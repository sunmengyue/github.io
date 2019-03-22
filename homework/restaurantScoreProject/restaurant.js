var width = window.innerWidth;
var height = 800;

var svg = d3.select("#map")
            .attr("height", height)
            .attr("weight", width) 
            .append("g");


/* Read in data */
d3.queue()
.defer(d3.csv, "restaurant.csv")
.defer(d3.json, "sf.json")
.awaitAll(ready);

function ready(error, dataArray) {
    console.log(dataArray[1]);
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

// Append Div for tooltip to SVG
    var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
            .style("opacity", 0);

//Create nest by business name
console.log(dataArray[0]);

var businessByName = d3.nest()
  .key(function(d) { return d.business_id; })
  .entries(dataArray[0]);

  console.log(businessByName);


//Create dots and attach tool tips
    var restaurants = svg.selectAll("circle")
        .data(businessByName);
        restaurants.enter().append("circle")
        .attr("transform", function(d) {
        return "translate(" + projection([d.values[0].business_longitude, d.values[0].business_latitude]) + ")";
    })
        .attr("r", 3)
        .attr("fill", "cornflowerblue")
        .style("opacity", .4)
        .on("mouseover", function(d) {      
            div.transition()        
                 .duration(200)      
               .style("opacity", .9);      
               div.text(d.values[0].business_name)
               .style("left", (d3.event.pageX) + "px")     
               .style("top", (d3.event.pageY - 28) + "px");    
        })   
        .on("mouseout", function(d) {       
            div.transition()        
               .duration(500)      
               .style("opacity", 0);   
        });
    
 



}




