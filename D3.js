
var circles = d3.selectAll(".dot");
circles.style("fill", "steelblue");
circles.attr("r", 30);


//binding data
circles.data([32, 57, 112]);
circles.attr('r', function(d){
    return Math.sqrt(d);
})

circles.attr("cx", function(d, i) {
    return i * 100 + 30;
})


//Entering Elements
var svg = d3.select("svg");

var circle = svg.selectAll("circle")
    .data([32, 57, 112, 293]);

var circleEnter = circle.enter().append("circle");

circleEnter.attr("cy", 60);
circleEnter.attr("cx", function(d, i) { return i * 100 + 30; });
circleEnter.attr("r", function(d) { return Math.sqrt(d); });

var circle = svg.selectAll("circle").data([32, 57]);
circle.exit().remove;