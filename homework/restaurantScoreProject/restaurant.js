var width = window.innerWidth;
var height = 800;
var centered;

var svg = d3.select("#map")
            .attr("height", height)
            .attr("weight", width) 
            .append("g");


/* Read in data */
d3.queue()
.defer(d3.csv, "SFsRestaurant.csv")
.defer(d3.json, "sf.json")
.awaitAll(ready);

function ready(error, dataArray) {
    //Transform string to numberand delete missing number
    console.log(dataArray[0]);
    var filteredData = dataArray[0].filter(function(d){
        return d.riskCatScore !== "NA" && d.business_longitude !== "NA";
    });
    filteredData.forEach(function(d){
        d.riskCatScore = parseFloat(d.riskCatScore);
    })

    //topojson transform
    console.log( dataArray[1]);

    var neighborhoods = topojson.feature(dataArray[1], dataArray[1].objects.SFFind_Neighborhoods);

    var projection = d3.geoAlbers()
    .fitSize([width, height], neighborhoods);
   
    var path = d3.geoPath()
    .projection(projection);

    /* Create the neighborhood */
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
        .on("click", clicked);
    	            

    /*Append Div for tooltip to SVG*/
    var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip");               
           
    /*Create nest by business name*/    
    var businessByName = d3.nest()
        .key(function(d){return d.business_id})
        .entries(filteredData); 
    console.log(businessByName);

    /*Create linear scale for dot color*/
    var colorScale = d3.scaleLinear()
        .domain([1, 3])
        .range(['#3399FF',  '#FF3333']);
    /*Create a legend */
    var legend = d3.select("#legend")
    .append("g");
    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = legend.append("linearGradient")
    .attr("id", "linear-gradient"); 

    //Define the direction of the gradient: Horizontal
    linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

    //Set the color for the start (0%)
    linearGradient.selectAll("stop")
    .data(colorScale.range())
    .enter().append("stop")
    .attr("offset", function(d,i) { return i/(colorScale.range().length-1); })
    .attr("stop-color", function(d) { return d; });

    legend.append("rect")
    .attr("width", 170)
    .attr("height", 20)
    .style("fill", "url(#linear-gradient)");

    legend.append("text")
	.attr("class", "legendTitle")
	.attr("x", 0)
	.attr("y", -2)
	.text("Risk Levels of Restaurants");

    /*Create dots, attach tool tips, and assign linear scale*/
    var restaurants = svg.selectAll("circle")
        .data(businessByName)
        .enter().append("circle")
        .attr("transform", function(d) {
            return "translate(" + projection([d.values[0].business_longitude, d.values[0].business_latitude]) + ")";
        })
        .attr("r", 3)
        .attr("fill", function(d){
            var avg = d3.mean(d.values, function(dataPoint) {
                return dataPoint.riskCatScore;
            });   
            return colorScale(avg);
        })
        .style("opacity", .4)
        .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
            .style("opacity", .9);

        /*Add a function to transfer risk score to risk */
            function calcRisk (d) {
                var avg = d3.mean(d.values, function(dataPoint) {
                    return dataPoint.riskCatScore});
                if (1 <= avg && avg < 1.5) {return "Low Risk"; }  
                else if (1.5 <= avg && avg < 2) {return "Moderate Risk";}
                else {return "High Risk";}
            }
               div.text(d.values[0].business_name) 
               .html("<h2>" + "<center>" + "<i>" + d.values[0].business_name + "</i>" + "</center>" + "</h2>" + 
                    "<h3>" + "Average Risk Level: " + calcRisk(d)
                        + "</h3>" +
                    "<h4>" + "Address: " + d.values[0].business_address  + ", " +
                    "CA" + d.values[0].business_postal_code  + 
                    // "<h4>" + "Business Phone Number: " + d.values[0].business_phone_number + "</h4>" +
                    "<h4>" + "Violation Description: " + d.values[0].violation_description + "</h4>" )
               .style("left", (d3.event.pageX) + "px")     
               .style("top", (d3.event.pageY - 28) + "px");    
        })   
        .on("mouseout", function(d) {       
            div.transition()        
               .duration(500)      
               .style("opacity", 0);   
        });

    /*Create a zoom in interaction*/
    function clicked(d) {
        var x, y, zoomLevel, r;
        
        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          zoomLevel = 5;
          centered = d;
          r = restaurants.attr("r", 1)
                         .transition()
                         .duration(3000);                
                         
        } else {
          x = width / 2;                      
          y = height / 2;
          zoomLevel = 1;
          centered = null;
          r = restaurants.attr("r", 4)
                         .transition()
                         .duration(3000);
          
        }
      
        //Selected neighbouthood will be centered
        svg.selectAll("path")
            .classed("selected", centered && function(d) { return d === centered; });
      
        svg.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / zoomLevel + "px");
      }

        // Experiment code
        //restaurants.transition()
        // .duration(750)
        // .attr("transform", "translate(" + r / 2 + "," + r / 2 + ")")
           
      

}

