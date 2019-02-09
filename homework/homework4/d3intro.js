var addData = [40, 50, 60, 70];
var removeData = [30, 50];

 function toggle(dataArr) {
     //remove square
     d3.selectAll('svg')
     .selectAll('rect')
     .data(dataArr)
     .exit().remove();

    //Add a sqaure
        d3.selectAll('svg')
            .selectAll('rect')
            .data(dataArr).enter().append('rect')
            .attr('x', 180)
            .attr('y', 210)
            .style('fill', 'orange')
            .attr('width', 30)
            .attr('height', 30);  

 }

document.querySelector('#firstBtn').addEventListener('click', toggle(addData));
document.querySelector('#thirdBtn').addEventListener('click', toggle(removeData));
