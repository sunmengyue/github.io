var circles = d3.selectAll(".dot");
circles.style("fill", "steelblue");
circles.attr("r", 30);
circles.attr("cx", function() {
    return Math.random() * 720;
})

//binding data
circles.data([32, 57, 112]);
circles.attr('r', function(d){
    return Math.sqrt(d);
})