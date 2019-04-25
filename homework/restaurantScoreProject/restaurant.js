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
            .attr("class", "tooltip")
            
    /*Create nest by business name*/    
    var businessByName = d3.nest()
        .key(function(d){return d.business_id})
        .entries(filteredData); 
    console.log(businessByName);

    /*Create linear scale for dot color*/
    var colorScale = d3.scaleLinear()
        .domain([1, 3])
        .range(['#3399FF',  '#FF3333']);

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
            d3.select(this)
                .style("opacity", 1)
            div.transition()        
                .duration(200)      
                .style("opacity", 0.8);

        /*Add a function to transfer risk score to risk */
            function calcRisk (d) {
                var avg = d3.mean(d.values, function(dataPoint) {
                    return dataPoint.riskCatScore});
                if (1 <= avg && avg < 1.5) {return "Low" + "(" + d3.format(".1f")(avg) + ")"; }  
                else if (1.5 <= avg && avg < 2) {return "Moderate" + "(" + d3.format(".1f")(avg) + ")";}
                else {return "High" + "(" + d3.format(".1f")(avg) + ")";}
            }
               div.html("<h2 style = 'padding: 5px'>" + "<center>" + "<i>" + d.values[0].business_name + "</i>" + "</center>" + "</h2>" + 
                    "<h3 style = 'padding: 5px'>" + "Average Risk: " + calcRisk(d) 
                        + "</h3>" +
                    "<h4 style = 'padding: 5px'>" + "Address: " + d.values[0].business_address  + ", " +
                    "CA" + d.values[0].business_postal_code  + 
                    // "<h4>" + "Business Phone Number: " + d.values[0].business_phone_number + "</h4>" +
                    "<h4 style = 'padding: 5px'>" + "Violation Example: " + d.values[0].violation_description + "</h4>" )
               .style("left", (d3.event.pageX + 5) + "px")     
               .style("top", (d3.event.pageY - 5 ) + "px");    
        })   
        .on("mouseout", function(d) { 
            d3.select(this)
              .style("opacity", 0.5)   
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
          r = restaurants
            .transition()
            .duration(800)
            .attr("r", 0.7);                
                         
        } else {
          x = width / 2;                      
          y = height / 2;
          zoomLevel = 1;
          centered = null;
          r = restaurants.transition()
                         .duration(800)
                         .attr("r", 3)                  
        }
        //Selected neighbouthood will be centered
        svg.selectAll("path")
            .classed("selected", centered && function(d) { return d === centered; });
      
        svg.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + zoomLevel + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / zoomLevel + "px");
      }


}

