var width = window.innerWidth;
var height = 800;

var svg = d3.select("#map")
            .attr("height", height)
            .attr("weight", width) 
            .append("g");


/* Read in data */
d3.queue()
.defer(d3.csv, "sfRestaurant.csv")
.defer(d3.json, "sf.json")
.awaitAll(ready);

function ready(error, dataArray) {
    //Transform string to number
    dataArray[0].forEach(function(d){
        d.riskCatScore = parseFloat(d.riskCatScore);
    })

    //topojson transform
    console.log( dataArray[1]);

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
    	            

// Append Div for tooltip to SVG
    var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
            .style("opacity", 0);
  

//Create nest by business name 
    var businessByName = d3.nest()
        .key(function(d){return d.business_id})
        .entries(dataArray[0]); 
    console.log(businessByName);

//Create linear scale for dot color
var colorScale = d3.scaleLinear()
    .domain([1, 3])
    .range(['#3399FF',  '#FF3333']);

//Create dots, attach tool tips, and assign linear scale 
    var restaurants = svg.selectAll("circle")
        .data(businessByName);
        restaurants.enter().append("circle")
        .attr("transform", function(d) {
        return "translate(" + projection([d.values[0].business_longitude, d.values[0].business_latitude]) + ")";
    })
        .attr("r", 5)
        .attr("fill", function(d){
            var avg = d3.mean([d.values[0].riskCatScore]);   
            return colorScale(avg);
        })
        .style("opacity", .6)
        .on("mouseover", function(d) {      
            div.transition()        
                 .duration(200)      
               .style("opacity", .9);      
               div.text(d.values[0].business_name + ': ' + d.values[0].risk_category + ' (' + d.values[0].inspection_score + ')')
               .style("left", (d3.event.pageX) + "px")     
               .style("top", (d3.event.pageY - 28) + "px");    
        })   
        .on("mouseout", function(d) {       
            div.transition()        
               .duration(500)      
               .style("opacity", 0);   
        });
    
 



}




